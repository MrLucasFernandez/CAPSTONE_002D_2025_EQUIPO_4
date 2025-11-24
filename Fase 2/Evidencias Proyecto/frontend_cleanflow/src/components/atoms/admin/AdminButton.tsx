import type { ReactNode } from "react";

interface AdminButtonProps {
    children: ReactNode;
    loading?: boolean;
    }

    export default function AdminButton({ children, loading }: AdminButtonProps) {
    return (
        <button
        disabled={loading}
        className="
            w-full py-3 
            rounded-xl 
            bg-blue-600 
            text-white 
            font-medium 
            shadow-md
            hover:bg-blue-700 
            hover:shadow-lg 
            transition-all
            disabled:bg-gray-300
            disabled:cursor-not-allowed
        "
        >
        {loading ? "Guardando..." : children}
        </button>
    );
}
