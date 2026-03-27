import { logger } from "@bogeychan/elysia-logger";
import { Elysia } from "elysia";

export default new Elysia({ name: "error-handler" })
	.use(logger())
	.onError((ctx) => {
		const id = crypto.randomUUID();
		ctx.log?.error(ctx, `[ID: ${id}]`);
		if (ctx.code === "UNKNOWN") {
			console.error(ctx.error);
			return ctx.status(
				500,
				`Internal Server Error. Please contact support with the error ID: ${id}.`,
			);
		}
	});
