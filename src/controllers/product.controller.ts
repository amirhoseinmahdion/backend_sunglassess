import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../config/prisma.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema.js";
import { AppError } from "../utils/app-error.js";

function serializeProduct<T extends { price: unknown }>(
  product: T,
) {
  return {
    ...product,
    price: Number(product.price),
  };
}

/**
 * GET /api/products
 * Public
 */
export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const category =
      typeof req.query.category === "string"
        ? req.query.category.trim()
        : "";

    const page = Math.max(
      Number.parseInt(String(req.query.page ?? "1"), 10) || 1,
      1,
    );

    const limit = Math.min(
      Math.max(
        Number.parseInt(
          String(req.query.limit ?? "12"),
          10,
        ) || 12,
        1,
      ),
      100,
    );

    const featured =
      req.query.featured === "true"
        ? true
        : req.query.featured === "false"
          ? false
          : undefined;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      active: true,

      ...(featured !== undefined
        ? {
            featured,
          }
        : {}),

      ...(category
        ? {
            category: {
              equals: category,
              mode: "insensitive",
            },
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                category: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),

      prisma.product.count({
        where,
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        products: products.map(serializeProduct),

        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/products/:idOrSlug
 * Public
 */
export async function getProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const idOrSlug = req.params.idOrSlug;

    if (typeof idOrSlug !== "string" || !idOrSlug) {
      throw new AppError(
        "Product ID or slug is required",
        400,
      );
    }

    const productId = Number(idOrSlug);

    const product = await prisma.product.findFirst({
      where: {
        active: true,

        ...(Number.isInteger(productId) && productId > 0
          ? {
              id: productId,
            }
          : {
              slug: idOrSlug,
            }),
      },
    });

    if (!product) {
      throw new AppError("Product was not found", 404);
    }

    res.status(200).json({
      success: true,
      data: {
        product: serializeProduct(product),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/products
 * Admin only
 */
export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const validation = createProductSchema.safeParse(
      req.body,
    );

    if (!validation.success) {
      throw new AppError(
        "Validation failed",
        400,
        validation.error.flatten().fieldErrors,
      );
    }

    const slugExists = await prisma.product.findUnique({
      where: {
        slug: validation.data.slug,
      },
    });

    if (slugExists) {
      throw new AppError(
        "A product with this slug already exists",
        409,
      );
    }

    const product = await prisma.product.create({
      data: {
        name: validation.data.name,
        slug: validation.data.slug,
        description:
          validation.data.description ?? null,
        category: validation.data.category,
        price: validation.data.price,
        stock: validation.data.stock,
        image: validation.data.image,
        featured: validation.data.featured,
        active: validation.data.active,
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        product: serializeProduct(product),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/products/:id
 * Admin only
 */
export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new AppError("Invalid product ID", 400);
    }

    const validation = updateProductSchema.safeParse(
      req.body,
    );

    if (!validation.success) {
      throw new AppError(
        "Validation failed",
        400,
        validation.error.flatten().fieldErrors,
      );
    }

    if (Object.keys(validation.data).length === 0) {
      throw new AppError(
        "At least one field is required",
        400,
      );
    }

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!existingProduct) {
      throw new AppError("Product was not found", 404);
    }

    if (
      validation.data.slug &&
      validation.data.slug !== existingProduct.slug
    ) {
      const productWithSlug =
        await prisma.product.findUnique({
          where: {
            slug: validation.data.slug,
          },
        });

      if (productWithSlug) {
        throw new AppError(
          "A product with this slug already exists",
          409,
        );
      }
    }

    const product = await prisma.product.update({
      where: {
        id: productId,
      },

      data: validation.data,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: {
        product: serializeProduct(product),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/products/:id
 * Admin only
 */
export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new AppError("Invalid product ID", 400);
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new AppError("Product was not found", 404);
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
