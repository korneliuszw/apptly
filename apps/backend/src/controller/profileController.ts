import { Elysia } from "elysia";
import { requireUser } from "../middleware/requireUser.js";

export const profileController = new Elysia({
	name: "profile",
	prefix: "/profile",
})
	.use(requireUser)
	.get("/", ({ user }) => user);
