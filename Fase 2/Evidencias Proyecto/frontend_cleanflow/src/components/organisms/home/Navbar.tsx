'use client'
import IconLogo from '@assets/icons/iconLogo.png';
import IconQuote from '@assets/icons/iconQuote.png';
import IconPhone from '@assets/icons/iconPhone.png';

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} 
from '@headlessui/react'
import {
    Bars3Icon,
    XMarkIcon,
    UserCircleIcon,
} 
from '@heroicons/react/24/outline'
import { ChevronDownIcon} from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom';
import { useAuth } from '@modules/auth/hooks/useAuth'; 
import { useAdminAuth } from '@modules/admin/context/AdminAuthContext'; 
import { useCart } from '@/modules/cart/context/CartContext';
import CartButton from '@/components/atoms/CartButton/CartButton';
import Toast from '@components/ui/Toast';

import { fetchCategories } from '@/modules/admin/categories/api/adminCategoryService';
import type { Categoria } from '@models/product';

const callsToAction = [
    { name: 'Cotiza con nosotros', href: '/cotizar', icon: IconQuote },
    { name: 'Contáctanos', href: '/contact', icon: IconPhone },
];

const adminNavLinks = [
    { name: 'Dashboard Admin', path: '/admin' },
];

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [showLogoutToast, setShowLogoutToast] = useState(false);

    const { items, toggleSidebar } = useCart();

    // ⭐ Estado para categorías dinámicas
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loadingCategorias, setLoadingCategorias] = useState(true);
    const [errorCategorias, setErrorCategorias] = useState<string | null>(null);

    // 👉 Cargar categorías al montar el componente
    useEffect(() => {
        async function loadCats() {
            try {
                const data = await fetchCategories();
                setCategorias(data);
            } catch (err) {
                setErrorCategorias("No se pudieron cargar las categorías");
                console.error(err);
            } finally {
                setLoadingCategorias(false);
            }
        }
        loadCats();
    }, []);

    const { isAuthenticated, logout, user, isLoading: isAuthLoading } = useAuth(); 
    const { isAdmin, isLoading: isAdminLoading } = useAdminAuth(); 

    if (isAuthLoading || isAdminLoading) {
        return (
            <header className="bg-[#405562] h-20 flex items-center justify-center">
                <span className="text-white text-sm">Cargando sesión...</span>
            </header>
        );
    }

    return (
        <header className="bg-[#405562]">
            {showLogoutToast && (
                <Toast
                    message="¡Hasta luego! Tu sesión ha sido cerrada."
                    type="success"
                    onClose={() => setShowLogoutToast(false)}
                    duration={2000}
                />
            )}
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5">
                        <img
                            alt="CleanFlow Logo"
                            src={IconLogo}
                            className="size-16 rounded-full" 
                        />
                    </Link>
                </div>
                
                {/* ====== NAV MÓVIL (BOTÓN) ====== */}
                <div className="flex items-center lg:hidden"> 
                    {isAuthenticated && (
                        <Link to={isAdmin ? '/admin/dashboard' : '/profile'} className="mr-2 p-2.5 text-white">
                            <UserCircleIcon aria-hidden="true" className="size-6" />
                        </Link>
                    )}

                    {/* Cart button móvil */}
                    <div className="mr-2">
                        <CartButton count={items.reduce((s, i) => s + i.quantity, 0)} onClick={toggleSidebar} />
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white" 
                    >
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>
                
                {/* ================= NAV DESKTOP ================= */}
                <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                    <Popover className="relative">

                        {/* Botón */}
                        <PopoverButton className="flex items-center gap-x-1 text-base font-semibold text-white">
                            Productos
                            <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-white" />
                        </PopoverButton>

                        {/* Panel */}
                        <PopoverPanel
                            transition
                            className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg outline-1 outline-gray-900/5"
                        >
                            <div className="p-4">

                                {/* ⭐⭐ TODOS LOS PRODUCTOS (sin icono) ⭐⭐ */}
                                <div className="group relative rounded-lg p-4 text-sm hover:bg-gray-50">
                                    <div>
                                        <Link
                                            to="/productos/todos"
                                            className="block font-semibold text-gray-900"
                                        >
                                            Todos los productos
                                            <span className="absolute inset-0" />
                                        </Link>
                                        <p className="mt-1 text-gray-700">Ver catálogo completo</p>
                                    </div>
                                </div>

                                {/* LOADING / ERROR CATEGORÍAS */}
                                {loadingCategorias && (
                                    <p className="text-center text-gray-600 py-4">Cargando categorías...</p>
                                )}

                                {errorCategorias && (
                                    <p className="text-center text-red-600 py-4">{errorCategorias}</p>
                                )}

                                {/* ⭐⭐ CATEGORÍAS DINÁMICAS ⭐⭐ */}
                                {!loadingCategorias && categorias.map((cat) => (
                                    <div
                                        key={cat.idCategoria}
                                        className="group relative rounded-lg p-4 text-sm hover:bg-gray-50"
                                    >
                                        <div>
                                            <Link 
                                                to={`/productos/categoria/${cat.idCategoria}`}
                                                className="block font-semibold text-gray-900"
                                            >
                                                {cat.nombreCategoria}
                                                <span className="absolute inset-0" />
                                            </Link>
                                            <p className="mt-1 text-gray-700">
                                                {cat.descripcionCategoria || "Productos relacionados"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* FOOTER PANEL */}
                            <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                                {callsToAction.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                                    >
                                        <img src={item.icon} className="size-5" alt="" />
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </PopoverPanel>
                    </Popover>

                    <Link to="/marcas" className="text-base font-semibold text-white">
                        Marcas
                    </Link>
                    
                    {/* ADMIN LINKS */}
                    {isAdmin && adminNavLinks.map(link => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-base font-semibold text-yellow-300 hover:text-white transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}

                </PopoverGroup>

                {/* PERFIL / LOGIN */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center space-x-4">
                    {/* Cart button escritorio */}
                    <div>
                        <CartButton count={items.reduce((s, i) => s + i.quantity, 0)} onClick={toggleSidebar} />
                    </div>
                    {isAuthenticated && (
                        <Link to={isAdmin ? '/admin/dashboard' : '/profile'} className="p-1 text-white hover:text-yellow-300">
                            <span className="text-base font-medium mr-2">{user?.nombreUsuario || 'Perfil'}</span>
                            <UserCircleIcon aria-hidden="true" className="size-7 inline-block" />
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <button 
                            onClick={() => {
                                logout();
                                setShowLogoutToast(true);
                            }}
                            className="text-base font-semibold text-white bg-red-600 px-3 py-1 rounded-full hover:bg-red-700 transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    ) : (
                        <Link to="/login" className="text-base font-semibold text-white">
                            Iniciar Sesión →
                        </Link>
                    )}
                </div>
            </nav>

            {/* ================= NAV MÓVIL ================= */}
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm">

                    {/* HEADER MOBILE */}
                    <div className="flex items-center justify-between">
                        <Link to="/" className="-m-1.5 p-1.5">
                            <img alt="Logo" src={IconLogo} className="h-8 w-auto" />
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>

                    {/* CONTENT MOBILE */}
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">

                                {/* ⭐ MOBILE CATEGORIES ⭐ */}
                                <Disclosure as="div" className="-mx-3">
                                    <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3 pl-3 text-base font-semibold text-gray-900 hover:bg-gray-50">
                                        Productos
                                        <ChevronDownIcon className="size-5 flex-none group-data-open:rotate-180" />
                                    </DisclosureButton>

                                    <DisclosurePanel className="mt-2 space-y-2">

                                        {/* ====== TODOS LOS PRODUCTOS (MÓVIL) ====== */}
                                        <DisclosureButton
                                            as={Link}
                                            to="/productos/todos"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block rounded-lg py-2 pr-3 pl-6 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                                        >
                                            Todos los productos
                                        </DisclosureButton>

                                        {/* LOADING / ERROR */}
                                        {loadingCategorias && (
                                            <p className="px-6 text-sm text-gray-600">Cargando...</p>
                                        )}

                                        {errorCategorias && (
                                            <p className="px-6 text-sm text-red-600">{errorCategorias}</p>
                                        )}

                                        {/* CATEGORÍAS DINÁMICAS */}
                                        {!loadingCategorias && categorias.map((cat) => (
                                            <DisclosureButton
                                                key={cat.idCategoria}
                                                as={Link}
                                                to={`/productos/categoria/${cat.idCategoria}`}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="block rounded-lg py-2 pr-3 pl-6 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                                            >
                                                {cat.nombreCategoria}
                                            </DisclosureButton>
                                        ))}
                                    </DisclosurePanel>
                                </Disclosure>

                                <Link to="/marcas" onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">
                                    Marcas
                                </Link>

                                {/* ADMIN LINKS MOBILE */}
                                {isAdmin && adminNavLinks.map(link => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-yellow-700 hover:bg-gray-50"
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                                {/* PERFIL MOBILE */}
                                {isAuthenticated && (
                                    <Link
                                        to={isAdmin ? '/admin/dashboard' : '/profile'}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                                    >
                                        <div className="flex items-center">
                                            <UserCircleIcon className="size-6 mr-2" />
                                            {user?.nombreUsuario || 'Mi Perfil'}
                                        </div>
                                    </Link>
                                )}
                            </div>

                            {/* LOGIN / LOGOUT MOBILE */}
                            <div className="py-6">
                                {isAuthenticated ? (
                                    <button
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                            setShowLogoutToast(true);
                                        }}
                                        className="-mx-3 block w-full text-left rounded-lg px-3 py-2.5 text-base font-semibold text-red-600 hover:bg-red-50"
                                    >
                                        Cerrar Sesión
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}
