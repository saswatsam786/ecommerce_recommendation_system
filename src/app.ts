import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import * as dotenv from "dotenv";
import Database from "./base/database-store";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

class App {
  private db_ = new Database(process.env.MONGO_URL as string);
  private app_ = express();
  private PORT_ = process.env.PORT || 6005;
  private isProduction = process.env.NODE_ENV === "production";

  constructor() {
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.handleErrors();
  }

  private initializeMiddlewares() {
    this.app_.use(express.json());
    this.app_.use(express.urlencoded({ extended: true }));
    this.app_.use(
      cors({
        origin: "*",
      })
    );
    this.isProduction ? this.app_.use(morgan("combined")) : this.app_.use(morgan("tiny"));
  }

  private initializeRoutes() {
    this.app_.get("/test", (req, res) => res.send("Hello World!"));
  }

  public get_app() {
    return this.app_;
  }

  private handleErrors(): void {
    this.app_.use((err: any, req: Request, res: Response, next: NextFunction) => {
      const status = err.status || 500;
      const message = err.message || "Something went wrong";
      return res.status(status).json({
        success: false,
        status,
        message,
      });
    });
  }

  public startServer = async () => {
    try {
      await this.db_.connect();
      this.app_.listen(this.PORT_, () => {
        console.log(`Server is listening on port ${this.PORT_} in ${process.env.NODE_ENV} environment.`);
      });
    } catch (err) {
      console.error("Failed to connect to the database. Server not started.");
    }
  };
}

export default App;
