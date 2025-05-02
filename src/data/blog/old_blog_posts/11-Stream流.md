---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 13:59:21
modDatetime: *id001
title: 11-Stream流
slug: 11-Stream流
featured: false
draft: false
tags:
- Java
description: 得益于Lambda所带来的函数式编程，用于解决已有集合/数组类库有的弊端
---

# Stream流的概述

### 概念
得益于Lambda所带来的函数式编程，用于解决已有集合/数组类库有的弊端

### 用途
解决已有集合类库或者数组API的弊端


### 实例

```java
package StreamDemo;

import java.util.ArrayList;
import java.util.List;

public class StreamDemo1 {
    public static void main(String[] args) {
        List<String> lists = new ArrayList<>();
        lists.add("Leslie"); lists.add("Lily"); lists.add("Leon");
        lists.add("John"); lists.add("Li"); lists.add("Herge");

        //不借助Stream流的情况下筛选出数组中首字母为L，长度大于3的名字
        List<String> lists_search=new ArrayList<>();

        for (String s:lists){
            if(s.startsWith("L") & s.length()>3){
                lists_search.add(s);
                System.out.println(s);
            }
        }

        System.out.println("-----------------");
        
        //使用Stream流筛选,整个代码被简化
        lists.stream().filter(s->s.startsWith("L")).filter(s->s.length()>3)
                .forEach(System.out::println);

    }
}
```

Stream流类似一根传送带，集合中的元素在上面可以被操作

## Stream流运作思想
1. 首先得到集合或者数组的Stream流(得到一根传送带)
2. 然后用这个Stream流操作集合或者数组的元素
3. 然后用Stream流简化替代集合操作的API


# Stream流的获取 

### 集合获取Stream流的API
```java
default Stream<E> stream();
```

## 获取方式
```java
package StreamDemo;

import java.lang.reflect.Array;
import java.util.*;
import java.util.stream.Stream;

public class StreamDemo2 {
    public static void main(String[] args) {
        //Collection集合获取Stream流
        Collection<String> c = new ArrayList<>();
        Stream<String> s1 = c.stream();

        //Map集合获取Stream流
        Map<String, Integer> m = new HashMap<>();
        //获取Map集合的键的Stream流
        Stream<String> s2 = m.keySet().stream();
        //获取Map集合的值的Stream流
        Stream<Integer> s3 = m.values().stream();
        //将键和值转换为set有序对类型，从而看作一个整体，获取键值对的Stream流
        Stream<Map.Entry<String, Integer>> s4 = m.entrySet().stream();
        
        //数组获取Stream流,两种获取方式
        String[] arrs=new String[]{"Leslie","Lily"};
        Stream<String> s5= Arrays.stream(arrs);
        Stream<String> s6=Stream.of(arrs);

    }

}
```

可以看到集合获取Stream流，普遍采用stream()方法，数组获取Stream流有两种方式Arrays.stream(数组)/Stream.of(数组)


### 原理
```java
package StreamDemo;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

public class StreamDemo3 {
    public static void main(String[] args) {
        List<String> lists = new ArrayList<>();
        lists.add("Leslie"); lists.add("Lily"); lists.add("Leon");
        lists.add("John"); lists.add("Li"); lists.add("Herge");

        List<String> lists_search=new ArrayList<>();
        
        
        /* 
         * 通过filter的匿名内部类写法可以看出，filter是通过
         * 新建一个Predicate来指定条件，筛选数组/集合中的元素
         * 而这个筛选规则就是Predicate类中的test方法
         * 它会通过返回布尔值决定该元素是否删除
         */
        lists.stream().filter(new Predicate<String>() {
            @Override
            public boolean test(String s) {
                return s.length()>3;
            }
        }).filter(new Predicate<String>() {
            @Override
            public boolean test(String s) {
                return s.startsWith("L");
            }
        }).forEach(s -> System.out.println(s));

        
        //是因为Predicate是一个函数式接口，所以才可以利用Lambda表达式简化
        lists.stream().filter(s->s.startsWith("L")).filter(s->s.length()>3)
                .forEach(System.out::println);
    }
}
```

# Stream流常用API
#### forEach
遍历集合元素

#### count
统计个数(返回值类型为long)

#### filter
过滤元素
```java
Stream<T> filter(Predicate<? super T> predicate);
```

#### limit
取符合条件的前几个元素

#### skip 
跳出符合条件的前几个元素

## Stream流的加工方法map
map (映射)，指把原来的元素经过加工之后，重新放回去

```java
package StreamDemo;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class StreamDemo4 {
    public static void main(String[] args) {
        List<String> lists = new ArrayList<>();
        lists.add("Leslie"); lists.add("Lily"); lists.add("Leon");
        lists.add("John"); lists.add("Li"); lists.add("Herge");

        //给所有名字后面都加上序号
        AtomicInteger i= new AtomicInteger(1);
        lists.stream().map(s -> s+(i.getAndIncrement())).forEach(System.out::println);
    }

}
```
#### 运行结果
```java
Leslie1
Lily2
Leon3
John4
Li5
Herge6
```

#### 还可以将其转换为对象再放回其中
```java
package StreamDemo;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class StreamDemo4 {
    public static void main(String[] args) {
        List<String> lists = new ArrayList<>();
        lists.add("Leslie"); lists.add("Lily"); lists.add("Leon");
        lists.add("John"); lists.add("Li"); lists.add("Herge");

        //给所有名字后面都加上序号
        //AtomicInteger i= new AtomicInteger(1);
        //lists.stream().map(s -> s+(i.getAndIncrement())).forEach(System.out::println);

        //将所有名字转换为学生对象再放回去
        lists.stream().map(Student::new).forEach(System.out::println);
    }

}

class Student{
    private String name;
    private int age;
    private int score;

    public Student(String name) {
        this.name = name;
    }

    public Student() {
    }

    public String getName() {
        return name;
    }
}
```

## Stream流的合并方法concat

**注意concat方法只能同时合并两个流**

```java
package StreamDemo;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Stream;

public class StreamDemo5 {
    public static void main(String[] args) {
        List<String> lists = new ArrayList<>();
        lists.add("Leslie"); lists.add("Lily"); lists.add("Leon");
        lists.add("John"); lists.add("Li"); lists.add("Herge");

        //合并相同的Stream流
        Stream<String> s1=lists.stream();
        Stream<String> s2=Stream.of("Happy","Sad","Shy");
        //直接调用concat并按照类型创建新的Stream流即可
        Stream<String> s3=Stream.concat(s1,s2);
        //合并不同类型的s1,s4两条Stream流
        Stream<String> s4=lists.stream();
        Stream<Integer> s5=Stream.of(10,20,30,40);
        //可行方法之一，就是直接定义对象类型的Stream流
        Stream<Object> s6=Stream.concat(s4,s5);

        s3.forEach(System.out::println);
        System.out.println("------------");
        s6.forEach(System.out::println);

    }

}
```

####  运行结果
```java
Leslie
Lily
Leon
John
Li
Herge
Happy
Sad
Shy
------------
Leslie
Lily
Leon
John
Li
Herge
10
20
30
40
```

## Stream终结与非终结方法

### 终结方法
一旦Stream流调用终结方法，流的操作就全部终结了，**不能继续使用，只能创建新的Stream操作**，其原因一般是没有返回值，或返回值不是Stream流对象
#### 终结方法包括forEach(),count等等

### 非终结方法
每次调用完成以后都会**返回一个新的流对象**，可以继续使用，支持链式编程
#### 非终结方法包括filter,skip,limit,map,concat等等


## 收集Stream流
将Stream流的数据转回成集合

Stream流的作用在于将集合转换为一根高效的传送带，再利用Stream流的强大功能对Stream流进行操作。但是实际开发中最终数据的形式应该仍然是集合，所以这就涉及到Stream流的收集


换言之，Stream流只是一种手段，是我们操作数据的一种方式，集合才是我们需要始终用来保存，传输数据的数据结构，也就是目的

```java
package StreamDemo;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class StreamDemo5 {
    public static void main(String[] args) {
        List<String> lists = new ArrayList<>();
        lists.add("Leslie"); lists.add("Lily"); lists.add("Leon");
        lists.add("John"); lists.add("Li"); lists.add("Herge");

        //先转换成Stream流并进行筛选
        Stream<String> s1=lists.stream().filter(s -> s.length()>=3);
        //然后进行Stream流的收集，将它们转换为可以用来保存，传输的数据结构

        //转换到set集合
        Set<String> set1=s1.collect(Collectors.toSet());
        System.out.println(set1);

        //转换到list集合
        Stream<String> s2=lists.stream().filter(s -> s.length()>=3);
        List<String> list1=s2.collect(Collectors.toList());
        System.out.println(list1);

        //转换到数组
        Stream<String> s3=lists.stream().filter(s -> s.length()>=3);
        Stream<String> s4=lists.stream().filter(s -> s.length()>=3);
        //两种转换方式，（还可以强转）
        Object[] arrs1=s3.toArray();
        //接用构造器引用申明转换成的数组类型
        String[] arrs2=s4.toArray(String[]::new);

    }

}
```

