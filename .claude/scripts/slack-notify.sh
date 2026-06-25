#!/bin/bash

# SLACK_WEBHOOK_URL 환경변수가 없으면 조용히 종료
if [ -z "$SLACK_WEBHOOK_URL" ]; then
  exit 0
fi

EVENT_TYPE="${1:-stop}"

# stdin에서 훅 JSON 데이터 읽기
HOOK_DATA=$(cat)

# cwd에서 프로젝트명 추출
CWD=$(echo "$HOOK_DATA" | jq -r '.cwd // empty' 2>/dev/null)
PROJECT_NAME=$(basename "${CWD:-$PWD}")
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

if [ "$EVENT_TYPE" = "permission" ]; then
  STATUS=$(echo "$HOOK_DATA" | jq -r '.message // ""' 2>/dev/null)
  TITLE="🔔 권한 요청 알림"
  FOOTER="Claude Code에서 알림이 도착했습니다."
else
  STATUS=""
  TITLE="🔔 작업 완료 알림"
  FOOTER="Claude Code 작업이 완료되었습니다."
fi

PAYLOAD=$(jq -n \
  --arg title "$TITLE" \
  --arg project "$PROJECT_NAME" \
  --arg status "$STATUS" \
  --arg time "$TIMESTAMP" \
  --arg footer "$FOOTER" \
  '{
    username: "Claude Code",
    icon_emoji: ":bell:",
    text: "\($title)\n\n프로젝트: `\($project)`\n상태: \($status)\n시간: \($time)\n\n\($footer)"
  }')

curl -s -X POST \
  -H 'Content-type: application/json' \
  --data "$PAYLOAD" \
  "$SLACK_WEBHOOK_URL" \
  > /dev/null 2>&1

exit 0
