---
author: Boyu Ren
pubDatetime: &id001 2023-07-29 20:44:56
modDatetime: *id001
title: Access Control
slug: Access-Control
featured: false
draft: false
tags:
- 网络安全
- 计算机安全
description: '向系统实体授予权利或权限以提供对特定资源的访问的过程，也称访问控制（Access Control）'
---

# FOCUS OF THIS LECTURE

- Identify access control requirements
- Know access control elements
- Understand access control systems


# 授权（AUTHORISATION）

向系统实体授予权利或权限以提供对特定资源的访问的过程，也称访问控制（Access Control）

## 访问控制要求（ACCESS CONTROL REQUIREMENTS）

- 可靠的输入（Reliable inputs）
  - 经过身份认证的实体，例如使用UPI或密码登录
  - 真实的资料，例如学生或教职工成员
- 最小特权（Least privilege）
  -  最小特权原则表示授予完成某项工作的最低访问权限集，例如，访问单个课程与所有课程
- 管理职责（Administrative duties）
  - 只有特殊实体才能管理访问权限，例如，管理员授予、撤销或更新访问权限



## 访问控制组件（AC ELEMENTS）

- 主体（Subject）
  - 可以访问对象的实体，它可以是用户也可以是用户授权的进程
- 对象（Object）
  - 需要被保护的实体，例如文件、目录或其他资源
- 访问权限（Access right）
  - 一个访问权限r ∈ R 描述了一个主体s ∈ S 如何访问对象o ∈ O 
  - 例如：读、写、执行、删除、创建、搜索等

## 访问控制系统（AC SYSTEM）

- 访问控制方法（AC Function）f(s, o, r)
  - 它查找（s, o）组合的访问权限 r 
  - 如果匹配成功，则允许访问，否则不允许访问
- 安全管理员（Security administrator）
  - 管理访问权限的实体
- 审计员（Auditor）
  - 检查整个授权系统的实体

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230730135723.jpg)

## 访问控制模型（AC MODELS）

### 自主访问控制 Discretionary Access Control (DAC)

用户可以自主保护自己拥有的内容
- 所有者可以授予主体访问权限
- 根据请求者的身份授予访问权限
- 这些机制足以满足诚实用户的要求
- 容易受到特洛伊木马的攻击
- DAC 用于操作系统
  - 例如，Linux 文件权限: rwxr-x--x

访问控制矩阵

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230730140543.jpg)

### 基于角色的访问控制 ROLE-BASED ACCESS CONTROL (RBAC)

RBAC 将角色映射到访问权限
- 支持复杂的访问控制
- 减少管理错误
- 易于管理
  - 将用户移入和移出角色
  - 将权限移入和移出角色
  - 非常灵活
- 最小特权
  - 根据需要限制访问
  - 通过约束进行职责分离

RBAC模型构成
- 用户User
  - 通常是人类
  - 用户被分配角色：用户分配（UA）
- 权限Permissions
  - 批准访问某些对象的模式
  - 权限代表可以对对象执行哪些操作
- 角色Roles
  - 职务
  - 角色分配权限：权限分配（PA）
- 分配Assignments
  - 用户角色和角色权限
- 会话Session
  - 用户到角色的映射
  - 会话是用户和已分配角色的激活子集之间的映射
- 约束Constraints
  - 会话、分配和角色

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230730142000.jpg)


