---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:34:16
modDatetime: *id001
title: 16-JSP基础
slug: 16-JSP基础
featured: false
draft: false
tags:
- JavaWeb
description: Java Server Pages:Java服务器端页面，在该页面中既可以定义Java代码，也可以定义html标签，主要用于简化书写
---

# JSP

### 概念
Java Server Pages:Java服务器端页面，在该页面中既可以定义Java代码，也可以定义html标签，主要用于简化书写
```
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>测试用例</title>
  </head>
  <body>
    <%System.out.println("hello JSP!");%>
    <p>hi JSP!</p>
  </body>
</html>
```


### 原理

**JSP本质上还是Java中的Servlet，因为只有Servlet能够提供文件访问**

![index_jsp](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/index_jsp.jpg)

### JSP脚本
JSP中共有三种定义Java代码的方法，每种定义方法均有不同作用，经过编译并形成最终的.class文件时自动生成的位置也不相同

```
//定义的Java代码，在service方法中生成
//service方法中可以定义什么，这种方法就可以写什么
<% code %>
<% System.out.println("hello"); %> 

//定义的Java方法，在JSP转换后的成员位置
//可以定义成员变量或成员方法
<%! code %>
<%! int num=100; %>

//定义的Java代码，会输出到页面上
//输出语句可以定义什么,代码就可以定义什么
<%= code %>
<%= "hello" %>
```

### JSP内置对象
在JSP页面中，不需要获取和创建就可以直接使用的对象。JSP中共有9个内置对象（request,response,out...）

其中的out对象本质是字符输出流对象，其作用类似于response.getWriter()主要用于将字符输出到页面

out.write()和response.getWriter().write()的作用还是存在细微差距，由于二者缓冲区不一致，在Tomcat服务器中，始终会首先访问response的缓冲区再访问out缓冲区，所以导致response的输出始终先于out输出，无论二者在代码中的位置，所以一般情况下，都会统一采用一种输出方式



## JSP指令

#### 作用
用于配置JSP页面，导入资源文件

#### 格式
```
<%@ 指令名 属性名1=属性值1 属性名2=属性值2 ... %>
```

#### 分类
- page:配置JSP页面
- include:页面包含的，导入页面的资源文件
- taglib:导入资源


#### page指令常用属性
- contentType:作用等同于response.setContentType(),作用为设置响应体的MIME类型和字符集以及设置当前JSP页面编码
- import:用于导入相应包
- errorPage:表示当前页面发生异常后，会自动跳转到指定的页面
- isErrorPage:用于标识当前页面是否为异常跳转页面，如果是，则该页面可以通过内置对象exception获取跳转来的页面的报错信息

**可能发生报错的页面**
```
<%@ page contentType="text/html;charset=UTF-8" errorPage="JspDemo2.jsp" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>

<% int i=3/0; %>

</body>
</html>
```

**响应报错的页面**
```
<%@ page contentType="text/html;charset=UTF-8" isErrorPage="true" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
<h1>
    网页错误！错误原因：
</h1>
<% String e=exception.getMessage(); %>
<% out.write(e); %>
</body>
</html>
```

#### JSP注释方法
1. HTML注释：<!-- --> 只能注释HTML内容
2. JSP注释：<%-- --%> Java代码与HTML标签都可以注释

## JSP中的9个内置对象

变量名 | 真实类型 | 主要作用
---|---|---
pageContext|PageContext|当前页面内共享数据，还可以获取其他八个内置对象
request|HttpServletRequest|一次请求访问多个资源
response|HttpServletResponse|响应对象
session|HttpSession|一次会话的多个请求间
application|ServletContext|所有用户间共享数据
page|Object|当前页面（Servlet）的对象，this
out|JspWriter|输出对象，将内容输出到页面上
config|ServletConfig|Servlet配置对象
exception|Throwable|异常对象


