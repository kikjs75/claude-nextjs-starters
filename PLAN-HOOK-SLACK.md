# Claude Code Hooks × Slack 알림 설정 계획

## Context

모바일 Slack 앱으로 두 가지 이벤트를 수신하기 위한 설정:
1. **권한 요청 시** — Claude Code가 새로운 도구 사용 허가를 물어볼 때
2. **작업 완료 시** — Claude Code가 응답을 마치고 대기 상태가 될 때

적용 범위: `claude-nextjs-starters` 프로젝트만 (`.claude/settings.local.json`)

---

## 사전 작업: Slack Incoming Webhook 생성

구현 전 직접 처리해야 하는 단계:

1. https://api.slack.com/apps 접속 → **Create New App** → **From scratch**
2. App 이름 입력 (예: `Claude Code Notifier`), 워크스페이스 선택
3. 좌측 메뉴 **Incoming Webhooks** → **Activate** 토글 ON
4. **Add New Webhook to Workspace** → 알림 받을 채널 선택 → 허용 => claude-notify
5. 생성된 URL 복사: `https://hooks.slack.com/services/T.../B.../...`
6. `~/.zshrc`에 환경변수 추가:
   ```bash
   export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/T.../B.../..."
   
   export SLACK_WEBHOOK_URL="YOUR_SLACK_WEBHOOK_URL_1" : 동작O(채널 만들면서 생성)
   curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, World!"}' YOUR_SLACK_WEBHOOK_URL_1   

   export SLACK_WEBHOOK_URL="YOUR_SLACK_WEBHOOK_URL_2 : 동작O(App 에서 incoming hook 추가해서 생성)
   curl -X POST --data-urlencode "payload={\"channel\": \"#my-channel-here\", \"username\": \"webhookbot\", \"text\": \"This is posted to #my-channel-here and comes from a bot named webhookbot.\", \"icon_emoji\": \":ghost:\"}" YOUR_SLACK_WEBHOOK_URL_2

   curl -X POST --data-urlencode "payload={\"channel\": \"#claude-notify\", \"username\": \"webhookbot\", \"text\": \"This is posted to #claude-notify and comes from a bot named webhookbot.\", \"icon_emoji\": \":ghost:\"}" YOUR_SLACK_WEBHOOK_URL_2

   ```
7. `source ~/.zshrc` 실행

---

## 구현 계획

### 1단계: Slack 알림 스크립트 생성

**파일**: `.claude/scripts/slack-notify.sh`

- stdin에서 Claude Code가 전달하는 JSON 훅 데이터를 읽음
- 첫 번째 인자(`$1`)로 이벤트 유형 구분 (`permission` / `stop`)
- `SLACK_WEBHOOK_URL` 환경변수가 없으면 조용히 종료 (오류 없음)
- `python3`으로 JSON에서 `tool_name` 파싱 (macOS 기본 탑재)
- `curl`로 Slack에 POST 요청

**메시지 포맷:**
- 권한 요청: `:warning: *Claude Code 권한 요청*\n요청 도구: \`{tool_name}\`\n모바일에서 승인해주세요.`
- 작업 완료: `:white_check_mark: *Claude Code 작업 완료*\n작업이 끝났습니다.`

### 2단계: settings.local.json 훅 설정 추가

**파일**: `.claude/settings.local.json`

기존 `hooks.PreToolUse` 배열은 유지하고, 두 훅을 추가:

```json
"Notification": [
  {
    "matcher": "permission_prompt",
    "hooks": [
      {
        "type": "command",
        "command": "bash /Users/jinsu.kim/job/study/claude/claude-nextjs-starters/.claude/scripts/slack-notify.sh permission"
      }
    ]
  }
],
"Stop": [
  {
    "matcher": "",
    "hooks": [
      {
        "type": "command",
        "command": "bash /Users/jinsu.kim/job/study/claude/claude-nextjs-starters/.claude/scripts/slack-notify.sh stop"
      }
    ]
  }
]
```

**훅 이벤트 선택 근거:**
- `Notification` + matcher `permission_prompt`: Claude Code가 사용자에게 권한을 요청하는 순간 트리거
- `Stop`: Claude Code가 응답을 완료하고 입력 대기 상태로 전환될 때 트리거

---

## 최종 파일 구조

```
.claude/
├── scripts/
│   └── slack-notify.sh    ← 신규 생성
└── settings.local.json    ← hooks 섹션 업데이트
```

---

## 검증 방법

1. `~/.zshrc`에 `SLACK_WEBHOOK_URL` 설정 후 `source ~/.zshrc`
2. Claude Code 재시작 (훅은 시작 시 로드됨)
3. **권한 요청 테스트**: 허가 목록에 없는 명령 실행 시도 → Slack 알림 확인
- 프롬프트: root 디렉토리에 test.txt 파일을 만들어줘!
4. **작업 완료 테스트**: 간단한 질문 후 응답 완료 시 → Slack 알림 확인
5. 알림 미수신 시 `claude --debug hooks` 로 훅 실행 로그 확인

---

## Q&A

### Q1. `echo '{"tool_name":"Bash"}'`가 어떻게 permission 훅 테스트가 되는가?

엄밀히 말하면 **스크립트 자체의 동작 확인**이지, 실제 훅 트리거를 테스트한 건 아님.

Claude Code가 `Notification` 훅을 실행할 때 스크립트의 **stdin으로 JSON을 전달**한다. 스크립트 내부에서 `cat`으로 그 JSON을 읽는다:

```bash
HOOK_DATA=$(cat)   # stdin에서 Claude Code가 넘겨준 JSON 읽기
TOOL_NAME=$(echo "$HOOK_DATA" | python3 -c "...")  # tool_name 파싱
```

테스트 명령어에서 `echo '{"tool_name":"Bash"}'`로 **stdin을 직접 흉내낸 것**:

```bash
echo '{"tool_name":"Bash"}' | bash slack-notify.sh permission
#  ^--- 가짜 stdin 주입        ^--- 실제 스크립트 실행
```

- **테스트**: `echo`로 직접 JSON을 stdin에 주입 → 스크립트가 메시지 전송하는지 확인
- **실제**: Claude Code가 권한 요청 시 JSON을 stdin으로 전달 → 동일한 스크립트 실행

스크립트 로직은 검증됐지만, 실제 Claude Code가 `permission_prompt` 이벤트를 훅에 연결하는지는 Claude Code 재시작 후 허가 목록에 없는 명령을 실행해봐야 확인 가능.

---

### Q2. stop 훅 테스트는 어떻게 테스트가 되는가?

`stop` 이벤트는 stdin으로 JSON을 전달하지 않음. 스크립트 내부를 보면:

```bash
if [ "$EVENT_TYPE" = "permission" ]; then
  HOOK_DATA=$(cat)   # permission만 stdin 읽음
  ...
else
  # stop은 stdin 없이 바로 메시지 전송
  MESSAGE=":white_check_mark: *Claude Code 작업 완료*\n작업이 끝났습니다."
fi
```

`stop`은 `$1` 인자가 `stop`이면 고정 메시지를 Slack으로 보내는 것이 전부라 stdin 데이터가 필요 없음. 그래서 아래 명령만으로 충분하며, 실제 Claude Code의 `Stop` 훅 실행과 동일한 흐름:

```bash
bash slack-notify.sh stop
```

**결론**: 두 테스트 모두 "스크립트가 Slack에 메시지를 정상적으로 보낼 수 있는가"만 검증한 것. 실제 훅 연동(Claude Code가 이벤트 발생 시 스크립트를 자동 호출하는지)은 Claude Code 재시작 후 실제 상황에서 확인해야 함.
