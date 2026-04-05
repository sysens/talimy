CREATE TYPE "public"."teacher_document_type" AS ENUM('diploma', 'certificate', 'id_card', 'other');--> statement-breakpoint
CREATE TABLE "teacher_subject_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"teacher_id" uuid NOT NULL,
	"subject_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "teacher_class_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"teacher_id" uuid NOT NULL,
	"class_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "middle_name" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "nationality" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "telegram_username" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar_storage_key" varchar(500);--> statement-breakpoint
ALTER TABLE "teacher_documents" ADD COLUMN "document_type" "teacher_document_type" DEFAULT 'other' NOT NULL;--> statement-breakpoint
ALTER TABLE "teacher_subject_assignments" ADD CONSTRAINT "teacher_subject_assignments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_subject_assignments" ADD CONSTRAINT "teacher_subject_assignments_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_subject_assignments" ADD CONSTRAINT "teacher_subject_assignments_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_class_assignments" ADD CONSTRAINT "teacher_class_assignments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_class_assignments" ADD CONSTRAINT "teacher_class_assignments_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_class_assignments" ADD CONSTRAINT "teacher_class_assignments_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "teacher_subject_assignments_tenant_id_idx" ON "teacher_subject_assignments" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "teacher_subject_assignments_teacher_id_idx" ON "teacher_subject_assignments" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "teacher_subject_assignments_subject_id_idx" ON "teacher_subject_assignments" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "teacher_class_assignments_tenant_id_idx" ON "teacher_class_assignments" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "teacher_class_assignments_teacher_id_idx" ON "teacher_class_assignments" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "teacher_class_assignments_class_id_idx" ON "teacher_class_assignments" USING btree ("class_id");