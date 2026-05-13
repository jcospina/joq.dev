#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG="$SCRIPT_DIR/hooks.config.json"
LOG="/tmp/claude-hook-debug.log"
PAYLOAD=$(cat)

echo "$(date '+%H:%M:%S') [dangerous-commands] INVOKED" >> "$LOG"
echo "$(date '+%H:%M:%S') [dangerous-commands] CWD=$(pwd)" >> "$LOG"
echo "$(date '+%H:%M:%S') [dangerous-commands] CONFIG=$CONFIG" >> "$LOG"
echo "$(date '+%H:%M:%S') [dangerous-commands] PAYLOAD=$PAYLOAD" >> "$LOG"

# Check if enabled
ENABLED=$(python3 -c "import json; c=json.load(open('$CONFIG')); print(c.get('dangerousCommands',{}).get('enabled',False))" 2>/dev/null || echo "False")
echo "$(date '+%H:%M:%S') [dangerous-commands] ENABLED=$ENABLED" >> "$LOG"
if [ "$ENABLED" != "True" ]; then
  echo "$(date '+%H:%M:%S') [dangerous-commands] SKIPPED (disabled)" >> "$LOG"
  echo '{}'
  exit 0
fi

COMMAND=$(echo "$PAYLOAD" | python3 -c "import json,sys; print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null || echo "")
echo "$(date '+%H:%M:%S') [dangerous-commands] COMMAND=$COMMAND" >> "$LOG"
if [ -z "$COMMAND" ]; then
  echo "$(date '+%H:%M:%S') [dangerous-commands] SKIPPED (no command)" >> "$LOG"
  echo '{}'
  exit 0
fi

# Check each blocked pattern — pass payload via env to avoid shell quoting issues
export HOOK_CONFIG="$CONFIG"
export HOOK_PAYLOAD="$PAYLOAD"
echo "$(date '+%H:%M:%S') [dangerous-commands] ENTERING PYTHON BLOCK" >> "$LOG"
RESULT=$(python3 << 'PYEOF' 2>> "$LOG"
import json, re, sys, os

try:
    config = json.load(open(os.environ['HOOK_CONFIG']))
    data = json.loads(os.environ['HOOK_PAYLOAD'])
except Exception as e:
    print(f"PARSE ERROR: {e}", file=sys.stderr)
    print('{}')
    sys.exit(0)

patterns = config.get('dangerousCommands', {}).get('blockedPatterns', [])
command = data.get('tool_input', {}).get('command', '')
print(f"Checking command: {command}", file=sys.stderr)

for pattern in patterns:
    try:
        if re.search(pattern, command, re.IGNORECASE):
            result = {
                'hookSpecificOutput': {
                    'hookEventName': 'PreToolUse',
                    'permissionDecision': 'deny',
                    'permissionDecisionReason': f'HARD BLOCK: this command is classified as dangerous and is not allowed under any circumstances. Do NOT retry, do NOT rephrase, do NOT try to work around the block (e.g. by splitting the command, piping, or using a different tool). Stop the current operation and report to the user that this command is prohibited.\nPattern matched: {pattern}\nCommand: {command}'
                }
            }
            print(f"DENY: {pattern}", file=sys.stderr)
            print(json.dumps(result))
            sys.exit(0)
    except re.error as e:
        print(f"REGEX ERROR: {e}", file=sys.stderr)

print("PASS: no pattern matched", file=sys.stderr)
print('{}')
PYEOF
)
echo "$(date '+%H:%M:%S') [dangerous-commands] RESULT=$RESULT" >> "$LOG"
echo "$RESULT"
