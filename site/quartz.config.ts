import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration — 缠论知识库
 *
 * 内容源：../wiki
 *   wiki/ 由 karpathy-llm-wiki skill 编译产出（raw/ 不可篡改，wiki/ 只做编译）。
 *   Quartz 只读取它、绝不写入，因此 wiki 与 lint 校验流程都不受影响。
 *
 * 构建：npm run build   （等价于 node ./quartz/bootstrap-cli.mjs build -d ../wiki）
 * 预览：npm run serve   （等价于上述命令加 --serve --port 8080）
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "缠论知识库",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "zh-CN",
    // baseUrl 决定 sitemap / RSS / canonical 等绝对链接。
    // 本地预览回退 localhost:8080；CI 部署时由环境变量注入正式子路径。
    baseUrl: process.env.QUARTZ_BASE_URL ?? "localhost:8080",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      // 本地字体：大陆网络访问 fonts.googleapis.com 不通，
      // 用系统字体（Windows 自带微软雅黑）避免页面字体请求悬挂。
      fontOrigin: "local",
      cdnCaching: true,
      typography: {
        header: "Microsoft YaHei",
        body: "Microsoft YaHei",
        code: "Cascadia Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f8",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#284b63",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#161618",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#7b97aa",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      // 把 wiki 文章的正文 H1 提升为页面标题（去重 + 用真实标题而非文件名）。
      // 必须排在 TableOfContents 之前。
      Plugin.PromoteLeadingH1(),
      // wiki/ 不在 Quartz 自己的 git 仓库内，跳过 git 取日期，直接读文件时间戳。
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // CustomOgImages 会去 Google Fonts 拉 TTF 生成社交分享图，
      // 大陆网络不可达且显著拖慢构建，故关闭。
      // Plugin.CustomOgImages(),
    ],
  },
}

export default config
