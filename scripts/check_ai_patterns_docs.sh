#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <file> [multiplier]" >&2
  exit 1
fi

input="$1"
multiplier="${2:-}"

# Preprocess markdown to reduce false positives:
# - Strip fenced code blocks (``` or ~~~)
# - Strip inline code (`...`)
# - Strip HTML tags (keep inner text)
# - Whitelist domain terms (Beacon Chain, explore)

tmpfile="$(mktemp /tmp/ai_md_clean.XXXXXX)"
python3 - <<'PY' "$input" "$tmpfile"
import re, sys, pathlib
src = pathlib.Path(sys.argv[1]).read_text()

# Remove fenced code blocks
src = re.sub(r"```[\s\S]*?```", "", src)
src = re.sub(r"~~~[\s\S]*?~~~", "", src)

# Remove inline code
src = re.sub(r"`[^`\n]+`", "", src)

# Strip HTML tags but keep inner text
src = re.sub(r"<[^>]+>", "", src)

# Whitelist domain terms (remove from analysis)
whitelist_patterns = [
    r"\bBeacon\s+Chain\b",
    r"\bexplore\b",
]
for pat in whitelist_patterns:
    src = re.sub(pat, "", src, flags=re.IGNORECASE)

pathlib.Path(sys.argv[2]).write_text(src)
PY

if [ -n "$multiplier" ]; then
  /tmp/ai-writing-detector/ai-writing-detector/scripts/check_ai_patterns.sh "$tmpfile" "$multiplier"
else
  /tmp/ai-writing-detector/ai-writing-detector/scripts/check_ai_patterns.sh "$tmpfile"
fi

rm -f "$tmpfile"
