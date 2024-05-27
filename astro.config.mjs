import { defineConfig } from "astro/config";
import vercel from '@astrojs/vercel/serverless';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), db()],
  base: "/",
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true
    }
  })
});