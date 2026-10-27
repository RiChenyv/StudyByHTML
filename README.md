# StudyByHTML

一组**单文件、可离线打开**的交互式学习手册，面向网络安全 / CTF Web 方向的学习者。每份手册都是一个独立的 HTML 文件：双击即用，不需要服务器、构建或联网。

## 目录结构

```
StudyByHTML/
├── PHPStudy/
│   └── PHP学习手册.html                     PHP · 从零到 CTF
└── HTTPStudy/
    ├── http-field-manual.html               HTTP 入门手册 · 从一次对话开始
    └── http-field-manual.othershowing.html  HTTP 训练场 · 从零到 Web 手（进阶）
```

## 使用方法

用浏览器直接打开对应目录下的 HTML 文件即可。所有样式、脚本与数据都内嵌在单个文件里，也可以拷到手机上离线阅读。

## PHP · 从零到 CTF

《PHP学习手册.html》——从装环境开始，一路讲到 CTF Web 的常见考点，兼顾「能写代码」和「能看懂题」两条线。

- **环境搭建**：官方 PHP + 内置服务器、phpstudy 小皮面板、Docker 三种方案
- **语法基础**：变量与弱类型、字符串、运算符、数组、流程控制、函数、类、命名空间、魔术方法
- **运行模型**：一次请求的生命周期、超全局变量、`$_FILES` 五键结构、Session
- **代码执行（RCE）**：危险函数全家福、变量函数与动态调用、回调型入口、过滤绕过、`disable_functions`
- **文件包含**：LFI 攻击路径、系统敏感目录地图、RFI、`php://filter` 详解
- **文件上传**：黑名单绕过思路
- **弱类型与比较**：`==` / `===` 差异、MD5 碰撞与数字截断、`preg_match` 绕过
- **反序列化**：序列化格式、魔术方法、`__wakeup` 绕过、POP 链、`phar://` 反序列化
- **进阶技巧**：包装器速查、变量覆盖、无字母数字 Webshell、`open_basedir` 绕过
- **附录**：38 条术语表、123 条全书函数速查、Payload 速查、记忆闪卡、编码小工具、PHP 版本时间线、资源导航

阅读辅助：深色 / 浅色主题切换、正文术语紫色虚线点击弹解释（顶栏 🎓 可一键关闭标注）、全文搜索、代码块一键复制。

## HTTP 入门手册 · 从一次对话开始

《http-field-manual.html》——不背报文格式，而是从「打开一个网页」这件小事出发，把 HTTP 讲成一次对话。

- 先看懂一次对话：请求与响应、一个网页为什么对应多次请求、HTTPS 多了什么
- 网址里每一段是什么意思、相对地址与编码
- 拆开请求与响应：方法表达意图、状态码说明结果、头部是消息自带的说明书
- 正文与 Content-Length、字符与字节的区别
- HTTP 无状态，网站怎样记住我：Cookie、Session、Token / JWT
- 缓存与复用、代理、CORS、CSRF
- 动手练习：浏览器 Network 面板、在本页构造请求、用 curl 看响应

## HTTP 训练场 · 从零到 Web 手

《http-field-manual.othershowing.html》——零基础到 CTF Web 手的进阶训练场，聚焦「解析差异」和「信任错位」。

- URL 解析与拆解器、编码 / 解码实验台
- 原始报文、字节计数器：Content-Length 到底在数什么
- 方法实验台、状态码雷达、重定向方法守恒实验
- 头部的旅程、Host 头攻击、X-Forwarded-For 信任链、路径归一化
- HTTP 走私：Content-Length 与 `Transfer-Encoding: chunked` 两把尺子、Desync 边界实验台
- 缓存键与缓存投毒实验台
- HTTP/2 二进制分帧、H2 → H1 降级
- 登录实验与「漏洞 → HTTP 杠杆」的解题工作流

## 声明

本项目内容仅供学习与**已获授权**的测试环境使用，请勿用于任何未授权的攻击行为。
