---
author: Boyu Ren
pubDatetime: &id001 2021-04-06 12:47:56
modDatetime: *id001
title: 1-Docker概述
slug: 1-Docker概述
featured: false
draft: false
tags:
- Docker
description: '> Docker 是一个开放源代码软件，是一个开放平台，用于开发应用、交付（shipping）应用、运行应用。 Docker允许用户将基础设施（Infrastructure）中的应用单独分割出来，形成更小的颗粒（容器），从而提高交付软件的速度。'
---

# Docker概述

> Docker 是一个开放源代码软件，是一个开放平台，用于开发应用、交付（shipping）应用、运行应用。 Docker允许用户将基础设施（Infrastructure）中的应用单独分割出来，形成更小的颗粒（容器），从而提高交付软件的速度。


> Docker容器与虚拟机类似，但二者在原理上不同。容器是将操作系统层虚拟化，虚拟机则是虚拟化硬件，因此容器更具有便携性、高效地利用服务器。 容器更多的用于表示 软件的一个标准化单元。由于容器的标准化，因此它可以无视基础设施（Infrastructure）的差异，部署到任何一个地方。另外，Docker也为容器提供更强的业界的隔离兼容。


## Docker安装步骤
（centos）
```Bash
# 1. 更新所有yum包到最新
yum update
# 2. 安装所需软件包，yum-utils提供yum-config-manager功能另两个是devicemapper驱动所依赖的
yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2
# 3. 设置yum源（这里使用的国内的阿里云）
yum-config-manager \
    --add-repo \
    http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
# 4. 安装docker， -y表示出现询问确认的界面都输入y
yum install -y docker-ce
# 5. 查看docker版本，验证是否安装成功
docker -v
```

## Docker架构
![](https://www.runoob.com/wp-content/uploads/2016/04/576507-docker1.png)
上图中的daemon表示守护进程

### Docker中的三个基本概念
- 镜像（Image）：Docker 镜像（Image），就相当于是一个 root 文件系统。比如官方镜像 ubuntu:16.04 就包含了完整的一套 Ubuntu16.04 最小系统的 root 文件系统。
- 容器（Container）：镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的类和实例一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。
- 仓库（Repository）：仓库可看成一个代码控制中心，用来保存镜像

Docker 使用客户端-服务器 (C/S) 架构模式，使用远程API来管理和创建Docker容器。

Docker 容器通过 Docker 镜像来创建。

## Docker服务相关命令(与守护进程相关的)
Docker Daemon是Docker的守护进程，Docker Client通过命令行与Docker Damon通信，完成Docker相关操作

```Bash
# 1. 启动Docker服务
systemctl start docker
# 2. 查看Docker启动状态
systemctl status docker
# 3. 停止Docker服务
systemctl stop docker
# 4. 重启Docker服务
systemctl restart docker
# 5. 开机启动Docker服务
systemctl enable docker
```


## Docker镜像相关命令

```Bash
# 1. 查看镜像：查看本地所有镜像
docker images
# 查看所有镜像的ID
docker images -q
# 2. 搜索镜像，从网络中查找所需要的镜像
docker search 镜像名称
# 例如：
docker search mysql
# 3. 拉取镜像：从Docker仓库拉取镜像到本地，镜像名称的格式为 镜像:版本号，如果不指定版本号，则默认安装最新版本
docker pull 镜像名称
# 例如：
docker pull mysql
docker pull mysql:5.0.0
# 4. 删除镜像
docker rmi 镜像ID或镜像名与版本号
# 例如：
docker rmi mysql:5.0.0
docker rmi e646c6533b0b
docker rmi `docker images -q` # 删除所有镜像
```

## Docker容器相关命令

```Bash
# 查看容器
docker ps # 查看所有运行中的容器
docker ps -a # 查看所有历史容器
# 创建并启动容器
docker run 参数
# 参数；
-i # 保持容器运行，常与-t一起使用（一起使用可省略为-it），使用-it后容器创建后自动进入容器，推出容器后自动销毁
-t # 为容器分配一个伪输入终端
-d # 以守护（后台）模式运行容器，创建一个容器后容器在后台运行，需要使用docker exec命令进入，推出后容器不会销毁

# -it创建的容器一般称为交互式容器，-id创建的容器一般称为守护式容器 
--name # 为创建的容器取名
# 示例
docker run -it --name test1 mysql:latest /bin/bash
docker run -id --name test2 mysql:latest /bin/bash
# 进入容器
# -it会自动进入，-id进入容器示例：(这里的-it是为了分配一个伪终端)
docker exec -it test2 /bin/bash
# 退出容器
exit
```

```bash
# 启动容器
docker start 容器名
# 停止容器
docker stop 容器名
# 删除容器
docker rm 容器名
# 查看容器信息
docker inspect 容器名
```

