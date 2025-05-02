---
author: Boyu Ren
pubDatetime: &id001 2021-03-18 01:36:46
modDatetime: *id001
title: 16-MyBatis概述
slug: 16-MyBatis概述
featured: false
draft: false
tags:
- Spring
- MyBatis
description: '- 数据库的连接创建，释放频繁造成系统资源浪费从而影响系统性能'
---

# MyBatis概述

### 原始JDBC开发存在的问题
- 数据库的连接创建，释放频繁造成系统资源浪费从而影响系统性能
- sql 语句在代码中硬编码，造成代码不易维护，实际应用 sql 变化的可能较大，sql 变动需要改变java代码。（sql语句与Java代码耦合死）
- 查询操作时，需要手动将结果集中的数据手动封装到实体中。插入操作时，需要手动将实体的数据设置到sql语句的占位符位置

### 解决方案

- 池化思想：使用数据库连接池初始化连接资源
- 配置文件：将sql语句抽取到xml配置文件中
- 使用反射、内省等底层技术，自动将实体与表进行属性与字段的自动映射


## MyBatis简介
> MyBatis 是一款优秀的**持久层**框架，它内部封装了JDBC，它支持定制化 SQL、存储过程以及高级映射。MyBatis 避免了几乎所有的 JDBC 代码和手动设置参数以及获取结果集。MyBatis 可以使用简单的 XML 或注解来配置和映射原生信息，将接口和 Java 的 POJO映射成数据库中的记录。

mybatis通过xml或注解的方式将要执行的各种 statement配置起来，并通过java对象和statement中sql的动态参数进行映射生成最终执行的sql语句。

最后mybatis框架执行sql并将结果映射为java对象并返回。采用ORM思想（Object Relational Mapping：对象关系映射）解决了实体和数据库映射的问题，对jdbc 进行了封装，屏蔽了jdbc api 底层访问细节，使我们不用与jdbc api 打交道，就可以完成对数据库的持久化操作。


## MyBatis快速开发步骤

### 添加MyBatis坐标
```xml
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.4.0</version>
        </dependency>
```

### 创建User数据表
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/databasehjkh.png)


### 创建User实体类
```java
public class User {
    private Long id;
    private String username;
    private String password;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
```
### 编写映射文件UserMapper.xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!--映射文件DTD约束头-->
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<!--映射文件，namespace是为了方便调用映射文件中的映射方法，与下面语句的ID一起作为查询标识-->
<mapper namespace="userMapper">
    <!--标签类型有select update delete等 -->
    <!--resultType表示将返回的查询结果封装到的结果集，即查询结果对应的实体类型-->
    <select id="findAll" resultType="cn.ywrby.domain.User">
        select * from user
    </select>
</mapper>
```

### 编写核心文件SqlMapConfig.xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
    
    <!--配置数据源环境-->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"></transactionManager>
            <dataSource type="POOLED">
                <!--配置连接池基本数据-->
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://cdb-cd3ybvc6.cd.tencentcdb.com:hj/jdbcTest"/>
                <property name="username" value="root"/>
                <property name="password" value="rlm214"/>
            </dataSource>
        </environment>
    </environments>

    <!--加载映射文件-->
    <mappers>
        <mapper resource="cn\ywrby\mapper\UserMapper.xml"/>
    </mappers>
</configuration>
```
### 编写测试类并执行测试
```java
    @Test
    public void test() throws IOException {
        //加载核心配置文件
        InputStream resourceAsStream = Resources.getResourceAsStream("SqlMapConfig.xml");
        //获得sqlSession工厂对象
        SqlSessionFactory factory=new SqlSessionFactoryBuilder().build(resourceAsStream);
        //获得sqlSession对象用于执行sql语句
        SqlSession sqlSession = factory.openSession();
        //执行sql语句 参数：namespance.id
        List<User> userList=sqlSession.selectList("userMapper.findAll");
        //打印结果
        System.out.println(userList);
        //释放资源
        sqlSession.close();
    }
```

## MyBatis的数据库操作（增删改查）

配置映射文件
```xml
    <!--配置插入操作 parameterType表示参数对象，
    即执行插入操作时，传入该参数，并将该类属性值传入数据库
    mybatis映射文件中的占位符是#{} 其内部传入的是类的属性值而不是数据库的列名-->
    <insert id="save" parameterType="cn.ywrby.domain.User">
        insert into user values (#{id},#{username},#{password})
    </insert>

    <update id="update" parameterType="cn.ywrby.domain.User">
        update user set username=#{username},password=#{password} where id=#{id}
    </update>

    <delete id="delete" parameterType="java.lang.Integer">
        delete from user where id=#{id}
    </delete>
```

测试用例：
```java
    /**
     * 测试插入语句执行
     * 要注意的是在执行插入删除语句等需要对数据库进行修改的sql语句时
     * 必须进行事务的提交，mybatis默认不提交事务
     * 而查询语句由于不修改数据库内容，所以不需要进行事务的提交
     */
    @Test
    public void test() throws IOException {
        //实例化要插入的对象并传参
        User user=new User();
        user.setId((long) 3);
        user.setUsername("Lily");
        user.setPassword("5667");
        //加载核心配置文件
        InputStream resourceAsStream = Resources.getResourceAsStream("SqlMapConfig.xml");
        //获得sqlSession工厂对象
        SqlSessionFactory factory=new SqlSessionFactoryBuilder().build(resourceAsStream);
        //获得sqlSession对象用于执行sql语句
        SqlSession sqlSession = factory.openSession();
        //执行插入语句，并传入要插入的对象
        sqlSession.selectList("userMapper.save",user);
        //提交事务
        sqlSession.commit();
        //释放资源
        sqlSession.close();
    }
```

## MyBatis核心配置文件概述

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
    
    <!--配置数据源环境,default指定默认的环境名称-->
    <environments default="development">
        <!--environment进行环境配置，id指定当前环境的名称-->
        <environment id="development">
            <!--type属性表示指定事务管理类型是JDBC-->
            <transactionManager type="JDBC"></transactionManager>
            <!--配置数据源，type="POOLED"表示指定当前数据源类型是连接池-->
            <dataSource type="POOLED">
                <!--配置连接池基本数据-->
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://cdb-cd3ybvc6.cd.tencentcdb.com:10056/jdbcTest"/>
                <property name="username" value="root"/>
                <property name="password" value="renboyu010214"/>
            </dataSource>
        </environment>
    </environments>

    <!--加载映射文件-->
    <mappers>
        <mapper resource="cn\ywrby\mapper\UserMapper.xml"/>
    </mappers>
</configuration>
```


### 事务管理器（transactionManager）类型有两种：
- JDBC：直接使用JDBC的提交与回滚，依赖于从数据源处得来的连接来管理事务作用域
- MANAGED：这个配置几乎不进行操作，不提交或回滚任何一个连接，而是让容器来管理整个事务的生命周期

### 数据源（datasource）类型有三种：
- UNPOOLED：每次被请求时打开或关闭连接
- POOLED：该数据源利用池的概念将JDBC连接对象组织起来
- JNDI

### mapper标签
mapper标签的作用是加载映射文件，其加载文件的方式有多种：
- 使用相对于类的路径的资源引用的方式（一般情况下均使用该方式）：`<mapper resource="cn\ywrby\mapper\UserMapper.xml"/>`
- 使用完全限定资源定位符URL：`<mapper url="file:///var/mappers/xxx.xml"/>`
- 使用映射器接口实现类的完全限定名(结合注解方式使用)：`<mapper class="cn.ywrby.builder.AuthorMapper"/>`
- 将包内的映射器接口实现全部注册为映射器(类似于对该包进行扫描，将所有映射器接口实现类注册为映射器)：`<package name="cn.ywrby.mapper"/>`



### properties标签

properties标签用于加载外部properties文件，可以使各文件分工更加明确（如加载jdbc.properties）

### typeAliases标签
typeAliases标签用于自定义别名，定义别名可以简化我们代码输入,type属性用于表示定义别名的实体类名，alias是自定义的别名

```xml
    <!--配置别名-->
    <typeAliases>
        <typeAlias type="cn.ywrby.domain.User" alias="user"/>
    </typeAliases>
```

在UserMapper.xml中使用,parameterType和resultType都可以使用别名替换，另外MyBatis也为一些基本类提前定义了别名
```xml
<mapper namespace="userMapper">
    <select id="findAll" resultType="user">
        select * from user
    </select>
    <insert id="save" parameterType="user">
        insert into user values (#{id},#{username},#{password})
    </insert>
    <delete id="delete" parameterType="int">
        delete from user where id=#{id}
    </delete>
</mapper>
```

#### 默认的别名

别名|数据类型
---|---
String|java.lang.String
long|java.lang.Long
int|java.lang.Integer
double|java.lang.Double
boolean|java.lang.Boolean 

## MyBatis的DAO层实现

MyBatis的传统实现方式就是通过上文测试类中的一般方法，在每次的使用过程中，都需要加载核心配置文件，初始化会话工程，执行事务提交等繁琐操作，
所以一般情况下，在开发过程中不会采用传统的实现方式

### 接口代理方式实现

接口代理开发方式只需要我们实现Mapper接口（就是之前编写的DAO层接口），然后由MyBatis根据接口的定义（根据方法名，返回值，参数值等）创建接口的动态代理对象

Mapper接口的开发需要遵循以下的规范
- Mapper.xml文件中的namespace是接口的全限定名
- Mapper接口的方法名和Mapper.xml中定义的statement的ID值相同
- Mapper接口方法的输入参数和Mapper.xml中定义的sql语句的parameterType的类型相同
- Mapper接口方法的输出参数和Mapper.xml中定义的sql语句的resultType的类型相同

修改后的UserMapper.xml配置文件
```xml
<!--命名空间的值和接口类全限定名一致-->
<mapper namespace="cn.ywrby.mapper.UserMapper">
    <!--id值和方法名一致，resultType和返回值类型一致（这里了别名）-->
    <select id="findAll" resultType="user">
        select * from user
    </select>
    <!--parameterType的值也需要和传入参数一致-->
    <insert id="save" parameterType="user">
        insert into user values (#{id},#{username},#{password})
    </insert>

    <update id="update" parameterType="user">
        update user set username=#{username},password=#{password} where id=#{id}
    </update>

    <delete id="delete" parameterType="java.lang.Long">
        delete from user where id=#{id}
    </delete>
</mapper>
```

接口实现
```java
public interface UserMapper {
    //这里返回值虽然是List类型，但其中存储的是User类型，所以也可以成功实现
    public List<User> findAll();
    public void save(User user);
    public void update(User user);
    public void delete(Long id);
}
```

测试用例
```java
    @Test
    public void test() throws IOException {
        User user=new User();
        user.setId((long) 4);
        user.setUsername("lily");
        user.setPassword("1234");
        InputStream resourceAsStream = Resources.getResourceAsStream("SqlMapConfig.xml");
        SqlSessionFactory factory=new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = factory.openSession();

        //通过getMapper方法传入接口类，获得MyBatis返回的实现类
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        //执行接口方法
        mapper.update(user);
        //mapper.delete((long) 4);
        //mapper.findAll();
        //mapper.save(user);

        sqlSession.commit();
        sqlSession.close();
    }
```