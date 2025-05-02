---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:34:49
modDatetime: *id001
title: 20-Listener监听器
slug: 20-Listener监听器
featured: false
draft: false
tags:
- JavaWeb
description: '- 事件：一件事务'
---

# Listener监听器

#### 事件的监听机制
- 事件：一件事务
- 事件源：事件发生地点
- 监听器：一个监听器对象
- 注册监听：将事件，事件源，监听器，绑定在一起，当事件源上某事件发生时，执行监听代码

### ServletContextListener
监听ServletContext对象的创建和销毁
- void contextDestroyed(ServletContextEvent sce)：ServletContext对象被销毁前会调用该方法
- void contextInitialized(ServletContextEvent sce)：ServletContext对象被创建时会调用该方法

```java
@WebListener
public class ListerDemo1 implements ServletContextListener {
    /**
     * ServletContext对象被创建时会调用该方法
     * @param servletContextEvent
     */
    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
        //一般用于加载资源文件
    }

    /**
     * ServletContext对象被销毁前会调用该方法
     * @param servletContextEvent
     */
    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {
        //一般用于释放资源
    }
}
```

### 配置方式

- 注解配置：直接在类前加上注解@WebListener即可
- web.xml配置：

```xml
    <listener>
        <listener-class>cn.ywrby.Listener.ListerDemo1</listener-class>
    </listener>
```