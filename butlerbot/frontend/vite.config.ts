import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

export default defineConfig({
  base: "/",
  server: {
    host: true,
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js",
          dest: "/",
        },
        {
          src: "node_modules/@ricky0123/vad-web/dist/*.onnx",
          dest: "/",
        },
        {
          src: "node_modules/onnxruntime-web/dist/*.wasm",
          dest: "/",
        },
      ],
    }),
  ],
  define: {
    "process.env": process.env, // Pass environment variables to the client-side code
  },
});
