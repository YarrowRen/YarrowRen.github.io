---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:22:34
modDatetime: *id001
title: 1-JavaScipt基础概念
slug: 1-JavaScipt基础概念
featured: false
draft: false
tags:
- JavaScript
description: 一门客户端脚本语言（客户端指运行在客户端浏览器中，每一个浏览器都有JavaScript解析引擎。脚本语言指不需要通过编译，直接就可以被浏览器解析执行）
---

# JavaScript

### 概念
一门客户端脚本语言（客户端指运行在客户端浏览器中，每一个浏览器都有JavaScript解析引擎。脚本语言指不需要通过编译，直接就可以被浏览器解析执行）

### 功能 

用来增强用户和HTML页面交互过程，可以控制HTML元素，让页面有一些动态的效果（与动态资源无关），增强用户体验


## 基本语法

### 与HTML结合方式

#### 1. 内部JS

通过定义<script></script>标签实现，标签内容就是js代码。

#### 2. 外部JS

同样通过定义<script></script>实现，通过src属性引入外部文件

#### 实例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!--
        <script>标签可以放在HTML文件的任意位置，执行顺序由所放置的位置决定
            可以定义多个
        内部JS：通过定义<script>实现，标签内容就是js代码。
        外部JS：同样通过定义<script>实现，通过src属性引入外部文件
    -->
    <script>
        alert("Hello World!");　// 内部JS，弹出确认框
    </script>

    <script src="test.js">//外部JS文件</script>  

</head>
<body>
    <input type="text">
</body>
</html>

<!--
外部JS文件内容：
alert("外部JS文件");
-->
```


### 注释

注释方式与Java完全一样
- 单行注释：`//注释内容`
- 多行注释：`/*注释内容*/`


### 数据类型

#### 原始数据类型（基本数据类型）
- number：包括整型/小数/NaN(Not a Number 一个不是数字的数字)
- string：更类似于Python中的定义，可以用单引号或双引号表示
- boolean：true或false
- null：一个空对象的占位符
- undefined：未定义。如果一个变量没有赋给初值，默认值为undefined


#### 引用数据类型
即对象


### 变量

一小块存储数据的内存空间

Java语言是强数据类型语言，在定义变量时必须指定变量的数据类型，并且之后也不能在该内存空间存放其他类型的值。

JavaScript是弱类型数据语言，在定义变量时不需要指定变量的数据类型，之后也可以根据情况，任意修改该内存空间上的数据类型

#### 定义语法

```js
var 变量名 = 值;
```

可以通过typeof()函数查看变量数据类型

### 运算符

运算符与Java基本一致

在JS中，如果运算数不是运算符要求的数据类型，那么JS引擎会自动进行数据转换
- String转number:如果string是数字，则按照字面值转换，如果不少，则转为NaN
- boolean转number:true转1，false转0
- number转boolean：除了0和NaN都是true
- String转boolean：除了空字符串""都是true
- null和undefined转boolean：都是false
- 对象转Boolean：都是true

```js
/*
“==”和“===”的区别

等于“==”在比较前会先查看左右两边变量的数据类型，如果数据类型不一致，会先进行数据转换，再进行比较，即"123"==123的返回值是true

全等于“===”在比较前同样查看左右数据类型，假如数据类型不一致，直接返回false，即"123"==="123"返回值是false
*/
```


**JS同样支持 ? : 这种三元运算符**




#### 几点注意
- 每行末尾以分号;作结，但在一行只有一条语句的情况下分号;可以省略（不建议省略）
- 定义变量时前面的var可加可不加
    - 加：变量为局部变量
    - 不加：变量是全局变量（同样不建议使用，代码可读性差）


### 流程控制语句

基本与Java完全一致

- if/else
- switch/case
- while
- for
- do while


## 对象

### Function对象

```js
/*
Function函数(方法)对象

1. 创建
    1. var func=new Function(形参列表,方法体);  基本不用，不符合正常逻辑
    2. function 方法名(形参列表){
            方法体
       }
    3. var 方法名=function(形参列表){
            方法体
       }
    
2. 方法
3. 属性
    length属性获取形参个数
4. 特点
    1. 方法定义时，形参的类型var不用写，返回值类型也可省略
    2. 方法是一个对象，如果定义名称相同，则新的方法对象会覆盖旧的方法对象
    3. 在JS中，方法的调用只与方法名有关，与参数列表无关，例如一个函数参数列表接收两个参数
       但是实际可以传入0，1，2，3...个参数，如果实参少于形参列表，未匹配上的参数就是undefined
       如果实参多于形参列表，多余参数不作考虑或操作
    4. 在方法声明中有一个隐藏的内置对象(数组),arguments 封装所有实参列表
5. 调用
    方法名称(实参列表)

*/

//创建Function对象方式1
var func=new Function("a","b","alert(a+b)");
//创建Function对象方式2
function func2(a,b){
    alert(a-b);
}
//创建Function对象方式3
var func3=function(a,b){
    alert(a*b);
}
//调用方法
//func(3,4);
//func2(8,2);
//func3(2,2);
//在JS中，方法的调用只与方法名有关，与参数列表无关
//func2();
//func2(1);
//func2(1,2);
//func2(1,2,3);

//利用arguments定义可计算任意数和的方法
function func4(){
    var sum=0;
    for(var a=0;a<arguments.length;a++){
        sum+=arguments[a];
    }
    return sum;
}

var sum=func4(1,2,3,4,5,6);
alert(sum);
```


### Array数组对象

```js
/*
Array数组对象

1. 创建
    1. var arr=new Array(元素列表);
    2. var arr=new Array(数组长度);
    3. var arr=[元素列表];
2. 方法
    join(参数)：将数组中的元素按照指定的分隔符合并为一个字符串
    push()：向数组的尾部添加一个或多个元素，并返回数组长度
3. 属性
    length数组的长度
4. 特点
    数组元素的类型可变
    数组元素的长度可变
*/

//数组对象的创建
var arr1=new Array(1,2,3,4);
var arr2=new Array(5);
var arr3=[6,7,8,9,10,11];
//显示数组
document.write(arr1+"<br/>");
document.write(arr2+"<br/>");
document.write(arr3+"<br/>");
```

### Date日期对象


```js
/*
Date日期对象

1. 创建 var date=new Date();
2. 方法
    toLocaleString()返回当前date对象对应的时间的本地字符串格式
    getTime()获取指定日期对象对应的毫秒值

*/

var date=new Date();
document.write(date.toLocaleString()+"<br/>");
document.write(date.getTime());
```

### Math数学对象
```js
/*
Math数学对象

1. 创建 Math对象不用创建，可以直接使用Math.方法名()调用方法
2. 方法
    random()
    ceil
    floor
    round
    等等....
3. 属性
    PI等等
*/

document.write(Math.PI+"<br/>");
document.write(Math.random()+"<br/>");
document.write(Math.floor(4.5)+"<br/>");
document.write(Math.round(4.9)+"<br/>");
```


### 正则表达式对象


#### 简单的正则表达式
![简单正则表达式](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/%E7%AE%80%E5%8D%95%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F.jpg)


```js
/*
RegExp正则表达式对象

1. 创建
    1. var reg=new RegExp("正则表达式");
    2. var reg=/正则表达式/
2. 方法
    1. test(参数)：验证指定字符串是否符合正则表达式

*/

var reg=/^[abc]+$/;
var str="aaccbbb";
var flag=reg.test(str);
var str2="abcd123";
var flag2=reg.test(str2);
if(flag){
    document.write(str+"符合正则表达式："+reg+"<br/>");
}
if(flag2){
    document.write(str2+"符合正则表达式："+reg+"<br/>");
}
```


### Global全局对象

全局对象，这个对象中封装的方法不需要对象可以直接调用

- encodeURI()：url编码
- decodeURI()：url解码
- encodeURIComponent()：url编码
- decodeURIComponent()：url解码
- parseInt()：将字符串转为数字（比直接强转功能更强大，该方法会逐一判断每一个字符是否是数字，直到不是数字为止，将前边的字符转为number）
- isNaN()：判断一个变量是否为NaN
- eval()：将JavaScript字符串转为JS脚本来执行


