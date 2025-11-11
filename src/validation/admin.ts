import * as Joi from "joi"
import { commonSchemas } from './commonSchemas'

export const adminLoginSchema = {
    body: Joi.object({
        email: commonSchemas.requireEmail,
        password: commonSchemas.requireString200,
    })
};