import React from "react";

interface ImagePreviewProps {
  currentUrl?: string | null;   // imagen existente del backend
  file?: File | null;           // imagen subida en el formulario
  size?: number;                // tamaño opcional (px)
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
    currentUrl,
    file,
    size = 140,
    }) => {
    const previewUrl = file ? URL.createObjectURL(file) : null;
    const containerSize = `${size}px`;

    return (
        <div className="flex flex-col gap-2">
        <div
            className="rounded-xl overflow-hidden border shadow-sm bg-white"
            style={{ width: containerSize, height: containerSize }}
        >
            {previewUrl ? (
            <img
                src={previewUrl}
                alt="Nueva imagen"
                className="w-full h-full object-cover"
            />
            ) : currentUrl ? (
            <img
                src={currentUrl}
                alt="Imagen actual"
                className="w-full h-full object-cover"
            />
            ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
                Sin imagen
            </div>
            )}
        </div>

        {file && (
            <p className="text-xs text-gray-600 italic">
            Previsualización de nueva imagen
            </p>
        )}
        </div>
    );
};
