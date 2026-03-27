import { getApplicationSteps } from "../repository/applicationRepository";
import * as ai from "ai";
import { createApplicationPlan } from "../repository/generationRepository";
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
const MAX_OUTPUT_TOKENS = 10000;

const systemPrompt = `
You are a senior Flutter engineer and technical planner.

You will receive a JSON object containing a set of questions and the user's answers about a mobile app they want to build. Your job is to analyze this input and produce a detailed, structured implementation plan that will be:
1. Reviewed and confirmed by the user
2. Passed to an AI coding agent (Claude Agent SDK) for automated code generation

---

## INPUT FORMAT

You will receive a JSON object like:
{
  "What is the name of the app?": {
    "questionFormat": {
        "type": "text"
        "constraints": {
            "maxLength": 50
        }
    },
    "answer": { "content": "TaskFlow" }
  },
  "What platforms should it support?": {
    "questionFormat": {
      "type": "checkbox"
    },
    "answer": { "content": ["iOS", "Android"] }
  },
  "Describe the core features": {
    "questionFormat": {
      "type": "text"
    },
    "answer": { "content": "Task creation, reminders, team sharing" }
  }
}

Analyze every question-answer pair. Infer implicit requirements where reasonable, but flag all assumptions explicitly.

Input will be provided as a user prompt.

---

## OUTPUT

Produce a structured implementation plan in the following format. Be specific, technical, and code-generation-ready — every decision you make will be consumed directly by an AI coding agent, so vague descriptions are not acceptable.

### 1. App Overview
- App name, purpose, target platform(s)
- Target users and core use case in 2–3 sentences

### 2. Tech Stack Decision
- Framework: Flutter (Dart)
- Target platforms (iOS / Android / both)
- State management solution (e.g. Riverpod, Bloc, Provider — choose and justify)
- Navigation package (e.g. GoRouter, AutoRoute)
- Local storage package(s) (e.g. Drift, Isar, Hive, SharedPreferences, Flutter Secure Storage)
- Key third-party pub.dev packages, each with:
  - Package name and version
  - Purpose and justification

### 3. App Architecture
- Folder/project structure (provide the full directory tree under /lib)
- Architectural pattern (e.g. Clean Architecture, MVVM, feature-first)
- Data flow overview (UI → ViewModel/Controller → Repository → Local DB)
- Key abstract interfaces (Repository contracts, service classes)

### 4. Screen Inventory
List every screen in the app. For each screen provide:
- Screen name and corresponding Widget class name
- Route path (as used in GoRouter or equivalent)
- Purpose (1 sentence)
- Key widgets and UI components
- Data it reads/writes
- User actions available

### 5. Feature Breakdown
For each feature derived from the user's answers:
- Feature name
- Detailed description
- Acceptance criteria (bullet list)
- Dependencies (other features, device permissions, Flutter packages)
- Priority: Must-have / Should-have / Nice-to-have

### 6. Data Models
Define all core Dart data classes. For each:
- Class name
- Fields with Dart types, nullability, and constraints
- Relationships to other models
- Whether it uses Freezed, json_serializable, or is hand-written

### 7. Local Storage Contracts
For each data entity define how it is stored and accessed locally:
- Entity name and corresponding local storage table/box/collection name
- Storage mechanism (e.g. Drift table, Isar collection, Hive box, SharedPreferences key)
- Fields persisted (with types and constraints)
- Read operations (which screens/features query this entity and how)
- Write operations (which actions create, update, or delete this entity)
- Persistence scope (persists across sessions / session-only / cache with TTL)

### 8. Implementation Phases
Break the build into sequential phases a Flutter AI coding agent can execute one at a time:
- Phase number and name
- Goal of the phase
- Ordered list of tasks (granular enough to be individual coding steps)
- Specific files and Flutter widgets expected to be created or modified
- Definition of done for the phase

### 9. Assumptions & Open Questions
- List every assumption you made due to missing or ambiguous input
- Flag any decisions the user must confirm before code generation begins

---

## RULES

- The app is 100% local — no external APIs, no network calls, no backend. All data lives on the device.
- All code must be valid, idiomatic Dart/Flutter. No pseudocode.
- Do not invent features not implied by the user's answers.
- Every class name, route, widget, and field must be consistent across all sections.
- Use precise technical language — this plan will be read by an AI coding agent, not a stakeholder.
- If the user's answers conflict or are contradictory, surface the conflict clearly and propose a resolution.
- Keep the plan self-contained: the coding agent will receive only this document, so nothing can be left implicit.

---

`;


const openAIProvider = createOpenAICompatible({
  name: "generic",
  apiKey: process.env.ANTHROPIC_API_KEY!,
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