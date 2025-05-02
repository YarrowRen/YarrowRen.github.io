---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 08:24:30
modDatetime: *id001
title: 3-相应API与配置数据源
slug: 3-相应API与配置数据源
featured: false
draft: false
tags:
- Spring
description: '- ClassPathXmlApplicationContext:从类的根路径下加载配置文件（即resources文件夹中）一般情况下都使用这种'
---

# Spring相应API 

### ApplicationContext的实现类

- ClassPathXmlApplicationContext:从类的根路径下加载配置文件（即resources文件夹中）一般情况下都使用这种
- FileSystemXmlApplicationContext:从磁盘路径下加载配置文件，配置文件可以在磁盘任意位置
- AnnotationConfigApplicationContext:当使用注解来配置容器对象时，需要使用这种方式来创建Spring容器，它用来读取注解


### getBean()方法
getBean方法可以接收两种参数，可以分别传入容器中的ID，或者是对象的类
```java
context.getBean("userService");
context.getBean(UserService.class);
```
第一种方式的好处在于指向性更强，因为ID只允许出现一次，所以可以通过定义不同的ID指向相同的类，从而创建多个相同的类对象。但第二种方式如果Spring容器中有相同类对象就不能够正常识别要创建哪个对象

# Spring配置数据源

### 数据源（连接池）的作用
- 数据源（连接池）是为提高程序性能而出现的
- 事先实例化数据源，初始化部分连接资源
- 使用连接资源时从数据源中获取
- 使用后将连接资源归还数据源

常见数据源（连接池）：DBCP,C3P0,BoneCP,Druid等等

#### 在没有利用Spring时正常流程获取数据源

```java
public class DataSourceTest {

    /**
     * 测试手动创建C3P0数据源
     * @throws Exception
     */
    @Test
    public void c3p0Test() throws Exception {
        ComboPooledDataSource dataSource=new ComboPooledDataSource();
        //dataSource.setDriverClass("com.mysql.jdbc.driver");
        dataSource.setJdbcUrl("jdbc:mysql://cdb-cd3ybvc6.cd.tencentcdb.com:78/LereBookMarket");
        dataSource.setUser("root");
        dataSource.setPassword("root");
        Connection connection=dataSource.getConnection();
        System.out.println(connection);
        connection.close();
    }

    /**
     * 测试手动创建Druid数据源
     */
    @Test
    public void druidTest() throws SQLException {
        DruidDataSource dataSource=new DruidDataSource();
        //dataSource.setDriverClassName("com.mysql.jdbc.driver");
        dataSource.setUrl("jdbc:mysql://cdb-cd3ybvc6.cd.tencentcdb.com:78/LereBookMarket");
        dataSource.setUsername("root");
        dataSource.setPassword("root");
        DruidPooledConnection connection=dataSource.getConnection();
        System.out.println(connection);
        connection.close();
    }

    /**
     * 测试手动创建C3P0数据源(加载配置文件)
     * @throws Exception
     */
    @Test
    public void c3p0Test2() throws Exception {
        //加载配置文件(这里getBundle方法会从资源目录resources下搜索所有properties文件
        // 所以只需要输入基类名称，例如abc.properties只需要输入abc)
        ResourceBundle rb=ResourceBundle.getBundle("jdbc");
        //获取数据源
        ComboPooledDataSource dataSource=new ComboPooledDataSource();
        //加载数据
        dataSource.setDriverClass(rb.getString("driver"));
        dataSource.setJdbcUrl(rb.getString("url"));
        dataSource.setUser(rb.getString("user"));
        dataSource.setPassword(rb.getString("password"));
        //获取连接资源
        Connection connection=dataSource.getConnection();
        System.out.println(connection);
        //关闭连接资源
        connection.close();
    }
}
```

## 利用Spring配置数据源

利用Spring配置数据源主要有如下几步
- 在Spring核心配置文件中引入context命名空间：context命名空间的作用是为了读取properties类型的配置文件，jdbc.properties内存放了创建数据源所需要的参数，利用配置文件来读取参数的主要目的还是保证代码的可读性，各部分功能明确
- 加载properties配置文件
- 利用Spring向数据源注入参数
- 创建数据源对象（此时创建的数据源对象就不需要额外传入参数，参数在创建时就通过Spring注入了）



```xml
<!--引入context命名空间，用于读取properties配置文件-->
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

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

#### 用于存放配置参数的jdbc.properties配置文件

```properties
url=jdbc:mysql://cdb-cd3ybvc6.cd.tencentcdb.com:78/LereBookMarket
user=root
password=root
driver=com.mysql.cj.jdbc.Driver
```

#### 测试用例

```java
    /**
     * 利用Spring创建C3P0数据源
     */
    @Test
    public void c3p0SpringTest() throws SQLException {
        //创建Spring容器
        ApplicationContext context=new ClassPathXmlApplicationContext("applicationContext.xml");
        //利用Spring容器获取数据源
        ComboPooledDataSource dataSource= (ComboPooledDataSource) context.getBean("dataSource");
        //从数据源获取连接资源
        Connection connection=dataSource.getConnection();
        System.out.println(connection);
        //释放连接资源
        connection.close();
    }
```