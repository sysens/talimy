CREATE TYPE "public"."student_grant_type" AS ENUM('zakat', 'sponsor', 'other');--> statement-breakpoint
CREATE TYPE "public"."student_meal_plan" AS ENUM('none', 'one_meal', 'three_meals');--> statement-breakpoint
CREATE TYPE "public"."student_residence_permit_status" AS ENUM('obtained', 'pending_90_days', 'none');--> statement-breakpoint
CREATE TABLE "student_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"admission_number" varchar(50) NOT NULL,
	"previous_school" varchar(255) NOT NULL,
	"hobbies_interests" varchar(500),
	"special_needs_support" boolean DEFAULT false NOT NULL,
	"medical_condition_alert" boolean DEFAULT false NOT NULL,
	"medical_condition_details" varchar(1000),
	"grant_type" "student_grant_type",
	"total_fee" numeric(12, 2),
	"paid_amount" numeric(12, 2),
	"dormitory_room" varchar(50),
	"meals_per_day" "student_meal_plan",
	"residence_permit_status" "student_residence_permit_status",
	"contract_number" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "tenant_student_module_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"finance_enabled" boolean DEFAULT true NOT NULL,
	"grant_enabled" boolean DEFAULT true NOT NULL,
	"dormitory_enabled" boolean DEFAULT true NOT NULL,
	"meals_enabled" boolean DEFAULT true NOT NULL,
	"residence_permit_enabled" boolean DEFAULT true NOT NULL,
	"contract_number_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_student_module_settings" ADD CONSTRAINT "tenant_student_module_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "student_profiles_tenant_id_idx" ON "student_profiles" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "student_profiles_student_id_uidx" ON "student_profiles" USING btree ("student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "student_profiles_tenant_admission_number_uidx" ON "student_profiles" USING btree ("tenant_id","admission_number");--> statement-breakpoint
CREATE UNIQUE INDEX "tenant_student_module_settings_tenant_id_uidx" ON "tenant_student_module_settings" USING btree ("tenant_id");