export function convertToFormData(params) {
    if (params === null || params === undefined) return null;
    return Object.entries(params)
        .reduce((acc, [key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v, k) => acc.append(`${key}[${k}]`, value));
            } else if (typeof value === 'object' && !(value instanceof File) && !(value instanceof Date)) {
                Object.entries(value).forEach((v, k) => acc.append(`${key}[${k}]`, value));
            } else {
                acc.append(key, value);
            }
            return acc;
        }, new FormData());
}