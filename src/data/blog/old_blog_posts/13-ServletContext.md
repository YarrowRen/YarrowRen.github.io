---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:34:13
modDatetime: *id001
title: 13-ServletContext
slug: 13-ServletContext
featured: false
draft: false
tags:
- JavaWeb
description: 代表整个web应用，可以和程序的容器进行通信
---

# ServletContext对象

### 概念

代表整个web应用，可以和程序的容器进行通信

### ServletContext对象的获取
- 通过request对象获取：getServletContext()
- 通过HttpServlet获取：getServletContext()

```java
@WebServlet("/servletContextDemo1")
public class ServletContextDemo1 extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //通过request直接获取
        ServletContext sc1=request.getServletContext();
        //通过HttpServlet获取
        ServletContext sc2=this.getServletContext();

        System.out.println(sc1==sc2); //true
        System.out.println(sc1);

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }
}
```


## 功能

### 1. 获取MIME类型  

#### MIME类型概念
在互联网通信过程中定义的一种文件数据类型，HTTP协议也遵循这种数据类型

#### 格式
大类型/小类型，例如：
- text/html
- image/jpeg

#### 获取方式
- getMimeType(String filename)

### 2. 作为域对象-共享数据
- setAttribute(String name,Object value)
- getAttribute(String name)
- removeAttribute(String name)

#### ServletContext对象的范围
所有用户所有请求的数据

### 3. 获取文件的真实（服务器）路径
这里获取的真实路径是指在程序运行在Tomcat服务器上时的文件路径，而不是指我们当前工作空间的真实路径
 
我们传入的路径是以web文件夹为基准的相对路径，这里需要注意，如果要获取与web文件夹同级的src文件夹中的文件，有两种方式，一种是采用类加载器的方式，局限性较大，另一种方式是当程序运行在Tomcat服务器上时，src中的内容会被放置在web文件夹下的WEB-INF文件夹中的classes文件夹中，可以通过这种相对关系来获取

#### 方法： 
- String getRealPath(String path)


#### 例如：
- 获取web文件夹下的文件：getRealPath("/a.txt")
- 获取WEB-INF文件夹下的文件：getRealPath("/WEB-INF/b.txt")
- 获取src文件夹下的文件：getRealPath("/WEB-INF/classes/c.txt")



