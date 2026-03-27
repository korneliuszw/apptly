import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { NavLink, useNavigate } from "react-router-dom";
import { authClient } from "./lib/auth-client";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate();
	return (
		<AuthUIProvider authClient={authClient} Link={NavLink} navigate={navigate}>
			{children}
		</AuthUIProvider>
	);
};
