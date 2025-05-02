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
description: 运行在服务器端的小程序
---

# Servlet

### 概念
运行在服务器端的小程序

Servlet就是一个接口，定义了Java类被浏览器访问到（tomcat识别）的规则

### 基本步骤
1. 创建JavaEE项目
2. 定义一个类，实现Servlet接口
3. 实现接口的抽象方法
4. 配置Servlet（在web.xml下配置）

#### 配置代码：

```xml
    <!--配置Servlet-->
    <servlet>
        <servlet-name>demo1</servlet-name>
        <servlet-class>cn.ywrby.web.servlet.ServletDemo1</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>demo1</servlet-name>
        <url-pattern>/demo1</url-pattern>
    </servlet-mapping>
```


## 执行原理


1. 当服务器接受到客户端浏览器的请求后，会解析请求URL路径,获取访问的Servlet的资源路径
2. 查找web.xml文件,是否有对应的<url-pattern>标签体内容。
3. 如果有，则再找到对应的<servlet-class>全类名
4. tomcat会将字节码文件加载进内存，并且创建其对象
5. 调用其方法

![servlet执行原理](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/servlet%E6%89%A7%E8%A1%8C%E5%8E%9F%E7%90%86.jpg)

## 声明周期

### 1. 被创建时
执行init方法，且只执行一次，一般用于加载资源

#### Servlet被创建的时机
- 默认情况下，在第一次访问时被创建
- 可以通过配置Servlet修改创建时机
    - 配置<Servlet>标签下的<load-on-startup>标签（值为正数则在启动服务器时就被创建，值为负数，则在第一次访问时创建，默认值为-1）


Servlet的init方法只执行一次，说明一个Servlet在内存中只存在一个对象，即Servlet是单例的。
- 多个用户同时访问该对象时，就可能存在安全问题
- 解决方式：尽量不再Servlet中定义成员变量，不得已定义成员变量也不要在方法中修改成员变量的值（尽量把变量定义在方法中）


### 2. 提供服务

执行service方法，service方法可能被调用多次


### 3. 被销毁时

调用destroy方法，只在被销毁时执行一次，且必须是正常销毁，强制销毁时同样不执行。一般用于释放资源



## 注解配置

自Servlet3.0后，在配置时可以不必配置web.xml文件，而是采用注解配置的方式，大大降低配置注解的繁琐

### 步骤
1. 创建JavaEE项目，选择Servlet版本在3.0以上，可以不创建web.xml
2. 定义一个类，实现Servlet接口
3. 复写方法
4. 为该类添加注解，并进行配置`@WebServlet(url-pattern="资源路径")`或者省略url-pattern直接写作`@WebServlet("资源路径")`

一个url-pattern可以配置多个路径，例如`@WebServlet({"/demo2","/demo3"})`

#### 例如

```java
@WebServlet("/demo1")
public class ServletDemo1 implements Servlet {}
```

## Servlet体系结构

- GenericServlet：一个抽象类，实现了Servlet接口，并对除service以外的方法都做了默认的空实现，支队service方法进行了抽象。所以在定义Servlet类时，可以继承GenericServlet，只需要实现service方法即可
- HttpServlet：继承自GenericServlet。是对Http协议的一种封装，简化操作，其内部实现了service方法的判断逻辑，在继承时只需要复写doGet和doPost方法即可


一般情况下我们采用继承HttpServlet并复写doGet和doPost方法的方式实现Servlet类