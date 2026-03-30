import { Link } from "react-router"

export const LandingPage = () => {
    return (
        <main className="container mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
            <h1 className="text-4xl font-bold">Welcome to Apptly</h1>
            <p className="text-lg text-gray-600">
                Your AI-powered coding assistant. Sign in to get started.
            </p>
            <Link
                to="/app"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                Start Building
            </Link>
        </main>
    )
}