import { NextFunction, Request, Response } from "express";
import {
  ADD_PRODUCT_VALIDATION,
  createError,
  CustomError,
  GET_PRODUCT_QUERY_VALIDATION,
  UPLOAD_PRODUCT_LIST_VALIDATION,
} from "../utilities";
import { Product } from "../models";
import { ProtocolNamespace } from "../dto/types";

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

  public getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = GET_PRODUCT_QUERY_VALIDATION.validate(req.query);

      if (error) {
        return next(createError(400, error.details[0].message));
      }

      const { page, limit } = value as { page: number; limit: number };
      const skip = (page - 1) * limit;

      const products = await Product.aggregate([
        { $sample: { size: skip + limit } },
        { $skip: skip },
        { $limit: limit },
      ]);

      return res.status(200).json({ success: true, message: "Products fetched successfully", data: products });
    } catch (error) {
      return next(createError((error as CustomError).status || 500, (error as Error).message));
    }
  };

  public uploadProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = UPLOAD_PRODUCT_LIST_VALIDATION.validate(req.body);

      if (error) {
        return next(createError(400, error.details[0].message));
      }

      const products: ProtocolNamespace.IProduct[] = value;

      await Product.insertMany(products);

      return res.status(201).json({ success: true, message: "Product uploaded successfully" });
    } catch (error) {
      return next(createError((error as CustomError).status || 500, (error as Error).message));
    }
  };
}

export default new ProductController();
