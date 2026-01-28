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
description: Jedis 是 Redis 官方推荐的 Java 客户端，用于通过 Java 程序操作 Redis
---

# Jedis

## 一、概述

Jedis 是 Redis 官方首选的 Java 客户端开发包，封装了 Redis 的各种命令，使 Java 程序能够以面向对象的方式访问 Redis 服务。

Jedis 中的方法名称与 Redis 命令基本保持一致，学习和使用成本较低。

---

## 二、Jedis 基本使用

### 1. 依赖 Redis 服务

- Redis 默认端口：6379  
- 确保 Redis 服务已启动

---

### 2. 基本操作示例

```java
// Jedis 测试类
public class JedisTest {

    @Test
    public void testSet() {
        // 1. 创建 Jedis 对象（建立连接）
        Jedis jedis = new Jedis("localhost", 6379);

        // 2. 执行 Redis 操作
        jedis.set("username", "Leslie");

        // 3. 关闭连接
        jedis.close();
    }

    @Test
    public void testGet() {
        // 1. 获取连接
        Jedis jedis = new Jedis("localhost", 6379);

        // 2. 读取数据
        String name = jedis.get("username");
        System.out.println(name);

        // 3. 关闭连接
        jedis.close();
    }
}
````

---

## 三、Jedis 中的常用扩展方法

### 设置键并指定过期时间

```java
// setex(key, seconds, value)
jedis.setex("age", 10, "17");
```

含义说明：

* 键名：age
* 值：17
* 过期时间：10 秒
* 10 秒后该键会被 Redis 自动删除

---

## 四、Jedis 连接池（JedisPool）

频繁创建和关闭 Jedis 连接开销较大，实际开发中通常使用连接池进行管理。

---

### 1. 连接池基本使用

```java
@Test
public void testJedisPool() {
    // 1. 创建连接池配置对象
    JedisPoolConfig config = new JedisPoolConfig();

    // 2. 设置连接池参数
    config.setMaxIdle(10);   // 最大空闲连接数
    config.setMaxTotal(50);  // 最大连接数

    // 3. 创建连接池
    JedisPool pool = new JedisPool(config, "localhost", 6379);

    // 4. 从连接池中获取 Jedis 对象
    Jedis jedis = pool.getResource();

    // 5. 执行 Redis 操作
    jedis.set("hello", "hi");

    // 6. 归还连接（并非真正关闭）
    jedis.close();
}
```

---

## 五、注意事项

1. Jedis 对象不是线程安全的，不能在多线程环境中共享
2. JedisPool 是线程安全的，推荐在项目中统一使用连接池
3. `jedis.close()` 在连接池环境下表示归还连接，而非断开连接
4. 生产环境中通常将 JedisPool 作为单例对象管理

---

## 六、小结

* Jedis 是 Java 操作 Redis 的核心工具
* API 与 Redis 命令高度一致，易于上手
* 实际开发中应使用 JedisPool 提升性能与稳定性
<!-- 2026.01.28由GPT5.2优化全文 -->