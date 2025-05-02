---
author: Boyu Ren
pubDatetime: &id001 2021-04-02 17:06:10
modDatetime: *id001
title: 8-TCL事务控制语言
slug: 8-TCL事务控制语言
featured: false
draft: false
tags:
- MySQL
description: '**Transaction Control Language 事务控制语言**'
---

# TCL语言 事务控制语言

**Transaction Control Language 事务控制语言**

## 事务：
一个或一组sql语句组成的一个执行单元，这个执行单元要么全部执行，要么全部不执行。每条sql语句都是相互依赖的
整个单元作为一个不可分割的整体，如果单元中某条sql语句执行失败或者产生错误，则整个单元将会回滚。所有收到影响
的数据将会返回到事务开始以前的状态。如果单元内所有语句均正常执行，则事务被成功执行



### 案例：转账事务
转账过程分为：1. 付款方余额修改 2. 收款方余额修改
整个事务中两条语句必须全部正常执行，或者都不执行，否则就会发生逻辑上的错误

### 事务的ACID实现
1. Atomicity 原子性：原子性是指事务是一个不可分割的工作单元，事务中的操作要么都发生，要么都不发生
2. Consistency 一致性：事务必须使数据库从一个一致性状态变换到另外一个一致性状态
3. Isolation 隔离性：事务的隔离性是指一个事务的执行不能被其他事务干扰，即一个事务内部的操作及使用的数据对并发的其他事务是隔离的，并发执行的各个事务之间不能互相干扰
4. Durability 持久性：持久性指一个事务一旦被提交，它对数据库中数据的改变就是永久性的，接下来的其他操作和数据库故障不应该对其有任何影响



```sql
# TCL语言 事务控制语言
/*
Transaction Control Language 事务控制语言

事务：
一个或一组sql语句组成的一个执行单元，这个执行单元要么全部执行，要么全部不执行。每条sql语句都是相互依赖的
整个单元作为一个不可分割的整体，如果单元中某条sql语句执行失败或者产生错误，则整个单元将会回滚。所有收到影响
的数据将会返回到事务开始以前的状态。如果单元内所有语句均正常执行，则事务被成功执行



案例：转账事务
转账过程分为：1. 付款方余额修改 2. 收款方余额修改
整个事务中两条语句必须全部正常执行，或者都不执行，否则就会发生逻辑上的错误

事务的ACID实现
1. Atomicity 原子性：原子性是指事务是一个不可分割的工作单元，事务中的操作要么都发生，要么都不发生
2. Consistency 一致性：事务必须使数据库从一个一致性状态变换到另外一个一致性状态
3. Isolation 隔离性：事务的隔离性是指一个事务的执行不能被其他事务干扰，即一个事务内部
										 的操作及使用的数据对并发的其他事务是隔离的，并发执行的各个事务之间不能互相干扰
4. Durability 持久性：持久性指一个事务一旦被提交，它对数据库中数据的改变就是永久性的，接下来的其他操作和数据库故障
											不应该对其有任何影响


*/




# 存储引擎概念
/*
概念：再MySQL中的数据用各种不同的技术存储再文件（或内存）中

可以通过show engines;查看支持的存储引擎

不是所有的存储引擎都支持事务，主流的存储引擎有：INNODB,MYISAM,MEMORY
其中INNODB支持事务，另外两种不支持
*/


show engines;


# 事务的创建
# 隐式事务：事务没有明显的开启和结束标记（例如：INSERT,UPDATE,DELETE语句）
# 隐式事务在执行过程中自动提交功能是始终开启的
SHOW VARIABLES LIKE 'autocommit';  # 查看自动提交功能的状态

# 显式事务：事务具有明显的开启和结束标记，前提是已经关闭/禁用自动提交功能，否则该事务内部有多个分立的事务不符合条件
# 前提：禁用自动提交
SET autocommit=0;  # 禁用自动提交功能
# 步骤一：开启事务
START TRANSACTION;  # 在禁用自动提交功能时，就已经默认开启事务了，所以这条语句可以省略
# 步骤二：编写事务中的sql语句（SELECT,INSERT,UPDATE,DELETE等DML，DQL语言。 DDL语言没有事务之说）
语句1；
语句2；
...
# 步骤三：结束事务
COMMIT; # 提交事务
ROLLBACK;  # 回滚事务



# 实例:银行转账事务

DROP TABLE IF EXISTS bank;
CREATE TABLE bank(
	userName VARCHAR(20) ,
	balance INTEGER UNSIGNED 
);

INSERT INTO bank VALUES('Lily',1800);
INSERT INTO bank VALUES('Bob',350);
SELECT * FROM bank;
# 转账事件
SET autocommit=0; 
START TRANSACTION;
UPDATE bank SET balance=1300 WHERE userName='Lily';
UPDATE bank SET balance=850 WHERE userName='Bob';
COMMIT;

SELECT * FROM bank;
```



## 数据库隔离级别
对于同时运行的多个事务，当这些事务访问数据库中相同的数据时，如果没有采取必要的隔离机制，就会导致各种并发问题
- 脏读：对于两个事务T1，T2。T1读取了已经被T2更新但还**没有被提交**的字段之后，若T2回滚，T1读取的内容就是临时且无效的
- 不可重复读：对于两个事务T1，T2。 T1读取了一个字段，然后T2**更新**了该字段，之后T1再次读取同一字段，值就不同了
- 幻读：对于两个事务T1，T2。T1从一个表中读取一个字段，然后T2在该表中**插入**了一些新的行，如果T1再次读取同一个表，就会多出几行


### 数据库事务的隔离性：
数据库系统必须具有隔离并发运行的各个事务的能力，使他们不会相互影响，避免各种并发问题

### 隔离级别
一个事务与其他事务的隔离程度称为隔离级别。数据库规定了多种事务隔离级别，不同隔离级别对应不同的干扰程度，隔离级别越高，数据一致性就越好，但并发性就越弱


### 数据库提供的四种事务隔离级别
隔离级别|描述
---|---
READ UNCOMMITTED（读未提交数据）|允许事务读取未被其他事务提交的变更。脏读，不可重复读，幻读问题都会出现
READ COMMITTED（读已提交数据）|只允许事务读取已经被其他事务提交的变更，可以避免脏读，但不可重复读，幻读问题仍可能产生
REPEATABLE READ（可重复读）|确保事务可以多次从一个字段中读取相同的值，在这个事务持续期间，禁止其他事务对这个字段进行更新，可以避免脏读和不可重复度，但幻读问题仍然存在
SERIALIZABLE（串行化）|确保事务可以从一个表中读取相同的行，在这个事务持续期间，禁止其他事务对该表执行插入，更新和删除操作，所有并发问题都可以解决，但性能十分低下

Oracle支持两种隔离级别：READ COMMITED，SERIALIZABLE。默认情况下事务隔离级别为：READ COMMITTED

MySQL支持全部四种事务隔离级别，默认事务隔离级别为REPEATABLE READ

```sql
# 事务隔离相关的语句

/*
 每启动一个MySQL程序，就会获得一个单独的数据库连接，每个数据库连接都有一个全局变量
 @@tx_isolation,表示当前的事务隔离级别
*/

# 查看当前事务隔离级别：
SELECT @@tx_isolation;
# 设置当前MySQL连接的事务隔离级别
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
# 设置数据库系统的全局的隔离级别
SET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED;
```


# 回滚点

#### savepoint

```sql
# 回滚点/保存点  SAVEPOINT 

DROP TABLE IF EXISTS classone;
CREATE TABLE classone(
	id INT PRIMARY KEY auto_increment,
	stu_name VARCHAR(20),
	score INT
);

INSERT INTO classone VALUES(NULL,'Lily',95);
INSERT INTO classone VALUES(NULL,'Leslie',45);
INSERT INTO classone VALUES(NULL,'Hugo',78);
INSERT INTO classone VALUES(NULL,'Jax',29);
INSERT INTO classone VALUES(NULL,'Herry',76);

SELECT * FROM classone;


# 回滚点应用
SET autocommit=0;
START TRANSACTION;
DELETE FROM classone WHERE id=2;
SAVEPOINT a; # 设置回滚/保存点
DELETE FROM classone WHERE id=4;
ROLLBACK TO a;  # 回滚到保存点

# 可以看到2成功被删除，但是4已经被回滚了，所以仍然在数据库内

SELECT * FROM classone;
```


## delete和truncate在事务中的区别
DELETE支持回滚，在回滚后删除的数据仍然在数据库中，但是TRUNCATE不支持回滚，即使最后采用回滚的方式，数据依然会被删除
