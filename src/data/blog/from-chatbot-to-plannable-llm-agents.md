---
title: "Planner: 从 Chatbot 到可规划 Agent"
description:
    解析单智能体、工具增强与多智能体推理架构，包括 CoT、ReAct、Plan-and-Solve、ReWOO 等规划范式。结合写作场景的工程实践，说明如何将固定 Workflow 重构为可规划的 Multi-Agent 系统，通过实验验证 OneTime 规划在性能与稳定性上的优势。
pubDatetime: 2026-01-20T08:51:08.867Z
modDatetime: 2026-01-20T08:51:08.867Z
author: "Boyu Ren"
slug: "from-chatbot-to-plannable-llm-agents"
tags:
    - Agent
    - Multi-Agent System
    - LLM
draft: false
featured: false
---


## Part 1：Agent 技术全景与核心架构

### Agent 的演进

从简单的 ChatBot 到复杂的自主智能体，本质上是 AI 从一个被动的响应工具，转变为能够主动设定并执行目标的问题解决者。

- **Chatbot 阶段（被动响应）**：其工作范式极其简洁：`Input → LLM → Output`。
- **Copilot 阶段（增强响应）**：Copilot 阶段通过引入思维链（Chain-of-Thought, CoT）和检索增强生成（Retrieval-Augmented Generation, RAG）等技术，增强了模型的推理与知识获取能力。它能够分解问题、引用外部知识生成具有深度的回答。
- **Agent 阶段（主动执行）**：现代 Agent 的核心特征是目标驱动、自主规划以及行动与反馈的闭环。其基本工作模式可以概括为一个持续循环：`Goal → Plan → Action → Feedback`。智能体接收一个高层目标，自主地将其分解为可执行的计划，通过调用工具或与环境互动来执行计划，并根据环境的反馈（Observation）来动态调整后续步骤。

### Agent 的推理架构

参考：*LLM-based Agentic Reasoning Frameworks: A Survey from Methods to Scenarios*

大体上我们可以将智能体推理方法分解为三个递进的类别：a) 单智能体方法，b) 基于工具的方法，以及 c) 多智能体方法。

![推理架构分类](https://github.com/YarrowRen/picx-images-hosting/raw/master/blog_img/推理架构分类.86u5ldyuiu.webp)

单智能体方法侧重于增强单个智能体的推理能力；基于工具的方法通过外部工具扩展智能体推理的边界；而多智能体方法则通过多个智能体之间不同的组织和交互范式来实现更灵活的推理。

#### 单智能体方法

- **提示词工程**：
  - a) **角色扮演**：为智能体分配特定角色，以激发其特定表现
  - b) **环境模拟**：将智能体置于精心设计的环境中，使其能够运用多模态信息或外部能力进行推理
  - c) **任务描述**：清晰地重构任务并将其传达给智能体
  - d) **ICL**：在智能体进行多步骤推理之前或期间，向其提供多个示例

![提示词工程](https://github.com/YarrowRen/picx-images-hosting/raw/master/blog_img/提示词工程.mkuvxl39.webp)

- **自我改进**：
  - a) **反思**：智能体分析已完成的轨迹，生成文本摘要并将其存储在上下文中，以帮助下一步的推理
  - b) **迭代优化**：在单个任务中，智能体生成初始输出，将其与预定义的标准或来自其他智能体的反馈进行比较，并在后续的推理步骤中反复改进，直至达到目标
  - c) **交互式学习**：智能体与动态环境交互，其中的经验（例如，发现新知识）可以触发其高级目标的更新，从而促进持续的、开放式的学习

![自我反思](https://github.com/YarrowRen/picx-images-hosting/raw/master/blog_img/自我反思.wj2ac79jb.webp)

#### 基于工具的方法

1. **工具集成**：研究如何将工具融入智能体的推理过程；通过 API、MCP、Skills、RAG（插件）等等
2. **工具选择**：如何选择工具？自主选择、规则选择、通过学习选择
3. **工具利用**：如何高效率执行工具？串行、并行、迭代（智能体使用代码解释器：如果第一次执行失败，智能体会检查错误，改进代码，并重新执行，直到成功运行，然后才进入下一个宏观推理步骤）

![基于工具的方法](https://github.com/YarrowRen/picx-images-hosting/raw/master/blog_img/工具使用.6ikso78hl7.webp)

#### 多智能体方法
![多智能体](https://github.com/YarrowRen/picx-images-hosting/raw/master/blog_img/多智能体.232dixw0f3.webp)

- **组织架构**：
  - **中心化**：由 Root Agent 或者 Planner 来管理和协调其他 Agent，Planner 通常执行全局规划、任务分解和结果综合，而下级 Agent 可能只需要考虑来自管理者的指令，从而简化了它们的上下文更新
  - **去中心化**：不存在中央权威机构。每个代理都拥有平等的地位，并基于本地信息和直接的点对点通信做出决策。促进了涌现式协作，增强了系统的容错性，因为一个代理的故障不会导致整个系统瘫痪
  - **层次结构**：将智能体组织成结构化的树状，将复杂任务分解为不同抽象层次的子问题。如 MetaGPT，高层智能体负责战略规划，并将任务委派给低层智能体，由低层智能体执行更具体的子任务


- **个体交互**：
  - **合作**：系统包含一个共同目标，来指导知识共享和协同规划
  - **竞争**：Agent 目标往往相互冲突。目标是最大化自身利益（辩论/质疑）
  - **谈判**：合作与竞争的混合互动（权衡自身目标与集体约束以及其他智能体的观点）

## Part 2：Agent Planning 技术深度解析

### 为什么需要 Planning（System 1 vs. System 2）

Planning 是 Agent 的"大脑核心功能"，是其智能行为的源泉。为了理解 Planning 的本质，我们可以借用丹尼尔·卡尼曼在认知科学中提出的"双系统理论"（System 1 vs. System 2）。Planning 的核心，就是为习惯于"快速思考"（System 1）的 LLM，强制引入一种"慢速、审慎"的结构化思考机制（System 2）。

![双系统](https://github.com/YarrowRen/picx-images-hosting/raw/master/blog_img/双系统.mkuvxl35.webp)

**LLM 的默认模式（System 1）**

LLM 的基础机制是自回归的 Next-Token Prediction。这种机制使其行为模式非常类似于人类的 System 1 思维：

- 快速、并行、自动化
- 依赖直觉和模式匹配
- 难以处理需要长远规划和目标分解的任务
- 在涉及严密逻辑和多步骤依赖的推理上容易出错

**Planning 的本质（System 2）**

Planning 技术的本质作用，就是强制 LLM 进入 System 2 的思考模式。这意味着将原本隐式的、直觉式的思考过程，转化为显式的、结构化的任务分解与推理步骤。它迫使 LLM "放慢脚步"，将一个复杂问题分解成一系列更小的、可管理的子问题，并逐步解决它们，从而提升解决复杂问题的能力。

### Planning 技术总体分类（Taxonomy）

随着研究的深入，Agent Planning 技术已经从早期的 Prompt 技巧，发展成为一个包含多种策略的复杂技术体系。我们可以将主流的 Planning 技术划分为以下几大类：

- **线性推理（Linear Reasoning）**：
  - 代表技术：Chain-of-Thought (CoT)、ReAct
- **Plan-and-Solve / Plan-and-Execute**
- **ReWOO（Reasoning WithOut Observations，不经观察的推理）**

### 线性推理（Linear Reasoning）

线性推理是最基础、最直观的 Planning 形式。它通过引导 LLM 生成一条线性的、一步接一步的思考路径来解决问题，模拟了人类解决问题时的顺序思考过程。

#### Chain of Thought（CoT）

CoT 是线性推理的奠基性工作。其核心思想极为简单：通过在 Prompt 中加入一句简单的提示，如 "Let's think step by step"，就能引导模型在给出最终答案之前，先生成一系列中间的推理步骤。这些中间步骤将一个复杂问题分解为多个简单的子问题，显著提升了 LLM 在算术、常识和符号推理任务上的表现。

#### ReAct（Reasoning + Acting）

如果说 CoT 是纯粹的"思考"，那么 ReAct 则是将"思考"与"行动"相结合的重大突破。根据论文 *ReAct: Synergizing Reasoning and Acting in Language Models* (Yao et al., 2023)，ReAct 框架建立在一个交错循环之上：`Thought → Action → Observation → Thought → ... → Final Answer`

1. **Thought（思考）**：Agent 首先分析当前任务状态，并规划下一步需要做什么。
2. **Action（行动）**：Agent 将规划转化为一个具体的操作，例如调用一个工具（Search query）。
3. **Observation（观察）**：Agent 从外部环境（如搜索引擎）接收到行动的结果。
4. **Thought（再思考）**：Agent 将这个观察结果作为新的上下文，进行下一轮的思考和规划。

**价值分析**：ReAct 的革命性在于，它将推理和行动紧密地结合在了一个闭环中。

### Plan-and-Solve / Plan-and-Execute / OneTime

参考：*Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models*

![planandsolve](https://github.com/YarrowRen/picx-images-hosting/raw/master/blog_img/planandsolve.4jolxv3216.webp)

- **规划器**：提示 LLM 生成完成大型任务的多步骤计划。
- **执行器**：接受用户查询和计划中的一个步骤，并调用一个或多个工具来完成该任务。

这种代理设计使我们能够避免每次工具调用时都调用大型规划器 LLM，极大节省 Planner 部分的开销和整体耗时。

### ReWOO

**ReAct 模式的问题**

我们首先说明 ReAct 的核心问题：其 `Thought → Action → Observation` 的循环是严格串行的。这意味着 Agent 必须等待上一个工具调用完成并返回结果后，才能进行下一步的思考和规划。如果一个任务需要调用三个工具，每个耗时 2 秒，那么总延迟至少是 6 秒，整体耗时是累加的。

**ReWOO 的核心思想：规划与执行解耦**

![rewoo](https://github.com/YarrowRen/picx-images-hosting/raw/master/blog_img/rewoo.5q7x6grymk.webp)

ReWOO (Reasoning without Observation) 框架通过"规划与执行解耦"的核心思想解决了这一问题。这种模式通常包含一个三角色工作流：

1. **Planner（规划器）**：接收用户请求后，Planner 不会立即执行任何操作。相反，它会进行一次完整的"思考"，一次性生成一个包含所有必要工具调用步骤的完整执行蓝图（Blueprint）。
2. **Worker（执行器）**：Worker 接收到蓝图后，解析出所有可以并行执行的工具调用，并同时发起这些调用。这些 Worker 可以被实现为多个并行的 Agent（见 1.6 节），每个 Agent 负责一个具体的工具调用任务。
3. **Solver（求解器）**：等待所有的 Worker 执行完毕后，Solver 收集所有工具的返回结果，并将这些结果整合起来，生成最终的答案。

参考：*ReWOO: Decoupling Reasoning from Observations for Efficient Augmented Language Models*

## Reference

- [[2312.04511] An LLM Compiler for Parallel Function Calling](https://arxiv.org/abs/2312.04511)
- [[2305.18323] ReWOO: Decoupling Reasoning from Observations for Efficient Augmented Language Models](https://arxiv.org/abs/2305.18323)
- [[2305.04091] Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models](https://arxiv.org/abs/2305.04091)
- [[2502.16111] PlanGEN: A Multi-Agent Framework for Generating Planning and Reasoning Trajectories for Complex Problem Solving](https://arxiv.org/abs/2502.16111)
- [[2508.17692] LLM-based Agentic Reasoning Frameworks: A Survey from Methods to Scenarios](https://arxiv.org/abs/2508.17692)
- [[2304.03442] Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442)
- [[2210.03629] ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [[2308.11432] A Survey on Large Language Model based Autonomous Agents](https://arxiv.org/abs/2308.11432)
