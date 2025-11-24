// src/components/organisms/admin/ProductFormBuilder/widgets/UploadImageField.ts
import type { UseFormRegister, UseFormSetValue } from "react-hook-form";

interface UploadImageFieldProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  error?: string;
  currentUrl?: string | null;
  file?: File | null;
}

export function UploadImageField({
  name,
  label,
  register,
  setValue,
  error,
  currentUrl,
  file,
}: UploadImageFieldProps) {
  return (
    <div className="space-y-2">
      <label className="font-semibold text-gray-700">{label}</label>

      {/* INPUT FILE PROPIO, REGISTRADO + CONTROLADO */}
      <input
        type="file"
        accept="image/*"
        className="block w-full text-sm"
        {...register(name)}
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          setValue(name, f, { shouldValidate: true });
        }}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Previews */}
      <div className="mt-4 flex gap-4">
        {/* Imagen actual (solo edit, sin nueva imagen) */}
        {currentUrl && !file && (
          <img
            src={currentUrl}
            className="w-32 h-32 object-cover rounded-lg border"
          />
        )}

        {/* Imagen nueva */}
        {file && (
          <img
            src={URL.createObjectURL(file)}
            className="w-32 h-32 object-cover rounded-lg border-2 border-green-400"
          />
        )}
      </div>
    </div>
  );
}
