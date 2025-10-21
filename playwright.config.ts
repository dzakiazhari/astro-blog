import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: "http://127.0.0.1:4321",
    headless: true,
    viewport: { width: 1280, height: 720 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm run dev -- --host 127.0.0.1 --port 4321",
    port: 4321,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
