---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:39:56
modDatetime: *id001
title: "jQuery基础与选择器详解"
slug: "jquery-basics-and-selectors"
featured: false
draft: false
tags:
- JavaWeb
description: jQuery 是一个开源 JavaScript 框架，旨在简化 DOM 操作、事件处理、CSS 控制及 Ajax 请求，通过统一选择器机制实现高效开发。
---

# jQuery 基础

## jQuery 概述

jQuery 是一个开源的 JavaScript 框架，采用 MIT 许可证授权。  
其核心目标是 **简化 JavaScript 操作**，通过统一的 API 封装浏览器差异，使常见操作更加高效、直观。

jQuery 主要用于：
- DOM 元素的选择与操作
- 事件处理
- CSS 样式控制
- 动画效果
- Ajax 请求
- 插件扩展机制

---

## 基本示例

### JavaScript 与 jQuery 对比

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Demo</title>
    <script src="js/jquery-3.5.1.min.js"></script>
</head>
<body>

<div id="div1">div1...</div>
<div id="div2">div2...</div>

<script>
    // 原生 JavaScript
    var divs = document.getElementsByTagName("div");
    for (var i = 0; i < divs.length; i++) {
        divs[i].innerHTML = "hello div!";
    }

    // jQuery
    var $divs = $("div");
    $divs.html("hi div!");
</script>

</body>
</html>
````

---

## JavaScript 对象与 jQuery 对象转换

```html
<script>
    // JavaScript 对象
    var divs = document.getElementsByTagName("div");

    // jQuery 对象
    var $divs = $("div");

    // JS → jQuery
    $(divs);

    // jQuery → JS
    var div1 = $divs.get(0);
    var div2 = $divs[1];
</script>
```

---

# jQuery 选择器

jQuery 选择器用于快速定位和筛选 DOM 元素，是 jQuery 的核心能力之一。

---

## 基本用法

### 1. 事件绑定

```html
<input type="button" value="click" id="b1">

<script>
    $("#b1").click(function () {
        alert("hello");
    });
</script>
```

---

### 2. 入口函数

入口函数在 DOM 结构加载完成后立即执行。

```html
<script>
    $(function () {
        alert("DOM 加载完成");
    });
</script>
```

---

### 3. CSS 样式控制

```html
<div id="div1">hello world</div>

<script>
    $(function () {
        $("#div1").css("background-color", "red");
    });
</script>
```

---

## 基本选择器

* **标签选择器**

  * `$("标签名")`
* **ID 选择器**

  * `$("#id")`
* **类选择器**

  * `$(".class")`
* **并集选择器**

  * `$("选择器1, 选择器2, ...")`

---

## 层级选择器

* **后代选择器**

  * `$("A B")`
    选择 A 元素内部所有符合 B 的后代元素
* **子选择器**

  * `$("A > B")`
    仅选择 A 的直接子元素

---

## 属性选择器

* **包含指定属性**

  * `$("A[属性名]")`
* **属性值匹配**

  * `$("A[属性名='属性值']")`
* **复合属性选择器**

  * `$("A[属性1='值1'][属性2='值2']")`

---

## 过滤选择器

* **首元素**

  * `$("选择器:first")`
* **尾元素**

  * `$("选择器:last")`
* **排除元素**

  * `$("选择器:not(selector)")`
* **偶数 / 奇数（从 0 开始）**

  * `$("选择器:even")`
  * `$("选择器:odd")`
* **索引选择**

  * `$("选择器:eq(index)")`
* **大于索引**

  * `$("选择器:gt(index)")`
* **小于索引**

  * `$("选择器:lt(index)")`
* **标题元素**

  * `$("选择器:header")`

---

## 表单过滤选择器

* **可用元素**

  * `$("选择器:enabled")`
* **不可用元素**

  * `$("选择器:disabled")`
* **单选 / 复选框选中**

  * `$("选择器:checked")`
* **下拉列表选中项**

  * `$("选择器:selected")`

---

## 小结

* jQuery 通过统一的选择器机制大幅简化 DOM 操作
* 选择器支持多种匹配规则，表达能力强
* 事件绑定、样式控制与选择器高度集成
* 是早期 Java Web 前端开发中常用的核心工具之一
<!-- 2026.01.28由GPT5.2优化全文 -->