---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:22:36
modDatetime: *id001
title: 3-DOM
slug: 3-DOM
featured: false
draft: false
tags:
- JavaScript
description: '------'
---

# DOM(Document Object Model)

#### 文档对象模型

------



### 概念

将标记语言文档（HTML,XML...）的各个部分，封装为对象，可以使用这些对象，对标记语言文档进行CRUD动态操作


W3C 文档对象模型 （DOM）是中立于平台和语言的接口，它允许程序和脚本动态地访问和更新文档的内容、结构和样式。”W3C DOM标准被分为 3 个不同的部分

- 核心DOM-针对任何结构化文档的标准模型
    - **Document**：文档对象
    - **Element**：元素对象
    - Attribute：属性对象
    - Text：文本对象
    - Comment：注释对象
    - **Node**：节点对象，是其他5个对象的父对象
- XML DOM - 针对 XML 文档的标准模型
- HTML DOM - 针对 HTML 文档的标准模型

#### HTML DOM 树


![htmlDom](https://note.youdao.com/yws/res/27632/BF5CDA32E4A74808A1DAD09A903A3AF4)

------

### Document对象

#### 对象创建
- window.document
- document

#### 方法

**获取Element对象**
- getElementById()	查找具有指定的唯一 ID 的元素。
- getElementsByTagName()	返回所有具有指定名称的元素节点。
- getElementByClassName 根据Class属性值获取元素对象数组并返回
- getElementByName() 根据name属性值获取元素对象数组并返回


**创建其他DOM对象**

- createAttribute(name)	创建拥有指定名称的属性节点，并返回新的 Attr 对象。
- createComment()	创建注释节点。
- createElement()	创建元素节点。
- createTextNode()	创建文本节点。

### Element元素对象
通过document获取和创建

#### 方法
- removeAttribute()	删除指定的属性。
- setAttribute()	添加新属性。


### Node节点对象

节点对象代表文档树中的一个节点。节点可以是元素节点、属性节点、文本节点，或者也可以是任何一种节点。


#### 注意

虽然所有的对象均能继承用于处理父节点和子节点的属性和方法，但是并不是所有的对象都拥有父节点或子节点。例如，文本节点不能拥有子节点，所以向类似的节点添加子节点就会导致 DOM 错误。

#### 方法

**对DOM数进行增删改查**

- appendChild()	向节点的子节点列表的结尾添加新的子节点。
- removeChild()	删除（并返回）当前节点的指定子节点。
- replaceChild()	用新节点替换一个子节点。

#### 属性
- parentNode	返回节点的父节点。


以上方法和属性虽然都是介绍的Node节点，但由于Node节点是其他五种对象的父对象，所以其他几种对象都可以使用


```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!--设置样式-->
    <style>
        div{
            border: 1px solid red;
        }
        #div1{
            width: 200px;
            height: 200px;
        }
        #div2{
            width: 100px;
            height: 100px;
        }
        #div3{
            width: 50px;
            height: 50px;
        }
    </style>
</head>
<body>
    <!--删除内部的div2-->
    <div id="div1">
        <div id="div2">
            div2
        </div>
        div1
    </div>
    
    <!--在href中填入#或javascript:void(0);都可以使超链接对象不跳转，只保留点击效果-->
    <a href="#" id="del">删除子节点</a>
    <a href="javascript:void(0);" id="insert">添加子节点</a>

    <script>
        var div1=document.getElementById("div1");
        var div2=document.getElementById("div2");
        
        var del=document.getElementById("del");
        var insert=document.getElementById("insert");

        //删除div1内部的div2
        del.onclick=function(){
            div1.removeChild(div2);
        }
        //向div1内部添加子节点div3
        var div3=document.createElement("div");  //创建子节点
        div3.setAttribute("id","div3")  //设置节点ID属性，再在CSS中设置节点其他样式
        insert.onclick=function(){
            div1.appendChild(div3);
        }

    </script>
</body>
</html>
```



## 实例：动态表格（插入/删除）

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <style>
        table{
            border: 1px solid;
            margin: auto;
            width: 500px;
        }

        td,th{
            text-align: center;
            border: 1px solid;
        }
        div{
            text-align: center;
            margin: 50px;
        }

    </style>

</head>
<body>
    <div>
        <input type="text" id="num" placeholder="请输入ID">
        <input type="text" id="name" placeholder="请输入姓名">
        <input type="text" id="sex" placeholder="请输入性别">
        <input type="button" value="添加" id="in_btn">
    </div>
    <table id="stu_table">
        <caption>学术信息表</caption>
        <tr>
            <th>编号</th>
            <th>姓名</th>
            <th>性别</th>
            <th>操作</th>
        </tr>

        <tr>
            <td>1</td>
            <td>Leslie</td>
            <td>man</td>
            <td><a href="#" onclick="delTr(this)">删除</a></td>
        </tr>

        <tr>
            <td>2</td>
            <td>John</td>
            <td>man</td>
            <td><a href="#" onclick="delTr(this)">删除</a></td>
        </tr>

        <tr>
            <td>3</td>
            <td>Jessica</td>
            <td>woman</td>
            <td><a href="#" onclick="delTr(this)">删除</a></td>
        </tr>
        

    </table>

    <script>
        //添加操作实现
        var insert_btn=document.getElementById("in_btn");  //获取插入按钮
        var table=document.getElementById("stu_table");  //获取表格对象

        //插入按钮操作
        insert_btn.onclick=function(){
            //获取输入框中的值
            var num=document.getElementById("num").value;
            var name=document.getElementById("name").value
            var sex=document.getElementById("sex").value;
            //创建ID的td节点
            var td_id=document.createElement("td");  //创建节点
            var text_id=document.createTextNode(num);  //创建文本子节点
            td_id.appendChild(text_id);  //插入子节点
            //创建姓名的td节点
            var td_name=document.createElement("td");
            var text_name=document.createTextNode(name);
            td_name.appendChild(text_name);
            //创建性别的td节点
            var td_sex=document.createElement("td");
            var text_sex=document.createTextNode(sex);
            td_sex.appendChild(text_sex);

            //创建删除按钮的td节点
            var td_delete=document.createElement("td");
            var del=document.createElement("a");  //创建超链接类型的子节点
            del.href="#";  //定义跳转链接为#，使a标签只具备点击效果，没有跳转效果
            del.setAttribute("onclick","delTr(this)");
            var text_del=document.createTextNode("删除");  
            del.appendChild(text_del);  //插入删除的文本子节点
            td_delete.appendChild(del);  //向td节点中插入超链接子节点

            var tr_stu=document.createElement("tr");  //创建tr类型节点
            //逐个插入四个子节点
            tr_stu.appendChild(td_id);  
            tr_stu.appendChild(td_name);
            tr_stu.appendChild(td_sex);
            tr_stu.appendChild(td_delete);
            //向表格中插入tr子节点
            table.appendChild(tr_stu);

        }

        //定义删除函数
        function delTr(obj){
            var stuTr=obj.parentNode.parentNode;  //通过链接节点获取当前信息栏对象
            var table=stuTr.parentNode;    //通过当前栏对象获取table对象

            table.removeChild(stuTr);  //删除指定子节点
        }

    </script>
    
</body>
</html>
```





## HTML DOM

### 主要功能
- 标签体的设置和获取：innerHTML
- 使用html元素对象的属性
- 控制样式


### innerHTML 

innerHTML 属性设置或返回表格行的开始和结束标签之间的 HTML。

#### 使用innerHTML简化之前的动态表格实例

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>dynamicTable</title>

    <style>
        table{
            border: 1px solid;
            margin: auto;
            width: 500px;
        }

        td,th{
            text-align: center;
            border: 1px solid;
        }
        div{
            text-align: center;
            margin: 50px;
        }

    </style>

</head>
<body>
    <div>
        <input type="text" id="num" placeholder="请输入ID">
        <input type="text" id="name" placeholder="请输入姓名">
        <input type="text" id="sex" placeholder="请输入性别">
        <input type="button" value="添加" id="in_btn">
    </div>
    <table id="stu_table">
        <caption>学术信息表</caption>
        <tr>
            <th>编号</th>
            <th>姓名</th>
            <th>性别</th>
            <th>操作</th>
        </tr>

        <tr>
            <td>1</td>
            <td>Leslie</td>
            <td>man</td>
            <td><a href="#" onclick="delTr(this)">删除</a></td>
        </tr>

        <tr>
            <td>2</td>
            <td>John</td>
            <td>man</td>
            <td><a href="#" onclick="delTr(this)">删除</a></td>
        </tr>

        <tr>
            <td>3</td>
            <td>Jessica</td>
            <td>woman</td>
            <td><a href="#" onclick="delTr(this)">删除</a></td>
        </tr>
        

    </table>

    <script>
        //添加操作实现
        var insert_btn=document.getElementById("in_btn");  //获取插入按钮
        var table=document.getElementById("stu_table");  //获取表格对象

        //插入按钮操作
        insert_btn.onclick=function(){
            //获取输入框中的值
            var num=document.getElementById("num").value;
            var name=document.getElementById("name").value
            var sex=document.getElementById("sex").value;
            
            var tr_stu=document.createElement("tr");  //创建tr类型节点
            //使用innerHTML向tr中追加标签
            tr_stu.innerHTML="<td>"+num+"</td>";  //这里只是展示=是直接赋值，+=可以实现追加
                                                  //实际上这四行完全可以放到一行代码（只调用一次innerHTML）
            tr_stu.innerHTML+="<td>"+name+"</td>";
            tr_stu.innerHTML+="<td>"+sex+"</td>";
            tr_stu.innerHTML+="<td><a href='#' onclick='delTr(this)'>删除</a></td>"

            //向表格中插入tr子节点
            table.appendChild(tr_stu);

        }

        //定义删除函数
        function delTr(obj){
            var stuTr=obj.parentNode.parentNode;  //通过链接节点获取当前信息栏对象
            var table=stuTr.parentNode;    //通过当前栏对象获取table对象

            table.removeChild(stuTr);  //删除指定子节点
        }

    </script>
    
</body>
</html>
```


### 控制元素样式

#### 两种方式

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <style>
        .d1{
            border: 1px solid blue;
            width: 100px;
            height: 100px;
            font-size: 30px;
        }
    </style>
</head>
<body>
    <div id="div1">
        div1
    </div>

    
    <div id="div2">
        div2
    </div>

    <script>
        var div1=document.getElementById("div1");
        div1.onclick=function(){
            //设置样式方式1
            div1.style.border="1px solid red";
            div1.style.width="200px";
            //类似font-size这种样式的设置方式与命名方式如下
            div1.style.fontSize="30px";
        }

        var div2=document.getElementById("div2");
        div2.onclick=function(){
            //设置样式方式2
            //提前定义好类选择器样式，通过元素的className属性来设置其class属性
            div2.className="d1";
        }

    </script>
</body>
</html>
```


### 事件

#### 概念

某些组件（事件源）被执行了某些操作（事件）后，触发某些代码（监听器）执行

#### 事件
某些操作，如单击，双击，鼠标移动，键盘操作等

#### 事件源

被监听的组件，如文本输入框，按钮等

#### 监听器

一段代码

#### 注册监听

将事件，事件源和监听器绑定在一起

#### 常见事件
- 点击事件
    - onclick	当用户点击某个对象时调用的事件句柄。
    - ondblclick 当用户双击某个对象时调用的事件句柄。
- 焦点事件
    - onblur	元素失去焦点。
    - onfocus	元素获得焦点。
- 加载事件
    - onload	一张页面或一幅图像完成加载。
- 鼠标事件
    - onmousedown	鼠标按钮被按下。
    - onmousemove	鼠标被移动。
    - onmouseout	鼠标从某元素移开。
    - onmouseover	鼠标移到某元素之上。
    - onmouseup	鼠标按键被松开。
- 键盘事件
    - onkeydown	某个键盘按键被按下。
    - onkeypress	某个键盘按键被按下并松开。
    - onkeyup	某个键盘按键被松开。
- 选中和改变
    - onchange	域的内容被改变。
    - onselect	文本被选中。
- 表单事件
    - onsubmit	确认按钮被点击。
    - onreset	重置按钮被点击。


[演示网址](https://www.w3school.com.cn/jsref/dom_obj_event.asp)

