import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormBuilder from "@components/organisms/admin/FormBuilder";
import { useToast } from "@/components/ui/ToastContext";
import { fetchBodegaById, updateBodega } from "../api/adminBodegasService";

export default function EditBodegaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [initialValues, setInitialValues] = useState({ nombre: "", direccion: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const data = await fetchBodegaById(Number(id));
        setInitialValues({ nombre: data.nombre ?? "", direccion: data.direccion ?? data.direccionBodega ?? "" });
      } catch (err) {
        addToast((err as Error).message || "No se pudo cargar la bodega.", "error");
        navigate("/admin/bodegas");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, navigate, addToast]);

  async function handleSubmit(data: any) {
    if (!id) return;
    try {
      await updateBodega(Number(id), {
        nombre: data.nombre,
        direccion: data.direccion,
      });
      addToast("Bodega actualizada correctamente.", "success");
      navigate("/admin/bodegas");
    } catch (error: any) {
      addToast(error.message || "Error al actualizar bodega", "error");
    }
  }

  if (loading) return <p className="p-10 text-center">Cargando bodega...</p>;

  return (
    <div className="px-4 py-10">
      <FormBuilder
        title="Editar Bodega"
        submitLabel="Guardar Cambios"
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/bodegas")}
        fields={[
          { name: "nombre", label: "Nombre de la bodega", type: "text", required: true },
          { name: "direccion", label: "Dirección", type: "textarea", required: true },
        ]}
        initialValues={initialValues}
      />
    </div>
  );
}
