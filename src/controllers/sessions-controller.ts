import { Request, response, Response } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { compare } from "bcrypt";
import { z } from "zod";

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: { email },
    });
    if (!user) {
      throw new AppError("Invalide email or password", 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("Invalide email or password", 401);
    }

    return response.json({ message: "ok" });
  }
}

export { SessionsController };
