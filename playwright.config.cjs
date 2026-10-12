const { defineConfig } = require("@playwright/test");
const external = process.env.UI_TEST_URL;
module.exports = defineConfig({
  testDir: "./tests/browser",
  timeout: 30000,
  use: { baseURL: external || "http://localhost:3100", headless: true },
  webServer: external
    ? undefined
    : {
        command: "npm start",
        url: "http://localhost:3100",
        env: {
          PORT: "3100",
          HOST: "127.0.0.1",
          BROWSER: "none",
          REACT_APP_URL_BACK: "http://localhost:8741",
        },
        reuseExistingServer: process.env.CI !== "true",
        timeout: 120000,
      },
});
