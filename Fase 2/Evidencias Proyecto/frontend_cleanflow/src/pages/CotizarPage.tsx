import { useState } from "react";
import type { FormEvent } from "react";

export default function CotizarPage() {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // 🔥 Aquí luego integrarás tu backend o un servicio de correo
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1200);
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-14">
            
            <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-4">
                Cotiza con Nosotros
            </h1>

            <p className="text-center text-gray-600 mb-10">
                Si tienes una empresa o PYME en Chile y deseas cotizar nuestros productos, 
                completa el siguiente formulario y te responderemos a la brevedad.
            </p>

            {sent ? (
                <div className="bg-green-100 text-green-800 p-6 rounded-xl text-center shadow">
                    <h2 className="text-xl font-bold">¡Solicitud enviada!</h2>
                    <p className="mt-2">
                        Te contactaremos pronto al correo que indicaste.
                    </p>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
                >
                    {/* Datos Empresa */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-[#405562]">Datos de la Empresa</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Razón Social / Nombre Empresa
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#405562]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    RUT Empresa
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="12.345.678-9"
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#405562]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Teléfono de Contacto
                                </label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="+56 9 1234 5678"
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#405562]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#405562]"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Productos Solicitados */}
                    <div>
                        <h2 className="text-xl font-semibold mb-3 text-[#405562]">
                            Productos que deseas cotizar
                        </h2>
                        <textarea
                            required
                            rows={5}
                            placeholder="Especifica los productos, cantidades estimadas o tipo de consumo mensual..."
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#405562]"
                        ></textarea>
                    </div>

                    {/* Mensaje opcional */}
                    <div>
                        <h2 className="text-xl font-semibold mb-3 text-[#405562]">
                            Mensaje adicional (opcional)
                        </h2>
                        <textarea
                            rows={4}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#405562]"
                            placeholder="Información extra, solicitud de visita, acuerdos especiales, etc."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#405562] text-white py-3 rounded-lg font-semibold hover:bg-[#2f4150] transition disabled:opacity-60"
                    >
                        {loading ? "Enviando..." : "Enviar Solicitud de Cotización"}
                    </button>
                </form>
            )}
        </div>
    );
}
