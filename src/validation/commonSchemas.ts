import * as Joi from 'joi';

export const commonSchemas = {
    objectId: (fieldName = 'Id') => Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({ 'string.pattern.base': `Invalid ${fieldName}`, 'string.empty': `${fieldName} is required` }),
    optionalObjectId: (fieldName = 'Id') => Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional().messages({ 'string.pattern.base': `Invalid ${fieldName}`, 'string.empty': `${fieldName} is not empty` }),

    // String
    optionalString200: Joi.string().max(200).allow(null).empty('').optional(),
    requireString200: Joi.string().max(200).required(),

    // Number
    requireNumber: Joi.number().positive().min(0).max(9999999999).required(),
    optionalNumber: Joi.number().min(0).max(9999999999).optional(),

    // Email
    requireEmail: Joi.string().email().required(),
    optionalEmail: Joi.string().email().optional(),

    deviceToken: Joi.string().max(200).allow(null).empty('').optional(),

    // Image
    optionalImageArray: Joi.array().items(Joi.string().uri().max(255)).optional(),
    requireImageArray: Joi.array().items(Joi.string().uri().max(255)).required(),
};


