"use strict";
// 题库不运行输入。判题保留大小写、引号内文本和选项值。
const CHALLENGES = [];
function commandQuestion(day,title,context,answer,hint,explanation,commands,alternatives=[]){
  CHALLENGES.push({id:`d${day}-q${CHALLENGES.filter(q=>q.day===day).length+1}`,day,type:"command",title,context,answer,hint,explanation,commands,alternatives});
}
function choiceQuestion(day,title,context,choices,correct,explanation,commands){
  CHALLENGES.push({id:`d${day}-q${CHALLENGES.filter(q=>q.day===day).length+1}`,day,type:"choice",title,context,choices,correct,explanation,commands});
}
commandQuestion(1,"我现在在哪？","输出当前工作目录的绝对路径。", "pwd","命令由 print working directory 的首字母组成。","pwd 不改变目录，只显示位置。pwd -L 和 -P 也能完成本题。",["pwd"],["pwd -L","pwd -P"]);
commandQuestion(1,"回到实验起点","将当前目录切换到家目录下的 awd-lab。","cd ~/awd-lab","~ 表示家目录，cd 改变工作目录。","路径大小写敏感，~/awd-lab 不等于 ~/AWD-LAB。",["cd"]);
commandQuestion(1,"隐藏文件也要看到","以长格式并使用易读大小单位，列出 site 里的所有内容，包含 . 和 ..。","ls -lah site","三个选项分别是长格式、全部内容、易读单位。","-l、-a、-h 可组合也可分开，选项顺序不重要；-A 会排除 . 和 ..，不满足本题。",["ls"]);
commandQuestion(1,"创建多级恢复目录","一次创建 restore/day1 及缺少的上层目录。","mkdir -p restore/day1","使用会补齐上层目录的选项。","-p 可让不存在的父目录一起创建；目录已存在时也不会因此报错。",["mkdir"]);
commandQuestion(1,"读 PHP 时带上行号","显示 site/index.php 的全部内容，并为每一行编号。","cat -n site/index.php","cat 的行号选项是 -n。","-n 给所有行编号；-b 只编号非空行，所以不满足本题。",["cat"]);
commandQuestion(1,"先读前三条日志","只显示 logs/access.log 开头三行。","head -n 3 logs/access.log","head 看开头，-n 后跟行数。","head -n 3 与 head -n3 都能表示前三行。",["head"]);
commandQuestion(1,"复制一个基线文件","复制 site/index.php 到 evidence/index.php，目标已存在时先询问。","cp -i site/index.php evidence/index.php","复制是 cp，交互确认是 -i。","源在前，目标在后。-i 可以提醒覆盖，但依然要读提示内容。",["cp"]);
commandQuestion(1,"给笔记改名","把 notes.txt 改名为 day1-notes.txt，覆盖目标前询问。","mv -i notes.txt day1-notes.txt","移动与改名使用同一命令。","mv 改名不会保留旧名称的副本；要保留原文件用 cp。",["mv"]);
commandQuestion(1,"删除前停一步","删除 day1-notes.txt，要求对该对象交互确认。","rm -i day1-notes.txt","本题只有单个文件，不需要递归或强制选项。","-i 是逐项询问；-f 会取消询问，与题意冲突。",["rm"]);
commandQuestion(1,"打包站点全部内容","在 ~/awd-lab 中，把 site 内全部内容（含隐藏文件）归档并 gzip 压缩到 backups/site.tar.gz。使用 -C 指定起点。","tar -czf backups/site.tar.gz -C site .","c 创建，z 使用 gzip，f 后面是包名；-C site 后用 . 表示内容。","包位于站点外；. 包含隐藏文件。不能把 -C 改成小写 -c。",["tar"],["tar -czvf backups/site.tar.gz -C site .","tar czf backups/site.tar.gz -C site ."]);
commandQuestion(1,"先看包里装了什么","列出 gzip 归档 backups/site.tar.gz 的内容，不解包。","tar -tzf backups/site.tar.gz","列出使用 t，不是 x。","-t 只列清单，-x 会解包；两者不能混用。",["tar"],["tar -tzvf backups/site.tar.gz"]);
commandQuestion(1,"在独立目录恢复","restore 已存在且为空，将 backups/site.tar.gz 解到 restore。","tar -xzf backups/site.tar.gz -C restore","x 解包，-C 指定目标目录。","先准备目标目录，避免在在线网站中直接解包。",["tar"],["tar -xzvf backups/site.tar.gz -C restore"]);
choiceQuestion(1,"哪一条真正代表位置？","你刚运行 cd site，接着看到提示符 learner@lab:~/awd-lab/site$。",["所有以 / 开头的路径都从当前目录出发。","pwd 显示工作目录，/ 开头的路径从根目录出发。","~ 永远等于 /root。","提示符必须和命令一起复制。"],1,"绝对路径从 / 出发，相对路径从工作目录出发；~ 是当前用户家目录。",["pwd","cd"]);
choiceQuestion(1,"什么才算可恢复备份？","你需要在改网站前保存回退路径。",["把 backup.tar.gz 放在 site 内，方便浏览器下载。","只要 tar 没报错，就不需要再检查。","包放站点外，列出内容并在独立目录恢复验证。","复制 index.php 就等于备份了数据库。"],2,"备份要覆盖需要恢复的数据且经过验证。数据库和服务配置还需按实际部署单独保存。",["tar"]);
choiceQuestion(1,"谁会清空已有笔记？","notes.txt 已有两天笔记。",["printf '%s\\n' 'new' >> notes.txt","cat notes.txt","printf '%s\\n' 'new' > notes.txt","head notes.txt"],2,"> 在命令执行前由 Shell 打开并截断文件；>> 才是在结尾追加。",["printf"]);
choiceQuestion(1,"不会的命令怎样查？","环境断网，想查 Bash 的 cd 用法。",["help cd","curl cd","cd --manual-download","删除目录后重新安装 Shell。"],0,"help 查询 Bash 内建命令；普通工具可查本地 man 或各自帮助。",["help","man"]);

commandQuestion(2,"源码中的固定文字","递归搜索 site 中包含固定字符串 eval( 的行，并显示行号；不限制文件后缀。","grep -rnF 'eval(' site","需要递归、行号与固定字符串三个选项。","-F 不把括号等符号当正则。命中后必须读上下文。",["grep"]);
commandQuestion(2,"只找 PHP 文件","从 site 出发，查找普通文件中名称匹配 *.php 的对象。","find site -type f -name '*.php'","find 的模式加引号，-type f 限定普通文件。","Shell 通配符若提前展开，find 收到的参数就可能不再正确。",["find"],["find site -name '*.php' -type f"]);
commandQuestion(2,"近半小时改过什么？","查找 site 中最近不足 30 分钟内容被修改的普通文件。","find site -type f -mmin -30","分钟选项是 -mmin，负数表示小于这个时间区间。","-mtime 按完整的 24 小时区间，不适合表达本题三十分钟。",["find"],["find site -mmin -30 -type f"]);
commandQuestion(2,"筛出 404 记录","示例日志以空格分隔状态码。显示 logs/access.log 中包含 ' 404 ' 的行，并带行号。","grep -n ' 404 ' logs/access.log","把数字两边的空格包含在引号内。","保留边界空格能减少误匹配路径里的数字；真实日志仍要按格式解析。",["grep"],["grep -nF ' 404 ' logs/access.log"]);
commandQuestion(2,"最后五行","显示 logs/access.log 的末尾五行。","tail -n 5 logs/access.log","tail 是看结尾，不是 head。","-n 5 指定行数。-f 或 -F 会持续跟随，超出本题单次查看要求。",["tail"]);
commandQuestion(2,"从日志提取第一字段","使用 awk 输出 logs/access.log 中每一行的第一字段。","awk '{print $1}' logs/access.log","awk 程序放单引号里，字段编号以 $ 开头。","默认以连续空白分字段；本题的第一字段是来源地址。",["awk"]);
commandQuestion(2,"数出来源排行","从样例日志提取来源地址，先排序再统计相邻重复行，最后按次数数值降序。","awk '{print $1}' logs/access.log | sort | uniq -c | sort -nr","需要四段管道：提取、排序、计数、数值降序。","uniq 只能合并相邻重复行；没有前面的 sort 会漏合并。",["awk","sort","uniq"]);
commandQuestion(2,"把 404 线索保存下来","过滤 logs/access.log 中 ' 404 ' 的行，覆盖保存到 evidence/not-found.log，不加行号。","grep ' 404 ' logs/access.log > evidence/not-found.log","使用标准输出覆盖重定向 >。","原始日志仍保留；>> 会追加，不符合本题覆盖要求。",["grep"],["grep -F ' 404 ' logs/access.log > evidence/not-found.log"]);
commandQuestion(2,"读懂身份","显示自己的 UID、GID 和全部所属组。","id","不带选项时显示完整身份。","id -u 只显示 UID，信息不足；whoami 只显示用户名。",["id"]);
commandQuestion(2,"把配置权限设为 640","只更改 site/config.php 的权限：属主读写、组只读、其他无权。","chmod 640 site/config.php","r=4、w=2、x=1；三组依次相加。","640 = rw- r-- ---；没有执行位，也不递归修改整个目录。",["chmod"],["chmod u=rw,g=r,o= site/config.php"]);
commandQuestion(2,"统计日志行数","使用 wc 输出 logs/access.log 的换行符数。","wc -l logs/access.log","小写 l 表示 lines。","有些文本末行没有换行，wc -l 的数量可能比视觉行数少一行。",["wc"]);
commandQuestion(2,"预览 PHP 前五行","使用 sed，仅打印 site/index.php 第 1 到第 5 行，不修改文件。","sed -n '1,5p' site/index.php","-n 取消默认输出，范围后接 p。","-n 是选项，1,5p 是处理规则。没有 -i，不会改动文件。",["sed"]);
choiceQuestion(2,"命中 eval 就删文件？","grep 找到 health.php 注释中的 eval(。",["立即 rm -rf 整个站点。","证明这个文件正在执行恶意代码。","先查看上下文、比较基线，并结合请求和运行行为判断。","没有其他命中说明全站安全。"],2,"关键词只提供线索。注释不会作为 PHP 代码执行；后门也可能完全不包含这个关键词。",["grep","diff"]);
choiceQuestion(2,"755 对目录意味着什么？","某目录权限为 drwxr-xr-x。",["所有人都能写入。","只有属主可写，组和其他用户可列出、进入。","只有 root 能访问。","它等于所有用户都拥有该目录。"],1,"三组分别是 rwx、r-x、r-x。目录的 x 用于进入与路径访问，不是运行目录。",["chmod","ls"]);
choiceQuestion(2,"哪个权限方案更合理？","真实部署中，Web 运行账户需要写 uploads，但通常不需改源码。",["全部源码 777 最省事。","只按业务需要给 uploads 写权限，源码保持尽可能不可写，并验证服务仍可读。","把全部源码改为同一账户拥有就自动安全。","去掉所有目录 x 权限。"],1,"权限要看运行身份和读写需求。任意放宽或统一收紧都可能破坏安全或功能。",["chmod","chown","id"]);
choiceQuestion(2,"日志能证明哪些内容？","一条记录为 POST /login.php，状态码 200。",["一定是攻击，而且已经成功。","一定是正常登录成功。","只说明记录了这一请求与响应状态，还要查业务正文、关联日志和会话。","一定没有 POST 正文。"],2,"200 是 HTTP 层的结果，不等于登录成功。常见访问日志也不保存完整请求正文。",["grep","tail"]);

commandQuestion(3,"先检查 PHP 语法","不执行站点业务，仅检查 site/index.php 的语法。","php -l site/index.php","小写 l 是 lint。","-l 不能证明输入校验、权限和业务逻辑正确。",["php"]);
commandQuestion(3,"启动本机小站","在当前实验目录启动 PHP 内置服务器，只绑定 127.0.0.1:8080，Web 根目录为 site；本题不要求重定向。","php -S 127.0.0.1:8080 -t site","启动服务器是大写 -S，文档根目录是 -t。","绑定回环地址只服务当前机器；0.0.0.0 会监听所有 IPv4 接口，不符合本题。课程里的 -d 配置可一并使用。",["php"],["php -d display_errors=0 -d log_errors=1 -d opcache.enable=0 -S 127.0.0.1:8080 -t site"]);
commandQuestion(3,"同时查看响应头与正文","用 GET 请求本地 health.php，并显示响应头及正文。","curl -i 'http://127.0.0.1:8080/health.php'","小写 -i 包含响应头，大写 -I 改为 HEAD。","-i 不改变默认 GET 方法。-I 没有正文，不满足本题。",["curl"]);
commandQuestion(3,"单独练习 HEAD","对本地 health.php 发送 HEAD 请求。","curl -I 'http://127.0.0.1:8080/health.php'","这次需要大写 I。","HEAD 返回头而没有正文；它与 GET 的应用处理路径可能不同。",["curl"]);
commandQuestion(3,"看监听与关联进程","用 ss 只查看 TCP 监听，使用数字地址端口，并显示关联进程。","ss -lntp","四个选项：listen、numeric、TCP、process。","-l 只看监听；-a 包含非监听连接，不满足“只查看”。-p 的进程信息也受权限限制。",["ss"]);
commandQuestion(3,"查看进程快照","使用 ps 的 UNIX 风格，显示全部进程的完整格式。","ps -ef","全部 -e，完整格式 -f。","-ef 与 aux 是不同风格，本题指定 UNIX 风格。",["ps"]);
commandQuestion(3,"只输出健康端点状态码","curl 访问 health.php，隐藏进度但保留错误，总超时 3 秒，丢弃正文，输出状态码和换行。","curl -sS --max-time 3 -o /dev/null -w '%{http_code}\\n' 'http://127.0.0.1:8080/health.php'","需要 -sS、--max-time、-o 和 -w。","Shell 成功与 HTTP 成功不同。没有 -f 时，收到 404 也可能退出状态为 0。",["curl"]);
commandQuestion(3,"提交一份表单","向本地 echo.php 用 curl 的 -d 发送 message=Linux，并显示头和正文。","curl -i -d 'message=Linux' 'http://127.0.0.1:8080/echo.php'","-d 默认选择 POST，不需要另加 -X。","PHP 在 $_POST['message'] 中读取这个表单值。POST 本身不加密数据。",["curl"]);
commandQuestion(3,"最近十行服务日志","查看 logs/php-server.log 末尾十行，不持续跟随。","tail -n 10 logs/php-server.log","本题要显式指定行数。","这是 PHP 内置服务器输出，不等于 logs/access.log 的预置样例。",["tail"]);
commandQuestion(3,"SSH 端口是小写 p","用 SSH 以 learner 身份连接文档示例地址 192.0.2.10，端口 2222；这里只写格式，不执行。","ssh -p 2222 learner@192.0.2.10","用户@主机前指定 -p。","实际使用必须替换成授权实验机地址，并核对主机密钥指纹。",["ssh"]);
commandQuestion(3,"SCP 端口是大写 P","从文档示例远端下载 /home/learner/backup.tar.gz 到 ./，用户 learner，端口 2222；不执行。","scp -P 2222 learner@192.0.2.10:/home/learner/backup.tar.gz ./","scp 的小写 -p 表示保留属性，不是端口。","冒号分隔远端主机与路径。大小写敏感的判题可以区分 -p 和 -P。",["scp"]);
commandQuestion(3,"查真实部署的服务状态","假设已启用 systemd，用 systemctl 查看 nginx 状态，要求不进入分页器。","systemctl status nginx --no-pager","status 是子命令，--no-pager 取消分页。","仅查询，不重启服务；PHP 内置实验服务不由 systemctl 管理。",["systemctl"]);
choiceQuestion(3,"8080 监听着，可页面报 500","ss 能看到 8080，curl 返回 500。下一步最有用的是？",["监听正常就说明业务正常。","立刻 kill -9 所有 PHP 进程。","运行 php -l 检查相关文件，并查看错误日志。","把 site 权限全部改成 777。"],2,"网络入口可用不等于 PHP 正常。先根据错误证据定位语法、配置或运行问题。",["ss","php","tail"]);
choiceQuestion(3,"连接被拒绝要先查哪层？","curl 报 Failed to connect / Connection refused。",["先看目标地址端口与监听进程，而不是先改 PHP 页面内容。","这是 HTTP 404。","这证明密码泄露。","先全量升级系统。"],0,"连接还没建立，尚未收到 HTTP 响应。先检查服务是否启动、地址端口是否一致。",["ss","ps","curl"]);
choiceQuestion(3,"改 nginx 配置后的顺序","真实部署中需要修改 nginx 配置。",["编辑 → 无条件 restart → 不再检查。","nginx -t 检查 → 成功后按部署重载 → 验证业务与日志。","只要保存文件，所有配置就已生效。","php -l 能检查 nginx 配置。"],1,"工具检查各自的配置。重载成功还需确认请求实际行为正确。",["nginx","systemctl","curl"]);
choiceQuestion(3,"停止自己的前台实验服务","PHP 内置服务器正在终端 A 前台运行。",["在终端 A 按 Ctrl+C，再验证监听结束。","先找一个陌生 PID 强杀。","用 systemctl stop nginx 肯定会停掉它。","关闭 curl 会自动关闭 PHP 服务。"],0,"Ctrl+C 给当前前台程序发送中断信号。确认停止的是自己的实验服务。",["kill","ss"]);

commandQuestion(4,"阅读改动上下文","比较 baseline/health.php 与 site/health.php，用统一差异格式显示上下文。","diff -u baseline/health.php site/health.php","旧基线在前，新文件在后。","差异输出状态 1 表示两份不同，不是工具崩溃。",["diff"]);
commandQuestion(4,"整个目录与基线比较","递归比较 baseline 和 site，使用统一差异格式。","diff -ru baseline site","递归与统一格式两个选项。","文件权限改变不一定出现在内容差异里，权限应另用 stat 或 ls 查看。",["diff"]);
commandQuestion(4,"修改前先留证","复制 site/health.php 到 evidence/health-before.php，覆盖已有证据前询问。","cp -i site/health.php evidence/health-before.php","证据在 Web 根目录之外。","实际取证可采用不覆盖的唯一文件名，并记录时间和摘要。",["cp"]);
commandQuestion(4,"只恢复损坏的文件","用 baseline/health.php 覆盖恢复 site/health.php，要求先确认覆盖。","cp -i baseline/health.php site/health.php","注意源和目标的顺序。","恢复后还要检查语法与业务，而不是只看 cp 成功。",["cp"]);
commandQuestion(4,"给当前文件生成摘要清单","计算 site/index.php 的 SHA-256 校验和，覆盖保存到 backups/index.sha256。","sha256sum site/index.php > backups/index.sha256","正常输出经 > 写入清单。","只有生成清单时文件本身可信，后续比较才有意义。",["sha256sum"]);
commandQuestion(4,"验证摘要清单","在与生成清单相同的工作目录，按 backups/index.sha256 校验文件。","sha256sum -c backups/index.sha256","检查清单使用 -c。","摘要检查关注内容，不检查属主、权限或数据库。",["sha256sum"]);
commandQuestion(4,"先检查脚本语法","检查 tools/health.sh 的 Bash 语法，不执行它。","bash -n tools/health.sh","-n 只解析，不运行。","不能用 -x 代替 -n：-x 会执行并显示展开后的命令。",["bash"]);
commandQuestion(4,"执行一次业务健康检查","使用 Bash 运行 tools/health.sh，进行一次实际检查。","bash tools/health.sh","本题要执行，不加 -n。","它需要本地 PHP 服务在运行，同时要求 HTTP 200 与预期正文。",["bash"]);
commandQuestion(4,"只读查看用户计划任务","列出当前用户的 crontab，不编辑也不删除。","crontab -l","小写 l 是 list，-r 是移除整张表。","没有用户计划任务时可能返回非零；还不能排除系统级任务。",["crontab"]);
commandQuestion(4,"磁盘满了吗？","用易读单位显示当前目录所在挂载点的空间。","df -h .","df 看文件系统容量，. 指定当前目录所在位置。","磁盘满可能影响 Session、日志和缓存写入。",["df"]);
commandQuestion(4,"日志与备份各占多少？","以易读单位分别汇总 logs 和 backups 的空间，不逐文件展开。","du -sh logs backups","s 汇总，h 易读单位。","du 汇总目录占用；df 查看整个挂载点容量，两者用途不同。",["du"]);
commandQuestion(4,"脚本只给自己执行权限","在不移除既有权限的前提下，仅给属主添加 tools/health.sh 的执行位。","chmod u+x tools/health.sh","u 是属主，+ 是添加，x 是执行。","chmod +x 可能涉及其他身份，不能表达本题明确的“仅属主”。",["chmod"]);
choiceQuestion(4,"200 就通过了吗？","health.php 返回 200，但正文由 AWD-LAB-OK 变成 ERROR。",["通过，因为 TCP 正常。","通过，因为状态码是 200。","不通过，应同时验证业务预期正文。","用 -I 看不到正文就算通过。"],2,"HTTP 层成功不意味着业务成功。checker 可能验证更复杂的登录、读写和会话。",["curl","bash"]);
choiceQuestion(4,"校验清单显示 OK 的边界","sha256sum -c 全部 OK。",["证明整台服务器从未被入侵。","证明权限一定正确。","说明清单所覆盖文件的内容与记录一致，还需确认基线可信、权限和业务。","证明数据库也已校验。"],2,"完整性校验只覆盖被记录的文件内容。攻击者若能修改基线，结果也可能失去意义。",["sha256sum","stat"]);
choiceQuestion(4,"怎样记录一次恢复？","已恢复 health.php 并得到预期响应。",["只写“修好了”。","写明现象、证据、具体修改、验证结果和仍未知的部分。","删除证据，以免同名。","把整个证据目录放进网站公开访问。"],1,"可复现的记录能帮助判断原因、复核改动，也能减少下次的盲目操作。",["diff","printf"]);
choiceQuestion(4,"nohup 会把脚本变成监控服务吗？","运行 nohup bash tools/health.sh > logs/check-once.log 2>&1 &。",["会自动每五分钟执行。","会无限循环，直到重启。","只在后台运行一次，并忽略挂断信号；周期执行需要另行设计。","所有输出都会被删除。"],2,"nohup、& 与循环/调度是不同概念。> 和 2>&1 把正常与错误输出保存到日志。",["nohup","bash"]);

/* 有限的 Shell 词法器：只判题，不作 Shell 执行器。保留参数大小写与引号内空白。 */
function shellWords(input){
  const words=[];let value="",quote=null,started=false;
  const push=()=>{if(started){words.push(value);value="";started=false;}};
  for(let i=0;i<input.length;i++){
    const c=input[i];
    if(quote){
      if(c===quote){quote=null;continue;}
      if(c==='\\'&&quote==='"'&&/["\\$`\n]/.test(input[i+1]||"")){value+=input[++i];continue;}
      value+=c;continue;
    }
    if(c==='"'||c==="'"){quote=c;started=true;continue;}
    if(c==='\\'){if(i+1>=input.length)return null;value+=input[++i];started=true;continue;}
    if(/\s/.test(c)){push();continue;}
    if(/[|>&;]/.test(c)){
      if(c==='>'&&value==='2'){value="";started=false;words.push('2>');continue;}
      push();let op=c;if(input[i+1]===c&&/[>&|]/.test(c))op+=input[++i];words.push(op);continue;
    }
    value+=c;started=true;
  }
  if(quote)return null;push();return words;
}
const OPTION_SPEC = {
  pwd:{flags:"LP"},ls:{flags:"lahAtrd",aliases:{"--all":"a","--almost-all":"A","--human-readable":"h"}},
  mkdir:{flags:"p",aliases:{"--parents":"p"}},cat:{flags:"nbA",aliases:{"--number":"n"}},
  head:{values:"nc",aliases:{"--lines":"n"}},tail:{flags:"fF",values:"nc",aliases:{"--lines":"n"}},
  cp:{flags:"iaRrpvn",aliases:{"--interactive":"i"}},mv:{flags:"inv",aliases:{"--interactive":"i"}},rm:{flags:"irRf",aliases:{"--interactive":"i"}},
  grep:{flags:"rnFiEvlc",values:"e",longValues:["include"],aliases:{"--recursive":"r","--line-number":"n","--fixed-strings":"F"}},
  diff:{flags:"urqN",aliases:{"--unified":"u","--recursive":"r"}},chmod:{flags:"R"},
  ss:{flags:"lntpua",aliases:{"--listening":"l","--numeric":"n","--tcp":"t","--processes":"p"}},
  ps:{flags:"ef",values:"po"},php:{flags:"lv",values:"Std"},
  curl:{flags:"iIsSfGL",values:"odwHbcmX",longValues:["max-time","data-urlencode"],aliases:{"--include":"i","--head":"I","--silent":"s","--show-error":"S","--output":"o","--write-out":"w","--data":"d"}},
  ssh:{values:"pi"},scp:{flags:"rp",values:"Pi"},systemctl:{longFlags:["no-pager"]},
  wc:{flags:"lcmw",aliases:{"--lines":"l"}},sed:{flags:"nE"},sort:{flags:"nru"},uniq:{flags:"cdui"},
  sha256sum:{flags:"cb",aliases:{"--check":"c"}},bash:{flags:"nx"},crontab:{flags:"lre"},df:{flags:"hiT"},du:{flags:"sha"}
};
function canonicalSegment(tokens){
  const command=tokens[0],spec=OPTION_SPEC[command];
  if(!spec)return tokens;
  const flags=[],pos=[];let ended=false;
  for(let i=1;i<tokens.length;i++){
    let t=tokens[i];
    if(t==='--'){ended=true;continue;}
    if(!ended&&t.startsWith('--')){
      const m=t.slice(2).split(/=(.*)/s),key=m[0],attached=m.length>1?m[1]:null;
      const alias=spec.aliases&&spec.aliases['--'+key];
      if(alias){
        if((spec.values||'').includes(alias)){const v=attached!==null?attached:tokens[++i];if(v===undefined)return null;flags.push([alias,v]);}
        else {if(attached!==null)return null;flags.push([alias]);}continue;
      }
      if((spec.longFlags||[]).includes(key)&&attached===null){flags.push([key]);continue;}
      if((spec.longValues||[]).includes(key)){const v=attached!==null?attached:tokens[++i];if(v===undefined)return null;flags.push([key,v]);continue;}
      return null;
    }
    if(!ended&&/^-[^-]/.test(t)&&!/^-[0-9]/.test(t)){
      for(let k=1;k<t.length;k++){
        const flag=t[k];
        if((spec.values||'').includes(flag)){
          const v=k+1<t.length?t.slice(k+1):tokens[++i];if(v===undefined)return null;flags.push([flag,v]);break;
        }
        if(!(spec.flags||'').includes(flag))return null;flags.push([flag]);
      }
    }else pos.push(t);
  }
  flags.sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b),'en'));
  return [command,flags,pos];
}
function canonicalCommand(input){
  const tokens=shellWords(input);if(!tokens||!tokens.length)return null;
  const result=[];let segment=[];
  for(const token of tokens){
    if(['|','>','>>','2>','&&','&',';','||'].includes(token)){
      if(!segment.length)return null;const normalized=canonicalSegment(segment);if(!normalized)return null;
      result.push(normalized,token);segment=[];
    }else segment.push(token);
  }
  if(!segment.length)return null;const last=canonicalSegment(segment);if(!last)return null;result.push(last);return JSON.stringify(result);
}
function checkCommand(question,input){
  // 双引号中的 $ 和反引号会由真实 Shell 展开，这类输入不当作单引号等价。
  // 变量和引号展开超出本题库支持范围时给出明确反馈，不执行任何内容。
  if(/"[^"\n]*(?:\$|`)[^"\n]*"/.test(input))return false;
  let quote=null;
  for(let i=0;i<input.length;i++){
    const c=input[i];
    if(c==='\\'&&quote!=="'"){i++;continue;}
    if(quote){if(c===quote)quote=null;continue;}
    if(c==='"'||c==="'"){quote=c;continue;}
    // 这些字符不加引号会触发 Shell 展开或语法解析，而不是字面文字。
    if(/[?*()$`\[\]{}]/.test(c))return false;
  }
  const value=canonicalCommand(input);
  return value!==null&&[question.answer,...question.alternatives].some(answer=>canonicalCommand(answer)===value);
}
