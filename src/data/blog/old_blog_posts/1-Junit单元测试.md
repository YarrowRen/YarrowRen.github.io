---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:27:51
modDatetime: *id001
title: 1-JUnit 单元测试
slug: 1-JUnit单元测试
featured: false
draft: false
tags:
- JavaWeb
description: JUnit 单元测试基础，涵盖测试分类、JUnit 白盒测试流程以及常用注解与断言示例。
---

# JUnit 单元测试

## 一、软件测试的基本分类

### 1. 黑盒测试（Black-box Testing）

> 在测试过程中，将程序视为一个不可打开的“黑盒”，**不关注程序内部结构和实现细节**，仅从外部接口出发进行测试。

黑盒测试的特点：

- 只关心输入与输出
- 验证功能是否符合需求规格说明书
- 不依赖源代码实现
- 常用于功能测试、系统测试

---

### 2. 白盒测试（White-box Testing）

> 白盒测试是一种基于程序内部结构的测试方法，测试人员**清楚程序的内部逻辑和实现细节**，并针对代码路径进行测试。

白盒测试的特点：

- 需要查看和理解源代码
- 覆盖程序的逻辑分支、循环、异常路径
- 常用于单元测试
- 有助于发现隐藏的逻辑错误

**JUnit 主要用于白盒测试。**

---

## 二、JUnit 单元测试概述

JUnit 是 Java 语言中最常用的 **单元测试框架**，主要用于：

- 对最小功能单元（方法）进行测试
- 验证方法逻辑的正确性
- 提高代码质量与可维护性
- 方便回归测试与持续集成

---

## 三、JUnit 白盒测试的基本步骤

### 1. 定义测试类（Test Case）

- 测试类命名规范：  
  **被测试类名 + Test**

例如：

- 被测试类：`Calculator`
- 测试类：`CalculatorTest`

> 测试类通常放在独立的测试包中，例如：`cn.ywrby.test`

---

### 2. 定义测试方法（可独立运行）

测试方法的一般规范：

- 方法名：`test + 被测试方法名`
- 返回值类型：`void`
- 参数列表：无参数
- 使用 `@Test` 注解标注

---

### 3. 引入 JUnit 依赖环境

- 在项目中引入 JUnit 相关依赖（JUnit 4 或 JUnit 5）
- 确保开发工具或构建工具（IDE / Maven / Gradle）能够识别测试环境

---

### 4. 使用 `@Test` 注解标记测试方法

JUnit 会自动识别并执行被 `@Test` 注解标注的方法。

---

### 5. 结果判定（断言）

- **绿色**：测试通过
- **红色**：测试失败

JUnit 通常使用 **断言（Assert）** 来判断实际结果是否符合预期。

---

## 四、示例：使用 JUnit 测试计算器类

### 1. 被测试类：Calculator

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
    public int add(int a, int b) {
        return a + b;
    }

    /**
     * 减法
     * @param a 被减数
     * @param b 减数
     * @return 减法结果
     */
    public int sub(int a, int b) {
        return a - b;
    }
}
```

---

### 2. 测试类：CalculatorTest

```java
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

/**
 * Calculator 的测试类
 */
public class CalculatorTest {

    /**
     * 在每个测试方法执行前都会调用
     */
    @Before
    public void init() {
        System.out.println("init...");
    }

    @Test
    public void testAdd() {
        // 创建对象
        Calculator calculator = new Calculator();
        // 调用被测试方法
        int result = calculator.add(1, 5);
        // 断言：期望值 vs 实际值
        Assert.assertEquals(6, result);
    }

    @Test
    public void testSub() {
        // 创建对象
        Calculator calculator = new Calculator();
        // 调用被测试方法
        int result = calculator.sub(1, 5);
        // 断言：期望值 vs 实际值
        Assert.assertEquals(-4, result);
    }

    /**
     * 在每个测试方法执行后都会调用
     */
    @After
    public void close() {
        System.out.println("close...");
    }
}
```

---

## 五、常用 JUnit 注解说明（JUnit 4）

| 注解             | 作用                |
| -------------- | ----------------- |
| `@Test`        | 标记测试方法            |
| `@Before`      | 每个测试方法执行前调用       |
| `@After`       | 每个测试方法执行后调用       |
| `@BeforeClass` | 所有测试方法执行前调用（静态方法） |
| `@AfterClass`  | 所有测试方法执行后调用（静态方法） |

---

## 六、小结

* 黑盒测试关注功能结果，白盒测试关注内部逻辑
* JUnit 是 Java 中最常用的白盒单元测试框架
* 单元测试的核心是：

  * 方法级别验证
  * 自动化执行
  * 使用断言判断结果
* 良好的单元测试可以显著提高代码质量和系统稳定性

<!-- 2026.01.28由GPT5.2优化全文 -->