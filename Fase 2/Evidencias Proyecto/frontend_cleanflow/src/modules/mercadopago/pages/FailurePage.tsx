import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircleIcon } from '@heroicons/react/24/solid';

const MercadoPagoFailurePage: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
			<div className="text-center max-w-md">
				{/* Icono de error */}
				<div className="flex justify-center mb-6">
					<XCircleIcon className="w-24 h-24 text-red-500" />
				</div>

				{/* Título principal */}
				<h1 className="text-4xl font-extrabold text-gray-900 mb-2">
					¡El pago no se completó!
				</h1>

				{/* Subtítulo */}
				<p className="text-xl text-red-600 font-semibold mb-6">
					Intenta de nuevo
				</p>

				{/* Mensaje descriptivo */}
				<p className="text-gray-600 mb-8 text-lg">
					Ocurrió un problema al procesar tu pago. Por favor, intenta nuevamente con otro método de pago o verifica tus datos.
				</p>

				{/* Botones de acción */}
				<div className="flex flex-col gap-3">
					<button
						onClick={() => navigate('/carrito')}
						className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200 shadow-md"
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

export default MercadoPagoFailurePage;
