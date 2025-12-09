import { useNavigate } from "react-router-dom";
import FormBuilder from "@components/organisms/admin/FormBuilder";
import { useToast } from "@/components/ui/ToastContext";
import { createBodega } from "../api/adminBodegasService";

export default function CreateBodegaPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  async function handleSubmit(data: any) {
    try {
      await createBodega({
        nombre: data.nombre,
        direccion: data.direccion,
      });

      addToast("Bodega creada correctamente.", "success");
      navigate("/admin/productos");
    } catch (error: any) {
      addToast(error.message || "Error al crear bodega", "error");
    }
  }

  return (
    <div className="px-4 py-10">
      <FormBuilder
        title="Crear Bodega"
        submitLabel="Crear Bodega"
        onSubmit={handleSubmit}
        fields={[
          { name: "nombre", label: "Nombre de la bodega", type: "text", required: true },
          { name: "direccion", label: "Dirección", type: "textarea", required: true },
        ]}
        initialValues={{ nombre: "", direccion: "" }}
      />
    </div>
  );
}
