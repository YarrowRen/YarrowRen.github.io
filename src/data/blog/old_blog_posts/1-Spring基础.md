---
author: Boyu Ren
pubDatetime: &id001 2021-03-02 00:45:21
modDatetime: *id001
title: 1-Spring基础
slug: 1-Spring基础
featured: false
draft: false
tags:
- Spring
description: Spring是分层的Java SE/EE应用全栈(full-stack)轻量级开发框架，以IoC(Inverse of Control:反转控制)和AOP(Aspect
  Oriented Programing:面向切面编程)为内核
---

### 基本概念
Spring是分层的Java SE/EE应用全栈(full-stack)轻量级开发框架，以IoC(Inverse of Control:反转控制)和AOP(Aspect Oriented Programing:面向切面编程)为内核

提供了展现层（Spring MVC）和持久层Spring JDBCTemplate以及业务层事务管理等众多企业级应用技术，还能整合开源世界众多著名的第三方框架和类库，逐渐成为使用最多的Java EE企业应用开发框架

### Spring优势

1. 方便解耦，简化开发：通过Spring提供的IoC容器，可以将对象间的依赖关系交由Spring进行控制，避免硬编码所造成的过度耦合。用户也不必再为单例模式类、属性文件解析等这些很底层的需求编写代码，可以更专注于上层的应用。
2. 支持AOP编程：通过Spring的AOP功能，方便进行面向切面编程，许多不容易用传统OOP实现的功能可以通过AOP轻松实现。
3. 声明式事务的支持：可以将我们从单调烦闷的事务管理代码中解脱出来，通过声明式方式灵活的进行事务管理，提高开发效率和质量。
4. 方便程序测试
5. 方便集成各种优秀框架
6. 降低了Java EE API的使用难度
7. 是Java源码的学习典范

### Spring体系结构

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/spring%E4%BD%93%E7%B3%BB%E7%BB%93%E6%9E%84.jpg)

### Spring程序开发步骤

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/Spring%E5%BC%80%E5%8F%91%E6%AD%A5%E9%AA%A4.jpg)

在我们之前的开发步骤中，Dao层的对象需要我们自行创建，这就导致程序耦合较高，通关Spring我们可以将Dao层路径定义在XML配置文件中，再利用Spring通关反射创建该对象，以实现程序的解耦

1. 导入Spring开发的基本包坐标
2. 编写Dao接口和实现类
3. 创建Spring核心配置文件
4. 在Spring配置文件中配置Dao层的路径
5. 使用Spring的API获取Bean实例

#### 1. 利用Maven导入Spring开发的基本包坐标

```xml
    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.3.3</version>
        </dependency>
    </dependencies>
```

#### 2. 编写Dao接口和实现类

Dao接口

```java
package cn.ywrby.dao;

public interface UserDao {
    public void save();

}
```

实现类

```java
package cn.ywrby.dao.impl;

import cn.ywrby.dao.UserDao;

public class UserDaoImpl implements UserDao {
    public void save() {
        System.out.println("Save Running...");
    }
}
```

#### 3. 创建Spring核心配置文件
一般命名为applicationContext.xml，保存在resources文件夹内（创建时直接利用Spring Config模板创建即可）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
</beans>
```

#### 4. 在Spring配置文件中配置Dao层的路径

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="cn.ywrby.dao.impl.UserDaoImpl"></bean>
</beans>
```

#### 5. 使用Spring的API获取Bean实例

```java
public class UserDaoDemo {
    public static void main(String[] args) {
        ApplicationContext context=new ClassPathXmlApplicationContext("applicationContext.xml");
        UserDao dao= (UserDao) context.getBean("userDao");
        dao.save();
    }
}
```