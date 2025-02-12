import type { NuxtPage } from "nuxt/schema";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL,
    },
  },
  imports: {
    dirs: ["composables/**"],
  },
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "nuxt-svgo",
    "shadcn-nuxt",
    "nuxt-tiptap-editor",
    "pinia-plugin-persistedstate/nuxt",
  ],
  tiptap: {
    prefix: "Tiptap",
  },
  plugins: ["~/plugins/apiClient.ts", "~/plugins/clearStores.ts"],
  svgo: {
    defaultImport: "component",
    svgoConfig: {},
  },
  hooks: {
    "pages:extend"(pages) {
      function setMiddleware(pages: NuxtPage[]) {
        for (const page of pages) {
          if (page.name !== "/auth/login" && page.name !== "/auth/register") {
            page.meta ||= {};
            page.meta.middleware = ["auth", "route-protection"];
          }

          if (page.children) {
            setMiddleware(page.children);
          }
        }
      }

      setMiddleware(pages);
    },
  },
});
