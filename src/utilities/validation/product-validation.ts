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
