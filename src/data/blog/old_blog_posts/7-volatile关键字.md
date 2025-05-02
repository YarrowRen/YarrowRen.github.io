---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 13:59:17
modDatetime: *id001
title: 7-volatile关键字
slug: 7-volatile关键字
featured: false
draft: false
tags:
- Java
description: 指多个线程访问共享变量，会出现一个线程修改变量的值后，其他线程看不到最新值的情况
---

### 并发编程下，多线程访问变量的不可见性问题
指多个线程访问共享变量，会出现一个线程修改变量的值后，其他线程看不到最新值的情况

#### 代码示例：

```java
package VolatileTest;

public class VolatileDemo extends Thread{
    private boolean flag=false;

    @Override
    public void run() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        flag=true;
        System.out.println("flag修改成功！");
    }

    public boolean isFlag() {
        return flag;
    }

    public void setFlag(boolean flag) {
        this.flag = flag;
    }
}

class test{
    public static void main(String[] args) {
        VolatileDemo t=new VolatileDemo();
        t.start();

        while(true){
            if(t.isFlag()){
                System.out.println("判断条件成立，程序正常执行！");
            }
        }
    }
}
```

#### 运行结果：
```java
flag修改成功！

```

可以看到程序始终没有成功输出主线程中的判断条件内的内容，说明主线程存储的flag变量的值仍然始终是false,但是子线程中已经成功修改了flag的值为false，这就是并发编程下多线程访问变量的不可见性问题。


# 变量不可见性的内存语义
## JMM概述
JMM（Java Memory Model）是Java的一种内存模型，与**Java并发编程有关**的一种模型。

JMM是Java虚拟机规范中所定义的一种内存模型，JMM是**标准化的**，屏蔽掉了底层不同计算机的区别

JMM描述了Java程序中各种变量（**线程共享变量**）的**访问规则**，以及在JVM中将**变量存储**到内存中和从内存中**读取变量**这样的底层细节


### JMM规定：
- 所有的共享变量都存储于主内存中。（这里所说的变量指的是实例变量和类变量，不包含局部变量，因为局部变量是线程私有的，因此不存在竞争问题）
- 每一个线程还存在自己的工作内存，线程的工作内存，保留了被线程使用的变量的工作副本
- 线程对变量的所有的操作（读，取）都必须在工作内存中完成，而不能直接读写主内存中的变量
- 不同线程之间也不能直接访问对方的工作内存中的变量，线程间变量的值的传递需要通过主内存中转来完成

![主内存与工作内存](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/%E4%B8%BB%E5%86%85%E5%AD%98%E4%B8%8E%E5%B7%A5%E4%BD%9C%E5%86%85%E5%AD%98.jpg)


上边的例子中，最后循环没有正常执行的原因也就可以解释了，子线程和主线程最开始时都直接从主内存中读取了flag的值并放入工作内存中，此时两个工作内存中的flag值都是false，随后子线程修改了工作内存中的flag的值，并将结果返回到主内存中，即修改了主内存的flag值，但主线程并没有重新读取主内存，也就导致了主线程中的工作内存中flag的值始终为false无法正常进行循环

#### 以上这些也就解释了前面所说的不可见性产生的原因：
每个线程都有自己的工作内存，线程都是从主内存拷贝共享变量的副本值，每个线程都是在工作内存中操作共享变量的


# 变量不可见性的解决


## 解决方案一：加锁

在要使用共享变量前，先将代码上锁（synchronized），就可以解决变量不可见性，要了解这种方式解决问题的原理，就要理解某一个线程在进入synchronized代码块前后，会执行哪些操作。


**当某一个线程进入synchronized代码块时，会执行如下操作：**
1. 线程获得锁
2. **清空工作空间**
3. 从主内存拷贝共享变量**最新的值**到工作内存为副本
4. 执行代码
5. 将修改后的副本的值**刷新**回主内存中
6. 线程释放锁

了解了上述执行流程就不难发现，只要在使用了共享变量的代码前加锁，就可以在执行当前语句前获取主内存中最新的共享变量的值，自然也就解决了变量不可见性的问题。并且，由于我们只是出于更新变量值的目的加锁，所以上锁的对象是什么就无关紧要了

```java
package VolatileTest;


//解决并发编程下变量不可见性的方案

/*
* 方法一：加锁
* 在访问共享变量的过程中对它上锁（上锁的对象是任意的）
* 方法二：对共享的变量进行volatile关键字修饰
*/


public class VolatileDemo2 extends Thread{
    private boolean flag=false;

    @Override
    public void run() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        flag=true;
        System.out.println("flag修改成功！");
    }

    public boolean isFlag() {
        return flag;
    }

    public void setFlag(boolean flag) {
        this.flag = flag;
    }
}

class test2{
    public static void main(String[] args) {
        VolatileDemo2 t=new VolatileDemo2();
        t.start();

        while(true) {
            //在访问共享变量前，先对其加锁
            synchronized (test2.class) {
                if (t.isFlag()) {
                    System.out.println("判断条件成立，程序正常执行！");
                }
            }
        }
    }
}
```

## 解决方案二：volatile关键字修饰

直接在共享变量前加volatile关键字修饰

### 工作原理
1. 所有线程从主内存读取到数据放入其对应的工作内存中
2. 某个线程操作有volatile修饰的变量并更改了它的值
3. 当该线程返回这个变量的新值给主内存后，所有其他线程原先的此变量副本失效
4. 当某个线程需要再次操作该变量时，需要从新从主内存中读取最新的变量的值，放入到工作内存中


### 总结
**volatile保证不同线程对共享变量操作的可见性**，也就是说一个线程修改了volatile修饰的变量，当修改写回主内存时，另外一个线程立即看到最新的值


```java
package VolatileTest;


//解决并发编程下变量不可见性的方案

/*
* 方法一：加锁
* 在访问共享变量的过程中对它上锁（上锁的对象是任意的）
* 方法二：对共享的变量进行volatile关键字修饰
*/


public class VolatileDemo2 extends Thread{
    private volatile boolean flag=false;  //直接对共享的变量进行volatile关键字修饰

    @Override
    public void run() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        flag=true;
        System.out.println("flag修改成功！");
    }

    public boolean isFlag() {
        return flag;
    }

    public void setFlag(boolean flag) {
        this.flag = flag;
    }
}

class test2{
    public static void main(String[] args) {
        VolatileDemo2 t=new VolatileDemo2();
        t.start();
        while(true) {
            if (t.isFlag()) {
                System.out.println("判断条件成立，程序正常执行！");
            }
        }
    }
}
```

## volatile与synchronized比较
- volatile只能修饰实例变量或类变量，而synchronized可以修饰方法，或者代码块
- volatile保证数据的可见性，但是不保证原子性（多线程进行写操作，不保证线程安全），而synchronized是一种排他（互斥）的机制





# 原子性
## 概述
原子性指的是在一次操作或者多次操作中，要么所有的操作全部得到了执行并且不会受到任何因素的干扰而中断，要么所有的操作都不执行



```java
package VolatileAtomic;

//探究volatile的原子性

public class AtomicDemo {
    public static void main(String[] args) {
        Runnable run=new MyRunnable();
        for(int i=0;i<100;i++){
            //启动100条线程
            new Thread(run).start();
        }
    }
}

class MyRunnable implements Runnable{
    private volatile int count=0;

    //一次任务是一个整体，会进行100次的自增和输出操作
    @Override
    public void run() {
        for(int i=0;i<100;i++){
            count++;
            System.out.println("count====>"+count);
        }
    }
}
```

可以看到，上述程序执行过程中，最后变量的值在有volatile修饰的情况下和没有volatile修饰的情况下，最终结果都不一定是10000，发生这种情况的原因在于可能同时有多个线程（并行）对变量进行赋值操作，由于volatile的限制它们同时获取到的变量值是一样的，它们最终会返回相同的值回主内存中，这样本来多次的赋值操作就变成了一次，总的赋值操作少了，最终结果自然也无法达到10000，究其根本，**就是volatile并不具备原子性造成的，它只能解决线程的可见性问题**

## 保证原子性的方案

### 加锁
最简单的保证原子性的方案就是对需要同时执行（保证原子性）的代码进行加锁，加锁后这段代码同时只能由持有锁的唯一线程执行，并且加锁的同时也就保证了变量的可见性，不需要再利用volatile修饰变量了

### 原子类

Java从JDK1.5开始提供Atomic包，这个包定义了一种**原子操作类**，原子操作类提供了一种简单高效，线程安全的更新一个变量的方式（**因为加锁这种机制的性能比较差**）

```java
public AtomicInteger();  //初始化一个默认值为0的原子型Integer
public AtomicInteger(int initialValue);   //初始化一个指定值的原子型Integer

int get();   //获取值
int getAndIncrement();  //以原子方式将当前值加1，注意：这里返回的是自增前的值
int incrementAndGet();  //以原子方式将当前值加1，注意：这里返回的是自增后的值
int addAndGet(int data);  //以原子方式将输入的数值与实例中的值（AtomicInteger中的value）相加，并返回结果
int getAndSet(int value);  //以原子方式设置为newValue的值，并返回旧值
```


```java
package VolatileAtomic;

//使用原子类保证原子性

import java.util.concurrent.atomic.AtomicInteger;

public class AtomicDemo2 {
    public static void main(String[] args) {
        Runnable run=new My_Runnable();
        for(int i=0;i<100;i++){
            //启动100条线程
            new Thread(run).start();
        }
    }
}

class My_Runnable implements Runnable{
    //创建一个Integer更新的原子类,初始值为0
    private AtomicInteger count=new AtomicInteger();


    //一次任务是一个整体，会进行100次的自增和输出操作
    @Override
    public void run() {
        for(int i=0;i<100;i++){
            System.out.println("count====>"+count.incrementAndGet());
        }
    }
}
```

**可以看到，上述程序通过原子类保证了原子性，保证了程序正常执行**


## 原子类CAS机制

### CAS机制
#### （Compare And Swap）
比较再交换机制，是现代CPU广泛支持的一种对内存中的共享数据进行操作的一种特殊指令。

CAS可以将read-modify-check-write转换为原子操作，这个原子操作直接由处理器保证。

CAS机制当中使用了3个基本操作数：内存地址V，旧的预期值A，要修改的新值B


CAS机制的核心就是比较再交换，它的实现流程是在一个进程中，同时有多个线程获取到同一个共享变量的值，此时由于没有锁的限制它们各自开始对变量进行操作，当某个线程结束对变量的操作并把新值返回到主内存中去之前，它会先行比较此时主内存中共享变量的值和自己刚开始获取到的变量值是否相同，假设相同，就将新值赋给主内存中的共享变量，加入不同，就将当前变量值作废，重新获取最新的变量值并重新开始操作





## 个人理解：为什么单纯依靠volatile关键字无法解决原子性的问题

volatile关键字执行的操作是在某个线程将该变量的刷新值返回到主内存后，处理使得其他所有该变量的副本值失效，也就是再次操作这个值必须重新去主内存中获取最新结果。但这样其实并不能彻底实现原子性，会出现一种情况，例如线程A，B获取到相同的共享变量x的值。随后A，B分别对变量x进行操作（虽然不是同时，但他们可以先后操作，此时二者都没有将更新过的变量值返回主内存），随后A线程首先将更新的x值返回主内存，此举使得所有获得x值的线程手中原来的值失效，当然也包括B，但这对B并没有实际影响，B已经完成了对变量x的操作，只剩将变量返回主内存中的过程，所以B线程本质上不会收到影响，而是执行最后一步，将刷新的值返回主内存。这就导致原本应当A，B两个线程对变量进行两次操作，最后实际上只有后刷新的B线程对变量做出了改变。最终导致了原子性的问题产生

但是CAS机制就最终解决了这个问题，它保证了B线程在尝试刷新主内存的值之前会先进行检验，假如主内存中的变量值已经改变，则B线程之前的操作失效，需要重新进行。



## CAS与Synchronized：乐观锁，悲观锁

### Synchronized总是从悲观的角度出发，被称为悲观锁。
总是假设最坏的情况，每次去拿数据的时候都认为别人会修改，所以每次在拿数据的时候都会上锁，防止别人在他使用期间拿到锁（共享资源每次只给一个线程使用，其他线程阻塞，用完后子再把资源转让给其他线程）JDK中的ReentrantLock也是一种悲观锁，整体来说这种方式性能较差

### CAS总是从乐观角度出发，被称为乐观锁
总是假设最好的情况，每次去拿数据的时候都认为别人不会修改，所以不上锁，但是在更新的时候会判断在使用期间别人有没有更新这个数据，综合性能较好

