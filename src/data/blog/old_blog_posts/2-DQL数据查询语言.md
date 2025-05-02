---
author: Boyu Ren
pubDatetime: &id001 2021-03-27 23:10:45
modDatetime: *id001
title: 2-DQL数据查询语言
slug: 2-DQL数据查询语言
featured: false
draft: false
tags:
- MySQL
description: '```sql'
---

# DQL查询语言

## DQL基础查询语句--SELECT

```sql
# DQL基础查询语句

/*
语法：
SELECT 查询列表 FROM 表名;
FROM可省

特点：
1. 查询列表可以是：表中的字段，常量，表达式，函数
2. 查询的结果是一个虚拟表格
*/

# 选中指定库
USE myemployees;

# 查询表中的单个字段

SELECT last_name FROM employees;

# 查询表中的多个字段，中间用逗号隔开，对顺序无要求

SELECT last_name,first_name,email FROM employees;

# 查询所有字段

SELECT * FROM employees;

# `列名`,注意可以用反单引号标注列名（不是单引号！），主要是避免列名和关键字相同的情况

SELECT 
	`salary`
FROM
	employees;

# 查询常量值

SELECT 100;
SELECT 'Steven';

# 查询表达式

SELECT 98*10;

# 查询函数

SELECT VERSION();

# 起别名，类似定义变量名
/*
 * 1. 便于理解
 * 2. 如果查询字段有重复情况，使用别名可以便于区分
 */
 
 # 方式1 使用AS关键字
SELECT 100*5 AS result;
SELECT last_name AS 姓,first_name AS 名 FROM employees;

# 方式2 使用空格，别名中有特殊空格就加上双引号避免歧义
SELECT last_name 姓,first_name 名 FROM employees;

# 去重 利用DISTINCT关键字

SELECT DISTINCT department_id FROM employees;

# +号的作用

/*
 * 在sql语言中+号只有一个功能就是作为运算符，不具备连接两个字段的能力
 * 两个操作数都为数值型可以用来作运算
 * 其中一方为字符型，首先会试图将字符型转换为数值型，转换成功继续运算，转换失败，则将字符型转换为0
 * 如果一方为null，则结果必为null
 */
 
 
# 加入想要拼接两个字段，需要采用concat()方法
SELECT CONCAT(last_name,' ',first_name) AS 姓名 FROM employees;
```


### DQL条件查询语句

```sql
# DQL条件查询语句

/*
语法：

	SELECT
			查询列表
	FROM
			表名
	WHERE
			筛选条件

注意：
这里语句的执行顺序与我们直观上的书写顺序并不一致
在上面的语句中首先执行FROM语句获取读取的表
然后执行WHERE语句，确定筛选的条件，最后才执行SELECT语句进行查询

分类：
1. 利用条件表达式筛选：基本的条件运算符有>,<,=,!=,<>,>=,<=  (!=和<>是等价的，但推荐采用<>表示不等)
2. 按逻辑表达式查询：逻辑运算符有： &&,||,!,AND,OR,NOT  (推荐采用后三种)
3. 模糊查询：关键词有：LIKE,BETWEEN AND,IN,IS NULL
*/


# 按条件表达式进行筛选

# 筛选工资大于12000的人
SELECT
	* 
FROM
	employees
WHERE
	salary>12000;
	
# 查询部门编号不等于90号的员工姓名和部门编号
SELECT
	CONCAT(first_name,' ',last_name) 姓名,department_id 部门编号
FROM
	employees
WHERE
	department_id<>90;
	


# 按逻辑表达式筛选

# 查询工资再10000-20000之间的员工部分信息
SELECT
	first_name,
	last_name,
	salary,
	commission_pct 
FROM
	employees 
WHERE
	salary > 10000 AND salary < 20000;
	
# 查询工资高于15000，或者部门编号不为90的员工
SELECT
	last_name,
	salary,
	department_id
FROM 
	employees
WHERE
	salary>15000 OR department_id<>90;
	
	


# 模糊查询

/*
 like:和通配符搭配使用
 通配符包括：
 %：任意多个字符，包含0个字符
 _：任意单个字符
 */
 
 
 SELECT
	last_name,
	salary
FROM
	employees
WHERE
	last_name LIKE '_o__h%';
	
#假设要查询的内容中包含通配符，可以用转义字符解释内容,或用转义关键字
SELECT
	last_name,
	job_id,
	salary
FROM
	employees
WHERE
	job_id LIKE '__\_%';
	
SELECT
	last_name,
	job_id,
	salary
FROM
	employees
WHERE
	job_id LIKE '__$_%' ESCAPE '$';
	
	
	
/*
BETWEEN AND
在。。。之间
使用BETWEEN AND可以提高语句简介程度
搜索结果包含两个端点值
两个临界值顺序不可以颠倒

BETWEEN AND实际等价于a<=X<=b,所以顺序不可颠倒
*/

#查询员工号在100-120之间
SELECT
	*
FROM
	employees
WHERE
	employee_id BETWEEN 100 AND 120;


/*
IN 关键字
判断某字段的值是否属于in列表中的某一项

使用in提高语句整洁度
in列表中的值必须是同一类型或相互兼容
in列表中不支持通配符

IN实际等价于X=a OR X=b or X=c,但是通配符在like关键字下使用
所以IN列表中不允许出现通配符
*/

SELECT
	last_name,
	job_id
FROM
	employees
WHERE
	job_id IN('IT_PROG','AD_VP','AD_PRES');
	
	
	
/*
IS NULL关键字  (IS NOT NULL)
判断是否为NULL值

(在SQL语言中＝号或者<>不能判断是否为NULL值)
*/

SELECT
	last_name,
	commission_pct
FROM
	employees
WHERE
	commission_pct IS NULL;
	


/*
安全等与 <=>
安全等于可以用来判断NULL值，也可以用来判断普通类型的值
缺点是可读性较低
*/


SELECT
	last_name,
	commission_pct,
	job_id
FROM
	employees
WHERE
	job_id <=> 'SA_REP' OR commission_pct <=> NULL;
	
```


### DQL排序查询语句

```sql
# DQL排序查询语句


/*
语法：(【】表示可省)
SELECT
	查询列表
FROM
	表名
【WHERE 筛选条件】
ORDER BY
	排序列表 【asc|desc】


特点：
ASC代表升序，DESC代表降序。不写的情况下默认升序
ORDER BY字句一般放在整个查询语句的最后（LIMIT字句除外）
*/

# 工资由高到低排序
SELECT
	*
FROM
	employees
ORDER BY
	salary DESC;
	
# 由低到高
SELECT * FROM employees ORDER BY salary ASC;


# 排序+筛选  查询部门编号>=90的员工信息，按入职时间的先后进行排序
SELECT
	last_name,
	department_id,
	hiredate 
FROM
	employees 
WHERE
	department_id >= 90 
ORDER BY
	hiredate;
	

# 按表达式排序  年薪降序

SELECT 
	last_name,
	salary*12*(1+IFNULL(commission_pct,0)) 年薪
FROM
	employees
ORDER BY
	salary*12*(1+IFNULL(commission_pct,0)) DESC ;

# 用别名排序
SELECT 
	last_name,
	salary*12*(1+IFNULL(commission_pct,0)) 年薪
FROM
	employees
ORDER BY
	年薪 DESC ;

# 用函数排序
SELECT 
	last_name,
	salary,
	LENGTH(last_name) AS 长度
FROM
	employees
ORDER BY
	LENGTH(last_name) ;


# 按多个字段排序
# 先按工资升序，再按员工编号降序

SELECT
	last_name,
	salary,
	employee_id
FROM
	employees
ORDER BY
	salary ASC,
	employee_id DESC;
```


### 排序查询

```sql
# DQL排序查询语句


/*
语法：(【】表示可省)
SELECT
	查询列表
FROM
	表名
【WHERE 筛选条件】
ORDER BY
	排序列表 【asc|desc】


特点：
ASC代表升序，DESC代表降序。不写的情况下默认升序
ORDER BY字句一般放在整个查询语句的最后（LIMIT字句除外）
*/

# 工资由高到低排序
SELECT
	*
FROM
	employees
ORDER BY
	salary DESC;
	
# 由低到高
SELECT * FROM employees ORDER BY salary ASC;


# 排序+筛选  查询部门编号>=90的员工信息，按入职时间的先后进行排序
SELECT
	last_name,
	department_id,
	hiredate 
FROM
	employees 
WHERE
	department_id >= 90 
ORDER BY
	hiredate;
	

# 按表达式排序  年薪降序

SELECT 
	last_name,
	salary*12*(1+IFNULL(commission_pct,0)) 年薪
FROM
	employees
ORDER BY
	salary*12*(1+IFNULL(commission_pct,0)) DESC ;

# 用别名排序
SELECT 
	last_name,
	salary*12*(1+IFNULL(commission_pct,0)) 年薪
FROM
	employees
ORDER BY
	年薪 DESC ;

# 用函数排序
SELECT 
	last_name,
	salary,
	LENGTH(last_name) AS 长度
FROM
	employees
ORDER BY
	LENGTH(last_name) ;


# 按多个字段排序
# 先按工资升序，再按员工编号降序

SELECT
	last_name,
	salary,
	employee_id
FROM
	employees
ORDER BY
	salary ASC,
	employee_id DESC;
```