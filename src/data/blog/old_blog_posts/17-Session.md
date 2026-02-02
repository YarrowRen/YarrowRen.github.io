---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:34:17
modDatetime: *id001
title: 17-Session
slug: 17-Session
featured: false
draft: false
tags:
- JavaWeb
description: Session是服务器端会话技术，通过HttpSession对象实现跨请求数据共享，依赖Cookie传递Session ID。本文详细介绍了Session的获取、数据存取及其工作原理，并探讨Session的使用注意事项及与Cookie的对比。
---

# Session

## Session 概念

Session 是一种**服务器端会话技术**，用于在**同一次会话（一次对话）中的多次请求之间共享数据**。  
数据存储在服务器端的 `HttpSession` 对象中，与具体客户端会话一一对应。

---

## Session 的基本使用

### 1. 获取 HttpSession 对象

```java
HttpSession session = request.getSession();
````

* 若当前请求已有对应 Session，则返回原有 Session
* 若不存在，则创建新的 Session 并返回

---

### 2. 使用 HttpSession 存取数据

```java
// 存储数据
session.setAttribute("msg", "hello_world");

// 获取数据
Object msg = session.getAttribute("msg");

// 移除数据
session.removeAttribute("msg");
```

Session 中存储的数据以 **键值对** 的形式存在，作用域为一次会话。

---

## Session 工作原理

Session 的实现**依赖于 Cookie**。

基本流程如下：

1. 客户端第一次请求服务器时：

   * 服务器创建一个 `HttpSession` 对象
   * 同时生成一个唯一的 Session ID
2. 服务器将该 Session ID 写入名为 `JSESSIONID` 的 Cookie 中，并通过响应返回给客户端
3. 客户端后续请求时：

   * 浏览器自动携带 `JSESSIONID` Cookie
4. 服务器根据 Cookie 中的 Session ID：

   * 找到对应的 Session 对象
   * 从中读取或写入会话数据

---

## Session 使用注意事项

### 1. 客户端关闭的影响

在**服务器未关闭**的情况下：

* 浏览器关闭 → 会话结束
* `JSESSIONID` 为会话级 Cookie，会被销毁
* 再次访问服务器时，会创建新的 Session
* 默认情况下无法共享原 Session 中的数据

---

### 2. 通过 Cookie 持久化延长 Session

可以通过手动创建同名 Cookie，使 Session ID 持久化：

```java
HttpSession session = request.getSession();

Cookie cookie = new Cookie("JSESSIONID", session.getId());
cookie.setMaxAge(60 * 60); // 1 小时
response.addCookie(cookie);

session.setAttribute("msg", "hello_world");
```

这样即使关闭浏览器，只要 Cookie 未失效，仍可继续访问原 Session。

---

### 3. 服务器重启与 Session 钝化 / 活化

在服务器正常关闭的情况下：

* **Session 钝化**：
  服务器关闭前，将内存中的 Session 对象序列化保存到磁盘

* **Session 活化**：
  服务器启动后，将磁盘中的 Session 数据反序列化恢复到内存

该机制用于减少服务器重启导致的会话数据丢失。

---

### 4. Session 被销毁的常见情况

* 服务器关闭
* 调用 `session.invalidate()`
* Session 超过默认失效时间（一般为 30 分钟）

---

## Session 的特点

1. 用于一次会话中多次请求之间的数据共享
2. 数据存储在服务器端
3. 可以存储任意 Java 对象
4. 理论上存储大小不受严格限制（受服务器内存约束）

---

## Session 与 Cookie 的对比

| 对比项    | Session   | Cookie |
| ------ | --------- | ------ |
| 数据存储位置 | 服务器端      | 客户端    |
| 数据类型限制 | 无         | 仅字符串   |
| 数据大小限制 | 较大（受内存限制） | 较小     |
| 安全性    | 较高        | 相对较低   |
| 生命周期控制 | 服务器控制     | 客户端控制  |

<!-- 2026.01.28由GPT5.2优化全文 -->