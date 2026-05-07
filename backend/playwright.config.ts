import process from "node:process";
import { defineConfig } from "@playwright/test";

const apiOrigin = process.env.API_ORIGIN ?? "http://localhost:4000";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
  ],
  use: {
    baseURL: apiOrigin,
    trace: "on-first-retry",
  },
  webServer: {
    command: process.env.CI ? "npx ts-node ./src/index.ts" : "npm run start-dev",
    url: `${apiOrigin}/api`,
    reuseExistingServer: !process.env.CI,
    timeout: 60 * 1000,
  },
});
