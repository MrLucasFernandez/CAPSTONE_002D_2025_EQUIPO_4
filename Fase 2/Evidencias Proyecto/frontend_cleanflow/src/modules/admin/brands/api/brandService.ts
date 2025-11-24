const BASE_URL = import.meta.env.VITE_API_URL;

export async function createBrand(data: {
    nombreMarca: string;
    descripcionMarca?: string;
    }) {
    const res = await fetch(`${BASE_URL}/marcas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error("Error al crear marca: " + msg);
    }

    return await res.json();
}
