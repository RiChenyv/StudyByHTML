/* 无第三方依赖：node LinuxStudy/verify.cjs */
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const context=vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname,'content.js'),'utf8')+'\n'+fs.readFileSync(path.join(__dirname,'challenges.js'),'utf8'),context);
const data=vm.runInContext('({COMMANDS,TERMS,DAYS,CHALLENGES,checkCommand})',context);
let checks=0;
const check=(condition,message)=>{assert.ok(condition,message);checks++;};
check(data.DAYS.length===4,'四天路线');
check(new Set(data.COMMANDS.map(c=>c.name)).size===data.COMMANDS.length,'命令名不重复');
check(new Set(data.CHALLENGES.map(c=>c.id)).size===64,'64 道题具有唯一 id');
for(const c of data.COMMANDS){check(c.options.length>0&&c.purpose&&c.example&&c.caution,`${c.name} 参数与解释完整`);}
for(const day of data.DAYS){
  check(data.CHALLENGES.filter(q=>q.day===day.id).length===16,`第 ${day.id} 天 16 题`);
  for(const name of [...day.commandNames,...day.lessons.flatMap(l=>l.commands)])check(data.COMMANDS.some(c=>c.name===name),`引用命令存在 ${name}`);
}
for(const q of data.CHALLENGES){
  for(const c of q.commands)check(data.COMMANDS.some(x=>x.name===c),`题目引用命令 ${c}`);
  if(q.type==='command'){
    check(data.checkCommand(q,q.answer),`参考答案通过：${q.title}`);
    for(const a of q.alternatives)check(data.checkCommand(q,a),`等价答案通过：${q.title}`);
    check(!data.checkCommand(q,q.answer+'; rm -rf site'),`拒绝多余操作：${q.title}`);
  }else check(q.correct>=0&&q.correct<q.choices.length,`选择题索引 ${q.id}`);
}
const byAnswer=answer=>data.CHALLENGES.find(q=>q.answer===answer);
const ls=byAnswer('ls -lah site');
check(data.checkCommand(ls,'ls -h -l -a site'),'分开的选项');
check(data.checkCommand(ls,'ls --all -l --human-readable site'),'长选项别名');
check(!data.checkCommand(ls,'ls -lAh site'),'不把 A 当 a');
check(!data.checkCommand(ls,'ls -lah Site'),'路径大小写敏感');
const curl=byAnswer("curl -i 'http://127.0.0.1:8080/health.php'");
check(!data.checkCommand(curl,"curl -I 'http://127.0.0.1:8080/health.php'"),'curl -i 与 -I 不混淆');
const scp=data.CHALLENGES.find(q=>q.answer?.startsWith('scp '));
check(!data.checkCommand(scp,scp.answer.replace('-P','-p')),'scp -P 与 -p 不混淆');
const find=data.CHALLENGES.find(q=>q.answer==="find site -type f -name '*.php'");
check(!data.checkCommand(find,'find site -type f -name *.php'),'不接受未加引号的 glob');
const awk=data.CHALLENGES.find(q=>q.answer==="awk '{print $1}' logs/access.log");
check(!data.checkCommand(awk,'awk "{print $1}" logs/access.log'),'不能让 Bash 展开 awk $1');
const grep=data.CHALLENGES.find(q=>q.answer==="grep -n ' 404 ' logs/access.log");
check(!data.checkCommand(grep,"grep -n '404' logs/access.log"),'引号内空格保留');
check(!data.checkCommand(curl,"curl -i 'http://127.0.0.1:8080/health.php"),'未闭合引号拒绝');
for(const filename of ['index.html','app.js','content.js','challenges.js','styles.css']){
  const text=fs.readFileSync(path.join(__dirname,filename),'utf8');
  check(!/(?:href|src)\s*=\s*["']https?:\/\//i.test(text),`无外部资源或跳转：${filename}`);
}
console.log(`PASS: ${checks} checks; ${data.COMMANDS.length} commands; ${Object.keys(data.TERMS).length} terms; 64 challenges.`);
