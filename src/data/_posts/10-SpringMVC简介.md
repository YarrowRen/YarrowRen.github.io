---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:58:11
modDatetime: *id001
title: 10-SpringMVC简介及组件解析
slug: 10-SpringMVC简介
featured: false
draft: false
tags:
- Spring
- SpringMVC
description: 经典MVC（Model View Controller）模式中，M是指业务模型，V是指用户界面，C则是控制器，使用MVC的目的是将M和V的实现代码分离，从而使同一个程序可以使用不同的表现形式。其中，View的定义比较清晰，就是用户界面。
---

# SpringMVC简介

## MVC开发模式

### 概念
经典MVC（Model View Controller）模式中，M是指业务模型，V是指用户界面，C则是控制器，使用MVC的目的是将M和V的实现代码分离，从而使同一个程序可以使用不同的表现形式。其中，View的定义比较清晰，就是用户界面。

#### M（Model）
模型，主要通过JavaBean实现。完成具体的业务操作（例如数据库的增删改查，对象的封装）

#### V（View）
视图，主要通过JSP实现。用于展示数据
#### C（Controller）
控制器，主要通过Servlet实现。用于获取用户输入，调用模型，以及将数据交给视图进行展示

### MVC优点
- 耦合性低，方便维护，利于分工协作
- 代码重用性高

### MVC缺点
- 项目架构复杂，对操作人员要求提高

## SpringMVC
SpringMVC是一种基于Java的实现MVC设计模型的请求驱动类型的轻量级web框架，属于SpringFrameWork的后续产品，已经融合在Spring Web Flow中

SpringMVC是目前最主流的MVC框架之一，它通过一套注解，让一个简单的Java类（POJO：Plain Ordinary Java Object，简单的Java对象，实际就是普通JavaBeans）成为处理请求的控制器，而无需实现任何接口。同时它还支持Restful编程风格的请求

### SpringMVC概述

在之前所述的客户端发送请求流程中，一般流程都是客户端发送请求到Tomcat服务器，服务器会利用Tomcat引擎对请求进行接收与封装（req和resp），随后进入web应用调用相关的请求资源即相关Servlet

但实际开发中web层的Servlet存在大量重复操作，几乎每个Servlet都需要执行
1. 接收请求参数 
2. 封装实体
3. 访问业务层
4. 接收返回结果
5. 指派页面操作

![SpringMVC1](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/SpringMVC1.jpg)

以上大量重复的操作可以称为共有行为，而每个Servlet特有的具体执行实现可以称为特有行为，SpringMVC可以抽取共有行为，将所有共有行为创建为一个新的Servlet从未降低代码的重复。同时，剩下的特有行为也不再需要封装为Servlet，而是按照POJO来实现逻辑功能即可

![SpringMVC2](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/SpringMVC2.jpg)

不同框架所使用的前端控制器的格式是不相同的，以SpringMVC为例，其使用Servlet作为前端控制器，而以前的Struts2则采用Filter作为控制器

#### SpringMVC架构
为解决持久层中一直未处理好的数据库事务的编程，又为了迎合NoSQL崛起，SpringMVC给出了方案：将传统的模型层拆分为了业务层(Service)和数据访问层（DAO,Data Access Object）。 在 Service 下可以通过 Spring 的声明式事务操作数据访问层，而在业务层上还允许我们访问 NoSQL ，这样就能够满足NoSQL的使用了，它可以大大提高互联网系统的性能。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/SpringMVC%E6%9E%B6%E6%9E%84.png)



### SpringMVC开发步骤

1. 导入SpringMVC坐标
2. 配置Servlet（共有行为）---SpringMVC核心控制类DispatcherServlet
3. 创建Controller类和视图
4. 编写Controller（实现特有行为的POJO）
5. 将Controller使用使用注解配置到容器中（@Controller）
6. 配置spring-mvc.xml配置文件（配置组件扫描）

#### 1. 导入SpringMVC坐标

```xml
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.3.3</version>
        </dependency>
```

#### 2. 配置SpringMVC核心控制类DispatcherServlet(在web.xml配置文件中)
注意这里再配置SpringMVC前端控制器时第一个参数是控制器名称，第二个参数是创建Servlet的名，第三个参数是声明spring-mvc配置文件，最后一个参数是设置调用时间

配置映射地址是指定哪些页面调用时执行Servlet，url-pattern设为“/”表示所有页面都执行该控制器

```xml
    <!--配置SpringMVC前端控制器-->
    <servlet>
        <servlet-name>DispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:spring-mvc.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <!--配置映射地址-->
    <servlet-mapping>
        <servlet-name>DispatcherServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
```

#### 3. 创建Controller类和视图

视图

```jsp
<%--
  Created by IntelliJ IDEA.
  User: 
  Date: 2021/3/3
  Time: 22:55
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
    <h1>Success!</h1>
</body>
</html>
```



#### 4. 编写Controller（实现特有行为的POJO）,将Controller使用使用注解配置到容器中（@Controller）


Controller类

```java
@Controller("userController")
public class UserController {

    @RequestMapping("/saveFunction")
    public String save(){
        System.out.println("(Controller) Save running...");
        return "success.jsp";
    }
}
```

#### 5. 配置spring-mvc.xml配置文件（配置组件扫描）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

    <!--配置Controller的组件扫描-->
    <context:component-scan base-package="cn.ywrby.controller"/>
</beans>
```

### SpringMVC开发流程图

![SpringMVC开发流程](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/SpringMVC%E6%B5%81%E7%A8%8B%E5%9B%BE.png)

# SpringMVC组件解析

## SpringMVC执行流程

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/SpringMVC%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B.png)

1. 用户发送请求至前端控制器DispatcherServlet。
2. DispatcherServlet收到请求调用HandlerMapping处理器映射器。
3. 处理器映射器找到具体的处理器(可以根据xml配置、注解进行查找)，生成处理器对象及处理器拦截器(如果有则生成)一并返回给DispatcherServlet。(这里返回的HandlerExecutionChain对象内部不光有访问的资源路径，还包含访问资源路径上的所有其他资源路径，因为实际web应用中要访问到所指定的资源可能需要经过多次跳转，所以只有获取所有跳转路径才能找到指定的资源)
4. DispatcherServlet调用HandlerAdapter处理器适配器。
5. HandlerAdapter经过适配调用具体的处理器(Controller，也叫后端控制器，即我们自己实现的特有应用的POJO)。
6. Controller执行完成返回ModelAndView。
7. HandlerAdapter将controller执行结果ModelAndView返回给DispatcherServlet。
8. DispatcherServlet将ModelAndView传给ViewReslover视图解析器。
9. ViewReslover解析后返回具体View。
10. DispatcherServlet根据View进行渲染视图（即将模型数据填充至视图中）。DispatcherServlet响应用户


## @RequestMapping注解

### 作用
用于建立请求URL和处理请求的方法之间的对应关系（即将请求URL与处理请求的方法进行绑定，并对请求进行限定）

### 注解可出现的位置
- 类上：当该注解出现在类上时，将作为请求URL的一级访问目录，即访问类内的方法时前面需要注明该类，不写的情况下默认一级访问目录是根目录
- 方法上：当该注解出现在方法上时，表示请求URL的二级访问目录，与一级访问目录共同构成虚拟访问路径

```java
@Controller("userController")
//访问路径：localhost:8080/userController
@RequestMapping("/userController")
public class UserController {
    
    //访问路径：localhost:8080/userController/saveFunction
    @RequestMapping("/saveFunction")
    public String save(){
        System.out.println("(Controller) Save running...");
        return "/success.jsp";
    }
}
```

### 属性
该注解支持三个属性（只有一个属性，且是value属性的情况下，属性名可以省略）
- value：用于指定请求URL的路径，作用和path一样
- method：用于指定请求的方式（GET，POST...）
- params：用于指定限制请求参数的条件，支持简单的表达式

```java
@Controller("userController")
public class UserController {
    /**
     * 第一个参数表示二级访问路径
     * 第二个参数表示对传入参数的限制，分别表示必须有username参数，money参数不能为100
     * 第三个参数表示必须是POST请求才能访问
     * @return
     */
    @RequestMapping(value = "/saveFunction",params = {"username","money!100"},method = RequestMethod.POST)
    public String save(){
        System.out.println("(Controller) Save running...");
        return "/success.jsp";
    }
}
```