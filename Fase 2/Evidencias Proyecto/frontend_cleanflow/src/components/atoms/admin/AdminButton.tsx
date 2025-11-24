import React from "react";
import { Loader2 } from "lucide-react"; // spinner

// =======================================================
// TYPES
// =======================================================
export interface AdminButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "danger" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    className?: string;
}

// =======================================================
// STYLES
// =======================================================
const variantClasses: Record<string, string> = {
    primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300",
    danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300",
    secondary:
        "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-300",
    ghost:
        "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-200",
};

const sizeClasses: Record<string, string> = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-5 py-3",
};

// =======================================================
// COMPONENT
// =======================================================
const AdminButton: React.FC<AdminButtonProps> = ({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    startIcon,
    endIcon,
    disabled,
    className = "",
    ...rest
}) => {
    return (
    <button
        {...rest}
        disabled={loading || disabled}
        className={`
        inline-flex items-center justify-center gap-2 font-semibold
        rounded-lg transition-all duration-200 shadow-sm
        focus:ring-2 disabled:opacity-70 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
        `}
        >
        {/* Loading spinner */}
        {loading && (
            <Loader2 className="animate-spin" size={18} />
        )}

        {/* Icono izquierdo */}
        {!loading && startIcon && (
            <span className="flex items-center">{startIcon}</span>
        )}

        {/* Texto */}
        {children}

        {/* Icono derecho */}
        {!loading && endIcon && (
            <span className="flex items-center">{endIcon}</span>
        )}
        </button>
    );
};

export default AdminButton;
