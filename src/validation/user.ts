import * as Joi from "joi"
import { commonSchemas } from './commonSchemas'

export const loginSchema = {
    body: Joi.object({
        email: commonSchemas.requireEmail,
        password: commonSchemas.requireString200,
        deviceToken: commonSchemas.deviceToken,
    })
};

export const signUpSchema = {
    body: Joi.object({
        firstName: commonSchemas.requireString200,
        lastName: commonSchemas.requireString200,
        email: commonSchemas.requireEmail,
        password: commonSchemas.requireString200,
        userType: commonSchemas.optionalNumber,
    })
};
