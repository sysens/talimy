CREATE TYPE "public"."staff_attendance_status" AS ENUM('present', 'late', 'absent');--> statement-breakpoint
CREATE TABLE "staff_attendance_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"status" "staff_attendance_status" NOT NULL,
	"note" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "staff_attendance_records" ADD CONSTRAINT "staff_attendance_records_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_attendance_records" ADD CONSTRAINT "staff_attendance_records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "staff_attendance_records_tenant_id_idx" ON "staff_attendance_records" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "staff_attendance_records_user_id_idx" ON "staff_attendance_records" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "staff_attendance_records_date_idx" ON "staff_attendance_records" USING btree ("date");--> statement-breakpoint
CREATE UNIQUE INDEX "staff_attendance_records_user_date_uq" ON "staff_attendance_records" USING btree ("user_id","date");
