import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";

class DeliveryLogsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      delivery_id: z.string().uuid(),
      description: z.string(),
    });

    const { delivery_id, description } = bodySchema.parse(request.body);

    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
    });

    if (!delivery) {
      throw new AppError("delivery not found", 401);
    }

    if (delivery.status === "processing") {
      throw new AppError("change status to shipped", 401);
    }

    await prisma.deliveryLog.create({
      data: {
        deliveryId: delivery_id,
        description,
      },
    });

    return response.status(201).json();
  }

  async show(request: Request, response: Response) {
    const paramsScheme = z.object({
      delivery_id: z.string().uuid(),
    });

    const { delivery_id } = paramsScheme.parse(request.params);

    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
    });

    if (
      request.user?.role === "customer" &&
      request.user.id !== delivery?.userId
    ) {
      throw new AppError("the user can only view their deliveries", 401);
    }

    return response.json(delivery);
  }
}

export { DeliveryLogsController };
