---
author: Boyu Ren
pubDatetime: &id001 2021-09-21 20:31:46
modDatetime: *id001
title: 5-Springboot进阶1
slug: 5-Springboot进阶1
featured: false
draft: false
tags:
- Spring
- SpringBoot
description: 利用Springboot开发不可避免的要涉及到使用许多的依赖，而涉及到的依赖一多就可能由于依赖之间的版本问题导致错误的产生。这种时候对于依赖的管理就显得十分重要。
---

# Springboot进阶1

## Springboot依赖管理特性

### 利用父项目进行依赖管理

利用Springboot开发不可避免的要涉及到使用许多的依赖，而涉及到的依赖一多就可能由于依赖之间的版本问题导致错误的产生。这种时候对于依赖的管理就显得十分重要。

而我们实际开发中可以看到，许多的依赖在配置过程中并不需要指定其版本号，这是因为Springboot已经考虑到由于版本问题导致的依赖引用乱象。所以已经提前进行了依赖管理，而具体的方式就是利用父依赖进行依赖管理。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210922092843.png)

以上图为例，在Maven配置文件pom.xml中，Springboot一般都已经自动配置了父依赖：spring-boot-starter-parent，查看父依赖文件我们可以看到，其内部还依赖于另外一个父依赖：spring-boot-dependencies

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210922093032.png)

而spring-boot-dependencies则详细的声明了我们日常可能使用到的各种依赖的版本号，即该文件为我们进行了依赖管理
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210922093316.png)

这里需要注意另一个问题，我们使用父项目进行依赖管理的过程中不可避免的涉及到项目需要使用的依赖版本与父项目内部定义的版本号冲突，这种时候我们就可以利用maven的就近原则（版本仲裁机制），在maven的配置文件pom.xml中声明我们需要的版本号以替代父项目中的版本号，有两种配置方法：

直接在依赖配置中声明版本号：
```xml
<!--数据库驱动-->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.23</version>
</dependency>
```

或是在配置文件中重写配置项，重新定义版本号
```xml
<properties>
    <java.version>1.8</java.version>
    <mysql.version>8.0.23</mysql.version>
</properties>
```

在实际开发中更推荐利用第二种方式定义，这种方式更便于我们对依赖进行管理

### 各种Starter场景启动器

Springboot提供各种各样开箱即用的场景启动器，这些启动器的命名一般都按照spring-boot-starter-\*, （\*就表示各种场景）

而相应的，一些第三方也会为我们提供各种启动器，这类启动器一般以：\*-spring-boot-starter的格式进行命名

所有场景启动器最底层的依赖都是：
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <version>2.5.4</version>
    <scope>compile</scope>
</dependency>
```

## Springboot自动配置特性

Springboot提前为我们进行了许多的配置，其中最明显的就是我们不需要再另外启动服务器，Springboot内置了tomcat服务器并为我们进行了配置。

当我们使用了web启动器后，在其内部就可以看到其为我们引入了tomcat启动器
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-tomcat</artifactId>
    <version>2.5.4</version>
    <scope>compile</scope>
</dependency>
```

另外，在web启动器内部我们还可以看到，其为我们引入了SpringMVC启动器，并自动配好SpringMVC常用组件（功能）

其次，Springboot还自动配置了默认的包结构，主程序所在包及其下面的所有子包里面的组件都会被默认扫描进来。不需要再像以前一样进行包结构的配置，当然，我们仍然可以在主程序中使用注解重新配置我们自己的包结构。
```java
@SpringBootApplication(scanBasePackages="com.google")
```

可以看到Springboot拥有非常复杂的配置项，但并不是我们在启动项目时，这些配置项都会生效，Springboot会按需加载所有的配置项
- 非常多的starter
- 引入了哪些场景这个场景的自动配置才会开启
- SpringBoot所有的自动配置功能都在 spring-boot-autoconfigure 包里面


