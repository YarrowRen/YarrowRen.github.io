---
author: Boyu Ren
pubDatetime: &id001 2021-04-17 20:49:56
modDatetime: *id001
title: 2-Yaml文件
slug: 2-Yaml文件
featured: false
draft: false
tags:
- Spring
- SpringBoot
- Yaml
description: SpringBoot使用一个全局配置文件，配置文件的名称是固定的，但文件类型有两种
---

# Yaml文件

SpringBoot使用一个全局配置文件，配置文件的名称是固定的，但文件类型有两种
- application.properties
  - 语法结构：key=value
- application.yaml  (推荐)
  - 语法结构： key: value
  - 注意冒号后边必须跟空格，否则语法结构错误（约定大于配置的体现）

YAML 是 "YAML Ain't a Markup Language"（YAML 不是一种标记语言）的递归缩写。在开发的这种语言时，YAML 的意思其实是："Yet Another Markup Language"（仍是一种标记语言）。

YAML 的语法和其他高级语言类似，并且可以简单表达清单、散列表，标量等数据形态。它使用空白符号缩进和大量依赖外观的特色，特别适合用来表达或编辑数据结构、各种配置文件、倾印调试内容、文件大纲（例如：许多电子邮件标题格式和YAML非常接近）。

YAML 的配置文件后缀为 .yml，如：application.yml 


## Yaml文件基本语法

```yml
# yaml配置文件可以注入到配置类中
# 普通简直对（key=value）
name: Leslie

# 存储对象
person:
  name: Jessica
  age: 18

# 对象的行内写法
person2: {name: Lily,age: 18}

# 数组写法
fruit:
  - apple
  - banana
  - orange

# 数组的行内写法，使用中括号[]
fruit2: [apple,banana,orange]
```

## Yaml给实体类/属性赋值
通过yaml可以直接为实体类赋值，这是之前的properties配置文件无法实现的

### 赋值步骤
创建实体类，@Component将其注入容器中，@ConfigurationProperties(prefix = "person")该注解表示将该实体类与application.yml中的person对象绑定起来，即告诉SpringBoot将本类中的所有属性和配置文件中相关配置进行绑定，利用配置文件为其赋值

只有这个类是容器中的组件时，才能使用这种配置赋值方法

```java
@Component
@ConfigurationProperties(prefix = "person")
public class Person {
    private String name;
    private Integer age;
    private Date birth;
    private Boolean state;
    private Map<String,Object> map;
    private List<Object> list;
    private Pet pet;

    public Person() {
    }

    public Person(String name, Integer age, Date birth, Boolean state, Map<String, Object> map, List<Object> list, Pet pet) {
        this.name = name;
        this.age = age;
        this.birth = birth;
        this.state = state;
        this.map = map;
        this.list = list;
        this.pet = pet;
    }

...
...
```

```java
public class Pet {
    private String name;
    private int age;

    public Pet() {
    }

    public Pet(String name, int age) {
        this.name = name;
        this.age = age;
    }
...
...
```

编写application.yml
```yml
person:
  name: Leslie
  age: 18
  birth: 2021/2/14
  state: true
  map: {k1: v1,k2: v2}
  list: [l1,l2,l3]
  pet:
    name: Dog
    age: 3
```


测试结果
```java
@SpringBootTest
class SpringBootTestApplicationTests {
    @Autowired
    Person person;

    @Test
    void contextLoads() {
        System.out.println(person);
        //Person{name='Leslie', age=18, birth=Sun Feb 14 00:00:00 CST 2021, state=true, map={k1=v1, k2=v2}, list=[l1, l2, l3], pet=Pet{name='Dog', age=3}}
    }
}
```

### Yaml文件与properties为属性赋值的区别

---|@ConfigurationProperties|@Value
---|---|---
功能|批量注入配置文件中的属性|一个一个注入
松散绑定（松散语法）|支持|不支持
SpEL|不支持|支持
JSR303数据校验|支持|不支持
复杂类型封装|支持|不支持

松散绑定就是方便我们在对象定义的Java代码中继续使用驼峰命名法（例如：lastName）但是在yml配置文件中可以使用下划线命名法（例如：last-name或last_name或LAST_NAME）来进行匹配

### JSR303校验

JSR是Java Specification Requests的缩写，意思是Java 规范提案。是指向JCP(Java Community Process)提出新增一个标准化技术规范的正式请求。任何人都可以提交JSR，以向Java平台增添新的API和服务。JSR已成为Java界的一个重要标准。

JSR-303 是JAVA EE 6 中的一项子规范，叫做Bean Validation，Hibernate Validator 是 Bean Validation 的参考实现 . Hibernate Validator 提供了 JSR 303 规范中所有内置 constraint 的实现，除此之外还有一些附加的 constraint。

#### 基本内容
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20200525161753312.png)

扩展部分
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/20200525161900254.png)

#### 使用测试

定义POJO，在类前使用@Validated表示使用JSR303校验，在参数前加注解@Email表示检查传入参数是否符合规定格式
```java
@Component
@ConfigurationProperties(prefix = "pet")
@Validated
public class Pet {
    private String lastName;
    private int age;
    @Email()
    private String email;
...
...
```

编写yml文件传入参数(可以看到此时email参数不符合规定格式)
```yml
pet:
  LAST_NAME: Cat
  age: 1
  email: 233
```

测试类
```java
@SpringBootTest
class SpringBootTestApplicationTests {
    @Autowired
    Pet pet;
    @Test
    void contextLoads() {
        System.out.println(pet);
    }
}
/* 运行结果:
    Property: pet.email
    Value: 233
    Origin: class path resource [application.yaml] - 31:10
    Reason: 不是一个合法的电子邮件地址
*/
```

## 配置文件优先级

项目路径下各个位置核心配置文件的优先级如下：

1. file:./config/
2. file:./
3. classpath:/config/
4. classpath:/

即file路径指的是项目根路径，classpath指的是资源路径即resources目录下，可以看到SpringBoot项目自动创建的核心配置文件是优先级最低的配置文件

当配置文件位于同一路径下时，按照扩展名的优先级顺序如下：properties>yaml>yml，即先加载yml文件，再加载yaml文件，最后加载properties文件

### 多环境配置
实际企业开发过程中，可能需要在项目的不同阶段使用不同配置文件，这时，就可以在配置中指定不同的配置文件，但所有配置文件都需要以application开头，通过分号-表示不同环境下的配置文件

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/springboottest5.png)

默认情况下，依然执行application.yaml文件，只有当我们在application.yaml中指定要执行的配置文件时，才会切换环境配置

在application文件中配置时，不需要全部的文件名，只需要写清分号后缀即可
```yml
spring:
  profiles:
    active: test
```

不过yaml支持多文档模块，即将一个文档下的语句通过分隔符分为多个模块，可以简化多文件的创建

yml以---为分隔符，每个分隔符创建一个模块，通过spring.profiles为模块命名
```yml
server:
  port: 8080
spring:
  profiles:
    active: test

---

spring:
  profiles: test
server:
  port: 8081
---

spring:
  profiles: dev
server:
  port: 8082
```

建议配置量小的情况下可以使用多文档模块，配置量较大的情况下还是文件分离更加直观


