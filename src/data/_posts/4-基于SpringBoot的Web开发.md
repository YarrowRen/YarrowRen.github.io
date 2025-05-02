---
author: Boyu Ren
pubDatetime: &id001 2021-04-19 15:17:22
modDatetime: *id001
title: 4-基于SpringBoot的Web开发
slug: 4-基于SpringBoot的Web开发
featured: false
draft: false
tags:
- Spring
- SpringBoot
- SpringMVC
- MyBatis
description: SpringBoot项目中的静态资源有两种访问方式
---

# 基于SpringBoot的Web开发流程

## 静态资源的导入


SpringBoot项目中的静态资源有两种访问方式

### 通过webjars访问

首先引入相关依赖

```xml
        <dependency><!--Webjars版本定位工具（前端）-->
            <groupId>org.webjars</groupId>
            <artifactId>webjars-locator-core</artifactId>
        </dependency>

        <dependency><!--Jquery组件（前端）-->
            <groupId>org.webjars</groupId>
            <artifactId>jquery</artifactId>
            <version>3.3.1</version>
        </dependency>
```

根据webjars路径访问静态资源，快速访问：http://localhost:8080/webjars/jquery/jquery.js 


### 通过根目录访问
根目录访问静态资源会通过resources下的三个路径
- resources：放在resources目录下的resources目录中
- public：放在resources下的public目录中
- static：放在resources下的static目录中

三个路径的优先级：resources>static(默认资源路径)>public

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/resourceshuh.png)

## 首页与图标定制


首页设置只需要在三个resources下的静态资源路径中存档index.html即可

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/ggghjhjhj.png)

图标定制需要将favicon.ico文件存放在static资源路径下

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/dgaugsaug.png)


## Thymeleaf模板引擎

### 模板引擎的概念
模板引擎可以让（网站）程序实现界面与数据分离，业务代码与逻辑代码的分离，这就大大提升了开发效率，良好的设计也使得代码重用变得更加容易。模板引擎不只是可以让你实现代码分离（业务逻辑代码和用户界面代码），也可以实现数据分离（动态数据与静态数据），还可以实现代码单元共享（代码重用），甚至是多语言、动态页面与静态页面自动均衡（SDE）等等与用户界面可能没有关系的功能。

### Thymeleaf模板引擎特性
- Thymeleaf 在有网络和无网络的环境下皆可运行，即它可以让美工在浏览器查看页面的静态效果，也可以让程序员在服务器查看带数据的动态页面效果。这是由于它支持 html 原型，然后在 html 标签里增加额外的属性来达到模板+数据的展示方式。浏览器解释 html 时会忽略未定义的标签属性，所以 thymeleaf 的模板可以静态地运行；当有数据返回到页面时，Thymeleaf 标签会动态地替换掉静态内容，使页面动态显示。
- Thymeleaf 开箱即用的特性。
- Thymeleaf 提供spring标准方言和一个与 SpringMVC 完美集成的可选模块，可以快速的实现表单绑定、属性编辑器、国际化等功能。

### Thymeleaf使用

1. 引入相关依赖

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
```

2. 在templates文件夹下创建测试页面（必须在该文件夹下才能自动解析）

```html
<!DOCTYPE html>
<!--引入thymeleaf命名空间-->
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>

<h1>Test页面</h1>
<!--从后端取出对应的值-->
<div th:text="${msg}"></div>
</body>
</html>
```

3. 创建Controller

```java
@Controller
public class HelloController {
    
    @RequestMapping("/test")
    public String test(Model model){
        model.addAttribute("msg","Ywrby");
        return "test";
    }
}
```

4. 测试页面访问

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/dgiugiu.png)

可以看到页面成功展示并且传入的值被前端成功取出

### Thymeleaf基本语法
1. th:text：文本替换；
2. th:utext：支持html的文本替换。
3. th:value：属性赋值  
4. th:each：遍历循环元素
5. th:if：判断条件，类似的还有th:unless，th:switch，th:case
6. th:insert：代码块引入，类似的还有th:replace，th:include，常用于公共代码块提取的场景
7. th:fragment：定义代码块，方便被th:insert引用
8. th:object：声明变量，一般和*{}一起配合使用，达到偷懒的效果。
9. th:attr：设置标签属性，多个属性可以用逗号分隔

## SpringBoot整合SpringMVC拦截器

根据SpringBoot官方文档的说明，SpringBoot已经实现了对SpringMVC基本的配置，如果我你们需要进行MVC的一些自定义配置（拦截器，格式化器，视图控制器，消息转换器等等），可以通过实现一个配置类，该配置类实现接口WebMvcConfigurer，并且天界@Configuration注解表明自身是一个配置类

如果需要自定义HandlerMapping,HandlerAdapter,ExcceptionResolver等组件，可以通过创建一个WebMvcRegistrationsAdapter实例，来提供以上组件

如果我们需要完全自定义SpringMVC，不保留SpringBoot所提供的一切默认特征，可以通过自定义类并且添加@Coonfiguration和@EnableWebMvc两个注解来实现

### 步骤一：编写拦截器
```java
/**
 * 测试拦截器，测试SpringMVC配置类是否生效
 */
@Slf4j //java日志框架
public class TestInterceptor implements HandlerInterceptor {
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //每当经过前置拦截器，都已日志情况输出方法执行情况
        log.debug("当前TestInterceptor类的preHandle方法正在执行");
        return true;
    }

    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView) throws Exception {
        log.debug("当前TestInterceptor类的postHandle方法正在执行");
    }

    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable Exception ex) throws Exception {
        log.debug("当前TestInterceptor类的afterCompletion方法正在执行");
    }
}
```

### 步骤二：配置日志记录级别（不必须，只是上文使用了日志框架，效果更直观）

```yml
# 配置日志记录级别
logging:
  level:
    cn.ywrby: debug
    org.springframework: info
```

### 步骤三：实现配置类，复写添加拦截器方法
```java
// 标识该类为配置类
@Configuration
public class MvcConfig implements WebMvcConfigurer { //继承WebMvcConfigurer以实现对SpringMVC组件的控制

    //在SpringMVC容器中注册拦截器
    @Bean //使用在方法上，标注将该方法返回值存储到Spring容器中
    public TestInterceptor testInterceptor(){
        return new TestInterceptor();
    }

    //将拦截器添加到SpringMVC拦截器链中，复写该方法
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(testInterceptor()).addPathPatterns("/*");
    }
}
```


## SpringBoot整合事务和连接池


### 整合JDBC和事务

由于SpringBoot的开箱即用的概念，对于JDBC的整合也是十分简单的

首先还是在pom.xml中添加数据库驱动的依赖以及JDBC的启动器依赖

```xml
        <!--jdbc启动器-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>

        <!--数据库驱动-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
```

### 配置数据库连接池
只需要在核心配置文件application.yml下配置即可
```yml
spring:
  # 配置数据库连接池
  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://cdb-cd3ybvc6.cd.tencentcdb.com:10056/test
    data-username: root
    data-password: renboyu010214
```

### 编写数据库操作

```java
@Component("userDao")
public class UserDaoImpl implements UserDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<User> findAll() {
        //执行数据库查询操作，获取所有用户信息并封装到集合中
        List<User> userList = jdbcTemplate.query("select * from sys_user", new BeanPropertyRowMapper<User>(User.class));
        return userList;
    }
}
```

### 测试执行情况

```java
@SpringBootTest
class SpringBootTestApplicationTests {

    @Autowired
    private UserDaoImpl userDao;
    @Test
    void contextLoads() {
        List<User> users = userDao.findAll();
        for(User user:users){
            System.out.println(user);
        }
    }
}
```

## SpringBoot整合MyBatis

### 添加MyBatis启动器依赖
SpringBoot官方并没有提供MyBatis的启动器，但是MyBatis自己实现了启动器，只需要引入依赖即可

```xml
        <!--配置MyBatis依赖-->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.1.4</version>
        </dependency>
```

### 在pom.xml中配置mybatis相关信息

注意：这里的type-aliases-package不是配置mapper所在的路径，而是实体类所在的路径，mybatis会自动帮我们将该类下的实体类按照类名创建为别名
```yml
mybatis:
  # 配置实体类别名 包路径
  type-aliases-package: cn.ywrby.domain
  # 配置映射文件路径
  mapper-locations: classpath:cn.ywrby.mapper/*.xml
  # 配置日志文件
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

### 编写mapper层接口
```java
//用户数据访问层
public interface UserMapper {
    public List<User> findAll() ;
}
```


### 在启动器前利用注解扫描mapper层路径
```java
// 扫描该包下所有mybatis业务mapper接口，传入参数是接口所在包路径
@MapperScan("cn.ywrby.mapper")
// @SpringBootApplication注解表明该类是一个SpringBoot应用
@SpringBootApplication
public class SpringBootTestApplication {
    public static void main(String[] args) {
        //run方法 启动SpringBoot应用
        SpringApplication.run(SpringBootTestApplication.class, args);
    }
}
```

### 测试mybatis
```java
@SpringBootTest
class SpringBootTestApplicationTests {

    @Autowired(required = false)
    private UserMapper userMapper;

    @Test
    void contextLoads() {
        List<User> users = userMapper.findAll();
        for(User user:users){
            System.out.println(user);
        }
    }
}
```