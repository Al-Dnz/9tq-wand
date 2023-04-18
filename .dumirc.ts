import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'Wand',
  },
  locales: [{ id: 'en-EN', name: 'English' }],
  base: '/9tq-wand',
  publicPath: '/9tq-wand/',
});
