---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:22:35
modDatetime: *id001
title: 2-BOM
slug: 2-BOM
featured: false
draft: false
tags:
- JavaScript
description: 浏览器对象模型（BOM）的基本概念、组成结构以及 Window 和 Location 对象的常用属性与方法。
---

# BOM（Browser Object Model： 浏览器对象模型）

---

## 一、BOM 概念

**BOM（Browser Object Model，浏览器对象模型）** 是浏览器提供的一套 API，用于将浏览器的各个组成部分封装为对象，供 JavaScript 进行访问和控制。

与 DOM 不同：

- **BOM** 关注的是浏览器本身（窗口、地址栏、历史记录等）
- **DOM** 关注的是网页内容结构（HTML 文档）

由于 DOM 的重要性和复杂性，通常会被单独作为一个模块进行讲解。

---

## 二、BOM 的组成结构

BOM 主要由以下对象组成：

- **Window**：浏览器窗口对象（BOM 的核心）
- **Navigator**：浏览器信息对象
- **Screen**：屏幕对象
- **History**：历史记录对象
- **Location**：地址栏对象

> 其中，`Window` 是 BOM 的顶层对象，其余 BOM 对象都可以通过 `Window` 访问。

---

### BOM 对象结构示意图

![BOM对象概述](https://raw.githubusercontent.com/YarrowRen/FileBackup/refs/heads/master/blog_img/BOM%E5%AF%B9%E8%B1%A1%E6%A6%82%E8%BF%B0.jpg)

---

## 三、Window 对象

`Window` 对象表示一个浏览器窗口或标签页，是 **BOM 的核心对象**。

### 1. Window 对象的特点

- 不需要手动创建，浏览器会自动提供
- 可以直接使用 `window`
- `window` 引用可以省略

```js
window.alert("Hello");
alert("Hello"); // 等价写法
````

---

### 2. Window 对象的常用方法

#### （1）与弹出框相关的方法

* `alert()`
  显示带确认按钮的警告框
* `confirm()`
  显示确认 / 取消对话框

  * 点击确认：返回 `true`
  * 点击取消：返回 `false`
* `prompt()`
  显示输入对话框

  * 返回用户输入的内容（字符串）
  * 点击取消返回 `null`

---

#### （2）与窗口操作相关的方法

* `open()`
  打开一个新的浏览器窗口或标签页

  * 返回新窗口的 `window` 对象
* `close()`
  关闭当前窗口

  * 只能关闭由 `open()` 打开的窗口

---

#### （3）与定时器相关的方法

* `setTimeout(fn, time)`
  在指定毫秒后执行一次函数

  * 返回定时器 ID

* `clearTimeout(id)`
  取消 `setTimeout` 定时器

* `setInterval(fn, time)`
  按固定时间间隔重复执行函数

  * 返回定时器 ID

* `clearInterval(id)`
  取消 `setInterval` 定时器

---

### 3. Window 对象的常用属性

#### （1）获取其他 BOM 对象

```js
window.history;
window.location;
window.navigator;
window.screen;

// window 可省略
history;
location;
```

---

#### （2）获取 DOM 对象

* `window.document`
* `document`

```js
document.getElementById("id");
```

---

### 4. 示例：打开和关闭窗口

```js
// 获取按钮对象
var openBtn = document.getElementById("openBtn");
var closeBtn = document.getElementById("closeBtn");

// 保存新窗口对象
var newWin;

// 打开新窗口
openBtn.onclick = function () {
  newWin = open("https://www.baidu.com");
};

// 关闭新窗口
closeBtn.onclick = function () {
  if (newWin) {
    newWin.close();
  }
};
```

---

## 四、Location 地址栏对象

`Location` 对象用于 **获取或操作浏览器地址栏中的 URL 信息**。

---

### 1. Location 对象的获取方式

```js
window.location;
location; // 等价写法
```

---

### 2. 常用方法

* `reload()`
  重新加载当前页面（刷新）

```js
location.reload();
```

---

### 3. 常用属性

* `href`
  获取或设置完整的 URL

```js
// 获取当前地址
console.log(location.href);

// 跳转到新地址
location.href = "https://www.baidu.com";
```

---

## 五、小结

* BOM 用于操作浏览器本身，而非网页内容
* `Window` 是 BOM 的顶层对象
* 常用 BOM 对象包括：

  * `Window`
  * `Location`
  * `History`
  * `Navigator`
  * `Screen`

<!-- 2026.01.28由GPT5.2优化全文 -->