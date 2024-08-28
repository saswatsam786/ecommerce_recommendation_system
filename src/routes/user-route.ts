import express, { Router } from "express";
import UserController from "../controllers/user-controller";

class UserRouter {
  private router: Router;

  constructor() {
    this.router = express.Router();
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.router.post("/", UserController.addUser);
    this.router.get("/:userId/purchases", UserController.recordPurchase);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default UserRouter;
