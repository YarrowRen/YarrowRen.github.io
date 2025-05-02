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
description: 服务器端会话技术，再一次对话的多次请求间共享数据，数据存储在服务器端的对象中（HttpSession）
---

# Session

### 概念
服务器端会话技术，再一次对话的多次请求间共享数据，数据存储在服务器端的对象中（HttpSession）

### 基本用法

1. 获取HttpSession对象 
```java
HttpSession session=request.getSession();
```
2. 使用HttpSession对象
```java
//存储数据
session.setAttribute("msg","hello_world");
//获取数据
Object msg=session.getAttribute("msg");
//移除数据
session.removeAttribute("msg");
```
### 原理
**Session的实现依赖于Cookie**，在一次会话中，第一次请求Session的过程中，服务器端会创建一个Cookie对象，用来存储该Session的ID，并写入响应头返回到客户端，在客户端下次访问时，服务器端检测到该Cookie并读取Session的ID，就能够在浏览器端找到该Session并返回客户端

### 注意

1. 客户端关闭后，服务器端不关闭的情况下，两次获取的Session默认情况下不是同一个，也就不能共享数据（这是因为客户端关闭，代表一次会话结束，同时携带JSESSIONID的cookie也被销毁，所以Session失效）
2. 通过创建一个同名Cookie并设置Cookie的持久化处理，可以解决上面的问题
```java
//获取Session
HttpSession session=request.getSession();
//创建JSESSIONID的Cookie 设置最大存活时间
Cookie cookie=new Cookie("JSESSIONID",session.getId());
cookie.setMaxAge(60*60);
response.addCookie(cookie);
//存储数据
session.setAttribute("msg","hello_world");
```
3. 服务器端关闭的情况下，两次获取的Session对象不是同一个，但要保证数据不丢失，所以服务器端会进行Session的钝化与活化
    - Session的钝化：在服务器正常关闭之前，将服务器上的Session对象序列化到硬盘中
    - Session的活化：在服务器启动后，将硬盘中的Session文件转化为内存中的Session对象
4. Session被销毁的情况
    - 服务器关闭
    - session对象调用invalidate方法
    - session默认失效时间30min


### 特点
1. session用于存储一次会话的多次请求的数据，存储在服务器端
2. session可以存储任意类型，任意大小的数据

### Session与Cookie的区别
1. Session存储数据在服务器端，Cookie在客户端
2. Session对存储数据的类型和大小没有限制，Cookie有限制
3. Session更安全，Cookie相对而言不安全