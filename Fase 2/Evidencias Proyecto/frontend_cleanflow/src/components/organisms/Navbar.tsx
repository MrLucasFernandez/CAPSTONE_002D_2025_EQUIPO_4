'use client'
import IconLogo from '@assets/icons/iconLogo.png';
import IconWomen from '@assets/icons/iconWomen.png';
import IconPH from '@assets/icons/iconPH.png';
import IconToiletries from '@assets/icons/iconToiletries.png';
import IconDisinfection from '@assets/icons/iconDisinfection.png';
import IconCH from '@assets/icons/iconCH.png';
import IconAll from '@assets/icons/iconAll.png';
import IconQuote from '@assets/icons/iconQuote.png';
import IconPhone from '@assets/icons/iconPhone.png';

import { useState } from 'react'
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
    UserCircleIcon, // 🚨 IMPORTADO: Nuevo icono de usuario
} 
from '@heroicons/react/24/outline'
import { ChevronDownIcon} from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom';
import { SearchBar } from '../molecules/SearchBar';
import { useAdminAuth } from '../../modules/admin/hooks/useAdminAuth';

// --- DATOS DE NAVEGACIÓN ---
const products = [
    { name: 'Protección Femenina', description: 'Útiles de aseo femenino', href: '#', icon: IconWomen },
    { name: 'Higiene Personal', description: 'Utiles de higiene personal', href: '#', icon: IconPH },
    { name: 'Aseo del Hogar', description: 'Productos de limpieza para el hogar', href: '#', icon: IconToiletries },
    { name: 'Desinfección', description: 'Productos para desinfección', href: '#', icon: IconDisinfection },
    { name: 'Higiene Empresas', description: 'Productos de limpieza para Empresas', href: '#', icon: IconCH },
    { name: 'Todos los Productos', description: '', href: '#', icon: IconAll },
]
const callsToAction = [
    { name: 'Cotiza con nosotros', href: '#', icon: IconQuote },
    { name: 'Contáctanos', href: '#', icon: IconPhone },
]

const adminNavLinks = [
    { name: 'Dashboard Admin', path: '/admin' },
    { name: 'Gestión Productos', path: '/admin/productos' },
];
// ----------------------------


export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    
    const { user, isAuthenticated, logout } = useAdminAuth(); 
    const isAdmin = user?.role === 'admin';

    return (
        <header className="bg-[#405562]">
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img
                            alt="CleanFlow Logo"
                            src={IconLogo}
                            className="size-16 rounded-full" 
                        />
                    </Link>
                </div>
                
                {/* -------------------------------------------------- */}
                {/* 🚨 ÍCONOS DERECHOS (Móvil) */}
                {/* -------------------------------------------------- */}
                <div className="flex items-center lg:hidden"> 
                    
                    {/* 🚨 1. Ícono de Usuario (Visible si está Autenticado) */}
                    {isAuthenticated && (
                        <Link to={isAdmin ? '/admin' : '/profile'} className="mr-2 p-2.5 text-white">
                            <span className="sr-only">Perfil</span>
                            <UserCircleIcon aria-hidden="true" className="size-6" />
                        </Link>
                    )}

                    {/* 2. Botón de menú móvil (Burger) */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white" 
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>
                
                {/* ENLACES CENTRALES (Desktop) */}
                <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                    <Popover className="relative">
                        <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-white">
                            Productos
                            <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-white" />
                        </PopoverButton>

                        <PopoverPanel
                            transition
                            className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg outline-1 outline-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                        >
                            <div className="p-4">
                                {products.map((item) => (
                                    <div
                                        key={item.name}
                                        className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                                    >
                                        <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                            <img 
                                                src={item.icon} 
                                                alt={item.name} 
                                                className="size-6 object-cover"/>
                                        </div>
                                        <div className="flex-auto">
                                            <a href={item.href} className="block font-semibold text-gray-900">
                                                {item.name}
                                                <span className="absolute inset-0" />
                                            </a>
                                            <p className="mt-1 text-gray-800">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                                {callsToAction.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100"
                                    >
                                        <img src={item.icon} aria-hidden="true" alt="" className="size-5 flex-none text-gray-400" />
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </PopoverPanel>
                    </Popover>

                    <a href="#" className="text-sm/6 font-semibold text-white">
                        Marcas
                    </a>
                    
                    {/* ENLACES DE ADMINISTRADOR (Desktop) */}
                    {isAdmin && (
                        <>
                            {adminNavLinks.map(link => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-sm/6 font-semibold text-yellow-300 hover:text-white transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </>
                    )}

                    <div className="flex items-center">
                        <SearchBar />
                    </div>
                </PopoverGroup>
                
                {/* -------------------------------------------------- */}
                {/* LOGIN / LOGOUT (Desktop) */}
                {/* -------------------------------------------------- */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center space-x-4">
                    
                    {/* 🚨 3. Ícono de Usuario (Desktop, a la izquierda del botón de Log/Out) */}
                    {isAuthenticated && (
                        <Link to={isAdmin ? '/admin' : '/profile'} className="p-1 text-white hover:text-yellow-300">
                            <span className="sr-only">Perfil</span>
                            <UserCircleIcon aria-hidden="true" className="size-7" />
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <button 
                            onClick={logout} 
                            className="text-sm/6 font-semibold text-white bg-red-600 px-3 py-1 rounded-full hover:bg-red-700 transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    ) : (
                        <Link 
                            to="/login"
                            className="text-sm/6 font-semibold text-white"
                        >
                            Iniciar Sesión
                            <span aria-hidden="true" className="ml-1">&rarr;</span>
                        </Link>
                    )}
                </div>
            </nav>

            {/* -------------------------------------------------- */}
            {/* --- MENÚ MÓVIL (DialogPanel) --- */}
            {/* -------------------------------------------------- */}
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                alt=""
                                src={IconLogo}
                                className="h-8 w-auto"
                            />
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="flex items-center">
                            <SearchBar />
                        </div>
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                
                                {/* Dropdown Productos (Móvil) */}
                                <Disclosure as="div" className="-mx-3">
                                    <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                                        Productos
                                        <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180" />
                                    </DisclosureButton>
                                    <DisclosurePanel className="mt-2 space-y-2">
                                        {[...products].map((item) => (
                                            <DisclosureButton
                                                key={item.name}
                                                as={Link} 
                                                to={item.href}
                                                className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                                            >
                                                {item.name}
                                            </DisclosureButton>
                                        ))}
                                    </DisclosurePanel>
                                </Disclosure>

                                {/* Enlace Marcas (Móvil) */}
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    Marcas
                                </a>

                                {/* ENLACES DE ADMINISTRADOR (Móvil) */}
                                {isAdmin && (
                                    <>
                                        {adminNavLinks.map(link => (
                                            <Link
                                                key={link.name}
                                                to={link.path}
                                                onClick={() => setMobileMenuOpen(false)} 
                                                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-yellow-700 hover:bg-gray-50"
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </>
                                )}

                                {/* 🚨 Ícono de Usuario (Móvil, en el menú deslizable) */}
                                {isAuthenticated && (
                                    <Link
                                        to={isAdmin ? '/admin' : '/profile'}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                    >
                                        <div className="flex items-center">
                                            <UserCircleIcon className="size-6 mr-2" aria-hidden="true" />
                                            {user?.nombre || 'Mi Perfil'}
                                        </div>
                                    </Link>
                                )}
                            </div>
                            
                            {/* LOGIN / LOGOUT (Móvil) */}
                            <div className="py-6">
                                {isAuthenticated ? (
                                    <button
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false); 
                                        }}
                                        className="-mx-3 block w-full text-left rounded-lg px-3 py-2.5 text-base/7 font-semibold text-red-600 hover:bg-red-50"
                                    >
                                        Cerrar Sesión
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
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
