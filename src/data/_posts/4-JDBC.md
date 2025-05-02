---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:28:04
modDatetime: *id001
title: 4-JDBC
slug: 4-JDBC
featured: false
draft: false
tags:
- JavaWeb
description: 本质是sun公司制作的一套操作所有关系型数据库的规则，即接口。各个数据库厂商负责实现这些接口，提供响应的数据库驱动jar包，我们可以使用这套接口（JDBC）编程，最终真正执行的是数据库驱动jar包中的实现类
---

# JDBC Java数据库连接
### (Java Database Connectivity)

## JDBC本质
本质是sun公司制作的一套操作所有关系型数据库的规则，即接口。各个数据库厂商负责实现这些接口，提供响应的数据库驱动jar包，我们可以使用这套接口（JDBC）编程，最终真正执行的是数据库驱动jar包中的实现类


## 基本流程
1. 导入驱动jar包
    1. 在项目中新建libs目录(和src同级)
    2. 将mysql-connector-java-8.0.20.jar复制到libs目录中
    3. 右键libs目录，将该目录添加到library(add as library)
2. 注册驱动
3. 获取数据库连接对象Connection
4. 定义sql
5. 获取执行sql语句的对象statement
6. 执行sql，接收返回结果
7. 处理结果
8. 释放资源

```java
public class JDBCDemo1 {

    public static void main(String[] args) throws Exception {
        //注册驱动
        Class.forName("com.mysql.cj.jdbc.Driver");
        //获取数据库连接对象
        Connection connection= DriverManager.getConnection("jdbc:mysql://cdb-cd3ybvc6.cd.tencentcdb.com:10056/weixinNews","root","renboyu");
        //定义sql语句
        String sql="SELECT * FROM WEIBO WHERE TITLE LIKE '%韩国%';";
        //获取执行sql的对象Statement
        Statement statement=connection.createStatement();
        //执行sql语句
        ResultSet set=statement.executeQuery(sql);
        //打印结果
        while (set.next()){
            String title=set.getString("TITLE");
            System.out.println(title);
        }
        //释放资源
        statement.close();
        connection.close();
    }
}
```

#### 更规范的流程
（尽量避免直接抛出错误）
```java
public class JDBCDemo2 {

    public static void main(String[] args) {
        Connection connection=null;
        Statement statement=null;
        try {
            //注册驱动
            Class.forName("com.mysql.cj.jdbc.Driver");
            //定义sql语句
            String sql="insert into stuMess VALUES(null,'Leslie','CS','95');";
            //获取数据库连接对象
            connection= DriverManager.getConnection("jdbc:mysql://cdb-cd3ybvc6.cd.tencentcdb.com:10056/jdbcTest","root","renboyu010214");
            //获取执行sql的对象Statement
            statement=connection.createStatement();
            //执行sql语句
            int result=statement.executeUpdate(sql);
            //输出结果
            System.out.println(result);
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }finally {
            //释放资源,由于可能出错导致没有成功获取数据库连接对象和Statement，所以要提前检验是否为空
            if(statement!=null) {
                try {
                    statement.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
            if(connection!=null) {
                try {
                    connection.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
        }

    }

}
```

## 各个对象详解

### DriverManager
驱动管理对象 
#### 功能
**注册驱动**

DriverManager提供registerDriver方法注册给定的驱动程序，而我们在上面代码中所写的`Class.forName("com.mysql.cj.jdbc.Driver");`之所以能注册驱动，是因为将com.mysql.cj.jdbc.Driver加载进了内存，而com.mysql.cj.jdbc.Driver包内存在静态代码块，通过阅读源码可以找到该静态代码块

```java
    static {
        try {
            java.sql.DriverManager.registerDriver(new Driver());
        } catch (SQLException E) {
            throw new RuntimeException("Can't register driver!");
        }
    }
```
可以看到`Class.forName("com.mysql.cj.jdbc.Driver");`仍然是通过调用DriverManager提供的registerDriver方法注册驱动程序，只是这种写法比调用方法更加简洁

不过，自5版本后，jar包会自动帮我们注册驱动，所以其实注册驱动步骤可以省略

![自动注册驱动](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8C%E9%A9%B1%E5%8A%A8.jpg)

    
**获取数据库连接**

利用DriverManager的getConnection方法可以获取数据库连接，返回数据库连接对象

该方法接收三个参数，分别是
- url:指定连接路径，以MySQL为例：jdbc:mysql://ip地址(域名):端口号/数据库名称
- user:用户名
- password:密码



### Connection
数据库连接对象

#### 功能

**获取执行sql语句的对象**
- Statement	createStatement()
- PreparedStatement	prepareStatement(String sql)

**管理事务**

- 开启事务：void setAutoCommit​(boolean autoCommit)  调用该方法，设置参数为false，即可开启事务
    - 在执行sql语句之前开启事务
- 提交事务：void commit()  
    - 在所有sql语句执行完后提交事务
- 回滚事务：void rollback()
    - 在catch中回滚事务

### Statement
执行sql语句的对象

#### 功能
**执行sql语句**

- boolean	execute(String sql) 执行任意的sql语句，不常用（返回值为执行的结果）
- int executeUpdate​(String sql) 执行DML语句和DDL语句。返回值为影响的行数，可以作为判断执行成功与否的标准
- ResultSet	executeQuery​(String sql) 执行DQL语句




### ResultSet
数据库结果集对象

- boolean next() 游标向下移动一行,返回值表示当前行是否是最后一行数据，如果是则返回false，所以可以用while循环遍历ResultSet
- getString(),getInt,getDouble...   获取某一行中的数据，可以接收两种参数，整型参数表示数据的列数，字符串型数据表示列的名称





### PreparedStatement
执行sql语句的对象

#### sql注入问题
在拼接sql时，有一些sql的特殊关键字参与字符串拼接，导致安全性问题。例如，下面代码
```java
String userName, password;
String sql="SELECT * FROM loginMess where userName ='"+userName+"' and password='"+password+"';";
```
假如password处用户传入`a' or 'a'='a'`。则整个sql语句变为了`SELECT * FROM loginMess where userName ='userName' and password='a' or 'a'='a';`则整个sql语句变为恒等句，用户始终可以登录成功

#### 可能发生sql诸如的代码
```java
/**
 * 登录案例,使用PreparedStatement实现
 */
public class LoginDemo2 {

    public static void login(String userName,String password){
        Connection connection=null;
        Statement statement=null;
        try {
            //通过工具类获取数据库连接
            connection= JDBCUtils.getConnection();
            //定义sql语句
            String sql="SELECT * FROM loginMess where userName ='"+userName+"' and password='"+password+"';";
            //获取执行sql的对象Statement
            statement=connection.createStatement();
            //执行sql语句
            ResultSet set=statement.executeQuery(sql);
            //遍历数据库表，获得所有用户对象
            if (set.next()){
                System.out.println("登陆成功");
            }else {
                System.out.println("登陆失败");
            }
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }finally {
            //通过工具类关闭资源
            JDBCUtils.closeDB(connection,statement);
        }

    }

    public static void main(String[] args) {

        Scanner sc=new Scanner(System.in);
        System.out.println("please input the username:");
        String userName=sc.nextLine();
        System.out.println("please input the password:");
        String password=sc.nextLine();
        login(userName,password);

    }
}
```

#### 解决方案
使用PreparedStatement对象来执行sql语句，PreparedStatement对象执行预编译的sql语句，所有参数使用“?”作为占位符。借此可解决sql诸如问题


#### 使用PreparedStatement后的流程
1. 导入驱动jar包
2. 注册驱动
3. 获取数据库连接对象Connection
4. 定义sql
    - 注意：定义的sql语句中的所有变量用通配符?代替
5. 获取执行sql语句的对象PreparedStatement（需要传入sql语句）
6. 给?赋值
    - setInt,setDouble等等方法，第一个参数为通配符?的位置，第二个参数为传入的值
7. 执行sql，接收返回结果（PreparedStatement对象的执行方法不需要传入sql语句，因为已经在定义时传入了）
8. 处理结果
8. 释放资源（PreparedStatement和Statement一样也需要释放）

#### 使用PreparedStatement修改后的登录代码

可以避免sql诸如问题

```java
/**
 * 登录案例,使用PreparedStatement实现
 */
public class LoginDemo2 {

    public static void login(String userName,String password){
        Connection connection=null;
        PreparedStatement preSta=null;
        ResultSet set=null;
        try {
            //通过工具类获取数据库连接
            connection= JDBCUtils.getConnection();
            //定义sql语句，所有变量用通配符?代替
            String sql="SELECT * FROM loginMess where userName =? and password=?;";
            //获取执行sql的对象PreparedStatement
            preSta=connection.prepareStatement(sql);
            //给?赋值
            preSta.setString(1,userName);
            preSta.setString(2,password);
            //执行sql语句(不需要传参)
            set=preSta.executeQuery();
            //遍历数据库表，获得所有用户对象
            if (set.next()){
                System.out.println("登陆成功");
            }else {
                System.out.println("登陆失败");
            }
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }finally {
            //通过工具类关闭资源
            JDBCUtils.closeDB(set,connection,preSta);
        }

    }

    public static void main(String[] args) {

        Scanner sc=new Scanner(System.in);
        System.out.println("please input the username:");
        String userName=sc.nextLine();
        System.out.println("please input the password:");
        String password=sc.nextLine();
        login(userName,password);

    }
}
```


## 定义JDBC工具类简化代码

### 工具类

```java

/**
 * JDBC工具类
 */

public class JDBCUtils {

    //定义各个静态遍历
    private static String url;
    private static String user;
    private static String password;
    private static String driver;

    /**
     * 静态代码块，只在创建时调用一次
     * 可以在此处进行配置文件的读取，以及驱动注册等步骤
     *
     * 将url，user，password，driver等变量
     * 存入配置文件并读取可以提高代码复用性
     */
    static {
        try {
            //创建配置文件数据集
            Properties pro=new Properties();
            //创建类加载器classLoader
            ClassLoader classLoader=JDBCUtils.class.getClassLoader();
            //通过类加载器获取在src下的配置文件，这样可以避免绝对路径带来的问题
            URL res=classLoader.getResource("jdbc.properties");
            String path=res.getPath();
            //加载配置文件
            pro.load(new FileReader(path));

            //获取配置文件中的数据
            url=pro.getProperty("url");
            user=pro.getProperty("user");
            password=pro.getProperty("password");
            driver=pro.getProperty("driver");

            //注册驱动
            Class.forName(driver);
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取数据库连接
     * @return 数据库连接
     * @throws SQLException
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url,user,password);
    }


    /**
     * 关闭数据库相关资源
     * @param rs ResultSet数据库结果集对象
     * @param connection 数据库连接对象
     * @param statement sql语句执行对象
     */
    public static void closeDB(ResultSet rs,Connection connection,Statement statement){
        if(rs!=null){
            try {
                rs.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }

        if(statement!=null){
            try {
                statement.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }

        if(connection!=null){
            try {
                connection.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }

    }

    /**
     * 关闭数据库相关资源
     * @param connection 数据库连接对象
     * @param statement sql语句执行对象
     */
    public static void closeDB(Connection connection,Statement statement){

        if(statement!=null){
            try {
                statement.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }

        if(connection!=null){
            try {
                connection.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }

    }

}
```

### 配置文件

```java
url=jdbc:mysql://cdb-cd3ybvc6.cd.tencentcdb.com:10056/weixinNews
user=root
password=rby
driver=com.mysql.cj.jdbc.Driver
```

### 测试类
```java
public class JDBCDemo3 {

    public static void main(String[] args) {
        Connection connection=null;
        Statement statement=null;
        try {
            //通过工具类获取数据库连接
            connection= JDBCUtils.getConnection();
            //定义sql语句
            String sql="SELECT * FROM WEIBO WHERE TITLE LIKE '%韩国%';";
            //获取执行sql的对象Statement
            statement=connection.createStatement();
            //执行sql语句
            ResultSet set=statement.executeQuery(sql);
            //打印结果
            while (set.next()){
                String title=set.getString("TITLE");
                System.out.println(title);
            }
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }finally {
            //通过工具类关闭资源
            JDBCUtils.closeDB(connection,statement);
        }

    }
}
```