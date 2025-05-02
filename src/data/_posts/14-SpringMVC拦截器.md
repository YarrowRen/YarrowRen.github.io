---
author: Boyu Ren
pubDatetime: &id001 2021-03-13 22:40:38
modDatetime: *id001
title: 14-SpringMVC拦截器
slug: 14-SpringMVC拦截器
featured: false
draft: false
tags:
- Spring
- SpringMVC
description: SpringMVC中的拦截器作用类似Servlet中的[Filter]([djsis.com](http://localhost:4000/2021/03/03/19-Filter%E8%BF%87%E6%BB%A4%E5%99%A8/))，用于对处理器进行预处理与后处理
---

# SpringMVC拦截器(Interceptor)



SpringMVC中的拦截器作用类似Servlet中的[Filter]([djsis.com](http://localhost:4000/2021/03/03/19-Filter%E8%BF%87%E6%BB%A4%E5%99%A8/))，用于对处理器进行预处理与后处理

将拦截器按一定顺序连成一条链，这条链被称为拦截器链（Interceptor Chain），在访问被拦截的方法或字段时，拦截器链就会按照指定顺序执行，这也是AOP思想的体现

## 拦截器与过滤器的区别

区别|过滤器|拦截器
---|---|---
使用范围|是servlet规范中的一部分，任何JavaWeb工程都可以使用|是SpringMVC框架所封装的，只有使用SpringMVC框架的工程才可以使用
拦截范围|在url-pattern中配置了/*的情况下，可以对**所有访问资源**进行过滤|只能拦截访问的控制器中的业务方法，如果访问的是.jsp.html.css.img等资源文件，是无法拦截的


## 拦截器基本操作

### 1. 创建拦截器类，实现HandlerInterceptor接口、
```java
public class MyInterceptor implements HandlerInterceptor {
    /**
     * 在目标方法执行之前执行
     * @return 返回值为布尔类型，表示是否拦截该方法，停止后续执行
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("在目标方法执行之前执行...");
        return true;
    }

    /**
     * 在目标方法执行完成之后，视图对象返回之前 执行
     */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("在目标方法执行完成之后，视图对象返回之前 执行...");
    }

    /**
     * 在视图返回之后执行
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println("在视图返回之后执行...");
    }
}
```

### 2. 配置拦截器

```xml
    <!--配置拦截器链-->
    <mvc:interceptors> 
        <mvc:interceptor>
            <!--path指定对哪些资源进行拦截（只能拦截控制器中的业务方法）-->
            <mvc:mapping path="/**"/>
            <bean class="cn.ywrby.interceptor.MyInterceptor"/>
        </mvc:interceptor>
    </mvc:interceptors>
```

### 3. 测试拦截器效果

控制器实现
```java
@Controller
public class TargetController {

    @RequestMapping("/show")
    public ModelAndView show(){
        System.out.println("目标资源执行");
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.addObject("username","Leslie");
        modelAndView.setViewName("index");
        return modelAndView;
    }
}
```
jsp页面实现

```jsp
<%--
  Created by IntelliJ IDEA.
  User: renboyu010214
  Date: 2021/3/14
  Time: 12:54
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
    <h1>Hello world!${username}</h1>

</body>
</html>
```

访问控制器业务方法

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/testresult.png)

控制台输出

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/testresult2.png)

