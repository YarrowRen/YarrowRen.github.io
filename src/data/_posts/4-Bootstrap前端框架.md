---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:22:37
modDatetime: *id001
title: 4-Bootstrap前端框架
slug: 4-Bootstrap前端框架
featured: false
draft: false
tags:
- JavaScript
description: '> Bootstrap是美国Twitter公司的设计师Mark Otto和Jacob Thornton合作基于HTML、CSS、JavaScript
  开发的简洁、直观、强悍的前端开发框架，使得 Web 开发更加快捷。Bootstrap提供了优雅的HTML和CSS规范，它即是由动态CSS语言Less写成。Bootstrap一经推出后颇受欢迎，一直是GitHub上的热门开源项目，包括NASA的MSNBC（微软全国广播公司）的Breaking
  News都使用了该项目。国内一些移动开发者较为熟悉的框架，如WeX5前端开源框架等，也是基于Bootstrap源码进行性能优化而来。'
---

> Bootstrap是美国Twitter公司的设计师Mark Otto和Jacob Thornton合作基于HTML、CSS、JavaScript 开发的简洁、直观、强悍的前端开发框架，使得 Web 开发更加快捷。Bootstrap提供了优雅的HTML和CSS规范，它即是由动态CSS语言Less写成。Bootstrap一经推出后颇受欢迎，一直是GitHub上的热门开源项目，包括NASA的MSNBC（微软全国广播公司）的Breaking News都使用了该项目。国内一些移动开发者较为熟悉的框架，如WeX5前端开源框架等，也是基于Bootstrap源码进行性能优化而来。


### 优点
- 定义了很多CSS样式和JS插件，使得开发人员不需要经过太多设置便可以得到一个丰富的页面效果
- 采用响应式布局，可以自动适配不同分辨率大小的设备


## 标准Bootstrap页面模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- 上述3个meta标签*必须*放在最前面，任何其他内容都*必须*跟随其后！ -->
    <title>Bootstrap 101 Template</title>

    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <!-- jQuery (Bootstrap 的所有 JavaScript 插件都依赖 jQuery，所以必须放在前边) -->
    <script src="js/jquery-3.1.1.min.js"></script>
    <!-- 加载 Bootstrap 的所有 JavaScript 插件。你也可以根据需要只加载单个插件。 -->
    <script src="js/bootstrap.min.js"></script>
  </head>
  <body>
    <h1>你好，世界！</h1>

  </body>
</html>
```


## 响应式布局-栅格系统

同一套页面可以兼容不同分辨率的设备，Bootstrap的响应式布局依赖于栅格系统实现，将一行分为12各格子，通过指定控件在不同分辨率设备上所占各自的数目实现兼容

### 步骤
1. 定义容器（类似于table的概念）
    - 容器分为：1. container （固定宽度，两边有留白）2. container-fluid （100% 宽度）
2. 定义行（类似于table中的tr）样式：row
3. 定义元素 指定元素在不同设备上所占格子的数量。样式：col-设备代号-各自数目

#### 设备代号

![设备代号](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/%E8%AE%BE%E5%A4%87%E4%BB%A3%E5%8F%B7.jpg)

### 注意
- 一行中格子数目超出12个格子后多余部分自动换行
- 栅格类属性可以向上兼容。栅格类适用于与屏幕宽度大于或等于分界点大小的设备 ， 并且针对小屏幕设备覆盖栅格类。（例如，如果设定了col-xs-4则在小屏幕手机上占四个栅格，同时在大屏幕设备上也能保证占据四个格子）
- 栅格类属性不可以向下兼容，如果真实设备分辨率小于预设值则一个元素会占满整行（例如，设定col-lg-4则设备在大屏幕上一个元素占四个栅格，但在小于临界值的所有设备上都单独占据一行）


### 栅格系统示例
```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap 101 Template</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <script src="js/jquery-3.1.1.min.js"></script>
    <script src="js/bootstrap.min.js"></script>

    <style>
        .inner{
            border: 1px solid red;
        }
    </style>
  </head>
  <body>
    <!--定义容器-->
    <div class="container-fluid">
        <!--定义行-->
        <div class="row">
            <!--定义元素-->
            <div class="col-lg-1 col-sm-2 inner">栅格</div>
            <div class="col-lg-1 col-sm-2 inner">栅格</div>
            <div class="col-lg-1 col-sm-2 inner">栅格</div>
            <div class="col-lg-1 col-sm-2 inner">栅格</div>
            <div class="col-lg-1 col-sm-2 inner">栅格</div>
            <div class="col-lg-1 col-sm-2 inner">栅格</div>
            <div class="col-lg-1 col-sm-2 inner">栅格</div>
            <div class="col-lg-1 col-sm-2 inner">栅格</div>
            <div class="col-lg-1 col-sm-2 inner">栅格</div>
            <div class="col-lg-1 col-sm-2 inner">栅格</div>
            <div class="col-lg-1 col-sm-2 inner">栅格</div>
            <div class="col-lg-1 col-sm-2 inner">栅格</div>
        </div>
        
    </div>

  </body>
</html>
```

## Bootstrap中定义的CSS样式和JS插件

### 全局CSS样式

- 按钮样式：class="btn btn-default" ，还有诸多其他预设类型[详见此页](https://v3.bootcss.com/css/?#buttons)
- 图片样式：class="img-responsive"，响应式图片布局，图片会随着设备分辨率变化自动调整大小以适应当前设备。[更多详见，方形，圆形，相框型等](https://v3.bootcss.com/css/?#images)
- 表格：class="table"，还有许多预设如条纹状表格，悬停变色等等。[详见](https://v3.bootcss.com/css/?#tables)
- 表单：class="form-control"。[更多表单](https://v3.bootcss.com/css/?#forms)


### 组件

- [导航条](https://v3.bootcss.com/components/?#navbar)
- [分页条](https://v3.bootcss.com/components/?#pagination)

### JS插件
- [轮播图](https://v3.bootcss.com/javascript/#carousel)