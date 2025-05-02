---
author: Boyu Ren
pubDatetime: &id001 2021-07-27 16:26:41
modDatetime: *id001
title: 1-JVM基础
slug: 1-JVM基础
featured: false
draft: false
tags:
- Java
- JVM
description: '> JVM是Java Virtual Machine（Java虚拟机）的缩写，JVM是一种用于计算设备的规范，它是一个虚构出来的计算机，是通过在实际的计算机上仿真模拟各种计算机功能来实现的。'
---

# JVM基础
> JVM是Java Virtual Machine（Java虚拟机）的缩写，JVM是一种用于计算设备的规范，它是一个虚构出来的计算机，是通过在实际的计算机上仿真模拟各种计算机功能来实现的。

> 引入Java语言虚拟机后，Java语言在不同平台上运行时不需要重新编译。Java语言使用Java虚拟机屏蔽了与具体平台相关的信息，使得Java语言编译程序只需生成在Java虚拟机上运行的目标代码（字节码），就可以在多种平台上不加修改地运行。




![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210727163437.png)


通过上图的结构内容可以看到，JVM是运行在操作系统上的Java虚拟机，其本身并不具备直接执行Java程序的能力，通过在JVM中引入相应的基础类库形成JRE（Java Runtime Environment Java运行环境），JRE才是具备执行Java程序能力的运行环境。在JRE基础上结合相应的编译开发工具就构成了JDK（Java Development Kit Java 语言的软件开发工具包）。而我们实际日常的开发中，正式采用了JDK与相应IDE工具进行开发的模式

JVM的有点主要有以下几点：
- 一次编写，处处运行
- 自动内存管理，垃圾回收机制
- 数组下标越界检查
- 支持多态

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210727171521.png)

# JVM内存结构

## 程序计数器

Program Counter Register（程序计数器，寄存器）。程序计数器是用于存放下一条指令所在单元的地址的地方。



以下面源代码与字节码文件为例

```java
package cn.ywrby;

import java.io.PrintStream;

public class JVMTest {
    public static void main(String[] args) {
        PrintStream out=System.out;
        out.println(1);
        out.println(2);
        out.println(3);
    }
}
```


```java
 0 getstatic #2 <java/lang/System.out : Ljava/io/PrintStream;>
 3 astore_1
 4 aload_1
 5 iconst_1
 6 invokevirtual #3 <java/io/PrintStream.println : (I)V>
 9 aload_1
10 iconst_2
11 invokevirtual #3 <java/io/PrintStream.println : (I)V>
14 aload_1
15 iconst_3
16 invokevirtual #3 <java/io/PrintStream.println : (I)V>
19 return
```
二进制的字节码文件实质上就是一条条操作JVM的指令，这些指令不能直接操作CPU，需要通过解释器将二进制的字节码文件转化为机器码，进而通过机器码控制CPU

在这个过程中，程序计数器所起到的作用就是记住下一条操作指令的执行地址，从上面的字节码文件也可以看到，每一条指令前边的数字代表该指令的地址，程序计数器在执行某条指令时便会暂存下一条指令的地址，这样在该指令执行完成后就可以顺次执行剩余指令


### 程序计数器特点

**线程私有性：**
程序计数器的第一个特点就是其是线程私有的，由于Java支持多线程，所以程序在执行过程中可能需要执行多个线程，但是在线程切换过程中，并不会出现线程之间的程序计数器服用的问题，每一个线程都拥有自己独立的程序计数器，记录当前指令地址，这样也可以保证在线程切换过程中导致指令地址错误

**不存在内存溢出**，由于JVM虚拟机的定义，保证了程序计数器区别于堆和栈等结构，其内部不会出现内存溢出的情况

## 虚拟机栈（JVM stacks）

虚拟机栈是线程私有的，每创建一个线程，虚拟机就会为这个线程创建一个虚拟机栈，虚拟机栈表示Java方法执行的内存模型，每调用一个方法就会为每个方法生成一个栈帧（Stack Frame），用来存储局部变量表、操作数栈、动态链接、方法出口等信息。每个方法被调用和完成的过程，都对应一个栈帧从虚拟机栈上入栈和出栈的过程。虚拟机栈的生命周期和线程是相同的

虚拟机栈是一个后入先出的栈。栈帧是保存在虚拟机栈中的，栈帧是用来存储数据和存储部分过程结果的数据结构，同时也被用来处理动态链接（Dynamic Linking）、方法返回值和异常分派（Dispatch Exception）。线程运行过程中，只有一个栈帧是处于活跃状态，称为“当前活跃栈帧”，当前活动栈帧始终是虚拟机栈的栈顶元素。
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/1217523-20170921103712696-66337560.png)


一个栈帧的结构大致如下图所示

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/1217523-20170921103713228-1287438455.png)

简单来说虚拟机栈负责存储线程运行时所需要的内存空间，而虚拟机栈中的每个栈帧负责存储每个方法运行时所需要的内存空间

通过上面所说的内容我们可以知道，垃圾回收机制是不会涉及对虚拟机栈内存的处理的，因为虚拟机栈严格遵循后进先出原则，所以每个栈帧在对应方法执行结束后都会出栈，其生命周期与线程生命周期一致，不需要回收。另外一点，我们可以通过`-Xss`命令手动设置虚拟机栈内存的大小，但并不代表我们设置的栈内存越大，程序执行效率就越高，因为系统本身内存是固定的，而每个线程都需要一个单独的虚拟机栈，所以栈内存如果过大，就会导致理论线程数减少

下面以一段简单的代码演示整个虚拟机栈的在程序运行过程中的执行流程
```java
package cn.ywrby;

public class JVMTest {
    public static void main(String[] args) {
        test1();
    }

    public static void test1(){
        test2();
    }
    public static int test2(){
        int a=1,b=2;
        int c=a+b;
        return c;
    }
}
```

整个代码涉及到了三个方法，分别是主方法main，和两个测试方法test1，test2，在主方法处打上断点，通过debug运行查看虚拟机栈的情况

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210729010140.png)

可以看到程序开始执行，作为主方法的main函数执行并被压入虚拟机栈中，其栈帧内部目前存储了传入变量args

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210729010350.png)

接下来主方法调用了test1方法，所以test1方法作为栈帧传入虚拟机栈顶部，此时test1栈帧就是新的当前活跃栈帧，由于其没有传入参数等变量，所以其内部暂时没有存储内容

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210729010554.png)

接下来，由于test1内部调用了test2方法，所以test2作为新的当前活跃栈帧被压入栈顶，其内部暂时还没有存储数据

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210729010713.png)

随着test2方法内部执行，其内部的变量a,b被存入栈帧中

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210729010812.png)

最后c作为返回值也被存储到栈帧中，此时test2方法已经执行完毕

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210729010945.png)

随着test2方法的执行结束，test2栈帧出栈，此时当前活跃栈帧重新变回test1栈帧

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210729011106.png)

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20210729011246.png)
最后，test1方法执行完毕后出栈，此时虚拟机栈中只剩下主方法main栈帧，随着main函数执行结束，虚拟机栈为空


### 虚拟机栈的线程安全问题 
- 如果方法内局部变量没有逃离方法的作用访问，那么其就是线程安全的
- 如果局部变量引用了对象，并逃离了方法的作用方法，就需要考虑线程安全问题

例如，下面三个方法中，test1方法中stringBuilder作为局部变量，始终没有逃离test1方法的访问，所以其是线程安全的。test2方法由于stringBuilder变量作为返回值逃离了test2方法的访问，所以其不是线程安全的，test3方法中，其接收了外部参数stringBuilder作为变量进行操作，所以在其操作该变量的过程当中也可能被其他线程操作该变量，所以test3是线程不安全的

```java
public class JVMTest {
    public static void test1(){
        StringBuilder stringBuilder=new StringBuilder();
        stringBuilder.append("1");
        stringBuilder.append("2");
        System.out.println(stringBuilder);
    }
    public static StringBuilder test2(){
        StringBuilder stringBuilder=new StringBuilder();
        stringBuilder.append("1");
        stringBuilder.append("2");
        return stringBuilder;
    }
    public static void test3(StringBuilder stringBuilder){
        stringBuilder.append("1");
        stringBuilder.append("2");
        System.out.println(stringBuilder);
    }
}
```


### 栈内存溢出

栈内存溢出，常见于两种情况下，一种情况是栈帧过多导致栈内存溢出（递归调用），另一种情况是栈帧过大导致溢出

以下面代码为例，test1方法递归调用自身，但是并未设置递归终止条件，这回导致不断产生栈帧，直至栈内存溢出

```java
public class JVMTest {
    public static int count;
    public static void main(String[] args) {
        try {
            test1();
        }catch (Throwable e){
            e.printStackTrace();
            System.out.println(count);
        }
    }

    public static void test1(){
        count++;
        test1();
    }
}
    /*
    运行结果(报 栈内存溢出 错误)：
    java.lang.StackOverflowError
	    at cn.ywrby.JVMTest.test1(JVMTest.java:18)
	    at cn.ywrby.JVMTest.test1(JVMTest.java:18)
	    at cn.ywrby.JVMTest.test1(JVMTest.java:18)
	    ....
	    at cn.ywrby.JVMTest.test1(JVMTest.java:18)
    24041
     */
```


## 本地方法栈

本地方法栈（Native Method Stacks）与虚拟机栈所发挥的作用是非常相似的，其区别不过是虚拟机栈为虚拟机执行 Java 方法（也就是字节码）服务，而本地方法栈则是为虚拟机使用到的 Native 方法服务。虚拟机规范中对本地方法栈中的方法使用的语言、使用方式与数据结构并没有强制规定，因此具体的虚拟机可以自由实现它。

Navtive 方法是 Java 通过 JNI 直接调用本地 C/C++ 库，可以认为是 Native 方法相当于 C/C++ 暴露给 Java 的一个接口，Java 通过调用这个接口从而调用到 C/C++ 方法。当线程调用 Java 方法时，虚拟机会创建一个栈帧并压入 Java 虚拟机栈。然而当它调用的是 native 方法时，虚拟机会保持 Java 虚拟机栈不变，也不会向 Java 虚拟机栈中压入新的栈帧，虚拟机只是简单地动态连接并直接调用指定的 native 方法。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/14211474-fe4b43e1ff9a3386.webp)


## 堆（Heap）


我们在程序中通过new关键字创建新对象时，创建的对象都会使用堆内存。堆相较于之前讨论的程序计数器以及虚拟机栈和本地方法栈显著的区别就是堆是线程共享的，所以堆中的对象都需要考虑线程安全问题。同时也说明堆需要垃圾回收机制管理


### 堆内存溢出

虽然在堆中存在垃圾回收机制，但是当我们正在使用的活跃对象超出内存范围时，无法触发垃圾回收，同样也会导致内存溢出的情况

```java
public class JVMTest {
    public static void main(String[] args) {
        int i=0;
        try {
            List<String> stringList=new ArrayList<>();
            String a="test";
            while (true){
                stringList.add(a);
                a = a + a;
                i++;
            }
        }catch (Throwable e){
            e.printStackTrace();
            System.out.println(i);
        }
    }
}
```
上面这段代码中，我们通过对活跃对象stringList不断以指数形式增加字符串数据，导致其不能被垃圾回收机制处理同时在不断告诉增长，所以最终势必会引发内存溢出
```java
/*
报错内容 OutOfMemoryError：堆内存溢出
java.lang.OutOfMemoryError: Overflow: String length out of range
	at java.base/java.lang.StringConcatHelper.checkOverflow(StringConcatHelper.java:48)
	at java.base/java.lang.StringConcatHelper.mix(StringConcatHelper.java:122)
	at cn.ywrby.JVMTest.main(JVMTest.java:14)
28
*/
```

## 方法区

> 方法区在JVM中也是一个非常重要的区域，它与堆一样，是被线程共享的区域。在方法区中，存储了每个类的信息（包括类的名称、方法信息、字段信息）、静态变量、常量以及编译器编译后的代码等。

> 方法区（method area）只是JVM规范中定义的一个概念，用于存储类信息、常量池、静态变量、JIT编译后的代码等数据，具体放在哪里，不同的实现可以放在不同的地方。而永久代是Hotspot虚拟机特有的概念，是方法区的一种实现，别的JVM都没有这个东西。

