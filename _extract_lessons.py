import re, sys, os

ROOT = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(ROOT, 'raw', 'chan-stock', '2026-09-27-teach-you-stock-trading-108-lessons.md')
OUT = os.path.join(ROOT, '_lessons_extract.txt')

raw = open(RAW, encoding='utf-8').read()
pat = re.compile(r'(教你炒股票\s*\d+\s*[：:][^\n]*)')
# 读者回帖常以“《教你炒股票N：…》一文中…”引用标题，含“》”的为伪标题，需过滤
positions = []
for m in pat.finditer(raw):
    title = m.group(1)
    if '》' in title or '《' in title or '一文中' in title:
        continue
    positions.append((m.start(), title))
lessons = {}
for idx, (pos, title) in enumerate(positions):
    n = int(re.search(r'\d+', title).group())
    end = positions[idx + 1][0] if idx + 1 < len(positions) else len(raw)
    lessons[n] = (title.strip(), raw[pos:end])

nums = [int(x) for x in sys.argv[1:]]
out = []
for n in nums:
    if n in lessons:
        title, txt = lessons[n]
        out.append(f'\n\n========== LESSON {n}: {title} ==========\n')
        out.append(txt)
    else:
        out.append(f'\n\n========== LESSON {n}: [NOT FOUND] ==========\n')
open(OUT, 'w', encoding='utf-8').write('\n'.join(out))
print(f'extracted {len(nums)} requested -> {sum(1 for n in nums if n in lessons)} found; chars={sum(len(x) for x in out)}')
