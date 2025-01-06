ALTER TABLE "events" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "image" text NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "date" text NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_slug_unique" UNIQUE("slug");