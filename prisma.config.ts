import "dotenv/config";
import { defineConfig } from "prisma/config";

const url = process.env.MIGRATE_DATABASE_URL ?? process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "Missing MIGRATE_DATABASE_URL (preferred) or DATABASE_URL. " +
      "Set one so Prisma can run migrations."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url,
  },
});