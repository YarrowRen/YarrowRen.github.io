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
description: '- html():获取/设置元素标签体中的内容'
---

# jQuery中的DOM操作

## 内容操作
- html():获取/设置元素标签体中的内容
- text():获取/设置元素标签体中的纯文本内容
- val():获取/设置元素value属性值内容

## 属性操作

#### 1. 通用属性操作
- attr():获取/设置元素属性，一般操作自定义属性
- removeAttr():删除元素属性
- prop():获取/设置元素属性，一般操作固有属性
- removeProp():删除元素属性

#### 2. 对class属性操作
- addClass():添加class属性值
- removeClass():删除class属性值
- taggleClass():切换class属性

## CRUD操作

1. append():父元素将子元素追加到末尾
    * 对象1.append(对象2):将对象2添加到对象1元素内部，并且在末尾
2. prepend():父元素将子元秦追加到开头
    * 对象1.prepend(对象2):将对象2添加到对象1元素内部，并且在开头
3. appendTo():
    * 对象1.appendTo(对象2):将对象1添加到对象2内部，并且在未尾
4. prependTo():
    * 对象1.prependTo(对象2):将对象1添加到对象2内部，并且在开头
5. after():添加元秦到元素后边
    * 对象1.after(对象2):将对象2添加到对象1后边。对象1和对象2是兄弟关系
6. before():添加元素到元秦前边
    * 对象1. before(对象2):将对象2添加到对象1前边。对象1和对象2是兄弟关系
7. insertAfter()
    * 对象1.insertAfter(对象2):将对象2添加到对象1后边。对象1和对象2是兄弟关系
8. insertBefore()
    * 对象1.insertBefore(对象2)∶将对象2添加到对象1前边。对象1和对象2是兄弟关系
9. remove():移除元素
    * 对象.remove(:将对象删除掉
10. empty():清空元素的所有后代元秦。
    * 对象.empty():将对象的后代元素全部清空，但是保留当前对象以及其属性节点


# jQuery中的动画操作

### 标签默认的显示与隐藏

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>jQuery动画练习</title>
    <script src="js/jquery-3.5.1.min.js"></script>
    <script>
        /**
         * show,hide,taggle都可以接收三个参数
         * 第一个参数表示动画速度，可选slow,fast,normal也可输入毫秒数，可以省略
         * 第二个参数表示淡入/淡出方式，默认是swing，还有linear可选，可以省略
         * 第三个参数表示执行函数，函数会在动画时执行，每个元素执行一次
         */
        //利用hide函数隐藏元素
        function hideFunc() {
            $("#div1").hide("slow","swing",function () {
                alert("div1被隐藏...");
            })
        }
        //利用show方法显示元素
        function showFunc() {
            $("#div1").show("slow","swing");
        }
        //taggle函数会修改标签显示状态
        function changeFunc() {
            $("#div1").toggle("slow");
        }
    </script>
</head>
<body>

<input type="button" value="点击隐藏" id="b1" onclick="hideFunc()">
<input type="button" value="点击显示" id="b2" onclick="showFunc()">
<input type="button" value="切换状态" id="b3" onclick="changeFunc()">

<div id="div1">hello world!</div>

</body>
</html>
```

此外还有类似功能的slideDown,slideUp,slideTaggle表示滑动显示或隐藏

以及fadeIn,fadeOut,fadeTaggle表示淡入淡出

# jQuery中的遍历操作

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="js/jquery-3.5.1.min.js"></script>
</head>
<body>
<script>
    $(function () {
        //获取对象
        var cities=$("#city li");
        alert(cities);
        //JS遍历方式
        for(var i=0;i<cities.length;i++){
            var name=cities[i].innerHTML;
            alert(name);
        }
        //jQuery方式遍历
        //第一种方式
        cities.each(function (index,element) {
            //index表示索引值，element是每次遍历得到的元素对象
            //index,element可以省略不写，此时可以通过this获取对象，但不能获取索引值
            alert(index+":"+$(element).html());
        });
        //第二种方式
        $.each(cities,function () {
            alert($(this).html());
        });
        //第三种方式（jQuery3.0后才支持）
        for(city of cities){
            alert($(city).html());
        }

    })
</script>

<ul id="city">
    <li>北京</li>
    <li>上海</li>
    <li>广州</li>
    <li>深圳</li>
    <li>重庆</li>
</ul>

</body>
</html>
```

# jQuery事件绑定

### 标准绑定方式

```
jQuery对象.事件方法(回调函数)

//例如
button.onClick(function(){
})
```

### on绑定事件/off解除绑定

```
jQuery对象.on("事件名称",回调函数)

//例如
button.on("click",function(){
})
button.off("click")
```

### 事件切换 toggle

```
jQuery对象.toggle(func1,func2,...)
```

