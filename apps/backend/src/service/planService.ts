import { getApplicationSteps } from "../repository/applicationRepository";
import * as ai from "ai";
import { createApplicationPlan } from "../repository/generationRepository";
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
const MAX_OUTPUT_TOKENS = 10000;
const systemPrompt = await Bun.file("plan.prompt.txt").text();


const openAIProvider = createOpenAICompatible({
  name: "generic",
  apiKey: process.env.AI_API_KEY!,
  baseURL: process.env.OPENAI_BASE_URL || "https://nano-gpt.com/api/v1",
  includeUsage: true
});

const model = openAIProvider(process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL!)

export const generatePlan = async (appId: string) => {
	const steps = await getApplicationSteps(appId);

	const userAnswers: Record<
		string,
		{ questionFormat: object; answer: object }
	> = steps.reduce(
		(acc, step) => {
			const questionAndAnswer = {
				questionFormat: step.application_steps_dictionary
					.interactions as object,
				answer: step.application_steps.interactionAnswers as object,
			};
			acc[step.application_steps_dictionary.description] = questionAndAnswer;
			return acc;
		},
		{} as Record<
			string,
			{ questionFormat: object; answer: object }
		>,
	);

	const prompt = JSON.stringify(userAnswers, null, 2);
	return ai.streamText({
		prompt,
		system: systemPrompt,
		model,
		maxOutputTokens: MAX_OUTPUT_TOKENS,
	});
};

export const confirmPlan = async (appId: string, plan: string) => {
    const result = await createApplicationPlan(appId, plan);
    if (!result.length) {
        throw new Error("Failed to save the plan");
    }
    return result[0].id
}