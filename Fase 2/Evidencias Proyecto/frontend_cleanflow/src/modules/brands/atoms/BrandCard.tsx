import type { Marca } from '@models/product';

type Props = {
  marca: Marca;
};

export default function BrandCard({ marca }: Props) {
  return (
    <article className="transform hover:scale-[1.02] transition-transform duration-300 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{marca.nombreMarca}</h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">{marca.descripcionMarca || 'Sin descripción disponible.'}</p>
        </div>
      </div>
    </article>
  );
}
