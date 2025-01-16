import { Router } from "express";
import { UsersController } from "@/controllers/user-controllers";

const userRoutes = Router();
const userController = new UsersController();

userRoutes.post("/", userController.create);

export { userRoutes };
