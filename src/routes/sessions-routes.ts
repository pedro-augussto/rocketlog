import { Router } from "express";
import { SessionsController } from "@/controllers/sessions-controller";
import { userRoutes } from "./users-routes";

const sessionsRoutes = Router();
const sessionsController = new SessionsController();

sessionsRoutes.post("/", sessionsController.create)

export {sessionsRoutes}