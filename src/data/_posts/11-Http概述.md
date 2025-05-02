---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:34:11
modDatetime: *id001
title: 11-Http概述
slug: 11-Http概述
featured: false
draft: false
tags:
- JavaWeb
description: 定义了客户端和服务器端通信时，发送数据的格式
---

# Http协议，超文本传输协议
#### (Hyper Text Transfer Protocol)


### 传输协议概念
定义了客户端和服务器端通信时，发送数据的格式

### 特点
1. 基于TCP/IP的高级协议
2. 默认端口号为80
3. 基于请求/响应模型，即一次请求对应一次响应
4. 无状态的：即每次请求之间相互独立，不能交互数据


## 请求信息数据格式
1. 请求行
    - 请求方式：HTTP协议种规定了7种请求方式，常用的由两种
        - GET：请求的参数在请求行中（即跟在URL后面），且请求的长度有限制，有安全隐患
        - POST：请求的参数在请求体中，请求的URL没有限制，相对安全
    - 请求url：发出请求的URL
    - 请求协议/版本：例如HTTP/1.1
2. 请求头
    - 格式：请求头名称:请求头值
    - User-Agent：当前浏览器的相关版本信息（可以在服务器端获取该信息，以解决浏览器兼容问题）
    - Referer：当前网页的来源网址（从哪个网页跳转而来）可用于防盗链或进行一些统计工作
    - Accept：允许接收的数据格式
    - Accept-Language：允许接收的语言类型 
    - Coonection：连接状态（是否存活）
3. 请求空行：一段空行，用于分割各组成部分
4. 请求体：正文内容

#### 解析前的请求头

![解析前的请求头](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/%E8%A7%A3%E6%9E%90%E5%89%8D%E7%9A%84%E8%AF%B7%E6%B1%82%E5%A4%B4.jpg)

#### 解析后的请求头

![解析后的请求头](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/%E8%A7%A3%E6%9E%90%E5%90%8E%E7%9A%84%E8%AF%B7%E6%B1%82%E5%A4%B4.jpg)

#### 捕获的本地HTTP报文


![捕获的HTTP报文](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/%E6%8D%95%E8%8E%B7%E7%9A%84HTTP%E6%8A%A5%E6%96%87.jpg)

### 捕获本地报文的方式

1. 以管理员身份运行cmd
2. route add 本机ip mask 255.255.255.255 网关ip
    - 如：route add 192.168.1.105 mask 255.255.255.255 192.168.1.1
    - 使用完毕后用route delete 192.168.1.105 mask 255.255.255.255 192.168.1.1删除，否则所有本机报文都经过网卡出去走一圈回来很耗性能。
3. 此时再利用wireshark进行抓包便可以抓到本机自己同自己的通信包，这样配置的原因是将发往本机的包发送到网关，而此时wireshark可以捕获到网卡驱动的报文实现抓包。

但这样有一个缺点，那就是本地请求的URL的IP只能写本地的IP地址，不能写localhost或127.0.0.1，写localhost或127.0.0.1还是抓不到包。[参考自](https://www.cnblogs.com/lvdongjie/p/6110183.html)


## 响应信息数据格式

1. 响应行
    - 组成：协议/版本 响应状态码  状态码描述（例如HTTP/1.1 200 OK）
2. 响应头
    - 格式：头名称:值
    - 常见响应头
        - Content-Type：服务器告知客户端，响应体数据的格式以及编码方式
        - Content-Disposition：服务器告知客户端响应体数据的打开方式
3. 响应空行
4. 响应体


### 响应状态码分类
分类|	分类描述
---|---
1xx	|信息，服务器收到请求，需要请求者继续执行操作
2xx	|成功，操作被成功接收并处理
3xx	|重定向，需要进一步的操作以完成请求
4xx	|客户端错误，请求包含语法错误或无法完成请求
5xx	|服务器错误，服务器在处理请求的过程中发生了错误