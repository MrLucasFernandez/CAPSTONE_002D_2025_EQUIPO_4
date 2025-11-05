import { Fragment, useState } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import {
  Bars3Icon,
  HomeIcon, 
  RectangleStackIcon, 
  UsersIcon, 
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Outlet, NavLink } from 'react-router-dom';
import IconLogo from '../../../assets/icons/iconLogo.png';

// links de navegación del admin
const navigation = [
  // Links de la administración
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Productos', href: '/admin/productos', icon: RectangleStackIcon },
  { name: 'Usuarios', href: '/admin/usuarios', icon: UsersIcon },
  // Separador o link externo a la aplicación principal
  { name: 'Regresar al Home', href: '/', icon: HomeIcon, external: true },
];

// Helper para aplicar clases condicionalmente
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Función de renderizado para no repetir código
  const renderNavLinks = () => (
    <ul role="list" className="-mx-2 space-y-1">
      {navigation.map((item) => (
        <li key={item.name}>
          <NavLink
            to={item.href}
            // 'end' se aplica solo a los enlaces internos del admin (no al Home '/')
            end={!item.external} 
            className={({ isActive }) =>
              classNames(
                // La clase 'isActive' solo se aplica si el link es activo Y NO es el link externo
                (isActive && !item.external) 
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
              )
            }
          >
            <item.icon className="size-6 shrink-0" aria-hidden="true" />
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
                  
                  {/* Contenido del Sidebar Móvil */}
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
                        <li>
                          {renderNavLinks()} {/* <--- Usamos la función aquí */}
                        </li>
                      </ul>
                    </nav>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>

        {/* --- Menú Lateral de Escritorio (Fijo) --- */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
                <img
                  className="h-8 w-auto"
                  src={IconLogo}
                  alt="CleanFlow Admin"
                />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  {renderNavLinks()} {/* <--- Y aquí también */}
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* --- Área de Contenido Principal --- */}
        <div className="lg:pl-72">
          {/* Barra superior (móvil) */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
            <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
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