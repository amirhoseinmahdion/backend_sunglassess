import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import { env } from "./env.js";

const databaseUrl = new URL(env.DATABASE_URL);
const databaseHostname = databaseUrl.hostname;
const isLocalDatabase =
  databaseHostname === "localhost" ||
  databaseHostname === "127.0.0.1";

if (!isLocalDatabase) {
  databaseUrl.searchParams.delete("sslmode");
  databaseUrl.searchParams.delete("sslcert");
  databaseUrl.searchParams.delete("sslkey");
  databaseUrl.searchParams.delete("sslrootcert");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl.toString(),
  ssl: isLocalDatabase
    ? false
    : {
        rejectUnauthorized: false,
      },
});

export const prisma = new PrismaClient({
  adapter,
});
