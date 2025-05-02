---
author: Boyu Ren
pubDatetime: &id001 2021-09-04 06:56:14
modDatetime: *id001
title: 3-Vue网络应用
slug: 3-Vue网络应用
featured: false
draft: false
tags:
- Vue
description: axios是一款易用、简洁且高效的http库，是一个可以用在浏览器和Node.js中的
---

# Vue网络应用

## axios基本使用

axios是一款易用、简洁且高效的http库，是一个可以用在浏览器和Node.js中的
异步通信框架，其主要作用就是实现Ajax异步通信，由于Vue只关注视图层内容，所以作者推荐使用该框架完成
网络通信内容

### axios功能特点 
- 从浏览器中创建XMLHttpRequests
- 从node.js创建http请求
- 支持Promise API（在JS中进行链式编程）
- 拦截请求和相应
- 转换请求数据和响应数据
- 取消请求
- 自动转换JSON数据
- 客户端支持防御XSRF


## Vue实例的生命周期
每一个Vue实例都拥有完整的生命周期，即从开始船舰，初始化数据，编译模板，挂载DOM，渲染以及之后的不断更新渲染直到最后的卸载一系列过程，也就是一个Vue实例从创建到销毁的整个过程

在Vue实例的生命周期中，提供了一系列事件，可以让我们在事件触发时，注册相应的JS方法，利用我们注册的JS方法，更好的控制整个Vue实例（在这些事件响应方法中的this直接指向的是Vue实例），这些JS方法也被称为钩子，下面这幅图中展示了Vue的整个生命周期以及对应位置可以使用的钩子函数

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/lifecycle.png)


```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue Test</title>

    <!--解决标签闪烁问题-->
    <style>
        [v-clock]{
            display: none;
        }
    </style>
</head>
<body>
    <div id="vue" v-clock>
        <!--将获取到的值在页面进行展示-->
        <p>username: {{info.username}}</p>
        <p>user's url: {{info.url}}</p>
        <p>user's password: {{info.pwd}}</p>
        <p>result boolean: {{info.boolean}}</p>
        <p>user's school: {{info.sch}}</p>
    </div>
    
    

    <!--利用cdn导入axios与vue-->
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14"></script>


    <!--定义Vue实例-->
    <script>
        var app=new Vue({
            el: "#vue",
            data: {
            },
            //注意这里使用的是data(){}方法，用于获取返回值数据，
            //与上面定义的data数据域并不相同
            data(){
                return{
                    //请求的参数格式必须与数据格式一致才能正常获取
                    info:{
                        "username": null,
                        "url": null,
                        "pwd": null,
                        "boolean": null,
                        "sch": null,
                        "List": []
                    }
                }
            },
            mounted(){ //钩子函数 支持链式变成
                //通过axios进行网络操作，这里首先进行get操作请求相应数据，通过then方法获取相应结果，
                //利用response将响应值赋给Vue实例中的相应对象
                axios.get("test.json").then(response=>(this.info=response.data))
            }
        })
    </script>
</body>
</html>
```