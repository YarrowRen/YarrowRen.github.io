---
author: Boyu Ren
pubDatetime: &id001 2021-03-28 14:59:07
modDatetime: *id001
title: 4-DML数据操控语言
slug: 4-DML数据操控语言
featured: false
draft: false
tags:
- MySQL
description: '```sql'
---

# 插入语句


```sql
# 插入语句

/*
语法：
INSERT INTO 表名(列名,...) VALUES(值1,...);
*/

# 插入值类型需要与列的类型一致或兼容
INSERT INTO student(name,age,score,birth) VALUES('Leslie',19,100,'2001/02/14');


# 可以为null的列如何给值（nullable的列），不可以为空的列必须插入值
# 方式一：直接赋给null
INSERT INTO student(name,age,score,birth) VALUES('John',18,NULL,'2001/05/21');
# 方式二：直接在给定列名时跳过该列
INSERT INTO student(name,age,birth) VALUES('Lala',18,'2003/03/22');

# 列的顺序可以调换，但是列和值必须匹配 
INSERT INTO student(name,score,age,birth) VALUES('Lily',56,18,'2001/03/18');

# 可以省略列名，表示默认添加所有列名，并且列的顺序和表的顺序一致
INSERT INTO student() VALUES('Hugo',19,92,'2001/09/16');



# 第二种插入方式
INSERT INTO student
SET name='Jax',age='20';


# 第一种插入方式支持多行插入，第二种不支持
INSERT INTO student
VALUES('boy1',19,92,'2001/09/16')
,('boys',19,92,'2001/09/16')
,('boy3',19,92,'2001/09/16');

# 方式一支持子查询，方式二不支持
INSERT INTO student(name)
SELECT 'Leslie';
```


# 修改语句

```sql
# DML修改语句

/*
语法：
1. 修改单表的记录
UPDATE 表名
SET 列=新值,列2=新值2,...
WHERE 筛选条件;
2. 修改多表记录

sql92语法：
UPDATE 表1 别名,表2 别名,表3 别名
SET 列=值...
WHERE 连接条件
AND 筛选条件;

sql99语法：
UPDATE 表1 别名
INNER JOIN 表2 别名
ON 连接条件
SET 列=值...
WHERE 筛选条件;

*/

# 修改单表记录
UPDATE student
SET score=99,age=17
WHERE name LIKE '%boy%';


# 修改多表记录
UPDATE boys bo
INNER JOIN beauty b ON bo.`id`=b.`boyfriend_id`
SET b.`phone`='114'
WHERE bo.`boyName`='张无忌';
```

# 删除语句


```sql
# DML删除语句

/*

方法一：使用delete关键字
单表删除：
DELETE FROM 表名 WHERE 筛选条件 

多表删除

sql92语法：
DELETE 表1的别名,表2的别名
FROM 表1 别名,表2 别名
WHERE 连接条件
AND 筛选条件

sql99语法：
DELETE 表1的别名,表2的别名  # (要删除内容所在的表)
FROM 表1 别名
INNER JOIN 表2 别名 ON 连接条件
WHERE 筛选条件;


方法二：使用truncate关键字
语法：
TRUNCATE TABLE 表名;
直接删除整个表的数据，不能进行筛选

*/



# DELETE关键字
# 单表删除
DELETE FROM student WHERE age=18;

# 多表删除
DELETE b 
FROM beauty b
INNER JOIN boys bo ON b.`boyfriend_id`=bo.`id`
WHERE bo.`boyName`='张无忌';




# TRUNCATE删除,直接清空表中数据
TRUNCATE TABLE boys;



/* 
	TRUNCATE 与 DELETE 区别：
	 
	1. DELETE可以加WHERE 条件，TRUNCATE不可以
    2. TRUNCATE语句省略了筛选的步骤，更加高效
    3. 假如要删除的表中有自增长列，利用DELETE删除后，再插入时自增长列的值从断点开始,而TRUNCATE的值从1重新开始
	4. TRUNCATE删除没有返回值，DELETE删除有返回值（返回删除行数）
	5. TRUNCATE删除不能回滚，DELETE 删除可以回滚
*/
```
