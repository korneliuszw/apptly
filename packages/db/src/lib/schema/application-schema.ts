import { sql } from "drizzle-orm";
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

export const applicationStepsTable = t.pgTable("application_steps", {
	id: t.uuid().primaryKey().defaultRandom(),
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
});

export const artificatTypeEnum = t.pgEnum("artifact_type", ["apk", "code"]);

export const applicationArtifactsTable = t.pgTable("application_artifacts", {
	id: t.uuid().primaryKey().default(sql`uuidv7()`),
	applicationId: t
		.uuid("application_id")
		.references(() => applicationTable.id, { onDelete: "cascade" })
		.notNull(),
	type: artificatTypeEnum().notNull(),
	url: t.text("url").notNull(),
	deletedAt: t.timestamp("deleted_at"),
});
