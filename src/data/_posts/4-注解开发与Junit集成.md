---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 08:27:52
modDatetime: *id001
title: 4-注解开发与Junit集成
slug: 4-注解开发与Junit集成
featured: false
draft: false
tags:
- Spring
description: Spring是轻代码而重配置的框架，一般情况下，配置比较繁重，影响开发效率，所以注解开发是一种必然趋势，注解代替XML配置文件可以简化配置，提高开发效率
---

# Spring注解开发

Spring是轻代码而重配置的框架，一般情况下，配置比较繁重，影响开发效率，所以注解开发是一种必然趋势，注解代替XML配置文件可以简化配置，提高开发效率

## Spring原始注解
Spring的原始注解主要用于代替XML配置中的<Bean>标签

注解|说明
---|---
@Component	|使用在类上用于实例化Bean
@Controller	|使用在web层类上用于实例化Bean
@Service	|使用在service层类上用于实例化Bean
@Repository	|使用在dao层类上用于实例化Bean
@Autowired	|使用在字段上用于根据类型进行依赖注入
@Qualifier	|结合@Autowired一起使用用于根据名称进行依赖注入
@Resource	|相当于@Autowired+@Qualifier，按照名称进行注入
@Value	|注入普通属性
@Scope	|标注Bean的作用范围
@PostConstruct	|使用在方法上标注该方法是Bean的初始化方法
@PreDestory	|使用在方法上标注该方法时Bean的销毁方法

#### 未使用注解的情况下

```java
public class UserDaoImpl implements UserDao {
    @Override
    public void save() {
        System.out.println("save runnning...");
    }
}
```

```java
public class UserServiceImpl implements UserService {
    private UserDao dao;

    public void setDao(UserDao dao) {
        this.dao = dao;
    }

    @Override
    public void save() {
        dao.save();
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <bean id="userDao" class="cn.ywrby.dao.impl.UserDaoImpl"></bean>
    <bean id="userService" class="cn.ywrby.service.impl.UserServiceImpl">
        <property name="dao" ref="userDao"/>
    </bean>
</beans>
```

#### 使用注解简化后
```java
//@Component作用是实例化Bean，作用和<Bean>标签相同，传入的参数就是当前对象的ID
@Component("userDao")
public class UserDaoImpl implements UserDao {
    @Override
    public void save() {
        System.out.println("save runnning...");
    }
}
```

```java
//@Component作用是实例化Bean，作用和<Bean>标签相同，传入的参数就是当前对象的ID
@Component("userService")
public class UserServiceImpl implements UserService {

    //@Qualifier结合@Autowired一起使用用于根据名称进行依赖注入
    //@Qualifier后边传入的参数则是要注入的对象的ID
    @Autowired
    @Qualifier("userDao")
    private UserDao dao;

    public void setDao(UserDao dao) {
        this.dao = dao;
    }

    @Override
    public void save() {
        dao.save();
    }
}
```

利用注解后还需要在配置文件中利用context命名空间进行注解扫描，利用注解扫描，Spring才能识别对应文件夹下所有的注解
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
</beans>
```

上面的@Component注解方式可以完整代替之前完全通过XML配置的方式，但是所有的<Bean>标签配置都通过@Component注解容易造成混淆，导致我们并不清楚该对象属于哪一层，这时我们就可以用@Controller，@Service，@Repository这种注解替换原先的@Component注解，它们在作用上是完全一致的，但后三种明显更好区别

```java
//@Repository作用是实例化Bean，作用和<Bean>标签相同，传入的参数就是当前对象的ID
@Repository("userDao")
public class UserDaoImpl implements UserDao {
    @Override
    public void save() {
        System.out.println("save runnning...");
    }
}
```

```java
//@Service作用是实例化Bean，作用和<Bean>标签相同，传入的参数就是当前对象的ID
@Service("userService")
public class UserServiceImpl implements UserService {

    //@Qualifier结合@Autowired一起使用用于根据名称进行依赖注入
    //@Qualifier后边传入的参数则是要注入的对象的ID
    @Autowired
    @Qualifier("userDao")
    private UserDao dao;

    public void setDao(UserDao dao) {
        this.dao = dao;
    }

    @Override
    public void save() {
        dao.save();
    }
}
```

另外在上面的UserServiceImpl类中，采用了注解注入的方式将Spring容器中的UserDao对象注入到类中，此时我们可以省略掉类中的set方法，不用像XML配置过程中必须有专门的setDao方法

```java
//@Service作用是实例化Bean，作用和<Bean>标签相同，传入的参数就是当前对象的ID
@Service("userService")
public class UserServiceImpl implements UserService {

    //@Qualifier结合@Autowired一起使用用于根据名称进行依赖注入
    //@Qualifier后边传入的参数则是要注入的对象的ID
    @Autowired
    @Qualifier("userDao")
    private UserDao dao;

    @Override
    public void save() {
        dao.save();
    }
}
```

@Autowired注解是按照类型自动注入，例如上面代码中，如果省略@Qualifier，UserDao同样能成功注入，但如果容器中同时有多个UserDao对象则会出现错误。@Qulifier是按照ID注入，它不能单独使用，必须搭配@Autowired注解一起使用

@Resource注解可以简化以上两个标签，它的作用就相当于@Autowired和@Qulifier同时使用

```java
@Service("userService")
public class UserServiceImpl implements UserService {

    @Resource(name="userDao")
    private UserDao dao;

    public void setDao(UserDao dao) {
        this.dao = dao;
    }

    @Override
    public void save() {
        dao.save();
    }
}
```

#### 其他普通注解的使用
```java
//@Service作用是实例化Bean，作用和<Bean>标签相同，传入的参数就是当前对象的ID
@Service("userService")
//@Scope是用来标明单例或多例
@Scope("singleton")
public class UserServiceImpl implements UserService {

    @Resource(name="userDao")
    private UserDao dao;

    //@Value用于进行普通值的注入
    //同时@Value也支持EL表达式，同样可以读取context命名空间中的值
    @Value("Leslie")
    private String name;
    @Value("${driver}")
    private String driver;

    @Override
    public void save() {
        dao.save();
        System.out.println(name);
        System.out.println(driver);
    }

    //@PostConstruct用来标记初始化方法
    @PostConstruct
    public void init(){
        System.out.println("init running...");
    }

    ////@PreDestroy用来标记销毁方法
    @PreDestroy
    public void destroy(){
        System.out.println("destroy running...");
    }
}
```

## Spring新注解

使用Spring原始注解还不能代替XML配置中的全部内容，许多配置还不能被替代

- 非自定义的Bean的配置<Bean>
- 加载properties文件的配置<context:property-placeholder>
- 组件扫描的配置<context:component-scan>
- 引入其他文件<import>


### Spring中的新注解

注解|说明
---|---
@Configuration|用于指定当前类是一个Spring的配置类，当创建容器时会从该类上加载注解
@ComponentScan|用于指定Spring在初始化容器时要扫描的包，作用与XML配置文件中的<context:component-scan base-package="cn.ywrby"/>一样
@Bean|使用在方法上，标注将该方法返回值存储到Spring容器中
@PropertySource|用于加载.properties文件中的配置
@Import|用于导入其他配置类


### 使用新注解替代XML配置中的全部内容

```java
//@Configuration注解表示该类是Spring的核心配置类
@Configuration
//配置注解扫描
//<context:component-scan base-package="cn.ywrby"/>
@ComponentScan("cn.ywrby")
//加载properties配置文件(classpath表示的就是资源目录resources下)
//<context:property-placeholder location="classpath:jdbc.properties"/>
@PropertySource("classpath:jdbc.properties")
//引入其他配置类
@Import(SpringConfiguration_data.class)
public class SpringConfiguration {

    //<!--配置文件已经成功加载，可以利用配置文件注入-->
    //    <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
    //        <property name="driverClass" value="${driver}"></property>
    //        <property name="jdbcUrl" value="${url}"></property>
    //        <property name="user" value="${user}"></property>
    //        <property name="password" value="${password}"></property>
    //    </bean>

    //首先利用普通值注入获得数据源所需的参数
    @Value("${driver}")
    private String driver;
    @Value("${url}")
    private String url;
    @Value("${user}")
    private String user;
    @Value("${password}")
    private String password;
    //将通过注入获得的值传入数据源中并返回，@Bean注解可以将返回值加入到Spring容器中
    //这样就解决了非自定义的Bean的配置
    @Bean("dataSource")
    public DataSource getDataSource() throws PropertyVetoException {
        ComboPooledDataSource dataSource=new ComboPooledDataSource();
        dataSource.setDriverClass(driver);
        dataSource.setJdbcUrl(url);
        dataSource.setUser(user);
        dataSource.setPassword(password);
        return dataSource;
    }
}
```

#### 测试用例
注意这里在创建Spring容器时需要用AnnotationConfigApplicationContext方法读取配置类，与以前读取配置文件时不同

```java
    /**
     * 利用Spring创建C3P0数据源（配置类）
     */
    @Test
    public void c3p0SpringTest2() throws SQLException {
        //创建Spring容器(这里需要使用专门读取配置类的方法AnnotationConfigApplicationContext)
        ApplicationContext context=new AnnotationConfigApplicationContext(SpringConfiguration.class);
        //利用Spring容器获取数据源
        ComboPooledDataSource dataSource= (ComboPooledDataSource) context.getBean("dataSource");
        //从数据源获取连接资源
        Connection connection=dataSource.getConnection();
        System.out.println(connection);
        //释放连接资源
        connection.close();
    }
```

# Spring整合Junit

### 原始Junit测试Spring时的问题
在测试Spring过程中Spring容器的创建和Bean的获取每次都需要写，重复性极高

### 解决思路
- 让SpringJunit负责创建容器，每次只需要传入配置文件即可
- 将需要测试的Bean直接在测试类中注入


## Spring集成Junit步骤
1. 导入Spring集成Junit的坐标和Junit坐标
2. 使用@Runwith替换原来的运行期
3. 使用@ContextConfiguration指定配置文件或配置类
4. 使用@Autowired注入需要测试的对象
5. 创建测试方法进行测试

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:applicationContext.xml")
public class SpringJunitTest {

    @Resource(name = "userService")
    private UserService userService;
    @Resource(name = "userDao")
    private UserDao userDao;

    @Test
    public void userServiceTest(){
        userService.save();
    }

    @Test
    public void userDaoTest(){
        userDao.save();
    }
}
```

