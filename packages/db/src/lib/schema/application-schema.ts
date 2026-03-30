import { desc, sql } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const applicationTable = t.pgTable(
	"application",
	{
		id: t.uuid("id").primaryKey().default(sql`uuidv7()`),
		name: t.varchar({ length: 250 }).notNull(),
		description: t.varchar({ length: 2000 }),
		createdAt: t.timestamp("created_at").notNull().defaultNow(),
		updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
		ownerId: t
			.text("owner_id")
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		clonedFrom: t.uuid("cloned_from"),
		deletedAt: t.timestamp("deleted_at"),
	},
	(table) => [
		t.foreignKey({
			columns: [table.clonedFrom],
			foreignColumns: [table.id],
			name: "application_cloned_from_fkey",
		}),
	],
);

export const applicationStepsDictionaryTable = t.pgTable(
	"application_steps_dictionary",
	{
		id: t.uuid().primaryKey().default(sql`uuidv7()`),
		title: t.text().notNull(),
		description: t.text().notNull(),
		interactions: t.jsonb().default("[]").notNull(),
		stepNumber: t.integer("step_number").notNull(),
		basePrompt: t.text("base_prompt").notNull(),
		createdAt: t.timestamp("created_at").notNull().defaultNow(),
		updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
		deletedAt: t.timestamp("deleted_at"),
	},
);

export const applicationStepsTable = t.pgTable(
	"application_steps",
	{
		id: t.uuid().defaultRandom(),
		applicationId: t
			.uuid("application_id")
			.references(() => applicationTable.id, { onDelete: "cascade" })
			.notNull(),
		dictionaryId: t
			.uuid("dictionary_id")
			.references(() => applicationStepsDictionaryTable.id, {
				onDelete: "set null",
			}),
		interactionAnswers: t.jsonb("interaction_answers").notNull(),
		createdAt: t.timestamp("created_at").notNull().defaultNow(),
		updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => [
		t.primaryKey({
			name: "application_steps_pkey",
			columns: [table.id, table.applicationId],
		}),
	],
);

export const artificatTypeEnum = t.pgEnum("artifact_type", ["apk", "code"]);

export const applicationArtifactsTable = t.pgTable("application_artifacts", {
	id: t.uuid().primaryKey().default(sql`uuidv7()`),
	generationId: t.uuid("generation_id").references(() => applicationGenerationTable.id, { onDelete: "cascade" }),
	type: artificatTypeEnum().notNull(),
	url: t.text("url").notNull(),
	deletedAt: t.timestamp("deleted_at"),
});

export const applicationPlanTable = t.pgTable("application_plan", {
	id: t.uuid().primaryKey().default(sql`uuidv7()`),
	applicationId: t
		.uuid("application_id")
		.references(() => applicationTable.id, { onDelete: "cascade" })
		.notNull(),
	plan: t.text("plan").notNull(),
	createdAt: t.timestamp("created_at").notNull().defaultNow(),
	updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
	deletedAt: t.timestamp("deleted_at"),
});

export const applicationGenerationStatusEnum = t.pgEnum("generation_status", [
	"pending",
	"in_progress",
	"completed",
	"failed",
]);

export const applicationGenerationTable = t.pgTable("application_generation", {
	id: t.uuid().primaryKey().default(sql`uuidv7()`),
	applicationPlanId: t
		.uuid("application_plan_id")
		.references(() => applicationPlanTable.id, { onDelete: "cascade" })
		.notNull(),
	status: applicationGenerationStatusEnum("status").notNull(),
	containerId: t.varchar("container_id", {length: 64}),
	containerAlive: t.boolean("container_alive").notNull().default(true),
	content: t.text("description"),
	createdAt: t.timestamp("created_at").notNull().defaultNow(),
	updatedAt: t.timestamp("updated_at").notNull().defaultNow(),
	finishedAt: t.timestamp("finished_at"),
	deletedAt: t.timestamp("deleted_at"),
});