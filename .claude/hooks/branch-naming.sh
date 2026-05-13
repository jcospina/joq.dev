#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG="$SCRIPT_DIR/hooks.config.json"
PAYLOAD=$(cat)

ENABLED=$(python3 -c "import json; c=json.load(open('$CONFIG')); print(c.get('branchNaming',{}).get('enabled',False))" 2>/dev/null || echo "False")
if [ "$ENABLED" != "True" ]; then
  echo '{}'
  exit 0
fi

export HOOK_CONFIG="$CONFIG"
export HOOK_PAYLOAD="$PAYLOAD"
python3 -c "
import json, re, sys, os

try:
    payload = json.loads(os.environ['HOOK_PAYLOAD'])
    config = json.load(open(os.environ['HOOK_CONFIG']))
except Exception:
    print('{}')
    sys.exit(0)

bn = config.get('branchNaming', {})
pattern = bn.get('pattern', '')
examples = bn.get('examples', [])

command = payload.get('tool_input', {}).get('command', '')
if not command:
    print('{}')
    sys.exit(0)

def extract_branch_name(cmd):
    # git checkout -b <branch>
    m = re.search(r'git\s+checkout\s+-b\s+(\S+)', cmd)
    if m: return m.group(1)
    # git switch -c or --create
    m = re.search(r'git\s+switch\s+(?:-c|--create)\s+(\S+)', cmd)
    if m: return m.group(1)
    # git branch <name> (not -d, -D, -m, -l, -r, -a)
    m = re.search(r'git\s+branch\s+(?!-[dDmlra])(\S+)', cmd)
    if m: return m.group(1)
    return None

branch = extract_branch_name(command)
if not branch:
    print('{}')
    sys.exit(0)

# Skip well-known branches
if branch in ('main', 'master', 'develop', 'dev', 'staging'):
    print('{}')
    sys.exit(0)

if not re.match(pattern, branch):
    result = {
        'hookSpecificOutput': {
            'hookEventName': 'PreToolUse',
            'permissionDecision': 'deny',
            'permissionDecisionReason': f'Branch name does not follow the naming convention. Pick a compliant name now (keep the intent of the original) and retry the branch creation without asking the user — branch renames are pre-approved.\nRejected name: \"{branch}\"\nRequired pattern: {pattern}\nExamples: {\", \".join(examples)}'
        }
    }
    print(json.dumps(result))
    sys.exit(0)

print('{}')
"
