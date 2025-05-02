---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 09:43:22
modDatetime: *id001
title: 7-JDBCTemplate
slug: 7-JDBCTemplate
featured: false
draft: false
tags:
- Spring
description: 是Spring框架中的一个对象，是对原始繁琐JDBC API的封装
---

# JDBCTemplate
是Spring框架中的一个对象，是对原始繁琐JDBC API的封装

## 使用步骤
1. 导入spring-jdbc和spring-tx坐标
2. 创建数据库表和实体
3. 创建JDBCTemplate对象
4. 执行数据库操作

### 数据库表和实体对象

![databasesheet](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/databasesheet.jpg)

```java
public class User {
    private String name;
    private String password;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
```

### 配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--引入context命名空间，用于读取properties配置文件-->
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

    <!--配置注解扫描-->
    <context:component-scan base-package="cn.ywrby"/>

    <!--加载properties配置文件(classpath表示的就是资源目录resources下)-->
    <context:property-placeholder location="classpath:jdbc.properties"/>

    <!--配置文件已经成功加载，可以利用配置文件注入-->
    <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
        <property name="driverClass" value="${driver}"></property>
        <property name="jdbcUrl" value="${url}"></property>
        <property name="user" value="${user}"></property>
        <property name="password" value="${password}"></property>
    </bean>
</beans>
```

### 创建JDBCTemplate对象并执行数据库操作

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:applicationContext.xml")
public class JdbcTest {

    //创建数据源并注入
    @Autowired
    private DataSource dataSource;

    @Test
    public void jdbcTemplateTest() throws SQLException {
        //创建JdbcTemplate对象
        JdbcTemplate jdbcTemplate=new JdbcTemplate();
        //传入数据源对象
        jdbcTemplate.setDataSource(dataSource);
        //执行数据库操作
        int row=jdbcTemplate.update("insert into user values(?,?)","Leslie","123456");
        System.out.println(row);
    }
}
```


还可以直接将JdbcTemplate放入Spring容器中，再将数据源注入以简化代码

```xml
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
```

测试用例
```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:applicationContext.xml")
public class JdbcTest {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void jdbcTemplateTest2(){
        //执行数据库操作
        int row=jdbcTemplate.update("insert into user values(?,?)","Jessice","654321");
        System.out.println(row);
    }
}
```
