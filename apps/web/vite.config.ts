import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => ({
	root: import.meta.dirname,
	cacheDir: "../../node_modules/.vite/apps/web",
	server: {
		port: 4200,
		host: "localhost",
	},
	preview: {
		port: 4201,
		host: "localhost",
	},
	resolve: {
		alias: {
			"@": `${import.meta.dirname}/src`,
		}
	},
	plugins: [react(), tailwindcss(), tsconfigPaths()],
	// Uncomment this if you are using workers.
	// worker: {
	//  plugins: [],
	// },
	build: {
		outDir: "./dist",
		emptyOutDir: true,
		reportCompressedSize: true,
		commonjsOptions: {
			transformMixedEsModules: true,
		},
	},
	test: {
		name: "@apptly/web",
		watch: false,
		globals: true,
		environment: "jsdom",
		include: ["{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		reporters: ["default"],
		coverage: {
			reportsDirectory: "./test-output/vitest/coverage",
			provider: "v8" as const,
		},
	},
}));
