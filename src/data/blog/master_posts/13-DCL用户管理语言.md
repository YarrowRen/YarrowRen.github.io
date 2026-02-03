---
author: Boyu Ren
pubDatetime: &id001 2021-04-04 21:36:58
modDatetime: *id001
title: "MySQL安全管理：用户与权限控制详解"
slug: "mysql-user-permissions-management"
featured: false
draft: false
tags:
- MySQL
description: DCL 在 MySQL 中用于管理用户与权限，涉及创建、修改、删除用户和权限授予与撤销，确保数据库安全。
---

# DCL —— 用户管理语言（MySQL）

**DCL（Data Control Language）** 主要用于控制数据库的安全性，核心内容包括：

- 用户管理
- 权限管理

在 MySQL 中，DCL 语句通常作用于 **`mysql` 系统数据库**。

---

## 一、用户管理

### 1. 查看数据库与用户表

```sql
-- 查看所有数据库
SHOW DATABASES;

-- 切换到系统数据库
USE mysql;

-- 查看用户表
SELECT * FROM user;
````

> MySQL 中所有用户信息都存储在 `mysql.user` 表中。

---

## 二、创建用户

### 1. 基本语法

```sql
CREATE USER '用户名'@'主机名' IDENTIFIED BY '密码';
```

### 2. 主机名说明

* `localhost`：只允许本机登录
* `%`：允许任意主机远程登录

---

### 3. 示例：创建用户

```sql
CREATE USER 'renboyu'@'%' IDENTIFIED BY 'renboyu01';
```

---

## 三、修改用户密码

### 1. 修改密码（旧版本写法，基于 user 表）

```sql
UPDATE user
SET authentication_string = PASSWORD('010214')
WHERE User = 'renboyu';
```

> `PASSWORD()` 为 MySQL 的加密函数，用于对明文密码进行加密。

⚠️ 注意：

* 修改 `user` 表后，建议执行：

  ```sql
  FLUSH PRIVILEGES;
  ```

  以立即生效权限更改。

---

## 四、删除用户

### 1. 语法

```sql
DROP USER '用户名'@'主机名';
```

### 2. 示例

```sql
DROP USER 'renboyu'@'%';
```

---

## 五、忘记 root 密码的处理

当忘记 MySQL 的 `root` 用户密码时，需要通过 **跳过权限表** 的方式重置密码，步骤较为繁琐，通常涉及：

* 修改 MySQL 启动参数
* 跳过权限验证启动
* 重置密码后恢复正常模式

👉 参考视频教程：
[https://www.bilibili.com/video/BV1uJ411k7wy?p=537](https://www.bilibili.com/video/BV1uJ411k7wy?p=537)

---

## 六、权限管理

### 1. 查询用户权限

```sql
SHOW GRANTS FOR 'renboyu'@'%';
```

---

### 2. 授予权限

#### 基本语法

```sql
GRANT 权限列表
ON 数据库名.表名
TO '用户名'@'主机名';
```

---

#### 示例 1：授予部分权限

```sql
GRANT SELECT, DELETE, UPDATE
ON jdbcTest.bank
TO 'renboyu'@'%';
```

---

#### 示例 2：授予所有权限（不推荐用于生产环境）

```sql
GRANT ALL ON *.* TO 'renboyu'@'%';
```

说明：

* `*.*` 表示 **所有数据库的所有表**
* `ALL` 表示全部权限

---

### 3. 撤销权限

#### 基本语法

```sql
REVOKE 权限列表
ON 数据库名.表名
FROM '用户名'@'主机名';
```

---

#### 示例

```sql
REVOKE SELECT, DELETE, UPDATE
ON jdbcTest.bank
FROM 'renboyu'@'%';
```

---

## 七、常见权限类型说明

| 权限     | 说明        |
| ------ | --------- |
| SELECT | 查询数据      |
| INSERT | 插入数据      |
| UPDATE | 更新数据      |
| DELETE | 删除数据      |
| ALL    | 所有权限      |
| CREATE | 创建数据库 / 表 |
| DROP   | 删除数据库 / 表 |

---

## 八、小结

* DCL 主要用于 **数据库安全管理**
* 用户信息存储在 `mysql.user` 表中
* 核心操作包括：

  * 创建用户（CREATE USER）
  * 删除用户（DROP USER）
  * 修改密码
  * 授权（GRANT）
  * 回收权限（REVOKE）
* 实际开发中应遵循 **最小权限原则**，避免滥用 `ALL` 权限

<!-- 2026.01.28由GPT5.2优化全文 -->