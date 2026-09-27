# 缠论知识库（教你炒股票 108 课）

《缠中说禅：教你炒股票》全书的**可溯源**知识库 + 静态站点。

**在线阅读：<https://yabin01.github.io/chan-wiki/>**

## 结构

```
raw/            不可篡改的源文本（全书单文件 markdown）
wiki/           由 raw 编译出的知识页（9 篇专题 + index + log）
site/           Quartz v4 静态站点（内容源直指 wiki/，只读不复制）
_extract_lessons.py   按课号从 raw 抽取原文的维护脚本
```

## 组织方式

`wiki/` 按三个主题目录分组：

| 目录 | 内容 |
| --- | --- |
| `chan-foundations/` | 总览、学历标准与学习路径 |
| `chan-technical/` | 分型-笔-线段、走势中枢、走势终完美、背驰、买卖点、均线系统与吻、级别与同级别分解 |
| `chan-operations/` | 操作节奏与板块轮动、资金管理与风险控制 |

## 证据约束

本站遵循 **Grounding Invariant**：wiki 中出现的每个数字、日期、引文都必须能在 `raw/` 源里逐字找到。
校验脚本（来自 `karpathy-llm-wiki` skill）：

```bash
python check_evidence.py .
```

当前状态：**0 suspect / 0 error / 0 unreferenced raw**。

> 注意：raw 源按约 40 字自然换行，脚本会把它规范化成单个空格。引文跨行时必须在同一位置断行，否则会失配。另：脚本只剥离 ASCII 标点，**不剥离全角 `。`** —— 不要给引文自行补句号。

## 本地构建

```bash
cd site
npm ci
npm run build      # 构建到 site/public
npm run serve      # 构建 + 本地预览 http://localhost:8080
```

`site/package.json` 里的构建命令已带 `-d ../wiki`，即把仓库根的 `wiki/` 作为内容源。

## 部署

推送到 `main` 即触发 `.github/workflows/deploy.yml`：安装依赖 → 以 `QUARTZ_BASE_URL=yabin01.github.io/chan-wiki` 构建 → 发布到 GitHub Pages。

首次部署时 Pages 尚未启用会导致 `Configure Pages` 步骤失败；在仓库 Settings → Pages 里把 Source 设为 **GitHub Actions** 后重跑即可。

## 站点侧对 Quartz 的改动

除 `quartz.config.ts` 外，还改了 4 处（升级 Quartz 时需重新评估）：

1. `quartz/plugins/transformers/promoteLeadingH1.ts`（新增）—— 把文章首个 H1 提升为页面标题并摘除该节点，否则每页双标题、且标题退化成文件名。
2. `quartz/components/scripts/explorer.inline.ts` —— 原 `scrollIntoView` 会连带滚动整个文档，且读写滚动位置用的不是真正的滚动容器。
3. `quartz/styles/custom.scss` —— 中文正文行高与标题间距。

## 已知问题

- 文章头部的 `> Raw: [raw 源](../../raw/...)` 在站点上是死链。这条链接**不能改路径** —— 证据校验要求 Raw 链接必须落在 `raw/` 内，改路径会立刻报 error。
- `wiki/index.md` 的一级标题从 skill 模板默认的 `# Knowledge Base Index` 改成了 `# 缠论知识库`（它同时是站点首页），属有意偏离，已在 `wiki/log.md` 记录。
