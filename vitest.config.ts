import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    /** Unit tests; e2e stays on Playwright (`npm run test:e2e`). */
    include: ['**/__tests__/regional-shipping.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
