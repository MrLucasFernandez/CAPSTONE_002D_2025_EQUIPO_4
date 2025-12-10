import { useNavigate } from "react-router-dom";
import FormBuilder from "@components/organisms/admin/FormBuilder";
import { useToast } from '@/components/ui/ToastContext';

export default function CreateBrandPage() {
    const navigate = useNavigate();
    const { addToast } = useToast();

    async function handleSubmit(data: any) {
        try {
            const res = await fetch("https://cleanflow-back-v0-1.onrender.com/marcas", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombreMarca: data.nombreMarca,
                    descripcionMarca: data.descripcionMarca || null,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Error al crear marca");
            }

            addToast('Marca creada correctamente.', 'success');
            navigate("/admin/marcas");
        } catch (error: any) {
            addToast(error.message || 'Error al crear marca', 'error');
        }
    }

    return (
        <div className="px-4 py-10">
            <FormBuilder
                title="Crear Marca"
                submitLabel="Crear Marca"
                onSubmit={handleSubmit}
                fields={[
                    { name: "nombreMarca", label: "Nombre de la marca", type: "text", required: true },
                    { name: "descripcionMarca", label: "Descripción", type: "textarea", required: false },
                ]}
                initialValues={{ nombreMarca: "", descripcionMarca: "" }}
            />
        </div>
    );
}
