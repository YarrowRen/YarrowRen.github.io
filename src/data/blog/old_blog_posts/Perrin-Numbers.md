---
author: Boyu Ren
pubDatetime: &id001 2023-07-30 15:53:49
modDatetime: *id001
title: Perrin Numbers
slug: Perrin-Numbers
featured: false
draft: false
tags:
- 算法
description: 佩林数（Perrin numbers）是一个整数数列，以P(n)表示，其中 n 为非负整数。佩林数列的定义如下：
---

# Perrin numbers

佩林数（Perrin numbers）是一个整数数列，以P(n)表示，其中 n 为非负整数。佩林数列的定义如下：

P(0) = 3
P(1) = 0
P(2) = 2

对于 n ≥ 3 的情况，佩林数列的每一项都由以下递推公式获得：

P(n) = P(n-2) + P(n-3)，其中 n ≥ 3

因此，佩林数列开始为：3、0、2、3、2、5、5、7、10、12、17、...

佩林数由法国数学家Alfred J. Perrin于1899年引入的，以他的名字命名。这个数列在组合数学和计算机科学中有一些应用。

佩林数列的前几项为：3、0、2、3、2、5、5、7、10、12、17、...，以此类推。

```R
n    = 0, 1, 2, 3, 4, 5, 6, 7, 8,  9,  10, 11, 12, 13, 14
P(n) = 3, 0, 2, 3, 2, 5, 5, 7, 10, 12, 17, 22, 29, 39, 51
div? = n, n, y, y, n, y, n, y, n,  n,  n,  y,  n,  y,  n
```

佩林数具有很多特殊的性质，观察上面这三行列表，第一行是数列n，第二行则是按照数列n对应的佩林数数列，第三行是P(n)能否整除n，我们观察发现2, 3, 5, 7, 11, 13对应的佩林数和n数列能够正好整除，而这恰好就是0-14范围内的素数列表

经过继续计算不能看出， P(n) 可被 n 整除的n值似乎都是素数，因此，我们可以提出猜想：
> 令 S 为所有数字 n 的集合，使得 P(n) 可被 n 整除。 S 是所有素数的集合吗？

结果表明
- 对于所有素数 n，P(n) 都能被 n 整除。
- 对于P(n) 可被n 整除的任何数字n，我们将其称为“佩林伪素数”（Perrin pseudo-prime）。
- 所有素数都是佩林伪素数，但所有佩林伪素数是否都是素数呢


为了找到这个猜想的反例，我们想要编写一个程序，输出从 1 到 10 亿的所有 佩林伪素数

如果直接去计算这个范围内的佩林数，很快就会超过计算机可以计算的证书范围，所以我们要考虑如何简化计算过程。

在这个计算过程中，我们真正关心的不是佩林数大小，而是佩林数能否被n整除，换言之，我们关心 (P(n) mod n) 是否等于 0。

因此，我们使用 $P(n,m)$ 来表示 (P(n) mod m) ，我们可以使用以下公式来计算 $P(n, m)$

```r
P(0, m) = 3 mod m
P(1, m) = 0
P(2, m) = 2 mod m
P(n, m) = (P(n − 2, m) + P(n − 3, m)) mod m
```

现在我们可以只计算 $P(n, n)$ 。请注意，当且仅当 $P(n, n) = 0$ 时，P(n) 才能被 n 整除


# 暴力破解（Brute-force）

第一个想法是采用上面的公式，并直接使用递归算法来实现它们。实现这个方法很简单，用它来检查 n 的小值。 P(n) mod n 的值可以总结在一个表中，该表表明，对于较小的 n 值，没有合数 n 能整除 P(n)。问题是当 n 开始变大时，这个（第一个）程序需要很长时间才能运行。为什么？



```r
PerrinNumber<-function(n){
  p0=3
  p1=0
  p2=2
  if(n==0){
    return(p0)
  }else if (n==1){
    return(p1)
  }else if(n==2){
    return(p2)
  }else{
    return(PerrinNumber(n-2)+PerrinNumber(n-3))
  }
}

BruteForce<-function(n){
  if(n==0||n==1){
    return(FALSE)
  }else{
    return(PerrinNumber(n)%%n ==0)
  }
}

for(i in c(0:14)){
  print(paste("n=",as.character(i)," p(n)=",as.character(PerrinNumber(i))," res=",BruteForce(i)))
}


# 使用system.time()函数计算函数执行时间
execution_time <- system.time(BruteForce(10))
```

```r
> # 使用system.time()函数计算函数执行时间
> system.time(BruteForce(10))
用户 系统 流逝 
   0    0    0 
> # 使用system.time()函数计算函数执行时间
> system.time(BruteForce(20))
用户 系统 流逝 
   0    0    0 
> # 使用system.time()函数计算函数执行时间
> system.time(BruteForce(30))
用户 系统 流逝 
0.02 0.00 0.02 
> # 使用system.time()函数计算函数执行时间
> system.time(BruteForce(40))
用户 系统 流逝 
0.07 0.00 0.06 
> # 使用system.time()函数计算函数执行时间
> system.time(BruteForce(50))
用户 系统 流逝 
1.06 0.00 1.06 
> # 使用system.time()函数计算函数执行时间
> system.time(BruteForce(55))
用户 系统 流逝 
4.51 0.00 4.51 
> # 使用system.time()函数计算函数执行时间
> system.time(BruteForce(60))
 用户  系统  流逝 
17.96  0.00 17.97
```

上文是通过R语言实现的暴力破解佩林数方法，可以看到算法的时间成本增长非常快，我们想通过这种算法计算较大的佩林数是不现实的。实际上，我们可以验证暴力破解方法的运行时间是以指数形式增长的（通过归纳假设法）

```r
# 前三项由于都是固定值，只需要常数时间就可以返回结果
T (k) = 1, for k < 3
# n项需要递归调用前n-2和n-3项
T (n) = T (n − 2) + T (n − 3) + c, for n > 2
```

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230801230310.jpg)

# 动态规划（Dynamic Programming）

为什么暴力破解最后的执行速度这么慢？在了解其运算过程后我们意识到该算法一遍又一遍地重复其工作。特别是，为了计算 P(n)，算法递归计算 P(n − 2) 和 P(n − 3)，这两个递归调用进一步递归调用来计算 P(n − 4)、P(n − 5) 、P(n − 5) 和 P(n − 6)。不难发现P(n − 5) 计算了两次。对于这个特定问题，我们唯一需要知道值 P(k) 的时候是在计算 P(k + 2) 和 P(k + 3) 时。因此，如果我们按升序计算值，记住序列中的最后 3 个值，我们可以轻松计算佩林数

```r
PerrinNumber<-function(n){
  p0=3
  p1=0
  p2=2
  res=0
  if(n==0){
    return(p0)
  }else if (n==1){
    return(p1)
  }else if(n==2){
    return(p2)
  }else{
    top=c(3,0,2)
    for(i in c(3:n)){
      res=top[2]+top[1]
      top=c(top[2],top[3],res)
    }
    return(res)
  }
}

DynamicProgramming<-function(n){
  if(n==0||n==1){
    return(FALSE)
  }else{
    return(PerrinNumber(n)%%n ==0)
  }
}

for(i in c(0:14)){
  print(paste("n=",as.character(i)," p(n)=",as.character(PerrinNumber(i))," res=",DynamicProgramming(i)))
}

# 使用system.time()函数计算函数执行时间
system.time(BruteForce(1000000))
```

```r
> # 使用system.time()函数计算函数执行时间
> system.time(BruteForce(10000))
用户 系统 流逝 
   0    0    0 
> # 使用system.time()函数计算函数执行时间
> system.time(BruteForce(100000))
用户 系统 流逝 
0.05 0.00 0.04 
> # 使用system.time()函数计算函数执行时间
> system.time(BruteForce(1000000))
用户 系统 流逝 
0.51 0.00 0.51 
```

可以看到算法的运行时间降低的非常快，算法已经从指数级降低为了线性时间算法！


# 快速求幂算法（Fast Exponentiation Algorithm）

线性时间复杂度是否就是目前的极限呢，看起来要计算第n项我们必须要知道第n-2项，以此类推还需要知道第n-4项等等，线性时间看起来已经是最优的了，但实际上我们可以在O(logn)时间内实现计算过程，这需要采用分而治之的思想

回想如何将矩阵乘以向量，我们看到对于任何值 n ≥ 3，我们可以写出以下线性代数方程，它表示最后一个算法的一次迭代

$$
\begin{pmatrix}
0 & 1 & 1 \\
1 & 0 & 0 \\
0 & 1 & 0 \\
\end{pmatrix}
*
\begin{pmatrix}
P(n-1) \\
P(n-2) \\
P(n-3) \\
\end{pmatrix}
=
\begin{pmatrix}
P(n) \\
P(n-1) \\
P(n-2) \\
\end{pmatrix}
$$

回想一下，对于 n ≥ 3，我们定义 P(n) = P(n − 2) + P(n − 3)

整个表达式可以乘以同一个矩阵，以获得包含 P(n + 1)、P(n) 和 P(n − 1) 的向量。扩展这个论点，如果 M 代表上面表达式中的矩阵，V 代表初始值的向量： (2, 0, 3)T ，那么我们将矩阵 M 的 (n − 2) 次方与初始值相乘得到：


$$
M^{n-2}*V=
\begin{pmatrix}
P(n) \\
P(n-1) \\
P(n-2) \\
\end{pmatrix}
$$

所以现在，为了计算第 n 个 Perrin 数，我们只需要将 3 × 3 矩阵求幂


而在求幂的计算过程中，我们也可以进行简化，例如我们要求偶数次幂$M^{16}$，其本质上就是求$(((M^2)^2)^2)^2$，这样我们就把需要进行n次的计算过程简化为了logn，对于奇数次幂，其处理也非常简单，我们只需要利用递归的方式对其进行归纳

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230801234145.jpg)


很容易证明 FastExp(a,n) 最多执行 $2\log_2 n$ 次递归调用。假设指数整数 n ≥ 0。因此需要 O(log n) 次乘法来计算


```r
FastExp<-function(a,n){
  if (n == 0){return(1)}
  else if (n == 1){return(a)}
  else if (n %% 2 == 0){
    t <- FastExp(a,n/2)
    return(t %*% t)
  }
  else{
    return(a %*% FastExp(a,(n - 1)))
  }
}

n=14
(FastExp(a,n-2) %*% v)[1]



PerrinNumber<-function(n){
  p0=3
  p1=0
  p2=2
  res=0
  a <- matrix(c(0, 1, 0, 1, 0, 1, 1, 0, 0), nrow = 3, ncol = 3)
  v= matrix(c(2,0,3), nrow = 3, ncol = 1)
  if(n==0){
    return(p0)
  }else if (n==1){
    return(p1)
  }else if(n==2){
    return(p2)
  }else{
    return((FastExp(a,n-2) %*% v)[1])
  }
}

ThirdTry<-function(n){
  if(n==0||n==1){
    return(FALSE)
  }else{
    return(PerrinNumber(n)%%n ==0)
  }
}

for(i in c(0:14)){
  print(paste("n=",as.character(i)," p(n)=",as.character(PerrinNumber(i))," res=",ThirdTry(i)))
}

# 使用system.time()函数计算函数执行时间
system.time(ThirdTry(100000000000000000000))
```

```r
> # 使用system.time()函数计算函数执行时间
> system.time(ThirdTry(1000000000000000000))
用户 系统 流逝 
   0    0    0 
> # 使用system.time()函数计算函数执行时间
> system.time(ThirdTry(100000000000000000000))
用户 系统 流逝 
   0    0    0 
```