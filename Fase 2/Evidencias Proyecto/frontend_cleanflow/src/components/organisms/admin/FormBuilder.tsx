// src/components/organisms/admin/FormBuilder.tsx
import { useForm } from "react-hook-form";
import { useState } from 'react';
import Modal from '@components/ui/Modal';
import AdminCard from "@molecules/admin/AdminCard";
import AdminButton from "@atoms/admin/AdminButton";
import { AdminInput } from "@atoms/admin/AdminInput";
import { AdminTextarea } from "@/components/atoms/admin/AdminTextarea";
import { AdminSelect } from "@/components/atoms/admin/AdminSelect";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export interface FieldConfig {
    name: string;
    label: string;
    type?: "text" | "number" | "textarea" | "select" | "file" | "password";
    options?: { label: string; value: any }[]; // solo para select
    required?: boolean;
}

export interface FormBuilderProps {
    title: string;
    fields: FieldConfig[];
    initialValues?: Record<string, any>;
    submitLabel?: string;
    onSubmit: (data: any) => Promise<void>;
    onCancel?: () => void;
    cancelLabel?: string;
}

export default function FormBuilder({
    title,
    fields,
    initialValues = {},
    submitLabel = "Guardar",
    onSubmit,
    onCancel,
    cancelLabel,
}: FormBuilderProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm({ defaultValues: initialValues });

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [visiblePasswordFields, setVisiblePasswordFields] = useState<Record<string, boolean>>({});

    const togglePasswordVisibility = (fieldName: string) => {
        setVisiblePasswordFields(prev => ({
            ...prev,
            [fieldName]: !prev[fieldName]
        }));
    };

    const handleFormSubmit = async (data: any) => {
        await onSubmit(data);
        reset();
    };

    return (
        <div className="max-w-xl mx-auto mt-10">
            <AdminCard title={title}>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                {fields.map((field) => {
                    if (field.type === "textarea") {
                    return (
                        <AdminTextarea
                        key={field.name}
                        label={field.label}
                        error={errors[field.name] ? "Campo obligatorio" : undefined}
                        {...register(field.name, { required: field.required })}
                        />
                    );
                    }

                    if (field.type === "select") {
                    return (
                        <AdminSelect
                        key={field.name}
                        label={field.label}
                        options={field.options || []}
                        error={errors[field.name] ? "Campo obligatorio" : undefined}
                        {...register(field.name, { required: field.required })}
                        />
                    );
                    }

                    if (field.type === "file") {
                    return (
                        <AdminInput
                        key={field.name}
                        type="file"
                        label={field.label}
                        error={errors[field.name] ? "Campo obligatorio" : undefined}
                        {...register(field.name, { required: field.required })}
                        />
                    );
                    }

                    if (field.type === "password") {
                    const isVisible = visiblePasswordFields[field.name] || false;
                    return (
                        <div key={field.name} className="relative">
                            <AdminInput
                                label={field.label}
                                type={isVisible ? "text" : "password"}
                                error={errors[field.name] ? "Campo obligatorio" : undefined}
                                {...register(field.name, { required: field.required })}
                                className="pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility(field.name)}
                                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition-colors"
                                tabIndex={-1}
                            >
                                {isVisible ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    );
                    }

                    return (
                    <AdminInput
                        key={field.name}
                        label={field.label}
                        type={field.type || "text"}
                        error={errors[field.name] ? "Campo obligatorio" : undefined}
                        {...register(field.name, { required: field.required })}
                    />
                    );
                })}

                <div className="flex items-center gap-3">
                    {onCancel && (
                        <>
                        <AdminButton
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                if (!onCancel) return;
                                if (isDirty) {
                                    setConfirmOpen(true);
                                    return;
                                }
                                onCancel();
                            }}
                            size="md"
                        >
                            {cancelLabel || 'Cancelar'}
                        </AdminButton>

                        <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirmar cancelación" width="max-w-md">
                            <p className="text-gray-700">Hay cambios sin guardar. ¿Seguro que quieres cancelar y perder los cambios?</p>
                            <div className="mt-6 flex justify-end gap-3">
                                <button onClick={() => setConfirmOpen(false)} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">Seguir editando</button>
                                <button onClick={() => { setConfirmOpen(false); onCancel && onCancel(); }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Cancelar y salir</button>
                            </div>
                        </Modal>
                        </>
                    )}

                    <AdminButton loading={isSubmitting}>{submitLabel}</AdminButton>
                </div>
                </form>
            </AdminCard>
        </div>
    );
}
