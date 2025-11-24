import { useForm } from "react-hook-form";
import AdminCard from "@molecules/admin/AdminCard";
import AdminButton from "@atoms/admin/AdminButton";
import { AdminInput } from "@atoms/admin/AdminInput";

interface SimpleFormProps {
    title: string;
    fields: {
        name: string;
        label: string;
        type?: string;
    }[];
    onSubmit: (data: any) => Promise<void>;
    submitLabel?: string;
}

export default function SimpleForm({
    title,
    fields,
    onSubmit,
    submitLabel = "Guardar",
    }: SimpleFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const handleFormSubmit = async (data: any) => {
        await onSubmit(data);
        reset();
    };

    return (
        <div className="max-w-xl mx-auto mt-10">
        {/* ✔ AdminCard SOLO recibe title y children */}
        <AdminCard title={title}>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">

            {fields.map((field) => (
                <AdminInput
                key={field.name}
                label={field.label}
                type={field.type || "text"}
                error={errors[field.name] ? "Campo obligatorio" : undefined}
                {...register(field.name, { required: true })}
                />
            ))}

            {/* ✔ AdminButton SOLO recibe children y loading */}
            <AdminButton loading={isSubmitting}>
                {submitLabel}
            </AdminButton>
            </form>
        </AdminCard>
        </div>
    );
}
