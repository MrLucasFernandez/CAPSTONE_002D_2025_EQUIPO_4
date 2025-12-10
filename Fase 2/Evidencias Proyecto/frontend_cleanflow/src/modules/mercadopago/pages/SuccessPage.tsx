import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const MercadoPagoSuccessPage: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
			<div className="text-center max-w-md">
				{/* Icono de éxito */}
				<div className="flex justify-center mb-6">
					<CheckCircleIcon className="w-24 h-24 text-emerald-500" />
				</div>

				{/* Título principal */}
				<h1 className="text-4xl font-extrabold text-gray-900 mb-2">
					¡Tu pago fue exitoso!
				</h1>

				{/* Subtítulo */}
				<p className="text-xl text-emerald-600 font-semibold mb-6">
					Gracias por tu compra
				</p>

				{/* Mensaje descriptivo */}
				<p className="text-gray-600 mb-8 text-lg">
					Tu pedido ha sido confirmado y procesado correctamente. Recibirás una confirmación por correo electrónico en breve.
				</p>

				{/* Botones de acción */}
				<div className="flex flex-col gap-3">
					<button
						onClick={() => navigate('/')}
						className="w-full px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition duration-200 shadow-md"
					>
						Volver al inicio
					</button>
					<button
						onClick={() => navigate('/productos/todos')}
						className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200 shadow-md"
					>
						Continuar comprando
					</button>
				</div>
			</div>
		</div>
	);
};

export default MercadoPagoSuccessPage;
