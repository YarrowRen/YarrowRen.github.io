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
description: Java Server Pages（JSP）基础：概念、运行原理、脚本元素、指令与内置对象
---

# JSP 基础

## JSP 概念

JSP（Java Server Pages）是一种运行在服务器端的页面技术，允许在 HTML 页面中嵌入 Java 代码，用于生成动态 Web 内容，主要目标是**简化 Servlet 中大量 HTML 输出代码的编写**。

一个 JSP 页面通常包含：
- HTML 标签（用于页面展示）
- JSP 指令
- JSP 脚本元素（Java 代码）

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>测试用例</title>
  </head>
  <body>
    <% System.out.println("hello JSP!"); %>
    <p>hi JSP!</p>
  </body>
</html>
````

---

## JSP 运行原理

JSP 本质上仍然是 **Servlet**。

服务器在第一次访问 JSP 页面时，会经历以下过程：

1. 将 `.jsp` 文件转换为 `.java` Servlet 源文件
2. 编译生成 `.class` 字节码文件
3. 由容器（如 Tomcat）加载并执行
4. 后续访问直接使用已编译的 Servlet

由于只有 Servlet 能被 Web 容器直接调用，因此 JSP 只是 Servlet 的一种**语法层封装**。

---

## JSP 脚本元素

JSP 中用于编写 Java 代码的语法称为脚本元素，主要分为三类，不同脚本在最终生成的 Servlet 中所处位置不同。

### 1. Scriptlet（脚本片段）

```jsp
<% Java代码 %>
```

* 代码会被直接放入 `service` 方法中
* 可编写 `service` 方法中允许的任何语句

```jsp
<% System.out.println("hello"); %>
```

---

### 2. Declaration（声明）

```jsp
<%! Java代码 %>
```

* 代码会被放入 Servlet 类的成员位置
* 可定义成员变量或成员方法

```jsp
<%! int count = 100; %>
```

---

### 3. Expression（表达式）

```jsp
<%= 表达式 %>
```

* 表达式的结果会直接输出到页面
* 本质等价于 `out.print(...)`

```jsp
<%= "hello JSP" %>
```

---

## JSP 内置对象

JSP 页面中可以直接使用的一组对象，由容器在运行时自动创建并注入。

其中 `out` 是字符输出流对象，功能与 `response.getWriter()` 类似，用于向页面输出内容。

需要注意：

* `out` 与 `response.getWriter()` 使用不同的缓冲区
* 在 Tomcat 中，响应结果通常会优先刷新 `response` 的缓冲区
* 实际开发中应统一使用一种输出方式，避免混用

---

## JSP 指令

### 作用

用于配置 JSP 页面属性、导入资源或标签库。

### 基本格式

```jsp
<%@ 指令名 属性名=属性值 ... %>
```

### 常见指令类型

* `page`：配置当前 JSP 页面
* `include`：页面静态包含
* `taglib`：引入标签库

---

### page 指令常用属性

| 属性名         | 作用               |
| ----------- | ---------------- |
| contentType | 设置响应 MIME 类型和字符集 |
| import      | 导入 Java 包        |
| errorPage   | 指定当前页面异常时跳转的页面   |
| isErrorPage | 标识当前页面是否为异常处理页面  |

---

### 异常处理示例

**可能产生异常的页面**

```jsp
<%@ page contentType="text/html;charset=UTF-8" errorPage="error.jsp" %>
<%
    int i = 3 / 0;
%>
```

**异常处理页面**

```jsp
<%@ page contentType="text/html;charset=UTF-8" isErrorPage="true" %>
<html>
<body>
<h1>页面错误</h1>
<p><%= exception.getMessage() %></p>
</body>
</html>
```

---

## JSP 注释方式

* **HTML 注释**

  ```html
  <!-- 只能注释 HTML -->
  ```

* **JSP 注释**

  ```jsp
  <%-- 可注释 Java 代码和 HTML --%>
  ```

---

## JSP 九大内置对象

| 变量名         | 类型                  | 主要作用                |
| ----------- | ------------------- | ------------------- |
| pageContext | PageContext         | 当前页面作用域，可获取其他内置对象   |
| request     | HttpServletRequest  | 一次请求范围内共享数据         |
| response    | HttpServletResponse | 响应对象                |
| session     | HttpSession         | 一次会话范围内共享数据         |
| application | ServletContext      | 全局共享数据              |
| page        | Object              | 当前 Servlet 实例（this） |
| out         | JspWriter           | 页面输出对象              |
| config      | ServletConfig       | Servlet 配置对象        |
| exception   | Throwable           | 异常对象（仅错误页可用）        |

<!-- 2026.01.28由GPT5.2优化全文 -->