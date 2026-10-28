"use strict";
const $=s=>document.querySelector(s);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const termPattern=new RegExp(Object.keys(TERMS).sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
function prose(value){return String(value).split(termPattern).length===1?esc(value):String(value).replace(termPattern,'\u0001$&\u0001').split('\u0001').map((part,i)=>i%2?`<button class="term" type="button" data-term="${esc(part)}" title="解释：${esc(part)}">${esc(part)}</button>`:esc(part)).join('');}
function commandChip(name){return `<button class="chip" data-command="${esc(name)}" type="button">${esc(name)}</button>`;}
function codeBlock(value,label='BASH · 在 Linux 终端执行'){return `<div class="code-block"><div class="code-top"><span>${esc(label)}</span><button class="copy-button" data-copy="${esc(encodeURIComponent(value))}" type="button" aria-label="复制代码">复制</button></div><pre><code>${esc(value)}</code></pre></div>`;}
const TASK_IDS=DAYS.flatMap(day=>day.lessons.flatMap((lesson,i)=>lesson.tasks.map((_,j)=>`day${day.id}-${i}-${j}`)));
let storageAvailable=true;
function readStored(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
let saved=readStored('linux-awd-v2',{});
if(!saved||typeof saved!=='object'||Array.isArray(saved))saved={};
let state={tasks:{},quiz:{}};
for(const id of TASK_IDS)if(saved.tasks&&saved.tasks[id]===true)state.tasks[id]=true;
for(const q of CHALLENGES)if(saved.quiz&&['solved','seen'].includes(saved.quiz[q.id]))state.quiz[q.id]=saved.quiz[q.id];
function save(){try{localStorage.setItem('linux-awd-v2',JSON.stringify(state));}catch{if(storageAvailable){storageAvailable=false;toast('浏览器禁止本地存储，本次记录仅在当前页面保留。');$('.offline').textContent='仅本次会话 · 存储不可用';}}}
const navItems=[['home','◎','路线总览'],['start','↳','开始前的准备'],...DAYS.map(d=>[`day-${d.id}`,`0${d.id}`,d.title.split('，')[0]]),['commands','⌘','命令速查'],['challenges','↗','命令挑战'],['glossary','Aa','术语词典'],['playbook','≡','AWD 操作清单']];
let route='home',commandCategory='全部',commandDay='all',commandQuery='',glossaryQuery='';
let quizDay='all',quizType='all',quizMode='all',currentQuizId=null,answerVisible=false;
let toastTimer;
function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,3200);}
function dayTaskIds(day){return TASK_IDS.filter(id=>id.startsWith(`day${day}-`));}
function dayDone(day){return dayTaskIds(day).filter(id=>state.tasks[id]).length;}
function solvedCount(day){return CHALLENGES.filter(q=>(!day||q.day===day)&&state.quiz[q.id]==='solved').length;}
function updateProgress(){
  const done=Object.keys(state.tasks).length,total=TASK_IDS.length,pct=Math.round(done/total*100);
  $('#side-progress').textContent=pct+'%';$('#progress-bar').value=pct;
  $('#progress-description').textContent=`已完成 ${done} / ${total} 个实践任务`;
  document.querySelectorAll('[data-progress-day]').forEach(node=>{const d=Number(node.dataset.progressDay);node.textContent=`${dayDone(d)} / ${dayTaskIds(d).length} 已完成`;});
  document.querySelectorAll('[data-progress-track]').forEach(node=>{const d=Number(node.dataset.progressTrack);node.innerHTML=dayTaskIds(d).map((id)=>`<span class="${state.tasks[id]?'complete':''}"></span>`).join('');});
  document.querySelectorAll('[data-quiz-total]').forEach(node=>node.textContent=solvedCount());
}
function renderNavigation(){
  $('#navigation').innerHTML=navItems.map(([key,index,title],i)=>`${i===6?'<div class="nav-divider"></div>':''}<a class="nav-link ${route===key?'active':''}" href="#${key}" ${route===key?'aria-current="page"':''}><span class="nav-index">${index}</span><span>${title}</span></a>`).join('');
}
function intro(kicker,title,text){return `<div class="page-intro"><div class="eyebrow">${kicker}</div><h1 tabindex="-1">${title}</h1><p class="lead">${prose(text)}</p></div>`;}
function renderHome(){
  const next=DAYS.find(d=>dayDone(d.id)<dayTaskIds(d.id).length);
  return `<section class="hero"><div><div class="eyebrow">A SMALL START. A SOLID FOUNDATION.</div><h1>从第一个命令，<br>走进 <span>Linux 现场。</span></h1><p class="lead">为 AWD 零基础学习者准备的四天入门路线。<br>从读懂目录，到看懂请求，再到守住自己的 PHP 小站。每一步都有解释，也有练习。</p><div class="button-row"><a class="button primary" href="#${Object.keys(state.tasks).length&&next?'day-'+next.id:'start'}">${Object.keys(state.tasks).length&&next?'继续学习':'开始四天学习'} <span>↗</span></a><a class="button subtle" href="#commands">查一条命令 →</a></div></div><div class="hero-terminal" aria-label="示例：从位置到备份，再到业务验证"><div class="terminal-bar"><i></i><i></i><i></i><span>learner@lab · ~/awd-lab</span></div><div class="terminal-body"><div><span class="prompt">$</span> pwd</div><div class="comment">/home/learner/awd-lab</div><div><span class="prompt">$</span> tar -czf backups/site.tar.gz -C site .</div><div class="comment"># 先给每次修改，留一条回去的路。</div><div><span class="prompt">$</span> bash tools/health.sh</div><div class="prompt">PASS · HTTP 200 / AWD-LAB-OK</div></div><div class="terminal-bottom">位置清楚 · 数据可恢复 · 业务可验证</div></div></section>
  <div class="section-heading"><h2>四天，一条清晰的学习链路</h2><span class="small">建议约 16 小时 · 可分段完成</span></div>
  <div class="route-grid">${DAYS.map(day=>`<a class="route-card" href="#day-${day.id}"><div class="day-number">DAY 0${day.id}<span>↗</span></div><h3>${esc(day.title)}</h3><p>${esc(day.short)}<br>${esc(day.goal)}</p><div class="route-footer"><span>${esc(day.time)} · <span data-progress-day="${day.id}"></span></span><b>→</b></div><div class="route-track" data-progress-track="${day.id}"></div></a>`).join('')}</div>
  <div class="overview-bottom"><section class="panel"><h3>先建立判断，再积累命令。</h3><div class="principle-list"><div class="principle"><span class="number">01</span><div><strong>读不懂的词，就地解释</strong><p>正文里的虚线词语可以点击。${prose('路径、进程、权限、响应头')}都从零讲起。</p></div></div><div class="principle"><span class="number">02</span><div><strong>始终使用同一个实验小站</strong><p>四天共享目录、PHP 文件、日志和基线。每条操作都能看到前因后果。</p></div></div><div class="principle"><span class="number">03</span><div><strong>每次修复，都以业务验证收尾</strong><p>${prose('备份、留证、比较、修改、检查 HTTP 响应。把 AWD 的现场习惯带进第一天。')}</p></div></div></div></section><section class="panel"><div class="eyebrow">YOUR PRACTICE DESK</div><h3 style="margin-top:12px">学过的，试着独立做一次。</h3><p>挑战按天分层，包含命令输入、故障判断和场景选择。参考答案附参数解释，查看答案不会记为通过。</p><div class="facts"><div><b>${COMMANDS.length}</b><span>独立命令讲解</span></div><div><b>${CHALLENGES.length}</b><span>分层挑战</span></div><div><b>${Object.keys(TERMS).length}</b><span>术语解释</span></div></div><div class="button-row"><a class="button" href="#challenges">进入命令挑战 <span>↗</span></a></div></section></div><p class="toc-note">学习记录保存在当前浏览器。换浏览器、切换 file / 本地服务器入口或清理网站数据后，记录可能不同。全站无外部资源依赖。</p>`;
}
function renderStart(){return intro('BEFORE DAY 01','先准备一个可以放心练习的地方。','本手册离线可读；真正执行命令需要 Linux 环境。推荐自己的 Ubuntu / Debian 虚拟机，也可以使用 WSL 的 Ubuntu。准备时间计入第一天。')+`
  <div class="intro-grid"><section class="panel"><div class="eyebrow">01 / 环境</div><h3 style="margin-top:12px">打开 Linux 终端</h3><p>${prose('已有虚拟机：先做快照，再打开终端。Windows 已有 WSL：从开始菜单启动 Ubuntu。尚无 Linux 环境：在 Windows“启用或关闭 Windows 功能”中启用“适用于 Linux 的 Windows 子系统”和“虚拟机平台”，按系统提示重启，再从 Microsoft Store 安装 Ubuntu，首次启动设置用户名和密码。安装可能需要管理员权限和联网。')}</p><div class="callout warning">以下命令都在 Ubuntu / Debian 的 Bash 里执行。Windows PowerShell 的 ls、curl 等同名命令可能行为不同。</div></section><section class="panel"><div class="eyebrow">02 / 工具</div><h3 style="margin-top:12px">只准备必需工具</h3><p>${prose('使用普通用户；只在安装软件包时临时使用 sudo。内置 PHP 开发服务器已足够完成四天实验，不要求先装 nginx 或数据库。')}</p>${codeBlock('sudo apt update\nsudo apt install php-cli curl less\nphp -v\ncurl --version')}<p>网络仅用于系统安装与软件准备。手册本身无需联网。</p></section></div>
  <section class="lesson"><div class="lesson-heading"><span>03</span><h2>建立贯穿四天的实验小站</h2></div><p>下载下面的本地脚本，先打开阅读。把它保存到 Linux 家目录：WSL 可以从 Windows 下载目录复制；虚拟机可以用共享文件夹传入。若从 Windows 保存，脚本会按 LF 换行下载。</p><div class="button-row"><a class="button primary" href="setup-lab.sh" download="setup-lab.sh">↓ 下载实验初始化脚本</a></div><p style="margin-top:16px">例如 WSL 访问 Windows 文件时，C 盘通常在 /mnt/c，D 盘在 /mnt/d。以下 SCX 是此电脑的 Windows 用户名示例，实际路径要按保存位置调整：</p>${codeBlock("cp /mnt/c/Users/SCX/Downloads/setup-lab.sh ~/setup-lab.sh\ncd ~\ncat setup-lab.sh\nbash setup-lab.sh\ncd ~/awd-lab\nls -lah")}<div class="expected"><b>应当看到</b>创建 ~/awd-lab，含 site、baseline、backups、restore、logs、evidence、scenarios、tools。脚本不安装软件、不启动网络服务；目录已存在时会停止，避免覆盖学习成果。</div><div class="file-tree">~/awd-lab/\n├── site/        你将访问和修改的 PHP 小站\n├── baseline/    初始正常源码，只作参照\n├── backups/     校验清单与后续归档，站点外保存\n├── restore/     练习解包，不覆盖在线网站\n├── logs/        预置访问日志与服务运行日志\n├── evidence/    故障文件、日志片段、复盘\n├── scenarios/   无害语法故障样本\n└── tools/       可读的业务健康检查脚本</div><p>${prose('若提示 awd-lab 已存在，请继续使用原目录。要重新实验，可先把旧目录改名保留，再运行脚本。不要直接递归删除。setup-lab.sh 只能初始化；手册中的命令输入框只判题，不会操作电脑。')}</p></section>
  <section class="panel"><h3>上手前，读懂这些符号</h3><div class="table-scroll"><table class="data-table"><thead><tr><th>写法</th><th>怎么理解</th><th>本手册的约定</th></tr></thead><tbody><tr><td><code>$ / #</code></td><td>提示符 / 注释</td><td>代码块不含需要复制的提示符；以 # 开头的行是说明。</td></tr><tr><td><code>[选项] / 对象…</code></td><td>语法说明中的可选项 / 多个对象</td><td>只在语法摘要出现，不要原样输入方括号和省略号。</td></tr><tr><td><code>'文字' / "文字"</code></td><td>引号把文字保留为一项</td><td>单引号通常不展开变量；双引号会展开 $变量。awk 的 $1 用单引号保护。</td></tr><tr><td><code>Ctrl+C / Ctrl+D</code></td><td>中断前台程序 / 输入结束</td><td>Ctrl+C 可退出 tail 跟随或自己的 PHP 开发服务器；不要随意在编辑器内尝试。</td></tr></tbody></table></div></section><div class="pager"><span></span><a class="button primary" href="#day-1">进入第一天 →</a></div>`;}
function renderShellGuide(){
  const rows=[
    ['name="value" / "$name"','创建变量（等号两边不留空格）/ 读取变量。双引号保留展开结果中的空格，避免被拆成多个参数。'],
    ['${BASE_URL:-默认值}','变量未设置或为空时使用默认值；健康脚本默认只请求本机 8080。'],
    ['result=$(curl …)','执行括号里的命令，把标准输出保存到变量。最后连续换行会被去掉；错误输出仍单独显示。'],
    ['if ! 命令; then … fi','如果命令失败，就执行 then 后的分支；! 取反，fi 结束判断。脚本中用它识别 curl 连接失败。'],
    ['[ "$status" = 200 ] && [ … ]','[ 是 test 的另一种写法，两侧必须有空格。&& 表示左侧成功后才执行右侧，脚本要求状态与正文都满足。'],
    ["${result##*$'\\n'} / ${result%$'\\n'*}",'前者去掉最后一个换行及其前面的部分，取出末尾状态码；后者去掉末尾换行和状态，保留正文。$\'\\n\' 表示真正的换行字符。'],
    ['$? / $!','上一条命令的退出状态 / 最近一个后台任务的 PID。先查看再运行其他命令，避免把值更新掉。'],
    ['命令1 && 命令2 / 命令1 || 命令2','前者仅在第一条成功后执行第二条；后者在第一条失败时才执行第二条。成功通常以状态 0 表示。'],
    ['> 日志 2>&1 / &','先把标准输出写到日志，再把标准错误接到相同出口；最后单独的 & 才是后台运行。'],
    ["cat > 文件 <<'结束标记'",'初始化脚本用的多行文字输入：把之后的行原样交给 cat，直到单独一行结束标记。引号阻止变量提前展开。'],
    ['#!/usr/bin/env bash','脚本首行说明使用 Bash。明确运行 bash 文件名时，仍由指定的 Bash 解释。']
  ];
  return `<section class="lesson"><h2 style="font-size:20px">读懂健康脚本里的 Bash 符号</h2><p style="margin-top:12px">这里是第四天脚本中出现的写法，用来读懂现有脚本，无需第一天全部背下。表格中的省略号是说明，不应原样执行。</p><div class="table-scroll"><table class="data-table"><thead><tr><th>写法</th><th>在脚本中做了什么</th></tr></thead><tbody>${rows.map(([syntax,text])=>`<tr><td><code>${esc(syntax)}</code></td><td>${prose(text)}</td></tr>`).join('')}</tbody></table></div><div class="chips">${['test','set','umask','exit','bash','printf'].map(commandChip).join('')}</div><p>文件里的 PHP 语法属于另一门语言：$_GET / $_POST 读取输入；?? 提供默认值；is_string 检查是否为文字；header 设置响应头；http_response_code 设置状态码；echo 输出正文。不要把它们当作 Linux 命令输入到终端。</p></section>`;
}
function renderDay(day){return intro(`DAY 0${day.id} / 04`,esc(day.title),day.goal)+`<div class="day-banner"><span>建议用时 <b>${day.time}</b></span><span>节奏 <b>讲解 → 逐行操作 → 观察结果 → 挑战</b></span><span data-progress-day="${day.id}"></span></div><div class="callout">${day.id===1?'尚未准备好实验环境？先完成 <a href="#start"><u>开始前的准备</u></a>。':`继续使用第一天建立的 ~/awd-lab。${day.id>=3?'服务运行在终端 A，其余命令在终端 B 执行。':''}`} 每次切换终端，先运行 <code>cd ~/awd-lab</code>。点击下方命令标签可查参数。</div><div class="lesson-layout"><div>${day.lessons.map((lesson,i)=>`<section class="lesson" id="section-${i}"><div class="lesson-heading"><span>0${i+1}</span><h2>${esc(lesson.title)}</h2></div>${lesson.text.map(t=>`<p>${prose(t)}</p>`).join('')}${codeBlock(lesson.code)}<div class="expected"><b>观察结果 · 为什么这样做</b>${prose(lesson.expected)}</div><div class="chips">${lesson.commands.map(commandChip).join('')}</div><div class="task-list">${lesson.tasks.map((t,j)=>{const id=`day${day.id}-${i}-${j}`;return `<label class="task"><input type="checkbox" data-task="${id}" ${state.tasks[id]?'checked':''}><span>${esc(t)}</span></label>`;}).join('')}</div></section>`).join('')}${day.id===4?renderShellGuide():''}<section class="panel"><h3>今日验收</h3><p>${prose(day.goal)} 在真实终端独立做一次，再到挑战区检查理解。</p><div class="button-row"><button class="button primary" data-day-quiz="${day.id}">进入 Day 0${day.id} 的 16 道挑战 →</button><button class="button" data-day-reference="${day.id}">查看今日命令参数</button></div></section><div class="pager"><a class="button" href="#${day.id===1?'start':'day-'+(day.id-1)}">← ${day.id===1?'准备环境':'前一天'}</a><a class="button primary" href="#${day.id===4?'playbook':'day-'+(day.id+1)}">${day.id===4?'AWD 操作清单':'下一天'} →</a></div></div><aside class="lesson-aside"><div class="panel"><div class="eyebrow">TODAY’S NOTES</div>${day.lessons.map((l,i)=>`<a href="#day-${day.id}/section-${i}">0${i+1} ${esc(l.title)}</a>`).join('')}<div class="toc-note">每个任务由你完成后勾选。记录立即保存在本地。</div></div></aside></div>`;}
const CATEGORIES=[...new Set(COMMANDS.map(c=>c.category))];
function renderCommands(){return intro('COMMAND LIBRARY','把每一条命令，讲清楚。',`共 ${COMMANDS.length} 条命令，分别说明用途、常见选项、位置参数与常见误区。语法摘要不是要原样执行的命令；点击卡片查看可以逐行操作的例子。`)+`<div class="toolbar"><label class="search-wrap"><span aria-hidden="true">⌕</span><input type="search" id="command-search" placeholder="搜索命令、用途、参数，如 grep / 端口 / -C" aria-label="搜索命令" value="${esc(commandQuery)}"></label><select id="command-day" aria-label="按学习日筛选"><option value="all">四天全部</option>${DAYS.map(d=>`<option value="${d.id}" ${commandDay===String(d.id)?'selected':''}>Day 0${d.id} 所学命令</option>`).join('')}</select></div><div class="filter-tabs" aria-label="命令分类">${['全部',...CATEGORIES].map(cat=>`<button class="filter-tab ${cat===commandCategory?'active':''}" data-command-category="${cat}" aria-pressed="${cat===commandCategory}">${cat}</button>`).join('')}</div><div id="command-results"></div>`;}
function filterCommands(){
  const query=commandQuery.trim().toLocaleLowerCase();
  return COMMANDS.filter(c=>(commandCategory==='全部'||c.category===commandCategory)&&(commandDay==='all'||DAYS[Number(commandDay)-1].commandNames.includes(c.name))&&[c.name,c.purpose,c.category,c.syntax,c.caution,...c.options.flat()].join(' ').toLocaleLowerCase().includes(query));
}
function renderCommandResults(){const commands=filterCommands();$('#command-results').innerHTML=`<p class="result-count" role="status">找到 ${commands.length} 条命令 · 点击查看完整参数与示例</p><div class="command-grid">${commands.length?commands.map(c=>`<article class="command-card"><div class="command-card-head"><h2>${c.name}</h2><span class="small">${c.category}</span></div><p>${prose(c.purpose)}</p><button class="command-open" data-command="${c.name}">参数与示例 <span aria-hidden="true">↗</span><span class="sr-only">：${c.name}</span></button></article>`).join(''):'<div class="empty">没有匹配的命令。试试更短的词，或选择“四天全部”和“全部”分类。</div>'}</div>`;}
function openCommand(name){
  const c=COMMANDS.find(c=>c.name===name);if(!c)return;
  $('#command-body').innerHTML=`<h2 id="command-title">${c.name}</h2><div class="command-description">${prose(c.purpose)}</div><span class="eyebrow">${c.category} / DAY 0${c.day}</span><div class="dialog-section"><h3>语法结构 <span class="muted small">· 方括号表示可选</span></h3>${codeBlock(c.syntax,'SYNTAX · 语法摘要，不要原样执行')}</div><div class="dialog-section"><h3>常见选项、参数与按键</h3><table class="options-table"><thead><tr><th>写法</th><th>含义与使用方式</th></tr></thead><tbody>${c.options.map(([o,t])=>`<tr><td>${esc(o)}</td><td>${prose(t)}</td></tr>`).join('')}</tbody></table></div><div class="dialog-section"><h3>放到场景里理解</h3>${codeBlock(c.example,c.name==='ssh'||c.name==='scp'||c.name==='chown'?'REFERENCE · 部署格式示意，先读下方说明':'BASH · 先进入 ~/awd-lab；按说明逐行执行')}<p>${prose(c.explain)}</p></div><div class="callout warning"><strong>常见误区</strong>${prose(c.caution)}</div><p class="small muted">虚线词语可点击解释。常见选项以本手册的 Bash / GNU 与 Ubuntu / Debian 环境为准；实际机器以本机帮助为准。</p>`;
  $('#command-dialog').showModal();$('#command-dialog').scrollTop=0;
}
function renderGlossary(){return intro('PLAIN LANGUAGE DICTIONARY','先把词读懂，再继续往下走。',`这里解释 ${Object.keys(TERMS).length} 个常用概念。正文中遇到虚线词语可以直接点击，不需要离开当前学习位置。`)+`<div class="toolbar"><label class="search-wrap"><span aria-hidden="true">⌕</span><input id="glossary-search" type="search" placeholder="搜索术语或解释，例如 目录 / HTTP / 权限" aria-label="搜索术语" value="${esc(glossaryQuery)}"></label></div><div id="glossary-results"></div>`;}
function renderGlossaryResults(){const q=glossaryQuery.trim().toLocaleLowerCase();const terms=Object.entries(TERMS).filter(([k,v])=>(k+' '+v).toLocaleLowerCase().includes(q));$('#glossary-results').innerHTML=`<p class="result-count" role="status">${terms.length} 个解释</p><div class="glossary-grid">${terms.length?terms.map(([k,v])=>`<article class="glossary-card"><h2>${esc(k)}</h2><p>${esc(v)}</p></article>`).join(''):'<div class="empty">没有找到，试试更短的关键词。</div>'}</div>`;}
function filteredQuestions(){return CHALLENGES.filter(q=>(quizDay==='all'||q.day===Number(quizDay))&&(quizType==='all'||q.type===quizType)&&(quizMode==='all'||(quizMode==='pending'?state.quiz[q.id]!=='solved':state.quiz[q.id]==='solved')));}
function renderChallenges(){return intro('PRACTICE / THINK / VERIFY','让命令，变成自己的判断。',`${CHALLENGES.length} 道挑战，包含 48 道命令输入和 16 道场景判断。每一天 16 题，可按天练习，也可复习待通过题。输入只在浏览器判题，不会执行任何系统命令。`)+`<div class="toolbar"><select id="quiz-day" aria-label="选择挑战学习日"><option value="all">全部四天</option>${DAYS.map(d=>`<option value="${d.id}" ${quizDay===String(d.id)?'selected':''}>Day 0${d.id} · ${esc(d.short)}</option>`).join('')}</select><select id="quiz-type" aria-label="选择题型"><option value="all">全部题型</option><option value="command" ${quizType==='command'?'selected':''}>命令输入</option><option value="choice" ${quizType==='choice'?'selected':''}>场景判断</option></select><select id="quiz-mode" aria-label="选择答题状态"><option value="all">全部状态</option><option value="pending" ${quizMode==='pending'?'selected':''}>待通过</option><option value="solved" ${quizMode==='solved'?'selected':''}>已通过</option></select><span class="small muted">全库已通过 <b data-quiz-total>${solvedCount()}</b> / ${CHALLENGES.length}</span></div><div id="quiz-workspace"></div>`;}
function renderQuizWorkspace(keepQuestion=false){
  let questions=filteredQuestions();
  if(keepQuestion&&currentQuizId&&!questions.some(q=>q.id===currentQuizId)){
    const q=CHALLENGES.find(q=>q.id===currentQuizId);if(q)questions=[...questions,q].sort((a,b)=>CHALLENGES.indexOf(a)-CHALLENGES.indexOf(b));
  }
  if(!questions.length){$('#quiz-workspace').innerHTML='<div class="empty">这个筛选下暂时没有题目。切换筛选，或者去完成其他挑战。</div>';currentQuizId=null;return;}
  let index=questions.findIndex(q=>q.id===currentQuizId);
  if(index<0)index=Math.max(0,questions.findIndex(q=>state.quiz[q.id]!=='solved'));
  const q=questions[index];currentQuizId=q.id;answerVisible=false;
  $('#quiz-workspace').innerHTML=`<div class="challenge-layout"><section class="challenge-card"><div class="challenge-meta"><span>DAY 0${q.day} / ${q.type==='command'?'命令输入':'场景判断'}</span><span>${index+1} / ${questions.length}</span></div><div class="eyebrow">${state.quiz[q.id]==='solved'?'✓ PREVIOUSLY PASSED':'YOUR NEXT SMALL STEP'}</div><h2>${esc(q.title)}</h2><p class="challenge-context">${prose(q.context)}</p><form id="quiz-form">${q.type==='command'?`<label class="answer-label" for="quiz-answer">写下你的命令 <span class="muted">· Enter 提交，Shift+Enter 换行</span></label><textarea class="answer-input" id="quiz-answer" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="不需要输入 $ 提示符" aria-describedby="quiz-feedback"></textarea>`:`<fieldset style="padding:0;border:0;margin:0"><legend class="answer-label">选择最符合证据的一项</legend><div class="choice-list">${q.choices.map((text,i)=>`<label class="choice-option"><input type="radio" name="quiz-choice" value="${i}" aria-describedby="quiz-feedback"><span>${esc(text)}</span></label>`).join('')}</div></fieldset>`}<div class="button-row"><button class="button primary" type="submit">检查答案 →</button>${q.type==='command'?'<button class="button subtle" id="quiz-hint" type="button">给一点提示</button>':''}<button class="text-button muted" id="quiz-reveal" type="button">查看讲解</button></div></form><div id="quiz-feedback" role="status" aria-live="polite"></div><div class="quiz-navigation"><button class="button subtle" data-quiz-step="-1" ${index===0?'disabled':''}>← 上一题</button><button class="button" data-quiz-step="1" ${index===questions.length-1?'disabled':''}>下一题 →</button></div></section><aside class="quiz-side"><section class="panel"><h3>练习地图</h3><p>实色：独立通过 · 虚线：看过讲解<br>已完成 ${questions.filter(q=>state.quiz[q.id]==='solved').length} / ${questions.length} 题</p><div class="question-map">${questions.map((x,i)=>`<button class="question-dot ${x.id===q.id?'current':''} ${state.quiz[x.id]||''}" data-question="${x.id}" aria-label="第 ${i+1} 题：${esc(x.title)}${state.quiz[x.id]==='solved'?'，已通过':state.quiz[x.id]==='seen'?'，已看讲解':''}" ${x.id===q.id?'aria-current="step"':''}>${i+1}</button>`).join('')}</div></section><section class="panel"><h3>这题用到的工具</h3><div class="chips">${q.commands.map(commandChip).join('')}</div><p>${q.type==='command'?'支持常见短选项合并、拆分、调序和已列出的长选项别名，保留大小写。练习判题只覆盖题目所用写法；复杂 Shell 等价形式请对照讲解。':'先解释理由，再选择答案。状态码、日志关键词与文件名都不能单独证明一次攻击。'}</p><p style="margin-top:13px">看过讲解后，本轮不能再记为独立通过。重新选题后可重做；结果与任务打卡分别保存。</p></section></aside></div>`;
  $('#quiz-form').addEventListener('submit',event=>{event.preventDefault();submitQuiz();});
  const answer=$('#quiz-answer');if(answer)answer.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();submitQuiz();}});
}
function showQuizFeedback(html,error=false){$('#quiz-feedback').className='feedback'+(error?' error':'');$('#quiz-feedback').innerHTML=html;}
function submitQuiz(){
  const q=CHALLENGES.find(q=>q.id===currentQuizId);if(!q)return;
  const value=q.type==='command'?$('#quiz-answer').value:document.querySelector('input[name="quiz-choice"]:checked')?.value;
  if(value===undefined||String(value).trim()===''){showQuizFeedback('先填写命令或选择一个答案，再检查。',true);return;}
  const correct=q.type==='command'?checkCommand(q,value):Number(value)===q.correct;
  if(!correct){showQuizFeedback(`<strong>还差一步，再看一下要求。</strong><p>${q.type==='command'?'检查命令大小写、路径、选项值及是否多了额外操作。引号内空格也可能有意义。':'把已知证据与推断分开，再选择最有依据的一项。'}</p>`,true);return;}
  if(!answerVisible){state.quiz[q.id]='solved';save();}
  showQuizFeedback(`<strong>${answerVisible?'答案符合；本轮已看过讲解，不计独立通过。':'✓ 通过。现在试着解释为什么这样写。'}</strong><p>${prose(q.explanation)}</p>`);
  updateProgress();updateQuizMap();
}
function updateQuizMap(){document.querySelectorAll('[data-question]').forEach(node=>{const value=state.quiz[node.dataset.question];node.classList.toggle('solved',value==='solved');node.classList.toggle('seen',value==='seen');});const questions=filteredQuestions();const p=$('.quiz-side .panel p');if(p)p.innerHTML=`实色：独立通过 · 虚线：看过讲解<br>当前筛选已完成 ${questions.filter(q=>state.quiz[q.id]==='solved').length} / ${questions.length} 题`;}
function revealQuiz(){const q=CHALLENGES.find(q=>q.id===currentQuizId);if(!q)return;answerVisible=true;if(state.quiz[q.id]!=='solved'){state.quiz[q.id]='seen';save();}showQuizFeedback(`<strong>参考讲解 · 看过后请重新选题再独立完成</strong>${q.type==='command'?codeBlock(q.answer,'REFERENCE · 不会自动执行'):`<p>${esc(q.choices[q.correct])}</p>`}<p>${prose(q.explanation)}</p>`);updateQuizMap();}
function renderPlaybook(){return intro('THE AWD LOOP','先保住服务，再逐步缩小问题。','这份清单把四天所学放进 AWD 的现场顺序。示例仍沿用本地实验目录；真实比赛须按规则、实际部署和业务要求调整。')+`<div class="chain"><div><span>01 / OBSERVE</span><strong>观察现象</strong><p>请求、进程、端口与日志</p></div><div><span>02 / PRESERVE</span><strong>保存证据</strong><p>备份、基线与异常副本</p></div><div><span>03 / CHANGE</span><strong>最小修改</strong><p>定位原因，保留回退路径</p></div><div><span>04 / VERIFY</span><strong>验证业务</strong><p>语法、响应与预期功能</p></div></div>${PLAYBOOK.map((step,i)=>`<section class="playbook-step"><span class="step-number">0${i+1}</span><div><h2>${esc(step.title)}</h2><p>${prose(step.text)}</p>${codeBlock(step.code)}<div class="chips">${step.commands.map(commandChip).join('')}</div></div></section>`).join('')}<section class="panel" style="margin-top:26px"><h3>遇到问题，先问它发生在哪一层</h3><div class="table-scroll"><table class="data-table"><thead><tr><th>现象</th><th>先收集的证据</th><th>不要直接下的结论</th></tr></thead><tbody><tr><td>无法连接</td><td>服务进程、监听地址端口、网络可达性</td><td>“一定是 PHP 源码被改”</td></tr><tr><td>HTTP 403 / 404</td><td>请求路径、Web 根目录、权限、路由配置</td><td>“肯定被删站”</td></tr><tr><td>HTTP 500</td><td>相关 PHP 语法、错误日志、依赖与配置</td><td>“重启就会好”</td></tr><tr><td>HTTP 200 但业务错误</td><td>正文、登录会话、数据库与 checker 要求</td><td>“状态码是 200，可以不管”</td></tr></tbody></table></div><p class="small muted">内容整理依据 GNU 工具手册、PHP 官方手册、curl 文档、NGINX 文档及公开 AWD 赛事说明。全站不设外链或资源导航。</p></section>`;}
function syncSidebarVisibility(){const hidden=window.matchMedia('(max-width:700px)').matches&&!$('#sidebar').classList.contains('open');$('#sidebar').inert=hidden;if(hidden)$('#sidebar').setAttribute('aria-hidden','true');else $('#sidebar').removeAttribute('aria-hidden');}
function closeMobileMenu(){ $('#sidebar').classList.remove('open');$('#mobile-overlay').hidden=true;$('#menu-button').setAttribute('aria-expanded','false');$('#menu-button').setAttribute('aria-label','展开导航');syncSidebarVisibility(); }
function renderRoute(){
  const hash=decodeURIComponent(location.hash.slice(1)||'home');const [key,anchor]=hash.split('/');
  const valid=navItems.some(([k])=>k===key);route=valid?key:'home';
  const main=$('#main');renderNavigation();$('#breadcrumb').textContent=navItems.find(([k])=>k===route)[2];
  const day=DAYS.find(d=>route===`day-${d.id}`);
  main.innerHTML=day?renderDay(day):route==='home'?renderHome():route==='start'?renderStart():route==='commands'?renderCommands():route==='glossary'?renderGlossary():route==='challenges'?renderChallenges():renderPlaybook();
  if(route==='commands')renderCommandResults();if(route==='glossary')renderGlossaryResults();if(route==='challenges')renderQuizWorkspace();
  updateProgress();closeMobileMenu();document.title=`${day?'Day 0'+day.id+' · ':''}${navItems.find(([k])=>k===route)[2]} · Linux 入场`;
  if(anchor){requestAnimationFrame(()=>document.getElementById(anchor)?.scrollIntoView({block:'start'}));}else{window.scrollTo(0,0);requestAnimationFrame(()=>main.focus({preventScroll:true}));}
}
async function copyText(value,button){
  let copied=false;
  try{await navigator.clipboard.writeText(value);copied=true;}catch{
    const textarea=document.createElement('textarea');textarea.value=value;textarea.style.cssText='position:fixed;opacity:0;width:1px;height:1px';
    (button?.closest('dialog')||document.body).appendChild(textarea);textarea.select();
    try{copied=document.execCommand('copy');}catch{}textarea.remove();button?.focus({preventScroll:true});
  }
  toast(copied?'已复制。请按说明在 Linux 终端逐行执行。':'复制不可用，请直接选中代码复制。');
}
function changeTheme(theme){document.documentElement.dataset.theme=theme;$('#theme-button').setAttribute('aria-label',theme==='dark'?'切换为浅色主题':'切换为深色主题');try{localStorage.setItem('linux-awd-theme',theme);}catch{}}
let initialTheme;try{initialTheme=localStorage.getItem('linux-awd-theme');}catch{}
changeTheme(initialTheme==='dark'?'dark':'light');
document.addEventListener('click',event=>{
  const target=event.target.closest('button, a');if(!target)return;
  if(target.hasAttribute('data-close')){target.closest('dialog').close();return;}
  if(target.dataset.command){openCommand(target.dataset.command);return;}
  if(target.dataset.term){$('#term-title').textContent=target.dataset.term;$('#term-description').textContent=TERMS[target.dataset.term];$('#term-dialog').showModal();return;}
  if(target.dataset.copy){copyText(decodeURIComponent(target.dataset.copy),target);return;}
  if(target.dataset.dayQuiz){quizDay=target.dataset.dayQuiz;quizType='all';quizMode='all';currentQuizId=null;location.hash='challenges';return;}
  if(target.dataset.dayReference){commandDay=target.dataset.dayReference;commandCategory='全部';commandQuery='';location.hash='commands';return;}
  if(target.dataset.commandCategory){commandCategory=target.dataset.commandCategory;document.querySelectorAll('[data-command-category]').forEach(node=>{const active=node.dataset.commandCategory===commandCategory;node.classList.toggle('active',active);node.setAttribute('aria-pressed',active);});renderCommandResults();return;}
  if(target.dataset.question){currentQuizId=target.dataset.question;renderQuizWorkspace();return;}
  if(target.dataset.quizStep){const questions=filteredQuestions();const i=questions.findIndex(q=>q.id===currentQuizId);if(i<0){currentQuizId=null;}else{currentQuizId=questions[i+Number(target.dataset.quizStep)]?.id||currentQuizId;}renderQuizWorkspace();return;}
  if(target.id==='quiz-reveal'){revealQuiz();return;}
  if(target.id==='quiz-hint'){const q=CHALLENGES.find(q=>q.id===currentQuizId);if(q)showQuizFeedback(`<strong>一点提示</strong><p>${prose(q.hint)}</p>`);return;}
  if(target.id==='theme-button')changeTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
  if(target.id==='reset-progress')$('#reset-dialog').showModal();
  if(target.id==='confirm-reset'){state={tasks:{},quiz:{}};save();$('#reset-dialog').close();renderRoute();toast('学习记录已重置。');}
  if(target.id==='menu-button'){const opened=$('#sidebar').classList.toggle('open');$('#mobile-overlay').hidden=!opened;target.setAttribute('aria-expanded',String(opened));target.setAttribute('aria-label',opened?'收起导航':'展开导航');syncSidebarVisibility();}
});
document.addEventListener('input',event=>{
  if(event.target.id==='command-search'){commandQuery=event.target.value;renderCommandResults();}
  if(event.target.id==='glossary-search'){glossaryQuery=event.target.value;renderGlossaryResults();}
});
document.addEventListener('change',event=>{
  const target=event.target;
  if(target.dataset.task){if(target.checked)state.tasks[target.dataset.task]=true;else delete state.tasks[target.dataset.task];save();updateProgress();}
  if(target.id==='command-day'){commandDay=target.value;renderCommandResults();}
  if(target.id==='quiz-day'||target.id==='quiz-type'||target.id==='quiz-mode'){
    if(target.id==='quiz-day')quizDay=target.value;if(target.id==='quiz-type')quizType=target.value;if(target.id==='quiz-mode')quizMode=target.value;
    currentQuizId=null;renderQuizWorkspace();
  }
});
$('#mobile-overlay').addEventListener('click',closeMobileMenu);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&$('#sidebar').classList.contains('open')){closeMobileMenu();$('#menu-button').focus();}});
window.matchMedia('(max-width:700px)').addEventListener('change',()=>closeMobileMenu());
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
window.addEventListener('hashchange',renderRoute);
renderRoute();
