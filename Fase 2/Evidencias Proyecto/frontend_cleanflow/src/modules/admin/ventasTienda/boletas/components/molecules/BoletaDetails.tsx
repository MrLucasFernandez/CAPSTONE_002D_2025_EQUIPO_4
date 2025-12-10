import { FormattedPrice } from '../atoms/FormattedPrice';

interface BoletaDetailsProps {
  subtotal: number;
  impuesto: number;
  total: number;
}

export function BoletaDetails({ subtotal, impuesto, total }: BoletaDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <span className="text-gray-600 font-medium">Subtotal</span>
        <FormattedPrice value={subtotal} size="md" />
      </div>
      
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <span className="text-gray-600 font-medium">Impuesto (IVA)</span>
        <FormattedPrice value={impuesto} size="md" />
      </div>
      
      <div className="flex justify-between items-center pt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
        <span className="text-gray-900 font-bold text-lg">Total</span>
        <FormattedPrice value={total} size="lg" bold gradient />
      </div>
    </div>
  );
}
