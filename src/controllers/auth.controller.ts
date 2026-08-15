import bcrypt from "bcryptjs";
import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { prisma } from "../config/prisma.js";
import {
  loginSchema,
  registerSchema,
} from "../schemas/auth.schema.js";
import { AppError } from "../utils/app-error.js";
import { createAccessToken } from "../utils/jwt.js";

function publicUser(user: {
  id: number;
  name: string;
  email: string;
  phoneNumber: string | null;
  role: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      throw new AppError(
        "Validation failed",
        400,
        validation.error.flatten().fieldErrors,
      );
    }

    const {
      name,
      email,
      phoneNumber,
      password,
    } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new AppError(
        "An account with this email already exists",
        409,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber: phoneNumber ?? null,
        password: hashedPassword,
      },
    });

    const token = createAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user: publicUser(user),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      throw new AppError(
        "Validation failed",
        400,
        validation.error.flatten().fieldErrors,
      );
    }

    const {
      email,
      password,
    } = validation.data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppError(
        "Email or password is incorrect",
        401,
      );
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordIsValid) {
      throw new AppError(
        "Email or password is incorrect",
        401,
      );
    }

    const token = createAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: publicUser(user),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function profile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError("Unauthenticated", 401);
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },

      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError("User was not found", 404);
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
}
