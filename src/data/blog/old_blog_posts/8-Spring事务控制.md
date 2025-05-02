---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 09:47:51
modDatetime: *id001
title: 8-Spring事务控制
slug: 8-Spring事务控制
featured: false
draft: false
tags:
- Spring
description: '> 概括来讲，事务是一个由有限操作集合组成的逻辑单元。事务操作包含两个目的，数据一致以及操作隔离。数据一致是指事务提交时保证事务内的所有操作都成功完成，并且更改永久生效；事务回滚时，保证能够恢复到事务执行之前的状态。操作隔离则是指多个同时执行的事务之间应该相互独立，互不影响。'
---

# Spring事务控制

## 事务概念

> 概括来讲，事务是一个由有限操作集合组成的逻辑单元。事务操作包含两个目的，数据一致以及操作隔离。数据一致是指事务提交时保证事务内的所有操作都成功完成，并且更改永久生效；事务回滚时，保证能够恢复到事务执行之前的状态。操作隔离则是指多个同时执行的事务之间应该相互独立，互不影响。

事务是一个比较广泛的概念，事务管理资源除了我们熟知的数据库外，还可以包含消息队列、文件系统等。当然，一般来说，我们说的事务单指“数据库事务”。

### 事务的ACID属性
- 原子性（Atomicity）：事务作为一个整体被执行，包含在其中的对数据库的操作要么全部被执行，要么都不执行。
- 一致性（Consistency）：事务应确保数据库的状态从一个一致状态转变为另一个一致状态。一致状态的含义是数据库中的数据应满足完整性约束。
- 隔离性（Isolation）：多个事务并发执行时，一个事务的执行不应影响其他事务的执行。
- 持久性（Durability）：已被提交的事务对数据库的修改应该永久保存在数据库中。



## 编程式事务控制
Spring编程式事务控制就是指利用Spring提供的API进行事务控制，通过编写Java代码的方式完成，这种事务控制方法相对较灵活，但不便于管理，即耦合度较高

### PlatformTransactionManager 平台事务管理器

PlatformTransactionManager接口是Spring的事务管理器类，内部提供了我们常用的操作事务的方法

方法|说明
---|---
TransactionStatus getTransaction(TransactionDefination defination)|获取事务状态信息
void commit(TransactionStatus status)|获取事务状态信息
void rollback(TransactionStatus status)|回滚事务

根据dao层的不同技术实现（例如JDBC或mybatis...），PlatformTransactionManager接口实现了不同的实现类

### TransactionDefination
TransactionDefination是事务的定义信息对象，实现了如下方法

方法|说明
---|---
int getIsolationLevel()|获得事务的隔离级别
int getPropogationBehavior()|获得事务的传播行为
int getTimeout()|获得超时时间
boolean isReadyOnly()|是否只读

#### 事务的隔离级别
设置事务级别，用于解决事务并发产生的问题。如脏读，不可重复度，虚读...

- ISOLATION_DEFAULT：默认隔离级别
- ISOLATION_READ_UNCOMMITTED：读未提交
- ISOLATION_READ_COMMITTED：读已提交（可以解决脏读）
- ISOLATION_REPEATABLE_READ：可重复读（可以解决不可重复读问题）
- ISOLATION_SERIALIZABLE：串行化（都可以解决 但效率低下）


#### 事务的传播行为

事务传播行为用于描述当**一个事务传播行为的修饰方法**被**其他方法**调用时，事务是如何传播的

Spring中提供了其中事务传播的行为

事务传播行为|说明
---|---
REQUIRED|如果当前没有事务，就新建一个事务，如果已经存在一个事务中，加入到这个事务中。一般的选择（默认值）
SUPPORTS|支持当前事务，如果当前没有事务，就以非事务方式执行（没有事务）
MANDATORY|使用当前的事务，如果当前没有事务，就抛出异常
REQUERS_NEW|新建事务，如果当前在事务中，把当前事务挂起。
NOT_SUPPORTED|以非事务方式执行操作，如果当前存在事务，就把当前事务挂起
NEVER|以非事务方式运行，如果当前存在事务，抛出异常
NESTED|如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，则执行 REQUIRED 类似的操作
 
- 超时时间：默认值是-1，没有超时限制。如果有，以秒为单位进行设置
 - 是否只读：建议查询时设置为只读

### TransactionStatus

TransactionStatus接口提供了事务具体的运行状态

方法|说明
---|---
boolean hasSavepoint()|是否存储回滚点
boolean isCompleted()|事务是否完成
boolean isNewTransaction()|是否是新事务
boolean isRollBackOnly()|事务是否回滚

## Spring声明式事务控制

Spring的声明式事务控制就是指利用声明的方式进行事务控制，这里所指的声明就是利用Spring配置文件或注解的方式进行配置

### 声明式事务控制的作用
事务管理是属于系统层面的服务，而我们所编写的业务逻辑对象是属于业务逻辑层面的，如果使用编程式事务控制，就需要将事务管理和业务逻辑对象一起进行编写，二者将被耦合死。二通过声明式事务控制，则可以通过配置的方式，在配置文件中编写如何利用业务逻辑对象进行事务管理，此时业务逻辑对象并不会意识到自己正在执行相关事务，即实现了解耦合（业务逻辑与事务管理之间）

这个过程实际上还是遵循了Spring中的AOP，整个过程是为了实现对方法的增强，而增强的方式就是通过使用事务，即业务逻辑对象是切点，事务是通知（增强）

Spring声明式事务控制的底层就是AOP

### 基于XML方式的声明式事务控制

以银行转账事务为例进行基于XML方式的声明式事务控制


#### dao层：定义数据库操作方法
in方法为修改入帐方的余额

out方法为修改出账方发余额
```java
public interface AccountDao {
    public void in(String inMan,double money);
    public void out(String outMan,double money);
}
```

```java
@Component("accountDao")
public class AccountDaoImpl implements AccountDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void in(String inMan, double money) {
        jdbcTemplate.update("update account set money=money+? where name =?",money,inMan);
    }

    public void out(String outMan, double money) {
        jdbcTemplate.update("update account set money=money-? where name =?",money,outMan);
    }
}
```

### Service层

transfer方法就是转账方法，接收出账方，入帐方和金额三个参数

transfer方法调用了in方法和out方法，这两个方法各自为一个事务，此时如果不进行事务控制，可以看到由于二者之间故意设置的除数错误，会导致入账事务执行并完成，但出账事务未进行。

因此必须通过事务控制增强这个方法
```java
public interface AccountService {
    public void transfer(String outMan,String inMan,double money);
}
```

```java
@Component("accountService")
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountDaoImpl accountDao;

    public void setAccountDao(AccountDaoImpl accountDao) {
        this.accountDao = accountDao;
    }

    public void transfer(String outMan, String inMan, double money) {
        accountDao.in(inMan,money);
        int i=1/0;
        accountDao.out(outMan,money);
    }
}
```

### 配置文件

首先要引入AOP命名空间用于进行事务的织入，其次还需要引入tx命名空间进行事务通知的定义

然后就是需要配置平台事务管理器并为其配置数据源以进行事务管理，并且要定义通知（在tx命名空间中）

最后进行织入，将通知织入指定方法

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--引入tx命名空间，用于进行事务的管理-->
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
                           http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd
                           http://www.springframework.org/schema/aop https://www.springframework.org/schema/aop/spring-aop.xsd">

    <!--配置注解扫描-->
    <context:component-scan base-package="cn.ywrby"/>

    <!--加载properties配置文件(classpath表示的就是资源目录resources下)-->
    <context:property-placeholder location="classpath:jdbc.properties"/>

    <!--配置数据源-->
    <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
        <property name="driverClass" value="${driver}"></property>
        <property name="jdbcUrl" value="${url}"></property>
        <property name="user" value="${user}"></property>
        <property name="password" value="${password}"></property>
    </bean>

    <!--配置JdbcTemplate-->
    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <property name="dataSource" ref="dataSource"></property>
    </bean>

    <!--配置平台事务管理器TransactionManager-->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <!--通知 用于进行事务的增强-->
    <tx:advice id="txAdvice" transaction-manager="transactionManager">
        <!--设置事务的属性信息-->
        <tx:attributes>
            <!--name设置增强的方法 *表示所有方法均进行增强-->
            <!--isolation表示隔离级别-->
            <!--propagation表示事务的传播行为-->
            <!--timeout表示超过时间-->
            <!--read-only表示是否只读-->
            <tx:method name="*" isolation="DEFAULT" propagation="REQUIRED" timeout="-1" read-only="false" />
        </tx:attributes>
    </tx:advice>

    <!--配置AOP事务的织入：将事务织入到业务逻辑对象的方法中-->
    <aop:config>
        <aop:advisor advice-ref="txAdvice" pointcut="execution(* cn.ywrby.service.impl.*.*(..))"></aop:advisor>
    </aop:config>
</beans>
```


### 基于注解的Spring事务控制

基于注解的Spring事务控制需要修改两处，首先在需要进行事务控制的方法或类上利用@Transactional注解表示对该方法进行事务控制，（其内可以传入参数进行属性的配置）

可以看到，类上和方法上都可以使用该注解，当在类上使用该注解时表示该类内所有方法均按此配置进行事务控制，同时若方法上另有配置，则遵循方法上的配置（就近原则）
```java
@Component("accountService")
@Transactional(isolation = Isolation.READ_COMMITTED,propagation = Propagation.MANDATORY,readOnly = false,timeout = -1)
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountDaoImpl accountDao;

    public void setAccountDao(AccountDaoImpl accountDao) {
        this.accountDao = accountDao;
    }

    @Transactional(isolation = Isolation.DEFAULT,propagation = Propagation.REQUIRED)
    public void transfer(String outMan, String inMan, double money) {
        accountDao.in(inMan,money);
        int i=1/0;
        accountDao.out(outMan,money);
    }
}
```

其次还需要修改配置文件，以进行事务的注解驱动声明

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--引入tx命名空间，用于进行事务的管理-->
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
                           http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd
                           http://www.springframework.org/schema/aop https://www.springframework.org/schema/aop/spring-aop.xsd">

    <!--配置注解扫描-->
    <context:component-scan base-package="cn.ywrby"/>

    <!--加载properties配置文件(classpath表示的就是资源目录resources下)-->
    <context:property-placeholder location="classpath:jdbc.properties"/>

    <!--配置数据源-->
    <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
        <property name="driverClass" value="${driver}"></property>
        <property name="jdbcUrl" value="${url}"></property>
        <property name="user" value="${user}"></property>
        <property name="password" value="${password}"></property>
    </bean>

    <!--配置JdbcTemplate-->
    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <property name="dataSource" ref="dataSource"></property>
    </bean>

    <!--配置平台事务管理器TransactionManager-->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <!--声明事务的注解驱动-->
    <tx:annotation-driven transaction-manager="transactionManager"/>
</beans>
```