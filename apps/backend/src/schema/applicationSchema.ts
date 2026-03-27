import { t } from "elysia";

export const stepAnswerSchema = {
	body: t.Object({
		id: t.String({ format: "uuid" }),
		dictionaryId: t.String({ format: "uuid" }),
		interactionAnswers: t.Array(
			t.Object({
				key: t.String(),
				value: t.Array(t.String(), { minItems: 1, maxItems: 10 }),
			}),
			{ minItems: 1, maxItems: 20 },
		),
	}),
};
