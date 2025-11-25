import React from 'react';
import { useSearchParams } from 'react-router-dom';

const MercadoPagoSuccessPage: React.FC = () => {
	const [search] = useSearchParams();
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Pago exitoso</h1>
			<p className="mb-2">Gracias por tu compra. MercadoPago devolvió los siguientes parámetros:</p>
			<pre className="bg-gray-100 p-4 rounded">{JSON.stringify(Object.fromEntries(search.entries()), null, 2)}</pre>
		</div>
	);
};

export default MercadoPagoSuccessPage;
