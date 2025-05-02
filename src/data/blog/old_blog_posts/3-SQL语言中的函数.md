---
author: Boyu Ren
pubDatetime: &id001 2021-03-27 23:22:25
modDatetime: *id001
title: 2-SQL语言中的函数
slug: 3-SQL语言中的函数
featured: false
draft: false
tags:
- MySQL
description: 将一组逻辑语句封装在方法体内，对外暴露方法名
---

# SQL语言--函数
### 概念：
将一组逻辑语句封装在方法体内，对外暴露方法名

### 优点：
隐藏了实现细节，提高了代码的重用性

### 调用语法：
SELECT 函数名(实参列表) 【FROM 表】;

特点：
函数名与函数功能

### 分类：
1. 单行函数，例如:CONCAT(str1,str2,...),LENGTH(str)等等
2. 分组函数（也叫统计函数，聚合函数，组函数），做统计使用

------

### 字符函数

```sql
# 常见函数

/*
概念：将一组逻辑语句封装在方法体内，对外暴露方法名

优点：隐藏了实现细节，提高了代码的重用性

调用语法：
SELECT 函数名(实参列表) 【FROM 表】;

特点：
函数名与函数功能

分类：
1. 单行函数，例如:CONCAT(str1,str2,...),LENGTH(str)等等
2. 分组函数（也叫统计函数，聚合函数，组函数），做统计使用
*/

# 单行函数又分为：字符函数，数学函数，日期函数，其他函数，流程控制函数

# 字符函数


# LENGTH(str)函数返回字节长度，字节长度取决于编码方式
# utf8中一个字母占一个字节，一个汉字占3个字节
SELECT LENGTH('John');
SELECT LENGTH('张三');  

#CONCAT(str1,str2,...) 用于拼接字符串
SELECT CONCAT(last_name,' ',first_name) 姓名 FROM employees;

# 转大小写
SELECT UPPER('Leslie');
SELECT LOWER('Leslie');

# SUBSTR(str FROM pos FOR len),截取部分字符串(SQL语言中索引从1开始)
SELECT SUBSTR('Hello World',7) AS result;

# 注意这里第二个参数是截取开始的位置，第三个参数是字符长度，不是结束截取的位置
SELECT SUBSTR('Hello World',1,5) AS result;  

# INSTR(str,substr)  ,返回子字符串在原字符串中的索引
SELECT INSTR('Hello World','Wor') AS result;

# TRIM([{BOTH | LEADING | TRAILING} [remstr] FROM] str) 取出左右空格
SELECT TRIM('    Hello     ') AS result;
SELECT TRIM('a' FROM 'aaaaaaaHELaaaaaaLOaaaaaaaa') AS result;  # 指定要去掉的字符，并且只去掉左右两端

# LPAD(str,len,padstr)  ,左填充函数，第一个参数是目标字符串，第二个参数是最终长度，第三个参数是填充字符
# 填充字符可以是多个字符，与此对应同样有右填充RPAD
SELECT LPAD('HELLO',10,'*') AS result;

# REPLACE(str,from_str,to_str)  替换函数（替换所有）
SELECT REPLACE('Hello World','World','Leslie') AS result;
```


### 数学函数

```sql
# 数学函数

# ROUND(X)  四舍五入
SELECT ROUND(4.555);
SELECT ROUND(1.567,2);  # 小数点后保留两位

# CEIL(X) 向上取整
SELECT CEIL(1.05);
# FLOOR(X) 向下取整
SELECT FLOOR(1.05);

# TRUNCATE(X,D)  截断函数
SELECT TRUNCATE(1.69999,1);

# MOD(N,M)  取余函数  等价于% 本质是 MOD(a,b)等价于a-a/b*a;
SELECT MOD(10,1);
```

### 日期函数



```sql
# 日期函数

# NOW() 返回当前系统日期+时间
SELECT NOW();

# CURDATE() 返回当前系统日期，不包含时间
SELECT CURDATE();

# CURTIME() 返回当前系统时间，不返回日期
SELECT CURTIME();

# 获取指定部分的日，月，年等信息(小时，分钟，秒)
SELECT YEAR(NOW());
SELECT MONTH('1998-1-1');
SELECT DAY('2020-12-21');

# STR_TO_DATE(str,format) 将日期格式字符转换为指定个式的日期
SELECT STR_TO_DATE('03-11-2019','%d-%m-%Y') AS 日期;

# 查询入职日期为1992-4-3的员工信息
SELECT * FROM employees WHERE hiredate=STR_TO_DATE('4-3 1992','%m-%d %Y');

# DATE_FORMAT(date,format)  将日期转换成字符
SELECT DATE_FORMAT(NOW(),'%Y年%m月%d日--%H时%i分钟%s秒') AS 当前日期;
```

格式符|功能
---|---
%Y|四位的年份
%y|两位的年份
%m|月份（01，02，03...,12）
%c|月份（1，2，3...12）
%d|日（01，02，03...）
%H|小时（二十四小时制）
%h|小时（十二小时制）
%i|分钟（00，01...59）
%s|秒（00，01...59）

------


### 其他函数

```sql
# 其他函数

# VERSION() 查看当前版本号
SELECT VERSION();
# DATABASE() 查看当前所在的库
SELECT DATABASE();
# USER() 查询当前用户
SELECT USER();
```

### 流程控制函数

```sql
# 流程控制函数

# IF(expr1,expr2,expr3) 实现类似if...else的效果
# 类似于三元运算符，表达式1的值成立返回表达式2的值，否则返回表达式3的值
SELECT IF('10>5','大于','小于') AS result;



# CASE函数，实现类似于switch...case效果
/* 

格式
CASE case_value
	WHEN when_value THEN
		statement_list
	ELSE
		statement_list
END CASE;


*/

# 查询员工工资，要求部门号=30的显示的工资为1.1倍
# 部门号为40的，显示的工资为1.2倍，其他部门原价显示

SELECT
	last_name,
	department_id,
	salary 工资,
CASE department_id
	WHEN 30 THEN
		salary*1.1
	WHEN 40 THEN
		salary*1.2
	ELSE salary
END AS 新工资 
FROM
	employees;
	
# case函数的使用二
# 工资大于20000，显示A级别
# 工资大于15000，显示B级别
# 工资大于10000，显示C级别
SELECT
	last_name,
	salary,
CASE 
	WHEN salary>20000 THEN 'A'
	WHEN salary>15000 THEN 'B'
	WHEN salary>10000 THEN 'C'
	ELSE 'D'
END AS 工资等级
FROM
	employees;
```

------

------


## 分组函数


### 分类：
sum 求和，avg 平均值，max 最大值，min 最小值

### 特点：
1. sum,avg可以处理数值型数据，max,min,count可以处理任何类型数据
2. 以上几个分组函数都会自动忽略null值
3. 可以和distinct搭配使用


```sql
# 分组函数

/*
分类：sum 求和，avg 平均值，max 最大值，min 最小值

特点：
1. sum,avg可以处理数值型数据，max,min,count可以处理任何类型数据
2. 以上几个分组函数都会自动忽略null值
3. 可以和distinct搭配使用
*/



# sum求和
SELECT SUM(salary) FROM employees;
# avg求平均值
SELECT AVG(salary) FROM employees;
# max最大值
SELECT MAX(salary) FROM employees;
# min最小值
SELECT MIN(salary) FROM employees;

# count统计有效数据个数（非null值）
SELECT COUNT(salary) FROM employees;


# 和distinct搭配使用,取出重复内容
SELECT SUM(DISTINCT salary),SUM(salary) FROM employees;

# count()函数
SELECT COUNT(*) FROM employees;  # 可以用来统计实际有效行数
SELECT COUNT(1) FROM employees;

```

## 分组查询


### 语法：

```sql
SELECT 分组函数,列（要求出现在group_by后面）
FROM 表
【WHERE 筛选条件】
GROUP BY 分组列表
【ORDER BY 子句】
```


### 注意：
查询列表比较特殊，要求是分组函数和group_by后出现的字段

### 分组查询中的筛选可以分为两类
1. **分组前的筛选**：分组前的筛选也就是筛选的内容在数据库中就存在，
可以直接利用对应列筛选，利用where语句筛选，位置在group_by字句的前面
2. **分组后的筛选**：分组后的筛选是利用已经重新分配的组内的信息进行筛选，这些信息不直接存储于数据库中。利用having语句筛选，位置在group_by字句的后面

```sql


# 分组查询
/*
语法：

SELECT 分组函数,列（要求出现在group_by后面）
FROM 表
【WHERE 筛选条件】
GROUP BY 分组列表
【ORDER BY 子句】

注意：查询列表比较特殊，要求是分组函数和group_by后出现的字段

分组查询中的筛选可以分为两类
1. 分组前的筛选：分组前的筛选也就是筛选的内容在数据库中就存在，
可以直接利用对应列筛选，利用where语句筛选，位置在group_by字句的前面
2. 分组后的筛选：分组后的筛选是利用已经重新分配的组内的信息进行筛选，
这些信息不直接存储于数据库中。利用having语句筛选，位置在group_by字句的后面
*/

# 查询每个部门平均工资
SELECT AVG(salary) AS 平均工资,job_id AS 部门
FROM employees
GROUP BY job_id;

# 查询每个位置上的部门个数
SELECT COUNT(*) ,location_id
FROM departments
GROUP BY location_id; 

# 添加筛选条件
# 查询邮箱中包含A字符的，每个部门的平均工资
SELECT AVG(salary),department_id
FROM employees
WHERE email LIKE '%A%'
GROUP BY department_id;

# 查询哪个部门员工个数大于2（添加分组后的筛选）
/*
这里不是利用employees表中的原数据进行筛选，
而是根据筛选后的结果进行二次筛选，
所以不能再用where关键字，而是在最后追加having关键字
*/
SELECT COUNT(*) ,department_id
FROM employees
GROUP BY department_id
HAVING COUNT(*)>2;


# 查询每个部门有奖金的最高工资
SELECT MAX(salary) ,job_id
FROM employees
WHERE commission_pct IS NOT NULL
GROUP BY job_id;


# 查询领导编号大于102，并且其手下最低工资大于5000的领导
SELECT MIN(salary) ,manager_id
FROM employees
WHERE manager_id>102
GROUP BY manager_id
HAVING MIN(salary)>5000;
```



## 连接查询

### 含义：
又称为多表查询，当查询的字段来自于多个表时，就会用到连接查询

### 分类：
#### 按年代分类：
- sql92标准（仅支持内连接）
- sql99标准（除了全外连接外都支持）【推荐】
#### 按功能分类：
- 内连接（包括等值连接，非等值连接，子连接）
- 外连接（包括左外连接，右外连接，全外连接）
- 交叉连接

```sql
# DQL函数语句--连接查询

/*
含义：又称为多表查询，当查询的字段来自于多个表时，就会用到连接查询

分类：
按年代分类：sql92标准（仅支持内连接），sql99标准（除了全外连接外都支持）【推荐】
按功能分类：内连接（包括等值连接，非等值连接，子连接）
						外连接（包括左外连接，右外连接，全外连接）
						交叉连接
*/

/*
笛卡尔乘积现象
不利用连接查询，而贸然利用两个表格数据匹配结果，不添加连接条件。最终得到的结果是表一和表二的完全匹配
例如想要通过boys表和beauty表匹配对象，假如写作下式
SELECT NAME,boyName FROM boys,beauty;
最终得到4*12=48条数据，这与我们想要的结果不符，而只是单纯的完全匹配
所以我们需要连接查询
*/

#错误格式
SELECT NAME,boyName FROM boys,beauty;
#正确格式
SELECT NAME,boyName 
FROM boys,beauty
WHERE beauty.boyfriend_id=boys.id;




# 等值连接
SELECT NAME,boyName 
FROM boys,beauty
WHERE beauty.boyfriend_id=boys.id;


# 起别名后进行等值连接
# 起别名后在select语句中的表名也需要修改为别名
SELECT last_name,e.job_id,job_title
FROM employees e,jobs j
WHERE e.`job_id`=j.`job_id` ;


# 等值查询后可以进行模糊查询等，用AND语句连接即可



# 非等值连接
# 相较于等值查询的主要区别就是替换了查询语句的等于为其他判断符号



# 自连接
# 本质就是只在自己表内部的等值连接
# 查询 员工名和上级名称
SELECT e.employee_id,e.last_name,m.employee_id,m.last_name
FROM employees e,employees m
WHERE e.`manager_id`=m.`employee_id`;



# sql99语法
/*
语法：
SELECT 查询列表
FROM 表1 别名 【连接类型】
JOIN 表2 别名
ON 连接条件
【WHERE 筛选条件】
【GROUP BY 分组】
【HAVING 筛选条件】
【ORDER BY 排序列表】


sql99语法包括（连接类型）：
内连接(INNER)
外连接
		左外(LEFT 【OUTER】)
		右外(LEFT 【OUTER】)
		全外(FULL 【OUTER】)
交叉连接(CROSS)

*/



# 内连接
/*
SELECT 查询列表
FROM 表1 别名
INNER JOIN 表2 别名
ON 连接条件;

INNER可以省略
筛选条件放在where后面，连接条件放在on后面，提高分离性，便于阅读

*/
# 等值连接

# 查询部门名与员工名
SELECT last_name,department_name
FROM employees e
INNER JOIN departments d  
ON e.`department_id`=d.`department_id`;


# 外连接

/*
用于查询一个表中有，另一个表中没有的记录

特点：
外连接的查询结果为主表中的所有记录
		如果表中有和它匹配，则显示匹配的值
		如果没有匹配值，则显示null
左外连接，left左边的是主表
右外连接，left右边的是主表
左外和右外交换顺序，可以达到相同的效果
*/


# 左外连接
SELECT b.name,boy.*
FROM beauty b
LEFT OUTER JOIN boys boy
ON b.`boyfriend_id`=boy.`id`;




# 交叉连接
# 本质就是笛卡尔乘积
SELECT b.*,boy.*
FROM beauty b
CROSS JOIN boys boy;
```

[外连接](https://www.bilibili.com/video/BV1uJ411k7wy?p=523)


## 子查询


### 含义：
出现在其他语句中的select语句，称为子查询或内查询
外部出现的查询语句，称为主查或外查询

### 分类：
#### 按子查询出现的位置：
- SELECT 后面(仅支持标量子查询)
- FROM 后面（支持表子查询）
- WHERE或HAVING后面（标量子查询，列子查询，行子查询）
- EXISTS 后面（表子查询）
#### 按结果集的行列数不同：
- 标量子查询（结果集只有一行一列）
- 列子查询（结果集只有一列多行）
- 行子查询（结果集有一行多列）
- 表子查询（结果集一般多行多列）

```sql
# 子查询
/*
含义：
出现在其他语句中的select语句，称为子查询或内查询
外部出现的查询语句，称为主查或外查询

分类：
按子查询出现的位置：
		SELECT 后面(仅支持标量子查询)
		FROM 后面（支持表子查询）
		WHERE或HAVING 后面（标量子查询，列子查询，行子查询）
		EXISTS 后面（表子查询）
按结果集的行列数不同：
		标量子查询（结果集只有一行一列）
		列子查询（结果集只有一列多行）
		行子查询（结果集有一行多列）
		表子查询（结果集一般多行多列）
*/



# WHERE或HAVING 后面
/*
1. 标量子查询（单行子查询）

2. 列子查询（多行子查询）

3. 行子查询（多行多列）


特点：
子查询放在小括号内
子查询一般放在条件右侧
标量子查询一般搭配单行操作符使用（>,<,=,>=,<=,<>等等）
列子查询一般搭配多行操作符使用（in,any/some,all）
子查询的执行优先于主查询，主查询的条件用到了子查询的结果

*/


# 标量子查询

# 查询谁的工资比Abel高
# 1. 查询Abel工资（单行查询）
SELECT salary
FROM employees
WHERE last_name= 'Abel';
# 2.查询员工信息，满足salary大于1中结果的
SELECT *
FROM employees
WHERE salary>(
	SELECT salary
	FROM employees
	WHERE last_name= 'Abel'
);
# 子查询内部不需要;作为结束标志


# 非法使用标量子查询
SELECT MIN(salary),department_id 
FROM employees
GROUP BY department_id
HAVING MIN(salary)>(
	SELECT salary
	FROM employees
	WHERE department_id=50
);
# 以上语句会报错，因为子查询语句的结果不为一行一列，所以不能用标量子查询（多行多列或0行0列都不可以）


# 列子查询（多行子查询，因为子查询结果是一列多行）
/*
多行操作符：
IN/NOT IN   等于/不等于列表中的任意一个
ANY/SOME 和子查询中的某个值作比较，例如15>ANY(40,10,25)，因为15>10所以上式成立
ALL 和子查询返回的所有值比较，例如15>ANY(40,10,25)，因为40>15所以上式不成立

*/


# 返回location_id是1400或1700的部门中的员工姓名
# 1. location_id是1400或1700的部门号
SELECT department_id
FROM departments
WHERE location_id IN(1400,1700);

# 2. 查询符合条件的员工姓名
SELECT last_name
FROM employees
WHERE 
	department_id IN(
		SELECT department_id
		FROM departments
		WHERE location_id IN(1400,1700)
);





# 行子查询（一行多列或多行多列）

# 查询员工编号最小并且工资最高的员工信息（不一定存在同时满足两个条件的员工）
# 1. 查询最小的员工编号
SELECT MIN(employee_id)
FROM employees
# 2. 查询最高工资
SELECT MAX(salary)
FROM employees
# 3. 查询同时满足这两个条件的员工
SELECT *
FROM employees
WHERE employee_id=(
	SELECT MIN(employee_id)
	FROM employees
)AND(
	SELECT MAX(salary)
	FROM employees
);
# 利用行子查询代替上式
SELECT *
FROM employees
WHERE (employee_id,salary)=(
	SELECT MIN(employee_id),MAX(salary)
	FROM employees
)




# 放在SELECT后面

# 查询每个部门员工个数
SELECT d.*,(
	SELECT COUNT(*)
	FROM employees e
	WHERE e.`department_id`=d.`department_id`
)
FROM departments d;


# 放在from后面

# 查询每个部门的平均工资等级
# 1. 查询每个部门的平均工资
SELECT AVG(salary),department_id
FROM employees
GROUP BY department_id;
# 2. 查询工资等级
SELECT ag_dep.*,g.`grade_leve`
FROM (
	SELECT AVG(salary) ag,department_id
	FROM employees
	GROUP BY department_id
) ag_dep  # 起别名
INNER JOIN job_grades g
ON ag_dep.ag BETWEEN lowest_sal AND highest_sal; 



# exists后面（相关子查询）
/*
语法：EXISTS(完整查询语句)
结果只有0或1
*/
# 判断employees中是否存在employee_id这一列
SELECT EXISTS(SELECT employee_id FROM employees);
# 判断是否存在工资为30000的人
SELECT EXISTS(SELECT employee_id FROM employees WHERE salary=30000);
```


## 分页查询

### 应用场景：
当要显示的数据，一夜显示不全，需要分页提交sql请求

LIMIT 语句放在查询语句的最后

```sql
# 分页查询
/*
应用场景：
当要显示的数据，一夜显示不全，需要分页提交sql请求


语法：
SELECT 查询列表
FROM 表名
【JOIN TYPE join 表2
ON 连接条件
WHERE 筛选条件
GROUP BY 分组字段
HAVING 分组后的筛选
ORDER BY 排序的字段】
LIMIT offset,zize;

offset表示条目的起始索引（起始索引从0开始）
size表示要显示的条目个数

LIMIT 语句放在查询语句的最后
*/

SELECT * FROM employees LIMIT 0,5;
SELECT * FROM employees LIMIT 10,15;
```


## 联合查询
### union查询：
将多条查询语句的结果合并成一个结果

### 应用场景：
要查询结果来自多个表，且多个表没有直接的连接关系，单查询的信息一致

### 特点：
要求多条查询语句的查询列数是一致的
要求多条查询语句每一列的类型和顺序最好是一致的
UNION关键字会自动去重，如果不想去重可以使用UNION ALL关键字

```sql
# 联合查询

/*
union查询：将多条查询语句的结果合并成一个结果

语法：
查询语句
union
查询语句
...

应用场景：要查询结果来自多个表，且多个表没有直接的连接关系，单查询的信息一致

特点：
要求多条查询语句的查询列数是一致的
要求多条查询语句每一列的类型和顺序最好是一致的
UNION关键字会自动去重，如果不想去重可以使用UNION ALL关键字
*/

# 查询部门编号>90或邮箱中包含a的员工信息
SELECT * FROM employees WHERE email LIKE '%a%' OR department_id>90;
# 用联合查询来完成
SELECT * FROM employees WHERE email LIKE '%a%' 
UNION SELECT * FROM employees WHERE department_id>90;
```