import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { toString } from "mdast-util-to-string"

/**
 * 把正文首个一级标题提升为页面标题（wiki 集成专用）。
 *
 * wiki/ 里的文章一律以 `# 标题` 开头、且不带 YAML frontmatter。Quartz 默认行为是：
 *   ① frontmatter 缺失时用文件名（file.stem）当标题；
 *   ② 同时把正文里的 H1 原样渲染出来。
 * 于是页面上会出现两个标题，而且当文件名与标题不一致时（`分型-笔-线段.md`
 * 的标题其实是「分型、笔、线段」），标题文字会退化成带连字符的文件名。
 *
 * 本插件把首个 H1 的文字写进 frontmatter.title 并从 mdast 中摘掉该节点，
 * 这样 ArticleTitle、<title>、ToC 拿到的是文章真正的标题，且不再重复。
 *
 * 注意：它只改渲染产物，不读写 wiki/ 源文件，因此不影响 check_evidence.py
 * 的证据一致性校验。必须注册在 TableOfContents 之前，ToC 才不会收录被摘掉的 H1。
 */
export const PromoteLeadingH1: QuartzTransformerPlugin = () => {
  return {
    name: "PromoteLeadingH1",
    markdownPlugins() {
      return [
        () => {
          return (tree: Root, file) => {
            const first = tree.children[0]
            if (!first || first.type !== "heading" || first.depth !== 1) return

            const text = toString(first).trim()
            if (!text) return

            file.data.frontmatter = { ...file.data.frontmatter, title: text }
            tree.children.shift()
          }
        },
      ]
    },
  }
}
