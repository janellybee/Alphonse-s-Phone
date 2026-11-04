CREATE TABLE "ama_questions" (
	"id" serial PRIMARY KEY,
	"question" text NOT NULL,
	"asker" text DEFAULT 'anon' NOT NULL,
	"answer" text,
	"answered" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"answered_at" timestamp
);
--> statement-breakpoint
CREATE INDEX "ama_questions_created_idx" ON "ama_questions" ("created_at");