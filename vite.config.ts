import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import VueI18n from "@intlify/vite-plugin-vue-i18n";
import Pages from "vite-plugin-pages";
import Components from "unplugin-vue-components/vite";
import Layouts from "vite-plugin-vue-layouts";
import SvgLoader from "vite-svg-loader";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

const SILENT = Boolean(process.env.SILENT) ?? false;

// https://vitejs.dev/config/
export default defineConfig({
  root: process.cwd(),
  base: "/",
  publicDir: "public",
  logLevel: SILENT ? "error" : "info",

  optimizeDeps: {
    include: ["@vueuse/core", "@vueuse/head", "vue-i18n", "moment"],
  },
  resolve: {
    alias: [
      {
        find: "/~/",
        replacement: `/src/assets/`,
      },
      {
        find: "/@src/",
        replacement: `/src/`,
      },
    ],
  },
  plugins: [
    Vue({
      include: [/\.vue$/],
    }),

    VueI18n({
      include: path.resolve(__dirname, "./src/locales/**"),
    }),

    Pages({
      pagesDir: [
        {
          dir: "src/pages",
          baseRoute: "",
        },
      ],
      importMode(path) {
        return "async";
      },
      extendRoute(route) {
        if (route.meta?.requiresAuth !== false) {
          return {
            ...route,
            meta: { requiresAuth: true },
          };
        }
        return route;
      },
    }),

    Layouts({
      layoutsDirs: "src/layouts",
      defaultLayout: "default",
    }),

    Components({
      dirs: ["src/components", "src/layouts"],
      extensions: ["vue", "md", "mjs.map"],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.js$/],
    }),

    SvgLoader({
      svgo: true,
      svgoConfig: {
        multipass: true,
      },
    }),

    VitePWA({
      base: "/",
      registerType: "autoUpdate",
      includeAssets: ["favicon.png", "robots.txt"],
      manifest: {
        name: "Tucker",
        short_name: "Tucker",
        start_url: "/?utm_source=pwa",
        display: "standalone",
        theme_color: "#e5fe40",
        background_color: "#f3f5f5",
        icons: [],
      },
    }),
  ],
});
