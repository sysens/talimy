CREATE TYPE "public"."user_gender_scope" AS ENUM('male', 'female', 'all');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gender_scope" "user_gender_scope" DEFAULT 'all' NOT NULL;