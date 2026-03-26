import { auth } from "@apptly/auth";
import { Elysia } from "elysia";

export const requireUser = new Elysia({ name: "auth-user" })
	.mount(auth.handler)
	.macro({
		auth: {
			async resolve({ status, request: { headers } }) {
				const session = await auth.api.getSession({ headers });
				if (!session) {
					return status(401);
				}
				return {
					user: session.user,
					session: session.session,
				};
			},
		},
	});
