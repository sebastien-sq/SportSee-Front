import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react({
        // Configuration du plugin React
        devTarget: "es2015",
      }),
    ],

    // Configuration du serveur de développement
    server: {
      port: 5173,
      strictPort: false,
      host: true,
      open: false,
    },

    // Configuration de build
    build: {
      sourcemap: true,
      target: "es2015",
      outDir: "dist",
    },

    // Configuration des variables d'environnement
    define: {
      __DEV__: mode === "development",
      __PROD__: mode === "production",
    },

    // Gestion des erreurs
    esbuild: {
      logLevel: "info",
    },
  };
});
