---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:40:00
modDatetime: *id001
title: 25-Redis
slug: 25-Redis
featured: false
draft: false
tags:
- JavaWeb
description: Redis是一款高性能的NoSQL系列的非关系型的数据库
---

# Redis
Redis是一款高性能的NoSQL系列的非关系型的数据库

关系型数据库一般多指数据之间存在关系，且将数据保存到硬盘上的数据库，例如MySQL等等。非关系型数据库是一个与之相对的概念，数据之间并不存在逻辑上的关系，且将数据存入内存而非硬盘中

Redis数据库将数据以键值对的形式存入内存

#### 数据结构

Redis存储的是键值对形式（KEY，VALUE）的数据，其中KEY始终是字符串，VALUE有五种可存储类型
- 字符串类型string
- 哈希类型hash（可嵌套存储键值对）
- 列表类型list
- 集合类型set（键不可重复）
- 有序集合类型sortedset（自动排序）

## 命令操作
### 字符串类型
- set key value:存储数据
- get key:获取数据
- del key:删除数据

### 哈希类型
- hset key filed value:存储数据
- hget key filed:获取数据
- hgetall key:获取全部哈希数据
- hdel key field:删除指定数据

### 列表类型
- lpush key value:从列表左侧插入元素（列表头部）
- rpush key value:从列表右侧插入元素（列表尾部）
- lrange key start end:获取范围内的元素
- lpop key:删除列表左侧首元素并返回值
- rpop key:删除列表右侧尾元素并返回值


### 集合类型
- sadd key value:存储元素（键不可重复）
- smembers key:获取set集合中所有元素
- srem key value:删除集合中某个元素

### 有序集合类型（数据按照score排序）
- zadd key score value:存储数据 
- zrange key start end:获取指定范围内的元素
- zren key value:删除指定元素

### 通用操作
- keys * :获取所有键名
- type key:获取对应键所存储的数据种类
- del key:删除指定数据


## Redis的持久化
redis是一个内存数据库，当服务器重启或者电脑重启，都会导致数据库中数据的丢失，此时就需要通过设置redis持久化进行解决。redis有两种持久化方案，分别是RDB与AOF

### RDB持久化方式
在一定的时间间隔中，检验key的变化情况，然后持久化数据


是redis默认的持久化方式，不需要进行配置，默认情况下就采用这种持久化方式

要更改相关的配置需要修改配置文件redis.windows.conf中的

```conf
################################ SNAPSHOTTING  ################################
#
# Save the DB on disk:
#
#   save <seconds> <changes>
#
#   Will save the DB if both the given number of seconds and the given
#   number of write operations against the DB occurred.
#
#   In the example below the behaviour will be to save:
#   after 900 sec (15 min) if at least 1 key changed
#   after 300 sec (5 min) if at least 10 keys changed
#   after 60 sec if at least 10000 keys changed
#
#   Note: you can disable saving completely by commenting out all "save" lines.
#
#   It is also possible to remove all the previously configured save
#   points by adding a save directive with a single empty string argument
#   like in the following example:
#
#   save ""

save 900 1
save 300 10
save 60 10000
```

"save 900 1"表示没过900秒有超过1个key被修改就进行持久化操作，同理"save 60 10000"表示没过60秒超过10000个key变化就进行持久化操作

修改文件后不能通过直接打开可执行程序的方式打开服务器端，需要通过命令行启动服务器端才能实现修改（在服务器文件路径下打开CMD窗口输入文件名启动服务器端）

### AOF持久化方式

采用直接记录日志的方式，可以在每一次命令操作后持久化数据

使用AOF进行持久化操作的方式是编辑配置文件redis.windows.conf，将appendonly no 修改为appendonly yes（表示开启AOF持久化）

AOF持久化有三种可以选择的持久化方案
```
appendfsync always  //每次命令操作都进行持久化
appendfsync everysec  //每隔一秒进行一次持久化操作
appendfsync no   //不进行持久化操作
```
