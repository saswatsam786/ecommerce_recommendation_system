import express, { Router } from "express";
import ProductControllers from "../controllers/product-controllers";

class ProductRouter {
  private router: Router;

  constructor() {
    this.router = express.Router();
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router.post("/", ProductControllers.addProduct);
    this.router.get("/", ProductControllers.getProduct);
    this.router.post("/uploads", ProductControllers.uploadProducts);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default ProductRouter;
