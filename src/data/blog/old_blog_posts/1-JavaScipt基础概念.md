---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:22:34
modDatetime: *id001
title: 1-JavaScript 基础概念
slug: 1-JavaScript基础概念
featured: false
draft: false
tags:
- JavaScript
description: 探讨JavaScript的基础概念，包括其作为弱类型、基于原型的脚本语言的特性，基本语法及与HTML结合方式，数据类型，变量定义，运算符与类型转换规则，并详细介绍函数对象的创建方式及其特点。
---

# JavaScript 基础概念

## 一、JavaScript 概述

### 1. 什么是 JavaScript

JavaScript 是一门 **解释型、弱类型、基于原型的脚本语言**。

- **客户端语言**：主要运行在浏览器中，每个主流浏览器都内置了 JavaScript 解析引擎  
- **脚本语言**：无需编译，代码在运行时由引擎直接解析并执行  

随着技术发展，JavaScript 早已不局限于浏览器环境，在 Node.js 等运行时支持下，也可以用于服务端开发。

---

### 2. JavaScript 的主要功能

JavaScript 的核心作用是 **增强用户与 HTML 页面之间的交互**，典型用途包括：

- 控制和操作 HTML 元素（DOM）
- 响应用户行为（点击、输入、滚动等）
- 实现页面动态效果
- 提升整体用户体验  

> 这里的“动态”指的是页面行为的动态变化，与 JSP、PHP 等“动态资源”概念不同。

---

## 二、基本语法

## 1. JavaScript 与 HTML 的结合方式

JavaScript 通过 `<script>` 标签与 HTML 页面结合使用。

### 1.1 内部 JavaScript

直接在 HTML 文件中编写 JavaScript 代码：

```html
<script>
  alert("Hello World!");
</script>
````

---

### 1.2 外部 JavaScript

通过 `src` 属性引入外部 `.js` 文件：

```html
<script src="test.js"></script>
```

---

### 1.3 示例

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>

  <!-- 内部 JS -->
  <script>
    alert("Hello World!");
  </script>

  <!-- 外部 JS -->
  <script src="test.js"></script>
</head>
<body>
  <input type="text">
</body>
</html>

<!-- test.js 内容 -->
<!--
alert("外部 JS 文件");
-->
```

**说明：**

* `<script>` 标签可以放在 HTML 的任意位置
* JavaScript 的执行顺序与 `<script>` 标签在文档中的位置有关
* 可以定义多个 `<script>` 标签

---

## 2. 注释

JavaScript 的注释方式与 Java 完全一致：

* 单行注释：`// 注释内容`
* 多行注释：`/* 注释内容 */`

---

## 三、数据类型

### 1. 原始数据类型（基本数据类型）

* **number**
  包括整数、小数以及 `NaN`（Not a Number，表示非法数值）
* **string**
  字符串，可使用单引号或双引号表示
* **boolean**
  取值为 `true` 或 `false`
* **null**
  表示一个“空对象”的占位符
* **undefined**
  变量声明但未赋值时的默认值

---

### 2. 引用数据类型

* **Object（对象）**
  JavaScript 中几乎所有复杂结构（函数、数组、日期等）本质上都是对象

---

## 四、变量

### 1. 变量的概念

变量是用于存储数据的一块内存空间。

* **Java（强类型语言）**
  变量在声明时必须指定类型，且类型不可改变
* **JavaScript（弱类型语言）**
  变量声明时无需指定类型，运行过程中类型可以动态变化

---

### 2. 变量定义语法

```js
var 变量名 = 值;
```

可以使用 `typeof` 运算符查看变量类型：

```js
typeof 变量名;
```

---

### 3. 注意事项

* JavaScript 语句以分号 `;` 结尾（虽然可省略，但不推荐）
* 定义变量时建议始终使用 `var`（或现代写法 `let / const`）

  * 使用 `var`：变量具有作用域控制
  * 不使用关键字：变量会成为全局变量（不推荐，易引发问题）

---

## 五、运算符与类型转换

JavaScript 的运算符与 Java 基本一致，但 **存在隐式类型转换机制**。

### 常见类型转换规则

* `string → number`
  可转为数字则按字面值转换，否则为 `NaN`
* `boolean → number`
  `true → 1`，`false → 0`
* `number → boolean`
  `0` 和 `NaN` 为 `false`，其余为 `true`
* `string → boolean`
  空字符串为 `false`，其余为 `true`
* `null / undefined → boolean`
  均为 `false`
* `object → boolean`
  均为 `true`

---

### `==` 与 `===` 的区别

```js
/*
==  ：比较前会进行类型转换
=== ：不会进行类型转换，类型不同直接返回 false
*/

"123" == 123    // true
"123" === 123   // false
```

---

### 三元运算符

JavaScript 支持三元运算符：

```js
条件 ? 表达式1 : 表达式2;
```

---

## 六、流程控制语句

流程控制语句与 Java 基本一致：

* `if / else`
* `switch / case`
* `while`
* `for`
* `do...while`

---

## 七、对象

## 1. Function 函数对象

JavaScript 中，**函数本身也是对象**。

### 1.1 创建方式

```js
// 方式一：Function 构造器（不推荐）
var func = new Function("a", "b", "alert(a + b)");

// 方式二：函数声明
function func2(a, b) {
  alert(a - b);
}

// 方式三：函数表达式
var func3 = function(a, b) {
  alert(a * b);
};
```

---

### 1.2 特点

* 形参无需声明类型，返回值类型也可省略
* 同名函数后定义的会覆盖之前的定义
* 实参数量可多可少：

  * 少于形参：未匹配的参数为 `undefined`
  * 多于形参：多余参数可通过 `arguments` 访问
* 内置对象 `arguments` 封装了所有实参

---

### 1.3 示例：不定参数求和

```js
function sumAll() {
  var sum = 0;
  for (var i = 0; i < arguments.length; i++) {
    sum += arguments[i];
  }
  return sum;
}

alert(sumAll(1, 2, 3, 4, 5));
```

---

## 2. Array 数组对象

```js
// 创建方式
var arr1 = new Array(1, 2, 3);
var arr2 = new Array(5);      // 长度为 5
var arr3 = [6, 7, 8, 9];

// 常用方法
arr3.push(10);
arr3.join(",");
```

**特点：**

* 数组元素类型可不同
* 数组长度可动态变化

---

## 3. Date 日期对象

```js
var date = new Date();
date.toLocaleString(); // 本地时间字符串
date.getTime();        // 时间戳（毫秒）
```

---

## 4. Math 数学对象

```js
Math.PI;
Math.random();
Math.floor(4.5);
Math.round(4.9);
```

> `Math` 是内置对象，无需创建实例。

---

## 5. RegExp 正则表达式对象

![简单正则表达式](https://raw.githubusercontent.com/YarrowRen/FileBackup/refs/heads/master/blog_img/%E7%AE%80%E5%8D%95%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F.jpg)

```js
var reg = /^[abc]+$/;
reg.test("aaccbbb");   // true
reg.test("abcd123");   // false
```

---

## 6. Global 全局对象

全局对象中的方法可以直接调用：

* `encodeURI()` / `decodeURI()`
* `encodeURIComponent()` / `decodeURIComponent()`
* `parseInt()`：字符串转数字（逐字符解析）
* `isNaN()`：判断是否为 NaN
* `eval()`：将字符串当作 JavaScript 代码执行（不推荐使用，存在安全风险）

---

## 小结

本文系统介绍了 JavaScript 的基础知识，包括：

* 语言定位与核心用途
* 基本语法与类型系统
* 变量、运算符与流程控制
* 常见内置对象的使用方式

<!-- 2026.01.28由GPT5.2优化全文 -->