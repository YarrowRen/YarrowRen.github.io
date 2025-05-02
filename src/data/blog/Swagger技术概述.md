---
author: Boyu Ren
pubDatetime: &id001 2021-05-13 15:38:09
modDatetime: *id001
title: Swagger技术概述
slug: Swagger技术概述
featured: false
draft: false
tags:
- Swagger
- SpringBoot
description: Swagger出现的原因，很大程度上是由于前后端开发人员对于接口文档，无法做到高效的同步。前端人员苦于接口文档老旧，更新不及时，后端人员苦于在任务外另外维护接口文档。故而随着项目开发时间的推移，就导致项目的接口文档老旧，使用性差等问题暴露出来。
---

# Swagger技术概述

Swagger出现的原因，很大程度上是由于前后端开发人员对于接口文档，无法做到高效的同步。前端人员苦于接口文档老旧，更新不及时，后端人员苦于在任务外另外维护接口文档。故而随着项目开发时间的推移，就导致项目的接口文档老旧，使用性差等问题暴露出来。

为解决这一问题而出现的Swagger，通过总结规范，开发项目工具，实现生成各种格式的接口文档，生成多种语言的客户端和服务端的代码，以及在线接口调试页面等。按照新的开发模式，在开发新版本或者迭代版本的时候，只需要更新Swagger描述文件，就可以自动生成接口文档和客户端服务端代码，做到调用端代码、服务端代码以及接口文档的一致性。

## Swagger开发流程

### 1. 在SpringBoot项目中引入相关依赖
```xml
        <!-- swagger API框架-->
        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger2</artifactId>
            <version>2.9.2</version>
        </dependency>
        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger-ui</artifactId>
            <version>2.9.2</version>
        </dependency>
```

可以看到Swagger并不是SpringBoot官方提供的启动器，所以需要进行相关的配置

### 2. 编写配置类配置Swagger
```java
@Configuration  //配置类
@EnableSwagger2  //开启Swagger
public class SwaggerConfig {
}
```
这里并没有进行更多的配置，只是创建了配置类并开启Swagger，Swagger本身具备一些基本默认配置

### 3. 编写一个Hello工程测试结果
```java
@RestController
public class HelloController {
    @RequestMapping("/hello")
    public String hello(){
        return "Hello World!";
    }
}
```
### 4. 启动项目，测试SwaggerUI界面

访问路径：[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210513224249.png)


## Swagger配置

### 1. 配置Swagger基本信息
包括了页面的标题和作者信息等基本内容（Docket对象是操作Swagger的实例）
```java
@Configuration  //配置类
@EnableSwagger2  //开启Swagger
public class SwaggerConfig {

    /**
     * 配置Swagger中的Docket的Bean实例
     * @return
     */
    @Bean
    public Docket docket(){
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo());  //添加基本信息
    }

    /**
     * 配置Swagger基本信息APIINFO
     * @return
     */
    public ApiInfo apiInfo(){
        //作者信息
        Contact contact = new Contact("Ywrby", "https://ywrby.cn", "ywrby0214@gmail.com");
        return new ApiInfo(
                "Ywrby SwaggerTest API",
                "The test of Swagger",
                "1.0",
                "https://ywrby.cn",
                contact,
                "Apache 2.0",
                "http://www.apache.org/licenses/LICENSE-2.0",
                new ArrayList());
    }
}
```

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210513235042.png)

### 2. 配置扫描接口与开关

```java
    /**
     * 配置Swagger中的Docket的Bean实例
     * @return
     */
    @Bean
    public Docket docket(){
        return new Docket(DocumentationType.SWAGGER_2)
                // 添加基本信息
                .apiInfo(apiInfo())
                //配置Swagger是否启动，默认为true，若为false则Swagger不能在浏览器中访问
                .enable(true)
                .select()
                // RequestHandlerSelectors，配置扫描接口的方式
                // basePackage: 指定要扫描的包
                // any: 扫描全部
                // none: 不扫描
                // withClassAnnotation: 指定要扫描的类上的注解（扫描具有指定注解的API），参数是一个注解的反射类，例如：GetMapping.class
                // withMethodAnnotation: 扫描方法上的注解
                .apis(RequestHandlerSelectors.basePackage("cn.ywrby.controller"))
                .build();
    }
```

### 3. Swagger实现多环境配置
在不同的环境下生成不同的接口文档

```java
    @Bean
    public Docket docket(Environment environment){

        //设置要显示的项目环境(这里表示只在开发和测试环境下应用该配置)
        Profiles profiles=Profiles.of("dev","test");
        //判断当前项目环境是否在目标环境中，并返回布尔值
        boolean flag = environment.acceptsProfiles(profiles);
        
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .enable(flag);
    }
```

测试后可以发现只有在开发和测试环境下才会显示接口文档，其他环境下不会显示接口文档

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210513235855.png)


### Swagger分组

```java
    @Bean
    public Docket docket1(Environment environment){ return new Docket(DocumentationType.SWAGGER_2).groupName("A"); }
    @Bean
    public Docket docket2(Environment environment){ return new Docket(DocumentationType.SWAGGER_2).groupName("A"); }
    @Bean
    public Docket docket3(Environment environment){ return new Docket(DocumentationType.SWAGGER_2).groupName("A"); }
```

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210514000932.png)


### Swagger2注解内容

#### 用于controller类上：
注解|说明
---|---
@Api|对请求类的说明

```java
@Api(tags="说明该类的作用",value="该参数没什么意义，所以不需要配置")
```

#### 用于方法上面（说明参数的含义）：

注解|说明|参数
---|---|---
@ApiOperation|	方法的说明|value="说明方法的作用" notes="方法的备注说明"
@ApiImplicitParams|用在请求的方法上，包含一组参数说明|
@ApiImplicitParam|	对单个参数的说明|name：参数名 value：参数的说明、描述 required：参数是否必须必填

#### 用于方法上面（返回参数或对象的说明）：

注解|	说明|参数
---|---|---
@ApiResponses|方法返回对象的说明|
@ApiResponse|每个参数的说明|code：数字，例如400 message：信息，例如"请求参数没填好" response：抛出异常的类


#### 对象类：

注解	|说明|参数
---|---|---
@ApiModel	|用在JavaBean类上，说明JavaBean的 用途|description 
@ApiModelProperty	|用在JavaBean类的属性上面，说明此属性的的含议|value ，required


