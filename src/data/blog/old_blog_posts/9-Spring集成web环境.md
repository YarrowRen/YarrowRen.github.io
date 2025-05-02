---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 09:47:56
modDatetime: *id001
title: 9-Spring集成web环境
slug: 9-Spring集成web环境
featured: false
draft: false
tags:
- Spring
description: 下面是之前一直采用的应用上下问的获取方法
---

## ApplicationContext应用上下问的获取方式

下面是之前一直采用的应用上下问的获取方法
```java
public class UserServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ApplicationContext context=new ClassPathXmlApplicationContext("applicationContext.xml");
        UserService service= (UserService) context.getBean("userService");
        service.save();
    }
}
```

通过new ClassPathXmlApplicationContext("applicationContext.xml")来获取应用上下文，不过这种方式获取的弊端就是所有web层的服务使用前都需要利用new ClassPathXmlApplicationContext("applicationContext.xml");加载配置文件，导致配置文件需要重复被加载多次，应用上下文的对象也需要创建多次

在Web项目中，要解决这个问题，可以利用ServletContextListener监听web应用的启动，一旦web应用启动，就加载Spring配置文件，并创建ApplicationContext应用上下文对象，然后将其存储入最大的域servletContext中，其他web层方法就可以在需要时直接从域中获取应用上下文对象


#### 配置文件web.xml 配置监听器和Servlet
这里将Spring配置文件的文件名作为全局参数进行配置，避免了文件名加载配置文件导致的耦合

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <!--全局初始化参数 将Spring配置文件作为参数存储以解耦合-->
    <context-param>
        <param-name>applicationContext</param-name>
        <param-value>applicationContext.xml</param-value>
    </context-param>

    <!--配置监听器-->
    <listener>
        <listener-class>cn.ywrby.listener.ContextLoaderListener</listener-class>
    </listener>

    <!--配置Servlet-->
    <servlet>
        <servlet-name>UserServlet</servlet-name>
        <servlet-class>cn.ywrby.web.UserServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>UserServlet</servlet-name>
        <url-pattern>/userServlet</url-pattern>
    </servlet-mapping>
    

</web-app>
```

#### 创建监听器

```java
/**
 * 创建监听器，监听服务器启动
 */
public class ContextLoaderListener implements ServletContextListener {
    /**
     * 在服务器启动时加载配置文件创建应用上下文对象
     */
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        //获取ServletContext域
        ServletContext servletContext=sce.getServletContext();
        //从ServletContext域中获取全局初始化参数(获得Spring配置文件名)
        String context_name=servletContext.getInitParameter("applicationContext");
        //加载Spring配置文件并创建Spring应用上下文
        ApplicationContext context=new ClassPathXmlApplicationContext(context_name);
        //将Spring应用上下文存储到最大的域servletContext中
        servletContext.setAttribute("app",context);

    }
}
```




#### 修改Servlet，从ServletContext域中获取Spring应用上下文

```java
public class UserServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //利用req从ServletContext域中获取存储的应用上下文对象
        ApplicationContext context= (ApplicationContext) req.getServletContext().getAttribute("app");
        //利用应用上下文获取Spring容器中的service层对象
        UserService service= (UserService) context.getBean("userService");
        service.save();
    }
}
```


## Spring提供的获取应用上下文的工具

上文提到的获取应用上下文的方式较为繁琐，并且每个web项目几乎都需要进行配置上下文的获取，所以Spring已经对应用上下文的获取进行了封装，我们只需要使用其提供的工具即可

Spring提供了一个监听器ContextLoaderListener就是对上述监听器的封装，该监听器实现了内部加载配置文件，创建应用上下文对象，并将对象存储在ServletContext域中，，同时提供了一个工具类WebApplicationContextUtils用来进行应用上下文的获取

### 使用步骤


#### 0. 在pom.xml中导入spring-web坐标
```xml
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-web</artifactId>
            <version>5.3.3</version>
        </dependency>
```

#### 1. 在web.xml中配置ContextLoaderListener监听器
注意，这里的初始化参数名称必须是contextConfigLocation不能进行修改
```xml
    <!--全局初始化参数 将Spring配置文件作为参数存储以解耦合-->
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:applicationContext.xml</param-value>
    </context-param>

    <!--配置监听器-->
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>
```


#### 2. 使用WebApplicationContextUtils获取应用上下文对象ApplicationContext

```java
public class UserServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //（利用req获取ServletContext域）
        ServletContext servletContext=req.getServletContext();
        //利用WebApplicationContextUtils获取应用上下文
        WebApplicationContext context=WebApplicationContextUtils.getWebApplicationContext(servletContext);
        //利用应用上下文获取Spring容器中的service层对象
        UserService service= (UserService) context.getBean("userService");
        service.save();
    }
}
```

