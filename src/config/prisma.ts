import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import { env } from "./env.js";

const databaseHostname = new URL(env.DATABASE_URL).hostname;
const isLocalDatabase =
  databaseHostname === "localhost" ||
  databaseHostname === "127.0.0.1";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
  ssl: isLocalDatabase
    ? false
    : {
        rejectUnauthorized: false,
      },
});

export const prisma = new PrismaClient({
  adapter,
});
