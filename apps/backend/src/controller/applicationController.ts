import { Elysia, t } from "elysia";
import {
	doesApplicationExist,
	getApplicationStepsDefinitionsWithAnswers,
	getApplications,
	upsertStepAnswer,
} from "../repository/applicationRepository";
import { stepAnswerSchema } from "../schema/applicationSchema";
import { planController } from "./planController";

export const applicationController = new Elysia({
	name: "application",
	prefix: "/application",
})
	.get("/", async () => {
		const userId = process.env.USER_ID!
		console.log("Fetching applications for user:", userId);
		return await getApplications(userId);
	})
	.guard(
		{
			beforeHandle: async ({ params: { appId }, status }) => {
				const userId = process.env.USER_ID!
				const doesExist = await doesApplicationExist(appId, userId);
				if (!doesExist) {
					return status(404);
				}
			},
			params: t.Object({
				appId: t.String({ format: "uuid" }),
			}),
		},
		(app) =>
			app
				.use(planController)
				.get("/:appId/steps", async ({ params: { appId } }) => {
					return await getApplicationStepsDefinitionsWithAnswers(appId);
				})
				.put(
					"/:appId/answer",
					async ({ params: { appId }, body }) => {
						await upsertStepAnswer(
							body.interactionAnswers,
							appId,
							body.dictionaryId,
							body.id,
						);
					},
					stepAnswerSchema,
				),
	);
