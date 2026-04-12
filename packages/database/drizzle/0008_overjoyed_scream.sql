CREATE TYPE "public"."finance_expense_category" AS ENUM('custom', 'events', 'maintenance', 'others', 'salaries', 'supplies');--> statement-breakpoint
CREATE TYPE "public"."finance_reimbursement_status" AS ENUM('approved', 'declined', 'pending');--> statement-breakpoint
CREATE TABLE "finance_expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"expense_code" varchar(32) NOT NULL,
	"expense_date" date NOT NULL,
	"department" varchar(120) NOT NULL,
	"category" "finance_expense_category" NOT NULL,
	"category_label" varchar(120),
	"description" varchar(255) NOT NULL,
	"quantity" varchar(80),
	"amount" numeric(12, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "finance_reimbursements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"request_code" varchar(32) NOT NULL,
	"staff_name" varchar(160) NOT NULL,
	"department" varchar(120) NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"purpose" varchar(160) NOT NULL,
	"submitted_date" date NOT NULL,
	"proof_label" varchar(80) DEFAULT 'View File' NOT NULL,
	"proof_url" varchar(500),
	"status" "finance_reimbursement_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "finance_expenses" ADD CONSTRAINT "finance_expenses_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_reimbursements" ADD CONSTRAINT "finance_reimbursements_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "finance_expenses_tenant_id_idx" ON "finance_expenses" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "finance_expenses_expense_date_idx" ON "finance_expenses" USING btree ("expense_date");--> statement-breakpoint
CREATE INDEX "finance_expenses_category_idx" ON "finance_expenses" USING btree ("category");--> statement-breakpoint
CREATE INDEX "finance_expenses_expense_code_idx" ON "finance_expenses" USING btree ("expense_code");--> statement-breakpoint
CREATE INDEX "finance_reimbursements_tenant_id_idx" ON "finance_reimbursements" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "finance_reimbursements_submitted_date_idx" ON "finance_reimbursements" USING btree ("submitted_date");--> statement-breakpoint
CREATE INDEX "finance_reimbursements_status_idx" ON "finance_reimbursements" USING btree ("status");--> statement-breakpoint
CREATE INDEX "finance_reimbursements_request_code_idx" ON "finance_reimbursements" USING btree ("request_code");
