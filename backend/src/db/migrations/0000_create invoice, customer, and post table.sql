CREATE TABLE IF NOT EXISTS "customer" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"notes" text,
	"customer_id" bigint NOT NULL,
	"salesperson" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "salesperson" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL
);
