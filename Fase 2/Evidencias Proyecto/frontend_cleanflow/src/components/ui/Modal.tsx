import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    } from "@headlessui/react";

    interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    width?: string; // Ej: "max-w-md", "max-w-lg", "max-w-2xl"
    children: React.ReactNode;
    }

    export default function Modal({
    isOpen,
    onClose,
    title,
    width = "max-w-md",
    children,
    }: ModalProps) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        
        {/* BACKDROP */}
        <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/40 
                    data-[closed]:opacity-0 data-[closed]:duration-200"
        />

        {/* CENTERED PANEL */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel
            transition
            className={`
                w-full ${width} rounded-lg bg-white p-6 shadow-xl
                data-[closed]:opacity-0 data-[closed]:scale-95 data-[closed]:duration-200
            `}
            >
            {/* TÍTULO OPCIONAL */}
            {title && (
                <DialogTitle className="text-lg font-semibold text-gray-900 mb-4">
                {title}
                </DialogTitle>
            )}

            {/* CONTENIDO DINÁMICO */}
            {children}
            </DialogPanel>
        </div>
        </Dialog>
    );
}
