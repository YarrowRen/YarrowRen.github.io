---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:34:49
modDatetime: *id001
title: "Java Web中监听器的事件驱动机制与应用"
slug: "java-web-event-listener-usage"
featured: false
draft: false
tags:
- JavaWeb
description: Listener是一种基于事件驱动模型的Java Web组件，用于监听事件源的状态变化，实现解耦设计。文章详细介绍了ServletContextListener的用法、配置方式及应用场景，包括Web应用启动与关闭、资源管理、生命周期监听等。
---

# Listener 监听器

## 事件监听机制概述

监听器基于**事件驱动模型**，用于在特定事件发生时自动执行预定义逻辑，其核心组成包括：

- **事件（Event）**  
  某种状态变化或行为的发生，例如对象创建、销毁、属性变化等

- **事件源（Source）**  
  事件发生的对象，例如 `ServletContext`、`HttpSession`

- **监听器（Listener）**  
  用于监听事件的对象，包含事件发生时要执行的逻辑

- **事件注册**  
  将监听器与事件源进行绑定，当事件发生时自动触发监听器代码

---

## ServletContextListener

`ServletContextListener` 用于监听 **ServletContext 对象的生命周期变化**，即 Web 应用的启动与关闭过程。

### 监听的方法

```java
void contextInitialized(ServletContextEvent sce);
void contextDestroyed(ServletContextEvent sce);
````

* `contextInitialized`
  在 `ServletContext` 对象创建时调用
  常用于：

  * 加载配置文件
  * 初始化全局资源
  * 建立数据库连接池

* `contextDestroyed`
  在 `ServletContext` 对象销毁前调用
  常用于：

  * 释放资源
  * 关闭连接
  * 数据持久化处理

---

### 示例代码

```java
@WebListener
public class ListenerDemo1 implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent event) {
        // Web 应用启动时执行
    }

    @Override
    public void contextDestroyed(ServletContextEvent event) {
        // Web 应用关闭前执行
    }
}
```

---

## Listener 的配置方式

### 1. 注解方式（推荐）

```java
@WebListener
public class ListenerDemo1 implements ServletContextListener { }
```

该方式依赖 Servlet 3.0 及以上规范，无需额外 XML 配置。

---

### 2. web.xml 配置方式

```xml
<listener>
    <listener-class>cn.ywrby.listener.ListenerDemo1</listener-class>
</listener>
```

适用于较早版本 Servlet 项目或需要集中式配置的场景。

---

## Listener 的应用场景

* Web 应用启动/关闭时的资源管理
* 全局配置与缓存初始化
* Session、Request 生命周期监听
* 属性变化监控与统计分析

---

## 总结

* Listener 是 Java Web 中的重要组件之一
* 基于事件驱动模型实现解耦设计
* 常与 Servlet、Filter 配合使用
* 在系统级资源管理和生命周期控制中具有重要作用
<!-- 2026.01.28由GPT5.2优化全文 -->