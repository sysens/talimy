CREATE TYPE "public"."teacher_workload_dataset" AS ENUM('last_8_months', 'this_semester');--> statement-breakpoint
CREATE TYPE "public"."teacher_training_semester" AS ENUM('current', 'previous');--> statement-breakpoint
CREATE TYPE "public"."teacher_training_status" AS ENUM('upcoming', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."teacher_attendance_status" AS ENUM('present', 'late', 'on_leave');--> statement-breakpoint
CREATE TYPE "public"."teacher_leave_request_status" AS ENUM('pending', 'approved', 'declined');--> statement-breakpoint
CREATE TYPE "public"."teacher_leave_request_type" AS ENUM('annual_leave', 'personal_leave', 'sick_leave', 'unpaid_leave');--> statement-breakpoint
CREATE TYPE "public"."teacher_performance_period" AS ENUM('last_month', 'last_quarter');--> statement-breakpoint
CREATE TABLE "teacher_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"teacher_id" uuid NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size_bytes" integer NOT NULL,
	"storage_key" varchar(500) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "teacher_workload_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"teacher_id" uuid NOT NULL,
	"dataset" "teacher_workload_dataset" NOT NULL,
	"period_date" date NOT NULL,
	"label" varchar(24) NOT NULL,
	"sort_order" integer NOT NULL,
	"total_classes" integer NOT NULL,
	"teaching_hours" integer NOT NULL,
	"extra_duties" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "teacher_training_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"teacher_id" uuid NOT NULL,
	"semester" "teacher_training_semester" NOT NULL,
	"title" varchar(255) NOT NULL,
	"subtitle" varchar(100) NOT NULL,
	"event_date" date NOT NULL,
	"location_label" varchar(255) NOT NULL,
	"status" "teacher_training_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "teacher_attendance_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"teacher_id" uuid NOT NULL,
	"date" date NOT NULL,
	"status" "teacher_attendance_status" NOT NULL,
	"note" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "teacher_leave_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"teacher_id" uuid NOT NULL,
	"request_type" "teacher_leave_request_type" NOT NULL,
	"reason" varchar(500) NOT NULL,
	"status" "teacher_leave_request_status" DEFAULT 'pending' NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"decided_at" timestamp with time zone,
	"decided_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "teacher_performance_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"teacher_id" uuid NOT NULL,
	"period" "teacher_performance_period" NOT NULL,
	"grading_timeliness_value" integer NOT NULL,
	"grading_timeliness_target" integer NOT NULL,
	"student_average_grade_value" integer NOT NULL,
	"student_average_grade_target" integer NOT NULL,
	"student_feedback_value" integer NOT NULL,
	"student_feedback_target" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "address" varchar(500);--> statement-breakpoint
ALTER TABLE "teacher_documents" ADD CONSTRAINT "teacher_documents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_documents" ADD CONSTRAINT "teacher_documents_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_workload_snapshots" ADD CONSTRAINT "teacher_workload_snapshots_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_workload_snapshots" ADD CONSTRAINT "teacher_workload_snapshots_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_training_records" ADD CONSTRAINT "teacher_training_records_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_training_records" ADD CONSTRAINT "teacher_training_records_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_attendance_records" ADD CONSTRAINT "teacher_attendance_records_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_attendance_records" ADD CONSTRAINT "teacher_attendance_records_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_leave_requests" ADD CONSTRAINT "teacher_leave_requests_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_leave_requests" ADD CONSTRAINT "teacher_leave_requests_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_leave_requests" ADD CONSTRAINT "teacher_leave_requests_decided_by_user_id_users_id_fk" FOREIGN KEY ("decided_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_performance_snapshots" ADD CONSTRAINT "teacher_performance_snapshots_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_performance_snapshots" ADD CONSTRAINT "teacher_performance_snapshots_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "teacher_documents_tenant_id_idx" ON "teacher_documents" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "teacher_documents_teacher_id_idx" ON "teacher_documents" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "teacher_workload_snapshots_tenant_id_idx" ON "teacher_workload_snapshots" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "teacher_workload_snapshots_teacher_id_idx" ON "teacher_workload_snapshots" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "teacher_workload_snapshots_dataset_idx" ON "teacher_workload_snapshots" USING btree ("dataset");--> statement-breakpoint
CREATE INDEX "teacher_training_records_tenant_id_idx" ON "teacher_training_records" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "teacher_training_records_teacher_id_idx" ON "teacher_training_records" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "teacher_training_records_semester_idx" ON "teacher_training_records" USING btree ("semester");--> statement-breakpoint
CREATE INDEX "teacher_attendance_records_tenant_id_idx" ON "teacher_attendance_records" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "teacher_attendance_records_teacher_id_idx" ON "teacher_attendance_records" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "teacher_attendance_records_date_idx" ON "teacher_attendance_records" USING btree ("date");--> statement-breakpoint
CREATE UNIQUE INDEX "teacher_attendance_records_teacher_date_uq" ON "teacher_attendance_records" USING btree ("teacher_id","date");--> statement-breakpoint
CREATE INDEX "teacher_leave_requests_tenant_id_idx" ON "teacher_leave_requests" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "teacher_leave_requests_teacher_id_idx" ON "teacher_leave_requests" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "teacher_leave_requests_status_idx" ON "teacher_leave_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "teacher_performance_snapshots_tenant_id_idx" ON "teacher_performance_snapshots" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "teacher_performance_snapshots_teacher_id_idx" ON "teacher_performance_snapshots" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "teacher_performance_snapshots_period_idx" ON "teacher_performance_snapshots" USING btree ("period");--> statement-breakpoint
CREATE UNIQUE INDEX "teacher_performance_snapshots_teacher_period_uq" ON "teacher_performance_snapshots" USING btree ("teacher_id","period");