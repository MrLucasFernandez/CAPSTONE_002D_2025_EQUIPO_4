import iconWomen from "@assets/icons/iconWomen.png";
import iconT from "@assets/icons/iconToiletries.png";
import iconPH from "@assets/icons/iconPH.png";
import iconCH from "@assets/icons/iconCH.png";

import defaultIcon from "@assets/icons/iconLogo.png";

interface Props {
    id: number;
}

export default function CategoryIcon({ id }: Props) {
    const icon = ICONS_BY_ID[id] ?? defaultIcon;

        return (
        <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center p-2">
        <img
            src={icon}        // ✔ AQUÍ LA RUTA ES CORRECTA
            alt="Icono categoría"
            className="w-10 h-10 object-contain"
        />
        </div>
    );
}

/**
 * Mapea ID de categoría → icono importado desde assets
 */
export const ICONS_BY_ID: Record<number, string> = {
    1: iconCH,
    2: iconPH,
    3: iconWomen,
    4: iconT,
  // agrega más según tus categorías reales
};
