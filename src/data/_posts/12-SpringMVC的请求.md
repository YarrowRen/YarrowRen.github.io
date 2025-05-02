---
author: Boyu Ren
pubDatetime: &id001 2021-03-08 13:40:00
modDatetime: *id001
title: 12-SpringMVC的请求
slug: 12-SpringMVC的请求
featured: false
draft: false
tags:
- Spring
- SpringMVC
description: 客户端请求参数的格式：name=value&name=value...
---

# SpringMVC的请求

## 获得请求参数

客户端请求参数的格式：name=value&name=value...

服务器端要获得请求的参数，有时还需要对获得的数据进行封装，SpringMVC可以接收的参数如下：
- 基本类型参数
- POJO类型参数
- 数组类型参数
- 集合类型参数

### 基本类型参数的获取

当Controller中的业务方法的参数名称与请求参数的名称一致时，SpringMVC会自动进行参数值的映射匹配

例如该方法中的参数名称分别为username和age，当我们访问 http://localhost:8080/save?username=leslie&age=20 时，两个基本类型的参数便能够自动匹配

```java
@Controller("userController")
public class UserController {

    @RequestMapping("/save")
    @ResponseBody
    public void save(String username,int age){
        System.out.println(username);
        System.out.println(age);
    }
}

/* 输出结果
leslie
20
*/
```

### 获得POJO类型的参数
当Controller的业务方法中请求的POJO类的属性值与请求参数名称一致时，SpringMVC会自动将对应的属性值封装到POJO类中并实例化该对象

例如该业务方法的参数为POJO类：User，其内部属性值分别为username和age，当我们访问 http://localhost:8080/save?username=leslie&age=20 时，username和age便会被传入User对象内并实例化该POJO对象

```java
@Controller("userController")
public class UserController {

    @RequestMapping("/save")
    @ResponseBody
    public void save(User user){
        System.out.println(user.toString());
    }
}

/* 输出结果
User{username='leslie', age=20}
*/
```

### 获得数组类型的参数

本质与上文同理，只要保证Controller的业务方法中参数的数组名称与请求参数名称一致，数组便可以被自动匹配

访问 http://localhost:8080/save?users=leslie&users=Jessica&users=Lily 该路径，则数组users将被自动匹配

```java
@Controller("userController")
public class UserController {

    @RequestMapping("/save")
    @ResponseBody
    public void save(String[] users){
        for(String user:users){
            System.out.println(user);
        }
    }
}

/* 运行结果
leslie
Jessica
Lily
*/
```

### 获得集合类型的参数

#### 方法一：

想要获得集合类型的参数，不能再直接通过在参数列表中指定集合类型的参数，而是需要将集合参数包装到一个POJO中（一般将该POJO称为VO：View Object），通过这个对象来获取集合类型参数

```java
public class VO {
    private List<User> userList;

    public List<User> getUserList() {
        return userList;
    }

    public void setUserList(List<User> userList) {
        this.userList = userList;
    }

    @Override
    public String toString() {
        return "VO{" +
                "userList=" + userList +
                '}';
    }
}
```

同样这里也无法通过get方法获取参数了，所以利用一个简单的表单页面完成验证,表单中`<input>`标签的name属性用于指定集合参数的名称，以及写入数据在集合中的位置，以及写入数据的属性名称。例如：`name="userList[0].username"`表示这个数据会被写入到userList这个集合的第一个位置，写入的属性名称为username

```jsp
<%--
  Created by IntelliJ IDEA.
  User: renboyu010214
  Date: 2021/3/8
  Time: 16:06
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
<form action="${pageContext.request.contextPath}/save" method="post">
    <input type="text" name="userList[0].username"><br/>
    <input type="text" name="userList[0].age"><br/>
    <input type="text" name="userList[1].username"><br/>
    <input type="text" name="userList[1].age"><br/>
    <input type="submit" value="提交">
</form>

</body>
</html>
```

接下来业务方法就可以利用VO对象来接收集合
```java
@Controller("userController")
public class UserController {

    @RequestMapping("/save")
    @ResponseBody
    public void save(VO vo){
        System.out.println(vo);
    }
}
```

测试用例：

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/ListTest.png)

执行结果：

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/ListResult.png)



#### 方法二：

当使用ajax提交时，可以指定contentType为json格式，然后在业务方法中为参数名添加@RequestBody注解，就可以直接接收集合参数，不需要通过POJO封装后接收

通过ajax提交数据，并指定contentType类型为json格式

下面的代码先引入了jQuery文件，然后定义了一个集合数据类型，并向其中写入了两条数据，随后通过ajax进行提交，指定提交方式为POST，提交路径为业务方法的路径，提交的数据为经过JSON格式转化的集合数据，contentType为JSON

```jsp
<%--
  Created by IntelliJ IDEA.
  User: renboyu010214
  Date: 2021/3/8
  Time: 16:06
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
    <script src="${pageContext.request.contextPath}/js/jQuery-3.5.1.js"></script>
    <script>
        var userList=new Array();
        userList.push({username:"Leslie",age:19});
        userList.push({username:"Jessica",age:37});

        $.ajax({
            type: "POST",
            url: "${pageContext.request.contextPath}/save",
            data: JSON.stringify(userList),
            contentType: "application/json;charset=utf-8"
        })
    </script>
</head>
<body>
</body>
</html>
```

开启静态资源的访问，以保证jQuery-3.5.1.js能被正常访问到

```xml
<mvc:resources mapping="/js/**" location="/js/"/>
```

在业务方法的参数前加上注解@RequestBody

```java
@Controller("userController")
public class UserController {

    @RequestMapping("/save")
    @ResponseBody
    public void save(@RequestBody List<User> userList){
        for(User user:userList){
            System.out.println(user);
        }
    }
}

/* 运行结果
User{username='Leslie', age=19}
User{username='Jessica', age=37}
*/
```

就是本来用到jquery，他会把js文件当做请求，去扫描所有的requestMapping，发现没有，就加载失败。需要给这个扫描的配适器加一个能够扫描本地js目录下文件的权限

### 开启静态资源的访问

上文中在通过ajax提交数据的过程中，在spring-mvc.xml中加入了如下代码

```xml
<mvc:resources mapping="/js/**" location="/js/"/>
```

如果不加入该代码，当我们访问对应的jsp文件路径时，会发现网页提示如下错误

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/error1.png)

这里的错误是由于我们在web.xml中配置SpringMVC的前端控制器DispatcherServlet时设置了缺省值`<url-pattern>/</url-pattern>`，这导致我们在访问所有资源时，如果没有对应Servlet，则其会交由前端控制器进行处理，而前端控制器寻找资源的依据是注解`@RequestMapping("/xxx")`中设置的资源路径，但很明显jQuery文件并没有配置该虚拟路径，所以导致前端控制器和网页无法访问到该资源

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

因此我们需要开启某些资源的访问权限（一般情况下都为静态资源），所以在配置文件中加入对js文件夹下所有静态资源的访问权限

```xml
<!--开启js文件夹下所有资源的访问权限,
mapping表示映射资源地址，location表示开放的目录-->
<mvc:resources mapping="/js/**" location="/js/"/>
```


或者我们还可以进行如下配置

```xml
<mvc:default-servlet-handler/>
```

该配置表示访问资源时仍旧首先通过前端控制器进行访问，如果前端控制器不能匹配到对应的资源，则调用原始的容器进行静态资源的访问（而在此处原始的容器是Tomcat服务器，其本身具有访问静态资源的能力），所以可以解决静态资源不能被访问到的问题

PS：该配置必须写在spring-mvc的注解驱动配置下方才有效

### 配置全局乱码过滤器

```xml
    <!--配置全局乱码过滤器-->
    <filter>
        <filter-name>CharacterEncodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>utf-8</param-value>
        </init-param>
    </filter>

    <filter-mapping>
        <filter-name>CharacterEncodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
```

解决获得参数中包含中文出现乱码的问题

### 参数绑定注解@RequestParam

当请求的参数名称与Controller中业务方法的参数名称不一致时，就需要通过@RequestParam注解将两个参数名称进行显式的绑定

```java
    @RequestMapping("/save")
    @ResponseBody
    public void save(@RequestParam("user") String username){
        System.out.println(username);
    }
```

该注解包含三个参数，value表示请求参数的名称，required为布尔类型，表示请求时是否必须指定该参数，默认值为true，defaultValue表示没有请求该参数时，默认向业务方法的参数中传入的值

### 获得Restful风格的参数
Restful是一种软件架构风格、设计风格，而不是标准，只是提供了一组设计原则和约束条件。主要用于客户端和服务器交互类的软件，基于这个风格设计的软件可以更简洁，更有层次，更易于实现缓存机制等。

Restful风格的请求是使用“url+请求方式”表示一次请求目的的，HTTP 协议里面四个表示操作方式的动词如下：
- GET：用于获取资源
- POST：用于新建资源
- PUT：用于更新资源
- DELETE：用于删除资源  

```java
@Controller("userController")
public class UserController {

    /**
     * 上述url地址/save/{name}中的{name}就是要获得的请求参数，在SpringMVC中可以使用占位符进行参数绑定。
     * 在业务方法中我们可以使用@PathVariable注解进行占位符的匹配获取工作。
     * value值必须与要匹配的占位符的名字一致，required表示是否为必须参数
     */
    @RequestMapping("/save/{name}")
    @ResponseBody
    public void save(@PathVariable(value = "name",required = true) String username) {
        System.out.println(username);
    }
}

/* 运行结果
leslie
*/
```

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/restfultest1.png)






### 自定义类型转换器

SpringMVC 默认已经提供了一些常用的类型转换器，例如客户端提交的字符串转换成int型进行参数设置。
但是不是所有的数据类型都提供了转换器，没有提供的就需要自定义转换器，例如：日期类型的数据就需要自定义转换器。


自定义类型转换器的开发步骤：
- 定义转换器类实现Converter接口
- 在配置文件中声明转换器
- 在<annotation-driven>中引用转换器

#### 定义转换器类实现Converter接口
```java
public class DateConverter implements Converter<String, Date> {
    @Override
    public Date convert(String s) {
        //将获取到的字符串数据转换为日期类型并返回
        SimpleDateFormat format=new SimpleDateFormat("yyyy-MM-dd");
        Date date=null;
        try {
            date = format.parse(s);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }
}
```

#### 在配置文件中声明转换器，并在注解驱动中声明使用（spring-mvc.xml中）



```xml
    <!--配置spring-mvc的注解驱动,在驱动中声明使用转换器-->
    <mvc:annotation-driven conversion-service="conversionService"/>
    <!--声明转换器，外层是转换器声明池-->
    <bean id="conversionService" class="org.springframework.context.support.ConversionServiceFactoryBean">
        <property name="converters">
            <bean class="cn.ywrby.converter.DateConverter"/>
        </property>
    </bean>
```


```java
    @RequestMapping("/save")
    @ResponseBody
    public void save(Date date) {
        System.out.println(date);
    }
    /* 运行结果
    Thu Dec 31 00:00:00 CST 2020
     */
```
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/datetest.png)


