#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
checker="$root/scripts/check_ai_patterns_docs.sh"

files=(
  "index.md"
  "thesis.md"
  "bull-case.md"
  "how-it-works.md"
  "architecture.md"
  "faq.md"
  "guide/index.md"
  "guide/consensus.md"
  "guide/economics.md"
  "guide/paths.md"
  "guide/binaries.md"
  "guide/streaming.md"
  "segment-gc.md"
  "guide/api.md"
  "guide/auth.md"
  "guide/testnet.md"
  "operators/index.md"
  "changelog.md"
  "contributing.md"
)

fail=0
for rel in "${files[@]}"; do
  file="$root/$rel"
  if [ ! -f "$file" ]; then
    echo "Missing file: $rel" >&2
    fail=1
    continue
  fi

  out="$("$checker" "$file")"
  score="$(printf "%s" "$out" | rg -o "\\*\\*Score\\*\\*\\s*\\|\\s*[0-9]+\\s*/\\s*7" | rg -o "[0-9]+" | head -n1 || true)"
  score="${score:-0}"

  if [ "$score" -ne 0 ]; then
    fail=1
    echo ""
    echo "==== $rel ===="
    echo "$out"
  fi
done

if [ "$fail" -ne 0 ]; then
  echo ""
  echo "AI check failed." >&2
  exit 1
fi

echo "AI check passed."
