import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormBuilder from "@components/organisms/admin/FormBuilder";

export default function EditCategoryPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState<any>({
        nombreCategoria: "",
        descripcionCategoria: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        async function load() {
            try {
                const res = await fetch(`https://cleanflow-back-v0-1.onrender.com/categorias/${id}`, {
                    credentials: "include",
                });

                if (!res.ok) throw new Error("No se pudo obtener la categoría");

                const data = await res.json();
                setInitialValues({
                    nombreCategoria: data.nombreCategoria || "",
                    descripcionCategoria: data.descripcionCategoria || "",
                });
            } catch (err) {
                console.error("Error cargando categoría:", err);
                alert("No se pudo cargar la categoría para editar.");
                navigate("/admin/categorias");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [id, navigate]);

    async function handleSubmit(data: any) {
        if (!id) return;

        try {
            const res = await fetch(`https://cleanflow-back-v0-1.onrender.com/categorias/${id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombreCategoria: data.nombreCategoria,
                    descripcionCategoria: data.descripcionCategoria || null,
                }),
            });

            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: "Error al actualizar" }));
                throw new Error(error.message || "Error al actualizar categoría");
            }

            navigate("/admin/categorias");
        } catch (error: any) {
            alert(error.message || "Error al actualizar categoría");
        }
    }

    if (loading) return <p className="p-10 text-center">Cargando categoría...</p>;

    return (
        <div className="px-4 py-10">
            <FormBuilder
                title="Editar Categoría"
                submitLabel="Guardar Cambios"
                onSubmit={handleSubmit}
                onCancel={() => navigate('/admin/categorias')}
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
                initialValues={initialValues}
            />
        </div>
    );
}
