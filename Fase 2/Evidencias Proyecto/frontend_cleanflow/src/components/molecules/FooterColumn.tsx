import type { FC } from 'react';
import { LinkAtom } from '../atoms/LinkAtom';

// Define la estructura de los enlaces
interface ColumnLink {
  label: string;
  href: string;
  icon?: string;
}

interface FooterColumnProps {
  title: string;
  links: ColumnLink[];
}

export const FooterColumn: FC<FooterColumnProps> = ({ title, links }) => {
  return (
    <div className="flex flex-col space-y-3">
      {/* Título de la columna (Encabezado) */}
      <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
      
      {/* Lista de enlaces usando el Átomo LinkAtom */}
      {links.map((link, index) => (
        <LinkAtom key={index} href={link.href} iconSrc={link.icon}>
          {link.label}
        </LinkAtom>
      ))}
    </div>
  );
};