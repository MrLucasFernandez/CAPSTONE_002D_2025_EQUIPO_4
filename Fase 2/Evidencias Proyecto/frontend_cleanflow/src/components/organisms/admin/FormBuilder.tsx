// src/components/organisms/admin/FormBuilder.tsx
import { useForm } from "react-hook-form";
import AdminCard from "@molecules/admin/AdminCard";
import AdminButton from "@atoms/admin/AdminButton";
import { AdminInput } from "@atoms/admin/AdminInput";
import { AdminTextarea } from "@/components/atoms/admin/AdminTextarea";
import { AdminSelect } from "@/components/atoms/admin/AdminSelect";

export interface FieldConfig {
    name: string;
    label: string;
    type?: "text" | "number" | "textarea" | "select" | "file";
    options?: { label: string; value: any }[]; // solo para select
    required?: boolean;
}

export interface FormBuilderProps {
    title: string;
    fields: FieldConfig[];
    initialValues?: Record<string, any>;
    submitLabel?: string;
    onSubmit: (data: any) => Promise<void>;
}

export default function FormBuilder({
    title,
    fields,
    initialValues = {},
    submitLabel = "Guardar",
    onSubmit,
}: FormBuilderProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: initialValues });

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

                <AdminButton loading={isSubmitting}>{submitLabel}</AdminButton>
                </form>
            </AdminCard>
        </div>
    );
}
