import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormBuilder from "@components/organisms/admin/FormBuilder";

export default function EditBrandPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState<any>({
        nombreMarca: "",
        descripcionMarca: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        async function load() {
            try {
                const res = await fetch(`https://cleanflow-back-v0-1.onrender.com/marcas/${id}`, {
                    credentials: "include",
                });

                if (!res.ok) throw new Error("No se pudo obtener la marca");

                const data = await res.json();
                setInitialValues({
                    nombreMarca: data.nombreMarca || "",
                    descripcionMarca: data.descripcionMarca || "",
                });
            } catch (err) {
                console.error("Error cargando marca:", err);
                alert("No se pudo cargar la marca para editar.");
                navigate("/admin/marcas");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [id, navigate]);

    async function handleSubmit(data: any) {
        if (!id) return;

        try {
            const res = await fetch(`https://cleanflow-back-v0-1.onrender.com/marcas/${id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombreMarca: data.nombreMarca, descripcionMarca: data.descripcionMarca || null }),
            });

            if (!res.ok) {
                const error = await res.json().catch(() => ({ message: "Error al actualizar" }));
                throw new Error(error.message || "Error al actualizar marca");
            }

            navigate("/admin/marcas");
        } catch (error: any) {
            alert(error.message || "Error al actualizar marca");
        }
    }

    if (loading) return <p className="p-10 text-center">Cargando marca...</p>;

    return (
        <div className="px-4 py-10">
            <FormBuilder
                title="Editar Marca"
                submitLabel="Guardar Cambios"
                onSubmit={handleSubmit}
                onCancel={() => navigate('/admin/marcas')}
                fields={[
                    { name: "nombreMarca", label: "Nombre de la marca", type: "text", required: true },
                    { name: "descripcionMarca", label: "Descripción", type: "textarea", required: false },
                ]}
                initialValues={initialValues}
            />
        </div>
    );
}
