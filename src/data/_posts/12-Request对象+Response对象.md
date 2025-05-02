---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:34:12
modDatetime: *id001
title: 12-Request对象+Response对象
slug: 12-Request对象+Response对象
featured: false
draft: false
tags:
- JavaWeb
description: '- request对象和response对象是由服务器创建的，供程序员使用的对象'
---

# Request对象

## request对象和response对象原理
- request对象和response对象是由服务器创建的，供程序员使用的对象
- request对象是来获取请求信息的，response对象是来设置响应消息的

### 浏览器&服务器请求响应过程

![浏览器服务器请求响应过程](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%AF%B7%E6%B1%82%E5%93%8D%E5%BA%94%E8%BF%87%E7%A8%8B.jpg)

## Request功能

### 获取请求消息数据
1. 获取请求行数据
    - String getMethod():获取请求方式GET/POST
    - String　getContextPath():获取虚拟目录
    - String getServletPath():获取Servlet路径
    - String getQueryString():获取get方式的请求参数
    - String getRequestURI():获取请求URI（不包含协议和IP地址）
    - StringBuffer getRequestURL():获取请求URI（包含协议和IP地址）
    - String getProtocol():获取协议及版本
    - String getRemoteAddr():获取客户机IP地址
2. 获取请求头数据
    - String getHeader(String headerName):通过请求头的名称获取请求头的值
    - Enumeration<String> getHeaders():获取所有请求头的名称（Enumeration<String>通过hasMoreElements方法判断是否结束，通过nextElement获取下一个请求头的名称）
3. 获取请求体数据
    - 只有POST请求方式，才有请求体
    - 请求体的返回数据是流对象的格式，所以我们需要先获取流对象，再从流对象中获取请求体的数据，共有两种方式获取流对象
        - BufferesReader getReader():获取字符输入流，只能操作字符数据
        - ServletInputStream getInputStream():获取字节输入流，可以操作所有类型的数据


#### 获取请求行数据代码示例

```java
/**
 * - String getMethod():获取请求方式GET/POST
 * - String　getContextPath():获取虚拟目录
 * - String getServletPath():获取Servlet路径
 * - String getQueryString():获取get方式的请求参数
 * - String getRequestURI():获取请求URI（不包含协议和IP地址）
 * - StringBuffer getRequestURL():获取请求URI（包含协议和IP地址）
 * - String getProtocol():获取协议及版本
 * - String getRemoteAddr():获取客户机IP地址
 */
 
@WebServlet(value="/requestDemo1")
public class RequestDemo1 extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("请求方式："+request.getMethod());
        System.out.println("虚拟目录："+request.getContextPath());
        System.out.println("Servlet路径："+request.getServletPath());
        System.out.println("get方式的请求参数："+request.getQueryString());
        System.out.println("请求URI："+request.getRequestURI());
        System.out.println("请求URL："+request.getRequestURL());
        System.out.println("协议及版本："+request.getProtocol());
        System.out.println("客户机IP地址："+request.getRemoteAddr());
    }
}

/*
运行结果：
 
请求方式：GET
虚拟目录：/JavaWebTest2
Servlet路径：/requestDemo1
get方式的请求参数：username=renboyu010214
请求URI：/JavaWebTest2/requestDemo1
请求URL：http://localhost:8080/JavaWebTest2/requestDemo1
协议及版本：HTTP/1.1
客户机IP地址：0:0:0:0:0:0:0:1
 */
```

#### 获取请求头数据代码示例

```java
@WebServlet("/requestDemo2")
public class RequestDemo2 extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //获取所有请求头的名称request.getHeaderNames()
        Enumeration<String> enumeration=request.getHeaderNames();
        while (enumeration.hasMoreElements()){
            //利用迭代器逐个获取请求头名称
            String headerName=enumeration.nextElement();
            //利用请求头名称获取请求头的值request.getHeader(headerName)
            String headerValue=request.getHeader(headerName);
            //输出结果
            System.out.println(headerName+" : "+headerValue);
        }
    }
}
```
运行结果：(有特殊字符*/不便放在注释中)

```java
host : localhost:8080
connection : keep-alive
upgrade-insecure-requests : 1
user-agent : Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36
accept : text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
sec-fetch-site : none
sec-fetch-mode : navigate
sec-fetch-user : ?1
sec-fetch-dest : document
accept-encoding : gzip, deflate, br
accept-language : zh-CN,zh;q=0.9,en;q=0.8,bo-CN;q=0.7,bo;q=0.6
cookie : JSESSIONID=B675242192B257B0274786E223DE5A0F; JSESSIONID=9C6F2A1D8D267CD4F8849D8D1158DDFF
```

#### 获取请求体数据示例

```java
@WebServlet("/requestDemo3")
public class RequestDemo3 extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //获取流对象
        BufferedReader br=request.getReader();
        String line=null;
        //从流对象中逐行获取数据
        while((line=br.readLine())!=null){
            System.out.println(line);
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
//运行结果：
//username=renboyu010214&password=123456
```



### 其他功能

#### 1. 通用的获取请求参数的方法
以下四种方式不论是POST还是GET方式都可以获取到请求参数
- String getParameter(String name):根据参数名称获取参数值
- String[] getParameterValues(String name):根据参数名称获取参数值的数组（因为可能出现一个名称对应多个值的情况）
- Enumeration<String> getParameterNames():获取所有请求参数的名称
- Map<String,String[]> getParameterMap():获取所有参数的map集合


##### 中文乱码问题：
当获取请求参数出现乱码时，只需要在获取参数前，提前设置编码请求参数的格式即可

#### 2. 请求转发功能

一种在服务器内部的资源跳转方式

##### 步骤
1. 通过request对象获取请求转发器对象：RequestDispatcher getRequestDispatcher(String path)
2. 使用RequestDispatcher对象进行转发，利用其的forward(ServletRequest request ServletResponse response)方法


##### 特点
- 浏览器路径不发生变化
- 只能转发到当前服务器内部资源中
- 转发是一次请求


##### 示例
```java
@WebServlet("/requestDemo5")
public class RequestDemo5 extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("访问RequestDemo5...");
        RequestDispatcher requestDispatcher=request.getRequestDispatcher("/requestDemo6");
        requestDispatcher.forward(request,response);
        //一般情况下利用链式编程化简为一句即可：request.getRequestDispatcher("/requestDemo6").forward(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }
}
/* 运行结果：
访问RequestDemo5...
访问RequestDemo6...
*/
```
 
```java
@WebServlet("/requestDemo6")
public class RequestDemo6 extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("访问RequestDemo6...");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }
}
```

#### 3. 共享数据

##### 域对象：
一个有作用范围的对象，可以在范围内共享数据

##### request域：
代表一次请求的范围，一般用于请求转发的多个资源中共享数据

##### 使用方法：
- void setAttribute(String name,Object obj):存储数据
- Object getAttribute(String name):通过键获取值
- void removeAttribute(String name):通过键移除键值对


#### 4. 获取ServletContext对象
- getServletContext()方法



## BeanUtils工具类
用于简化数据的封装过程

### JavaBean
标准的Java类
#### 要求
- 类必须被public修饰
- 必须提供空参的构造器
- 成员变量必须使用private修饰
- 提供公共的setter和getter方法

#### 功能

封装数据

### 提供的方法

- setProperty
- getProperty
- populate(Object obj,Map map):将map集合的键值对信息，封装到对应的JavaBean对象中

# Response对象

### 功能
设置响应消息（相应行，响应头，响应体）

### 设置响应行
- 格式：例如 HTTP/1.1 200 OK
- 设置状态码：setStatus(int sc)


### 设置响应头
- setHeader(String name,String Value)


### 设置响应体

#### 步骤
1. 获取输出流
    - 字符输出流：PrintWriter getWriter()
    - 字节输出流：ServletOutputStream getOutputStream()
2. 使用输出流，将数据输出到客户端浏览器


## 示例：

### 1. 重定向
资源跳转的一种方式

#### 特点：
- 重定向后地址栏发生变化
- 重定向可以访问其他站点（服务器）的资源
- 重定向是两次请求，不能使用request对象共享数据

**常规重定向操作**
1. 设置状态码为302
2. 设置location响应头，值为重定向资源路径
```java
@WebServlet("/responseDemo1")
public class ResponseDemo1 extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //访问demo1资源会自动跳转到demo2资源
        //1. 设置状态码为302
        response.setStatus(302);
        //2. 设置location响应头，值为重定向资源路径
        response.setHeader("location","/LoginTest/responseDemo2");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }
}
```

上述重定向操作中不难看出，状态码设为302是固定的，响应头的名称设为location也是固定的，唯一在重定向时会发生变化的就是跳转资源的路径，所以response对象将重定向进行了封装

**更简单的重定向操作**

- sendRedirect()方法

```java
@WebServlet("/responseDemo1")
public class ResponseDemo1 extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //访问demo1资源会自动跳转到demo2资源
        response.sendRedirect("/LoginTest/responseDemo2");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }
}
```

### 2. 输出字符/字节数据

#### 输出字符/字节数据
1. 设置编码格式（防止中文乱码）
2. 获取字符/字节输出流
3. 输出数据

##### 字符数据代码实现
```java
@WebServlet("/responseDemo3")
public class ResponseDemo3 extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //设置编码格式(还可以通过直接设置响应头的ContentType来实现编码的设置,例如下面)
        //response.setHeader("content-type","text/html;charset=utf-8");
        response.setContentType("text/html;charset=utf-8");
        //获取字符输出流
        PrintWriter pw=response.getWriter();
        //输出数据
        pw.write("你好！hello world!");
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }
}
```

##### 字节数据代码实现
```java
@WebServlet("/responseDemo3")
public class ResponseDemo3 extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //设置编码格式(还可以通过直接设置响应头的ContentType来实现编码的设置,例如下面)
        //response.setHeader("content-type","text/html;charset=utf-8");
        response.setContentType("text/html;charset=utf-8");
        //获取字节输出流
        ServletOutputStream sos=response.getOutputStream();
        //输出数据
        sos.write("加油！good job!".getBytes(StandardCharsets.UTF_8));
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }
}
```


# 路径写法

## 相对路径

通过相对路径不可以确定唯一资源，相对路径的写法：`./index.html`

### 相对路径的规则
- ./表示当前目录
- ../表示上一级目录


## 绝对路径

通过绝对路径可以确定唯一资源，但在书写时一般不写整个绝对路径的全部内容而是简化写法，例如：http://localhost/JavaWebTest/responseDemo1 可以简化为/JavaWebTest/responseDemo1

### 绝对路径规则
- 给客户端浏览器使用的路径需要加上虚拟目录，即格式为/JavaWebTest/responseDemo1（例如超链接标签<a>，重定向等等）
- 给服务器端使用的路径不需要加上虚拟路径，即格式为/responseDemo1（例如转发）