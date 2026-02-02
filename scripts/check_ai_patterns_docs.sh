#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <file> [multiplier]" >&2
  exit 1
fi

input="$1"
multiplier="${2:-}"

script_dir="$(cd "$(dirname "$0")" && pwd)"
root="$(cd "$script_dir/.." && pwd)"

detector_root="${AI_WRITING_DETECTOR_ROOT:-$root/scripts/ai-writing-detector}"
detector_script="$detector_root/scripts/check_ai_patterns.sh"

if [ ! -x "$detector_script" ]; then
  detector_script="/tmp/ai-writing-detector/ai-writing-detector/scripts/check_ai_patterns.sh"
fi

if [ ! -x "$detector_script" ]; then
  echo "Error: AI detector not found. Set AI_WRITING_DETECTOR_ROOT or add scripts/ai-writing-detector." >&2
  exit 1
fi

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
  "$detector_script" "$tmpfile" "$multiplier"
else
  "$detector_script" "$tmpfile"
fi

rm -f "$tmpfile"
