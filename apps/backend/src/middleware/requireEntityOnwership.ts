import { Elysia, t } from "elysia";
import { requireUser } from "./requireUser";

export const requireEntityOwnershipFactory = (
	idParam: string,
	getEntity: (id: string, userId: string) => Promise<boolean>,
) => {
	return new Elysia({ name: "require-entity-ownership" })
		.use(requireUser)
		.guard({
			params: t.Object({
				[idParam]: t.String({ format: "uuid" }),
			}),
		})
		.resolve(async ({ params: { [idParam]: id }, status, user }) => {
			const doesExist = await getEntity(id, user.id);
			if (!doesExist) {
				return status(404);
			}
			return {
				userId: user.id,
			};
		})
		.as("scoped");
};
