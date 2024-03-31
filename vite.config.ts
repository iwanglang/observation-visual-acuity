import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { existsSync, copyFileSync, unlinkSync, renameSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import summary from 'rollup-plugin-summary';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    sourcemap: 'inline',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'observation-visual-acuity',
      formats: ['es'],
      fileName: 'index',
    },
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: `[name].mjs`,
      },
      plugins: [
        nodeResolve({
          allowExportsFolderMapping: true,
        }),
        commonjs(),
        typescript({
          compilerOptions: {
            declaration: true,
            declarationMap: true,
            declarationDir: 'dist',
          },
          include: ['src/**/*.ts'],
        }),
        babel({
          babelHelpers: 'bundled',
          exclude: "node_modules/**"
        }),
        terser({
          ecma: 2020,
          module: true,
          mangle: {
            properties: {
              regex: /^__/,
            },
          },
        }),
        summary(),
      ],
      preserveEntrySignatures: 'strict',
    },
  },
  plugins: [
    dts({
      include: ['src/**/*.ts'],
      rollupTypes: true,
      insertTypesEntry: true,
      rollupOptions: {
        showVerboseMessages: true,
      },
      afterBuild: async () => {
        if (existsSync('./dist/index.d.ts')) renameSync('./dist/index.d.ts', './dist/index.d.mts');
      }
    }),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '~', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
  }
});