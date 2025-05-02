---
author: Boyu Ren
pubDatetime: &id001 2021-03-27 21:04:29
modDatetime: *id001
title: 1-MySQL简述
slug: 1-MySQL简述
featured: false
draft: false
tags:
- MySQL
description: '> 数据库是“按照数据结构来组织、存储和管理数据的仓库”。是一个长期存储在计算机内的、有组织的、可共享的、统一管理的大量数据的集合。'
---

# MySQL简述

> 数据库是“按照数据结构来组织、存储和管理数据的仓库”。是一个长期存储在计算机内的、有组织的、可共享的、统一管理的大量数据的集合。

#### 保存数据的容器

常用的保存数据的容器有数组，集合，文件以及数据库。**数组，集合**将数据存储在内存中，但内存中的数据具有易失性，很容易丢失。**文件**可以实现永久存储，但文件不适用于大量文件的存储，难于检索查询。

### 数据库优点
- 实现数据持久化
- 使用完整的管理系统统一管理，易于查询


## 数据库相关概念
#### DB（database）
数据库，存储数据的“仓库”。保存了一系列有组织的数据
#### DBMS（Database Management System）
数据库管理系统，数据库通过数据库管理系统创建和操作容器（常见的DBMS有：MySQL，Oracle，DB2，Sql Server）
#### SQL（Structure Query Language）
**结构化查询语言**，专门用来与数据库通信的语言。SQL具有诸多优点：它**不是**某个特定数据库供应商**专有的语言**，几乎所有主流DBMS都支持SQL。SQL语言**简单易学**，虽然简单，但是一种强有力的语言，可以灵活运用其他语言进行诸多**复杂和高级的数据库操作**

## 数据库的特点
- 将数据放到表中，再将表放入数据库中
- 一个数据库中可以有多张表，每张表都有自己的名字用于标识自己，表名具有唯一性，即不可以重复
- 表具有一些特性，定义了数据在表中如何存储，类似于Java中类的设计
- 表由列组成，或者称为“字段”，所有表都是由一个或多个列组成的，每一列类似Java中的“属性”
- 表中数据按行存储，每行类似Java中的一个对象

### DBMS分类
- 基于共享文件系统的DBMS（Access）
- 基于客户机--服务器的DBMS（MySQL,Oracle,Sql Server）



## MySQL优点：
**成本低**：开放源代码，一般可以免费试用。**性能高**：执行很快。**简单**：易安装和使用


------

## 基本操作语法
```
// 开启MySQL服务
net start mysql0214
//关闭MySQL服务
net stop mysql0214
```

#### root用户登录可以直接利用MySQL自带的Command Line Client登录，其他用户可以利用命令行如下操作进入

```
mysql -h localhost -P 3306 -u root -p

//之后输入对应用户密码即可登录
//第一个mysql不再是容器名称，而是mysql命令的意思
//-h表示主机
//-P表示端口
//-u表示用户
//-p表示密码


//本机用户可以直接简写成如下格式：
mysql -u root -p

//密码可以直接显示在该语句中，而不是换行输入
mysql -u root -prenboyu010214

//注意，-p和密码之间不允许有空格存在
```


### 常见命令

#### 展示当前数据库  show databases;
```test
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| test               |
+--------------------+
4 rows in set (0.01 sec)
```

#### 查看某数据库内容的两种方式
-  方式一

利用  **use 库名;**  先进入对应库中<br/>
利用  **show tables;**  语句展示库中内容。

```test
mysql> use information_schema;
Database changed
mysql> show tables;
+---------------------------------------+
| Tables_in_information_schema          |
+---------------------------------------+
| CHARACTER_SETS                        |
| COLLATIONS                            |
| COLLATION_CHARACTER_SET_APPLICABILITY |
| COLUMNS                               |
| COLUMN_PRIVILEGES                     |
| ENGINES                               |
| EVENTS                                |
| FILES                                 |
| GLOBAL_STATUS                         |
| GLOBAL_VARIABLES                      |
| KEY_COLUMN_USAGE                      |
| PARAMETERS                            |
| PARTITIONS                            |
| PLUGINS                               |
| PROCESSLIST                           |
| PROFILING                             |
| REFERENTIAL_CONSTRAINTS               |
| ROUTINES                              |
| SCHEMATA                              |
| SCHEMA_PRIVILEGES                     |
| SESSION_STATUS                        |
| SESSION_VARIABLES                     |
| STATISTICS                            |
| TABLES                                |
| TABLESPACES                           |
| TABLE_CONSTRAINTS                     |
| TABLE_PRIVILEGES                      |
| TRIGGERS                              |
| USER_PRIVILEGES                       |
| VIEWS                                 |
| INNODB_CMP_RESET                      |
| INNODB_TRX                            |
| INNODB_CMPMEM_RESET                   |
| INNODB_LOCK_WAITS                     |
| INNODB_CMPMEM                         |
| INNODB_CMP                            |
| INNODB_LOCKS                          |
+---------------------------------------+
37 rows in set (0.00 sec)
```

- 方式二


利用 **show tables from 库名;**  直接查看库中数据内容，不需要进入（也就是说没有走出原来的库）


```test
mysql> show tables from mysql;
+---------------------------+
| Tables_in_mysql           |
+---------------------------+
| columns_priv              |
| db                        |
| event                     |
| func                      |
| general_log               |
| help_category             |
| help_keyword              |
| help_relation             |
| help_topic                |
| host                      |
| ndb_binlog_index          |
| plugin                    |
| proc                      |
| procs_priv                |
| proxies_priv              |
| servers                   |
| slow_log                  |
| tables_priv               |
| time_zone                 |
| time_zone_leap_second     |
| time_zone_name            |
| time_zone_transition      |
| time_zone_transition_type |
| user                      |
+---------------------------+
24 rows in set (0.01 sec)
```


#### 查看当前所在的库 select database();

```test
mysql> select database();
+--------------------+
| database()         |
+--------------------+
| information_schema |
+--------------------+
1 row in set (0.00 sec)
```


#### 在库中创建表格 create table 表名();

```test
mysql> create table stuinfo(
    -> id int,
    -> name varchar(20));
Query OK, 0 rows affected (0.35 sec)
```
#### 查看表的结构  desc 表名;



```test
mysql> desc stuinfo;
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| id    | int(11)     | YES  |     | NULL    |       |
| name  | varchar(20) | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+
2 rows in set (0.04 sec)
```

#### 向表中插入数据   insert into 表名 (id,name) values(1,'Leslie');

```test
mysql> insert into stuinfo (id,name) values(1,'Leslie');
Query OK, 1 row affected (0.00 sec)

mysql>  insert into stuinfo (id,name) values(2,'John');
Query OK, 1 row affected (0.01 sec)
```



#### 查看表中数据  select * from 表名;

```test
mysql> select * from stuinfo;
+------+--------+
| id   | name   |
+------+--------+
|    1 | Leslie |
|    2 | John   |
+------+--------+
2 rows in set (0.01 sec)
```


#### 删除表中数据   delete from 表名 where id=1;

```test
mysql> delete from stuinfo where id=1;
Query OK, 1 row affected (0.01 sec)
```


#### 查看当前MySQL版本

在MySQL窗口中：
```test
mysql>  select version();
+-----------+
| version() |
+-----------+
| 5.5.27    |
+-----------+
1 row in set (0.00 sec)
```

在DOS窗口中：

```test
C:\Windows\system32>mysql --V
mysql  Ver 14.14 Distrib 5.5.27, for Win64 (x86)
```

### MySQL语法规范

1. 不区分大小写，但建议关键字大写，表名，列名小写
2. 每条命令以分号结尾
3. 每条命令根据需要，可以缩进或换行
4. 注释
    - 单行注释：#注释文字
    - 单行注释：-- 注释文字(注意中间必须有空格)
    - 多行注释：/* 注释文字 */


------


## 结构化查询语言SQL
(Structured Query Language)简称SQL，是一种特殊目的的编程语言，是一种数据库查询和程序设计语言，用于存取数据以及查询、更新和管理关系数据库系统。

### SQL语言分类
#### DQL语言
（Data Query Language）数据查询语言，主要用于查询功能
#### DML语言
（Data Manipulation Language）数据操作语言，主要用于增加，删除与修改
#### DDL语言
（Data Define Language）数据定义语言，有关库和表的定义
#### TCL语言
（Transaction Control Language）事务控制语言，事务和事务处理