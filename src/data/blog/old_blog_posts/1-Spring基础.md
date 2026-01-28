---
author: Boyu Ren
pubDatetime: &id001 2021-03-02 00:45:21
modDatetime: *id001
title: 1-Spring 基础
slug: 1-Spring基础
featured: false
draft: false
tags:
- Spring
description: Spring 是一个以 IoC 和 AOP 为核心的轻量级 Java 企业级开发框架，覆盖表现层、业务层和持久层。
---

# Spring 基础

## 一、Spring 基本概念

Spring 是一个 **分层的 Java SE / Java EE 应用全栈（full-stack）轻量级开发框架**，其核心思想是：

- **IoC（Inverse of Control，控制反转）**
- **AOP（Aspect Oriented Programming，面向切面编程）**

Spring 并不是一个“单一技术”，而是一个**生态型框架**，为企业级应用开发提供了完整的基础设施支持。

Spring 提供了：

- 表现层框架：**Spring MVC**
- 持久层支持：**JdbcTemplate、ORM 整合**
- 业务层支持：**声明式事务管理**
- 统一的配置与扩展机制

同时，Spring 能够很好地整合大量第三方优秀框架（如 MyBatis、Hibernate、Quartz 等），逐渐成为 **Java 企业级开发的事实标准框架**。

---

## 二、Spring 的核心优势

### 1. 方便解耦，简化开发

Spring 通过 **IoC 容器** 管理对象的创建与依赖关系：

- 对象不再由程序主动 `new`
- 依赖关系由 Spring 统一维护
- 避免硬编码带来的高耦合问题

开发者无需再手动处理：
- 单例模式
- 对象生命周期
- 配置文件解析

可以更专注于业务逻辑本身。

---

### 2. 支持 AOP 编程

Spring 提供了对 AOP 的良好支持，使得：

- 日志记录
- 权限控制
- 性能监控
- 事务处理

这些**横切关注点**可以从业务逻辑中剥离出来，提高代码的可读性和可维护性。

---

### 3. 声明式事务支持

通过 Spring 的声明式事务管理：

- 无需编写繁琐的事务控制代码
- 可通过配置或注解灵活控制事务边界
- 显著提升开发效率和代码质量

---

### 4. 方便程序测试

Spring 对单元测试和集成测试非常友好：

- 支持依赖注入测试对象
- 可以轻松替换真实依赖为 Mock 对象
- 降低测试成本

---

### 5. 易于整合第三方框架

Spring 提供了大量模板和适配器，用于整合：

- ORM 框架
- Web 框架
- 消息中间件
- 定时任务框架

---

### 6. 降低 Java EE API 使用难度

Spring 对底层 Java EE API 进行了封装，使开发者：

- 不必直接面对复杂的底层接口
- 使用更简洁、统一的编程模型

---

### 7. 优秀的源码学习范例

Spring 的源码设计清晰、模式丰富，是学习：

- 设计模式
- 框架设计思想
- 大型系统架构

的优秀参考。

---

## 三、Spring 体系结构

![](https://raw.githubusercontent.com/YarrowRen/FileBackup/refs/heads/master/blog_img/spring%E4%BD%93%E7%B3%BB%E7%BB%93%E6%9E%84.jpg)

Spring 采用模块化设计，各模块之间低耦合、可按需引入。

---

## 四、Spring 程序开发步骤

![](https://raw.githubusercontent.com/YarrowRen/FileBackup/refs/heads/master/blog_img/Spring%E5%BC%80%E5%8F%91%E6%AD%A5%E9%AA%A4.jpg)

在传统开发方式中，**Dao 层对象通常由程序直接创建**，这会导致：

- 层与层之间耦合度高
- 不利于扩展与测试

通过 Spring，可以：

- 在配置文件中声明 Bean
- 由 Spring 通过反射创建对象
- 由 IoC 容器统一管理依赖关系

从而实现 **松耦合设计**。

---

### Spring 基本开发流程

1. 导入 Spring 开发的基本依赖
2. 编写 Dao 接口和实现类
3. 创建 Spring 核心配置文件
4. 在配置文件中配置 Bean
5. 使用 Spring API 获取 Bean 实例

---

## 五、示例：基于 XML 的 Spring 入门程序

### 1. 使用 Maven 导入 Spring 依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.3.3</version>
    </dependency>
</dependencies>
```

---

### 2. 编写 Dao 接口与实现类

#### Dao 接口

```java
package cn.ywrby.dao;

public interface UserDao {
    void save();
}
```

#### Dao 实现类

```java
package cn.ywrby.dao.impl;

import cn.ywrby.dao.UserDao;

public class UserDaoImpl implements UserDao {
    @Override
    public void save() {
        System.out.println("Save Running...");
    }
}
```

---

### 3. 创建 Spring 核心配置文件

通常命名为 `applicationContext.xml`，放在 `resources` 目录下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
           http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd">
</beans>
```

---

### 4. 在配置文件中配置 Bean

```xml
<bean id="userDao" class="cn.ywrby.dao.impl.UserDaoImpl" />
```

---

### 5. 使用 Spring API 获取 Bean 实例

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class UserDaoDemo {
    public static void main(String[] args) {
        ApplicationContext context =
            new ClassPathXmlApplicationContext("applicationContext.xml");

        UserDao dao = (UserDao) context.getBean("userDao");
        dao.save();
    }
}
```

---

## 六、小结

* Spring 是以 **IoC 和 AOP** 为核心的企业级开发框架
* IoC 解决对象创建与依赖管理问题
* AOP 用于处理横切关注点
* Spring 通过容器机制显著降低系统耦合度

<!-- 2026.01.28由GPT5.2优化全文 -->