// Next.js uses .env.local — load it explicitly for Prisma CLI
import { config } from "dotenv";
config({ path: ".env.local", override: true });

import { defineConfig } from "prisma/config";

// DIRECT_URL (port 5432) diutamakan untuk Prisma CLI (db push, migrate)
// agar tidak melalui Supabase pooler (port 6543) yang tidak mendukung DDL.
// Fallback ke DATABASE_URL agar `prisma generate` di Vercel tidak error
// meskipun DIRECT_URL belum diset sebagai environment variable.
const datasourceUrl =
  process.env.DIRECT_URL || process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: datasourceUrl,
  },
});
