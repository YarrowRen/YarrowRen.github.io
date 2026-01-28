---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:39:57
modDatetime: *id001
title: 22-jQuery深入
slug: 22-jQuery深入
featured: false
draft: false
tags:
- JavaWeb
description: jQuery 在 DOM 操作、动画、遍历与事件处理方面提供了更加丰富且一致的 API
---

# jQuery 中的 DOM 操作

## 一、内容操作

- `html()`：获取 / 设置元素标签体中的 HTML 内容  
- `text()`：获取 / 设置元素中的纯文本内容  
- `val()`：获取 / 设置表单元素的 value 属性值  

---

## 二、属性操作

### 1. 通用属性操作

- `attr()`：获取 / 设置元素属性，常用于**自定义属性**
- `removeAttr()`：移除指定属性
- `prop()`：获取 / 设置元素的**固有属性**
- `removeProp()`：移除固有属性

### 2. class 属性操作

- `addClass()`：添加 class
- `removeClass()`：移除 class
- `toggleClass()`：切换 class（存在则移除，不存在则添加）

---

## 三、DOM 的 CRUD 操作

1. **append**
   - `父元素.append(子元素)`
   - 将子元素追加到父元素内部末尾

2. **prepend**
   - `父元素.prepend(子元素)`
   - 将子元素追加到父元素内部开头

3. **appendTo**
   - `子元素.appendTo(父元素)`
   - 功能等同于 append，语法方向相反

4. **prependTo**
   - `子元素.prependTo(父元素)`
   - 功能等同于 prepend

5. **after**
   - `元素.after(新元素)`
   - 在当前元素后插入兄弟元素

6. **before**
   - `元素.before(新元素)`
   - 在当前元素前插入兄弟元素

7. **insertAfter**
   - `新元素.insertAfter(目标元素)`

8. **insertBefore**
   - `新元素.insertBefore(目标元素)`

9. **remove**
   - `元素.remove()`
   - 删除元素本身及其子元素

10. **empty**
    - `元素.empty()`
    - 清空元素的所有子元素，但保留当前元素及其属性

---

# jQuery 中的动画操作

## 一、显示与隐藏

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>jQuery 动画</title>
    <script src="js/jquery-3.5.1.min.js"></script>
    <script>
        /*
         * show / hide / toggle 参数说明：
         * 1. 动画速度：slow | normal | fast | 毫秒
         * 2. 缓动方式：swing（默认）| linear
         * 3. 回调函数：动画完成后执行
         */
        function hideFunc() {
            $("#div1").hide("slow", "swing", function () {
                alert("div1 已隐藏");
            });
        }

        function showFunc() {
            $("#div1").show("slow");
        }

        function toggleFunc() {
            $("#div1").toggle("slow");
        }
    </script>
</head>
<body>

<input type="button" value="隐藏" onclick="hideFunc()">
<input type="button" value="显示" onclick="showFunc()">
<input type="button" value="切换" onclick="toggleFunc()">

<div id="div1">hello world</div>

</body>
</html>
````

### 其他常见动画方法

* `slideDown()` / `slideUp()` / `slideToggle()`：滑动显示与隐藏
* `fadeIn()` / `fadeOut()` / `fadeToggle()`：淡入淡出

---

# jQuery 中的遍历操作

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>遍历示例</title>
    <script src="js/jquery-3.5.1.min.js"></script>
</head>
<body>

<ul id="city">
    <li>北京</li>
    <li>上海</li>
    <li>广州</li>
    <li>深圳</li>
    <li>重庆</li>
</ul>

<script>
    $(function () {
        var cities = $("#city li");

        // JavaScript 方式
        for (var i = 0; i < cities.length; i++) {
            alert(cities[i].innerHTML);
        }

        // jQuery each（推荐）
        cities.each(function (index, element) {
            alert(index + " : " + $(element).html());
        });

        // 全局 each
        $.each(cities, function () {
            alert($(this).html());
        });

        // for...of（jQuery 3.x 支持）
        for (var city of cities) {
            alert($(city).html());
        }
    });
</script>

</body>
</html>
```

---

# jQuery 事件绑定

## 一、直接绑定

```js
$("#btn").click(function () {
    alert("clicked");
});
```

---

## 二、on / off 方式（推荐）

```js
$("#btn").on("click", function () {
    alert("clicked");
});

$("#btn").off("click");
```

---

## 三、事件切换（旧版本用法）

```js
$("#btn").toggle(
    function () { alert("第一次"); },
    function () { alert("第二次"); }
);
```

---

## 小结

* jQuery 提供了完整的 DOM 增删改查能力
* 动画 API 统一、参数清晰
* 遍历方式灵活，兼容 JS 与 jQuery 风格
* `on / off` 是事件绑定的主流写法

<!-- 2026.01.28由GPT5.2优化全文 -->