import {
	applicationStepsDictionaryTable,
	applicationStepsTable,
	db,
} from "@apptly/db/src/index";
import { applicationTable } from "@apptly/db/src/lib/schema/application-schema";
import { and, eq, isNull } from "drizzle-orm";

export const getApplications = (userId: string) => {
	return db
		.select({ id: applicationTable.id })
		.from(applicationTable)
		.where(eq(applicationTable.ownerId, userId));
};

export const getApplicationStepsDefinitionsWithAnswers = (
	applicationId: string,
) => {
	return db
		.select({
			dictionaryId: applicationStepsDictionaryTable.id,
			title: applicationStepsDictionaryTable.title,
			description: applicationStepsDictionaryTable.description,
			interactions: applicationStepsDictionaryTable.interactions,
			stepNumber: applicationStepsDictionaryTable.stepNumber,
			answers: applicationStepsTable.interactionAnswers,
			id: applicationStepsTable.id,
		})
		.from(applicationStepsDictionaryTable)
		.where(isNull(applicationStepsDictionaryTable.deletedAt))
		.leftJoin(
			applicationStepsTable,
			and(
				eq(
					applicationStepsTable.dictionaryId,
					applicationStepsDictionaryTable.id,
				),
				eq(applicationStepsTable.applicationId, applicationId),
			),
		)
		.orderBy(applicationStepsDictionaryTable.stepNumber);
};

export const doesApplicationExist = (applicationId: string, userId: string) => {
	return db
		.select({ id: applicationTable.id })
		.from(applicationTable)
		.where(
			and(
				eq(applicationTable.id, applicationId),
				eq(applicationTable.ownerId, userId),
				isNull(applicationTable.deletedAt),
			),
		)
		.then((result) => result.length > 0);
};

export const upsertStepAnswer = (
	answer: object,
	applicationId: string,
	dictionaryId: string,
	id?: string,
) => {
	return db
		.insert(applicationStepsTable)
		.values({
			applicationId,
			dictionaryId,
			interactionAnswers: answer,
			id,
		})
		.onConflictDoUpdate({
			target: [applicationStepsTable.applicationId, applicationStepsTable.id],
			set: {
				interactionAnswers: answer,
				updatedAt: new Date(),
			},
		})
		.execute();
};

export const getApplicationSteps = (projectId: string) => {
	return db
		.select()
		.from(applicationStepsTable)
		.where(eq(applicationStepsTable.applicationId, projectId))
		.innerJoin(
			applicationStepsDictionaryTable,
			eq(
				applicationStepsDictionaryTable.id,
				applicationStepsTable.dictionaryId,
			),
		);
};

export const createApplication = (name: string, description: string, ownerId: string) => {
	return db.insert(applicationTable).values({
		name,
		description,
		ownerId,
	}).returning({ id: applicationTable.id });
}
