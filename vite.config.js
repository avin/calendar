import fs from 'fs';
import path from 'path';
import * as sass from 'sass';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({ include: ['lib'] }),
    {
      name: 'prepare-styles',
      apply: 'build',
      enforce: 'post',
      async writeBundle(_, bundle) {
        // Compile SCSS
        const result = await sass.compileAsync(path.resolve(__dirname, 'lib/index.scss'));
        fs.writeFileSync(path.resolve(__dirname, 'dist/style.css'), result.css);

        // Copy SCSS files to dist
        const scssSrcDir = path.resolve(__dirname, 'lib');
        const scssDestDir = path.resolve(__dirname, 'dist/scss');

        // Ensure the destination directory exists
        if (!fs.existsSync(scssDestDir)) {
          fs.mkdirSync(scssDestDir, { recursive: true });
        }

        // Copy all SCSS files
        const scssFiles = fs.readdirSync(scssSrcDir).filter((file) => file.endsWith('.scss'));

        scssFiles.forEach((file) => {
          const srcPath = path.join(scssSrcDir, file);
          const destPath = path.join(scssDestDir, file);
          fs.copyFileSync(srcPath, destPath);
        });
      },
    },
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      name: 'CalendarLib',
      fileName: 'index',
    },
    rollupOptions: {},
  },
});
