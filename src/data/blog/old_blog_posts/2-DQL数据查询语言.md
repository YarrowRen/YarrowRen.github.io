---
author: Boyu Ren
pubDatetime: &id001 2021-03-27 23:10:45
modDatetime: *id001
title: 2-DQL 数据查询语言
slug: 2-DQL数据查询语言
featured: false
draft: false
tags:
- MySQL
description: MySQL 中 DQL（数据查询语言）的核心语法，包括基础查询、条件查询与排序查询。
---

# DQL（Data Query Language）数据查询语言

DQL 是 SQL 中最常用的一类语言，主要用于 **从数据库中查询数据**。其核心关键字是 `SELECT`。

---

## 一、DQL 基础查询（SELECT）

### 1. 基本语法

```sql
SELECT 查询列表
FROM 表名;
````

> `FROM` 子句在某些数据库中不可省略，但查询常量或表达式时可不依赖表。

---

### 2. 基本特点

1. 查询列表可以是：

   * 表中的字段
   * 常量
   * 表达式
   * 函数
2. 查询结果是一个 **虚拟表**（结果集），不会影响原表数据

---

### 3. 基础示例

```sql
-- 选中指定数据库
USE myemployees;

-- 查询单个字段
SELECT last_name FROM employees;

-- 查询多个字段（顺序任意）
SELECT last_name, first_name, email FROM employees;

-- 查询所有字段
SELECT * FROM employees;
```

---

### 4. 列名与反引号

当字段名与关键字冲突或包含特殊字符时，可以使用 **反引号（`）**：

```sql
SELECT `salary` FROM employees;
```

> 注意：反引号 ≠ 单引号

---

### 5. 查询常量、表达式和函数

```sql
-- 常量
SELECT 100;
SELECT 'Steven';

-- 表达式
SELECT 98 * 10;

-- 函数
SELECT VERSION();
```

---

### 6. 起别名（AS）

**作用：**

* 提高可读性
* 解决字段名重复问题

```sql
-- 使用 AS
SELECT 100 * 5 AS result;
SELECT last_name AS 姓, first_name AS 名 FROM employees;

-- 省略 AS（别名包含特殊字符需加引号）
SELECT last_name 姓, first_name 名 FROM employees;
```

---

### 7. 去重（DISTINCT）

```sql
SELECT DISTINCT department_id FROM employees;
```

---

### 8. `+` 号的注意事项（MySQL）

在 SQL 中，`+` **仅表示数值运算**，不能用于字符串拼接：

```sql
-- 字符串拼接应使用 CONCAT
SELECT CONCAT(last_name, ' ', first_name) AS 姓名 FROM employees;
```

`+` 的规则：

* 两边都是数字：数值运算
* 字符串可转数字：转为数字再运算
* 转换失败：按 0 处理
* 任一为 `NULL`：结果为 `NULL`

---

## 二、DQL 条件查询（WHERE）

### 1. 基本语法

```sql
SELECT 查询列表
FROM 表名
WHERE 筛选条件;
```

**执行顺序：**

1. `FROM`
2. `WHERE`
3. `SELECT`

---

### 2. 条件分类

#### （1）条件表达式

运算符：
`> < = != <> >= <=`
（推荐使用 `<>` 表示不等）

```sql
-- 工资大于 12000
SELECT * FROM employees WHERE salary > 12000;

-- 部门编号不等于 90
SELECT CONCAT(first_name,' ',last_name) 姓名, department_id
FROM employees
WHERE department_id <> 90;
```

---

#### （2）逻辑运算符

* `AND`（与）
* `OR`（或）
* `NOT`（非）

```sql
-- 工资在 10000 到 20000 之间
SELECT first_name, last_name, salary
FROM employees
WHERE salary > 10000 AND salary < 20000;

-- 工资高于 15000 或部门不为 90
SELECT last_name, salary, department_id
FROM employees
WHERE salary > 15000 OR department_id <> 90;
```

---

#### （3）模糊查询

##### LIKE + 通配符

* `%`：任意多个字符（含 0 个）
* `_`：任意单个字符

```sql
SELECT last_name, salary
FROM employees
WHERE last_name LIKE '_o__h%';
```

**转义通配符：**

```sql
-- 使用反斜杠
SELECT * FROM employees
WHERE job_id LIKE '__\_%';

-- 使用 ESCAPE
SELECT * FROM employees
WHERE job_id LIKE '__$_%' ESCAPE '$';
```

---

##### BETWEEN AND

* 包含边界值
* 顺序不可颠倒

```sql
SELECT *
FROM employees
WHERE employee_id BETWEEN 100 AND 120;
```

---

##### IN

```sql
SELECT last_name, job_id
FROM employees
WHERE job_id IN ('IT_PROG', 'AD_VP', 'AD_PRES');
```

特点：

* 等价于多个 `OR`
* 列表元素类型需兼容
* 不支持通配符

---

##### IS NULL / IS NOT NULL

```sql
SELECT last_name, commission_pct
FROM employees
WHERE commission_pct IS NULL;
```

> `=` 和 `<>` **不能用于判断 NULL**

---

##### 安全等于 `<=>`

```sql
SELECT last_name, commission_pct, job_id
FROM employees
WHERE job_id <=> 'SA_REP'
   OR commission_pct <=> NULL;
```

> 可判断 `NULL`，但可读性较差，不推荐频繁使用

---

## 三、DQL 排序查询（ORDER BY）

### 1. 基本语法

```sql
SELECT 查询列表
FROM 表名
[WHERE 筛选条件]
ORDER BY 排序字段 [ASC | DESC];
```

说明：

* `ASC`：升序（默认）
* `DESC`：降序
* `ORDER BY` 通常位于语句末尾（`LIMIT` 除外）

---

### 2. 排序示例

```sql
-- 工资降序
SELECT * FROM employees ORDER BY salary DESC;

-- 工资升序
SELECT * FROM employees ORDER BY salary ASC;
```

---

### 3. 排序 + 条件

```sql
SELECT last_name, department_id, hiredate
FROM employees
WHERE department_id >= 90
ORDER BY hiredate;
```

---

### 4. 按表达式、别名和函数排序

```sql
-- 按年薪排序
SELECT last_name,
       salary * 12 * (1 + IFNULL(commission_pct, 0)) AS 年薪
FROM employees
ORDER BY 年薪 DESC;

-- 按函数排序
SELECT last_name, salary, LENGTH(last_name) AS 长度
FROM employees
ORDER BY LENGTH(last_name);
```

---

### 5. 多字段排序

```sql
-- 先按工资升序，再按员工编号降序
SELECT last_name, salary, employee_id
FROM employees
ORDER BY salary ASC, employee_id DESC;
```

---

## 四、小结

* DQL 是 SQL 中最核心、使用最频繁的部分
* 核心关键字：`SELECT`
* 常见子句：

  * `WHERE`：条件筛选
  * `ORDER BY`：排序

<!-- 2026.01.28由GPT5.2优化全文 -->