import mongoose from "mongoose";

export namespace ProtocolNamespace {
  export enum Category {
    ELECTRONICS = "Electronics",
    CLOTHING = "Clothing",
    BOOKS = "Books",
    HOME = "Home",
    BEAUTY = "Beauty",
    SPORTS = "Sports",
  }

  export interface IPurchase {
    productId: string;
    purchasedAt: Date;
  }

  export interface IUser {
    email: string;
    name: string;
    purchases: IPurchase[];
  }

  export interface IProduct {
    _id: mongoose.Types.ObjectId;
    name: string;
    category: Category;
    price: number;
    description: string;
  }
}
