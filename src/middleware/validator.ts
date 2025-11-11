import { validate } from '../validation';
import { adminLoginSchema } from '../validation/admin';

/**
 * Validation Middleware Wrapper
 * Reusable validation middleware for routes
 */
export const validateRequest = (schema: any) => {
    return validate(schema);
};

/**
 * Pre-configured validation middlewares
 */
export const validateAdminLogin = validateRequest(adminLoginSchema);
