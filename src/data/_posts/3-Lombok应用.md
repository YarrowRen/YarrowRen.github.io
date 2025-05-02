---
author: Boyu Ren
pubDatetime: &id001 2021-04-19 14:14:02
modDatetime: *id001
title: 3-Lombok应用
slug: 3-Lombok应用
featured: false
draft: false
tags:
- Spring
- SpringBoot
- Lombok
description: 在SpringBoot中整合SSM项目的过程中，不可避免的涉及对数据库的操作，既然有对数据库的操作就必然包括依据数据库结构创建POJO，而POJO创建过程重复度高，并且使得代码看起来冗杂，这种情况下可以通过使用Lombok插件，通过注解的方式，简化POJO的创建过程
---

# Lombok应用

在SpringBoot中整合SSM项目的过程中，不可避免的涉及对数据库的操作，既然有对数据库的操作就必然包括依据数据库结构创建POJO，而POJO创建过程重复度高，并且使得代码看起来冗杂，这种情况下可以通过使用Lombok插件，通过注解的方式，简化POJO的创建过程


## 使用过程

### 1. 在IDEA中安装Lombok插件
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/pluginsss.png)

### 2. 添加Lombok对应的依赖到项目pom.xml文件中
```xml
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
```



### 3. 改造实体类，使用Lombok方式配置

#### 基本注解
- @Data：自动提供getter和setter，hashCode，equals，toString等方法
- @Getter：自动提供Getter方法
- @Setter：自动提供Setter方法
- @Slf4j：自动在bean中提供log变量（本质还是使用slf4j的日志功能）

```java
@Data
public class User {
    private Long id;
    private String username;
    private String email;
    private String password;
    private String phoneNum;
}
```

### 4. 测试方法执行
```java
@SpringBootTest
class SpringBootTestApplicationTests {

    User user=new User();
    @Test
    void contextLoads() {
        user.setUsername("Leslie");
        user.setId(1L);
        user.setEmail("2278@email.com");
        user.setPassword("123");
        user.setPhoneNum("123");
        System.out.println(user);
    }
}
```