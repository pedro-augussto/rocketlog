import { Request, response, Response } from "express";
import { AppError } from "@/utils/AppError";
import { authConfig } from "@/configs/auth";
import { prisma } from "@/database/prisma";
import {sign} from "jsonwebtoken"
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

    const { secret, expiresIn} = authConfig.jwt

    const token  = sign({role: user.role ?? "custumer"},secret,{
        subject: user.id,
        expiresIn
    })

    const {password: hashedPassword, ...userWhitoutPassword} = user
    

    return response.json({ token, user: userWhitoutPassword });
  }
}

export { SessionsController };
