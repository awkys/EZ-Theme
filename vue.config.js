const { defineConfig } = require("@vue/cli-service");
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const JavaScriptObfuscator = require("javascript-obfuscator");
const CompressionPlugin = require("compression-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";
const enableConfigJS = process.env.VUE_APP_CONFIGJS == "true";
const enableObfuscation = process.env.VUE_APP_OBFUSCATION == "true";

let extraScriptFileName = '';
const generateRandomFileName = (length = 8) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let name = "";
  for (let i = 0; i < length; i++) {
    name += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  const randowNumber = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
  return `${randowNumber}.${name}.js`;
};

if (isProd && enableConfigJS) {
  extraScriptFileName = generateRandomFileName();
}

module.exports = defineConfig({
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: false,
  productionSourceMap: false,
  
  configureWebpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true, syncWebAssembly: true };
    config.resolve = { ...config.resolve, alias: { "@": path.resolve(__dirname, "src") } };
    
    config.plugins.push(
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      })
    );
    
    if (isProd && enableConfigJS) {
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap("GenerateExtraConfigPlugin", () => {
            const configPath = path.resolve(__dirname, "src/config/index.js");
            const distPath = path.resolve(compiler.options.output.path, extraScriptFileName);
            
            try {
              let content = fs.readFileSync(configPath, "utf-8");
              content = content.replace(/window\.EZ_CONFIG\s*=\s*config\s*;?/g, "");
              content = content.replace(/export\s+const\s+config\s*=/, "window.EZ_CONFIG =");
              
              const obfuscated = JavaScriptObfuscator.obfuscate(content, {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 0.75,
                numbersToExpressions: true,
                simplify: true,
                stringArray: true,
                stringArrayEncoding: ["rc4"],
                stringArrayThreshold: 0.75,
                transformObjectKeys: true,
                unicodeEscapeSequence: true
              }).getObfuscatedCode();
              
              const fileContent = enableObfuscation ? obfuscated : content;
              
              // 写入 dist
              fs.writeFileSync(distPath, fileContent, "utf-8");
              
              console.log(`生成混淆独立 JS 文件: ${extraScriptFileName}`);
            } catch (err) {
              console.warn("生成独立 JS 文件失败:", err);
            }
          });
        },
      });
    }
    
    if (isProd) {
      // Gzip 压缩
      config.plugins.push(
        new CompressionPlugin({
          filename: "[path][base].gz",
          algorithm: "gzip",
          test: /\.(js|css|html|svg|json)$/,
          threshold: 10240, // 只压缩大于 10KB 的文件
          minRatio: 0.8,
          deleteOriginalAssets: false,
        })
      );
      
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          maxInitialRequests: 25,
          minSize: 20000,
          cacheGroups: {
            // Vue 核心库
            vue: {
              name: "chunk-vue",
              test: /[\\/]node_modules[\\/](vue|vue-router|vuex|@vue)[\\/]/,
              priority: 30,
              chunks: "all",
            },
            // ECharts 单独打包（很大）
            echarts: {
              name: "chunk-echarts",
              test: /[\\/]node_modules[\\/](echarts|zrender)[\\/]/,
              priority: 25,
              chunks: "async",
            },
            // Chart.js 单独打包
            chartjs: {
              name: "chunk-chartjs",
              test: /[\\/]node_modules[\\/]chart\.js[\\/]/,
              priority: 24,
              chunks: "async",
            },
            // Tabler Icons 单独打包（很大）
            tablerIcons: {
              name: "chunk-tabler-icons",
              test: /[\\/]node_modules[\\/]@tabler[\\/]icons-vue[\\/]/,
              priority: 23,
              // 只在异步页面真正需要图标时再下载，避免增加首屏同步负担
              chunks: "async",
            },
            // 编辑器相关
            editor: {
              name: "chunk-editor",
              test: /[\\/]node_modules[\\/](aieditor|markdown-it|marked|dompurify)[\\/]/,
              priority: 22,
              chunks: "async",
            },
            // 加密相关
            crypto: {
              name: "chunk-crypto",
              test: /[\\/]node_modules[\\/](crypto-js|jsencrypt|@originjs[\\/]crypto-js-wasm)[\\/]/,
              priority: 21,
              chunks: "async",
            },
            // 其他 vendors
            vendors: {
              name: "chunk-vendors",
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              chunks: "initial",
              reuseExistingChunk: true,
            },
            // 公共代码
            common: {
              name: "chunk-common",
              minChunks: 2,
              priority: -20,
              chunks: "initial",
              reuseExistingChunk: true,
            },
          },
        },
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: { compress: { drop_console: true, drop_debugger: true }, mangle: true, format: { comments: false, ascii_only: true } },
            extractComments: false,
          }),
        ],
      };
    }
  },
  
  chainWebpack: (config) => {
    if (isProd) {
      const pluginName = "html-index";
      config.plugin(pluginName).tap((args) => {
        args[0].templateParameters = {
          ...args[0].templateParameters,
          injectCustomScript: `
            ${enableConfigJS ? `<script src="./${extraScriptFileName}"></script>` : ""}
          `,
        };
        return args;
      });
      
      // 移除 prefetch 以减少首屏加载（按需加载）
      config.plugins.delete("prefetch-index");
    }
    
    // 图片优化：设置较小的内联阈值
    config.module
      .rule("images")
      .set("parser", {
        dataUrlCondition: {
          maxSize: 4 * 1024, // 4KB 以下内联
        },
      });
  },
  
  css: {
    loaderOptions: {
      sass: {
        implementation: require("sass"),
        sassOptions: { outputStyle: "expanded", fiber: false, indentedSyntax: false, includePaths: ["node_modules"] },
        additionalData: `@use "@/assets/styles/base/variables.scss" as *;`,
      },
    },
  },
  
  pages: {
    index: { entry: "src/main.js", template: "public/index.html", filename: "index.html", title: process.env.VUE_APP_TITLE },
  },
  
  devServer: { client: { overlay: false } },
});
