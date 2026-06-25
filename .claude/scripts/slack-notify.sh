#!/bin/bash

# SLACK_WEBHOOK_URL 환경변수가 없으면 조용히 종료
if [ -z "$SLACK_WEBHOOK_URL" ]; then
  exit 0
fi

EVENT_TYPE="${1:-stop}"

if [ "$EVENT_TYPE" = "permission" ]; then
  # stdin에서 훅 JSON 데이터 읽기
  HOOK_DATA=$(cat)

  # python3으로 message 파싱
  PERMISSION_MSG=$(echo "$HOOK_DATA" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('message', '알 수 없는 요청'))
except Exception:
    print('알 수 없는 요청')
")

  MESSAGE=":warning: *Claude Code 권한 요청*\n${PERMISSION_MSG}\n모바일에서 승인해주세요."
else
  MESSAGE=":white_check_mark: *Claude Code 작업 완료*\n작업이 끝났습니다."
fi

curl -s -X POST \
  -H 'Content-type: application/json' \
  --data "{\"text\":\"${MESSAGE}\"}" \
  "$SLACK_WEBHOOK_URL" \
  > /dev/null 2>&1

exit 0
