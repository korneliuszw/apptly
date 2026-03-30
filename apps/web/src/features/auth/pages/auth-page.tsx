import { AuthView } from "@daveyplate/better-auth-ui";
import { useParams } from "react-router";
export default function AuthPage() {
	const { pathname } = useParams();
    console.log("AuthPage pathname", pathname);
	return (
		<main className="container mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
			<AuthView pathname={pathname} />
		</main>
	);
}
