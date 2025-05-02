---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:39:58
modDatetime: *id001
title: 23-Ajax
slug: 23-Ajax
featured: false
draft: false
tags:
- JavaWeb
description: '异步和同步: 客户端和服务器端相互通信的基础上'
---

# AJAX

异步和同步: 客户端和服务器端相互通信的基础上

同步：客户端必须等待服务器端的响应。在等待的期间客户端不能做其他操作。

异步：客户端不需要等待服务器端的响应。在服务器处理请求的过程中，客户端可以进行其他的操作。

Ajax是一种在无需重新加载整个网页的情况下，能够更新部分网页的技术。通过在后台与服务器进行少量数据交换，Ajax可以使网页实现异步更新。这意味着可以在不重新加载整个网页的情况下，对网页的某部分进行更新。传统的网页（不使用Ajax)如果需要更新内容，必须重载整个网页页面。提升用户的体验

## JS原生实现异步操作
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Ajax异步请求</title>
    <script>
        function func() {
            //发送异步请求
            //创建关键对象
            var xmlhttp;
            //判断浏览器版本，根据版本不同，初始化对象方式不同
            if (window.XMLHttpRequest)
            {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp=new XMLHttpRequest();
            }
            else
            {// code for IE6, IE5
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
            //建立连接
            /**
             * 参数：
             *     1. 请求方式：GET，POST
             *        GET:请求在URL后面拼接，send方法传空参
             *        POST:请求通过send方法传入，不在URL后拼接
             *     2. 请求的URL
             *     3. 是否采用异步请求
             */
            xmlhttp.open("GET","AjaxServlet1?username=Tom",true);
            //发送异步请求
            xmlhttp.send();
            //接收并处理来自服务器的响应结果
            //判断xmlhttp对象的响应状态，处于就绪状态时再执行后续操作
            xmlhttp.onreadystatechange=function()
            {
                //判断就绪状态是否为4，只有为4时才能获取响应结果
                //同时判断响应状态码是否为200，200表示相应成功
                /**
                 0: 请求未初始化
                 1: 服务器连接已建立
                 2: 请求已接收
                 3: 请求处理中
                 4: 请求已完成，且响应已就绪
                 */
                if (xmlhttp.readyState==4 && xmlhttp.status==200)
                {
                    //xmlhttp.responseText用于获取响应结果
                    var username=xmlhttp.responseText;
                    //显示结果
                    alert(username);
                }
            }


        }
    </script>
</head>
<body>

<input value="异步请求" onclick="func()" id="b1" type="button">
<input id="in1">

</body>
</html>
```

```java
@WebServlet("/AjaxServlet1")
public class AjaxServlet1 extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //获取请求参数
        String username=request.getParameter("username");
        //打印参数
        System.out.println(username);
        //响应请求
        response.getWriter().write("Hello :"+username);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);
    }
}
```

## jQuery实现异步操作

#### $.ajax()：通用操作

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Ajax异步请求</title>
    <script src="js/jquery-3.5.1.min.js"></script>
    <script>
        //通过jQuery实现异步操作
        function func() {
            //使用$.ajax()的方式发送异步请求
            $.ajax({
                url:"AjaxServlet1",//请求路径
                type:"POST",//请求方式
                data:{"username":"Jack","age":23},//请求参数
                success:function (data) {
                    alert(data);
                }//响应成功后的回调函数
            })
        }
    </script>
</head>
<body>

<input value="异步请求" onclick="func()" id="b1" type="button">
<input id="in1">

</body>
</html>
```


#### $.get() $.post() 用来发送get或post请求
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Ajax异步请求</title>
    <script src="js/jquery-3.5.1.min.js"></script>
    <script>
        //通过jQuery实现异步操作
        function func() {
            //使用$.get()的方式发送异步请求
            $.get("AjaxServlet1",{username:"Leslie"},function (data) {
                alert(data)
            })
        }
    </script>
</head>
<body>

<input value="异步请求" onclick="func()" id="b1" type="button">
<input id="in1">

</body>
</html>
```