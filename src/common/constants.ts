export function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const userStatus = {
    user: 1,
    admin: 0,
} as const;
