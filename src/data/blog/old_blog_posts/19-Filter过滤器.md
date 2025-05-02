---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:34:19
modDatetime: *id001
title: 19-Filter过滤器
slug: 19-Filter过滤器
featured: false
draft: false
tags:
- JavaWeb
description: 当访问服务器资源时，过滤器可以将请求提前拦截下来，完成一些特殊的操作。一般用于完成通用操作（检查是否登录，统一编码处理，敏感词汇处理等...）
---

# Filter

当访问服务器资源时，过滤器可以将请求提前拦截下来，完成一些特殊的操作。一般用于完成通用操作（检查是否登录，统一编码处理，敏感词汇处理等...）


#### 创建步骤
1. 定义类，实现Filter接口
2. 复写方法
3. 配置拦截路径（1. 通过web.xml 2. 通过注解@WebFilter）
```java
@WebFilter("/index.jsp")  //配置拦截路径，访问index.jsp前会进行过滤（"/*"表示访问所有资源前均过滤）
public class FilterDemo1 implements Filter {
    /**
     * 服务器启动后，会调用init方法，创建Filter对象，只执行一次
     * @param filterConfig
     * @throws ServletException
     */
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    /**
     * 在每一次请求被拦截的资源时执行，执行多次
     * @param servletRequest
     * @param servletResponse
     * @param filterChain
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        //对请求request进行特殊操作
        System.out.println("对request进行操作...");
        //放行
        filterChain.doFilter(servletRequest,servletResponse);
        //对响应response进行操作
        System.out.println("对response进行操作...");
    }

    /**
     * 在服务器关闭时销毁Filter对象，在服务器正常关闭的情况下执行，只执行一次
     */
    @Override
    public void destroy() {

    }
}
```

**第二种配置方法：通过web.xml(url-pattern处写拦截路径)**
```xml
    <filter>
        <filter-name>FilterDemo1</filter-name>
        <filter-class>cn.ywrby.Filter.FilterDemo1</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>FilterDemo1</filter-name>
        <url-pattern>/index.jsp</url-pattern>
    </filter-mapping>
```

### 过滤器执行流程
![filter](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/filter.jpg)
一次请求会两次经过Filter，request和response都会经由过滤器处理。在执行放行流程filterChain.doFilter(servletRequest,servletResponse)之前，一般对request进行特殊操作，在执行放行流程之后，一般对响应response进行操作

### 拦截路径配置的四种写法
1. 具体资源路径："/index.jsp" 只有访问具体路径资源时，才会调用过滤器
2. 拦截目录："/user/*" 访问user目录下所有资源时，都会调用过滤器
3. 后缀名拦截："*.jsp" 注意这种写法没有“/”,访问所有后缀名为.jsp的资源时都会调用过滤器
4. 拦截所有资源："/*" 访问所有资源都会调用过滤器


### 拦截方式配置
拦截方式是指资源被访问的方式
#### 注解配置
通过设置dispatcherTypes属性
- REQUEST：默认值，浏览器直接请求资源
- FORWORD：转发访问资源
- INCLUDE：包含访问资源
- ERROR：错误跳转资源
- ASYNC：异步访问资源

例如我们设置dispatcherTypes属性值为FORWARD则表示只有通过转发访问资源的方式才能够通过过滤器

我们将dispatcherTypes属性值设为REQUEST
```java
//dispatcherTypes = DispatcherType.REQUEST 表示浏览器直接请求资源时，该过滤器会被执行
@WebFilter(value = "/index.jsp",dispatcherTypes = DispatcherType.REQUEST)
public class FilterDemo2 implements Filter {
    public void destroy() {
    }

    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
        System.out.println("FilterDemo2正常执行...");
        chain.doFilter(req, resp);
    }

    public void init(FilterConfig config) throws ServletException {

    }

}
```
TextDemo1可以转发访问index.jsp
```java
@WebServlet("/TextDemo1")
public class TextDemo1 extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("TextDemo1正常执行...");
        //转发到index.jsp
        request.getRequestDispatcher("/index.jsp").forward(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);
    }
}
```

index.jsp被访问时在控制台输出内容
```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>测试用例</title>
  </head>
  <body>

  <%System.out.println("index.jsp执行...");%>

  <p>hi JSP!</p>

  </body>
</html>
```
当直接访问index.jsp时，过滤器正常执行

![直接访问](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/%E7%9B%B4%E6%8E%A5%E8%AE%BF%E9%97%AE.jpg)

当通过TextDemo1转发访问index.jsp时，过滤器没有被调用

![转发访问](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/%E8%BD%AC%E5%8F%91%E8%AE%BF%E9%97%AE.jpg)

#### web.xml配置
通过web.xml中的dispatcher标签也可以定义拦截方式

### 过滤器链
要注意过滤器链的执行顺序
![拦截器链](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/%E6%8B%A6%E6%88%AA%E5%99%A8%E9%93%BE.jpg)