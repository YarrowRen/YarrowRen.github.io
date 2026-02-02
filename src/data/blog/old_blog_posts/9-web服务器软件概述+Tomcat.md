---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:28:20
modDatetime: *id001
title: 9-Web 服务器软件概述与 Tomcat
slug: 9-web服务器软件概述+Tomcat
featured: false
draft: false
tags:
- JavaWeb
description: 概述Web服务器软件及其功能，重点介绍Tomcat的特点、安装、使用及项目部署方式，提供Java Web项目开发的关键指导。
---

# Web 服务器软件概述与 Tomcat

## 一、服务器与服务器软件的基本概念

### 1. 服务器（Server）

**服务器** 是指 **安装了服务器软件并对外提供服务的计算机**。  
从硬件角度看，它本质上仍然是一台计算机；从功能角度看，它专门用于对外提供服务。

---

### 2. 服务器软件

**服务器软件** 是运行在服务器上的程序，其主要职责是：

- 接收客户端请求
- 处理请求
- 返回响应结果

例如：数据库服务器软件、Web 服务器软件、邮件服务器软件等。

---

### 3. Web 服务器软件

**Web 服务器软件** 是服务器软件的一种，主要用于：

- 部署 Web 项目
- 接收浏览器发送的 HTTP 请求
- 处理请求并返回响应结果

在 Java Web 领域，Web 服务器软件通常也被称为 **Web 容器（Web Container）** 或 **Servlet 容器**。

---

## 二、常见 Java Web 服务器软件

| 名称 | 厂商 | 特点 |
|----|----|----|
| WebLogic | Oracle | 大型 Java EE 服务器，支持完整 Java EE 规范，收费 |
| WebSphere | IBM | 大型 Java EE 服务器，支持完整 Java EE 规范，收费 |
| JBoss | Red Hat | 企业级 Java EE 服务器，部分版本收费 |
| Tomcat | Apache | 轻量级服务器，仅支持部分 Java EE 规范（Servlet / JSP），开源免费 |

> 在学习和日常开发中，**Tomcat 是最常用的 Java Web 服务器**。

---

## 三、Tomcat 简介

**Tomcat** 是 Apache 基金会提供的一款 **轻量级 Web 服务器 / Servlet 容器**，主要特点：

- 开源、免费
- 体积小、启动快
- 适合学习和中小型项目
- 支持 Servlet、JSP 等核心 Java Web 技术

---

## 四、Tomcat 的安装与使用

### 1. 下载

官网下载地址：  
https://tomcat.apache.org/

---

### 2. 安装

Tomcat 为 **绿色软件**：

- 下载后直接解压即可使用
- 不需要额外安装过程

---

### 3. 卸载

- 直接删除解压后的 Tomcat 目录即可

---

### 4. 启动

- Windows：  
  `bin/startup.bat`
- Linux / macOS：  
  `bin/startup.sh`

---

### 5. 访问

浏览器访问：

```

[http://localhost:8080](http://localhost:8080)

````

说明：
- `localhost`：本机地址
- 非本机访问时，将 `localhost` 替换为服务器 IP 地址

---

### 6. 关闭 Tomcat

**正常关闭：**
1. 执行 `bin/shutdown.bat`
2. 或在启动窗口中使用 `Ctrl + C`

**强制关闭：**
- 直接关闭启动窗口（不推荐，可能导致资源未释放）

---

## 五、Tomcat 项目部署方式

### 方式一：直接部署到 webapps（最简单）

- 将项目文件夹放入 `webapps` 目录
- 访问路径：`http://localhost:8080/项目名`

**WAR 包部署：**
- 将项目打包成 `.war` 文件
- 放入 `webapps` 目录
- Tomcat 会自动解压并部署
- 删除 war 文件或解压目录即删除项目

---

### 方式二：配置 `server.xml`（不推荐）

在 `conf/server.xml` 的 `<Host>` 标签中添加：

```xml
<Context docBase="项目绝对路径" path="/虚拟目录"/>
````

示例：

```xml
<Context docBase="D:\CodingProgram\Web_YWRBY\webProject1" path="/webPro1"/>
```

⚠️ 修改 `server.xml` 后 **必须重启 Tomcat**，配置错误可能导致 Tomcat 无法启动。

---

### 方式三：独立 Context 配置（推荐）

在目录：

```
conf/Catalina/localhost
```

中创建任意名称的 `.xml` 文件，例如：

```
webPro1.xml
```

内容：

```xml
<Context docBase="D:\CodingProgram\Web_YWRBY\webProject1"/>
```

说明：

* XML 文件名即访问路径（虚拟目录名）
* 支持 **热部署**
* 不需要频繁重启 Tomcat
* 是最推荐的部署方式

---

## 六、Java Web 动态项目目录结构

### 项目根目录结构

```
项目名
│
├── WEB-INF
│   ├── web.xml        （Web 项目核心配置文件）
│   ├── classes        （存放编译后的 .class 文件）
│   └── lib            （存放项目依赖的 jar 包）
│
└── 其他资源（HTML、CSS、JS、图片等）
```

说明：

* `WEB-INF` 目录下的资源 **不能被浏览器直接访问**
* 只能通过服务器内部转发或业务逻辑访问

---

## 七、IDEA 集成 Tomcat 创建 Web 项目

IDEA 可直接集成 Tomcat 进行 Web 项目开发与部署。

👉 视频参考：
[https://www.bilibili.com/video/BV1uJ411k7wy?p=683](https://www.bilibili.com/video/BV1uJ411k7wy?p=683)

---

## 八、常见问题

### 问题：IDEA 部署后访问路径为

```
http://localhost:8080/项目名_war_exploded
```

### 解决方案：

1. 打开 Tomcat 运行配置
2. 在 **Deployment** 选项卡中
3. 修改 **Application context** 为 `/`

这样即可通过：

```
http://localhost:8080
```

直接访问项目首页。

---

## 九、小结

* Web 服务器软件用于接收并处理浏览器请求
* Tomcat 是最常用的 Java Web 服务器

<!-- 2026.01.28由GPT5.2优化全文 -->