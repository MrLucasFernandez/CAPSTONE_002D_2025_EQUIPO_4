import { useNavigate } from "react-router-dom";
import FormBuilder from "@components/organisms/admin/FormBuilder";
import { useToast } from '@/components/ui/ToastContext';

export default function CreateCategoryPage() {
    const navigate = useNavigate();
    const { addToast } = useToast();

    async function handleSubmit(data: any) {
        try {
        const res = await fetch(
            "https://cleanflow-back-v0-1.onrender.com/categorias",
            {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombreCategoria: data.nombreCategoria,
                descripcionCategoria: data.descripcionCategoria || null,
            }),
            }
        );

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Error al crear categoría");
        }

        addToast('Categoría creada correctamente.', 'success');
        navigate("/admin/categorias");
        } catch (error: any) {
        addToast(error.message || 'Error al crear categoría', 'error');
        }
    }

    return (
        <div className="px-4 py-10">
        <FormBuilder
            title="Crear Categoría"
            submitLabel="Crear Categoría"
            onSubmit={handleSubmit}
            fields={[
            {
                name: "nombreCategoria",
                label: "Nombre de la categoría",
                type: "text",
                required: true,
            },
            {
                name: "descripcionCategoria",
                label: "Descripción",
                type: "textarea",
                required: false,
            },
            ]}
            initialValues={{
            nombreCategoria: "",
            descripcionCategoria: "",
            }}
        />
        </div>
    );
}
