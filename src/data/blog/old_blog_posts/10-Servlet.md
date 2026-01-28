---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:34:10
modDatetime: *id001
title: 10-Servlet
slug: 10-Servlet
featured: false
draft: false
tags:
- JavaWeb
description: Servlet 是运行在服务器端的 Java 程序，是 Java Web 技术体系中处理请求与响应的核心组件。
---

# Servlet

## 一、Servlet 概述

### 1. 什么是 Servlet

**Servlet** 是运行在服务器端的 Java 程序，用于接收客户端（通常是浏览器）发送的请求，并返回响应结果。

从本质上讲：

- Servlet 是一个 **Java 接口**
- 定义了 Java 类 **如何被 Web 服务器（如 Tomcat）调用**
- 是 Java Web 中处理 HTTP 请求的核心组件

---

### 2. Servlet 的作用

- 接收并处理浏览器请求
- 生成动态响应内容
- 作为 Web 层与业务层之间的桥梁

---

## 二、Servlet 的基本开发步骤

### 1. 开发流程

1. 创建 Java Web（JavaEE）项目
2. 定义一个类，实现 `Servlet` 接口
3. 实现接口中的抽象方法
4. 配置 Servlet 的访问路径（`web.xml` 或注解）

---

### 2. 基于 `web.xml` 的配置方式

```xml
<!-- 配置 Servlet -->
<servlet>
    <servlet-name>demo1</servlet-name>
    <servlet-class>cn.ywrby.web.servlet.ServletDemo1</servlet-class>
</servlet>

<servlet-mapping>
    <servlet-name>demo1</servlet-name>
    <url-pattern>/demo1</url-pattern>
</servlet-mapping>
````

说明：

* `<servlet-class>`：Servlet 的全类名
* `<url-pattern>`：浏览器访问路径

---

## 三、Servlet 执行原理

当浏览器访问某个 Servlet 时，Tomcat 的处理流程如下：

1. 服务器接收到客户端 HTTP 请求
2. 解析请求 URL，获取 Servlet 访问路径
3. 查找 `web.xml` 或注解中是否存在对应的映射
4. 若存在：

   * 加载 Servlet 的 `.class` 文件
   * 创建 Servlet 实例（如尚未创建）
5. 调用 Servlet 的相关方法处理请求

![Servlet 执行原理](https://raw.githubusercontent.com/YarrowRen/FileBackup/refs/heads/master/blog_img/servlet%E6%89%A7%E8%A1%8C%E5%8E%9F%E7%90%86.jpg)

---

## 四、Servlet 的生命周期

Servlet 的生命周期由 **Web 容器（Tomcat）统一管理**，主要分为三个阶段。

---

### 1. 创建阶段（init）

* 容器调用 `init()` 方法
* **只执行一次**
* 通常用于：

  * 加载配置文件
  * 初始化资源（数据库连接、缓存等）

#### Servlet 创建时机

* **默认情况**：第一次访问 Servlet 时创建
* **可配置为服务器启动时创建**

```xml
<load-on-startup>1</load-on-startup>
```

* 正整数：服务器启动时创建
* 负数或不配置：第一次访问时创建（默认 `-1`）

---

#### 单例特性与线程安全问题

* Servlet 在容器中 **默认是单例的**
* 多个请求会并发访问同一个 Servlet 实例

⚠️ 注意：

* 不要在 Servlet 中定义可变的成员变量
* 若必须定义成员变量，避免在方法中修改其值
* 推荐将变量定义为 **方法内局部变量**

---

### 2. 提供服务阶段（service）

* 容器每接收到一次请求，都会调用 `service()` 方法
* 该方法 **可能被多次调用**
* 是处理业务逻辑的核心阶段

---

### 3. 销毁阶段（destroy）

* 容器在正常关闭或卸载 Servlet 时调用 `destroy()`
* **只执行一次**
* 常用于：

  * 释放资源
  * 关闭连接

⚠️ 强制关闭服务器时，`destroy()` 可能不会执行。

---

## 五、基于注解的 Servlet 配置（推荐）

自 **Servlet 3.0** 规范起，可以使用注解方式代替 `web.xml` 配置，显著简化开发。

---

### 1. 注解配置步骤

1. 创建 Servlet 3.0 以上版本的 Java Web 项目
2. 定义类，实现 `Servlet` 接口或继承 `HttpServlet`
3. 重写相关方法
4. 添加 `@WebServlet` 注解

---

### 2. 注解示例

```java
import javax.servlet.annotation.WebServlet;
import javax.servlet.Servlet;

@WebServlet("/demo1")
public class ServletDemo1 implements Servlet {
    // 方法实现
}
```

---

### 3. 多路径映射

```java
@WebServlet({"/demo2", "/demo3"})
```

---

## 六、Servlet 体系结构

Servlet 相关核心类结构如下：

### 1. Servlet 接口

* 定义 Servlet 的基本规范
* 包含生命周期相关方法

---

### 2. GenericServlet（抽象类）

* 实现了 `Servlet` 接口
* 对除 `service()` 外的方法提供了默认空实现
* 只保留 `service()` 为抽象方法

> 继承该类只需实现 `service()` 方法

---

### 3. HttpServlet（最常用）

* 继承自 `GenericServlet`
* 封装了 HTTP 协议处理逻辑
* 内部实现了 `service()` 方法
* 根据请求方式分发到：

  * `doGet()`
  * `doPost()`

---

### 4. 推荐使用方式

```java
public class MyServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        // 处理 GET 请求
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
        // 处理 POST 请求
    }
}
```

---

## 七、小结

* Servlet 是 Java Web 的核心组件
* 负责请求接收与响应处理
* 生命周期由容器统一管理
* 默认单例，需注意线程安全
* 推荐：

  * 继承 `HttpServlet`
  * 使用注解方式配置

<!-- 2026.01.28由GPT5.2优化全文 -->