import { Elysia, t } from "elysia";
import {
	doesApplicationExist,
	getApplicationStepsDefinitionsWithAnswers,
	getApplications,
	upsertStepAnswer,
} from "../repository/applicationRepository";
import { stepAnswerSchema } from "../schema/applicationSchema";
import { planController } from "./planController";
import { getApplicationPlansWithGenerations } from "../repository/generationRepository";
import { requireUser } from "../middleware/requireUser";
import { requireEntityOwnershipFactory } from "../middleware/requireEntityOnwership";

const requireProjectOwnership = requireEntityOwnershipFactory("appId", doesApplicationExist);

export const applicationController = new Elysia({
	name: "application",
	prefix: "/application",
})
	.use(requireUser)
	.get("/", async ({ user }) => {
		return await getApplications(user.id);
	})
	.use(requireProjectOwnership)
	.get("/:appId/details", async ({ params: { appId }, user }) => {
		const steps = await getApplicationStepsDefinitionsWithAnswers(appId);
		const generatedPlans = await getApplicationPlansWithGenerations(appId);
		return { steps, generatedPlans };
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
	);
