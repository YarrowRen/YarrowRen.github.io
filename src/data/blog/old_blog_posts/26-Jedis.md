---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:40:09
modDatetime: *id001
title: 26-Jedis
slug: 26-Jedis
featured: false
draft: false
tags:
- JavaWeb
description: '```java'
---

# Jedis

#### Jedis 是 Redis 官方首选的 Java 客户端开发包。


```java
//Jedis测试类
public class JedisTest {

    @Test
    public void test1(){
        //获取连接
        Jedis jedis=new Jedis("localhost",6379);
        //执行操作
        jedis.set("username","Leslie");
        //关闭连接
        jedis.close();
    }

    @Test
    public void test2(){
        //获取连接
        Jedis jedis=new Jedis("localhost",6379);
        //执行操作
        String name=jedis.get("username");
        System.out.println(name);
        //关闭连接
        jedis.close();
    }
}
```

Jedis中各个方法名与Redis中完全一致

#### Jedis中的特殊方法

```java
//保存数据并在规定时间后删除
jedis.setex("age",10,"17"); //存入age:17键值对并在10秒后删除
```

## Jedis连接池：JedisPool

```java
    @Test
    public void test3(){
        //创建连接池配置对象用于修改默认配置
        JedisPoolConfig config=new JedisPoolConfig();
        config.setMaxIdle(10); //最大空闲连接
        config.setMaxTotal(50); //最大连接数
        //获取连接池对象
        JedisPool pool=new JedisPool(config,"localhost",6379);
        //通过连接池获取Jedis连接
        Jedis jedis=pool.getResource();
        //执行操作
        jedis.set("hello","hi");
        //关闭(此时只是归还Jedis对象给连接池)
        jedis.close();
    }
```
