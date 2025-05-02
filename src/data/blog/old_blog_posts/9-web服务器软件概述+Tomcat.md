---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:28:20
modDatetime: *id001
title: 9-web服务器软件概述+Tomcat
slug: 9-web服务器软件概述+Tomcat
featured: false
draft: false
tags:
- JavaWeb
description: 安装了服务器软件的计算机
---

# Web服务器软件

### 服务器概念
安装了服务器软件的计算机

### 服务器软件概念

接收用户请求，处理请求并做出响应

### Web服务器软件概念

服务器软件的一种，在web服务器软件中，可以部署web项目，让用户通过浏览器访问项目，又被称为web容器

### 常见的Java相关的web服务器软件
- webLogic:oracle公司的，大型JavaEE服务器，支持所有JavaEE规范，收费。
- webSphere:IBM公司，大型JavaEE服务器，支持所有JavaEE规范，收费。
- JBOSS:JBOSS公司，大型JavaEE服务器，支持所有JavaEE规范，收费。
- Tomcat:Apache基金组织的，中小型JavaEE服务器，仅支持少量的JavaEE规范（如：servlet/jsp）开源免费的


# Tomacat

1. 下载：https://tomcat.apache.org/
2. 安装：解压缩文件到本地即可
3. 卸载：删除解压文件夹
4. 启动：bin/startup.bat双击运行
5. 访问：浏览器输入http://localhost:8080 (本地访问方式，非本地将localhost替换为本机IP地址即可)
6. 关闭
    - 正常关闭：1. bin/shutdown.bat双击执行即可关闭2. ctrl+c也可正常关闭
    - 强制关闭：点击启动窗口的关闭键
7. 配置
    - 项目部署的三种方式：
        1. 直接将项目放在webapps目录下即可访问（通过/+相对路径），可以简化部署：将项目打包成一个war包，把war包放到webapps下，会自动解压缩，并且删除war文件，则项目也被自动删除
        2. 配置conf/server.xml文件（在<Host>标签体中添加`<Context docBase="项目路径" path="/虚拟目录"/>`例如`<Context docBase="D:\CodingProgram\Web_YWRBY\webProject1" path="/webPro1"/>`）
        3. 在conf/Catalina/localhost中创建任意名称的xml文件，载文件中编写`<Context docBase="项目路径" />`不需要填虚拟目录，虚拟目录就是这个xml文件的文件名（推荐使用这种方式，这种方式支持热部署，不需要来回重启Tomcat）


## Java动态项目目录结构

### 项目根目录
- WEB-INF目录
    - web.xml：web项目核心配置文件
    - classes目录：放置字节码文件的目录
    - lib目录：放置依赖jar包的目录
- 其他


### IDEA集成创建web项目

[视频讲解](https://www.bilibili.com/video/BV1uJ411k7wy?p=683)


#### 遇到的问题

1. 使用Idea部署项目后，访问路径为url:8080/项目名_war_exploded的解决方案
    - 在tomcat配置页的Deployment下，修改Application context为/，即可直接使用url:8080访问项目主页。