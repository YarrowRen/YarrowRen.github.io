---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:27:51
modDatetime: *id001
title: 1-Junit单元测试
slug: 1-Junit单元测试
featured: false
draft: false
tags:
- JavaWeb
description: '- 黑盒测试：'
---

# Junit单元测试

## 测试分类
- 黑盒测试：
    > 在测试中，把程序看作一个不能打开的黑盒子，在完全不考虑程序内部结构和内部特性的情况下，在程序接口进行测试，它只检查程序功能是否按照需求规格说明书的规定正常使用，程序是否能适当地接收输入数据而产生正确的输出信息。
- 白盒测试：
    > 白盒测试是一种测试用例设计方法，盒子指的是被测试的软件，白盒指的是盒子是可视的，即清楚盒子内部的东西以及里面是如何运作的。"白盒"法全面了解程序内部逻辑结构、对所有逻辑路径进行测试。


## Junit步骤（白盒测试）

### 1. 定义一个测试类（也叫测试用例）
测试类名一般采用：被测试类名+Test的格式。例如，Calculator的测试类叫做CalculatorTest

测试包名一般叫做test，例如：cn.ywrby.test

### 2. 定义测试方法（可以独立运行）

方法名一般采用：test+测试的方法名的格式，例如add方法的测试方法是testAdd方法

返回值一般为void，参数列表一般为空


### 3.导入Junit依赖环境
### 4. 给方法加@Test

### 5. 结果判定
显示红色，测试失败，显示绿色，测试成功。一般使用断言操作来测试结果



```java
package cn.ywrby.calculate;

/**
 * 计算器类
 */
public class Calculator {
    /**
     * 加法
     * @param a 加数
     * @param b 加数
     * @return 加法结果
     */
    public int add(int a, int b){
        return a+b;
    }

    /**
     * 减法
     * @param a 被减数
     * @param b 减数
     * @return 减法结果
     */
    public int sub(int a,int b){
        return a-b;
    }
}
```

```java
/**
 * 计算器的测试类
 */
public class CalculatorTest {

    @Test
    public void testAdd(){
        //创建对象
        Calculator calculator=new Calculator();
        //调用要测试的方法
        int result=calculator.add(1,5);
        //利用断言检测结果准确性，第一个参数是期待值，第二个参数是真实值
        Assert.assertEquals(6,result);
    }

    @Test
    public void testSub(){
        //创建对象
        Calculator calculator=new Calculator();
        //调用要测试的方法
        int result=calculator.sub(1,5);
        //利用断言检测结果准确性，第一个参数是期待值，第二个参数是真实值
        Assert.assertEquals(-4,result);
    }

    /**
     * 在所有测试用例执行前都会调用
     */
    @Before
    public void init(){
        System.out.println("init...");
    }

    /**
     * 在所有测试用例执行后都会调用
     */
    @After
    public void close(){
        System.out.println("close...");
    }

}
```


