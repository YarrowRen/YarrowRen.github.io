---
author: Boyu Ren
pubDatetime: &id001 2021-03-12 20:00:45
modDatetime: *id001
title: 13-SpringMVC文件上传
slug: 13-SpringMVC文件上传
featured: false
draft: false
tags:
- Spring
- SpringMVC
description: '- 表单项中type值为file'
---

# SpringMVC文件上传

## 文件上传客户端的三要素
- 表单项中type值为file
- 表单的提交方式为post
- 表单的enctype属性是多部分表单形式，即multipart/form-data


表单的创建

```jsp
<%--
  Created by IntelliJ IDEA.
  User: renboyu010214
  Date: 2021/3/12
  Time: 20:08
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>UPLOAD</title>
</head>
<body>

<form action="${pageContext.request.contextPath}/save" method="post" enctype="multipart/form-data">
    名称：<input type="text" name="name"><br>
    文件：<input type="file" name="file"><br>
    <input type="submit" value="提交">
</form>
</body>
</html>
```

## 文件上传的原理

- 注意，当form表单的enctype属性修改为multipart/form-data多部分表单时，原先的request.getParameter等方法均失效，因为原先返回的是url表单，属性值都被封装在url中，以键值对的形式存在，但现在返回的是多部分表单，url不被返回，同时数据的封装也不再是键值对，所以方法失效

可以看到返回的报文中分割了表单的信息与数据
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/returnData.png)


## 单文件上传

### 1. 导入upload与IO的坐标

```xml
        <dependency>
            <groupId>commons-fileupload</groupId>
            <artifactId>commons-fileupload</artifactId>
            <version>1.4</version>
        </dependency>

        <dependency>
            <groupId>commons-io</groupId>
            <artifactId>commons-io</artifactId>
            <version>2.6</version>
        </dependency>
```

### 2. 在spring-mvc.xml中配置文件上传解析器


```xml
    <!--配置文件上传解析器，注意ID不可修改为其他-->
    <bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
        <!--配置文件编码方式和最大上传大小-->
        <property name="defaultEncoding" value="utf-8"/>
        <property name="maxUploadSize" value="5242800"/>
    </bean>
```

### 3. 编写文件上传代码

```java
    /**
     * 保存上传的文件
     * @param name 获取到的名称
     * @param file 上传的文件，注意这里的参数名称必须和表单
     *             里定义的名称一致，否则无法正确获取文件
     */
    @RequestMapping("/save")
    @ResponseBody
    public void save(String name, MultipartFile file) throws IOException {
        System.out.println(name);
        //获得文件原始命名
        String originalName=file.getOriginalFilename();
        //保存文件
        file.transferTo(new File("C:\\upload\\"+originalName));
    }
```

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/uploadfile2.png)

## 多文件上传

只需要设置多个表单项和多个文件参数即可，注意文件参数命名与表单项命名一一匹配
```jsp
<%--
  Created by IntelliJ IDEA.
  User: renboyu010214
  Date: 2021/3/12
  Time: 20:08
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>UPLOAD</title>
</head>
<body>

<form action="${pageContext.request.contextPath}/save" method="post" enctype="multipart/form-data">
    名称：<input type="text" name="name"><br>
    文件1：<input type="file" name="file1"><br>
    文件2：<input type="file" name="file2"><br>
    <input type="submit" value="提交">
</form>
</body>
</html>
```

```java
    @RequestMapping("/save")
    @ResponseBody
    public void save(String name, MultipartFile file1,MultipartFile file2) throws IOException {
        System.out.println(name);
        //获得文件原始命名
        String originalName=file1.getOriginalFilename();
        //保存文件
        file1.transferTo(new File("C:\\upload\\"+originalName));
        //获得文件原始命名
        String originalName2=file2.getOriginalFilename();
        //保存文件
        file2.transferTo(new File("C:\\upload\\"+originalName2));
    }
```

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/uploadfile3.png)