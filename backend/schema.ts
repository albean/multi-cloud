import { drizzle } from 'drizzle-orm/node-postgres';
import * as p from "drizzle-orm/pg-core";

export const db = drizzle(process.env.DATABASE_URL!);

export const orders = p.pgTable("orders", {
  id: p.serial().primaryKey(),
  email: p.text(),
  firstName: p.text(),
});

export const events = p.pgTable("orders", {
  id: p.serial().primaryKey(),
  email: p.text(),
  firstName: p.text(),
});


