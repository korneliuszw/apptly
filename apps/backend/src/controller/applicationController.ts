import { Elysia, t } from "elysia";
import {
	doesApplicationExist,
	getApplicationStepsDefinitionsWithAnswers,
	getApplications,
} from "../repository/applicationRepository";

export const applicationController = new Elysia({
	name: "application",
	prefix: "/application",
})
	.get("/", async () => {
		const userId = "MS5spSe3vKagG2U6LYVl5EyuRMOpWVWD";
		return await getApplications(userId);
	})
	.guard(
		{
			beforeHandle: async ({ params: { appId }, status }) => {
				const userId = "MS5spSe3vKagG2U6LYVl5EyuRMOpWVWD";
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
				.get("/:appId/steps", async ({ params: { appId } }) => {
					return await getApplicationStepsDefinitionsWithAnswers(appId);
				})
				.post("/:appId/step", async ({ params: { appId }, body }) => {}),
	);
