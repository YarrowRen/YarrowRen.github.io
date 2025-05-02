---
author: Boyu Ren
pubDatetime: &id001 2023-07-25 17:02:00
modDatetime: *id001
title: Password
slug: Password
featured: false
draft: false
tags:
- 网络安全
- 计算机安全
description: 'Understand identification and authentication, Learn how passwords are protected'
---

# FOCUS OF THIS LECTURE

- Understand identification and authentication
- Learn how passwords are protected


# 身份识别和认证

## 身份识别（IDENTIFICATION）

系统实体提供其声明的身份的过程，例如UPI（统一支付接口）

## 认证（Authentication）

**验证**系统实体声明的身份的过程，例如PIN码或秘密

# 密码漏洞（PASSWORD VULNERABILITIES）

## Offline dictionary attack 离线字典攻击

离线字典攻击就是攻击者获取到口令文件（字典），有了离线字典文件后,针对口令文件攻击者直接查表，一旦哈希值匹配成功了，那么就可以得到口令明文。


应对策略：
- 防止未经授权访问密码文件
- 识别入侵的入侵检测措施
- 快速重新发布密码

## Specific account attack 特定账户攻击

攻击者针对某些特定账户进行攻击，不断猜测并提交密码直到成功

应对策略：
- 尝试失败一定次数后锁定机制
- 另一种方法是逐渐延迟每次后续尝试

## Popular password attack 流行密码攻击
用户倾向于选择容易记住的密码（例如：“123456”），这使得密码很容易被猜出，攻击者可以针对各种用户 ID 尝试常用密码

应对策略：
- 实施复杂的密码策略
- 扫描 IP 地址和客户端 cookie 以获取提交模式
- 入侵检测

## Password guessing against single user 针对单个用户的密码猜测

了解单个用户的相关信息，了解系统密码策略，使用两者来猜测密码

应对策略：
- 教育用户
- 执行复杂的密码策略

## Workstation hijacking 工作站劫持

攻击者等待，直到登录的工作站无人值守

应对策略：
- 一段时间不活动后注销
- 入侵检测方案可用于检测用户行为的变化

## Exploiting user mistakes 利用用户错误
用户可能会使用系统分配的密码，根本问题是这些密码可能很难记住，攻击者可以使用社会工程技巧来诱骗用户泄露密码，其次，许多系统附带了管理员的默认密码

应对策略：
- 更改默认密码
- 教育用户


## Exploiting same password use 利用相同的密码复用

用户可能在不同的服务选择使用相同的密码，攻击者可以从一个来源获知密码，他们可以尝试在用户可能使用的其他服务中使用相同的密码进行攻击

应对策略：
- 选择不同的密码
- 教育用户




## Electronic monitoring 电子监控

以明文形式传递密码，攻击者很容易窃听并获取密码

应对策略：
- 切勿以明文形式发送密码
- 密码安全传输的技术解决方案





# 加盐的密码加载过程（LOADING PASSWORD: SALT WITH HASH）


为了缓解某些密码漏洞，可以使用盐，盐可以是随机数，盐会增加攻击者的工作量

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230725211849.jpg)

注册时，服务器可以存储 
- UserID 
- Salt
- 加盐密码的哈希值

# 加盐的密码验证过程（VERIFYING PASSWORD: SALT WITH HASH）

用户提供用户 ID 和密码，查找相应的盐和哈希，根据检索到的盐和输入的密码重新计算哈希，如果结果匹配，则接受密码

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230725212215.jpg)

# 随机盐的好处

- 很难猜测一个用户是否为多个服务选择相同的密码
- 很难猜测多个用户是否为单个服务（或多个）选择相同的密码
- 使离线字典攻击变得困难


攻击者可以使用彩虹表来预先计算带有加盐哈希值的字典
- 解决方案是使用大盐

# 多重身份验证 MULTI-FACTOR AUTHENTICATION

不同的身份验证因素或方式 

Different factors or means of authentication
- Something you know
  - E.g., PIN or password
- Something you have (token)
  - E.g., smartcard
- Something you are (static biometrics)
  - E.g., fingerprint
- Something you do (dynamic biometrics)
  - E.g., voice pattern or behaviour analysis

使用两个或多个因素来启用双因素或多因素身份验证

# 对策（COUNTERMEASURES）总结

- Educate users
- Use multi-factor authentication
- Better notifications to users for password reset
- Phone call and reply by voice in case of
- password reset

