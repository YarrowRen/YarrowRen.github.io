---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:28:08
modDatetime: *id001
title: 8-XML概述
slug: 8-XML概述
featured: false
draft: false
tags:
- JavaWeb
description: Extensible Markup Language可扩展标记语言（可扩展指XML中的所有标签都是自定义的）
---

# XML概述

### 概念
Extensible Markup Language可扩展标记语言（可扩展指XML中的所有标签都是自定义的）

### 功能
- 存储数据
    - 做配置文件
    - 在网络中传输

### XML与HTML区别
- XML标签都是自定义的，HTML标签都是预定义的
- XML语法严格，HTML语法松散
- XML是用来存储数据的，HTML是用来展示数据的


### 基本要求
1. xml文档的后缀名.xml
2. xml第一行必须定义为文档声明。例如：`<?xml version="1.0" encoding="utf-8"?>`
3. xml文档中有且仅有一个根标签
4. 属性值必须使用引号(单双都可)引起来
5. 标签必须正确关闭
6. xml标签名称区分大小写



## 组成部分

### 1. 文档声明
- 格式：<?xml 属性列表 ?>
- 属性列表组成
    - version：版本号，必须的属性
    - encoding：编码方式，告知解析引擎当前文档使用的字符集
    - standalone：是否独立（yes：不依赖其他文件，no：依赖其他文件）

### 2. 标签：
自定义名称
### 3. 属性：
（注意id属性值唯一）
### 4. 文本：
由于我们保存的文本数据可能包含一些有特殊意义的字符，例如>,<,&等等，一种解决方式是用转义字符替换所有这些特殊文本。但这样使得文本的可读性变差，另一种方式就是使用XML中的CDATA区
- CDATA区：在该区域中的数据会被原样展示（格式：<![CDATA[ 文本数据 ]]>）


## 约束
规定XML文档的书写规则

### dtd约束
一种相对简单的约束技术

#### 1. 内部dtd
将约束规则定义在xml文档中
#### 2. 外部dtd
将约束规则定义在外部的dtd文件中
- 本地：<!DOCTYPE 根标签名 SYSTEM "dtd文件地址">
- 网络：<!DOCTYPE 根标签名 SYSTEM "dtd文件名字" "dtd文件的位置URL">

#### 示例

该示例中跟标签名是students，其内部允许放置student标签，student标签内部又允许放置name,age,sex三个标签，这三个标签内部允许存放字符串。最后一行对number属性进行限定，规定其为ID属性，也就是必须是唯一的值，#REQUIRED表示这个属性必须出现

```
<!ELEMENT students (student+)>
        <!ELEMENT student (name,age,sex)>
        <!ELEMENT name ( #PCDATA)>
        <!ELEMENT age (#PCDATA)>
        <!ELEMENT sex (#PCDATA)>
        <!ATTLIST student number ID #REQUIRED>
```

#### 引入当前示例

```xml
<?xml version="1.0"?>
<!DOCTYPE students SYSTEM "student.dtd">

<students>
    <student number="id1">
        <name>Leslie</name>
        <age>20</age>
        <sex>male</sex>
    </student>

    <student number="id2">
        <name>Leslie</name>
        <age>20</age>
        <sex>male</sex>
    </student>
</students>
```


### Schema约束
1. 填写xml文档的根元素
2. 引入xsi前缀。`xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`
3. 引入xsd文件命名空间，`xsi:schemaLocation="http://www.ywrby.cn/xml student.xsd"`
4. 为每一个xsd约束声明一个前缀,作为标识`xmlns="http://www.ywrby.cn/xml"`

[深入](https://www.bilibili.com/video/BV1uJ411k7wy?p=666)


## 解析

操作XML文档，将文档中的数据读取到内存中

### 操作XML文档
- 解析(读取)：将文档中的数据读取到内存中
- 写入：将内存中的数据保存到XML文档中，持久化存储

### 解析XML的方式
1. DOM：将标记语言文档一次性加载进内存，在内存中形成一棵DOM树
    - 优点：操作方便，可以对文档进行CRUD的所有操作
    - 缺点：由于是一次性加载所有数据进内存，所以对内存占用较大
2. SAX：逐行读取，读取完一行后立即释放并读取下一行。基于事件驱动
    - 优点：不占用内存
    - 缺点：由于逐行释放，所以无法进行增删改操作，只能读取


### XML常见的解析器
- JAXP：sun公司提供的官方解析器，支持DOM和SAX两种思想。性能较差
- DOM4J：一款非常优秀的解析器
- Jsoup：jsoup 是一款Java 的HTML解析器，可直接解析某个URL地址、HTML文本内容。它提供了一套非常省力的API，可通过DOM，CSS以及类似于jQuery的操作方法来取出和操作数据。
- PULL：Android操作系统内置的解析器，支持SAX思想


### Jsoup解析
#### 步骤
1. 导入jar包：jsoup-1.13.1.jar
2. 获取Document对象
3. 获取Element对象
4. 获取数据

#### 示例

```java
/**
 * Jsoup快速入门
 */
public class JsoupDemo1 {
    public static void main(String[] args) throws IOException {
        //获取Document对象
        //获取要解析的xml文件路径
        String path =JsoupDemo1.class.getClassLoader().getResource("cn/ywrby/xml/stu.xml").getPath();
        //解析XML文档，加载文档进内存，获取DOM树-->Document（注意这里的Doccument对象是org.jsoup.nodes.Document，不是其他类）
        Document doc=Jsoup.parse(new File(path),"utf-8");
        //获取元素对象 -->Element
        Elements elements=doc.getElementsByTag("name");
        //遍历
        for(Element element:elements){
            //获取数据
            String name=element.text();
            System.out.println(name);
        }
    }
}
```

#### Jsoup中的常见对象

- Jsoup：工具类，可以解析html或xml文档，返回Document
    - parse()方法。解析html或xml文档，返回Document，有多种重载形式
        - (File in,String charsetName)：解析本地的xml或html文件
        - (String html)：解析html字符串
        - (URL url,int timeoutMills)：通过网络路径获取指定html或xml文档对象
- Document：文档对象，代表内存中的DOM树
    - 主要用于获取Element对象
        - getElementsByTag
        - getElementsByAttribute
        - getElementById
- Elements：元素Element的集合，可以当作ArrayList<Element>使用
- Element：元素对象
    - 获取其子元素对象
        - getElementsByTag
        - getElementsByAttribute
        - getElementById
    - 获取属性值：  attr(String key)根据属性名称，获取属性值
    - 获取文本内容：text()获取文本内容（包括子标签的文本内容）,html()获取包括子标签的标签体的所有内容
- Node：节点对象，是Document与Element对象的父类


## 快捷查询XML文档的方法

### 1. selector：选择器

使用的方法：`Elements select(String cssQuery)`

[语法参考](https://jsoup.org/apidocs/org/jsoup/select/Selector.html)

[视频讲解](https://www.bilibili.com/video/BV1uJ411k7wy?p=673)

### 2. XPath
XPath 是一门在 XML 文档中查找信息的语言。XPath 可用来在 XML 文档中对元素和属性进行遍历。

[教程](https://www.w3school.com.cn/xpath/index.asp)