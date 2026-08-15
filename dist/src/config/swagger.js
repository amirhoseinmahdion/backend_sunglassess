const userSchema = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            example: 1,
        },
        name: {
            type: "string",
            example: "Amir Hosein",
        },
        email: {
            type: "string",
            format: "email",
            example: "amir@example.com",
        },
        phoneNumber: {
            type: "string",
            nullable: true,
            example: "+989121234567",
        },
        role: {
            type: "string",
            enum: ["USER", "ADMIN"],
            example: "USER",
        },
        createdAt: {
            type: "string",
            format: "date-time",
        },
        updatedAt: {
            type: "string",
            format: "date-time",
        },
    },
};
const productSchema = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            example: 1,
        },
        name: {
            type: "string",
            example: "Noir Classic",
        },
        slug: {
            type: "string",
            example: "noir-classic",
        },
        description: {
            type: "string",
            nullable: true,
            example: "Premium black sunglasses with UV400 protection.",
        },
        category: {
            type: "string",
            example: "Classic Collection",
        },
        price: {
            type: "number",
            format: "float",
            example: 120,
        },
        stock: {
            type: "integer",
            example: 20,
        },
        image: {
            type: "string",
            example: "/images/product-1.jpg",
        },
        featured: {
            type: "boolean",
            example: true,
        },
        active: {
            type: "boolean",
            example: true,
        },
        createdAt: {
            type: "string",
            format: "date-time",
        },
        updatedAt: {
            type: "string",
            format: "date-time",
        },
    },
};
export const swaggerDocument = {
    openapi: "3.0.3",
    info: {
        title: "Lunaro Sunglasses API",
        version: "1.0.0",
        description: "REST API for authentication and product management in the Lunaro sunglasses shop.",
    },
    servers: [
        {
            url: "/api",
            description: "Current API server",
        },
    ],
    tags: [
        {
            name: "Health",
            description: "Server health",
        },
        {
            name: "Authentication",
            description: "User authentication",
        },
        {
            name: "Products",
            description: "Sunglasses product management",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            User: userSchema,
            Product: productSchema,
            RegisterRequest: {
                type: "object",
                required: [
                    "name",
                    "email",
                    "password",
                    "confirmPassword",
                ],
                properties: {
                    name: {
                        type: "string",
                        minLength: 2,
                        example: "Amir Hosein",
                    },
                    email: {
                        type: "string",
                        format: "email",
                        example: "amir@example.com",
                    },
                    phoneNumber: {
                        type: "string",
                        description: "Optional phone number in international format",
                        example: "+989121234567",
                    },
                    password: {
                        type: "string",
                        format: "password",
                        minLength: 8,
                        example: "12345678",
                    },
                    confirmPassword: {
                        type: "string",
                        format: "password",
                        example: "12345678",
                    },
                },
            },
            LoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: {
                        type: "string",
                        format: "email",
                        example: "amir@example.com",
                    },
                    password: {
                        type: "string",
                        format: "password",
                        example: "12345678",
                    },
                },
            },
            AuthResponse: {
                type: "object",
                properties: {
                    success: {
                        type: "boolean",
                        example: true,
                    },
                    message: {
                        type: "string",
                        example: "Login successful",
                    },
                    data: {
                        type: "object",
                        properties: {
                            user: {
                                $ref: "#/components/schemas/User",
                            },
                            token: {
                                type: "string",
                                example: "eyJhbGciOiJIUzI1NiIs...",
                            },
                        },
                    },
                },
            },
            CreateProductRequest: {
                type: "object",
                required: [
                    "name",
                    "slug",
                    "category",
                    "price",
                    "stock",
                    "image",
                ],
                properties: {
                    name: {
                        type: "string",
                        example: "Noir Classic",
                    },
                    slug: {
                        type: "string",
                        example: "noir-classic",
                    },
                    description: {
                        type: "string",
                        nullable: true,
                        example: "Premium black sunglasses with UV400 protection.",
                    },
                    category: {
                        type: "string",
                        example: "Classic Collection",
                    },
                    price: {
                        type: "number",
                        format: "float",
                        example: 120,
                    },
                    stock: {
                        type: "integer",
                        minimum: 0,
                        example: 20,
                    },
                    image: {
                        type: "string",
                        example: "/images/product-1.jpg",
                    },
                    featured: {
                        type: "boolean",
                        default: false,
                        example: true,
                    },
                    active: {
                        type: "boolean",
                        default: true,
                        example: true,
                    },
                },
            },
            UpdateProductRequest: {
                type: "object",
                minProperties: 1,
                properties: {
                    name: {
                        type: "string",
                        example: "Noir Classic Updated",
                    },
                    slug: {
                        type: "string",
                        example: "noir-classic-updated",
                    },
                    description: {
                        type: "string",
                        nullable: true,
                        example: "Updated product description.",
                    },
                    category: {
                        type: "string",
                        example: "Premium Collection",
                    },
                    price: {
                        type: "number",
                        format: "float",
                        example: 130,
                    },
                    stock: {
                        type: "integer",
                        minimum: 0,
                        example: 15,
                    },
                    image: {
                        type: "string",
                        example: "/images/product-1-updated.jpg",
                    },
                    featured: {
                        type: "boolean",
                        example: true,
                    },
                    active: {
                        type: "boolean",
                        example: true,
                    },
                },
            },
            ErrorResponse: {
                type: "object",
                properties: {
                    success: {
                        type: "boolean",
                        example: false,
                    },
                    message: {
                        type: "string",
                        example: "Validation failed",
                    },
                    details: {
                        type: "object",
                        additionalProperties: true,
                    },
                },
            },
            ProductResponse: {
                type: "object",
                properties: {
                    success: {
                        type: "boolean",
                        example: true,
                    },
                    message: {
                        type: "string",
                        example: "Product created successfully",
                    },
                    data: {
                        type: "object",
                        properties: {
                            product: {
                                $ref: "#/components/schemas/Product",
                            },
                        },
                    },
                },
            },
            ProductsResponse: {
                type: "object",
                properties: {
                    success: {
                        type: "boolean",
                        example: true,
                    },
                    data: {
                        type: "object",
                        properties: {
                            products: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/Product",
                                },
                            },
                            pagination: {
                                type: "object",
                                properties: {
                                    page: {
                                        type: "integer",
                                        example: 1,
                                    },
                                    limit: {
                                        type: "integer",
                                        example: 12,
                                    },
                                    total: {
                                        type: "integer",
                                        example: 3,
                                    },
                                    totalPages: {
                                        type: "integer",
                                        example: 1,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    paths: {
        "/health": {
            get: {
                tags: ["Health"],
                summary: "Check API status",
                responses: {
                    "200": {
                        description: "API is working",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        message: {
                                            type: "string",
                                            example: "Lunaro API is working",
                                        },
                                        timestamp: {
                                            type: "string",
                                            format: "date-time",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/auth/register": {
            post: {
                tags: ["Authentication"],
                summary: "Register a new user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/RegisterRequest",
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Account created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/AuthResponse",
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    "409": {
                        description: "Email already exists",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/auth/login": {
            post: {
                tags: ["Authentication"],
                summary: "Login user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/LoginRequest",
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Login successful",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/AuthResponse",
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Incorrect email or password",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/auth/profile": {
            get: {
                tags: ["Authentication"],
                summary: "Get logged-in user profile",
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    "200": {
                        description: "Authenticated user profile",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        data: {
                                            type: "object",
                                            properties: {
                                                user: {
                                                    $ref: "#/components/schemas/User",
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Invalid or missing token",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    "404": {
                        description: "User not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/products": {
            get: {
                tags: ["Products"],
                summary: "Get and search active products",
                parameters: [
                    {
                        in: "query",
                        name: "search",
                        required: false,
                        description: "Search by product name, category, or description",
                        schema: {
                            type: "string",
                        },
                        example: "noir",
                    },
                    {
                        in: "query",
                        name: "category",
                        required: false,
                        schema: {
                            type: "string",
                        },
                        example: "Classic Collection",
                    },
                    {
                        in: "query",
                        name: "featured",
                        required: false,
                        schema: {
                            type: "boolean",
                        },
                        example: true,
                    },
                    {
                        in: "query",
                        name: "page",
                        required: false,
                        schema: {
                            type: "integer",
                            minimum: 1,
                            default: 1,
                        },
                    },
                    {
                        in: "query",
                        name: "limit",
                        required: false,
                        schema: {
                            type: "integer",
                            minimum: 1,
                            maximum: 100,
                            default: 12,
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Products returned successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ProductsResponse",
                                },
                            },
                        },
                    },
                    "500": {
                        description: "Internal server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ["Products"],
                summary: "Create a new product",
                description: "Only users with the ADMIN role can create products.",
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CreateProductRequest",
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Product created successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ProductResponse",
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Authentication required",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    "403": {
                        description: "Administrator access required",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    "409": {
                        description: "Product slug already exists",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/products/{idOrSlug}": {
            get: {
                tags: ["Products"],
                summary: "Get one active product by ID or slug",
                parameters: [
                    {
                        in: "path",
                        name: "idOrSlug",
                        required: true,
                        schema: {
                            type: "string",
                        },
                        examples: {
                            productId: {
                                value: "1",
                                summary: "Product ID",
                            },
                            productSlug: {
                                value: "noir-classic",
                                summary: "Product slug",
                            },
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Product returned successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ProductResponse",
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Product identifier is required",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    "404": {
                        description: "Product not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/products/{id}": {
            patch: {
                tags: ["Products"],
                summary: "Update a product",
                description: "Only users with the ADMIN role can update products.",
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "integer",
                            minimum: 1,
                        },
                        example: 1,
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/UpdateProductRequest",
                            },
                            example: {
                                price: 135,
                                stock: 30,
                                featured: true,
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Product updated successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ProductResponse",
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Invalid ID or request body",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Authentication required",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    "403": {
                        description: "Administrator access required",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    "404": {
                        description: "Product not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    "409": {
                        description: "Product slug already exists",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
            delete: {
                tags: ["Products"],
                summary: "Delete a product",
                description: "Only users with the ADMIN role can delete products.",
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "integer",
                            minimum: 1,
                        },
                        example: 1,
                    },
                ],
                responses: {
                    "200": {
                        description: "Product deleted successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean",
                                            example: true,
                                        },
                                        message: {
                                            type: "string",
                                            example: "Product deleted successfully",
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Invalid product ID",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Authentication required",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    "403": {
                        description: "Administrator access required",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    "404": {
                        description: "Product not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
