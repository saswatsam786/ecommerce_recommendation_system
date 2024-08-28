import { NextFunction, Request, Response } from "express";
import {
  ADD_USER_VALIDATION,
  createError,
  CustomError,
  RECORD_PURCHASE_VALIDATION,
  USER_PARAM_VALIDATION,
} from "../utilities";
import { Product, User } from "../models";

class UserController {
  public addUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = ADD_USER_VALIDATION.validate(req.body);
      if (error) {
        return next(createError(400, error.details[0].message));
      }

      const { name, email } = value;
      const user = await User.findOne({ email });
      if (user) {
        return next(createError(400, "User with this email already exists"));
      }

      const newUser = new User({
        name,
        email,
      });

      await newUser.save();

      return res.status(201).json({ success: true, message: "User added successfully", data: newUser });
    } catch (error) {
      return next(createError((error as CustomError).status || 500, (error as Error).message));
    }
  };

  public recordPurchase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = RECORD_PURCHASE_VALIDATION.validate(req.body);

      if (error) {
        return next(createError(400, error.details[0].message));
      }

      const { productIds } = value;

      const { error: paramError, value: paramValue } = USER_PARAM_VALIDATION.validate(req.params);
      if (paramError) {
        return next(createError(400, paramError.details[0].message));
      }

      const user = await User.findById(paramValue);
      if (!user) {
        return next(createError(404, "User not found"));
      }

      const products = await Product.find({ _id: { $in: productIds } });
      if (products.length !== productIds.length) {
        return next(createError(404, "One or more products not found"));
      }

      const purchases = productIds.map((productId: string) => ({
        productId,
        purchasedAt: new Date(),
      }));

      user.purchases.push(...purchases);

      await user.save();

      return res.status(201).json({ success: true, message: "Products purchased successfully", data: user });
    } catch (error) {
      return next(createError((error as CustomError).status || 500, (error as Error).message));
    }
  };
}

export default new UserController();
