---
author: Boyu Ren
pubDatetime: &id001 2021-03-28 14:59:07
modDatetime: *id001
title: 4-DML 数据操控语言
slug: 4-DML数据操控语言
featured: false
draft: false
tags:
- MySQL
description: DML用于对数据库表中的数据进行插入、更新和删除操作，核心语句包括INSERT、UPDATE和DELETE/TRUNCATE，影响数据而不改变表结构。
---

# DML（Data Manipulation Language）数据操控语言

DML 主要用于 **对表中的数据进行增、改、删操作**，而不会影响表结构本身。  
DML 的核心语句包括：

- `INSERT`：插入数据
- `UPDATE`：修改数据
- `DELETE / TRUNCATE`：删除数据

---

## 一、插入语句（INSERT）

### 1. 基本语法（推荐）

```sql
INSERT INTO 表名(列名1, 列名2, ...)
VALUES(值1, 值2, ...);
````

> 插入的值类型必须与列类型一致或兼容。

---

### 2. 插入示例

```sql
INSERT INTO student(name, age, score, birth)
VALUES('Leslie', 19, 100, '2001-02-14');
```

---

### 3. 可为 NULL 的列如何插入

对于 **允许为 NULL** 的列，有两种方式：

```sql
-- 方式一：显式赋值 NULL
INSERT INTO student(name, age, score, birth)
VALUES('John', 18, NULL, '2001-05-21');

-- 方式二：在列名中省略该列
INSERT INTO student(name, age, birth)
VALUES('Lala', 18, '2003-03-22');
```

> ⚠️ 不允许为 `NULL` 的列必须显式提供值。

---

### 4. 列顺序与省略列名

```sql
-- 列顺序可调整，只要和值一一对应
INSERT INTO student(name, score, age, birth)
VALUES('Lily', 56, 18, '2001-03-18');

-- 省略列名：必须与表结构顺序完全一致
INSERT INTO student
VALUES('Hugo', 19, 92, '2001-09-16');
```

---

### 5. 第二种插入方式（SET）

```sql
INSERT INTO student
SET name = 'Jax', age = 20;
```

**特点：**

* 不支持多行插入
* 不支持子查询
* 可读性较好，但使用较少

---

### 6. 多行插入（推荐）

```sql
INSERT INTO student
VALUES
('boy1', 19, 92, '2001-09-16'),
('boy2', 19, 92, '2001-09-16'),
('boy3', 19, 92, '2001-09-16');
```

---

### 7. 插入子查询结果

```sql
INSERT INTO student(name)
SELECT 'Leslie';
```

> 仅第一种 `INSERT INTO ... VALUES / SELECT` 方式支持子查询。

---

## 二、修改语句（UPDATE）

### 1. 修改单表记录

#### 语法

```sql
UPDATE 表名
SET 列1 = 新值1, 列2 = 新值2
WHERE 筛选条件;
```

> ⚠️ 不加 `WHERE` 会修改整张表的数据。

#### 示例

```sql
UPDATE student
SET score = 99, age = 17
WHERE name LIKE '%boy%';
```

---

### 2. 修改多表记录

#### SQL99（推荐）

```sql
UPDATE 表1 别名
INNER JOIN 表2 别名
ON 连接条件
SET 列 = 新值
WHERE 筛选条件;
```

#### 示例

```sql
UPDATE boys bo
INNER JOIN beauty b ON bo.id = b.boyfriend_id
SET b.phone = '114'
WHERE bo.boyName = '张无忌';
```

---

## 三、删除语句（DELETE / TRUNCATE）

### 1. 使用 DELETE 删除数据

#### 单表删除

```sql
DELETE FROM 表名
WHERE 筛选条件;
```

```sql
DELETE FROM student WHERE age = 18;
```

---

#### 多表删除（SQL99）

```sql
DELETE 表别名
FROM 表1 别名
INNER JOIN 表2 别名 ON 连接条件
WHERE 筛选条件;
```

```sql
DELETE b
FROM beauty b
INNER JOIN boys bo ON b.boyfriend_id = bo.id
WHERE bo.boyName = '张无忌';
```

---

### 2. 使用 TRUNCATE 清空表

```sql
TRUNCATE TABLE boys;
```

* 直接删除表中 **所有数据**
* 不可添加 `WHERE` 条件

---

### 3. DELETE 与 TRUNCATE 的区别

| 对比项        | DELETE | TRUNCATE |
| ---------- | ------ | -------- |
| 是否支持 WHERE | ✅ 支持   | ❌ 不支持    |
| 执行效率       | 较低     | 较高       |
| 自增列        | 从断点继续  | 从 1 重新开始 |
| 返回值        | 返回影响行数 | 无返回值     |
| 是否可回滚      | ✅ 可以   | ❌ 不可以    |
| 本质         | DML    | DDL      |

---

## 四、小结

* DML 用于 **操作表中的数据**
* `INSERT`：插入数据（推荐使用列名方式）
* `UPDATE`：修改数据（务必加 WHERE）
* `DELETE`：条件删除数据
* `TRUNCATE`：快速清空整张表（慎用）

<!-- 2026.01.28由GPT5.2优化全文 -->