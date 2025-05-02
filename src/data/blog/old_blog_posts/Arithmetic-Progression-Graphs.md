---
author: Boyu Ren
pubDatetime: &id001 2023-08-02 21:52:10
modDatetime: *id001
title: Arithmetic Progression Graphs
slug: Arithmetic-Progression-Graphs
featured: false
draft: false
tags:
- 算法
description: 算术级数图（Arithmetic Progression Graphs, APG），也称为等差数列图，是等差数列的可视化表示。等差数列是一组数字，其中任意两个连续项之间的差值总是相同的。这个常数差值被称为算术级数的公差。
---

# Arithmetic Progression Graphs

算术级数图（Arithmetic Progression Graphs, APG），也称为等差数列图，是等差数列的可视化表示。等差数列是一组数字，其中任意两个连续项之间的差值总是相同的。这个常数差值被称为算术级数的公差。

APG的顶点权重依序成等差数列，与某一顶点相连的所有边的权重之和等于顶点权重，例如下图所示：

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230805211125.jpg)

## APG一些已知特性
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230805211357.jpg)

## 判断APG
给定一副图，并确定图的所有顶点值（已知图的顶点值成等差数列），这幅图是否能够称为APG？

问题的本质主要是确定是否存在满足条件的边的权重序列，确保与顶点相连的边的权重值之和等于顶点权重值

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230805212244.jpg)

