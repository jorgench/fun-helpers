/// <reference types="vitest" />
import { defineConfig, mergeConfig } from "vite";
import viteConfig from "./vite.config.ts";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      exclude: ["**/node_modules/**", "**/testsE2E/**"],
    },
  })
);
