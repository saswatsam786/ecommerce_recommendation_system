import { NextFunction, Request, Response } from "express";
import { ADD_PRODUCT_VALIDATION, createError, CustomError } from "../utilities";
import { Product } from "../models";

class ProductController {
  public addProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { value, error } = ADD_PRODUCT_VALIDATION.validate(req.body);

      if (error) {
        return next(createError(400, error.details[0].message));
      }

      const { name, category, price, description } = value;

      const product = new Product({
        name,
        category,
        price,
        description,
      });

      await product.save();

      return res.status(201).json({ success: true, message: "Product added successfully", data: product });
    } catch (error) {
      return next(createError((error as CustomError).status || 500, (error as Error).message));
    }
  };
}

export default new ProductController();
