import mongoose, { Document, Schema } from "mongoose";
import { ProtocolNamespace } from "../dto/types";

export interface IProduct extends Document {
  name: string;
  category: ProtocolNamespace.Category;
  price: number;
  description: string;
}

const ProductSchema: Schema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    category: { type: String, enums: Object.values(ProtocolNamespace.Category), required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
