import { useEffect } from "react";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number; // milisegundos
}

export default function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const Icon = type === "success" ? CheckCircleIcon : ExclamationTriangleIcon;

  return (
    <div
      className={`fixed top-6 right-6 flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl text-white ${bgColor} animate-slide-in z-50`}
      style={{
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <Icon className="h-6 w-6 flex-shrink-0" />
      <p className="font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-white hover:opacity-80 transition"
      >
        ✕
      </button>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
