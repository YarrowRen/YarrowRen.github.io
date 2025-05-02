---
author: Boyu Ren
pubDatetime: &id001 2021-07-15 00:29:02
modDatetime: *id001
title: 1-Electron基础
slug: 1-Electron基础
featured: false
draft: false
tags:
- Electron
description: 1. NodeJS官网安装node js环境：http://nodejs.org/，安装后可以通过npm -v或node -v检查是否正常安装
---

# Electron基础

## 安装Electron
1. NodeJS官网安装node js环境：http://nodejs.org/，安装后可以通过npm -v或node -v检查是否正常安装
2. 创建新文件夹，在文件夹内首先初始nodejs环境：npm init
3. 创建Electron环境，在全局安装：`npm install -g electron`
4. 检测Electron是否安装成功，`electron -v`查看Electron版本号
5. 启动Electron服务，在对应文件夹下： `electron .`


## 完成一个HelloWorld页面
1. 首先创建html页面并编写相关内容
2. 创建main.js或index.js作为主进程控制文件，编写整个应用进程的启动逻辑
3. 初始化nodejs文件
4. 启动electron服务

### 测试界面
```html
<body>
    <h1>Hello World</h1>
</body>
```

### main.js主进程控制文件
```js
var electron =require('electron')

var app=electron.app //引用APP，负责整个应用程序控制，即主进程
var BrowserWindow=electron.BrowserWindow //窗口引用，负责对窗口的操作 
var mainWindow=null //声明要开启的主窗口

//编写应用启动状态下的逻辑
app.on('ready',()=>{
    //初始化主界面并设置长宽
    mainWindow=new BrowserWindow({width:700,height:300})
    //加载主界面视图文件
    mainWindow.loadFile("test.html")
    //编写关闭窗口时的逻辑
    mainWindow.on('closed' ,()=>{
        mainWindow=null //将主窗口置空，达到关闭效果
    })
})
```

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210715010329.png)

## Electron中的主进程与渲染进程

由于Electron基于Chromium架构，所以自然而然遵循其多进程架构，一个完整的Electron应用包含多个进程，这些进程被分为主进程与渲染进程

### 主进程

一个Electron应用有且仅有一个主进程，主进程的控制文件由Node.JS配置文件package.json中的main属性声明，一般为main.js或index.js，创建或销毁窗口等所有系统事件，都需要定义在主进程的控制文件中，统一由主进程管理。

### 渲染进程
一个Electron应用可以有多个渲染进程，没创建一个新页面就需要一个新的渲染进程。每个渲染进程都是独立的，任意一个渲染进程报错或崩溃都不会影响其他渲染进程运行

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/electronDemo08.png)

### 主进程和渲染进程的区别
- 主进程通过BrowserWindow创建页面
- 每个BrowserWindow实例都在自己的渲染进程中运行, 当BrowserWindow实例被销毁后, 相应的渲染进程也会被终止

### Electron运行流程
1. 读取package.json的中的入口文件,即main.js
2. main.js在主进程中创建渲染进程
3. 读取应用页面的布局和样式
4. 使用IPC在主进程执行任务并获取信息

### 主进程与渲染进程之间通信

主进程与渲染进程之间通过IPC进行通信

#### 主进程

```js
var electron = require('electron') 

var app = electron.app   

var BrowserWindow = electron.BrowserWindow;

var mainWindow = null ;
app.on('ready',()=>{
    mainWindow = new BrowserWindow({
        width:500,
        height:500,
        //开放nodejs，必须加入这两句 否则无法在渲染进程中正常加载fs
        webPreferences:{ nodeIntegration: true,
            contextIsolation: false}
    })

    mainWindow.loadFile('test.html')

    mainWindow.on('closed',()=>{
        mainWindow = null
    })

})
```

#### 渲染进程

```js
var fs = require('fs');  //加载fs
window.onload = function(){
    //获取按钮和div控件
    var btn = this.document.querySelector('#btn')
    var content = this.document.querySelector('#content')
    //设置按钮点击事件
    btn.onclick = function(){
        //读取文件并写入渲染进程数据中
        fs.readFile('test.txt',(err,data)=>{
            content.innerHTML = data
        })
    }
} 
```

#### 测试页面

```html
<body>
    <Button id="btn">点击查看文件内容</Button><br/>
    <div  id="content"></div>
</body>
```

最终展示效果

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210715191459.png)