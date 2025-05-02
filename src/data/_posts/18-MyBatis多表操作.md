---
author: Boyu Ren
pubDatetime: &id001 2021-03-21 11:52:14
modDatetime: *id001
title: 18-MyBatis多表操作
slug: 18-MyBatis多表操作
featured: false
draft: false
tags:
- Spring
- MyBatis
description: 以用户-订单模型为例，假定用户与订单之间是一一对应的关系，建立如下数据库
---

# MyBatis多表操作

## 一对一查询模型
以用户-订单模型为例，假定用户与订单之间是一一对应的关系，建立如下数据库

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/userdatebase.png)

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/orderdatabase.png)

订单表中的userId表示标识用户的ID信息，若直接通过sql语句进行一对一查询，则可写作`select * from orders o ,user u where o.userId=u.id` ,得到如下查询结果

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/databaseresultnj.png)

可在mybatis中进行查询时，其并不知道各个数据段对应的参数，所以需要我们手动通过map进行对应

首先定义order类,注意这里通过User对象来储存的用户信息，而不是数据库中的userId
```java
public class Order {
    private Long id;
    private String orderName;
    private int orderAmount;
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderName() {
        return orderName;
    }

    public void setOrderName(String orderName) {
        this.orderName = orderName;
    }

    public int getOrderAmount() {
        return orderAmount;
    }

    public void setOrderAmount(int orderAmount) {
        this.orderAmount = orderAmount;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                ", orderName='" + orderName + '\'' +
                ", orderAmount=" + orderAmount +
                ", user=" + user +
                '}';
    }
}
```

实现mapper接口类
```java
public interface OrderMapper {
    public List<Order> findAll();
}
```

映射文件,可以看到这里通过resultMap配置数据段(column)和类属性(property)的映射关系（注意，这里在sql语句中对order中的id使用了别名为oid，这是为了防止两表都有的id数据段造成混淆）

这里的column代表的数据段不单纯是user或order任一表的数据段，而是经过查询后得到的新表的数据段
```xml
<!--命名空间的值和接口类全限定名一致-->
<mapper namespace="cn.ywrby.mapper.OrderMapper">

    <resultMap id="orderMap" type="order">
        <id column="oid" property="id"/>
        <result column="orderName" property="orderName"/>
        <result column="orderAmount" property="orderAmount"/>
        <result column="userId" property="user.id"/>
        <result column="username" property="user.username"/>
        <result column="password" property="user.password"/>
    </resultMap>
    
    <select id="findAll" resultMap="orderMap">
        select *,o.id oid from orders o ,user u where o.userId=u.id
    </select>

</mapper>
```

这里的resultMap还有第二种配置方式，对于order中的user属性的所有值进行单独封装
```xml
    <resultMap id="orderMap" type="order">
        <id column="id" property="id"/>
        <result column="orderName" property="orderName"/>
        <result column="orderAmount" property="orderAmount"/>
        <!--注意这里的两个user含义不同，第一个是order中的属性的名称，第二个是类User的别名-->
        <association property="user" javaType="user">
            <id column="userId" property="id"/>
            <result column="username" property="username"/>
            <result column="password" property="password"/>
        </association>
    </resultMap>
```

然后需要在核心配置文件中配置这个新的映射文件并指定别名order


测试用例：
```java
    @Test
    public void test() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("SqlMapConfig.xml");
        SqlSessionFactory factory=new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = factory.openSession();
        OrderMapper mapper = sqlSession.getMapper(OrderMapper.class);

        List<Order> orderList=mapper.findAll();
        for (Order order: orderList) {
            System.out.println(order);
        }
        sqlSession.close();
    }
    /* 运行结果
    Order{id=1, orderName='textbook', orderAmount=10, user=User{id=1, username='Leslie', password='123'}}
    Order{id=2, orderName='mathbook', orderAmount=15, user=User{id=2, username='Jessica', password='123'}}
    Order{id=3, orderName='writebook', orderAmount=6, user=User{id=4, username='lily', password='1234'}}
    Order{id=4, orderName='chinesebook', orderAmount=10, user=User{id=6, username='Kelly', password='1234'}}
    Order{id=5, orderName='textbook', orderAmount=10, user=User{id=7, username='Les', password='1234'}}
    Order{id=6, orderName='textbook', orderAmount=10, user=User{id=8, username='dshjihi', password='398'}}
    */
```

## 一对多查询模型

现在假设一个用户可能拥有多个订单的情况，此时通过数据库直接用sql语句查询的方式如下`select *,o.id oid from user u ,orders o where o.userId=u.id`，可以看到一个用户出现对应多个订单的情况，此时在用户的属性中加入`List<Order> orderList`用于存储订单集合

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/%E5%A4%9A%E8%A1%A8%E6%9F%A5%E8%AF%A2%E7%BB%93%E6%9E%9Chu.png)

这种情况下MyBatis的查询方式如下,collection标签就是用于处理集合类型数据，ofType属性表示集合中存储的数据类型（这里用了别名）
```xml
<mapper namespace="cn.ywrby.mapper.UserMapper">

    <resultMap id="userMap" type="user">
        <id column="id" property="id"/>
        <result column="username" property="username"/>
        <result column="password" property="password"/>
        <collection property="orderList" ofType="order">
            <id column="oid" property="id"/>
            <result column="orderName" property="orderName"/>
            <result column="orderAmount" property="orderAmount"/>
        </collection>
    </resultMap>


    <select id="findAll" resultMap="userMap">
        select *,o.id oid from user u ,orders o where o.userId=u.id
    </select>
</mapper>
```
测试用例：
```java
    @Test
    public void test() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("SqlMapConfig.xml");
        SqlSessionFactory factory=new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = factory.openSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);

        List<User> userList=mapper.findAll();
        for (User user: userList) {
            System.out.println(user);
        }
        sqlSession.close();
    }
    /*
    User{id=1, username='Leslie', password='123', orderList=[Order{id=1, orderName='textbook', orderAmount=10, user=null}, Order{id=7, orderName='mathbook', orderAmount=12, user=null}]}
    User{id=2, username='Jessica', password='123', orderList=[Order{id=2, orderName='mathbook', orderAmount=15, user=null}, Order{id=8, orderName='englishbook', orderAmount=19, user=null}]}
    User{id=4, username='lily', password='1234', orderList=[Order{id=3, orderName='writebook', orderAmount=6, user=null}]}
    User{id=6, username='Kelly', password='1234', orderList=[Order{id=4, orderName='chinesebook', orderAmount=10, user=null}]}
    User{id=7, username='Les', password='1234', orderList=[Order{id=5, orderName='textbook', orderAmount=10, user=null}]}
    User{id=8, username='dshjihi', password='398', orderList=[Order{id=6, orderName='textbook', orderAmount=10, user=null}]}
    */
```

至于多对多模型的查询，其基本原理跟一对多没有区别，只要注意合理使用中间表以及正确的映射关系即可


