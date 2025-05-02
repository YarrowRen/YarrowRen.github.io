---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:34:15
modDatetime: *id001
title: 15-会话技术与Cookie
slug: 15-会话技术与cookie
featured: false
draft: false
tags:
- JavaWeb
description: 一次会话中包含多次请求和相应，浏览器第一次给服务器资源发送请求，会话建立，直到有一方断开为止，会话结束
---

# 会话技术

### 会话
一次会话中包含多次请求和相应，浏览器第一次给服务器资源发送请求，会话建立，直到有一方断开为止，会话结束

### 功能
再一次会话范围内的多次请求间共享数据

### 方式
- 客户端会话技术：Cookie
- 服务器端会话技术：Session




## Cookie 
### 概念：
客户端会话技术，将数据保存到客户端
### 主要步骤:
1. 创建Cookie对象，绑定数据
    - new Cookie(String name,String value)
2. 发送Cookie对象
    - response.addCookie(Cookie cookie)
3. 获取Cookie对象，拿到数据(getCookies方法获取全部Cookie并返回数组)
    - request.getCookies()

#### 创建Cookie与发送
```java
@WebServlet("/CookieServlet")
public class CookieServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //创建Cookie对象
        Cookie cookie=new Cookie("msg","hello_world");
        //发送Cookie
        response.addCookie(cookie);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);
    }
}
```
#### 接收Cookie
```java
@WebServlet("/CookieServlet2")
public class CookieServlet2 extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //获取Cookie
        Cookie[] cookies=request.getCookies();
        //遍历Cookies 获取Cookie值
        if(cookies!=null){
            for(Cookie cookie:cookies){
                String name=cookie.getName();
                String value=cookie.getValue();
                System.out.println(name+" : "+value);
            }
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);
    }
}
```

### 实现原理
Cookie的发送是通过在客户端发送请求到服务器端的过程后，浏览器端在返回response时向响应头中添加set-cookie:name=value实现。Cookie的接收是通过客户端在向服务器端发送请求前向请求头中添加cookie:name=value来实现的。两个实现原理均是在遵循HTML协议的前提下所实现

### 注意事项
1. 一次可以发送多个Cookie
2. cookie在浏览器中默认情况下在浏览器关闭后被销毁（保存在浏览器内存而不是本地）
3. 在发送cookie时可以进行持久化存储的操作，保证在一段时间内，无论浏览器是否关闭，cookie都有效（保存在本地文件中）
    - Cookie.setMaxAge(int seconds)
    - 传入正数表示保存到秒数
    - 传入0表示删除本地对应cookie信息
    - 传入负数表示在浏览器关闭后销毁cookie
4. Tomcat8之前不能存储中文cookie，Tomcat8之后可以存储中文cookie
5. 默认情况下，同一个Tomcat服务器部署的不同web项目之间的cookie是不能进行共享的。cookie共享范围，默认情况下为当前虚拟目录。可以通过setPath(String path)修改默认共享范围
6. 在不同Tomcat服务器部署的web项目中cookie也是可以设置共享的，利用setDomain(String path):如果设置的一级域名相同，那么多个服务器之间的cookie可以共享（例如：setDomain(".baidu.com")可以保证百度贴吧和百度体育之间的cookie共享）


### Cookie特点与作用
1. 数据存储在客户端浏览器
2. 浏览器对于cookie的大小以及同域名下cookie的数量都有限制
3. 一般用来存储不太敏感的信息（例如在不登录的情况下，完成服务器对客户端身份的识别）

![cookie](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/cookie.jpg)


### Cookie简单应用

判断用户是否为初次访问当前页面，如果是则告知用户初次访问，如果不是，则显示用户上一次访问页面的时间

```java
package cn.ywrby.Cookie;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

@WebServlet("/CookieDemo1")
public class CookieDemo1 extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=utf-8");
        //获取所有cookie
        Cookie[] cookies=request.getCookies();
        //是否找到lastTime的cookie
        boolean flag=false;
        //遍历cookie列表判断是否访问过该网页
        if(cookies!=null&&cookies.length>0) {
            for (Cookie cookie : cookies) {
                //判断是否存在lastTime的cookie
                if (cookie.getName().equals("lastTime")) {
                    //存在该cookie表示之前访问过
                    //获取上次访问时间
                    String t1=cookie.getValue();
                    //打印上次访问时间
                    response.getWriter().write("<h1>欢迎再次访问，您上次访问时间是："+t1+"</h1>");
                    //获取当前时间
                    Date date=new Date();
                    //格式化时间数据
                    SimpleDateFormat sdf=new SimpleDateFormat("HH:mm:ss");
                    String t2=sdf.format(date);
                    //重新传值并传回response中
                    cookie.setValue(t2);
                    response.addCookie(cookie);
                    //修改flag值
                    flag=true;
                }
            }
        }
        //未找到lastTime的cookie表示初次访问
        if(!flag||cookies==null||cookies.length==0){
            //获取当前时间
            Date date=new Date();
            SimpleDateFormat sdf=new SimpleDateFormat("HH:mm:ss");
            String t=sdf.format(date);
            //创建cookie并传入response中
            Cookie cookie=new Cookie("lastTime",t);
            response.addCookie(cookie);
            //页面显示初次内容
            response.getWriter().write("<h1>欢迎初次访问！</h1>");
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);
    }
}
```
![cookie1](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/cookie1.jpg)
![cookie2](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/cookie2.jpg)