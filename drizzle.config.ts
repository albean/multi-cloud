import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './backend/drizzle',
  schema: './backend/schema.ts',
  dialect: 'postgresql',
  migrations: {
    table: 'migrations',
    schema: 'public',
  },
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
