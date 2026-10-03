#!/bin/bash
# Systematic responsive overflow audit across routes x viewports
set -u
ROUTES=(
  "#/"
  "#/articles"
  "#/articles?q=learning"
  "#/article/IJCS-2026-0248"
  "#/issues"
  "#/issue/V9I3"
  "#/editorial-board"
  "#/for-authors"
  "#/about"
  "#/contact"
)
VIEWPORTS=("390 844" "768 1024" "1280 900")
FAIL=0
for vp in "${VIEWPORTS[@]}"; do
  set -- $vp
  agent-browser set viewport $1 $2 >/dev/null
  for route in "${ROUTES[@]}"; do
    agent-browser open "http://localhost:3000/$route" >/dev/null 2>&1
    agent-browser wait --load networkidle >/dev/null 2>&1
    sleep 0.4
    RES=$(agent-browser eval "(() => { const d = document.documentElement; const wide = Array.from(document.querySelectorAll('body *')).filter(el => el.scrollWidth > d.clientWidth + 2 && getComputedStyle(el).position !== 'fixed' && el.offsetParent !== null).slice(0,3).map(el => el.tagName + '.' + String(el.className).slice(0,60)); return JSON.stringify({overflow: d.scrollWidth > d.clientWidth, w: d.scrollWidth, wide}); })()")
    OVER=$(echo "$RES" | python3 -c "import json,sys; d=json.loads(json.loads(sys.stdin.read())); print('OVERFLOW' if d['overflow'] else 'ok', d['w'], '; '.join(d['wide']))" 2>/dev/null)
    echo "[$1px] $route -> $OVER"
    case "$OVER" in OVERFLOW*) FAIL=1;; esac
  done
done
echo "AUDIT_RESULT: $([ $FAIL -eq 0 ] && echo ALL_CLEAN || echo ISSUES_FOUND)"
