import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@modules/auth/hooks/useAuth';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  total: number;
  // UI
  sidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'cleanflow_cart_v1';
const ANON_KEY = `${STORAGE_KEY}_anon`;

const getStorageKeyFor = (user: any) => (user ? `${STORAGE_KEY}_user_${user.idUsuario}` : ANON_KEY);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(getStorageKeyFor(null)); // default to anon on first render
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Persist current cart to the key for the current user (or anon)
  useEffect(() => {
    try {
      const key = getStorageKeyFor(user as any);
      localStorage.setItem(key, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items, user?.idUsuario]);

  // Previous user id ref to detect login/logout transitions
  const prevUserIdRef = React.useRef<number | null>(null);

  // Merge helper: combine two carts by id summing quantities and keeping price/title/image
  const mergeCarts = (base: CartItem[], extra: CartItem[]) => {
    const map = new Map<string, CartItem>();
    const push = (it: CartItem) => {
      const normalized: CartItem = { ...it, price: Math.round(it.price) };
      const existing = map.get(normalized.id);
      if (existing) {
        existing.quantity = existing.quantity + normalized.quantity;
      } else {
        map.set(normalized.id, { ...normalized });
      }
    };
    base.forEach(push);
    extra.forEach(push);
    return Array.from(map.values());
  };

  // When the authenticated user changes, handle three cases:
  // - logout (user becomes null): save current cart to previous user key, clear visible cart and anon
  // - login (prev null, user set): merge anon cart into user's stored cart, save under user key and clear anon
  // - user switch: persist current cart for previous user, then load/merge for new user
  useEffect(() => {
    try {
      const prevId = prevUserIdRef.current;
      const nextId = user?.idUsuario ?? null;

      // Logout or user cleared
      if (!nextId) {
        // If there was a previous user, persist their cart before clearing
        if (prevId) {
          try {
            const prevKey = `${STORAGE_KEY}_user_${prevId}`;
            localStorage.setItem(prevKey, JSON.stringify(items));
          } catch {}
        }

        // Clear visible cart and anon storage as requirement
        setItems([]);
        localStorage.setItem(ANON_KEY, JSON.stringify([]));
        prevUserIdRef.current = null;
        return;
      }

      // Login or user switch
      // Load stored user cart
      const userKey = `${STORAGE_KEY}_user_${nextId}`;
      const rawUser = localStorage.getItem(userKey);
      const userCart: CartItem[] = rawUser ? JSON.parse(rawUser) : [];

      // Load anon cart
      const rawAnon = localStorage.getItem(ANON_KEY);
      const anonCart: CartItem[] = rawAnon ? JSON.parse(rawAnon) : [];

      // If there is anon cart content, merge it into the user's cart.
      const merged = anonCart && anonCart.length > 0 ? mergeCarts(userCart, anonCart) : userCart;

      // Set visible cart to merged (or user cart if anon empty)
      setItems(merged);

      // Persist merged cart to user's key and clear anon
      try {
        localStorage.setItem(userKey, JSON.stringify(merged));
        localStorage.setItem(ANON_KEY, JSON.stringify([]));
      } catch {}

      prevUserIdRef.current = nextId;
    } catch {
      setItems([]);
    }
  }, [user?.idUsuario]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const normalized: CartItem = { ...item, price: Math.round(item.price) };
      const existing = prev.find((p) => p.id === normalized.id);
      if (existing) {
        return prev.map((p) => (p.id === normalized.id ? { ...p, quantity: p.quantity + normalized.quantity } : p));
      }
      return [...prev, normalized];
    });
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity } : p)).filter((p) => p.quantity > 0));
  };

  const clear = () => setItems([]);

  const total = items.reduce((s, it) => s + it.price * it.quantity, 0);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((s) => !s);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, total, sidebarOpen, openSidebar, closeSidebar, toggleSidebar }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export default CartContext;
