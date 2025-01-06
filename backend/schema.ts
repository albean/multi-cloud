import { relations } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as p from "drizzle-orm/pg-core";

export const db = drizzle(process.env.DATABASE_URL!);

export const orders = p.pgTable("orders", {
  id: p.serial().primaryKey(),
  email: p.text().notNull(),
  firstName: p.text().notNull(),
  lastName: p.text().notNull(),
  eventId: p.integer().notNull(),
});

export const events = p.pgTable("events", {
  id: p.serial().primaryKey(),
  slug: p.text().unique().notNull(),
  name: p.text().notNull(),
  image: p.text().notNull(),
  date: p.text().notNull(),
});


export const postsRelations = relations(orders, ({ one }) => ({
	event: one(events, {
		fields: [orders.eventId],
		references: [events.id],
	}),
}));

export type Event = typeof events.$inferSelect
export type Order = typeof orders.$inferSelect
export type OrderFields = typeof orders.$inferInsert

export const fixtures = p.pgTable("fixtures", {
  name: p.text().primaryKey(),
});


