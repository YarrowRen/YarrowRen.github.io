---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 20:28:06
modDatetime: *id001
title: 6-JDBCTemplate
slug: 6-JDBCTemplate
featured: false
draft: false
tags:
- JavaWeb
description: Spring JDBC是Spring框架对JDBC的简单封装，其中提供了JDBCTemplate对象简化JDBC开发
---

# JDBCTemplate

Spring JDBC是Spring框架对JDBC的简单封装，其中提供了JDBCTemplate对象简化JDBC开发

## 使用步骤

1. 导入jar包：commons-logging-1.2.jar，spring-beans-5.1.10.RELEASE.jar，spring-core-5.1.10.RELEASE.jar，spring-jdbc-5.1.10.RELEASE.jar，spring-tx-5.1.10.RELEASE.jar
2. 创建JdbcTemplate对象，依赖于数据源DataSource
3. 调用JdbdTemplate的方法进行CRUD增删改查
    - update():执行DML语句
    - queryForMap():查询结果并将结果封装为map对象（查询结果长度只能是1，也就是只能查询一条结果，查询到的结果将被封装为Map，其中列名为Key，值为Value）
    - queryForList():查询结果并将结果封装为list对象（将每一条记录封装为一个Map集合，再将多个Map集合封装为一个List集合）
    - query():查询结果并将结果封装为JavaBean对象。query中一般需要接收RowMapper类型的参数，该参数的获取，一般使用`new BeanPropertyRowMapper<类型>(类型.class)`这种实现类，该类可以实现数据到JavaBean的自动封装
    - queryForObject:查询结果并将结果封装为对象(一般是系统已经定义过的对象，例如Long，int等等，通过这个方法可以计算数据库总记录数等信息)一般用于聚合函数的查询


#### JdbcTemplate对象的简单使用

```java
/**
 * JDBCTemplate入门
 */
public class Demo1 {

    public static void main(String[] args) throws Exception {
        //创建JDBCTemplate对象
        JdbcTemplate jdbcTemplate=new JdbcTemplate(DruidUtils.getDataSource());
        //调用方法
        String sql="update stuMess set score=100 where id=?";
        int result=jdbcTemplate.update(sql,3);
        System.out.println(result);
    }
}
```

#### query()方法的一般使用方式

```java
public class Demo2 {
    private JdbcTemplate jdbcTemplate=new JdbcTemplate(DruidUtils.getDataSource());
    @Test
    public void test1(){
        String sql="select * from FINALEXAM_PERSON where ELEC >?";
        List<Person> personList=jdbcTemplate.query(sql,new BeanPropertyRowMapper<Person>(Person.class),3000);
        for(Person p: personList){
            System.out.println(p);
        }
    }
}

/* 运行结果：
Person{up='A路人', fan=2634110, all_like=4060804, all_play=130307845, elec=3717, submissions=246}
Person{up='hanser', fan=1940049, all_like=5015728, all_play=93791313, elec=14054, submissions=263}
Person{up='信誓蛋蛋', fan=4822994, all_like=12635046, all_play=285482138, elec=22156, submissions=181}
Person{up='ilem', fan=1379899, all_like=2696860, all_play=83757635, elec=5289, submissions=117}
......
*/
```

