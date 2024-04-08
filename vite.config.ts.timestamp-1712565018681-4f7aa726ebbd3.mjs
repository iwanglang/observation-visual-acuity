// vite.config.ts
import { defineConfig } from "file:///home/chayjames/apps/@iwanglang/observation-visual-acuity/node_modules/vite/dist/node/index.js";
import { fileURLToPath } from "node:url";
import { existsSync, copyFileSync } from "node:fs";
import { resolve } from "node:path";
import { nodeResolve } from "file:///home/chayjames/apps/@iwanglang/observation-visual-acuity/node_modules/@rollup/plugin-node-resolve/dist/es/index.js";
import commonjs from "file:///home/chayjames/apps/@iwanglang/observation-visual-acuity/node_modules/@rollup/plugin-commonjs/dist/es/index.js";
import typescript from "file:///home/chayjames/apps/@iwanglang/observation-visual-acuity/node_modules/@rollup/plugin-typescript/dist/es/index.js";
import { babel } from "file:///home/chayjames/apps/@iwanglang/observation-visual-acuity/node_modules/@rollup/plugin-babel/dist/es/index.js";
import terser from "file:///home/chayjames/apps/@iwanglang/observation-visual-acuity/node_modules/@rollup/plugin-terser/dist/es/index.js";
import summary from "file:///home/chayjames/apps/@iwanglang/observation-visual-acuity/node_modules/rollup-plugin-summary/es/index.js";
import dts from "file:///home/chayjames/apps/@iwanglang/observation-visual-acuity/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "/home/chayjames/apps/@iwanglang/observation-visual-acuity";
var __vite_injected_original_import_meta_url = "file:///home/chayjames/apps/@iwanglang/observation-visual-acuity/vite.config.ts";
var vite_config_default = defineConfig({
  build: {
    sourcemap: "inline",
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "observation-visual-acuity",
      formats: ["es", "cjs"],
      fileName: "index"
    },
    emptyOutDir: false,
    rollupOptions: {
      plugins: [
        nodeResolve({
          allowExportsFolderMapping: true
        }),
        commonjs(),
        typescript({
          compilerOptions: {
            declaration: true,
            declarationMap: true,
            declarationDir: "dist"
          },
          include: ["src/**/*.ts"]
        }),
        babel({
          babelHelpers: "bundled",
          exclude: "node_modules/**"
        }),
        terser({
          ecma: 2020,
          module: true,
          mangle: {
            properties: {
              regex: /^__/
            }
          }
        }),
        summary()
      ],
      preserveEntrySignatures: "strict"
    }
  },
  plugins: [
    dts({
      include: ["src/**/*.ts"],
      rollupTypes: true,
      insertTypesEntry: true,
      rollupOptions: {
        showVerboseMessages: true
      },
      afterBuild: async () => {
        if (existsSync("./dist/index.d.ts")) {
          copyFileSync("./dist/index.d.ts", "./dist/index.d.mts");
          copyFileSync("./dist/index.d.ts", "./dist/index.d.cts");
        }
        if (existsSync("./dist/index.js"))
          copyFileSync("./dist/index.js", "./dist/index.mjs");
      }
    })
  ],
  resolve: {
    alias: [
      { find: "@", replacement: fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)) },
      { find: "~", replacement: fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)) }
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9jaGF5amFtZXMvYXBwcy9AaXdhbmdsYW5nL29ic2VydmF0aW9uLXZpc3VhbC1hY3VpdHlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2NoYXlqYW1lcy9hcHBzL0Bpd2FuZ2xhbmcvb2JzZXJ2YXRpb24tdmlzdWFsLWFjdWl0eS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9jaGF5amFtZXMvYXBwcy9AaXdhbmdsYW5nL29ic2VydmF0aW9uLXZpc3VhbC1hY3VpdHkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCc7XG5pbXBvcnQgeyBleGlzdHNTeW5jLCBjb3B5RmlsZVN5bmMsIHVubGlua1N5bmMsIHJlbmFtZVN5bmMgfSBmcm9tICdub2RlOmZzJztcbmltcG9ydCB7IHJlc29sdmUsIGRpcm5hbWUsIGpvaW4sIHJlbGF0aXZlIH0gZnJvbSAnbm9kZTpwYXRoJztcbmltcG9ydCB7IG5vZGVSZXNvbHZlIH0gZnJvbSAnQHJvbGx1cC9wbHVnaW4tbm9kZS1yZXNvbHZlJztcbmltcG9ydCBjb21tb25qcyBmcm9tICdAcm9sbHVwL3BsdWdpbi1jb21tb25qcyc7XG5pbXBvcnQgdHlwZXNjcmlwdCBmcm9tICdAcm9sbHVwL3BsdWdpbi10eXBlc2NyaXB0JztcbmltcG9ydCB7IGJhYmVsIH0gZnJvbSAnQHJvbGx1cC9wbHVnaW4tYmFiZWwnO1xuaW1wb3J0IHRlcnNlciBmcm9tICdAcm9sbHVwL3BsdWdpbi10ZXJzZXInO1xuaW1wb3J0IHN1bW1hcnkgZnJvbSAncm9sbHVwLXBsdWdpbi1zdW1tYXJ5JztcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYnVpbGQ6IHtcbiAgICBzb3VyY2VtYXA6ICdpbmxpbmUnLFxuICAgIGxpYjoge1xuICAgICAgZW50cnk6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2luZGV4LnRzJyksXG4gICAgICBuYW1lOiAnb2JzZXJ2YXRpb24tdmlzdWFsLWFjdWl0eScsXG4gICAgICBmb3JtYXRzOiBbJ2VzJywgJ2NqcyddLFxuICAgICAgZmlsZU5hbWU6ICdpbmRleCcsXG4gICAgfSxcbiAgICBlbXB0eU91dERpcjogZmFsc2UsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgcGx1Z2luczogW1xuICAgICAgICBub2RlUmVzb2x2ZSh7XG4gICAgICAgICAgYWxsb3dFeHBvcnRzRm9sZGVyTWFwcGluZzogdHJ1ZSxcbiAgICAgICAgfSksXG4gICAgICAgIGNvbW1vbmpzKCksXG4gICAgICAgIHR5cGVzY3JpcHQoe1xuICAgICAgICAgIGNvbXBpbGVyT3B0aW9uczoge1xuICAgICAgICAgICAgZGVjbGFyYXRpb246IHRydWUsXG4gICAgICAgICAgICBkZWNsYXJhdGlvbk1hcDogdHJ1ZSxcbiAgICAgICAgICAgIGRlY2xhcmF0aW9uRGlyOiAnZGlzdCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBpbmNsdWRlOiBbJ3NyYy8qKi8qLnRzJ10sXG4gICAgICAgIH0pLFxuICAgICAgICBiYWJlbCh7XG4gICAgICAgICAgYmFiZWxIZWxwZXJzOiAnYnVuZGxlZCcsXG4gICAgICAgICAgZXhjbHVkZTogXCJub2RlX21vZHVsZXMvKipcIlxuICAgICAgICB9KSxcbiAgICAgICAgdGVyc2VyKHtcbiAgICAgICAgICBlY21hOiAyMDIwLFxuICAgICAgICAgIG1vZHVsZTogdHJ1ZSxcbiAgICAgICAgICBtYW5nbGU6IHtcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgcmVnZXg6IC9eX18vLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgICAgc3VtbWFyeSgpLFxuICAgICAgXSxcbiAgICAgIHByZXNlcnZlRW50cnlTaWduYXR1cmVzOiAnc3RyaWN0JyxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgZHRzKHtcbiAgICAgIGluY2x1ZGU6IFsnc3JjLyoqLyoudHMnXSxcbiAgICAgIHJvbGx1cFR5cGVzOiB0cnVlLFxuICAgICAgaW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgc2hvd1ZlcmJvc2VNZXNzYWdlczogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBhZnRlckJ1aWxkOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGlmIChleGlzdHNTeW5jKCcuL2Rpc3QvaW5kZXguZC50cycpKXtcbiAgICAgICAgICBjb3B5RmlsZVN5bmMoJy4vZGlzdC9pbmRleC5kLnRzJywgJy4vZGlzdC9pbmRleC5kLm10cycpO1xuICAgICAgICAgIGNvcHlGaWxlU3luYygnLi9kaXN0L2luZGV4LmQudHMnLCAnLi9kaXN0L2luZGV4LmQuY3RzJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4aXN0c1N5bmMoJy4vZGlzdC9pbmRleC5qcycpKSBjb3B5RmlsZVN5bmMoJy4vZGlzdC9pbmRleC5qcycsICcuL2Rpc3QvaW5kZXgubWpzJyk7XG4gICAgICB9XG4gICAgfSksXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogW1xuICAgICAgeyBmaW5kOiAnQCcsIHJlcGxhY2VtZW50OiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSkgfSxcbiAgICAgIHsgZmluZDogJ34nLCByZXBsYWNlbWVudDogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpIH0sXG4gICAgXSxcbiAgfVxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUE2VixTQUFTLG9CQUFvQjtBQUMxWCxTQUFTLHFCQUFxQjtBQUM5QixTQUFTLFlBQVksb0JBQTRDO0FBQ2pFLFNBQVMsZUFBd0M7QUFDakQsU0FBUyxtQkFBbUI7QUFDNUIsT0FBTyxjQUFjO0FBQ3JCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsYUFBYTtBQUN0QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sU0FBUztBQVZoQixJQUFNLG1DQUFtQztBQUFpTCxJQUFNLDJDQUEyQztBQVkzUSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUEsSUFDWCxLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ3hDLE1BQU07QUFBQSxNQUNOLFNBQVMsQ0FBQyxNQUFNLEtBQUs7QUFBQSxNQUNyQixVQUFVO0FBQUEsSUFDWjtBQUFBLElBQ0EsYUFBYTtBQUFBLElBQ2IsZUFBZTtBQUFBLE1BQ2IsU0FBUztBQUFBLFFBQ1AsWUFBWTtBQUFBLFVBQ1YsMkJBQTJCO0FBQUEsUUFDN0IsQ0FBQztBQUFBLFFBQ0QsU0FBUztBQUFBLFFBQ1QsV0FBVztBQUFBLFVBQ1QsaUJBQWlCO0FBQUEsWUFDZixhQUFhO0FBQUEsWUFDYixnQkFBZ0I7QUFBQSxZQUNoQixnQkFBZ0I7QUFBQSxVQUNsQjtBQUFBLFVBQ0EsU0FBUyxDQUFDLGFBQWE7QUFBQSxRQUN6QixDQUFDO0FBQUEsUUFDRCxNQUFNO0FBQUEsVUFDSixjQUFjO0FBQUEsVUFDZCxTQUFTO0FBQUEsUUFDWCxDQUFDO0FBQUEsUUFDRCxPQUFPO0FBQUEsVUFDTCxNQUFNO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixRQUFRO0FBQUEsWUFDTixZQUFZO0FBQUEsY0FDVixPQUFPO0FBQUEsWUFDVDtBQUFBLFVBQ0Y7QUFBQSxRQUNGLENBQUM7QUFBQSxRQUNELFFBQVE7QUFBQSxNQUNWO0FBQUEsTUFDQSx5QkFBeUI7QUFBQSxJQUMzQjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxNQUNGLFNBQVMsQ0FBQyxhQUFhO0FBQUEsTUFDdkIsYUFBYTtBQUFBLE1BQ2Isa0JBQWtCO0FBQUEsTUFDbEIsZUFBZTtBQUFBLFFBQ2IscUJBQXFCO0FBQUEsTUFDdkI7QUFBQSxNQUNBLFlBQVksWUFBWTtBQUN0QixZQUFJLFdBQVcsbUJBQW1CLEdBQUU7QUFDbEMsdUJBQWEscUJBQXFCLG9CQUFvQjtBQUN0RCx1QkFBYSxxQkFBcUIsb0JBQW9CO0FBQUEsUUFDeEQ7QUFDQSxZQUFJLFdBQVcsaUJBQWlCO0FBQUcsdUJBQWEsbUJBQW1CLGtCQUFrQjtBQUFBLE1BQ3ZGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsRUFBRSxNQUFNLEtBQUssYUFBYSxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUMsRUFBRTtBQUFBLE1BQzNFLEVBQUUsTUFBTSxLQUFLLGFBQWEsY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDLEVBQUU7QUFBQSxJQUM3RTtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
