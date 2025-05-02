---
author: Boyu Ren
pubDatetime: &id001 2021-03-28 15:24:08
modDatetime: *id001
title: 5-DDL数据定义语言
slug: 5-DDL数据定义语言
featured: false
draft: false
tags:
- MySQL
description: '1. 库的管理: 创建，修改，删除'
---

# 数据定义语言DDL

### 用于库和表的管理

1. 库的管理: 创建，修改，删除
2. 表的管理: 创建 修改，删除

创建：CREATE

修改：ALTER

删除：DROP

# 库的管理

```sql
# DDL语言

/*
数据定义语言

用于库和表的管理

1. 库的管理
创建，修改，删除
2. 表的管理
创建 修改，删除

创建：CREATE
修改：ALTER
删除：DROP

*/



# 一，库的管理
# 1. 库的创建
/*
语法：
CREATE DATABASE 库名;
*/

CREATE DATABASE text1;

# 如果不存在就创建，如果存在就不执行
CREATE DATABASE IF NOT EXISTS text1;


# 2. 库的修改（一般情况下不直接修改库。很容易导致数据丢失）
# 更改库的字符集
ALTER DATABASE text1 CHARACTER SET gbk;

# 3. 库的删除
DROP DATABASE text1;
```


# 表的管理


```sql
# DDL表的管理

# 表的创建
/*
语法：
CREATE TABLE 表名(
	列名1 列的类型(类型长度，可选) 【约束】
	列名2 列的类型(类型长度，可选) 【约束】
	...
	列名3 列的类型(类型长度，可选) 【约束】
);
*/


CREATE TABLE book(
	id INT,
	bookname VARCHAR(20),
	price DOUBLE,
	author_id INT,
	publicDate DATETIME
);

CREATE TABLE author(
	id INT,
	au_name VARCHAR(20),
	nation VARCHAR(20)
);


# 表的修改
/*
语法：
ALTER TABLE 表名 ADD/DROP/MODIFY/CHANGE COLUMN 列名 【列类型 约束】;
*/
# 修改列名
ALTER TABLE book CHANGE COLUMN publicDate pubDate DATETIME;  # COLUMN可以省略
# 修改类型
ALTER TABLE book MODIFY COLUMN pubDate TIMESTAMP;  # 修改pubDate列的类型为TIMESTAMP
# 添加列
ALTER TABLE book ADD COLUMN annual DOUBLE;  # 增加一个类型为DOUBLE的annual列
# 删除列
ALTER TABLE book DROP COLUMN annual;
# 修改表名
ALTER TABLE author RENAME TO book_author;
	
	
	
# 表的删除
/*
DROP TABLE 表名;
*/
DROP TABLE auhor;
DROP TABLE IF EXISTS author;


# 表的复制
# 仅复制表的结构
CREATE TABLE copy_author LIKE book_author;
# 复制表的结构与数据
CREATE TABLE copy2_author
SELECT * FROM book_author;
# 复制部分数据只需要添加筛选条件

# 只复制一部分结构
CREATE TABLE copy3
SELECT id,au_name
FROM book_author
WHERE FALSE;
```