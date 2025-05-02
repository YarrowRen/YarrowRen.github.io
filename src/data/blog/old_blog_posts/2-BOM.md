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
description: '------'
---

# BOM(Browser Object Model)
#### 浏览器对象模型

------

### 概念

将浏览器各个组成部分封装成对象


### 组成

- Window：窗口对象
- Navigator：浏览器对象
- Screen：显示器屏幕对象
- History：历史记录对象
- Location：地址栏对象

(DOM对象因为十分重要被单独分类)

#### BOM对象组成

![BOM对象概述](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/BOM%E5%AF%B9%E8%B1%A1%E6%A6%82%E8%BF%B0.jpg)


## Window对象

```js
/*
Window窗口对象

1. 创建

2. 方法
    1. 与弹出框相关的方法
        alert()	显示带有一段消息和一个确认按钮的警告框。
        confirm()	显示带有一段消息以及确认按钮和取消按钮的对话框。(确定返回true，取消返回false)
        prompt()	显示可提示用户输入的对话框。 返回值即用户输入的值
    2. 与打开关闭有关的方法
        close()	关闭浏览器窗口。关闭的窗口是调用该方法的窗口
        open()	打开一个新的浏览器窗口或查找一个已命名的窗口。返回值是打开的窗口对象
    3. 与定时器有关的方法
        setTimeout()	在指定的毫秒数后调用函数或计算表达式。
                        接收两个参数，第一个是JS代码或方法对象，第二个是毫秒值，返回值是该定时器ID
        clearTimeout()	取消由 setTimeout() 方法设置的 timeout。通过ID取消

        setInterval()	按照指定的周期（以毫秒计）来调用函数或计算表达式。
                        同样接收两个参数，第一个是是JS代码或方法对象，第二个是循环执行的时间间隔毫秒值，返回值是该定时器ID
        clearInterval()	取消由 setInterval() 设置的 timeout。通过ID取消
3. 属性
    获取其他BOM对象
        1. history
        2. location
        3. Navigator
        4. Screen
        可以用var h1=window.history,也可以直接省略window直接获取var h2=history;
    获取DOM对象
        document属性  获取方法window.document或者document
4. 特点
    window对象不需要创建，可以直接使用：window.方法名
    window引用也可以省略，即直接调用方法名即可 方法名()

*/

//获取按钮对象
var openBtn=document.getElementById("openBtn");
var closeBtn=document.getElementById("closeBtn");
//新窗口对象
var newWin;
//打开新窗口
openBtn.onclick=function(){
    newWin=open("https://www.baidu.com");  //打开并接收返回值
}
//关闭新打开的窗口
closeBtn.onclick=function(){
    newWin.close(); //关闭指定窗口
}
```

## Location地址栏对象

### Location对象的创建
- window.location
- location


### 主要方法
- reload() 重新加载当前文档，即刷新

### 主要属性
- href 设置或返回完整的URL