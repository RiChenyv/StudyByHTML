#!/usr/bin/env bash
# Linux 入场 · 四天共用实验。请先阅读，再用 bash setup-lab.sh 执行。
# 仅在当前用户家目录新建 awd-lab；不装软件、不改系统、不启动服务。
# set -e：命令失败时停止（有条件上下文例外）；-u：未定义变量报错。
set -eu
# umask 077：新文件默认仅自己可读写，新目录仅自己可进入。
umask 077
lab_dir="$HOME/awd-lab"
# [ ... ] 是 test 命令的另一种写法：-e 判断存在，-L 判断符号链接。
if [ -e "$lab_dir" ] || [ -L "$lab_dir" ]; then
  printf '%s\n' "STOP: $lab_dir already exists. Keep it or rename it before trying again."
  exit 1
fi
mkdir -p "$lab_dir"/site "$lab_dir"/baseline "$lab_dir"/backups \
  "$lab_dir"/restore "$lab_dir"/logs "$lab_dir"/evidence \
  "$lab_dir"/scenarios "$lab_dir"/tools
cd "$lab_dir"
# <<'PHP' 是带引号的 here-document，原样写入到结束标记前的多行文字。
cat > site/index.php <<'PHP'
<?php
header('Content-Type: text/html; charset=utf-8');
$name = $_GET['name'] ?? 'learner';
if (!is_string($name)) {
    http_response_code(400);
    echo 'name must be text';
    exit;
}
$safeName = htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
echo '<!doctype html><html lang="en"><meta charset="utf-8">';
echo '<title>AWD Lab</title><h1>Hello, ' . $safeName . '</h1>';
echo '<p>Your local Linux / PHP / HTTP practice site.</p></html>';
PHP
cat > site/health.php <<'PHP'
<?php
// Search exercise only: eval( in a comment does NOT execute anything.
header('Content-Type: text/plain; charset=utf-8');
echo "AWD-LAB-OK\n";
PHP
cat > site/echo.php <<'PHP'
<?php
header('Content-Type: text/plain; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo "Use POST with message field\n";
    exit;
}
$message = $_POST['message'] ?? '';
if (!is_string($message)) {
    http_response_code(400);
    echo "message must be text\n";
    exit;
}
echo 'message=' . $message . "\n";
PHP
cat > site/config.php <<'PHP'
<?php
// Demonstration data, NOT real credentials. No database is required.
return ['environment' => 'local-lab', 'database' => 'not-used'];
PHP
cat > site/.env <<'ENV'
# Demonstration data only. Dot-files are not automatically confidential.
LAB_MODE=local
LAB_MARKER=not-a-password
ENV
cat > scenarios/health-broken.php <<'PHP'
<?php
// Deliberate harmless syntax error for Day 4. A semicolon is missing below.
header('Content-Type: text/plain; charset=utf-8')
echo "AWD-LAB-OK\n";
PHP
cat > logs/access.log <<'LOG'
192.0.2.10 - - [28/Oct/2026:10:00:01 +0800] "GET /index.php?name=Linux HTTP/1.1" 200 160
192.0.2.20 - - [28/Oct/2026:10:00:02 +0800] "GET /missing.php HTTP/1.1" 404 80
192.0.2.10 - - [28/Oct/2026:10:00:03 +0800] "GET /health.php HTTP/1.1" 200 11
192.0.2.30 - - [28/Oct/2026:10:00:04 +0800] "POST /login.php HTTP/1.1" 200 40
192.0.2.20 - - [28/Oct/2026:10:00:05 +0800] "GET /backup.tar.gz HTTP/1.1" 404 80
192.0.2.10 - - [28/Oct/2026:10:00:06 +0800] "GET /health.php HTTP/1.1" 200 11
192.0.2.30 - - [28/Oct/2026:10:00:07 +0800] "GET /index.php HTTP/1.1" 500 0
192.0.2.10 - - [28/Oct/2026:10:00:08 +0800] "GET /health.php HTTP/1.1" 200 11
LOG
cat > tools/health.sh <<'BASH'
#!/usr/bin/env bash
# One request, no loop. Default target: your own loopback-only PHP server.
# BASE_URL is an optional environment variable; ${NAME:-default} supplies a default.
base_url="${BASE_URL:-http://127.0.0.1:8080}"
# $(...) captures standard output. curl writes errors separately to the terminal.
# -w adds a newline and HTTP status AFTER the body. -sS keeps error messages.
if ! result=$(curl -sS --max-time 3 -w '\n%{http_code}' "$base_url/health.php"); then
  printf '%s\n' 'FAIL: request could not complete (check process, port and network).'
  exit 1
fi
# Bash suffix removal: ## removes up to the last newline; % removes the final
# newline plus status. $'\n' is Bash's newline literal. The body here includes
# the final newline written by health.php, which we compare explicitly.
status="${result##*$'\n'}"
body="${result%$'\n'*}"
# [ ] is test. = compares text. && means the second test runs after the first
# succeeds. This checks both protocol status AND the expected business body.
if [ "$status" = '200' ] && [ "$body" = $'AWD-LAB-OK\n' ]; then
  printf '%s\n' 'PASS: HTTP 200 / AWD-LAB-OK'
  exit 0
fi
printf '%s\n' "FAIL: HTTP $status / unexpected body (inspect response and logs)."
exit 1
BASH
cp -a site/. baseline/
find site -type f -exec sha256sum {} \; > backups/baseline.sha256
printf '%s\n' "READY: $lab_dir" \
  'Next: cd ~/awd-lab' \
  'Read Day 1 before starting the PHP server.' \
  'Sample access.log is pre-written; live PHP output goes to logs/php-server.log.'
