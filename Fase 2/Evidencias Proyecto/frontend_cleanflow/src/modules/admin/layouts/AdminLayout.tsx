import { Fragment, useState } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import {
  Bars3Icon,
  HomeIcon, 
  RectangleStackIcon, 
  UsersIcon, 
  ShoppingCartIcon,
  TagIcon,
  XMarkIcon,
  ArrowTurnUpLeftIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Outlet, NavLink } from 'react-router-dom';
import IconLogo from '@assets/icons/iconLogo.png';
import IconCategory from '@assets/icons/Category.png';

// links de navegación del admin
const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Productos', href: '/admin/productos', icon: RectangleStackIcon },
  { name: 'Usuarios', href: '/admin/usuarios', icon: UsersIcon },
  { name: 'Ventas', href: '/admin/ventas', icon: ShoppingCartIcon },
  { name: 'Marcas', href: '/admin/marcas', icon: TagIcon },
  { name: 'Categorias', href: '/admin/categorias', icon: IconCategory },
  { name: 'Mi Perfil', href: '/profile', icon: UserCircleIcon },
  { name: 'Regresar al Home', href: '/', icon: ArrowTurnUpLeftIcon, external: true },
];

// Helper
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderIcon = (icon: any) => {
  if (typeof icon === "string") {
    return (
      <img
        src={icon}
        alt=""
        className="size-6 shrink-0 object-contain"
      />
    );
  }

    // Si es un componente (HeroIcons)
    const IconComponent = icon;
    return <IconComponent className="size-6 shrink-0" aria-hidden="true" />;
  };


  // Render links
  const renderNavLinks = () => (
    <ul role="list" className="-mx-2 space-y-1">
      {navigation.map((item) => (
        <li key={item.name}>
          <NavLink
            to={item.href}
            end={!item.external}
            className={({ isActive }) =>
              classNames(
                (isActive && !item.external)
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
              )
            }
          >
            {renderIcon(item.icon)}
            {item.name}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div>
        <Transition show={sidebarOpen} as={Fragment}>
          <Dialog className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <TransitionChild
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </TransitionChild>

            <div className="fixed inset-0 flex">
              <TransitionChild
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <TransitionChild
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="size-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </TransitionChild>
                  
                  {/* Sidebar Móvil */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src={IconLogo}
                        alt="CleanFlow Admin"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>{renderNavLinks()}</li>
                      </ul>
                    </nav>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>

        {/* Sidebar Desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <img className="h-8 w-auto" src={IconLogo} alt="CleanFlow Admin" />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>{renderNavLinks()}</li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b bg-white px-4 shadow-sm lg:hidden">
            <button type="button" className="-m-2.5 p-2.5 text-gray-700" onClick={() => setSidebarOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="size-6" aria-hidden="true" />
            </button>
            <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
              Admin Dashboard
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
