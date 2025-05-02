---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 09:39:48
modDatetime: *id001
title: 6-基于XML与注解的AOP开发
slug: 6-基于XML与注解的AOP开发
featured: false
draft: false
tags:
- Spring
description: 1. 导入AOP相关坐标（Spring中AOP主要通过aspectj实现，所以要导入aspectjweaver）
---

# XML方式实现AOP

### 实现步骤
1. 导入AOP相关坐标（Spring中AOP主要通过aspectj实现，所以要导入aspectjweaver）
2. 创建目标接口和目标类（内部有切点）
3. 创建切面类（内部实现增强方法）
4. 将目标类和切面类的创建权交给Spring（将目标类和切面类放入Spring容器中）
5. 在applicationContext配置文件中配置织入关系
6. 测试代码


#### 目标类与目标接口
```java
/**
 * 目标对象接口
 */
public interface TargetObject {
    public String save();
}
```

```java
/**
 * 目标对象
 */
public class TargetObjectImpl implements TargetObject{
    public String save() {
        System.out.println("save running...");
        return "return value...";
    }
}
```

#### 创建切面类，实现增强方法
```java
/**
 * 切面类：负责实现增前方法
 */
public class MyAspect {
    //前置增强方法
    public void preEnhence(){
        System.out.println("前置增强方法...");
    }
    //后置增强方法
    public void postEnhence(){
        System.out.println("后置增强方法...");
    }
}
```

#### 将目标类与切面类控制权交给Spring,织入关系
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--引入AOP命名空间-->
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd">

    <!--配置目标对象-->
    <bean id="targetObject" class="cn.ywrby.aop.TargetObjectImpl"></bean>
    <!--配置切面类-->
    <bean id="myAspect" class="cn.ywrby.aop.MyAspect"></bean>
    <!--配置织入-->
    <aop:config>
        <!--声明切面：表明myAspect是一个切面-->
        <aop:aspect ref="myAspect">
            <!--before表示前置增强，after表示后置增强......-->
            <!--配置通知和切入点：method为通知（增强方法），pointcut为切入点,通过切点表达式进行配置-->
            <aop:before method="preEnhence" pointcut="execution(public String cn.ywrby.aop.TargetObjectImpl.save())"></aop:before>
            <aop:after method="postEnhence" pointcut="execution(public String cn.ywrby.aop.TargetObjectImpl.save())"></aop:after>
        </aop:aspect>
    </aop:config>
</beans>
```

#### 测试用例
```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:applicationContext.xml")
public class AOPTest {
    //注入对象
    @Autowired
    private TargetObject object;

    /**
     * 测试利用XML实现AOP
     */
    @Test
    public void proxyTest(){
        String val=object.save();
        System.out.println(val);
    }
}
```

### 切点表达式的写法

#### 基本语法
```xml
execution([修饰符] 返回值类型 包名.类名.方法名(参数列表))
```

#### 注意：
- 修饰符可以省略
- 返回值类型，包名，类名，方法名都可以使用*表示任意
- 包名与类名之间有一个点.表示当前包下的类，两个点..表示当前包及其所有子包下的类
- 参数列表可以使用两个点..表示任意数量，任意类型的参数列表


**示例**

```xml
execution(public String cn.ywrby.aop.TargetObjectImpl.save())
execution(String cn.ywrby.aop.TargetObjectImpl.save())
execution(* cn.ywrby.aop.TargetObjectImpl.save())
execution(* cn.ywrby.aop.*.*(..))
execution(* cn.ywrby.aop..TargetObjectImpl.*(..))
```

#### 切点表达式的抽取

一般情况下，对于前置后置等等增强方法，其使用的切点表达式很可能相同，此时，就可以利用抽取切点表达式的方法，简化代码
```xml
    <!--配置织入-->
    <aop:config>
        <!--声明切面：表明myAspect是一个切面-->
        <aop:aspect ref="myAspect">
            <!--抽取切点表达式-->
            <aop:pointcut id="maPointcut" expression="execution(public * cn.ywrby.*.*.save(..))"/>
            <!--直接使用抽取的切点表达式ID即可-->
            <aop:before method="preEnhence" pointcut-ref="maPointcut"></aop:before>
            <aop:after method="postEnhence" pointcut-ref="maPointcut"></aop:after>
        </aop:aspect>
    </aop:config>
```

### 通知的类型

名称|标签|说明
---|---|---
前置通知|<aop:before>|用于配置前置通知。指定增强的方法在切入点方法之前执行
后置通知|<aop:after-returning>|用于配置后置通知。指定增强的方法在切入点方法之后执行
环绕通知|<aop:around>|用于配置环绕通知。指定增强的方法在切入点方法之前和之后都执行
异常抛出通知|<aop:throwing>|用于配置异常抛出通知。指定增强的方法在出现异常时执行
最终通知|<aop:after>|用于配置最终通知。无论增强方式执行是否有异常都会执行

# 注解实现AOP

### 实现步骤
1. 创建目标接口与目标类（内部有切点）
2. 创建切面类，内部实现增强方法
3. 将目标类和切面类的创建权交给Spring，利用注解将目标类和切面类放入Spring容器中
4. 在切面类中配置织入关系
5. 在applicationContext配置文件中开启组件扫描和AOP自动代理
6. 测试代码

#### 目标类,目标接口与切面类

```java
/**
 * 目标对象接口
 */
public interface TargetObject {
    public String save();
}
```

```java
/**
 * 目标对象
 */
@Component("targetObject")
public class TargetObjectImpl implements TargetObject{
    public String save() {
        System.out.println("save running...");
        return "return value...";
    }
}
```

```java
/**
 * 切面类：负责实现增前方法
 */
@Component("myAspect")
//声明切面类
@Aspect
public class MyAspect {
    //前置增强方法
    //配置前置增强
    @Before("execution(* cn.ywrby.aop.*.*(..))")
    public void preEnhence(){
        System.out.println("前置增强方法...");
    }
    //后置增强方法
    //配置后置增强
    @After("execution(* cn.ywrby.aop.*.*(..))")
    public void postEnhence(){
        System.out.println("后置增强方法...");
    }
}
```

#### 配置文件中开启自动扫描和AOP自动代理

```xml
<!--引入AOP命名空间和Context命名空间-->
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd
                           http://www.springframework.org/schema/context  http://www.springframework.org/schema/context/spring-context.xsd">

    <!--开启组件扫描-->
    <context:component-scan base-package="cn.ywrby"/>

    <!--开启AOP自动代理-->
    <aop:aspectj-autoproxy/>
</beans>
```

#### 注解中抽取切点表达式

```java
/**
 * 切面类：负责实现增前方法
 */
@Component("myAspect")
//声明切面类
@Aspect
public class MyAspect {
    //利用一个空方法进行切点表达式的抽取
    @Pointcut("execution(* cn.ywrby.aop.*.*(..))")
    public void pointcut(){}
    //使用抽取的切点表达式
    @Before("MyAspect.pointcut()")
    public void preEnhence(){
        System.out.println("前置增强方法...");
    }
    //第二种使用方法
    @After("pointcut()")
    public void postEnhence(){
        System.out.println("后置增强方法...");
    }
}
```

