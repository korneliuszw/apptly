import { auth } from "@apptly/auth/src/index";
import {
	applicationStepsDictionaryTable,
	applicationTable,
	db,
} from "@apptly/db/src";
import { maxLength } from "better-auth";

const createUser = (name: string, email: string, password: string) => {
	return auth.api
		.signUpEmail({
			body: {
				name,
				email,
				password,
			},
		})
		.catch(() =>
			auth.api.signInEmail({
				body: {
					email,
					password,
				},
			}),
		);
};

const seed = async () => {
	const res = await createUser("John Doe", "john@doe2.com", "password");
	const id = res.user.id;
	await db
		.insert(applicationTable)
		.values({
			name: "Test Application",
			description: "This is a test application",
			ownerId: id,
		})
		.catch((err) => null);
	await db.insert(applicationStepsDictionaryTable).values([
		{
			title: "Step 1",
			description: "This is the first step",
			basePrompt: "Please answer the following questions about your project:",
			stepNumber: 1,
			interactions: [
				{
					type: "text",
					message: "What is the name of your project?",
					constraints: {
						maxLength: 50,
					},
				},
			],
		},
		{
			title: "Step 2",
			description: "This is the second step",
			basePrompt: "Please answer the following questions about your project:",
			stepNumber: 2,
			interactions: [
				{
					type: "text",
					name: "projectDescription",
					message: "Describe your project in a few sentences.",
					constraints: {
						maxLength: 400,
					},
				},
			],
		},
		{
			title: "Step 3",
			description: "This is the third step",
			basePrompt: "Please answer the following questions about your project:",
			stepNumber: 3,
			interactions: [
				{
					type: "text",
					name: "projectGoals",
					message: "What are the goals of your project?",
					constraints: {
						maxLength: 300,
					},
				},
			],
		},
		{
			title: "Step 4",
			description: "This is the fourth step",
			basePrompt: "Please answer the following questions about your project:",
			stepNumber: 4,
			interactions: [
				{
					type: "text",
					name: "targetAudience",
					message: "Who is the target audience for your project?",
					constraints: {
						maxLength: 200,
					},
				},
			],
		}
	]);
};

seed().then(() => {
	console.log("Seeding completed");
	process.exit(0);
});
