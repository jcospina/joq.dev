#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG="$SCRIPT_DIR/hooks.config.json"
PAYLOAD=$(cat)

ENABLED=$(python3 -c "import json; c=json.load(open('$CONFIG')); print(c.get('prTestGate',{}).get('enabled',False))" 2>/dev/null || echo "False")
if [ "$ENABLED" != "True" ]; then
  echo '{}'
  exit 0
fi

COMMAND=$(echo "$PAYLOAD" | python3 -c "import json,sys; print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null || echo "")
if [ -z "$COMMAND" ]; then
  echo '{}'
  exit 0
fi

# Only gate PR creation
if ! echo "$COMMAND" | grep -q "gh pr create"; then
  echo '{}'
  exit 0
fi

# Load checks as newline-separated "name\tcommand" pairs
CHECKS=$(python3 -c "
import json
c = json.load(open('$CONFIG'))
checks = c.get('prTestGate', {}).get('checks', [])
for chk in checks:
    name = chk.get('name', '').strip()
    cmd = chk.get('command', '').strip()
    if name and cmd:
        print(f'{name}\t{cmd}')
" 2>/dev/null || echo "")

if [ -z "$CHECKS" ]; then
  echo '{}'
  exit 0
fi

deny() {
  local reason="$1"
  export HOOK_REASON="$reason"
  python3 -c "
import json, os
result = {'hookSpecificOutput': {'hookEventName': 'PreToolUse', 'permissionDecision': 'deny', 'permissionDecisionReason': os.environ['HOOK_REASON']}}
print(json.dumps(result))
"
}

while IFS=$'\t' read -r NAME CMD; do
  [ -z "$NAME" ] && continue
  OUT_FILE="/tmp/pr-gate-${NAME}.txt"
  if ! eval "$CMD" > "$OUT_FILE" 2>&1; then
    OUTPUT=$(tail -c 1000 "$OUT_FILE")
    deny "Check \"$NAME\" failed — the PR cannot be created until it passes. Fix the errors below now without asking the user (fixes are pre-approved), then retry \`gh pr create\`. Do not skip this check or bypass this gate. If a failure reveals a real bug in the code under test, fix the code rather than weakening the check.

Command: $CMD

$OUTPUT"
    exit 0
  fi
done <<< "$CHECKS"

echo '{}'
