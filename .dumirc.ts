import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  favicons: ['https://9tq.fr/img/logo-black.png'],
  logo: 'https://9tq.fr/img/logo-black.png',
  themeConfig: {
    name: 'Wand',
  },
  // locales: [{ id: 'en-EN', name: 'English' }],
  base: '/9tq-wand',
  publicPath: '/9tq-wand/',
});
