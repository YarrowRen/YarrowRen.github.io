---
author: Boyu Ren
pubDatetime: &id001 2021-03-20 13:53:36
modDatetime: *id001
title: 17-MyBatis映射文件与核心配置文件深入
slug: 17-MyBatis映射文件与核心配置文件深入
featured: false
draft: false
tags:
- Spring
- MyBatis
description: 可以看到，在之前的映射文件中，所有sql语句都是写死的，并不会根据我传入参数的不同进行区分，但在实际开发过程中，可能需要执行sql语句查询前先进行逻辑判断或其他操作，对参数进行简单的判断
---

# MyBatis映射文件深入

## 动态sql

可以看到，在之前的映射文件中，所有sql语句都是写死的，并不会根据我传入参数的不同进行区分，但在实际开发过程中，可能需要执行sql语句查询前先进行逻辑判断或其他操作，对参数进行简单的判断

例如下面的简单情况，我们在映射文件中写明了查询的条件，需要你User对象传入三个参数
```xml
    <select id="findByCondition" parameterType="user" resultType="user">
        select * from user where id=#{id} and username=#{username} and  password=#{password}
    </select>
```
此时，传入的User对象若存在该三个属性值则能够进行正常的查询
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
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        List<User> users = mapper.findByCondition(user);
        System.out.println(users);
    }
    /* 执行结果
    [User{id=4, username='lily', password='1234'}]
    */
```
若我们传入的User没有任一属性值，则不能正确查询
```java
    @Test
    public void test() throws IOException {
        User user=new User();
        user.setId((long) 4);
        //user.setUsername("lily");
        user.setPassword("1234");
        InputStream resourceAsStream = Resources.getResourceAsStream("SqlMapConfig.xml");
        SqlSessionFactory factory=new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = factory.openSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        List<User> users = mapper.findByCondition(user);
        System.out.println(users);
    }
    /* 执行结果为[]
    因为缺少属性值username所以查询语句变成了
    select * from user where id=4 and username=null and  password=1234
    而不存在username为空的数据，所以返回空集合
    */
```
很明显这不是我们想要达成的业务逻辑，所以我们可以采用动态sql的方式，通过提供的标签进行简单的逻辑判断

### if标签

if标签用于进行判断逻辑操作，使用方式如下,分别判断各个属性值是否为空，若不为空则将对应语句添加到原语句的后面，若为空则不添加，这里的where标签与数据库中的where语法一致，只是它可以自动合理的帮我们拼接多个if条件语句，并且如果所有条件均不满足，where不会拼接

```xml
    <select id="findByCondition" parameterType="user" resultType="user">
        select * from user
        <where>
            <if test="id!=0">
                and id=#{id}
            </if>
            <if test="username!=null">
                and username=#{username}
            </if>
            <if test="password!=null">
                and password=#{password}
            </if>
        </where>
    </select>
```
使用后，原测试用例在省略参数后也可以正常查询到符合条件的数据

### foreach标签
在实际应用中，我们还可能遇到查询条件不唯一的情况，例如所有编号为1或2或3的查询结果，如果单纯利用sql语句的方式可以写为`SELECT * FROM user WHERE id IN (1,2,3)`,而实际开发中这个list集合一般是由service层传递给mapper层作为参数进行查询，此时就需要用到foreach标签进行集合的遍历

foreach标签的属性值较多，其分别代表：
- collection：集合类型，可以为list或array
- item：表示遍历的元素的名称
- open：语句开头的内容，根据sql语句进行填写
- close：语句结束的部分，同样根据sql语句进行填写即可
- separator：元素之间的分隔符，分割每个遍历元素的
- 标签体中写元素格式即可
```xml
    <select id="findByList" parameterType="list" resultType="user">
        select * from user
        <where>
            <foreach collection="list" item="id" open="id in (" close=")" separator=",">
                #{id}
            </foreach>
        </where>
    </select>
```

foreach标签的拼接结果是`id IN (1,2,3)` 再利用where标签将其与原语句拼接后得到`SELECT * FROM user WHERE id IN (1,2,3)`


## sql片段的抽取

对于配置文件中高度重复的sql语句片段，我们可以利用抽取的思想对语句片段进行抽取，方便复用和修改

```xml
    <!--sql语句的抽取-->
    <sql id="selectAll">select * from user</sql>

    <!--使用抽取的sql语句-->
    <select id="findByList" parameterType="list" resultType="user">
        <include refid="selectAll"></include>
        <where>
            <foreach collection="list" item="id" open="id in (" close=")" separator=",">
                #{id}
            </foreach>
        </where>
    </select>
```

# MyBatis核心配置文件深入

## typeHandler-类型转换器

当我们从数据库获取数据或将数据写入数据库的过程中，始终存在类型转换的过程，例如Java中的Integer到数据库中的int或Java中的String到数据库中的varchar，这些基本数据类型的转换MyBatis已经有自己默认的类型转换器，一般情况下不需要我们处理，但当我们要处理自己定义的类型或MyBaitis没有默认处理的类型时，就需要自己定义类型转换器（例如将日期类型转换为毫秒值存入数据库，再在读取数据时将毫秒值转为日期）

### typeHandler使用步骤

这里实现了将Date类型存入数据库的过程中转换为毫秒值传入，并在从数据库读取该数据时重新转换为Date类型存入User对象

#### 1. 定义转换类继承类BaseTypeHandler<T>并实现方法

```java
public class DateTypeHandler extends BaseTypeHandler<Date> {
    //将Java类型转换为数据库所需的类型,参数i表示将转换后数据插入的位置，字段躲在的列
    @Override
    public void setNonNullParameter(PreparedStatement preparedStatement, int i, Date date, JdbcType jdbcType) throws SQLException {
        //将日期转为长整型
        long time = date.getTime();
        //设置参数
        preparedStatement.setLong(i,time);
    }

    //将数据库类型转换为Java所需的类型
    //s参数表示数据表字段的名称，resultSet是查询结果集
    @Override
    public Date getNullableResult(ResultSet resultSet, String s) throws SQLException {
        //获取数据库中的数据
        Long dateTime=resultSet.getLong(s);
        //转化为Java中的Date类型
        Date date=new Date(dateTime);
        //返回数据
        return date;
    }

    //将数据库类型转换为Java所需的类型
    @Override
    public Date getNullableResult(ResultSet resultSet, int i) throws SQLException {
        //获取数据库中的数据
        Long dateTime=resultSet.getLong(i);
        //转化为Java中的Date类型
        Date date=new Date(dateTime);
        //返回数据
        return date;
    }

    //将数据库类型转换为Java所需的类型
    @Override
    public Date getNullableResult(CallableStatement callableStatement, int i) throws SQLException {
        //获取数据库中的数据
        Long dateTime=callableStatement.getLong(i);
        //转化为Java中的Date类型
        Date date=new Date(dateTime);
        //返回数据
        return date;
    }
}
```

#### 2. 在MyBatis核心配置文件中配置转换器
```xml
    <!--自定义类型转换器-->
    <typeHandlers>
        <typeHandler handler="cn.ywrby.handler.DateTypeHandler"/>
    </typeHandlers>
```

#### 3. 测试转换效果

```java
    @Test
    public void test() throws IOException {
        User user=new User();
        user.setId((long) 6);
        user.setUsername("Kelly");
        user.setPassword("1234");
        //获取当前时间并作为参数传入
        user.setDate(new Date());
        InputStream resourceAsStream = Resources.getResourceAsStream("SqlMapConfig.xml");
        SqlSessionFactory factory=new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = factory.openSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        //测试能否将Date类型转为毫秒值保存到数据库
        mapper.save(user);
        sqlSession.commit();
        //测试从数据库读取数据能否正确转换为Java中的Date类型
        List<User> userList = mapper.findByCondition(user);
        System.out.println(userList);
        sqlSession.close();
    }
    /* 运行结果
    [User{id=6, username='Kelly', password='1234', date=Sat Mar 20 16:30:36 CST 2021}]
     */
```
数据库显示效果
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/databasehdisa.png)

可以看到首先成功将Date类型存入数据库的值变为毫秒值，而从数据读取到Java过程中又转换回了Date类型


## plugins-插件标签

MyBatis可以使用第三方插件来进行功能的扩展，这里以分页助手（page-helper）为例进行插件使用的演示，其功能是将复杂的分页技术进行封装，使用简单的方式即可获取分页数据

### 插件使用步骤
1. 导入插件的坐标
2. 在mybatis核心配置文件中配置插件
3. 测试分页数据的获取

#### 导入page-helper的坐标

```xml
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>5.3.3</version>
        </dependency>
```

#### 在核心配置文件中配置插件
```xml
    <!--
    plugins在配置文件中的位置必须符合要求，否则会报错，顺序如下:
    properties?, settings?,
    typeAliases?, typeHandlers?,
    objectFactory?,objectWrapperFactory?,
    plugins?,
    environments?, databaseIdProvider?, mappers?
    -->
    <plugins>
        <!-- com.github.pagehelper为PageHelper类所在包名 -->
        <plugin interceptor="com.github.pagehelper.PageInterceptor">
            <!--配置数据库方言-->
            <property name="helperDialect" value="mysql"/>
        </plugin>
    </plugins>
```


#### 测试分页数据获取

```java
    @Test
    public void test() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("SqlMapConfig.xml");
        SqlSessionFactory factory=new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = factory.openSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);

        //设置分页相关参数 当前页，每页显示的条数
        PageHelper.startPage(1,3);

        List<User> userList=mapper.findAll();
        for (User user:userList){
            System.out.println(user);
        }

        //获得与分页相关的参数
        PageInfo<User> pageInfo=new PageInfo<User>(userList);
        //输出相关信息
        System.out.println("当前页："+pageInfo.getPageNum());
        System.out.println("总条数："+pageInfo.getTotal());
        System.out.println("总页数："+pageInfo.getPages());
        System.out.println("上一页："+pageInfo.getPrePage());

        sqlSession.close();
    }
    /* 运行结果
    User{id=1, username='Leslie', password='123', date=null}
    User{id=2, username='Jessica', password='123', date=null}
    User{id=4, username='lily', password='1234', date=null}
    当前页：1
    总条数：6
    总页数：2
    上一页：0
     */
```

可以看到，数据按照指定的第一页显示三条进行了输出，并且可以通过PageInfo对象获取所有的分页信息

