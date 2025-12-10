import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/solid';

const MercadoPagoPendingPage: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
			<div className="text-center max-w-md">
				{/* Icono de pendiente */}
				<div className="flex justify-center mb-6">
					<ClockIcon className="w-24 h-24 text-amber-500" />
				</div>

				{/* Título principal */}
				<h1 className="text-4xl font-extrabold text-gray-900 mb-2">
					Pago pendiente
				</h1>

				{/* Subtítulo */}
				<p className="text-xl text-amber-600 font-semibold mb-6">
					Esperando confirmación
				</p>

				{/* Mensaje descriptivo */}
				<p className="text-gray-600 mb-8 text-lg">
					Tu pago está siendo procesado. Por favor, aguarda mientras confirmamos la transacción. Recibirás una notificación cuando se complete.
				</p>

				{/* Botones de acción */}
				<div className="flex flex-col gap-3">
					<button
						onClick={() => navigate('/carrito')}
						className="w-full px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition duration-200 shadow-md"
					>
						Volver al carrito
					</button>
					<button
						onClick={() => navigate('/')}
						className="w-full px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-200 shadow-md"
					>
						Volver al inicio
					</button>
				</div>
			</div>
		</div>
	);
};

export default MercadoPagoPendingPage;
