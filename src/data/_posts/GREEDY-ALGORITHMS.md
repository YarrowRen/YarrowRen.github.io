---
author: Boyu Ren
pubDatetime: &id001 2023-08-05 21:30:05
modDatetime: *id001
title: GREEDY ALGORITHMS
slug: GREEDY-ALGORITHMS
featured: false
draft: false
tags:
- 算法
description: 贪心算法（Greedy Algorithm）是一种常见的优化算法，用于解决一类最优化问题。在每一步选择中，贪心算法总是选择当前看起来最优的选择，而不考虑该选择会不会影响未来的选择。这种贪心选择的策略通常是局部最优的，但不一定是全局最优的。
---

# 贪心算法

贪心算法（Greedy Algorithm）是一种常见的优化算法，用于解决一类最优化问题。在每一步选择中，贪心算法总是选择当前看起来最优的选择，而不考虑该选择会不会影响未来的选择。这种贪心选择的策略通常是局部最优的，但不一定是全局最优的。

贪心算法适用于一些特定类型的问题，特别是那些具有贪心选择性质和最优子结构性质的问题。贪心选择性质是指每一步的局部最优选择最终能够导致全局最优解。最优子结构性质是指问题的最优解包含子问题的最优解。

贪心算法的基本思想如下：
1. 首先定义问题的优化目标，明确要求找到最大值或最小值。
2. 从问题的所有可选解中，选择一个局部最优解，作为当前的选择。
3. 接着，检查该局部最优解是否满足问题的约束条件和要求。
4. 如果满足约束条件和要求，则将该局部最优解加入到最终解集合中。
5. 否则，舍弃该局部最优解，并回到第2步，继续选择下一个局部最优解。
6. 最终得到的解集合就是整个问题的全局最优解。

需要注意的是，贪心算法并不适用于所有类型的问题。在某些问题中，贪心算法可能会得到次优解或者不正确的结果。因此，在应用贪心算法时，必须要确保问题具有贪心选择性质和最优子结构性质，并进行充分的验证和证明。

# 硬币兑换问题（Coin changing）

给定货币面额：1、5、10、25、100，设计一种使用最少数量的硬币向客户支付金额的方法

## 收银员算法（Cashier's algorithm）

在每次迭代中，添加最大价值的硬币，这不会让我们超过要支付的金额

```py
def cashier_algorithm(amount, coins):
    coins.sort(reverse=True)  # 将硬币面额按降序排列
    change = []
    remaining_amount = amount

    # 从硬币最高金额开始遍历
    for coin in coins:
        # 最多能使用几个当前最大面额硬币支付剩余部分金额
        num_of_coins = remaining_amount // coin
        # 减去支付硬币总金额，获得剩余金额
        remaining_amount -= num_of_coins * coin
        # 向找零列表里添加相应的硬币
        change.extend([coin] * num_of_coins)

    return change

# 测试例子
amount_to_pay = 68
currency_coins = [1, 5, 10, 25, 100]
result = cashier_algorithm(amount_to_pay, currency_coins)
print(result)  # 输出结果：[25, 25, 10, 5, 1, 1, 1]
```

## 最优解的性质



k|Ck|all optimal solutions must satisfy|max value of coins c1, c2, …, ck–1 in any OPT
---|---|---|---
1|1/P|P<=4|-
2|5/N|N<=1|4
3|10/D|N+D<=2|4+5=9
4|25/Q|Q<=3|20+4=24
5|100|no limit|75+24=99

P表示Pennies（1分钱），N表示Nickels（5分钱），最优解的条件就是所找的零钱数已经是最少的，不能有更少情况产生。例如第一行所示情况，超过四个P存在的话就可以利用5个P合成一个N，而第三行N和D不能同时存在两个以上是由于1N+2D->1Q，2N+D->2D，都存在更少硬币的解决方案


## 收银员算法是最优的么

不是，对于很多情况，收银员算法都不是最优的

### 示例一

美国邮戳: 1, 10, 21, 34, 70, 100, 350, 1225, 1500。现在要考虑找回客人140元
- 收银员算法的结果：140 = 100 + 34 + 1 + 1 + 1 + 1 + 1 + 1.
- 实际最优结果：140 = 70 +70.

### 示例二

甚至某些情况下收银员算法都不能找到有效的解

硬币种类：7，8，9。现在考虑找回客人15元
- 收银员算法的结果：15 = 9 + ???
- 实际最优结果：15 = 8 + 7


# 间隔调度问题（interval scheduling）

- 工作$j$在$s_j$时开始，在$f_j$时结束
- 我们说两个工作是兼容（compatible）的，如果它们相互之间没有重叠（overlap）

## 目标

找到相互兼容的工作的最大子集

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230806170648.png)



## Greedy template

以某种自然顺序考虑工作。接受每份工作，前提是它与已经接受的工作兼容

### 最早开始时间（Earliest start time）
按照开始时间排序，从最早开始的工作依次考虑

### 最早结束时间（Earliest finish time）
按照结束时间排序，从最早结束的工作依次考虑

### 最短间隔（Shortest interval）
按照间隔时间$f_j-s_j$排序，从间隔最短的工作开始依次考虑

### 最少冲突（Fewest conflicts）
对于每项工作，统计与其冲突的工作的数量，并按照冲突数从小到大排序，从冲突最少的工作开始考虑


最早开始，最短间隔和最少冲突都不是最优的，其反例如下：

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230806171545.png)


## 最早结束时间（EFT）算法实现

```py
def earliest_finish_time(schedules):
    # 将活动按结束时间进行排序
    sorted_schedules = sorted(schedules, key=lambda x: x[1])

    # 选择的活动列表
    selected_activities = []

    # 当前结束时间
    current_end_time = 0

    # 遍历排序后的活动
    for activity in sorted_schedules:
        start_time, end_time = activity
        # 如果活动的开始时间晚于或等于当前结束时间，则选择该活动
        if start_time >= current_end_time:
            selected_activities.append(activity)
            current_end_time = end_time

    return selected_activities

# 示例活动列表，每个元组表示一个活动的开始和结束时间
activities = [(1, 3), (2, 5), (3, 6), (5, 7), (4, 8), (8, 10)]

selected_activities = earliest_finish_time(activities)
print("Selected activities:", selected_activities)
```

## EFT分析


假设我们有一组按结束时间排序的活动集合S={1,2,…,n}，其中每个活动i具有开始时间si和结束时间fi，且$f_i<=f_{i+1}$。

现在我们想要证明选择最早结束时间的活动总是安全的，即它总是包含在某个最大兼容活动集合中。

1. **贪心选择性质**：假设 A 是活动集合 S 的最大兼容活动集合，活动1具有最早的结束时间。我们的目标是证明活动1总是包含在 A 的最优解中。

2. **数学归纳**：

   - **基本情况**：如果只有一个活动，则选择它是显而易见的最优解。

   - **归纳步骤**：假设对于 k < n 的情况，选择最早结束的活动总是最优的。现在我们考虑有 n 个活动的情况。

3. **交换论证**：假设活动1不在最优解 A 中，让活动 k 是 A 中结束最早的活动。由于活动1和活动 k 的结束时间不冲突，并且活动1的结束时间早于活动 k ，我们可以将活动1替换为活动 k 并获得另一个兼容活动集合。由于我们并没有减少活动的数量，因此新的解至少与原始解一样好。

4. **结论**：通过反证法和归纳基础，我们证明了选择最早结束的活动总是最优的选择，并且总是存在于最大兼容活动集合的最优解中。


![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230806174729.png)

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230806175223.png)


# 间隔划分问题（Interval partitioning）


区间划分问题（Interval Partitioning Problem）是一类组合优化问题，涉及将一组给定的时间区间分配给一组有限的资源，以便满足某些约束条件。这类问题在日程安排、会议室预订、频谱分配等多个领域都有应用。

基本区间划分问题是指给定一组活动或任务，每个都有开始时间和结束时间。目标是将这些活动分配给尽可能少的资源（例如会议室、机器等），同时确保没有两个在同一资源上分配的活动在时间上重叠。

> 例如，假设你有一系列会议，并且需要找到最少数量的会议室，以便所有会议都可以在没有时间冲突的情况下进行。这就是区间划分问题的一个典型实例。


![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230806180232.png)

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230806180313.png)

## Greedy template

### 最早开始时间（Earliest start time）
按照开始时间排序，从最早开始的工作依次考虑

### 最早结束时间（Earliest finish time）
按照结束时间排序，从最早结束的工作依次考虑

### 最短间隔（Shortest interval）
按照间隔时间$f_j-s_j$排序，从间隔最短的工作开始依次考虑

### 最少冲突（Fewest conflicts）
对于每项工作，统计与其冲突的工作的数量，并按照冲突数从小到大排序，从冲突最少的工作开始考虑


最早结束，最短间隔和最少冲突都不是最优的，相应的反例如下图所示：

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230806180512.png)


```py
def earliest_start_time(jobs):
    # 按照开始时间对工作进行排序
    sorted_jobs = sorted(jobs, key=lambda job: job[0])

    # 初始化一个列表来存储分组结果
    partitions = []

    for job in sorted_jobs:
        added_to_partition = False
        # 遍历现有分组，找到第一个没有时间冲突的分组，将工作添加进去
        for partition in partitions:
            if job[0] >= partition[-1][1]:
                partition.append(job)
                added_to_partition = True
                break
        # 如果没有找到可以加入的现有分组，就创建一个新的分组
        if not added_to_partition:
            partitions.append([job])

    return partitions

# 示例
if __name__ == "__main__":
    # 示例工作列表，每个工作由开始时间和结束时间构成
    jobs = [(1, 4), (3, 6), (2, 5), (7, 10), (8, 11), (9, 12), (5, 8)]

    result = earliest_start_time(jobs)
    print("工作分组结果:")
    for i, partition in enumerate(result):
        print(f"分组 {i+1}: {partition}")
```

## EST分析
**定理**: 最早开始时间优先算法是最优的。

**证明**:

- **定义**：令 $d$ 等于算法分配的教室数量。
- **步骤 1**：教室 $d$ 是开放的，因为我们需要安排一次讲座，比如讲座 $j$，与前 $d - 1$ 个教室中的所有讲座都不兼容。
- **步骤 2**：这 $d$ 门讲座都在讲座 $j$ 的开始时间 $s_j$ 之后结束。
- **步骤 3**：由于我们按开始时间排序，所以所有这些不兼容性都是由不晚于 $s_j$ 开始的讲座引起的。
- **步骤 4**：因此，在时间 $s_j + \varepsilon$（其中 $\varepsilon$ 是一个很小的正数），我们有 $d$ 门讲座重叠。
- **关键观察**：所有时间表都使用了 $\geq d$ 个教室。

这个证明基于一系列逻辑步骤，通过观察在时间 $s_j + \varepsilon$ 有 $d$ 门讲座重叠的事实，得出至少需要 $d$ 个教室的结论。由于EST算法使用了恰好 $d$ 个教室，所以它是最优的。

# 最小化迟到问题（Scheduling to minimizing lateness）


"Minimizing Lateness Problem"（最小化延迟问题）是一种经典的调度问题，要求在一个资源同时处理一个作业的情况下，安排作业的执行顺序，以最小化最大延迟（maximum lateness）。

在这个问题中，每个作业有三个关键时间参数：
1. tᵢ：作业 j 需要 tᵢ 单位的处理时间。
2. dᵢ：作业 j 的截止时间（deadline），即作业必须在 dᵢ 时刻之前完成。
3. sᵢ：作业 j 的开始时间（start time），即作业从 sᵢ 时刻开始执行。

如果作业在其截止时间之前完成，其延迟（lateness）为0；如果作业在截止时间之后完成，其延迟为正值，表示作业的延迟时间。每个作业的延迟 ℓᵢ 可以通过以下公式计算：
ℓᵢ = max{0, fᵢ - dᵢ}

其中 fᵢ = sᵢ + tᵢ 表示作业 j 的完成时间。

目标是找到一个作业的执行顺序，使得所有作业的最大延迟 L = maxᵢ ℓᵢ 最小化。

这个问题属于NP-hard问题，通常使用贪心算法或动态规划等近似算法来求解。

总之，最小化延迟问题是一个重要的调度问题，需要通过适当的算法来安排作业的执行顺序，以最小化整体延迟，从而提高任务执行的效率和及时性。


![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230807112303.png)

## Greedy template

### 处理时间最短优先（Shortest processing time first）

按处理时间tj升序安排作业顺序

### 最早截止日期优先（Earliest deadline first）

按照截止日期dj从早到晚排序，以此顺序安排作业

### 最紧迫优先（Smallest slack）

按照紧迫性dj-tj升序安排作业顺序

处理时间最短优先和紧迫性优先都不是最优的，以下是相应的一些反例
![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230807113821.png)


## EDF实现

```py
def earliest_deadline_first(jobs):
    # 按照截止日期从早到晚进行排序
    sorted_jobs = sorted(jobs, key=lambda job: job[2])
    print(sorted_jobs)
    # 初始化当前时间和最大延迟
    current_time = 0
    max_lateness = 0
    
    # 创建列表存储工作顺序，开始时间和结束时间
    res_list=[]

    # 遍历工作并计算延迟
    for job in sorted_jobs:
        finish_time = current_time + job[1]  # 计算工作的完成时间
        lateness = max(0, finish_time - job[2])  # 计算延迟
        max_lateness += lateness  # 更新最大延迟
        res_list.append([job[0], current_time, finish_time])
        current_time += job[1]  # 更新当前时间
    return res_list, max_lateness

# 示例
if __name__ == "__main__":
    # 示例工作列表，每个工作由编号,处理时间和截止时间构成
    jobs = [(1, 3, 6), (2, 2, 8), (3, 1, 9), (4, 4, 9), (5, 3, 14), (6, 2, 15)]

    result = earliest_deadline_first(jobs)
    print(result)
```


## EDF分析

**定理**：最早截止日期优先调度（EDF）是最优的。


**证明**：反证法


假设存在一个最优调度 S*，它具有最少的逆序对（inversions），让我们看看会发生什么。

我们可以假设 S* 没有空闲时间，因为任何空闲时间都可以用 S 中的任务填充，而不影响延迟。
如果 S* 没有逆序对，则 S = S*，因为这两个调度具有相同的任务顺序和延迟。
现在，考虑 S* 有一个逆序对 i-j，其中 i 被调度在 j 之前，但根据最早截止日期优先的顺序，i 应该在 j 之后被调度。
通过交换任务 i 和 j，最大延迟不会增加。这是因为延迟被定义为所有任务中的最大延迟，而交换 i 和 j 只会改变 i 和 j 的完成时间，但最大延迟保持不变。

然而，通过交换 i 和 j，我们严格减少了调度中逆序对的数量。这是因为 i-j 是一个逆序对，但是在交换后，j-i 就不再是一个逆序对。由于在 S* 中没有比 S* 更少的逆序对，交换 i 和 j 与 S* 的定义相矛盾。

因此，我们得到了矛盾，即假设存在一个最优调度 S* 具有比 S 更少的逆序对是错误的。因此，最早截止日期优先调度 S 是最优的，没有其他调度能够具有更少的逆序对并实现更小的最大延迟。

# 最佳离线缓存问题（Optimal offline caching）


"Optimal offline caching"（最优离线缓存）是指在一个离线环境中，根据已知的访问模式和缓存大小，设计一种缓存策略，使得缓存的命中率最高，从而最小化缓存未命中（缺失）带来的代价。

- 缓存容量capacity：缓存具有存储 k 个数据项的容量。
- 数据请求序列Sequence：用户请求一系列的 m 个数据项，表示为 d1, d2, …, dm。
- 缓存命中Cache hit：如果用户请求的数据项已经在缓存中，那么就发生了缓存命中。
- 缓存未命中Cache miss：如果用户请求的数据项不在缓存中，那么就发生了缓存未命中。在这种情况下，必须将所请求的数据项带入缓存，并在缓存已满时选择某些现有的数据项进行替换。


**目标**：我们的目标是找到最佳的缓存替换策略，使得在数据请求序列中发生的缓存未命中次数最少，从而尽量减少替换带来的代价。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230807165117.jpg)


## Greedy template

### LIFO / FIFO
先进先出/后进先出策略，遇到缓存命中而缓存区已满情况时，优先移除先进/后进的数据项

### LRU（Least Recently Used）

当缓存已满时，选择最近最少使用的数据项进行替换。也就是说，当有新的数据项需要加入缓存时，LRU策略会将最久未被使用的数据项淘汰，以腾出空间给新的数据项。

### LFU （Least Frequently Used）

当缓存已满时，选择最不常用的数据项进行替换。也就是说，当有新的数据项需要加入缓存时，LFU策略会将被访问次数最少的数据项淘汰，以腾出空间给新的数据项。

![](https://ywrbyimg.oss-cn-chengdu.aliyuncs.com/img/QQ%E6%88%AA%E5%9B%BE20230807170122.jpg)


## FIF算法

Farthest-in-Future（FIF）算法，也称为预知算法（clairvoyant algorithm），是一种最优的缓存算法，用作与其他缓存策略性能比较的基准。FIF算法假设它完全知晓未来请求序列，并基于这种完美预测来做出缓存决策。

在FIF算法中，当发生缓存未命中时，它选择未来请求序列中将在最远未来访问的项，并淘汰当前缓存中最远未来不会被使用的项。通过这种方式，FIF算法始终淘汰缓存中最不有价值的项，并确保在拥有完整未来请求信息的前提下，缓存内容始终是最优的。

由于FIF算法需要对未来请求序列有完美预测，它在实际应用中并不可行。然而，它作为一个理论上的上限，可以用来衡量其他缓存算法（如LRU、LFU和随机替换）在实际场景中的效果。


