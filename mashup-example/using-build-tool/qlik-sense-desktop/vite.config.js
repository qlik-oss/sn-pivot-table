import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['node_modules'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});
