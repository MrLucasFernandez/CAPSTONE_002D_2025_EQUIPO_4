import type { ReactNode } from "react";

export default function AdminCard({
    title,
    children,
    }: {
    title: string;
    children: ReactNode;
    }) {
    return (
        <div className="bg-white shadow-[0_8px_30px_rgb(0_0_0_/_0.06)] rounded-2xl p-8 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
            {title}
        </h2>
        {children}
        </div>
    );
}
