import { Elysia, t } from "elysia";
import { confirmPlan, generatePlan } from "../service/planService";
import { DockerManager } from "../../../../packages/containers/src";
import { startGeneration } from "../service/generationService";

export const planController = new Elysia({
	name: "plan",
	prefix: "/plan",
})
	.guard({
		params: t.Object({
			appId: t.String({ format: "uuid" }),
		}),
	})
	.get(
		"/:appId/plan",
		async ({ params: { appId }, query: { stream } }) => {
			const responseSource = await generatePlan(appId);
			if (!stream) {
				return responseSource.toTextStreamResponse()
			}
			return responseSource.toUIMessageStream();
		},
		{
			query: t.Object({
				stream: t.Boolean({ default: false }),
			}),
		},
	)
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
	);
