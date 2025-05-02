---
author: Boyu Ren
pubDatetime: &id001 2021-04-07 08:39:56
modDatetime: *id001
title: 4-Dockerfile And Docker Compose
slug: 4-Dockerfile
featured: false
draft: false
tags:
- Docker
description: Linux文件系统由bootfs与rootfs两部分构成
---

# Dockerfile


## Docker镜像原理
Linux文件系统由bootfs与rootfs两部分构成

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/Linuxfilesystem.png)

- bootfs：包含bootloader（引导加载程序）和kernel（内核）
- rootfs：root文件系统，包含的就是典型的Linux系统中的/dev,/proc,/bin,/etc等标准文件与目录
- 不同的Linux发行版bootfs基本相同，主要区别在于rootfs

而Docker镜像是由特殊的文件系统叠加而成，其最底端同样依赖bootfs，但是其不需要自己独立拥有bootfs，其可以直接使用宿主机的bootfs。
第二层是root文件系统rootfs，被称为base image即基础镜像。

在其上可以继续叠加其他镜像，而各个镜像之间的文件目录资源等可以相互共享，进一步提高了镜像利用率
- 统一文件系统（UFS：Union File System）：该技术能够将不同层镜像整合为一个文件系统，为这些层提供一个统一的对外视角，这样就隐藏了多层存在，从用户角度来看，只暴露了最外层文件系统
- 一个镜像可以位于另一个镜像下层，位于下层的镜像被称为父镜像，最底部的镜像称为基础镜像
- 当从一个镜像启动容器时，Docker会在最顶层加载一个读写文件系统作为容器，开发人员可以利用这个容器对镜像进行个性化修改，这些修改可以更适应生产环境，并且避免了对原镜像的影响，使得原镜像功能不受影响

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/docker%E9%95%9C%E5%83%8F%E5%8E%9F%E7%90%86.png)

## 容器转换为镜像
镜像的制作有两种方式，一种是直接利用容器转换为镜像，另一种是通过Dockerfile构建镜像，直接利用容器转换的步骤如下：
```bash
# 将容器转换为镜像
docker commit 容器ID 镜像名称:版本号
# 将镜像作为压缩文件输出
docker save -o 压缩文件名称 镜像名称:版本号
# 将压缩文件读取为镜像
docker load -i 压缩文件名称


# 示例：
docker commit bcd554d24cc5 ywrby_tomcat:1.0
docker save -o ywrby_tomcat.tar ywrby_tomcat:1.0
docker load -i ywrby_tomcat.tar
```

需要注意的是，这种形式的镜像制作只能保存容器根目录下的内容，通过数据卷挂载到容器的数据不能被保存到镜像中


## Dockerfile概述
Dockerfile 是一个用来构建镜像的文本文件，文本内容包含了一条条构建镜像所需的指令和说明。

其可以为开发团队提供完全一致的开发环境，方便测试与运维人员

### Dockerfile关键字
关键字	|作用|	备注
---|---|---
FROM	|指定父镜像	|指定dockerfile基于那个image构建
MAINTAINER|	作者信息	|用来标明这个dockerfile谁写的
LABEL	|标签	|用来标明dockerfile的标签 可以使用Label代替Maintainer 最终都是在docker image基本信息中可以查看
RUN|	执行命令	|执行一段命令 默认是/bin/sh 格式: RUN command 或者 RUN [“command” , “param1”,“param2”]
CMD	|容器启动命令	|提供启动容器时候的默认命令 和ENTRYPOINT配合使用.格式 CMD command param1 param2 或者 CMD [“command” , “param1”,“param2”]
ENTRYPOINT	|入口	|一般在制作一些执行就关闭的容器中会使用
COPY	|复制文件|	build的时候复制文件到image中
ADD	|添加文件|	build的时候添加文件到image中 不仅仅局限于当前build上下文 可以来源于远程服务
ENV|	环境变量|	指定build时候的环境变量 可以在启动的容器的时候 通过-e覆盖 格式ENV name=value
ARG	|构建参数	|构建参数 只在构建的时候使用的参数 如果有ENV 那么ENV的相同名字的值始终覆盖arg的参数
VOLUME|	定义外部可以挂载的数据卷|	指定build的image那些目录可以启动的时候挂载到文件系统中 启动容器的时候使用 -v 绑定 格式 VOLUME [“目录”]
EXPOSE|	暴露端口|	定义容器运行的时候监听的端口 启动容器的使用-p来绑定暴露端口 格式: EXPOSE 8080 或者 EXPOSE 8080/udp
WORKDIR	|工作目录	|指定容器内部的工作目录 如果没有创建则自动创建 如果指定/ 使用的是绝对地址 如果不是/开头那么是在上一条workdir的路径的相对路径
USER	|指定执行用户|	指定build或者启动的时候 用户 在RUN CMD ENTRYPONT执行的时候的用户
HEALTHCHECK	|健康检查	|指定监测当前容器的健康监测的命令 基本上没用 因为很多时候 应用本身有健康监测机制
ONBUILD	|触发器|	当存在ONBUILD关键字的镜像作为基础镜像的时候 当执行FROM完成之后 会执行 ONBUILD的命令 但是不影响当前镜像 用处也不怎么大
STOPSIGNAL	|发送信号量到宿主机|	该STOPSIGNAL指令设置将发送到容器的系统调用信号以退出。
SHELL	|指定执行脚本的shell	|指定RUN CMD ENTRYPOINT 执行命令的时候 使用的shell


## Dockerfile使用案例

### 案例一：自定义centos7镜像
官方所提供的centos7镜像，默认在创建启动容器后进入根目录下，并且没有vim编辑器，现在通过Dockerfile实现一个镜像，使利用该镜像创建centos7容器时自动进入/usr路径下，并且默认安装vim编辑器

#### 1. 编辑Dockerfile文件（centos_dockerfile）
```bash
# 定义父镜像
FROM centos:7 
# 定义镜像作者信息
MAINTAINER ywrby<ywrby0214@gmail.com>
# 执行安装vim命令
RUN yum install -y vim 
# 定义默认的工作目录
WORKDIR /usr 
# 定义容器的启动方式
CMD /bin/bash 
```

#### 2. 执行dockerfile文件，创建镜像

```bash
# -f参数表示dockerfile文件路径，-t参数表示镜像文件名称与版本，最后的.表示默认安装路径
docker build -f ./centos_dockerfile -t ywrby_centos:1 .
# 运行后docker会逐行执行相关命令
```

#### 3. 查看当前镜像文件并创建容器测试
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/thauihufiha.png)

# Docker Compose

## 服务编排概念

微服务架构的应用系统中，一般包含若干个微服务，每个微服务一般都会部署多个实例，如果每个微服务都需要手动启动停止，维护的工作量是巨大的

服务编排就是为了解决这种矛盾，服务编排是按照一定业务规则编排管理容器

Docker Compose是一个编排多容器分布式部署的工具，提供命令集管理容器化应用完整的开发周期，包括服务的构建，启动和停止

## Docker Compose使用步骤
1. 利用Dockerfile定义运行环境镜像
2. 使用docker-compose.yml定义组成应用的各服务
3. 运行docker compose up命令启动应用


## 安装Docker Compose
```bash 
# 1. 从 Github 上下载它的二进制包来使用
curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 2. 将可执行权限应用于二进制文件
chmod +x /usr/local/bin/docker-compose

# 3. 创建软链
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# 测试是否安装成功
docker-compose --version
```

## 卸载Docker Compose
```bash
rm /usr/local/bin/docker-compose
```

## 使用Docker Compose
```bash
# 创建目录
mkdir ~/docker-compose
cd ~/docker-compose
# 编写docker compose文件
vim docker-compose.yml

version: '3'
services:
    c_nginx:
        image: nginx
        ports:
            - 80:80
        links:
            - c_tomcat
        volumes:
            - ./nginx/conf.d:/etc/nginx/conf.d
    c_tomcat:
        image: tomcat
        expose:
            - "8080"

# 在docker compose目录下，使用docker-compose启动容器
docker compose up
```

