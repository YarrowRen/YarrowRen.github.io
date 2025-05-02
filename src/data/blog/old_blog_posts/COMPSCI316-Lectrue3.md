---
author: Boyu Ren
pubDatetime: &id001 2023-07-18 18:18:22
modDatetime: *id001
title: 'COMPSCI 316: Lectrue 3'
slug: COMPSCI316-Lectrue3
featured: false
draft: false
tags:
- 网络安全
- 计算机安全
description: '- Understand computer security'
---

# Lectrue 3

- Understand computer security
- Understand human aspect of security
- Understand network security
- Next, we can build on these three to understand cyber security

# OSI 安全架构

OSI 安全架构分为三大类，即安全攻击、安全机制和安全服务。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230720025356.jpg)

## 安全攻击（Security attack）
安全攻击是指个人或实体企图获得未经授权的访问以破坏或损害系统、网络或设备的安全性。

- 被动攻击（Passive attack）：试图从系统中学习或利用信息，但不影响系统资源。
  - 窃听（Release of message content / disclosure）：攻击者在两方不知情的情况下拦截和收听他们之间的通信。
  - 流量分析（Traffic analysis）：攻击者分析网络流量模式和元数据以收集有关系统、网络或设备的信息。入侵者无法读取消息，只能了解加密的模式和长度。可以使用多种技术执行流量分析，例如网络流量分析或协议分析。
- 主动攻击（Active attack）：试图改变系统资源或影响其运行。
  - 伪装（Masquerade）：攻击者伪装成真实的发件人以获得对系统的未授权访问。这种类型的攻击可能涉及攻击者使用窃取或伪造的凭据，或者以其他方式操纵身份验证或授权控制。
  - 重放（Replay）：攻击者通过被动通道拦截传输的消息，然后恶意或欺诈地重放或延迟它。
  - 消息修改（Message modification）：攻击者修改传输的消息并使接收方收到的最终消息看起来不安全或无意义。
  - 拒绝服务攻击（Denial of Service, DoS）：攻击者向系统、网络或设备发送大量流量，以试图使其不堪重负并使其对合法用户不可用。

## 安全服务（Security service）

安全服务是指可用于维护组织安全的不同服务。它们有助于防止任何潜在的安全风险。安全服务分为6类：

- 身份验证（Authentication）：验证用户或设备身份以授予或拒绝对系统或设备的访问权限的过程。
- 访问控制（Access control）或授权（authorisation）：使用策略和过程来确定允许谁访问系统内的特定资源。
- 机密性（Confidentiality）：保护信息不被访问或泄露给未授权方。
- 数据完整性（Data integrity）：使用技术来确保数据在传输或存储期间未被篡改或以任何方式更改。
- 不可否认性（Non-repudiation）：使用技术来创建消息来源和传输的可验证记录，防止发件人否认他们发送了消息。
- 可行性（Availability）：保证系统可以按需使用和访问

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230720031629.jpg)


## 安全机制（Security mechanisms）
为识别任何安全漏洞或对组织的攻击而构建的机制称为安全机制。

- 加密（Encryption）：使用算法将数据转换为只能由具有适当解密密钥的人读取的形式。
- 数字签名（Digital signature）：使用密码技术为数字文档或消息创建唯一的、可验证的标识符，可用于确保文档或消息的真实性和完整性。
- 访问控制机制（Access control mechanism）：用于保证访问权的技术
- 公证（Notarisation）：使用可信任的一方来确保数据交换的安全
- 密码（Password）：授权方已知的秘密短语或单词

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230720033351.jpg)


# Network Security & Cyber Security

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/resize,w_670.png)

## Network Security

> Network Security is the process of taking physical and software preventative measures to protect the underlying networking infrastructure from unauthorized access, misuse, malfunction, modification, destruction, or improper disclosure, thereby creating a secure platform for computers, users and programs to perform their permitted critical functions within a secure environment

## Cyber Security

> Cyber security is the collection of tools, policies, security concepts, security safeguards, guidelines, risk management approaches, actions, training, best practices, assurance and technologies that can be used to protect the cyber environment and organization and user’s assets