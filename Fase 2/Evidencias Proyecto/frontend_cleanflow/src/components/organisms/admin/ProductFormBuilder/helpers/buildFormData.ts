export function buildFormData(values: Record<string, any>): FormData {
    const fd = new FormData();

    Object.entries(values).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (value instanceof File) {
        fd.append(key, value);
        return;
        }

        if (typeof value === "boolean") {
        fd.append(key, value ? "true" : "false");
        return;
        }

        if (typeof value === "number") {
        fd.append(key, String(value));
        return;
        }

        fd.append(key, value);
    });

    return fd;
}
