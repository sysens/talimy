CREATE TYPE "public"."event_visibility" AS ENUM('all', 'admin', 'teachers', 'students');--> statement-breakpoint
ALTER TYPE "public"."event_type" ADD VALUE 'events' BEFORE 'exam';--> statement-breakpoint
ALTER TYPE "public"."event_type" ADD VALUE 'finance' BEFORE 'exam';--> statement-breakpoint
ALTER TYPE "public"."event_type" ADD VALUE 'administration' BEFORE 'exam';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "visibility" "event_visibility" DEFAULT 'all' NOT NULL;--> statement-breakpoint
CREATE INDEX "events_visibility_idx" ON "events" USING btree ("visibility");