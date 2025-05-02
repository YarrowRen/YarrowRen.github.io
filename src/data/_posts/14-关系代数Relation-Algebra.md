---
author: Boyu Ren
pubDatetime: &id001 2021-04-18 22:08:18
modDatetime: *id001
title: 14-关系代数Relation Algebra
slug: 14-关系代数Relation-Algebra
featured: false
draft: false
tags:
- MySQL
description: '> 关系代数是一种抽象的查询语言，用对关系的运算来表达查询，作为研究关系数据语言的数学工具。关系代数的运算对象是关系（集合），运算结果亦为关系（集合）。'
---

# 关系代数Relation Algebra

## 概述

> 关系代数是一种抽象的查询语言，用对关系的运算来表达查询，作为研究关系数据语言的数学工具。关系代数的运算对象是关系（集合），运算结果亦为关系（集合）。


- 传统的集合运算：广义笛卡尔积运算，并，交和差运算
- 专门的关系运算：选择，投影，连接和除运算



## 传统的集合运算

### 基本概念

设关系模式为$R(A_1,A_2,...,A_n)$
- R表示关系模式$R(A_1,A_2,...,A_n)$的一个关系
- t表示元组，$t\in R$表示t是R的一个元组，可以理解为数据库某一表中一行实例
- $t[A_i]$表示元组t中相对应于属性$A_i$的一个分量，即表中t元组中$A_i$属性所对应单元格的值
- 若$A=\lbrace A_{i1},A_{i2},A_{i3},...,A_{ik}\rbrace$，其中$A_{i1},A_{i2},....,A_{ik}$是$A_1,A_2,...,A_n$中的一部分，则称A为属性列或属性组，简单来说，属性组就是一个关系所有属性的一个子集
- $t[A]=(t[A_{i1}],t[A_{i2}],...,t[A_{ik}])$表示元组t在属性列A上诸分量的集合，简言之就是按照属性组筛选后的一个元组
- $\overline{A}$表示完整属性集合$\lbrace A_1,A_2,...,A_n\rbrace$中去除A属性组$\lbrace A_{i1},A_{i2},...,A_{ik}\rbrace$后剩余的属性组
- $\overbrace{t_r\ \ t_s}$称为元组的连接
  - R为n元关系，S为m元关系
  - $t_r\in R,t_s\in S$
  - 元组的连接本质上就是直接将两个元组前后连接成一个元组，所以连接后的元组是一个n+m元的元组，前n个分量为R中的一个n元组，后m个分量为S中的一个m元组
- 象集(Images Set)：
  - 给定一个关系R(X,Y),X和Y为属性组
  - 当$t[X]=x$时，x在R中的象集为：$Y_x=\lbrace t[Y] | t\in R,t[X]=x\rbrace$
  - 举例说明：给定一个关系R(学号，总成绩)，则当t[学号]=001时，x在R中的象集表示的就是学号为001的学生的总成绩，只不过实际使用中X和Y都是属性组，其中不仅只有一个属性

### 并运算（Union）

并运算的基本要求
- R和S两个关系必须具有相同的n个元（即两个关系都有n个属性）
- 相应的属性必须取自同一个域下

所以进行并运算后，原本的两个n元关系，仍未n元关系，由属于R或属于S的元组组成
$$R\cup S=\lbrace t|t\in R\vee t\in S\rbrace$$

简言之就是两个属性值完全一致并且属性取值域相同的两个表进行并运算，只是最后要去重

两个关系

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/xxxtable1.png)
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/xxxtable2.png)

进行并运算后

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/xxxtable3.png)


### 交运算（Intersection）

交运算的基本要求
- R和S两个关系必须具有相同的n个元（即两个关系都有n个属性）
- 相应的属性必须取自同一个域下

进行交运算后仍未一个n元关系，由所有既属于R又属于S的元组组成
$$R\cap S=\lbrace t|t\in R\wedge t\in S\rbrace$$
$$R\cap S=R-(R-S)$$

### 差运算（Difference）

差运算的基本要求
- R和S两个关系必须具有相同的n个元（即两个关系都有n个属性）
- 相应的属性必须取自同一个域下

进行差运算后仍未一个n元关系，由所有属于R却不属于S的元组组成
$$R- S=\lbrace t|t\in R\wedge t\notin S\rbrace$$

### 笛卡尔积（Cartesian Product）

R为n元关系，包含$k_1$个分组，S为m元关系，包含$k_2$个分组

经过笛卡尔积的关系，具有n+m元，即n+m列的集合，元组的前n列是R的一个元组，元组的后m列是S的一个元组。一共具有$k_1*k_2$个元组

$$R\times S=\lbrace \overbrace{t_r\ \ t_s}|t_r\in R \wedge t_s\in S\rbrace$$


![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/dikaerji.png)


## 专门的关系运算

### 选择运算（Selection）
选择又被称为限制（Restriction），选择运算符的含义是在关系R中选择满足给定条件的诸元组，即选择是对元组的选择，选择的结果属性个数不会发生改变
$$\sigma_{F}(R)=\lbrace t|t\in R\wedge F(t)=true\rbrace$$
上面的F表示选择条件，是一个逻辑表达式，结果是布尔值

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/selection.png)

例如：Student(name,age,score,dept)是一个学生信息表，属性分别是姓名，年龄，分数和专业，现在通过选择运算获取所有专业为CS的元组

$$\sigma_{dept='CS'}(Student)$$

### 投影运算（Projection）

投影运算符的含义是从R中选择出若干个属性列组成新的关系，简言之就是从关系中选择出完整属性列的子集组成一个新关系

$$\pi_A(R)=\lbrace t[A]|t\in R\rbrace$$
其中的A表示R中的属性列

这里需要注意的是经过投影之后，不仅原关系中的某些列取消了，部分元组也会取消，即不仅列数减少，行数也有可能减少，这是由于去除某些列后，原关系的限制关系解除，某些元组发生重复

例如上文的学生信息表，现在从其中只投影（筛选）专业这个属性，则必然重复专业的元组会被删除，只保留一个
$$\pi_{dept}(Student)$$

投影多个属性的情况下按照如下方式书写，或将多个属性定义为一个属性列
$$\pi_{name,score,dept}(Student)$$
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/projection.png)

### 连接运算（Join）

连接也被称为$\theta$连接，连接运算的含义表示从两个关系的笛卡尔积中选择出属性间满足一定条件的元组

$$R \operatorname*{\Join}\limits_{A\theta B} S=\lbrace \overbrace{t_r\ \ t_s}|t_r\in R \wedge t_s\in S\wedge t_r[A]\theta t_s[B]\rbrace$$

其中A和B分别表示的是R和S上度数相等且可比的两个属性组，$\theta$表示比较运算符

连接运算就是从R和S的笛卡尔积$R\times S$中选取A属性组上的值与B属性组上值满足比较关系$\theta$ 的元组

#### 等值连接
等值连接就是比较关系是等于的连接运算（$\theta$ = “=”），等值连接就是从笛卡尔积中选取A和B属性值相等的元组，即
$$R \operatorname*{\Join}\limits_{A= B} S=\lbrace \overbrace{t_r\ \ t_s}|t_r\in R \wedge t_s\in S\wedge t_r[A]= t_s[B]\rbrace$$

#### 自然连接
自然连接是特殊的等值连接，其在等值连接的基础上要求两个关系中进行比较的分量必须是相同的属性组，并且最后的运算结果中只保留两个属性中的一个即可（即在结果中去掉重复的属性列）

自然连接的含义是R和S的相同属性组的值相等
$$R \Join S=\lbrace \overbrace{t_r\ \ t_s}|t_r\in R \wedge t_s\in S\wedge t_r[A]= t_s[A]\rbrace$$


#### 内外连接
可以看到两个关系在做自然连接时，满足比较关系的元组被保留，不满足比较关系的元组被舍弃，这就说明R和S两个关系中都可能会有元组被舍弃，这种连接方式被称为内连接

与之相对的一种连接方式称为外连接，外连接会将某个关系中不满足条件的元组保留下来，并在他的其他属性上填控制NULL，如果把左边关系R中要舍弃的元组保留下来，则称为左外连接，如果将右边关系S中要舍弃的元组保留下来，称为右外连接

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/djasio.png)

### 除运算（Division）

[除运算](https://blog.csdn.net/weixin_42023723/article/details/80876568)
