import { NextFunction, Request, Response } from "express";
import NodeCache from "node-cache";
import {
  ADD_USER_VALIDATION,
  createError,
  CustomError,
  GET_USER_VALIDATION,
  RECORD_PURCHASE_VALIDATION,
  USER_PARAM_VALIDATION,
} from "../utilities";
import { Product, User } from "../models";
import { ProtocolNamespace } from "../dto/types";

const cache = new NodeCache({ stdTTL: 3600 });

class UserController {
  private recommendProducts = (
    user: ProtocolNamespace.IUser,
    products: ProtocolNamespace.IProduct[]
  ): ProtocolNamespace.IProduct[] => {
    const purchasedProductIds = new Set(user.purchases.map((purchase) => String(purchase.productId)));
    const purchasedProducts = products.filter((product) => purchasedProductIds.has(String(product._id)));

    const categoryPercentages = purchasedProducts.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = 0;
      }
      acc[product.category] += (1 / purchasedProducts.length) * 100;
      return acc;
    }, {} as { [category: string]: number });

    const productScores = products
      .filter((product) => !purchasedProductIds.has(String(product._id)))
      .map((product) => ({
        product,
        score: categoryPercentages[product.category] || 0,
      }))
      .sort((a, b) => b.score - a.score);

    const recommendations: ProtocolNamespace.IProduct[] = [];
    const totalRecommendations = 10;
    const selectedCounts: { [category: string]: number } = {};

    for (const { product, score } of productScores) {
      const maxSelectionsForCategory = Math.round((score / 100) * totalRecommendations);

      if ((selectedCounts[product.category] || 0) < maxSelectionsForCategory) {
        recommendations.push(product);
        selectedCounts[product.category] = (selectedCounts[product.category] || 0) + 1;
      }

      if (recommendations.length >= totalRecommendations) break;
    }

    return recommendations;
  };

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

      cache.del(`user_${email}`);

      return res.status(201).json({ success: true, message: "User added successfully", data: newUser });
    } catch (error) {
      return next(createError((error as CustomError).status || 500, (error as Error).message));
    }
  };

  public getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = GET_USER_VALIDATION.validate(req.body);
      if (error) {
        return next(createError(400, error.details[0].message));
      }

      const { email } = value;
      const cacheKey = `user_${email}`;
      const cachedUser = cache.get(cacheKey);

      if (cachedUser) {
        return res.status(200).json({ success: true, message: "User found successfully", data: cachedUser });
      }

      const user = await User.findOne({ email }).populate("purchases.productId");
      if (!user) {
        return next(createError(404, "User not found"));
      }

      cache.set(cacheKey, user);

      return res.status(200).json({ success: true, message: "User found successfully", data: user });
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

      const user = await User.findById(paramValue.userId);
      if (!user) {
        return next(createError(404, "User not found"));
      }

      const products: ProtocolNamespace.IProduct[] = await Product.find({ _id: { $in: productIds } });
      if (products.length !== productIds.length) {
        return next(createError(404, "One or more products not found"));
      }

      const purchases = products.map((product: ProtocolNamespace.IProduct) => ({
        productId: product._id,
        category: product.category,
        purchasedAt: new Date(),
      }));

      user.purchases.push(...purchases);

      await user.save();

      cache.del(`user_${user.email}`);

      return res.status(201).json({ success: true, message: "Products purchased successfully", data: user });
    } catch (error) {
      return next(createError((error as CustomError).status || 500, (error as Error).message));
    }
  };

  public getRecommendations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = USER_PARAM_VALIDATION.validate(req.params);
      if (error) {
        return next(createError(400, error.details[0].message));
      }

      const { userId } = value;

      const user = await User.findById(userId).lean();
      if (!user) {
        return next(createError(404, "User not found"));
      }

      const products = await Product.find().lean();
      if (!products) {
        return next(createError(404, "Products not found"));
      }

      // @ts-ignore
      const recommendations = this.recommendProducts(user, products);

      return res
        .status(200)
        .json({ success: true, message: "Recommendations fetched successfully", data: recommendations });
    } catch (error) {
      return next(createError((error as CustomError).status || 500, (error as Error).message));
    }
  };
}

export default new UserController();
