---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 13:59:19
modDatetime: *id001
title: 9-Lambda表达式
slug: 9-Lambda表达式
featured: false
draft: false
tags:
- Java
description: 没有名字的局部内部类，匿名内部类的目的是为了简化代码。
---

# 匿名内部类
没有名字的局部内部类，匿名内部类的目的是为了简化代码。

## 格式
```java
new 类名|抽象类|接口(形参){
    方法重写......
}
```

### 实例

```java
package Anonymity;

abstract class Task{
    public void func(){
        System.out.println("这是父类的func方法");
    }
    //定义抽象方法
    public abstract void func2();
}

public class Demo1 {
    //匿名内部类
    public static Task t=new Task() {
        //重写抽象方法
        @Override
        public void func2() {
            System.out.println("这是匿名内部类重写的抽象方法func2");
        }
    };

    public static void main(String[] args) {
        t.func();  //调用父类的方法
        t.func2();  //调用子类重写的方法
    }
}
```

## 特点
- 匿名内部类是一个没有名字的类
- 匿名内部类一旦写出来，就会立即创建一个匿名内部类对象返回（用父类接收）
- 匿名内部类的对象的类型相当于是当前new的那个类（父类）的子类类型



# Lambda表达式
 Lambda表达式是JDK1.8开始之后的新技术，是一种代码的新语法，是一种特殊写法

## 作用
核心目的是为了简化匿名内部类的代码写法


## 格式
```java
(匿名内部类被重写方法的形参列表)->{
    被重写方法的方法体代码......
}
```

## 使用前提
1. Lambda表达式并不能简化所有匿名内部类的写法
2. Lambda表达式只能简化函数式接口的匿名内部类写法

### 函数式接口的匿名内部类
- 首先必须是接口
- 接口中只能有一个抽象方法
- Java源码中类名前有@FunctionalInterface标记的都是函数式接口，其他符合上述两条规则的也属于函数式接口

## 实例1：简化Runnable接口的匿名内部类写法
```java
package LambdaDemo;

public class LambdaDemo1 {
    public static void main(String[] args) {
        //利用匿名内部类重写Runnable中的抽象方法并执行该线程任务对象
        Runnable target =new Runnable() {
            @Override
            public void run() {
                System.out.println(Thread.currentThread().getName()+"通过匿名内部类重写");
            }
        };
        Thread t=new Thread(target);
        t.start();

        //使用Lambda表达式重写抽象方法
        Runnable target2 =() ->{
                System.out.println(Thread.currentThread().getName()+"通过Lambda表达式重写");
            };
        Thread t2=new Thread(target2);
        t2.start();
    }
}
```

#### 上述代码还可以继续简化，省略单独创建对象的过程
```java
package LambdaDemo;

public class LambdaDemo1 {
    public static void main(String[] args) {
        //利用匿名内部类重写Runnable中的抽象方法并执行该线程任务对象
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println(Thread.currentThread().getName()+"通过匿名内部类重写");
            }
        }).start();
        //使用Lambda表达式重写抽象方法
        new Thread(() ->{
            System.out.println(Thread.currentThread().getName()+"通过Lambda表达式重写");
        }).start();
    }
}
```


## 实例2：简化Comparator接口的匿名内部类 


#### 以下为匿名内部类的写法
```java
package ComparatorDemo;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class ComparatorDemo1 {
    public static void main(String[] args) {
        List<Student> lists=new ArrayList<>();
        Student s1=new Student("Leslie",18,"Man");
        Student s2=new Student("John",14,"Man");
        Student s3=new Student("Gym",20,"Woman");
        //批量向数组插入数据
        Collections.addAll(lists,s1,s2,s3);
        //按照年龄进行排序(匿名内部类做法)
        Collections.sort(lists, new Comparator<Student>() {
            @Override
            public int compare(Student s1, Student s2) {
                if(s1.getAge()<s2.getAge()) return -1;
                else if(s1.getAge()>s2.getAge()) return 1;
                else return 0;
                //或者上述可以简化携程return s1.getAge()-s2.getAge();
            }
        });
        for(Student stu:lists) {
            System.out.printf("name=%s age=%d sex=%s\n",stu.getName(),stu.getAge(),stu.getSex());
        }
    }
}
```


#### 利用Lambda表达式简化
```java
package ComparatorDemo;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class ComparatorDemo1 {
    public static void main(String[] args) {
        List<Student> lists=new ArrayList<>();
        Student s1=new Student("Leslie",18,"Man");
        Student s2=new Student("John",14,"Man");
        Student s3=new Student("Gym",20,"Woman");
        //批量向数组插入数据
        Collections.addAll(lists,s1,s2,s3);
        //按照年龄进行排序(匿名内部类做法)
        Collections.sort(lists, (Student t1, Student t2)-> {
                if(t1.getAge()<t2.getAge()) return -1;
                else if(t1.getAge()>t2.getAge()) return 1;
                else return 0;
                //或者上述可以简化写成return s1.getAge()-s2.getAge();
            });
        for(Student stu:lists) {
            System.out.printf("name=%s age=%d sex=%s\n",stu.getName(),stu.getAge(),stu.getSex());
        }
    }
}
```

## Lambda表达式省略写法
- 如果Lambda表达式的方法体代码只有一行，可以省略**大括号**，（如果这行代码是return语句，则**return必须省略不写**）同时要省略**分号**
- **参数类型**可以省略不写
- 如果只有一个参数，除了参数类型，**括号**()也可以省略

#### 前文代码经过省略后
```java
package ComparatorDemo;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class ComparatorDemo1 {
    public static void main(String[] args) {
        List<Student> lists=new ArrayList<>();
        Student s1=new Student("Leslie",18,"Man");
        Student s2=new Student("John",14,"Man");
        Student s3=new Student("Gym",20,"Woman");
        //批量向数组插入数据
        Collections.addAll(lists,s1,s2,s3);
        //按照年龄进行排序(匿名内部类做法)
        /*
        省略了大括号和最后的分号
        并且由于唯一的一行代码是return语句，所以省略return
        最后将参数类型也省略
        */
        Collections.sort(lists, (t1,  t2)-> t1.getAge()-t2.getAge());
        for(Student stu:lists) {
            System.out.printf("name=%s age=%d sex=%s\n",stu.getName(),stu.getAge(),stu.getSex());
        }
    }
}
```






