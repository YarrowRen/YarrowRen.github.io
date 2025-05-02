---
author: Boyu Ren
pubDatetime: &id001 2021-04-06 15:41:07
modDatetime: *id001
title: 2-Docker容器数据卷
slug: 2-Docker容器数据卷
featured: false
draft: false
tags:
- Docker
description: 实际开发中，数据的持久化以及数据交互都是十分重要的功能，所以Docker需要处理以下问题
---

# Docker容器数据卷

## 数据卷概述
实际开发中，数据的持久化以及数据交互都是十分重要的功能，所以Docker需要处理以下问题
- Docker容器删除后，容器中的应用数据是否被删除
- Docker容器与外部机器（宿主机与网络机器）间如何进行文件交互
- Docker容器之间如何进行文件的交换

面对以上问题，Docker提供了数据卷的概念，数据卷是宿主机中的一个目录或文件，当容器与数据卷目录绑定（挂载）后，双方对数据卷的修改会立即同步，数据卷与容器不是一一对应的关系，一个数据卷可以挂载多个容器，一个容器也可以被挂载多个数据卷

### 数据卷的作用
- 保证容器数据的持久化
- 实现容器与宿主机之间的文件交换
- 实现Docker容器之间的文件交换

## 配置数据卷
配置数据卷只需要在创建容器时利用-v参数指定宿主机路径与容器路径的挂载关系
```bash
# 创建容器时，使用-v参数设置数据卷
docker run -it --name test1 -v 宿主机目录(或文件):容器内目录(或文件) ...
# 例如：
docker run -it --name centosTest1 -v /root/data:/root/data_container centos:latest
```
- 目录必须是绝对路径(root可用~代替)
- 如果指定目录不存在，会自动创建
- 一个容器可以挂载多个数据卷，只需要指定多个-v参数即可

两个容器需要交换文件时，可以挂载到同一个数据卷下

## 数据卷容器

多个容器之间进行文件共享有多种方法，其中一种是将所有容器都挂载到一个数据卷上，但这样比较繁琐，并且不便于管理，除了这种方式还可以通过数据卷容器的方式进行多个文件之间的共享

方法就是创建一个容器，挂载到一个数据卷上，随后让其他容器继承自该容器，这个容器被称为数据卷容器

```bash
# 创建容器，挂载到一个数据卷上(这里只给了数据卷的路径，则容器路径会自动分配)
docker run -it --name c1 -v /volume centos:latest 
# 其他容器创建时挂载到该容器上，通过--volumes-from指定数据卷容器
docker run -it --name c2 --volumes-from c1 centos:latest
docker run -it --name c3 --volumes-from c1 centos:latest
```