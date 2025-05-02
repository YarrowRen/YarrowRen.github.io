---
author: Boyu Ren
pubDatetime: &id001 2021-04-17 13:55:08
modDatetime: *id001
title: 1-SpringBoot基础
slug: 1-SpringBoot基础
featured: false
draft: false
tags:
- SpringBoot
- Spring
description: '> SpringBoot是由Pivotal团队在2013年开始研发、2014年4月发布第一个版本的全新开源的轻量级框架。它基于Spring4.0设计，不仅继承了Spring框架原有的优秀特性，而且还通过简化配置来进一步简化了Spring应用的整个搭建和开发过程。另外SpringBoot通过集成大量的框架使得依赖包的版本冲突，以及引用的不稳定性等问题得到了很好的解决。'
---

# SpringBoot基础

> SpringBoot是由Pivotal团队在2013年开始研发、2014年4月发布第一个版本的全新开源的轻量级框架。它基于Spring4.0设计，不仅继承了Spring框架原有的优秀特性，而且还通过简化配置来进一步简化了Spring应用的整个搭建和开发过程。另外SpringBoot通过集成大量的框架使得依赖包的版本冲突，以及引用的不稳定性等问题得到了很好的解决。

SpringBoot所具备的特征有：
1. 可以创建独立的Spring应用程序，并且基于其Maven或Gradle插件，可以创建可执行的JARs和WARs；
2. 内嵌Tomcat或Jetty等Servlet容器；
3. 提供自动配置的“starter”项目对象模型（POMS）以简化Maven配置；
4. 尽可能自动配置Spring容器；
5. 提供准备好的特性，如指标、健康检查和外部化配置；
6. 绝对没有代码生成，不需要XML配置。

## IDEA快速部署SpringBoot项目

通过SpringInitializr创建SpringBoot项目,配置相关信息
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/springboottest1.png)

自动配置SpringWeb
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/springboottest2.png)

完成项目部署
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/springboottest3.png)

编写Controller层，测试结果(Controller层，DAO层，Service层都需要与项目启动入口在同层下才能使用)
```java
@Controller
public class HelloController {

    @RequestMapping("/hello")
    @ResponseBody
    public String hello(){
        return "hello world";
    }
}
```

成功调用接口
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/springboottest4.png)

## SpringBoot自动装配原理

### pom.xml配置文件
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>


    <!--引入父工程，spring-boot-dependencies核心依赖在父工程中-->
    <!--我们在引入或使用一些SpringBoot插件过程中不需要指定版本号，就是因为父工程中已经引入了对应的插件-->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.4.5</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <groupId>cn.ywrby</groupId>
    <artifactId>SpringBootTest</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>SpringBootTest</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>11</java.version>
    </properties>

    <dependencies>
        <!--启动器本质就是SpringBoot的启动场景，所有启动器都以spring-boot-starter为前缀
            这些启动器内部封装了实现该场景需要进行的全部操作
            SpringBoot存在很多开箱即用的Starter依赖，即SpringBoot会将所有功能场景变成一个个启动器方便使用
        -->
        <!--SpringBoot中的Web启动器，会帮项目导入Web环境所需的所有依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!--SpringBoot单元测试启动器-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```

### SpringBoot常见启动器

启动器名称|功能
---|---
spring-boot-starter |这是Spring Boot的核心启动器，包含了自动配置、日志和YAML。
spring-boot-starter-actuator |帮助监控和管理应用。
spring-boot-starter-amqp |通过spring-rabbit来支持AMQP协议（Advanced Message Queuing Protocol）。
spring-boot-starter-aop |支持面向方面的编程即AOP，包括spring-aop和AspectJ。
spring-boot-starter-artemis |通过Apache Artemis支持JMS的API（Java Message Service API）。
spring-boot-starter-batch |支持Spring Batch，包括HSQLDB数据库。
spring-boot-starter-cache |支持Spring的Cache抽象。
spring-boot-starter-cloud-connectors |支持Spring Cloud Connectors，简化了在像Cloud Foundry或Heroku这样的云平台上连接服务。
spring-boot-starter-data-elasticsearch |支持ElasticSearch搜索和分析引擎，包括spring-data-elasticsearch。
spring-boot-starter-data-gemfire |支持GemFire分布式数据存储，包括spring-data-gemfire。
spring-boot-starter-data-jpa |支持JPA（Java Persistence API），包括spring-data-jpa、spring-orm、Hibernate。
spring-boot-starter-data-mongodb |支持MongoDB数据，包括spring-data-mongodb。
spring-boot-starter-data-rest |通过spring-data-rest-webmvc，支持通过REST暴露Spring Data数据仓库。
spring-boot-starter-data-solr |支持Apache Solr搜索平台，包括spring-data-solr。
spring-boot-starter-freemarker |支持FreeMarker模板引擎。
spring-boot-starter-groovy-templates |支持Groovy模板引擎。
spring-boot-starter-hateoas |通过spring-hateoas支持基于HATEOAS的RESTful Web服务。
spring-boot-starter-hornetq |通过HornetQ支持JMS。
spring-boot-starter-integration |支持通用的spring-integration模块。
spring-boot-starter-jdbc |支持JDBC数据库。
spring-boot-starter-jersey |支持Jersey RESTful Web服务框架。
spring-boot-starter-jta-atomikos |通过Atomikos支持JTA分布式事务处理。
spring-boot-starter-jta-bitronix |通过Bitronix支持JTA分布式事务处理。
spring-boot-starter-mail |支持javax.mail模块。
spring-boot-starter-mobile |支持spring-mobile。
spring-boot-starter-mustache |支持Mustache模板引擎。
spring-boot-starter-redis |支持Redis键值存储数据库，包括spring-redis。
spring-boot-starter-security |支持spring-security。
spring-boot-starter-social-facebook |支持spring-social-facebook
spring-boot-starter-social-linkedin |支持pring-social-linkedin
spring-boot-starter-social-twitter |支持pring-social-twitter
spring-boot-starter-test |支持常规的测试依赖，包括JUnit、Hamcrest、Mockito以及spring-test模块。
spring-boot-starter-thymeleaf |支持Thymeleaf模板引擎，包括与Spring的集成。
spring-boot-starter-velocity |支持Velocity模板引擎。
spring-boot-starter-web |支持全栈式Web开发，包括Tomcat和spring-webmvc。
spring-boot-starter-websocket |支持WebSocket开发。
spring-boot-starter-ws |支持Spring Web Services。

Spring Boot应用启动器面向生产环境的还有2种，具体如下：
1. spring-boot-starter-actuator：增加了面向产品上线相关的功能，比如测量和监控
2. spring-boot-starter-remote-shell：增加了远程ssh shell的支持。

最后，Spring Boot应用启动器还有一些替换技术的启动器，具体如下：

1. spring-boot-starter-jetty：引入了Jetty HTTP引擎（用于替换Tomcat）
2. spring-boot-starter-log4j：支持Log4J日志框架。
3. spring-boot-starter-logging：引入了Spring Boot默认的日志框架Logback。
4. spring-boot-starter-tomcat：引入了Spring Boot默认的HTTP引擎Tomcat。
5. spring-boot-starter-undertow：引入了Undertow HTTP引擎（用于替换Tomcat）。

### SpringBoot主程序


SpringBootTest.java
```java
// @SpringBootApplication注解表明该类是一个SpringBoot应用
@SpringBootApplication
public class SpringBootTestApplication {
    public static void main(String[] args) {
        //run方法 启动SpringBoot应用
        SpringApplication.run(SpringBootTestApplication.class, args);
    }
}
```

### 自动装配原理 
通过主程序可以看出，SpringBoot通过启动主程序运行Spring Application的run方法启动SpringBoot应用

进一步查看run方法源码，可以看到注释表示该方法是一个静态帮助程序（Static helper），可以根据默认配置启动一个SpringApplication对象并返回一个ApplicationContext对象
```java
	/**
	 * Static helper that can be used to run a {@link SpringApplication} from the
	 * specified source using default settings.
	 * @param primarySource the primary source to load
	 * @param args the application arguments (usually passed from a Java main method)
	 * @return the running {@link ApplicationContext}
	 */
	public static ConfigurableApplicationContext run(Class<?> primarySource, String... args) {
		return run(new Class<?>[] { primarySource }, args);
	}
```

这个默认的配置就来源于主程序前的注解@SpringBootApplication，查看该注解源码可看到该注解是一个复合注解

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(
    excludeFilters = {@Filter(
    type = FilterType.CUSTOM,
    classes = {TypeExcludeFilter.class}
), @Filter(
    type = FilterType.CUSTOM,
    classes = {AutoConfigurationExcludeFilter.class}
)}
)
public @interface SpringBootApplication {...}
```

其中比较重要的三个注解分别是@SpringBootConfiguration，@ComponentScan 和 @EnableAutoConfiguration

- @SpringBootConfiguration，这个注解的底层是一个@Configuration注解，表示当前类是一个Spring的配置类，当创建容器时会从该类上加载注解
- @ComponentScan，默认扫描当前类所在的包及其子包下包含的注解，将@Controller/@Service/@Component/@Repository等注解加载到IOC容器中；
- @EnableAutoConfiguration：这个注解表明启动自动装配，里面包含两个重要的注解@AutoConfigurationPackage和@Import
  - @AutoConfigurationPackage：和@ComponentScan一样，也是将主配置类所在的包及其子包里面的组件扫描到IOC容器中，但是区别是@AutoConfigurationPackage扫描@Enitity、@MapperScan等第三方依赖的注解，@ComponentScan只扫描@Controller/@Service/@Component/@Repository这些常见注解。所以这两个注解扫描的对象是不一样的。
  - @Import(AutoConfigurationImportSelector.class)是自动装配的核心注解，AutoConfigurationImportSelector.class中有个selectImports方法


selectImports方法调用了getAutoConfigurationEntry方法，该方法内部又调用了getCandidateConfigurations方法，这个方法是用来找META-INF/spring.factories文件的
```java
    public String[] selectImports(AnnotationMetadata annotationMetadata) {
        if (!this.isEnabled(annotationMetadata)) {
            return NO_IMPORTS;
        } else {
            AutoConfigurationImportSelector.AutoConfigurationEntry autoConfigurationEntry = this.getAutoConfigurationEntry(annotationMetadata);
            return StringUtils.toStringArray(autoConfigurationEntry.getConfigurations());
        }
    }
```

该文件位于spring-boot-configure的jar包中，该文件由键值对（key=value）形式的数据组成，其中包含自动装配全类名，以逗号分隔每个全类名
```factories
# Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.admin.SpringApplicationAdminJmxAutoConfiguration,\
org.springframework.boot.autoconfigure.aop.AopAutoConfiguration,\
org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration,\
org.springframework.boot.autoconfigure.batch.BatchAutoConfiguration,\
org.springframework.boot.autoconfigure.cache.CacheAutoConfiguration,\
...
...
```
最终，@EnableAutoConfiguration注解通过@SpringBootApplication注解被间接的标记在了SpringBoot的启动类上，SpringApplicaton.run方法的内部就会执行selectImports方法，进而找到所有JavaConfig配置类全限定名对应的class，然后将所有自动配置类加载到IOC容器中。