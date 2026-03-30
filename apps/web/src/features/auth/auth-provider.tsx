import { AuthUIProvider, RedirectToSignIn } from "@daveyplate/better-auth-ui";
import { authClient } from "./auth-client";
import { NavLink, Outlet, useNavigate } from "react-router";

export const AuthGuard = () => {
	const navigate = useNavigate();
	return (
		<AuthUIProvider authClient={authClient} Link={NavLink} navigate={navigate}>
			<RedirectToSignIn/>
			<Outlet/>
		</AuthUIProvider>
	);
};
