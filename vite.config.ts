import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const getEnv = (name: string) => {
  const env = process.env[name];

  if (!env) {
    throw new Error(`Env var ${name} not provided!`);
  }

  return env;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "frontend",
  resolve: {
    alias: [
      { find: 'frontend', replacement: `${__dirname}/frontend` },
    ],
  },
  define: {
    EVENTS_BACKEND_PREFIX: JSON.stringify(getEnv("BACKEND_PREFIX")),
  }
})
