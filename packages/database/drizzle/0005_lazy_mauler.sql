CREATE TYPE "public"."student_document_type" AS ENUM('report_card', 'certificate', 'id_card', 'other');--> statement-breakpoint
CREATE TYPE "public"."student_scholarship_type" AS ENUM('finance', 'enrichment');--> statement-breakpoint
CREATE TYPE "public"."student_health_record_tone" AS ENUM('info', 'warning', 'danger');--> statement-breakpoint
CREATE TYPE "public"."student_extracurricular_icon" AS ENUM('swimming', 'dance', 'robotics', 'general');--> statement-breakpoint
CREATE TYPE "public"."student_behavior_log_action_status" AS ENUM('record_recognition', 'recognition_recorded', 'issue_warning', 'parent_notified');--> statement-breakpoint
CREATE TYPE "public"."student_behavior_log_entry_type" AS ENUM('positive_note', 'minor_issue', 'major_issue');--> statement-breakpoint
CREATE TABLE "student_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"document_type" "student_document_type" DEFAULT 'other' NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size_bytes" integer NOT NULL,
	"storage_key" varchar(500) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "student_scholarships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"scholarship_type" "student_scholarship_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "student_health_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"label" varchar(100) NOT NULL,
	"description" varchar(500) NOT NULL,
	"tone" "student_health_record_tone" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "student_extracurricular_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"club_name" varchar(150) NOT NULL,
	"role_label" varchar(120) NOT NULL,
	"achievement" varchar(255) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"advisor_name" varchar(150) NOT NULL,
	"icon_key" "student_extracurricular_icon" DEFAULT 'general' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "student_behavior_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"record_date" date NOT NULL,
	"entry_type" "student_behavior_log_entry_type" NOT NULL,
	"title" varchar(120) NOT NULL,
	"details" varchar(500) NOT NULL,
	"reported_by_label" varchar(150) NOT NULL,
	"action_status" "student_behavior_log_action_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "student_documents" ADD CONSTRAINT "student_documents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_documents" ADD CONSTRAINT "student_documents_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_scholarships" ADD CONSTRAINT "student_scholarships_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_scholarships" ADD CONSTRAINT "student_scholarships_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_health_records" ADD CONSTRAINT "student_health_records_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_health_records" ADD CONSTRAINT "student_health_records_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_extracurricular_records" ADD CONSTRAINT "student_extracurricular_records_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_extracurricular_records" ADD CONSTRAINT "student_extracurricular_records_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_behavior_logs" ADD CONSTRAINT "student_behavior_logs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_behavior_logs" ADD CONSTRAINT "student_behavior_logs_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "student_documents_tenant_id_idx" ON "student_documents" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "student_documents_student_id_idx" ON "student_documents" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "student_scholarships_tenant_id_idx" ON "student_scholarships" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "student_scholarships_student_id_idx" ON "student_scholarships" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "student_health_records_tenant_id_idx" ON "student_health_records" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "student_health_records_student_id_idx" ON "student_health_records" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "student_extracurricular_records_tenant_id_idx" ON "student_extracurricular_records" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "student_extracurricular_records_student_id_idx" ON "student_extracurricular_records" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "student_behavior_logs_tenant_id_idx" ON "student_behavior_logs" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "student_behavior_logs_student_id_idx" ON "student_behavior_logs" USING btree ("student_id");