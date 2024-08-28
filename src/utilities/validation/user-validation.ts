import * as Joi from "joi";

export const ADD_USER_VALIDATION = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name should be a type of text",
    "string.empty": "Name cannot be an empty field",
    "any.required": "Name is a required field",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email should be a type of text",
    "string.empty": "Email cannot be an empty field",
    "string.email": "Email must be a valid email",
    "any.required": "Email is a required field",
  }),
});

export const USER_PARAM_VALIDATION = Joi.object({
  userId: Joi.string().required().messages({
    "string.base": "User ID should be a type of text",
    "string.empty": "User ID cannot be an empty field",
    "any.required": "User ID is a required field",
  }),
});
