import { Router } from "express";

import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const productRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Sunglasses product management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get and search products
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: noir
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         example: Classic Collection
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: Product list returned successfully
 */
productRouter.get("/", getProducts);

/**
 * @swagger
 * /products/{idOrSlug}:
 *   get:
 *     summary: Get one product by ID or slug
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: idOrSlug
 *         required: true
 *         schema:
 *           type: string
 *         example: noir-classic
 *     responses:
 *       200:
 *         description: Product returned successfully
 *       404:
 *         description: Product not found
 */
productRouter.get("/:idOrSlug", getProduct);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a product
 *     description: Admin access only
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateProductRequest"
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Administrator access required
 *       409:
 *         description: Product slug already exists
 */
productRouter.post(
  "/",
  requireAuth,
  requireAdmin,
  createProduct,
);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update a product
 *     description: Admin access only
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateProductRequest"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Administrator access required
 *       404:
 *         description: Product not found
 */
productRouter.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  updateProduct,
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Admin access only
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Administrator access required
 *       404:
 *         description: Product not found
 */
productRouter.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  deleteProduct,
);