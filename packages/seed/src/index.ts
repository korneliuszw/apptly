import { auth } from "@apptly/auth/src/index";
import { applicationTable, db } from "@apptly/db/src";

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
	await db.insert(applicationTable).values({
		name: "Test Application",
		description: "This is a test application",
		ownerId: id,
	});
};

seed().then(() => {
	console.log("Seeding completed");
	process.exit(0);
});
