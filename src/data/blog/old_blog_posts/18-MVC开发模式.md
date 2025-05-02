---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:34:18
modDatetime: *id001
title: 18-MVC开发模式
slug: 18-MVC开发模式
featured: false
draft: false
tags:
- JavaWeb
description: 经典MVC（Model View Controller）模式中，M是指业务模型，V是指用户界面，C则是控制器，使用MVC的目的是将M和V的实现代码分离，从而使同一个程序可以使用不同的表现形式。其中，View的定义比较清晰，就是用户界面。
---

# MVC开发模式

### 概念
经典MVC（Model View Controller）模式中，M是指业务模型，V是指用户界面，C则是控制器，使用MVC的目的是将M和V的实现代码分离，从而使同一个程序可以使用不同的表现形式。其中，View的定义比较清晰，就是用户界面。

### M（Model）
模型，主要通过JavaBean实现。完成具体的业务操作（例如数据库的增删改查，对象的封装）

### V（View）
视图，主要通过JSP实现。用于展示数据
### C（Controller）
控制器，主要通过Servlet实现。用于获取用户输入，调用模型，以及将数据交给视图进行展示

### MVC优点
- 耦合性低，方便维护，利于分工协作
- 代码重用性高

### MVC缺点
- 项目架构复杂，对操作人员要求提高