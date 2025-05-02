---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:39:59
modDatetime: *id001
title: 24-JSON
slug: 24-JSON
featured: false
draft: false
tags:
- JavaWeb
description: JavaScript 对象表示法（JavaScript Object Notation）。如今主要用于做存储和交换文本信息的语法。类似 XML。JSON
  比 XML 更小、更快，更易解析。
---

# JSON

JavaScript 对象表示法（JavaScript Object Notation）。如今主要用于做存储和交换文本信息的语法。类似 XML。JSON 比 XML 更小、更快，更易解析。

例如：
```json
{
"employees": [
{ "firstName":"Bill" , "lastName":"Gates" },
{ "firstName":"George" , "lastName":"Bush" },
{ "firstName":"Thomas" , "lastName":"Carter" }
]
}
```

### JSON语法
JSON 语法是 JavaScript 对象表示法语法的子集。

- 数据在名称/值对中：JSON数据由键值对构成（键在书写时引号可省略）
    - JSON 值可以是：数字（整数或浮点数），字符串（在双引号中），逻辑值（true 或 false），数组（在方括号中），对象（在花括号中）
null
- 数据由逗号分隔（对于多个键值对）
- 花括号保存对象
- 方括号保存数组

### JSON值的获取
- json对象.键名 
- json对象["键名"]
- 数组对象[索引]

注意：第一种获取方式键名不需要加引号，第二种获取方式需要加引号

## JSON数据与Java对象相互转换

这种转换一般依赖于JSON解析器，常见的解析器有：Jsonlib,fastjson,Gson,jackson

### java对象转换为JSON数据
1. 导入响应jar包（jackson-annotations-2.9.9.jar，jackson-core-2.9.9.jar，jackson-databind-2.9.9.jar）
2. 创建Jackson核心对象ObjectMapper
3. 使用核心对象进行Java与JSON的转换

```java
    @Test
    public void jacksonTest1() throws Exception {
        //创建Person对象
        Person p=new Person("Leslie",23,"man");
        //创建Jackson的核心对象
        ObjectMapper mapper=new ObjectMapper();
        //将对象转换为JSON格式
        /**
         * 转换函数有
         * writeValue():接收两个参数，第一个参数表示转换后的处理方式，第二个参数是要转换的对象
         *     参数1：
         *          File：将对象转换为JSON字符串，转化后的字符串保存到对应文件中去
         *          Writer：将对象转换为JSON字符串，并将数据填充到指定的字符输出流中
         *          OutputStream：将对象转换为JSON字符串，并将数据填充到指定的字节输出流中
         * writeValueAsString():将对象直接转换为JSON字符串
         */
        String person=mapper.writeValueAsString(p);
        System.out.println(person);
    }

//{"name":"Leslie","age":23,"gender":"man"}
```

#### 两个注解
```java
@JsonIgnore //表示转化为JSON数据时忽略该属性
private String gender;

@JsonFormat(pattern = "yyyy-MM-dd") //表示转化为Json时按照指定格式格式化该属性
private Date birth;
```

### Json数据转换为Java对象
1. 导入响应jar包（jackson-annotations-2.9.9.jar，jackson-core-2.9.9.jar，jackson-databind-2.9.9.jar）
2. 创建Jackson核心对象ObjectMapper
3. 使用核心对象进行Java与JSON的转换

```java
    @Test
    public void jacksonTest2() throws Exception {
        //创建Jackson的核心对象
        ObjectMapper mapper = new ObjectMapper();
        //将数据转为Java对象
        //第一个参数表示Json数据，第二个参数表示要转化为的对象
        //初始化Json字符串
        String json="{\"name\":\"Leslie\",\"age\":23,\"gender\":\"man\"}";
        Person person=mapper.readValue(json,Person.class);
        System.out.println(person.toString());
    }

//Person{name='Leslie', age=23, gender='man'}
```