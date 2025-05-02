---
author: Boyu Ren
pubDatetime: &id001 2021-04-04 21:36:58
modDatetime: *id001
title: 13-DCL用户管理语言
slug: 13-DCL用户管理语言
featured: false
draft: false
tags:
- MySQL
description: '```sql'
---

# DCL-用户管理语言

```sql
show DATABASES;

# 切换到mysql数据库
use mysql;
# 查看user表
SELECT * from user;
# 创建用户语法
# CREATE USER '用户名'@'主机名' IDENTIFIED BY '密码';
# localhost表示本地主机 通配符%表示任意主机（可远程访问）
CREATE USER 'renboyu'@'%' IDENTIFIED BY 'renboyu01';
# 修改密码
# UPDATE USER SET authentication_string=PASSWORD('新密码')WHERE USER='用户名';
# PASSWORD()函数为加密函数
UPDATE user SET authentication_string = PASSWORD('010214') WHERE User='renboyu';
# 删除用户
# DROP USER '用户名'@'主机名';
DROP USER 'renboyu'@'%';


# 忘记MySQL数据库中的root密码后如何修改密码并登录
# https://www.bilibili.com/video/BV1uJ411k7wy?p=537


# 权限管理

# 查询权限
# SHOW GRANTS '用户名'@'主机名';
SHOW GRANTS FOR 'renboyu'@'%';

# 授予权限
# GRANT 权限列表 ON 数据库名.表名 TO '用户名'@'主机名';
GRANT SELECT,DELETE,UPDATE ON jdbcTest.bank TO 'renboyu'@'%';
# 授予所有权限给所有表，可以采用通配符的方式
GRANT ALL ON *.* TO 'renboyu'@'%';

# 撤销权限
# REVOKE 权限列表 ON 数据库名.表名 FROM '用户名'@'主机名';
REVOKE SELECT,DELETE,UPDATE ON jdbcTest.bank FROM 'renboyu'@'%';
```
