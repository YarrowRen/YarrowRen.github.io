---
author: Boyu Ren
pubDatetime: &id001 2021-03-03 13:59:22
modDatetime: *id001
title: 12-File类
slug: 12-File类
featured: false
draft: false
tags:
- Java
description: '**File类代表操作系统的文件对象**，是用来操作操作系统中的文件对象的，例如：删除文件，获取文件信息，创建文件/文件夹。广义来说，操作系统认为文件已经包含了文件和文件夹的概念'
---

# File类概述
**File类代表操作系统的文件对象**，是用来操作操作系统中的文件对象的，例如：删除文件，获取文件信息，创建文件/文件夹。广义来说，操作系统认为文件已经包含了文件和文件夹的概念

## 构造器
- public File(String pathname):根据路径获取文件对象
- public File(String parent,String child):根据父路径和文件名称获取文件对象
- public File(File parent,String child):根据父类文件对象和子类文件名称获取子类文件对象



这里的路径也是分为**绝对路径和相对路径**，Java默认的相对路径是**相对工程目录下的文件路径**。二者比较而言，绝对路径一旦脱离具体依赖的环境，代码就极可能出错。相对路径在脱离所处的环境后一般还是可以正常执行，但相对路径只能用于寻找该工程下的文件，有一定的局限性。**一般为了跨平台操作，主要采用相对路径**


### 文件路径分隔符
1. 可以使用正斜杠“/”
2. 使用反斜杠（需要转义）“\\\”
3. 使用分隔符API：File.separator


```java
//方式1：使用正斜杠
File f1=new File("D:/photo/未压缩图片");
//方式2：使用反斜杠并转义
File f2=new File("D:\\photo\\未压缩图片");
//方式3：使用File的分隔符API
File f3=new File("D:"+File.separator+"photo"+File.separator+"未压缩图片");
```

三种写法含义一样，第三种方法直接采用系统分隔符替换该处内容，目的是防止某些系统采取的分隔符不是斜杠进而导致路径报错


```java
package FileDemo;

import java.io.File;

public class FileDemo1 {
    public static void main(String[] args) {
        File f1 = new File("D:/photo/未压缩图片/theme.jpg");
        //直接获取文件大小（字节数大小）
        System.out.println(f1.length()+" byte");
        //使用相对路径定位工程中文件
        File f2=new File("src/FileDemo/text.txt");
        System.out.println(f2.length()+" byte");
        //创建文件对象，代表文件夹
        File f3=new File("src/FileDemo");
        //不能直接获取文件夹的大小，最后返回的结果不是文件夹内文件大小，而是文件夹本身的大小或0
        System.out.println(f3.length()+" byte");
        //判断文件是否存在
        System.out.println(f3.exists());
        
    }
}
```
#### 运行结果
```java
897788 byte
6 byte
0 byte
true
```

# File类的获取功能
- public String getAbsolutePath() : 返回此文件的绝对路径字符串
- public String getPath() : 获取创建文件对象的时候用的路径
- public String getName() : 返回由此File表示的文件或目录名称
- public long length : 返回由此File表示的文件长度


# File类的判断功能
- public boolean exists() : 此File表示的文件或目录是否实际存在
- public boolean isDirectory() : 此File表示的是否为目录
- public boolean isFile() : 此File表示的是否为文件

# File类的创建和删除方法
- public boolean createNewFile() : 当且仅当具有该名称的文件尚不存在时，创建一个新文件（几乎不用）
- public boolean delete() : 删除由此File表示的文件或目录（目录只能删除空目录）
- public boolean mkdir() : 创建由此File表示的目录（只能创建一级目录）
- public boolean mkdirs() : 可以创建多级目录（常用）


# 目录遍历
- public String[] list() : 获取当前目录下所有“一级文件名称”到一个字符串数组中返回
- public File[] listFiles() : 获取当前目录下所有“一级文件对象”到一个对象数组中返回，**直接返回对象**这种方式更常见，并且更具可操作性，一般都采用这种遍历方式



