import { UsersController } from "@/controllers/user-controllers";
import { Router } from "express";

const usersRoutes = Router();
const usersController = new UsersController();

usersRoutes.post("/", usersController.create);

export { usersRoutes };
