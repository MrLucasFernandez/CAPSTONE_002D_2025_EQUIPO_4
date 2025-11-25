import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    return ctx;
}
