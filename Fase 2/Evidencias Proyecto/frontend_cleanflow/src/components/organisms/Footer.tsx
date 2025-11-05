import type { FC } from 'react';
import { FooterColumn } from '../molecules/FooterColumn';
import IconFB from '@assets/icons/iconFB.png';
import IconIG from '@assets/icons/iconIG.png';
import IconWSP from '@assets/icons/iconWSP.png';
// Datos de ejemplo para las columnas
const FOOTER_LINKS = {
  redes: {
    title: 'Redes Sociales',
    links: [
      { label: 'Facebook', icon: IconFB,  href: '/#' },
      { label: 'Instagram', icon: IconIG, href: '/#' },
      { label: 'WhatsApp', icon: IconWSP, href: '/#' },
    ],
  },
  soporte: {
    title: 'Soporte',
    links: [
      { label: 'Contáctanos', href: '/contact' },
      { label: 'Cotiza con nosotros', href: '/#' },
    ],
  },
};

export const Footer: FC = () => {
  // Color Hexadecimal personalizado para el fondo, usando la sintaxis de corchetes de Tailwind: bg-[#20232a]
  return (
    <footer className="bg-[#20232a] text-white py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        
        {/* Sección Principal (Columnas de Enlaces) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-8 border-b border-gray-700">
          
          {/* Columna 1: Logo/Descripción */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-teal-400">Donde Don Gino</h2>
            <p className="text-gray-400 text-sm max-w-sm">
              Tu distribuidora de confianza. Encuentra productos de calidad y el mejor servicio en un solo lugar.
            </p>
          </div>
          
          {/* Columna 2: Links de la Empresa (Molécula) */}
          <FooterColumn {...FOOTER_LINKS.redes} />
          
          {/* Columna 3: Links de Soporte (Molécula) */}
          <FooterColumn {...FOOTER_LINKS.soporte} />

          {/* Puedes agregar más columnas aquí */}
        </div>

        {/* Sección Inferior (Derechos de Autor) */}
        <div className="pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Donde Don Gino. Todos los derechos reservados.
        </div>
        
      </div>
    </footer>
  );
};