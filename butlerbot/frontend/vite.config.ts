import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

export default defineConfig({
  server: {
    host: true,
  },
  plugins: [react()],
  define: {
    'process.env': process.env, // Pass environment variables to the client-side code
  },
});