import path from "path";

import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";

export default defineConfig({
  plugins: [dtsPlugin({ include: ["lib"] })],
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/main.ts"),
      formats: ["es", "cjs", "umd"],
      name: "YOUR_LIBRARY_NAME",
      fileName: (format) => `YOUR_LIBRARY_NAME.${format}.js`,
    },
  },
});
