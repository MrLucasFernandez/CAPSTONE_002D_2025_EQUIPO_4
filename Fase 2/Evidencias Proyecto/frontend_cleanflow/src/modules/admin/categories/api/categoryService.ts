const BASE_URL = import.meta.env.VITE_API_URL;

export async function createCategory(data: {
    nombreCategoria: string;
    descripcionCategoria?: string;
    }) {
    const res = await fetch(`${BASE_URL}/categorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // necesario para cookies Admin
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error("Error al crear categoría: " + msg);
    }

    return await res.json();
}
