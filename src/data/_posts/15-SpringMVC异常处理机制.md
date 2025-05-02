---
author: Boyu Ren
pubDatetime: &id001 2021-03-17 00:23:29
modDatetime: *id001
title: 15-SpringMVC异常处理
slug: 15-SpringMVC异常处理机制
featured: false
draft: false
tags:
- Spring
- SpringMVC
description: 系统中异常主要包括两部分，[编译时异常与运行时异常] [Spring,SpringMVC](https://ywrby.cn/2021/03/03/1-%E5%BC%82%E5%B8%B8/),前者可以通过捕获异常从而获取异常信息，后者主要通过规范代码格式，测试等手段减少异常出现
---

# SpringMVC异常处理

系统中异常主要包括两部分，[编译时异常与运行时异常] [Spring,SpringMVC](https://ywrby.cn/2021/03/03/1-%E5%BC%82%E5%B8%B8/),前者可以通过捕获异常从而获取异常信息，后者主要通过规范代码格式，测试等手段减少异常出现

在开发过程中，系统的DAO层，SERVICE层和CONTROLLER层都有可能出现异常情况，这种情况下我们应该尽量将异常向上层抛出，最后将所有异常交由SpringMVC的前端控制器处理，其会利用异常处理器来进行异常处理

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/SpringMVC%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86%E6%9C%BA%E5%88%B6.png)

## SpringMVC异常处理的两种方式
- 直接使用SpringMVC提供的简单异常处理器：SimpleMappingExceptionResolver
- 实现Spring的异常处理接口HandlerExceptionResolver自定义自己的异常处理器


### 1. 使用SimpleMappingExceptionResolver

#### 配置简单映射异常处理器
```xml
    <!--配置简单映射异常处理器-->
    <bean class="org.springframework.web.servlet.handler.SimpleMappingExceptionResolver">
        <!--配置默认错误视图，指向error.jsp-->
        <property name="defaultErrorView" value="error"/>
        <!--异常映射，将指定报错映射到指定视图，一旦出现指定报错跳转到指定页面-->
        <property name="exceptionMappings">
            <map>
                <!--键为错误类，值为跳转视图-->
                <entry key="cn.ywrby.exception.MyException" value="error"/>
                <entry key="java.lang.ClassCastException" value="error"/>
            </map>
        </property>
    </bean>
```


#### 测试异常

产生异常的方法
```java
@Service("exceptionService")
public class ExceptionServiceImpl implements ExceptionService {
    public void showError1(){
        System.out.println("抛出类型转换异常");
        Object str="Leslie";
        Integer integer=(Integer)str;
    }

    public void showError2(){
        System.out.println("抛出除零异常");
        int i=1/0;
    }

    public void showError3() throws FileNotFoundException {
        System.out.println("抛出文件路径异常");
        InputStream in=new FileInputStream("C:/xxx/xxx/xxx.txt");
    }

    public void showError4(){
        System.out.println("抛出空指针异常");
        String str=null;
        str.length();
    }

    public void showError5() throws MyException {
        System.out.println("抛出自定义异常");
        throw new MyException();
    }
}
```

调用产生异常的方法
```java
@Controller("exceptionController")
public class ExceptionController {

    @Autowired
    private ExceptionService service;

    @RequestMapping("/exception")
    public void testError(){
        service.showError1();
    }
}
```

#### 实例结果

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/%E7%AE%80%E5%8D%95%E5%BC%82%E5%B8%B8%E6%98%A0%E5%B0%84.png)


### 2. 自定义异常处理器

#### 创建异常处理器类实现HandlerExceptionResolver

```java
/**
 * 自定义异常处理器，实现HandlerExceptionResolver接口
 */
public class MyExceptionResolver implements HandlerExceptionResolver {
    @Override
    public ModelAndView resolveException(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) {
        ModelAndView modelAndView=new ModelAndView();
        //判断异常种类
        if(e instanceof MyException){
            modelAndView.addObject("info","自定义异常");
        }else if(e instanceof ClassCastException){
            modelAndView.addObject("info","类转换异常");
        }else{
            modelAndView.addObject("info","其他异常");
        }
        //设定跳转视图
        modelAndView.setViewName("error");
        return modelAndView;
    }
}
```
#### 配置异常处理器
```xml
    <!--配置自定义异常处理器-->
    <bean class="cn.ywrby.resolver.MyExceptionResolver"/>
```
#### 编写异常页面

```jsp
<%--
  Created by IntelliJ IDEA.
  User: renboyu010214
  Date: 2021/3/17
  Time: 1:04
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Error1</title>
</head>
<body>
<h1>Error：${info}</h1>
</body>
</html>
```

#### 测试页面跳转

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86%E5%99%A8.png)