---
author: Boyu Ren
pubDatetime: &id001 2021-03-21 16:43:50
modDatetime: *id001
title: 19-MyBatis注解开发
slug: 19-MyBatis注解开发
featured: false
draft: false
tags:
- Spring
- MyBatis
description: MyBatis同时支持注解开发模式，在面对简单的配置时，注解开发可以明显的减轻开发难度
---

# MyBatis注解开发

MyBatis同时支持注解开发模式，在面对简单的配置时，注解开发可以明显的减轻开发难度

## MyBatis注解类型

注解|作用
---|---
@Insert|用于执行新增语句
@Update|用于执行更新语句
@Delete|用于执行删除语句
@Select|用于执行查询语句
@Result|用于实现结果集的封装
@Results|与@Result一起使用，实现多个结果集的封装
@One|实现一对一结果集的封装
@Many|实现一对多或多对多的结果集的封装

## 基本使用步骤

### 直接在mapper接口类中使用注解
参数传入的是要执行的sql语句

```java
public interface UserMapper {
    @Select("select * from user")
    public List<User> findAll();
    @Insert("insert into user values (#{id},#{username},#{password})")
    public void save(User user);
    @Update("update user set username=#{username},password=#{password} where id=#{id}")
    public void update(User user);
    @Delete("delete from user where id=#{id}")
    public void delete(Long id);
}
```

### 在核心文件配置扫描器，扫描指定包下的注解
```xml
    <!--加载映射关系-->
    <mappers>
        <!--加载映射关系：扫描注解-->
        <package name="cn.ywrby.mapper"></package>
    </mappers>
```


## 一对一模型使用注解开发

通过@Results和@Result配置映射关系进行一对一模型的注解开发(column表示数据段名称，property表示类中属性值名称)

```java
public interface OrderMapper {
    @Results({
            @Result(column = "oid",property = "id"),
            @Result(column = "orderName",property = "orderName"),
            @Result(column = "orderAmount",property = "orderAmount"),
            @Result(column = "userId",property = "user.id"),
            @Result(column = "username",property = "user.username"),
            @Result(column = "password",property = "user.password")
    })
    @Select("select *,o.id oid from orders o ,user u where o.userId=u.id")
    public List<Order> findAll();
}
```

## 一对多/多对多模型使用注解开发

一对多模型或多对多模型使用注解开发需要分开查询，首先在用户查询方法中配置基本映射对象，配置orderList对象时需要指定javaType为集合类型，以及many属性利用@Many标签指定一对多模型查询使用的另一个表的方法


```java
public interface UserMapper {
    @Select("select * from user")
    @Results({
            @Result(column = "id",property = "id"),
            @Result(column = "username",property = "username"),
            @Result(column = "password",property = "password"),
            @Result(
                    property = "orderList",
                    column = "id",
                    javaType = List.class,
                    many = @Many(select = "cn.ywrby.mapper.OrderMapper.findByUid")
            )
    })
    public List<User> findAll();
}
```

另一个表的查询方法，由于除了查询需要的uid，查询结果数据都是本表内的，所以不需要配置映射关系
```java
public interface OrderMapper {
    @Select("select * from orders where userId=#{uid}")
    public List<Order> findByUid();
}
```

测试用例
```java
public class MyBatisTest {
    private UserMapper mapper;
    @Before
    public void before() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("SqlMapConfig.xml");
        SqlSessionFactory factory=new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = factory.openSession(true);
        mapper = sqlSession.getMapper(UserMapper.class);
    }
    @Test
    public void test(){
        List<User> userList=mapper.findAll();
        for(User user:userList){
            System.out.println(user);
        }
    }
}
/*
User{id=1, username='Leslie', password='123', orderList=[Order{id=1, orderName='textbook', orderAmount=10, user=null}, Order{id=9, orderName='mathbook', orderAmount=16, user=null}]}
User{id=2, username='Jessica', password='123', orderList=[Order{id=2, orderName='mathbook', orderAmount=15, user=null}]}
User{id=4, username='lily', password='1234', orderList=[Order{id=3, orderName='writebook', orderAmount=6, user=null}]}
User{id=6, username='Kelly', password='1234', orderList=[Order{id=4, orderName='chinesebook', orderAmount=10, user=null}]}
User{id=7, username='Les', password='1234', orderList=[Order{id=5, orderName='textbook', orderAmount=10, user=null}]}
User{id=8, username='dshjihi', password='398', orderList=[Order{id=6, orderName='textbook', orderAmount=10, user=null}]}
User{id=9, username='Pixel', password='9999', orderList=[]}
*/
```
