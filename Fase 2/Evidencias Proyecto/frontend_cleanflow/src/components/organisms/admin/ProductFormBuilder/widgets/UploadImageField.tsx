import React, { useRef, useState } from "react";

interface UploadImageFieldProps {
  label: string;
  error?: string;
  currentUrl?: string | null; // imagen actual (edit)
  file?: File | null;         // imagen nueva (watch)
  onFileSelect: (file: File | null) => void;
}

export function UploadImageField({
  label,
  error,
  currentUrl,
  file,
  onFileSelect,
}: UploadImageFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleOpenFile = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    onFileSelect(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const selected = e.dataTransfer.files?.[0];
    if (selected) {
      onFileSelect(selected);
    }
  };

  const handleRemoveImage = () => {
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <label className="font-semibold text-gray-700">{label}</label>

      {/* Zona de arrastre */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 cursor-pointer transition 
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        `}
        onClick={handleOpenFile}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <p className="text-center text-gray-600 mb-2">
          Arrastra una imagen aquí o haz clic para seleccionar
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />

        {/* Nombre del archivo nuevo */}
        {file && (
          <p className="text-sm text-gray-800 text-center mt-2">
            Archivo seleccionado: <span className="font-medium">{file.name}</span>
          </p>
        )}

        {/* Imagen actual (edit) */}
        {!file && currentUrl && (
          <img
            src={currentUrl}
            className="mx-auto mt-4 w-32 h-32 object-cover rounded-lg border"
          />
        )}

        {/* Vista previa nueva */}
        {file && (
          <img
            src={URL.createObjectURL(file)}
            className="mx-auto mt-4 w-32 h-32 object-cover rounded-lg border-2 border-green-400"
          />
        )}
      </div>

      {/* Botón remover imagen si existe nueva o actual */}
      {(file || currentUrl) && (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition"
        >
          Quitar imagen
        </button>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
