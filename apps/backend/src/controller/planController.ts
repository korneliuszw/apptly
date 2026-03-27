import { Elysia, t } from "elysia";
import { confirmPlan, generatePlan } from "../service/planService";
import { DockerManager } from "../../../../packages/containers/src";
import { startGeneration } from "../service/generationService";

export const planController = new Elysia({
	name: "plan",
	prefix: "/plan",
}).guard(
	{
		params: t.Object({
			appId: t.String({ format: "uuid" }),
		}),
	},
	(app) =>
		app
			.get("/:appId/plan", async ({ params: { appId } }) => {
				const stream = await generatePlan(appId);
				return stream.toUIMessageStream();
			})
            .decorate("docker", new DockerManager())
			.post(
				"/:appId/confirm",
				async ({ params: { appId }, body: { plan }, docker }) => {
					const planId = await confirmPlan(appId, plan);
					await startGeneration(docker, planId);
                    return { message: "Plan confirmed and generation started." };
				},
				{
					body: t.Object({
						plan: t.String({ maxLength: 15000 }), // Assuming the plan is a string, adjust maxLength as needed
					}),
				},
			),
);
