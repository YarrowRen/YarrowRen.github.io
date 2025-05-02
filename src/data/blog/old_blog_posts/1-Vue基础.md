---
author: Boyu Ren
pubDatetime: &id001 2021-09-03 14:24:30
modDatetime: *id001
title: 1-Vue基础
slug: 1-Vue基础
featured: false
draft: false
tags:
- Vue
description: '> Vue.js是一套构建用户界面的渐进式框架。Vue只关注视图层，采用自底向上增量开发的设计。Vue的目标是通过尽可能简单的API实现响应的数据绑定和组合的视图组件。'
---

# Vue基础

> Vue.js是一套构建用户界面的渐进式框架。Vue只关注视图层，采用自底向上增量开发的设计。Vue的目标是通过尽可能简单的API实现响应的数据绑定和组合的视图组件。

## 基本使用

1. 导入开发版本/生产版本的Vue.js
2. 创建Vue实例对象，设置其el属性和data属性
3. 使用模板语法将数据渲染到页面上

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue Test</title>
</head>
<body>
    <!-- 创建Vue实例对象，设置其el属性和data属性 -->
    <div id="app">
        {{message}}
    </div>

    <!-- 导入开发版本/生产版本的Vue.js -->
    <!-- 开发环境版本，包含了有帮助的命令行警告 -->
    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>

    <!-- 使用模板语法将数据渲染到页面上 -->
    <script>
        var app=new Vue({
            el:"#app",
            data:{
                message:"Hello Vue!"
            }
        })
    </script>
</body>
</html>
```

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210711181227.png)

## el挂载点
上边在定义Vue实例时，内部定义了el挂载点，挂载点的作用在于指明要应用到的标签，例如上面实例中利用ID选择器#app指定应用于id为app的标签，同时我们需要关注Vue实例的作用范围，Vue会管理el选项所命中的元素及其内部的后代元素，例如：

```html
<body>
    BODY标签：{{message}}
    <!-- 创建Vue实例对象，设置其el属性和data属性 -->
    <div id="app">
        DIV标签：{{message}}

        <p>
            P标签：{{message}}
        </p>
    </div>

    <!-- 导入开发版本/生产版本的Vue.js -->
    <!-- 开发环境版本，包含了有帮助的命令行警告 -->
    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>

    <!-- 使用模板语法将数据渲染到页面上 -->
    <script>
        var app=new Vue({
            el:"#app",
            data:{
                message:"Hello Vue!"
            }
        })
    </script>
</body>
```

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210711181406.png)

从上面的实例可以看到，被成功选择的DIV标签及其内部的P标签成功获取message值，然而位于外部的Body标签并不能获取相关值

第二点需要关注的是el挂载点并不仅仅支持ID选择器，其同样支持CSS所满足的class等等选择器，即也可以按照下面方式定义挂载点
```html
<body>
    <!--定义class属性-->
    <div class="app">
        DIV标签：{{message}}
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>

    <!--使用class选择器，利用“.”-->
    <script>
        var app=new Vue({
            el:".app",
            data:{
                message:"Hello Vue!"
            }
        })
    </script>
</body>
```

el挂载点可以作用于绝大部分双标签，例如DIV标签，P标签，H1，H2标签等等，但其不能作用于单标签以及HTML和Body标签

## data数据对象
data数据对象不止能保存基本文本数据，同样可以保存复杂的对象数据以及数组等复杂数据结构

```html
<body>
    <div id="app">
        <!--获取普通文本数据-->
        {{message}}
        <!--获取对象类型数据-->
        <div>
            <p>
                用户名：{{user.username}}
                联系方式：{{user.wechat}}
            </p>
        </div>
        <!--获取数组类型数据-->
        <ul>
            <li>{{books[0]}}</li>
            <li>{{books[1]}}</li>
            <li>{{books[2]}}</li>
        </ul>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>

    <!--在data内部定义普通文本数据，对象数据类型，数组数据类型-->
    <script>
        var app=new Vue({
            el:"#app",
            data:{
                message:"Hello Vue!",
                user:{
                    username:"Ywrby",
                    wechat:"1873319XXXX"
                },
                books:["时间简史","计算机网络组成原理","比特币白皮书"]
            }
        })
    </script>
</body>
```

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210711190239.png)