import { Router } from "express";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { DeliveriesController } from "@/controllers/deliveries-controller";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const deliveriesRoutes = Router();
const deliveriesController = new DeliveriesController();

deliveriesRoutes.use(ensureAuthenticated, verifyUserAuthorization(["sale"]));
deliveriesRoutes.post("/", deliveriesController.create);

export { deliveriesRoutes };
