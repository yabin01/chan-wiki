# Wiki Log

## [2026-09-27] ingest | 缠论108课（《教你炒股票：全3册》）整理为 wiki

- Disposition: New
- Raw: raw/chan-stock/2026-09-27-teach-you-stock-trading-108-lessons.md
- Updated: 缠论总览与学习路径
- Updated: 分型、笔、线段
- Updated: 走势中枢
- Updated: 走势终完美
- Updated: 背驰
- Updated: 买卖点
- Updated: 均线系统与吻
- Updated: 级别与同级别分解
- Updated: 操作节奏与板块轮动
- Updated: 资金管理与风险控制

将《教你炒股票108课（出版）》全书文本（单文件 raw 源）编译为 9 篇 wiki 文章，按 chan-foundations / chan-technical / chan-operations 三个主题目录组织。所有文章数字与引文均锚定 raw 源逐字核验，随后运行 check_evidence.py 完成 Lint。

## [2026-09-27] lint | 23 issues found, 0 auto-fixed

- check_evidence.py 首轮报 23 fidelity suspect、0 evidence error、0 unreferenced raw；逐条修复后复检为 **0 / 0 / 0**。
- 失配根因与修复：
  1. **raw 换行被规范化成一空格**——`normalize()` 把 raw 的换行折叠为单个空格，引文若不含该空格即失配。修复方式：在 blockquote 中**照 raw 的换行处断行**（中文任意字符处断行都自然，读者只看到换行），使两侧规范化后一致。
  2. **自撰转述被误加引号**——凡 15 字以上的双引号/块引用段落都会被当引文候选校验。修复：去掉引号改为客观陈述（如"本级别买点进…"、"男上位/女上位 + 吻 + 背驰"、"从每笔成交构成的最低级别图形…"），或改写为 raw 原文。
  3. **自行插入的多余空格**——`大盘 50`/`沪深 300`（raw 为 `大盘50`/`沪深300`）、`100% 安全`（raw `100%安全`）、`1 分钟级别`（raw `1分钟级别`）、`走势分解定理 保证了`（多一空格）。
  4. **措辞差异**——`该反弹`→`本次反弹`、`分解为`→`分解成`、`缠中说禅走势分解定理 保证了`→raw 的`根据"缠中说禅走势分解定理"，…具有唯一性`；学历标准三句按 raw 分号后空格对齐。
  5. **追加的全角句号**——脚本只剥离 ASCII 标点，**不剥离全角 `。`**；给引文补的全角句号若 raw 该处是逗号/句中，即失配。修复：把引文收在 raw 真正有 `。` 的句末（如补到`…至少结束该级别的走势是没问题的。`）。
- 注意：脚本为只读报告，不自动修正文件，故 M = 0 auto-fixed；23 处均为人工按 raw 原文校正。

## [2026-09-27] edit | index.md 首页标题中文化（供 Quartz 站点用）

- 变更：`wiki/index.md` 的一级标题由 SKILL.md 的模板默认值 `# Knowledge Base Index` 改为 `# 缠论知识库`，并在题下补一句导语。
- 原因：该文件同时作为 Quartz 站点首页，英文模板标题不适合中文站点。**这是一处对模板约定的有意偏离**；如需回滚，把标题改回 `# Knowledge Base Index`、删去导语即可。
- 范围：仅 index.md。它属于 `check_evidence.py` 的 SKIP_FILES，不参与证据校验；`raw/` 与全部 10 篇文章未改动，lint 复检仍为 0 fidelity suspect / 0 evidence error / 0 unreferenced raw。
- 表格结构（Article / Summary / Updated，按 topic 分组）未动。
