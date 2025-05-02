---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 08:29:35
modDatetime: *id001
title: 5-AOP基础
slug: 5-AOP基础
featured: false
draft: false
tags:
- Spring
description: AOP是Aspect Oriented Programing(面向切面编程)的缩写，是通过预编译方式和运行期动态代理实现程序功能的统一维护的一种技术。
---

# AOP-面向切面编程

AOP是Aspect Oriented Programing(面向切面编程)的缩写，是通过预编译方式和运行期动态代理实现程序功能的统一维护的一种技术。

AOP 是 OOP 的延续，是软件开发中的一个热点，也是Spring框架中的一个重要内容，是函数式编程的一种衍生范型。

利用AOP可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的**耦合度降低**，提高程序的**可重用性**，同时提高了**开发的效率**。

简言之，在OOP（面向对象编程）中，最大的特点就是继承，多态与封装，而在封装过程中我们需要把功能不同的方法封装到不同对象中，这就导致了我们在使用这些对象时重复度很高，例如有多个方法都需要在执行前调用日志控制方法，我们当前的解决办法只有在每个类中重写日志控制方法或者将日志控制方法写入新的控制类，在需要的类中调用该方法

第一种方法不仅耦合度高，而且不便于重写或修改，代码重复度也很高，第二种方法，虽然解决了代码重写修改的问题，但日志控制方法会与所有调用它的类耦合死，我们调用某一方法时必然会调用与之耦合的日志控制类

基于以上问题，便形成了与之对应的解决方案：面向切面编程AOP，一般来讲，我们把重复度极高，被抽取出来的类或代码片段叫做切面，而被切入的类或方法就叫做切入点，通过AOP我们可以将这些重复度高的代码片段抽取到一个切片中，等到需要使用时，再将其切入到指定的切入点中，从而改变其原有的行为

**这种在运行时，动态地将代码切入到类的指定方法、指定位置上的编程思想就是面向切面的编程**

#### AOP的作用与优势

- 作用：在程序运行期间，不改变源码的情况下，对方法进行功能增强
- 优势：减少重复代码，提高开发效率，便于后期维护


## 底层实现

AOP底层的实现，是依赖于Spring提供的动态代理技术，Spring通过动态代理技术动态的生成代理对象，代理对象在执行方法时会进行功能增强的介入，再去调用目标对象的方法，从而实现功能的增强

### AOP中利用的动态代理技术
- JDK代理：基于接口的动态代理技术
- cglib代理：基于父类的动态代理技术

![spring_aop](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/spring_aop.jpg)

#### JDK代理实现增强的基本实现
```java
public class ProxyTest {
    public static void main(String[] args) {
        //创建真实对象（目标对象）
        TargetObjectImpl object=new TargetObjectImpl();

        //创建增强对象（负责执行增强方法）
        Advice advice=new Advice();

        //通过Proxy.newProxyInstance创建动态代理增强对象
        /**
         * 传入的三个参数分别是
         * 目标对象类加载器：目标对象.getClass().getClassLoader()
         * 接口数组：目标对象.getClass().getInterfaces()  保证了代理对象和目标对象方法一致，接口一致
         * 处理器：new InvocationHandler() 负责核心业务逻辑的处理（进行增强）
         */
        TargetObject proxy_object= (TargetObject) Proxy.newProxyInstance(object.getClass().getClassLoader(), object.getClass().getInterfaces(), new InvocationHandler() {
            /**
             * 负责代理逻辑的编写，代理对象调用的所有方法都会触发invoke方法执行
             * @param proxy 代理对象
             * @param method 方法对象，触发invoke执行的方法
             * @param args 参数对象，触发invoke执行的方法中的参数
             */
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                //前置增强方法
                advice.preFunc();
                //使用真实的目标对象调用该方法（这里的两个invoke方法并不相同，下面的invoke方法是反射中用来执行方法的函数）
                Object val=method.invoke(object,args);
                //后置增强方法
                advice.postFunc();
                //返回值
                return val;
            }
        });
        String str=proxy_object.targetFunction();
        System.out.println(str);
    }
}
```

#### cglib代理实现增强的基本实现
```java
public class ProxyTest {
    public static void main(String[] args) {
        //创建真实对象（目标对象）
        TargetObject object=new TargetObject();

        //创建增强对象（负责执行增强方法）
        Advice advice=new Advice();

        //基于cglib生成动态代理增强对象
        //1. 创建增强器
        Enhancer enhancer=new Enhancer();
        //2. 设置父类（将目标对象设置为其父类，以实现相关方法）
        enhancer.setSuperclass(TargetObject.class);
        //3. 设置回调函数
        enhancer.setCallback(new MethodInterceptor() {
            /**
             * intercept作用和invoke方法相同，都是负责核心业务逻辑的处理（进行增强）
             * @param o 目标对象
             * @param method 触发intercept执行的方法对象
             * @param objects 触发intercept执行的方法中所有真实参数
             * @param methodProxy 方法代理
             */
            @Override
            public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
                //执行前置方法
                advice.preFunc();
                //执行目标方法
                Object val=method.invoke(object,objects);
                //执行后置方法
                advice.postFunc();
                return val;
            }
        });

        //创建代理对象
        TargetObject proxy_object= (TargetObject) enhancer.create();
        //利用代理对象执行方法
        String val=proxy_object.targetFunction();
        System.out.println(val);
    }
}
```

## AOP中的基本概念
- Target（目标对象）：代理的目标对象
- Proxy （代理）：一个类被 AOP 织入增强后，就产生一个结果代理类
- Joinpoint（连接点）：所谓连接点是指那些被拦截到的点。在spring中,这些点指的是方法，因为spring只支持方法类型的连接点（可以简单理解为可以被增强的方法）
- Pointcut（切入点）：所谓切入点是指我们要对哪些 Joinpoint 进行拦截的定义（可以简单理解为实际增强的方法）
- Advice（通知/ 增强）：所谓通知是指拦截到 Joinpoint 之后所要做的事情就是通知（实现增强的方法）
- Aspect（切面）：是切入点和通知（引介）的结合
- Weaving（织入）：是指把增强应用到目标对象来创建新的代理对象的过程。spring采用动态代理织入，而AspectJ采用编译期织入和类装载期织入

## AOP开发明确事项

#### 需要编写的内容
- 核心业务代码（目标类与目标方法）
- 编写切面类，切面类中包含通知的实现（实现功能增强的方法）
- 在配置文件中，配置织入关系，即将哪些通知与哪些连接点相结合

#### Spring中AOP技术实现的内容
Spring 框架监控切入点方法的执行。一旦监控到切入点方法被运行，使用代理机制，动态创建目标对象的代理对象，根据通知类别，在代理对象的对应位置，将通知对应的功能织入，完成完整的代码逻辑运行。
