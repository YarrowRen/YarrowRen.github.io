---
author: Boyu Ren
pubDatetime: &id001 2021-03-05 15:27:43
modDatetime: *id001
title: 11-SpringMVC的数据响应
slug: 11-SpringMVC的数据响应
featured: false
draft: false
tags:
- Spring
- SpringMVC
description: 直接返回字符串，此种方法会将返回的字符串与视图解析器的前后缀拼接后进行页面跳转
---

# SpringMVC的数据响应

## 页面跳转

### 方式一：直接返回字符串

直接返回字符串，此种方法会将返回的字符串与视图解析器的前后缀拼接后进行页面跳转

1. 没有设置视图解析器的前后缀，直接返回字符串时就需要把跳转页面路径写全
```java
    @RequestMapping("/saveFunction")
    public String save(){
        System.out.println("(Controller) Save running...");
        return "/success.jsp";
    }
```

2. 设置视图解析器的前后缀(在Spring-MVC配置文件中配置)，直接返回字符串时就可以省略前后缀

```xml
    <!--配置内部资源视图解析器-->
    <bean id="viewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/"/>
        <property name="suffix" value=".jsp"/>
    </bean>
```

```java
    @RequestMapping("/saveFunction")
    public String save(){
        System.out.println("(Controller) Save running...");
        return "success";
    }
```

### 方式二：返回ModelAndView

ModelAndView对象内部分别存储了Model与View对象，其中Model对象负责进行数据的封装，即通过addObject方法像其中写入键值对，View对象负责展示数据（一般为JSP）通过setViewName进行指定

```java
    @RequestMapping("/saveFunction2")
    public ModelAndView save2(){
        /**
         * ModelAndView 对象
         * Model：模型，负责封装数据
         * View：视图，负责展示数据
         */
        ModelAndView modelAndView=new ModelAndView();
        //设置模型model数据
        modelAndView.addObject("username","Leslie");
        //设置视图名称
        modelAndView.setViewName("success");
        return modelAndView;
    }
```

```jsp
<%--
  Created by IntelliJ IDEA.
  User: renboyu010214
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
    <h1>Success! ${username}</h1>
</body>
</html>
```

上面的方法是在方法体内新创建ModelAndView对象，实际上由于是SpringMVC调用该方法，所以在调用过程中如果检测到该方法并非空参列表，会自动注入空参，所以可以改写成以下格式

```java
    @RequestMapping("/saveFunction2")
    public ModelAndView save2(ModelAndView modelAndView){
        modelAndView.addObject("username","Leslie");
        modelAndView.setViewName("success");
        return modelAndView;
    }
```

## 回写数据


### 通过返回字符串进行回写数据

#### 方法一：利用response对象直接回写数据

因为是通过SpringMVC调用方法，所以可以在方法的形参列表中加入HttpServletResponse对象，由SpringMVC负责在调用时自动传入实参，并通过获得的response对象的getWriter方法进行数据的回写（但一般不会使用这种方法，这种方法又将请求和响应对象引入到了方法中，不便于SpringMVC的使用）

```java
    @RequestMapping("/save")
    public void save2(HttpServletResponse response) throws IOException {
        response.getWriter().write("hello");
    }
```

#### 方法二：使用注解直接返回要回写的数据

之前的案例中可以看出，如果不做其他注解的话，直接返回字符串，会被SpringMVC主动与视图控制器的前后缀拼接后进行页面跳转，所以这里如果想要实现直接返回字符串作为回写数据必须加上注解@ResponseBody 表示不进行页面跳转直接将返回的数据写入返回体中

```java
    @RequestMapping("/save2")
    @ResponseBody
    public String save(){
        return "hello world";
    }
```

一般情况下，我们不会直接返回普通字符串，而是返回能表示更多信息的JSON格式的字符串，所以这里可以利用JSON格式转换工具JackSon先将对象转换成字符串，再将字符串返回

首先需要导入Jackson需要用到的坐标
```xml
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-core</artifactId>
            <version>2.11.4</version>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.11.4</version>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-annotations</artifactId>
            <version>2.11.4</version>
        </dependency>
```

然后修改方法

```java
@Controller("userController")
public class UserController {

    @RequestMapping("/save")
    @ResponseBody
    public String save() throws JsonProcessingException {
        //创建对象并存入信息
        User user=new User();
        user.setUsername("Lselie");
        user.setAge(18);
        //使用json转换工具将对象转换为JSON格式的字符串然后返回
        ObjectMapper objectMapper=new ObjectMapper();
        String json = objectMapper.writeValueAsString(user);
        //返回json格式字符串
        return json;
    }
}
```


### 通过对象或集合回写数据


#### 通过配置处理器映射器
直接通过SpringMVC帮助我们进行对象或集合的JSON格式转换，并进行数据会写。我们只需要为处理器适配器(因为是处理器适配器为我们的形参列表传入实参)配置消息转换参数，指定使用JackSon进行数据格式转换，所以我们对spring-mvc.xml进行配置(messageConverters表示的就是消息转换参数，它会调用我们指定的格式转换工具处理我们返回的对象)

```xml
    <!--配置处理器映射器-->
    <bean id="handlerAdapter" class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter">
        <property name="messageConverters">
            <bean class="org.springframework.http.converter.json.MappingJackson2HttpMessageConverter"/>
        </property>
    </bean>
```

改写方法

```java
    @RequestMapping("/save2")
    @ResponseBody
    public User save2(){
        //创建对象并存入信息
        User user=new User();
        user.setUsername("Lselie");
        user.setAge(18);
        //直接返回User对象
        return user;
    }
```

#### 通过MVC的注解驱动

上面对于处理器映射器的配置还是略显繁杂，因此我们可以使用 mvc的注解驱动代替上述的配置

```xml
    <!--配置spring-mvc的注解驱动-->
    <mvc:annotation-driven/>
```

在SpringMVC中，处理器映射器，处理器适配器，视图解析器被称为SpringMVC的三大组件

使用<mvc:annotation-driven/>配置mvc的注解驱动会自动加载RequestMappingHandlerMapping（处理器映射器）RequestMappingHandlerAdapter（处理器解析器），可用在spring-mvc.xml中用于替代处理器映射器和处理器解析器的配置

同时，该配置底层还会使用Jackson进行对象或集合的转换，所以我们不再需要配置处理器解析器
