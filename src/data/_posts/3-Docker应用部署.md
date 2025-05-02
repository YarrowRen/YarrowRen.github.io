---
author: Boyu Ren
pubDatetime: &id001 2021-04-06 19:18:53
modDatetime: *id001
title: 3-Docker应用部署
slug: 3-Docker应用部署
featured: false
draft: false
tags:
- Docker
description: 1. 搜索镜像
---

# Docker应用部署


## 一般部署步骤
1. 搜索镜像
2. 拉取镜像
3. 创建容器
4. 操作容器

## 部署MySQL

前文说到，Docker容器本身不能直接与外部机器通信，其只能与宿主机直接通信，而宿主机又可以直接与外部机器通信，所以想要访问Docker容器，就可以将Docker容器的端口映射到宿主机的端口上（一般都对应到相同端口），这样就可以利用宿主机的端口间接访问Docker容器，即**端口映射**

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/dockerwaibutongxin.png)


```bash
# 搜索镜像
docker search mysql
# 拉取镜像
docker pull mysql
# 创建容器,注意创建容器前，在根目录下创建mysql文件夹并进入该目录下，后续数据卷的安装在/root/mysql下进行
docker run -id \
-p 3306:3306 \ # 配置端口映射
--name c_mysql \
-v $PWD/conf:/etc/mysql/conf.d \ # 配置配置文件数据卷，$PWD表示当前所在文件夹路径
-v $PWD/logs:/logs \ # 配置日志数据卷
-v $PWD/data:/var/lib/mysql \ # 配置存放数据的数据卷
-e MYSQL_ROOT_PASSWORD=123456 \ # 配置ROOT用户密码（此处等号不可省）
mysql:latest # 指定容器镜像
```


创建完成后，Docker容器的3306端口已经映射到宿主机的3306端口，可以通过外网访问3306端口对mysql进行操作

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/tencentdockertestss.png)


## 部署Tomcat

```bash
# 根目录下创建tomcat文件夹存储数据卷
mkdir ~/tomcat
# 切换到指定目录下创建容器
cd tomcat
# 创建镜像
docker run -id --name c_tomcat \
-v $PWD:/usr/local/tomcat/webapps \  # 配置数据卷
-p 8080:8080 \  # 配置映射端口
tomcat:latest
# Tomcat部署并启动后默认会启动服务器


# 创建测试文件并在外网利用8080端口访问
mkdir test
cd test
vim index.html  # 创建并编辑网页文件
```

外网访问
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/gafsgiusg.png)