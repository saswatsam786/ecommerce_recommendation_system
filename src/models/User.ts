import mongoose, { Document, Schema } from "mongoose";
import { ProtocolNamespace } from "../dto/types";

export interface IPurchase {
  productId: mongoose.Types.ObjectId;
  category: ProtocolNamespace.Category;
  purchasedAt: Date;
}

export interface IUser extends Document {
  email: string;
  name: string;
  purchases: IPurchase[];
}

const UserSchema: Schema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    purchases: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        category: { type: String, enum: Object.values(ProtocolNamespace.Category), required: true },
        purchasedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", UserSchema);
