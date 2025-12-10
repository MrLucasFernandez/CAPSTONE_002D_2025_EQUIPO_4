import BrandCard from '../atoms/BrandCard';
import type { Marca } from '@models/product';

type Props = {
  marcas: Marca[];
};

export default function BrandsList({ marcas }: Props) {
  if (!marcas || marcas.length === 0) {
    return <p className="text-center text-gray-600">No hay marcas para mostrar.</p>;
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {marcas.map((m) => (
        <BrandCard key={m.idMarca} marca={m} />
      ))}
    </section>
  );
}
