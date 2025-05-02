---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 08:11:50
modDatetime: *id001
title: 2-Spring配置文件与依赖注入
slug: 2-Spring配置文件与依赖注入
featured: false
draft: false
tags:
- Spring
description: 用于配置对象交由Spring来创建，默认情况下调用的是类中的无参构造函数，没有无参构造的情况下不能创建成功
---

# Spring配置文件

## Bean标签基本配置
用于配置对象交由Spring来创建，默认情况下调用的是类中的无参构造函数，没有无参构造的情况下不能创建成功

#### 基本属性
- id：Bean实例在Spring中的唯一标识
- class：Bean的全限定名称

### Bean标签范围配置

#### scope属性
取值范围|说明
---|---
singleton|默认值，单例的
prototype|多例的
request|web项目中，Spring创建一个对象并将对象存入request域内
session|web项目中，Spring创建一个对象并将对象存入session域内
global session|web项目中，应用在Portlet环境，如果没有Portlet环境，global session相当于session

这里单例是指每次创建出的Bean对象都是同一个对象，而多例则表示每次创建的都是全新的不同的Bean对象

**示例**

```xml
<!--单例的-->
<bean id="userDao" class="cn.ywrby.dao.impl.UserDaoImpl" scope="singleton"></bean>
<!--多例的-->
<bean id="userDao" class="cn.ywrby.dao.impl.UserDaoImpl" scope="prototype"></bean>
```

**测试**
```java
    /**
     * 测试scope属性
     */
    @Test
    public void userDaoTest(){
        //指定配置文件
        ApplicationContext context=new ClassPathXmlApplicationContext("applicationContext.xml");
        //通关配置文件与ID获取实例
        UserDao dao1= (UserDao) context.getBean("userDao");
        UserDao dao2= (UserDao) context.getBean("userDao");
        //输出两个对象的地址即可判断是否两次创建为同一对象
        System.out.println(dao1);
        System.out.println(dao2);
    }
```

#### singleton与prototype的区别

当scope取值为singleton时，Bean实例化的个数始终是一个，并且实例化的时机是在**Spring核心文件（配置文件）被加载时**

当scope取值为prototype时，Bean实例化的个数是多个，此时实例化的时机不是核心文件加载，而是在**每次调用getBean方法时创建**

### Bean声明周期的配置

- init-method:指定初始化方法，在对象创建时被调用
- destroy-method:指定销毁方法，在对象被销毁时调用

```xml
<bean id="userDao" class="cn.ywrby.dao.impl.UserDaoImpl" init-method="init" destroy-method="destroy"></bean>
```

```java
public class UserDaoImpl implements UserDao {

    public void init(){
        System.out.println("执行初始化...");
    }

    public void destroy(){
        System.out.println("执行销毁...");
    }

    public void save() {
        System.out.println("Save Running...");
    }
}
```


# Spring依赖注入

### 概念
依赖注入（Dependency Injection）是Spring框架核心IOC的具体实现


### Bean对象的注入（引用数据类型的注入）
依赖注入的主要目的还是解耦，主要利用的原理就是控制反转，即将构造对象这个【控制】交给了第三方Spring来进行操作

我们在实际的项目开发中，必然涉及到对多个对象的构造与控制，而我们许多的对象已经预定义在Spring容器中（那些已经在配置文件中定义的对象）。

此时假如我们需要在某个Spring容器中已有的对象A内调用另一个同样已经在Spring容器中定义的对象B，一般情况我们会直接在对象A中加载配置文件，利用Spring获取对象B，然后再操作获取到的对象

这种情况下假如我们需要修改代码，就需要到所有操作配置文件获取对象B的方法内进行修改，直接导致了代码耦合度变高

```java
public class UserServiceImpl implements UserService {
    @Override
    public void save() {
        //UserService与UserDao都是定义在Spring容器中的对象
        //这里在UserService的save方法中利用配置文件获取了UserDao对象
        //这也就导致了代码耦合度很高，不便于复用和修改
        ApplicationContext context=new ClassPathXmlApplicationContext("applicationContext.xml");
        UserDao dao= (UserDao) context.getBean("userDao");
        dao.save();
    }
}
```

要解决这种问题就可以利用依赖注入,第一种方式是set方法注入，第二种是构造函数注入

#### set方法注入
即通过在配置文件中提前配置，使得在创建对象A时调用指定的set方法将对象B直接传入对象A内部，这样的注入方式保证了对象B没有在对象A的方法中进行实例化，而是作为参数直接传入A内部，需要使用对象B时直接使用传入的对象即可。需要修改代码时只需要对配置文件进行修改即可

首先在被传入的Bean中定义传入参数的set方法，并且定义成员变量用于接收传入的参数，修改调用对象B的函数，直接利用成员变量进行操作即可

```java
public class UserServiceImpl implements UserService {
    private UserDao dao;  //定义成员变量

    //定义set方法，用于其他对象的传入
    public void setDao(UserDao dao) {
        this.dao = dao;
    }

    @Override
    public void save() {
        //修改成员方法，可以直接利用成员变量进行操作
        //省去了对配置文件的使用，降低了代码耦合度
        dao.save();
    }
}
```

然后修改配置文件，指定在创建UserService时调用指定的set方法注入相关参数(利用property标签进行指定 其中name是set方法后面的后缀并首字母小写，例如setDao方法，这里就传入dao，setUserService方法就传入userService ，ref是要传入的Spring容器中对象的ID)

```xml
    <bean id="userDao" class="cn.ywrby.dao.impl.UserDaoImpl" ></bean>
    <bean id="userService" class="cn.ywrby.service.impl.UserServiceImpl" >
        <property name="dao" ref="userDao"></property>
    </bean>
```

测试用例：
```java
    /**
     * 测试依赖注入
     */
    @Test
    public void userServiceTest(){
        //指定配置文件
        ClassPathXmlApplicationContext context=new ClassPathXmlApplicationContext("applicationContext.xml");
        //通关配置文件与ID获取实例
        UserService service= (UserService) context.getBean("userService");
        //执行方法
        service.save();
    }
```

**P命名空间注入**

这种注入方式本质还是set方法注入，只是通过利用P命名空间，简化了配置方法

在配置时首先需要定义P命名空间(第三行即定义P命名空间)
```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
```

利用P命名空间的属性直接定义注入方法
```xml
    <bean id="userService" class="cn.ywrby.service.impl.UserServiceImpl" p:dao-ref="userDao"></bean>
```

#### 构造函数注入

构造函数注入就是在创建对象A时调用对象A的有参构造函数，将指定的对象B作为参数注入对象A中

首先需要在被注入的对象中创建有参构造

```Java
public class UserServiceImpl implements UserService {
    private UserDao dao;  //定义成员变量

    //定义有参构造
    public UserServiceImpl(UserDao dao) {
        this.dao = dao;
    }

    public UserServiceImpl(){}

    @Override
    public void save() {
        //修改成员方法，可以直接利用成员变量进行操作
        //省去了对配置文件的使用，降低了代码耦合度
        dao.save();
    }
}
```

然后在配置文件中声明要调用有参构造，并指定传入的对象在Spring容器中的ID(利用constructor-arg标签指定要传入的参数，name属性表示的是传入的对象命名，ref属性是传入参数在Spring容器中的ID)


```xml
    <bean id="userDao" class="cn.ywrby.dao.impl.UserDaoImpl" ></bean>
    <bean id="userService" class="cn.ywrby.service.impl.UserServiceImpl" >
        <constructor-arg name="dao" ref="userDao"></constructor-arg>
    </bean>
```

### 普通数据类型的注入

在使用中，我们除了可能注入Spring中已经定义的引用数据类型，也有可能需要注入普通类型数据

```java
public class UserDaoImpl implements UserDao {

    //定义普通数据类型的成员变量
    private int num;
    private String name;

    //定义set方法
    public void setNum(int num) {
        this.num = num;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void save() {
        System.out.println(name+" : "+num);
    }
}
```

修改配置文件

```xml
    <bean id="userDao" class="cn.ywrby.dao.impl.UserDaoImpl" >
        <property name="name" value="Leslie"/>
        <property name="num" value="18"/>
    </bean>
```

因为此时注入的是普通数据类型，所以不需要通过ref属性指定ID，此时直接通过value属性将要注入的值传入

### 集合数据类型的注入

```java
public class UserDaoImpl implements UserDao {

    //定义集合数据类型
    private List<String> nameList;
    private Map<String, User> userMap;
    private Properties properties;

    //定义set方法
    public void setNameList(List<String> nameList) {
        this.nameList = nameList;
    }

    public void setUserMap(Map<String, User> userMap) {
        this.userMap = userMap;
    }

    public void setProperties(Properties properties) {
        this.properties = properties;
    }

    public void save() {
        System.out.println(nameList);
        System.out.println(userMap);
        System.out.println(properties);
    }
}
```

以下是集合数据类型注入时配置文件的配置方式

可以看到List类型注入时只需要定义value标签即可，标签体内传注入的值

Map类型在注入时需要利用entry标签传入键和值，键和值都可以使用引用类型或普通类型，引用类型只需要在后面加“-ref”即可

properties类型注入时和Map类似，也需要传入键和值，但是键是通过key属性传入的，值是直接写在标签体中的

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    
    <bean id="userDao" class="cn.ywrby.dao.impl.UserDaoImpl" >
        <property name="nameList">
            <list>
                <value>Leslie</value>
                <value>Ywrby</value>
            </list>
        </property>
        <property name="userMap">
            <map>
                <entry key="1" value-ref="user1"></entry>
                <entry key="2" value-ref="user2"></entry>
            </map>
        </property>
        <property name="properties">
            <props>
                <prop key="p1">value1</prop>
                <prop key="p2">value2</prop>
            </props>
        </property>
    </bean>
    
    <bean id="user1" class="cn.ywrby.domain.User">
        <property name="name" value="Jessica"></property>
        <property name="addr" value="Peking"></property>
    </bean>
    
    <bean id="user2" class="cn.ywrby.domain.User">
        <property name="name" value="Lere"></property>
        <property name="addr" value="SJZ"></property>
    </bean>
    
    <bean id="userService" class="cn.ywrby.service.impl.UserServiceImpl" >
        <constructor-arg name="dao" ref="userDao"></constructor-arg>
    </bean>
</beans>
```

**测试用例：**

```java
    @Test
    public void userDaoTest3(){
        //指定配置文件
        ApplicationContext context=new ClassPathXmlApplicationContext("applicationContext.xml");
        //通关配置文件与ID获取实例
        UserDao dao= (UserDao) context.getBean("userDao");
        //执行方法
        dao.save();
    }
    /*
    运行结果：
    [Leslie, Ywrby]
    {1=User{name='Jessica', addr='Peking'}, 2=User{name='Lere', addr='SJZ'}}
    {p1=value1, p2=value2}
     */
```


# 其他配置文件的引入

实际开发过程中我们所需要的配置文件可能是十分巨大的，内容十分杂乱，如果都定义在一个配置文件中，可读性和复写性都大打折扣

这种情况下我们可以将配置文件进行按模块拆分，或其他方式进行拆分，只需要最后在主配置文件中利用import标签进行引入即可


```xml
    <import resource="applicationContext-user.xml"/>
    <import resource="applicationContext-userDao.xml"/>
    <import resource="applicationContext-userService.xml"/>
```