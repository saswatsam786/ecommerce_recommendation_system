import * as Joi from "joi";
import { ProtocolNamespace } from "../../dto/types";

export const ADD_PRODUCT_VALIDATION = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name should be a type of text",
    "string.empty": "Name cannot be an empty field",
    "any.required": "Name is a required field",
  }),

  category: Joi.string()
    .valid(...Object.values(ProtocolNamespace.Category))
    .required()
    .messages({
      "any.only": `Category must be one of ${Object.values(ProtocolNamespace.Category).join(", ")}`,
      "any.required": "Category is a required field",
    }),

  price: Joi.number().positive().required().messages({
    "number.base": "Price should be a type of number",
    "number.positive": "Price must be a positive number",
    "any.required": "Price is a required field",
  }),

  description: Joi.string().required().messages({
    "string.base": "Description should be a type of text",
    "string.empty": "Description cannot be an empty field",
    "any.required": "Description is a required field",
  }),
});

export const GET_PRODUCT_QUERY_VALIDATION = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page should be a number",
    "number.integer": "Page must be an integer",
    "number.min": "Page must be greater than or equal to 1",
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.base": "Limit should be a number",
    "number.integer": "Limit must be an integer",
    "number.min": "Limit must be greater than or equal to 1",
    "number.max": "Limit must be less than or equal to 100",
  }),
});
