const isPositiveIntegerId = (value) => {
    if (typeof value === "number") {
        return Number.isSafeInteger(value) && value > 0;
    }

    return typeof value === "string" && /^[1-9]\d*$/.test(value.trim());
};

const positiveIntegerId = (value, field = "ID") => {
    if (!isPositiveIntegerId(value)) {
        return { value: null, error: `Invalid ${field}` };
    }

    return { value: Number(value), error: null };
};

const requiredTrimmedString = (value, field, maxLength) => {
    if (typeof value !== "string" || !value.trim()) {
        return { value: null, error: `${field} is required` };
    }

    const trimmed = value.trim();
    if (maxLength && trimmed.length > maxLength) {
        return { value: null, error: `${field} must be ${maxLength} characters or fewer` };
    }

    return { value: trimmed, error: null };
};

const maxStringLength = (value, field, maxLength) => {
    if (typeof value !== "string" || value.length > maxLength) {
        return { value: null, error: `${field} must be ${maxLength} characters or fewer` };
    }

    return { value, error: null };
};

const email = (value, field = "Email") => {
    const result = requiredTrimmedString(value, field, 255);
    if (result.error) return result;

    const normalized = result.value.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        return { value: null, error: `Invalid ${field}` };
    }

    return { value: normalized, error: null };
};

const phone = (value, field = "Phone Number") => {
    const result = requiredTrimmedString(value, field, 10);
    if (result.error) return result;

    if (!/^\d{10}$/.test(result.value)) {
        return { value: null, error: `${field} must contain exactly 10 digits` };
    }

    return result;
};

const password = (value, field = "Password") => {
    if (typeof value !== "string" || !value.trim()) {
        return { value: null, error: `${field} is required` };
    }

    if (value.length < 6) {
        return { value: null, error: `${field} must be at least 6 characters` };
    }

    return { value, error: null };
};

module.exports = {
    isPositiveIntegerId,
    positiveIntegerId,
    requiredTrimmedString,
    email,
    phone,
    password,
    maxStringLength
};
