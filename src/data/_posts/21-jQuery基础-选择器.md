---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:39:56
modDatetime: *id001
title: 21-jQuery基础+选择器
slug: 21-jQuery基础-选择器
featured: false
draft: false
tags:
- JavaWeb
description: jQuery是开源软件，使用MIT许可证授权。 jQuery的语法设计使得许多操作变得容易，如操作文档对象（document）、选择文档对象模型（DOM）元素、创建动画效果、处理事件、以及开发Ajax程序。jQuery也提供了给开发人员在其上创建插件的能力。这使开发人员可以对底层交互与动画、高级效果和高级主题化的组件进行抽象化。模块化的方式使jQuery函数库能够创建功能强大的动态网页以及网络应用程序。
---

# jQuery框架
jQuery是开源软件，使用MIT许可证授权。 jQuery的语法设计使得许多操作变得容易，如操作文档对象（document）、选择文档对象模型（DOM）元素、创建动画效果、处理事件、以及开发Ajax程序。jQuery也提供了给开发人员在其上创建插件的能力。这使开发人员可以对底层交互与动画、高级效果和高级主题化的组件进行抽象化。模块化的方式使jQuery函数库能够创建功能强大的动态网页以及网络应用程序。


#### 简单演示

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="js/jquery-3.5.1.min.js"></script>
</head>
<body>
<div id="div1">div1...</div>
<div id="div2">div2...</div>
<script>
    //通过JS的方式获取所有div标签
    var divs=document.getElementsByTagName("div");
    //遍历标签集合，修改标签内容
    for(var i=0;i<divs.length;i++){
        divs[i].innerHTML="hello div!";
    }
    //通过Jquery方式获取所有div标签
    var $divs=$("div");
    //通过Jquery方式遍历标签集合并修改内容
    $divs.html("hi div!");
</script>
</body>
</html>
```

#### JS与Jquery对象之间的转化
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="js/jquery-3.5.1.min.js"></script>
</head>
<body>
<div id="div1">div1...</div>
<div id="div2">div2...</div>
<script>
    //通过JS的方式获取所有div标签
    var divs=document.getElementsByTagName("div");
    //通过Jquery方式获取所有div标签
    var $divs=$("div");

    //JS对象转化为Jquery对象,直接在变量名前加$()即可
    $(divs)
    //Jquery对象转化为JS对象，可以利用索引值，也可以利用get方法
    var div1=$divs.get(0);
    var div2=$divs[1];
</script>
</body>
</html>
```

## Jquery选择器

用于筛选具有相似特征的元素

### 基本语法

#### 1. 事件绑定

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>事件绑定</title>
    <script src="js/jquery-3.5.1.min.js"></script>
</head>
<body>
<input type="button" value="click" id="b1">

<script>
    //获取按钮
    $("#b1").click(function () {
        alert("hello");
    })
</script>
</body>
</html>
```

#### 2. 入口函数

入口函数即指首先加载的内容
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>事件绑定</title>
    <script src="js/jquery-3.5.1.min.js"></script>
</head>
<body>
<script>
    //入口函数，始终先于其他内容执行
    $(function () {
        alert("执行页面加载前的准备工作")
    })
</script>

<input type="button" value="click" id="b1">


</body>
</html>
```

#### 3. CSS样式控制
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>事件绑定</title>
    <script src="js/jquery-3.5.1.min.js"></script>
</head>
<body>
<script>
    $(function () {
        //进行CSS样式控制
        $("#div1").css("background-color","red");
    })
</script>

<div id="div1">hello world</div>


</body>
</html>
```

### 基本选择器
 
- 标签选择器（元素选择器）：获得所有匹配标签名称的选择器
    - $("HTML标签名")
- ID选择器：获得所有与指定ID值匹配的元素
    - $("#ID的属性值")
- 类选择器：获得所有与指定类(class)相同的元素
    - $(".class")  
- 并集选择器：获得多个选择器所选中的元素
    - $("选择器1,选择器2,...")


### 层级选择器
- 后代选择器：会选择A标签下所有与B标签相一致的元素（包括子辈与孙辈等等）
    - $("A B")
- 子选择器：会选择A标签下所有与B标签相一致的子辈元素（不包括子辈以外的元素）
    - $("A > B")

### 属性选择器 
- 属性名称选择器：只要包含指定属性名称都会被选择(A是标签名称)
    - $("A[属性名]")  
- 属性选择器：选择所有包含对应属性，且属性值与规定相同的元素
    - $("A[属性名='属性值']")
- 复合属性选择器：包含多个属性选择器
    - $("A[属性名1='属性值1'][属性名2='属性值2']...")


### 过滤选择器
- 首元素选择器：获得选择元素中的第一个元素
    - $("选择器:first")
    - 例如：$("div:first") $("#id:first")
- 尾元素选择器：获得选择元素中的最后一个元素
    - $("选择器:last")
    - 例如：$("div:last") $("#id:last")
- 非元素选择器：不包括指定内容的元素
    - $("选择器:not(selector)")
- 偶数选择器，奇数选择器（从0开始计数）
    - $("选择器:even")  $("选择器:odd")
- 等于索引选择器：指定索引元素
    - $("选择器:eq(index)")
- 大于索引选择器：所有大于指定索引的元素
    - $("选择器:gt(index)")
- 小于索引选择器：所有小于指定索引的元素
    - $("选择器:lt(index)")
- 标题选择器：获得标题元素，固定写法
    - $("选择器:header")


### 表单过滤选择器
- 可用元素选择器：获得所有可用元素
    - $("选择器:enabled")
- 不可用元素选择器：获得所有不可用元素
    - $("选择器:disabled")
- 选中选择器：获得单选/复选框所有选中的元素
    - $("选择器:checked")
- 选中选择器：获得下拉列表框中选中元素
    - $("选择器:selected")


