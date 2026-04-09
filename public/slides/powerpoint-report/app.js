/* =============================================
   Claude Code Report — Presentation Engine
   ============================================= */

// ── Slide Data ──
// Each slide: { className?, html, notes }
// Slides will be added incrementally as content is provided.
const slides = [
  // ── Slide 0: 封面 ──
  {
    className: 'title-slide',
    html: `
      <h1 class="anim">从泄漏源码看 Claude Code</h1>
      <p class="subtitle anim">Memory 系统及 AutoDream 自进化记忆机制</p>
      <p class="meta anim">基于 Claude Code CLI 源码的深度技术解析</p>
      <div class="tag-row anim">
        <span class="tag blue">Memory System</span>
        <span class="tag green">AutoDream</span>
      </div>
    `,
    notes: `
      <p><strong>开场引导：</strong></p>
      <p>本次报告基于泄漏的 Claude Code CLI 源码，对其核心记忆系统进行深度技术解析，主要包含以下两大部分：</p>
      <p><strong>第一部分：Memory 系统。</strong>介绍 Claude Code 的三层记忆架构——指令记忆（CLAUDE.md）、语义记忆（用户显式存储的结构化记忆文件）以及会话记忆（上下文压缩摘要）。重点分析记忆的存储结构、注入机制、自动提取流程（extractMemories）以及动态回忆（findRelevantMemories）的实现细节。</p>
      <p><strong>第二部分：AutoDream 自进化记忆机制。</strong>这是 Claude Code 实现跨会话知识持久化的关键能力——在后台自动对积累的记忆进行整合、去重与裁剪。我们将详细拆解其触发门控、锁机制、四阶段整合提示词、权限沙箱等核心设计。</p>
    `
  },

  // ── Slide 1: 目录 ──
  {
    html: `
      <h2 class="anim"><span class="icon">00</span> 报告结构</h2>
      <div class="compare-row anim">
        <div class="compare-col" style="border-top: 3px solid var(--accent);">
          <h4><span class="badge blue">Part 1</span> Memory 系统</h4>
          <ul>
            <li>系统定位与三层记忆架构</li>
            <li>四类语义记忆分类与排除边界</li>
            <li>两条流水线：增量写入 + 周期整理</li>
            <li>召回逻辑与记忆新鲜度机制</li>
            <li>权限沙箱与安全设计</li>
          </ul>
        </div>
        <div class="compare-col" style="border-top: 3px solid var(--green);">
          <h4><span class="badge green">Part 2</span> AutoDream 自进化记忆</h4>
          <ul>
            <li>功能定位与设计动机</li>
            <li>模块架构与触发门控系统</li>
            <li>锁机制：mtime 即状态</li>
            <li>四阶段 Consolidation Prompt</li>
            <li>执行引擎与 UI 可见性</li>
          </ul>
        </div>
      </div>
      <div class="highlight-box blue anim" style="margin-top: 20px;">
        <strong>分析基础：</strong>基于泄漏的 Claude Code CLI 完整 TypeScript 源码，覆盖 <code>src/memdir/</code>、<code>src/services/autoDream/</code>、<code>src/services/extractMemories/</code> 等核心模块。
      </div>
    `,
    notes: `
      <p>在进入细节之前，先从最高层看一下 Claude Code 的记忆系统是怎么运作的。</p>

      <p>Claude Code 的记忆系统本质上解决一个问题：<strong>让 AI 助手跨会话保持连贯性</strong>。每次新开一个对话，Claude 默认什么都不记得——不知道你是谁、你偏好怎么工作、项目有什么特殊约定。记忆系统就是用来填补这个空白的。</p>

      <p>整个系统的运行逻辑可以用三个动作概括：<strong>写、读、整理。</strong></p>

      <p><strong>写</strong>——每次对话结束后，系统在后台自动判断这轮对话里有没有值得长期记住的信息，有就写进文件。这个过程对用户完全透明，不打断主对话。</p>

      <p><strong>读</strong>——每次新会话启动时，系统把记忆索引注入到 Claude 的上下文里；在对话过程中，还会根据当前问题动态挑选最相关的记忆补充进来。Claude 每次开口都已经"知道"你的背景。</p>

      <p><strong>整理</strong>——记忆积累多了会产生重复、矛盾和冗余。AutoDream 在后台低频地对整个记忆库做一次深度整合：合并重复、纠正过时的信息、裁剪索引。这是整个系统里设计最精巧的部分，也是 Part 2 的核心。</p>

      <p>所有这些操作都存储在本地的 Markdown 文件里——不需要向量数据库，不需要外部服务，用户可以直接打开文件检查、修改甚至删除任何一条记忆。这是它能在 CLI 工具中真正落地的根本原因。</p>
    `
  },

  // ── Slide 2: 章节封面 — Memory 系统 ──
  {
    className: 'section-slide',
    html: `
      <div class="section-number anim">01</div>
      <h2 class="anim">Memory 系统</h2>
      <p class="section-desc anim">基于文件的持久化知识库<br>使 Claude 在跨会话场景下保留对用户、项目和工作偏好的理解</p>
    `,
    notes: `
      <p>在看 Claude Code 怎么做之前，先花一点时间说说大多数 AI 记忆系统是怎么做的——因为理解"通常的做法"，才能看清楚 CC 的选择有多不寻常。</p>

      <p>最常见的方案是<strong>向量数据库</strong>。把对话里出现的信息向量化存起来，召回的时候做语义相似度搜索，找出和当前问题最接近的记忆片段。Mem0、LangChain 的 VectorStoreRetrieverMemory 都是这条路。它的优点是检索能力强，缺点是需要额外部署 Qdrant 或 Pinecone，还需要调用 Embedding API——对一个 CLI 工具来说，这个基础设施成本完全不现实。</p>

      <p>另一条路是<strong>对话摘要</strong>。每隔几轮就让模型把历史压缩成一段摘要，用摘要代替原始记录。LangChain 的 ConversationSummaryMemory 是典型。问题是摘要会丢细节，而且每轮都调用 LLM 成本不低——绝大多数轮次其实什么都不值得摘要。</p>

      <p>还有一类是<strong>结构化数据库</strong>，把对话里提到的实体、关系抽取出来存成图或表，召回时走 SQL 或图查询。这条路工程复杂度最高，而且对"用户说的一句偏好"这类非结构化信息效果很差。</p>

      <p>这三条路有一个共同的问题：<strong>对用户来说是黑盒</strong>。你不知道它到底记住了什么，更不知道它记错了什么，也没有简单的办法去纠正。</p>

      <p>Claude Code 的做法完全不同——它用的是本地 Markdown 文件。接下来我们就来看这套看起来"很简单"的方案，是怎么解决上面这些问题的。</p>
    `
  },

  // ── Slide 3: 系统定位与三层记忆架构 ──
  {
    html: `
      <h2 class="anim"><span class="icon">01</span> 系统定位与三层记忆架构</h2>
      <p class="anim">Claude Code 中存在三类不同性质的"记忆"，各自承担不同的职责：</p>
      <div class="card-grid cols-3 anim">
        <div class="card accent-border">
          <div class="card-label-tag text-accent mono">CLAUDE.md</div>
          <div class="card-title">指令记忆</div>
          <div class="card-desc">
            开发者/用户手动维护<br>
            定义规范、架构约束、行为规则<br>
            <span class="dim small">跨会话 · 静态</span>
          </div>
        </div>
        <div class="card green-border">
          <div class="card-label-tag text-green mono">memory/</div>
          <div class="card-title">语义记忆</div>
          <div class="card-desc">
            Claude 在对话中自动学习并持久化<br>
            结构化知识，所有会话间复用<br>
            <span class="dim small">跨会话 · 动态增长</span>
          </div>
        </div>
        <div class="card purple-border">
          <div class="card-label-tag text-purple mono">session</div>
          <div class="card-title">会话记忆</div>
          <div class="card-desc">
            当前会话的上下文压缩快照<br>
            上下文窗口耗尽前保留关键信息<br>
            <span class="dim small">仅当前会话 · 随会话消亡</span>
          </div>
        </div>
      </div>
      <div class="table-wrap anim" style="margin-top: 20px;">
        <table>
          <thead>
            <tr><th>层次</th><th>载体</th><th>作用域</th><th>核心文件</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong class="text-accent">指令记忆</strong></td>
              <td><code>CLAUDE.md</code>（项目/全局）</td>
              <td>跨会话，静态</td>
              <td><code>src/utils/claudemd.ts</code></td>
            </tr>
            <tr>
              <td><strong class="text-green">语义记忆</strong></td>
              <td><code>memory/</code> 目录下 topic 文件</td>
              <td>跨会话，动态增长</td>
              <td><code>src/memdir/</code></td>
            </tr>
            <tr>
              <td><strong class="text-purple">会话记忆</strong></td>
              <td>Session Memory 文件</td>
              <td>仅当前会话</td>
              <td><code>src/services/SessionMemory/</code></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="highlight-box green anim" style="margin-top: 16px;">
        <strong>本报告核心：</strong>语义记忆——Claude 在对话中自动学习并持久化的结构化知识，以及维护其长期健康的 AutoDream 整合机制。
      </div>
      <div class="anim" style="margin-top: 14px; display: flex; gap: 8px; justify-content: flex-end;">
        <button id="btn-sm-compact"
          onclick="(function(btn){
            var panel = document.getElementById('sm-compact-panel');
            var other = document.getElementById('claudemd-panel');
            var otherBtn = document.getElementById('btn-claudemd');
            var expanded = panel.style.display !== 'none';
            other.style.display = 'none';
            otherBtn.textContent = '扩展：指令记忆的设计规范 ▸';
            panel.style.display = expanded ? 'none' : 'block';
            btn.textContent = expanded ? '扩展：会话记忆与 Compact 的关系 ▸' : '收起 ▴';
          })(this)"
          style="background: none; border: 1px solid var(--purple); color: var(--purple); border-radius: 6px; padding: 5px 14px; font-size: 13px; cursor: pointer; font-family: inherit; transition: background 0.2s;"
          onmouseover="this.style.background='rgba(139,92,246,0.12)'"
          onmouseout="this.style.background='none'"
        >扩展：会话记忆与 Compact 的关系 ▸</button>
        <button id="btn-claudemd"
          onclick="(function(btn){
            var panel = document.getElementById('claudemd-panel');
            var other = document.getElementById('sm-compact-panel');
            var otherBtn = document.getElementById('btn-sm-compact');
            var expanded = panel.style.display !== 'none';
            other.style.display = 'none';
            otherBtn.textContent = '扩展：会话记忆与 Compact 的关系 ▸';
            panel.style.display = expanded ? 'none' : 'block';
            btn.textContent = expanded ? '扩展：指令记忆的设计规范 ▸' : '收起 ▴';
          })(this)"
          style="background: none; border: 1px solid var(--accent); color: var(--accent); border-radius: 6px; padding: 5px 14px; font-size: 13px; cursor: pointer; font-family: inherit; transition: background 0.2s;"
          onmouseover="this.style.background='rgba(99,102,241,0.12)'"
          onmouseout="this.style.background='none'"
        >扩展：指令记忆的设计规范 ▸</button>
      </div>
      <div id="sm-compact-panel" style="display:none; margin-top: 10px; border: 1px solid rgba(139,92,246,0.35); border-radius: 10px; padding: 16px 20px; background: rgba(139,92,246,0.06); font-size: 13px; line-height: 1.7;">

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px;">

          <!-- Session Memory -->
          <div>
            <div style="color: var(--purple); font-weight: 600; margin-bottom: 8px;">会话记忆（Session Memory）</div>
            <div style="color: var(--text-muted); margin-bottom: 8px;">
              <code style="font-size:11px;">src/services/SessionMemory/sessionMemory.ts</code><br>
              后台持续运行的笔记系统，以 forked subagent 方式将当前对话要点写入临时 Markdown 文件。
            </div>
            <div style="color: var(--text-muted); font-size: 12px; margin-bottom: 4px;"><strong>写入触发条件（<code style="font-size:11px;">shouldExtractMemory()</code>）：</strong></div>
            <table style="width:100%; border-collapse:collapse; font-size:12px;">
              <thead>
                <tr style="background:rgba(255,255,255,0.06);">
                  <th style="padding:5px 8px; text-align:left; color:var(--text-dim); font-weight:500; border-bottom:1px solid rgba(255,255,255,0.08);">条件</th>
                  <th style="padding:5px 8px; text-align:left; color:var(--text-dim); font-weight:500; border-bottom:1px solid rgba(255,255,255,0.08);">阈值</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding:5px 8px; color:var(--text-muted); border-bottom:1px solid rgba(255,255,255,0.05);">初始化门槛（首次）</td>
                  <td style="padding:5px 8px; color:var(--text-muted); border-bottom:1px solid rgba(255,255,255,0.05);">上下文 token 数 ≥ 10,000</td>
                </tr>
                <tr>
                  <td style="padding:5px 8px; color:var(--text-muted); border-bottom:1px solid rgba(255,255,255,0.05);">更新门槛（后续）</td>
                  <td style="padding:5px 8px; color:var(--text-muted); border-bottom:1px solid rgba(255,255,255,0.05);">token 增量 ≥ 5,000 <strong>AND</strong> 工具调用 ≥ 3</td>
                </tr>
                <tr>
                  <td style="padding:5px 8px; color:var(--text-muted);">自然对话断点</td>
                  <td style="padding:5px 8px; color:var(--text-muted);">token 增量满足，且最后一个 turn 无工具调用</td>
                </tr>
              </tbody>
            </table>
            <div style="color:var(--text-dim); font-size:11px; margin-top:6px;">大多数轮次不触发，避免每轮调用 LLM 提取</div>
          </div>

          <!-- Compact -->
          <div>
            <div style="color: var(--accent); font-weight: 600; margin-bottom: 8px;">Compact（上下文压缩）</div>
            <div style="color: var(--text-muted); margin-bottom: 10px;">
              上下文窗口接近上限时自动触发（autoCompact），或用户手动执行 <code style="font-size:11px;">/compact</code>。<br>
              传统做法：调用 LLM 生成摘要，替换旧消息历史，成本较高。
            </div>
            <div style="color: var(--green); font-weight: 600; margin-bottom: 6px;">实验性集成：SM Compact</div>
            <div style="color: var(--text-muted); font-size: 12px;">
              <code style="font-size:11px;">sessionMemoryCompact.ts</code>（双 feature flag 控制）<br>
              Compact 触发时，直接用 Session Memory 文件替代 LLM 摘要，同时保留最近 <strong>10K–40K token</strong> 的原始消息——既省去 LLM 摘要调用，又不丢失近期对话细节。
            </div>
          </div>
        </div>

        <!-- 对比表 -->
        <div style="border-top:1px solid rgba(255,255,255,0.08); padding-top:12px;">
          <div style="color:var(--text-dim); font-size:12px; margin-bottom:6px; font-weight:500;">两者对比</div>
          <table style="width:100%; border-collapse:collapse; font-size:12px;">
            <thead>
              <tr style="background:rgba(255,255,255,0.06);">
                <th style="padding:5px 10px; text-align:left; color:var(--text-dim); font-weight:500; border-bottom:1px solid rgba(255,255,255,0.08);">维度</th>
                <th style="padding:5px 10px; text-align:left; color:var(--purple); font-weight:500; border-bottom:1px solid rgba(255,255,255,0.08);">Session Memory</th>
                <th style="padding:5px 10px; text-align:left; color:var(--accent); font-weight:500; border-bottom:1px solid rgba(255,255,255,0.08);">Compact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:5px 10px; color:var(--text-dim); border-bottom:1px solid rgba(255,255,255,0.05);">触发时机</td>
                <td style="padding:5px 10px; color:var(--text-muted); border-bottom:1px solid rgba(255,255,255,0.05);">会话中周期性（token + 工具调用阈值）</td>
                <td style="padding:5px 10px; color:var(--text-muted); border-bottom:1px solid rgba(255,255,255,0.05);">上下文快满时（autoCompact）或手动 /compact</td>
              </tr>
              <tr>
                <td style="padding:5px 10px; color:var(--text-dim); border-bottom:1px solid rgba(255,255,255,0.05);">存储位置</td>
                <td style="padding:5px 10px; color:var(--text-muted); border-bottom:1px solid rgba(255,255,255,0.05);">临时文件（当前会话专属）</td>
                <td style="padding:5px 10px; color:var(--text-muted); border-bottom:1px solid rgba(255,255,255,0.05);">替换消息历史（内存 + transcript）</td>
              </tr>
              <tr>
                <td style="padding:5px 10px; color:var(--text-dim); border-bottom:1px solid rgba(255,255,255,0.05);">目的</td>
                <td style="padding:5px 10px; color:var(--text-muted); border-bottom:1px solid rgba(255,255,255,0.05);">持续记录当前会话笔记</td>
                <td style="padding:5px 10px; color:var(--text-muted); border-bottom:1px solid rgba(255,255,255,0.05);">防止超出 context window</td>
              </tr>
              <tr>
                <td style="padding:5px 10px; color:var(--text-dim);">关系</td>
                <td style="padding:5px 10px; color:var(--text-muted);">可作为 compact 摘要来源（实验性）</td>
                <td style="padding:5px 10px; color:var(--text-muted);">compact 可消费 SM 文件</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div id="claudemd-panel" style="display:none; margin-top: 10px; border: 1px solid rgba(99,102,241,0.35); border-radius: 10px; padding: 16px 20px; background: rgba(99,102,241,0.06); font-size: 13px; line-height: 1.7;">

        <!-- 官方定位 -->
        <div style="margin-bottom: 14px;">
          <div style="color: var(--accent); font-weight: 600; margin-bottom: 6px;">官方定位（<code style="font-size:11px;">src/commands/init.ts</code>）</div>
          <div style="background: rgba(255,255,255,0.04); border-radius: 8px; padding: 10px 14px; color: var(--text-muted); font-size: 12px; border-left: 3px solid var(--accent);">
            CLAUDE.md is loaded into every Claude Code session, so it must be concise —<br>
            <strong style="color:var(--text-primary);">only include what Claude would get wrong without it.</strong><br>
            <span style="color:var(--text-dim);">判断标准：移除这行会不会让 Claude 犯错？不会就删掉。</span>
          </div>
        </div>

        <!-- 文件层级 -->
        <div style="margin-bottom: 14px;">
          <div style="color: var(--accent); font-weight: 600; margin-bottom: 6px;">四层文件体系（越后加载优先级越高）</div>
          <table style="width:100%; border-collapse:collapse; font-size:12px;">
            <thead>
              <tr style="background:rgba(255,255,255,0.06);">
                <th style="padding:5px 10px; text-align:left; color:var(--text-dim); font-weight:500; border-bottom:1px solid rgba(255,255,255,0.08);">层次</th>
                <th style="padding:5px 10px; text-align:left; color:var(--text-dim); font-weight:500; border-bottom:1px solid rgba(255,255,255,0.08);">路径</th>
                <th style="padding:5px 10px; text-align:left; color:var(--text-dim); font-weight:500; border-bottom:1px solid rgba(255,255,255,0.08);">说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:5px 10px; color:var(--text-dim); border-bottom:1px solid rgba(255,255,255,0.05);">Managed</td>
                <td style="padding:5px 10px; color:var(--text-muted); border-bottom:1px solid rgba(255,255,255,0.05);"><code style="font-size:11px;">/etc/claude-code/CLAUDE.md</code></td>
                <td style="padding:5px 10px; color:var(--text-muted); border-bottom:1px solid rgba(255,255,255,0.05);">企业/管理员全局，覆盖所有用户</td>
              </tr>
              <tr>
                <td style="padding:5px 10px; color:var(--text-dim); border-bottom:1px solid rgba(255,255,255,0.05);">User</td>
                <td style="padding:5px 10px; color:var(--text-muted); border-bottom:1px solid rgba(255,255,255,0.05);"><code style="font-size:11px;">~/.claude/CLAUDE.md</code></td>
                <td style="padding:5px 10px; color:var(--text-muted); border-bottom:1px solid rgba(255,255,255,0.05);">用户私有全局，适用所有项目</td>
              </tr>
              <tr>
                <td style="padding:5px 10px; color:var(--text-dim); border-bottom:1px solid rgba(255,255,255,0.05);">Project</td>
                <td style="padding:5px 10px; color:var(--text-muted); border-bottom:1px solid rgba(255,255,255,0.05);"><code style="font-size:11px;">CLAUDE.md / .claude/rules/*.md</code></td>
                <td style="padding:5px 10px; color:var(--text-muted); border-bottom:1px solid rgba(255,255,255,0.05);">团队共享，提交 git</td>
              </tr>
              <tr>
                <td style="padding:5px 10px; color:var(--text-dim);">Local</td>
                <td style="padding:5px 10px; color:var(--text-muted);"><code style="font-size:11px;">CLAUDE.local.md</code></td>
                <td style="padding:5px 10px; color:var(--text-muted);">用户私有项目级，gitignore</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 内容归属 -->
        <div style="border-top:1px solid rgba(255,255,255,0.08); padding-top:12px;">
          <div style="color: var(--accent); font-weight: 600; margin-bottom: 6px;">内容归属原则（<code style="font-size:11px;">remember</code> skill 分类规则）</div>
          <table style="width:100%; border-collapse:collapse; font-size:12px;">
            <thead>
              <tr style="background:rgba(255,255,255,0.06);">
                <th style="padding:5px 10px; text-align:left; color:var(--text-dim); font-weight:500; border-bottom:1px solid rgba(255,255,255,0.08);">目标文件</th>
                <th style="padding:5px 10px; text-align:left; color:var(--text-dim); font-weight:500; border-bottom:1px solid rgba(255,255,255,0.08);">放什么</th>
                <th style="padding:5px 10px; text-align:left; color:var(--text-dim); font-weight:500; border-bottom:1px solid rgba(255,255,255,0.08);">不放什么</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:5px 10px; color:var(--accent); font-weight:500; border-bottom:1px solid rgba(255,255,255,0.05);">CLAUDE.md</td>
                <td style="padding:5px 10px; color:var(--text-muted); border-bottom:1px solid rgba(255,255,255,0.05);">项目规范、所有贡献者的 Claude 都须遵守的指令</td>
                <td style="padding:5px 10px; color:var(--text-dim); border-bottom:1px solid rgba(255,255,255,0.05);">个人偏好、编辑器主题、IDE 快捷键</td>
              </tr>
              <tr>
                <td style="padding:5px 10px; color:var(--green); font-weight:500; border-bottom:1px solid rgba(255,255,255,0.05);">CLAUDE.local.md</td>
                <td style="padding:5px 10px; color:var(--text-muted); border-bottom:1px solid rgba(255,255,255,0.05);">个人偏好、沙箱 URL、本地路径、个人工作习惯</td>
                <td style="padding:5px 10px; color:var(--text-dim); border-bottom:1px solid rgba(255,255,255,0.05);">团队规范（应放 CLAUDE.md）</td>
              </tr>
              <tr>
                <td style="padding:5px 10px; color:var(--purple); font-weight:500;">auto-memory</td>
                <td style="padding:5px 10px; color:var(--text-muted);">工作笔记、临时上下文、尚不确定的规律</td>
                <td style="padding:5px 10px; color:var(--text-dim);">可推导的事实（架构/git/代码模式）</td>
              </tr>
            </tbody>
          </table>
          <div style="color:var(--text-dim); font-size:11px; margin-top:8px;">CC 不会自动修改 CLAUDE.md——它是唯一需要人工维护的记忆层。auto-memory 中成熟的条目可通过 <code style="font-size:10px;">/remember</code> skill 提案晋升。</div>
        </div>
      </div>
    `,
    notes: `
      <p><strong>讲解要点：</strong></p>
      <p>首先建立一个全局视角。Claude Code 中其实存在三种不同性质的"记忆"，它们的目的和生命周期完全不同：</p>
      <p><strong>指令记忆</strong>就是大家熟悉的 CLAUDE.md 文件。这是用户手动维护的，告诉 Claude "怎么做"——编码规范、架构约束、项目特定的行为规则。它是静态的，不会被 Claude 自动修改。</p>
      <p><strong>语义记忆</strong>是本报告的核心。这是 Claude 在与用户对话过程中自动学习并持久化的结构化知识。比如用户的角色背景、反馈的工作偏好、项目的非技术决策等。它存储在 memory 目录下的独立 topic 文件中，所有会话共享。</p>
      <p><strong>会话记忆</strong>则是当前会话专属的上下文压缩快照。当上下文窗口快要耗尽时，系统会 fork 一个子 agent 生成压缩笔记，保留关键决策。它不跨会话复用，会话结束后就不再使用。</p>
      <p>我们今天的重点是中间这一层——语义记忆，以及负责维护它长期健康的 AutoDream 机制。</p>
    `
  },

  // ── Slide 4: 存什么——四类语义记忆 ──
  {
    html: `
      <h2 class="anim"><span class="icon">02</span> 存什么：四类语义记忆</h2>
      <p class="anim">语义记忆采用<strong>封闭式四类分类</strong>，定义于 <code>memoryTypes.ts</code>，所有记忆文件必须属于其中一类：</p>
      <div class="card-grid cols-2 anim">
        <div class="card accent-border">
          <div class="card-label-tag text-accent mono">user</div>
          <div class="card-title">用户画像</div>
          <div class="card-desc">
            用户的角色、目标、知识背景、偏好<br>
            <strong>何时保存：</strong>了解用户身份或偏好时<br>
            <strong>用途：</strong>裁剪回答的深度和角度
          </div>
          <div class="code-block small" style="margin-top:10px; padding:10px 14px; font-size:12px;">
            <span class="cm">// 用户说："I've been writing Go for ten years<br>// but this is my first time touching React"</span><br>
            <span class="kw">type:</span> user &rarr; 深度 Go 经验，React 新手
          </div>
        </div>
        <div class="card green-border">
          <div class="card-label-tag text-green mono">feedback</div>
          <div class="card-title">行为反馈</div>
          <div class="card-desc">
            用户对工作方式的纠正与确认<br>
            <strong>何时保存：</strong>用户纠正行为<strong>或</strong>明确认可非显然选择时<br>
            <strong>用途：</strong>保持行为一致性，不需用户重复指导
          </div>
          <div class="code-block small" style="margin-top:10px; padding:10px 14px; font-size:12px;">
            <span class="cm">// "don't mock the database in tests<br>// — we got burned last quarter"</span><br>
            <span class="kw">type:</span> feedback &rarr; 集成测试必须用真实数据库
          </div>
        </div>
        <div class="card orange-border">
          <div class="card-label-tag text-orange mono">project</div>
          <div class="card-title">项目上下文</div>
          <div class="card-desc">
            进行中的工作、决策背景、截止日期<br>
            <strong>何时保存：</strong>了解代码/git 无法推导的项目信息时<br>
            <strong>用途：</strong>理解需求背后的动机
          </div>
          <div class="code-block small" style="margin-top:10px; padding:10px 14px; font-size:12px;">
            <span class="cm">// "merge freeze begins Thursday<br>// — mobile team is cutting a release"</span><br>
            <span class="kw">type:</span> project &rarr; 2026-03-05 起冻结合并
          </div>
        </div>
        <div class="card purple-border">
          <div class="card-label-tag text-purple mono">reference</div>
          <div class="card-title">外部系统指针</div>
          <div class="card-desc">
            指向 Linear、Grafana、Slack 等外部资源的位置<br>
            <strong>何时保存：</strong>了解特定外部资源的位置时<br>
            <strong>用途：</strong>知道去哪里查找信息
          </div>
          <div class="code-block small" style="margin-top:10px; padding:10px 14px; font-size:12px;">
            <span class="cm">// "pipeline bugs are tracked<br>// in Linear project INGEST"</span><br>
            <span class="kw">type:</span> reference &rarr; Linear/INGEST 追踪管线 bug
          </div>
        </div>
      </div>
      <div class="highlight-box blue anim" style="margin-top:16px;">
        每个记忆文件使用 <strong>frontmatter</strong> 标注元信息（name / description / type），其中 <code>description</code> 字段用于召回阶段的相关性判断——选择器模型仅凭 filename + description 决定是否召回，不读取正文。
      </div>
      <div class="anim" style="margin-top: 14px; text-align: right;">
        <button id="btn-memory-demo"
          onclick="(function(btn){
            var panel = document.getElementById('memory-demo-panel');
            var expanded = panel.style.display !== 'none';
            panel.style.display = expanded ? 'none' : 'block';
            btn.textContent = expanded ? '扩展：完整记忆文件示例 ▸' : '收起 ▴';
          })(this)"
          style="background: none; border: 1px solid var(--green); color: var(--green); border-radius: 6px; padding: 5px 14px; font-size: 13px; cursor: pointer; font-family: inherit; transition: background 0.2s;"
          onmouseover="this.style.background='rgba(16,185,129,0.12)'"
          onmouseout="this.style.background='none'"
        >扩展：完整记忆文件示例 ▸</button>
      </div>

      <div id="memory-demo-panel" style="display:none; margin-top:10px; border:1px solid rgba(16,185,129,0.35); border-radius:10px; padding:16px 20px; background:rgba(16,185,129,0.05); font-size:13px;">

        <!-- MEMORY.md 索引 -->
        <div style="margin-bottom:14px;">
          <div style="color:var(--green); font-weight:600; margin-bottom:6px; font-size:12px;">MEMORY.md（索引文件）</div>
          <div style="background:#0d1117; border-radius:8px; padding:12px 16px; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.8; color:#c9d1d9;">
            <span style="color:#8b949e;"># Auto Memory Index</span><br>
            <br>
            - <span style="color:#58a6ff;">[User Profile](user_profile.md)</span> <span style="color:#8b949e;">— 后端工程师，TypeScript 专家，React 新手</span><br>
            - <span style="color:#58a6ff;">[Testing Policy](feedback_testing.md)</span> <span style="color:#8b949e;">— 集成测试必须用真实 DB，禁止 mock；上季度事故教训</span><br>
            - <span style="color:#58a6ff;">[Auth Rewrite Context](project_auth_rewrite.md)</span> <span style="color:#8b949e;">— Auth 重写由合规要求驱动，非技术债，截止 2026-04-30</span><br>
            - <span style="color:#58a6ff;">[Infrastructure References](reference_infra.md)</span> <span style="color:#8b949e;">— Oncall 看板、Linear、部署流水线 URL 速查</span>
          </div>
        </div>

        <!-- Tab 切换 -->
        <div style="display:flex; gap:6px; margin-bottom:10px; flex-wrap:wrap;">
          <button onclick="showMemTab('user')" id="tab-user"
            style="padding:4px 12px; font-size:12px; border-radius:5px; cursor:pointer; font-family:inherit; border:1px solid var(--accent); background:var(--accent); color:#fff; transition:0.2s;">user</button>
          <button onclick="showMemTab('feedback')" id="tab-feedback"
            style="padding:4px 12px; font-size:12px; border-radius:5px; cursor:pointer; font-family:inherit; border:1px solid rgba(255,255,255,0.15); background:none; color:var(--text-muted); transition:0.2s;">feedback</button>
          <button onclick="showMemTab('project')" id="tab-project"
            style="padding:4px 12px; font-size:12px; border-radius:5px; cursor:pointer; font-family:inherit; border:1px solid rgba(255,255,255,0.15); background:none; color:var(--text-muted); transition:0.2s;">project</button>
          <button onclick="showMemTab('reference')" id="tab-reference"
            style="padding:4px 12px; font-size:12px; border-radius:5px; cursor:pointer; font-family:inherit; border:1px solid rgba(255,255,255,0.15); background:none; color:var(--text-muted); transition:0.2s;">reference</button>
          <span id="mem-filename" style="font-size:11px; color:var(--text-dim); align-self:center; margin-left:4px; font-family:'JetBrains Mono',monospace;">user_profile.md</span>
        </div>

        <!-- user -->
        <div id="mem-user" style="background:#0d1117; border-radius:8px; padding:14px 16px; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.9; color:#c9d1d9;">
          <span style="color:#8b949e;">---</span><br>
          <span style="color:#79c0ff;">name</span><span style="color:#c9d1d9;">: User Profile</span><br>
          <span style="color:#79c0ff;">description</span><span style="color:#c9d1d9;">: 后端工程师，8年 TypeScript/Node.js，React 新手；前端解释用后端类比</span><br>
          <span style="color:#79c0ff;">type</span><span style="color:#c9d1d9;">: </span><span style="color:#ffa657;">user</span><br>
          <span style="color:#8b949e;">---</span><br>
          <br>
          用户是后端工程师，8 年以上 TypeScript / Node.js 经验，熟悉系统设计和 API 架构。<br>
          第一次接触本项目的 React 前端部分。<br>
          <br>
          在解释前端概念时，优先使用后端类比帮助理解，例如：<br>
          - React state ≈ 服务端 session 状态<br>
          - useEffect ≈ 事件监听器的注册/清理生命周期<br>
          - 组件 props ≈ 函数参数（不可变传入）
        </div>

        <!-- feedback -->
        <div id="mem-feedback" style="display:none; background:#0d1117; border-radius:8px; padding:14px 16px; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.9; color:#c9d1d9;">
          <span style="color:#8b949e;">---</span><br>
          <span style="color:#79c0ff;">name</span><span style="color:#c9d1d9;">: Integration Test Policy</span><br>
          <span style="color:#79c0ff;">description</span><span style="color:#c9d1d9;">: 集成测试必须用真实 PostgreSQL，禁止 mock DB；上季度 mock 导致生产事故</span><br>
          <span style="color:#79c0ff;">type</span><span style="color:#c9d1d9;">: </span><span style="color:#ffa657;">feedback</span><br>
          <span style="color:#8b949e;">---</span><br>
          <br>
          集成测试必须连接真实 PostgreSQL 实例，禁止使用 jest.mock 或任何内存 DB 替代。<br>
          <br>
          <span style="color:#d2a8ff;"><strong>Why:</strong></span> 上季度一次 mock 测试全部通过的 migration，在生产环境执行时因 schema 差异崩溃，<br>
          排查耗时 4 小时，影响了当天的发版。mock 的 schema 没有跟随真实 DB 演进。<br>
          <br>
          <span style="color:#d2a8ff;"><strong>How to apply:</strong></span> 编写或建议涉及 DB 操作的测试代码时，始终使用<br>
          <span style="color:#8b949e;">scripts/test-db-setup.sh</span> 启动测试数据库。如看到 mock DB 的写法，提示替换。
        </div>

        <!-- project -->
        <div id="mem-project" style="display:none; background:#0d1117; border-radius:8px; padding:14px 16px; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.9; color:#c9d1d9;">
          <span style="color:#8b949e;">---</span><br>
          <span style="color:#79c0ff;">name</span><span style="color:#c9d1d9;">: Auth Middleware Rewrite</span><br>
          <span style="color:#79c0ff;">description</span><span style="color:#c9d1d9;">: Auth 重写由合规要求（session token 存储）驱动，非技术债；截止 2026-04-30</span><br>
          <span style="color:#79c0ff;">type</span><span style="color:#c9d1d9;">: </span><span style="color:#ffa657;">project</span><br>
          <span style="color:#8b949e;">---</span><br>
          <br>
          Auth middleware 重写（PR #847）由法务/合规要求驱动，而非技术债清理。<br>
          <br>
          <span style="color:#d2a8ff;"><strong>Why:</strong></span> 法务部门标记当前实现将原始 session token 存入 Redis 且无过期时间，<br>
          不符合 2026-05-01 生效的 SOC 2 新要求。<br>
          <br>
          <span style="color:#d2a8ff;"><strong>How to apply:</strong></span> 范围决策优先满足合规，不要建议保留旧存储模式的"简化方案"。<br>
          截止日期 2026-04-30，不可延期。任何该模块的改动需先确认不破坏合规边界。
        </div>

        <!-- reference -->
        <div id="mem-reference" style="display:none; background:#0d1117; border-radius:8px; padding:14px 16px; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.9; color:#c9d1d9;">
          <span style="color:#8b949e;">---</span><br>
          <span style="color:#79c0ff;">name</span><span style="color:#c9d1d9;">: Infrastructure References</span><br>
          <span style="color:#79c0ff;">description</span><span style="color:#c9d1d9;">: Oncall 看板、Linear 项目、部署流水线和 Staging 环境 URL 速查</span><br>
          <span style="color:#79c0ff;">type</span><span style="color:#c9d1d9;">: </span><span style="color:#ffa657;">reference</span><br>
          <span style="color:#8b949e;">---</span><br>
          <br>
          - <span style="color:#7ee787;"><strong>Bug 追踪：</strong></span>Linear 项目 "BACKEND-CORE" 追踪所有后端服务 bug<br>
          - <span style="color:#7ee787;"><strong>Oncall 看板：</strong></span>grafana.internal/d/api-latency — p99 &gt; 500ms 触发告警<br>
          - <span style="color:#7ee787;"><strong>部署流水线：</strong></span>GitHub Actions <span style="color:#8b949e;">deploy.yml</span>，生产部署须 @platform-team 审批<br>
          - <span style="color:#7ee787;"><strong>Staging 环境：</strong></span>staging.internal:3000，每天 02:00 UTC 重置
        </div>

      </div>
    `,
    notes: `
      <p>上一页我们知道了语义记忆是核心，这一页回答"语义记忆里到底存什么"。</p>
      <p>系统采用封闭式四类分类，定义在 memoryTypes.ts 中。每种类型有明确的边界：</p>
      <p><strong>user</strong>——用户画像。比如用户说"我写了十年 Go，第一次碰 React"，系统就会存一条 user 类型的记忆，后续给前端建议时会用后端类比来解释。</p>
      <p><strong>feedback</strong>——行为反馈。注意这里不只记录纠正（"别这样做"），也记录确认（"对，就是这样"）。源码注释特别提到：如果只存纠正不存确认，Claude 会变得过度谨慎，不敢重复已被验证的好方法。</p>
      <p><strong>project</strong>——项目上下文。存的是代码和 git 历史推导不出来的信息，比如"周四开始 merge freeze，因为移动端要切 release 分支"。注意相对日期会被转换为绝对日期。</p>
      <p><strong>reference</strong>——外部系统指针。不存内容本身，只存"去哪里找"。比如 Linear 里的哪个 project 追踪管线 bug，Grafana 的哪个 dashboard 是 oncall 看的。</p>
      <p>底部提到的 frontmatter 格式很关键：description 字段是召回的关键——选择器模型只看 filename 和 description 来判断相关性，不读正文。所以 description 写得越精确，被正确召回的概率越高。</p>
    `
  },

  // ── Slide 5: 不存什么——排除边界 ──
  {
    html: `
      <h2 class="anim"><span class="icon">03</span> 不存什么：排除边界</h2>
      <div class="quote anim" style="font-size: 1.05em; font-style: normal; border-left-width: 4px;">
        记忆应该只存<strong style="color:var(--text-primary);">不可推导的知识</strong>。<br>
        能从代码 <code>grep</code> 到的、能从 <code>git log</code> 看到的，都不值得占用记忆空间。
      </div>
      <p class="anim" style="margin-top:20px;">这条设计原则在源码中体现为 <code>WHAT_NOT_TO_SAVE_SECTION</code>——一份硬编码的排除清单，即使用户明确要求保存也会被拒绝：</p>
      <div class="table-wrap anim" style="margin-top: 12px;">
        <table>
          <thead>
            <tr><th>排除项</th><th>已有权威来源</th><th>存入记忆的后果</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>代码模式、架构、文件路径</strong></td>
              <td><code>grep</code> / <code>glob</code> / 直接读取</td>
              <td>代码重构后记忆立刻过时，产生误导</td>
            </tr>
            <tr>
              <td><strong>Git 历史、谁改了什么</strong></td>
              <td><code>git log</code> / <code>git blame</code></td>
              <td>与真实历史竞争，且永远不如 git 准确</td>
            </tr>
            <tr>
              <td><strong>调试方案、修复配方</strong></td>
              <td>fix 在代码中，上下文在 commit message 中</td>
              <td>下次遇到类似 bug 时套用旧方案，忽略新变化</td>
            </tr>
            <tr>
              <td><strong>CLAUDE.md 已有的规则</strong></td>
              <td>指令记忆层已覆盖</td>
              <td>两处维护同一规则，修改时必然不一致</td>
            </tr>
            <tr>
              <td><strong>临时任务、当前会话状态</strong></td>
              <td>会话记忆 / Task 系统</td>
              <td>短期信息污染长期知识库</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="compare-row anim" style="margin-top: 20px;">
        <div class="compare-col" style="border-top: 3px solid var(--green);">
          <h4><span class="badge green">值得存</span></h4>
          <ul>
            <li>"用真实数据库跑测试，别 mock"<span class="dim"> — 偏好</span></li>
            <li>"周四起 merge freeze"<span class="dim"> — 背景决策</span></li>
            <li>"管线 bug 追踪在 Linear/INGEST"<span class="dim"> — 外部指针</span></li>
          </ul>
        </div>
        <div class="compare-col" style="border-top: 3px solid var(--red);">
          <h4><span class="badge red">不该存</span></h4>
          <ul>
            <li>"Login 组件在 src/components/Login.tsx"<span class="dim"> — grep 即得</span></li>
            <li>"上周 Alice 重构了 auth 模块"<span class="dim"> — git log 即得</span></li>
            <li>"用 JSON.parse 修了那个 bug"<span class="dim"> — 看 commit 即得</span></li>
          </ul>
        </div>
      </div>
    `,
    notes: `
      <p>这一页的核心不是排除清单本身，而是背后的设计选择：记忆只存不可推导的知识。</p>
      <p>Claude Code 运行时已经拥有完整的工具链——可以 grep 代码、读文件、查 git 历史。这些工具能在毫秒级获取的信息，没有必要在记忆中维护一份副本。副本不但占用宝贵的记忆空间（MEMORY.md 只有 200 行上限），而且一旦代码变化就会过时，产生的误导比没有记忆更糟。</p>
      <p>这个排除清单定义在 WHAT_NOT_TO_SAVE_SECTION 中，是硬编码在系统 Prompt 中的。即使用户说"帮我记住这个函数的实现"，Claude 也应该拒绝，引导用户直接看代码。</p>
      <p>下面的对比表格用具体例子说明判断标准：左边三条都是工具无法推导的人类判断（偏好、背景决策、外部指针），右边三条都有更权威、更实时的来源。</p>
      <p>如果不设这条边界，extractMemories 每轮提取时可能把大量代码细节写进记忆，导致记忆目录迅速膨胀为代码库的冗余副本，真正有价值的人类判断反而被淹没。</p>
    `
  },

  // ── Slide 6: 两条流水线——增量写入 + 周期整理 ──
  {
    html: `
      <h2 class="anim"><span class="icon">04</span> 两条流水线：增量写入 + 周期整理</h2>
      <p class="anim">记忆系统将写入拆为两条独立流水线，各自针对不同的时间尺度优化：</p>
      <div class="compare-row anim">
        <div class="compare-col" style="border-top: 3px solid var(--accent);">
          <h4><span class="badge blue">extractMemories</span> 增量写入</h4>
          <ul>
            <li><strong>触发频率：</strong>每轮对话结束后</li>
            <li><strong>视野范围：</strong>仅当轮对话内容</li>
            <li><strong>工作量：</strong>轻量，2-4 turn 完成</li>
            <li><strong>产出：</strong>新增或更新 topic 文件 + 同步写入 MEMORY.md 索引</li>
            <li><strong>执行方式：</strong>forked agent，fire-and-forget</li>
          </ul>
          <div class="code-block small" style="margin-top:10px; padding:10px 14px; font-size:12px;">
            <span class="cm">// stopHooks 触发</span><br>
            <span class="kw">void</span> <span class="fn">executeExtractMemories</span>(ctx)
          </div>
        </div>
        <div class="compare-col" style="border-top: 3px solid var(--green);">
          <h4><span class="badge green">AutoDream</span> 周期整理</h4>
          <ul>
            <li><strong>触发频率：</strong>≥24h 且 ≥5 个新 session</li>
            <li><strong>视野范围：</strong>全部记忆文件 + transcript</li>
            <li><strong>工作量：</strong>深度，交叉验证 / 去重 / 合并</li>
            <li><strong>产出：</strong>合并、修正、删除已有文件</li>
            <li><strong>执行方式：</strong>forked agent，fire-and-forget</li>
          </ul>
          <div class="code-block small" style="margin-top:10px; padding:10px 14px; font-size:12px;">
            <span class="cm">// stopHooks 触发，门控通过后执行</span><br>
            <span class="kw">void</span> <span class="fn">executeAutoDream</span>(ctx)
          </div>
        </div>
      </div>
      <h3 class="anim" style="margin-top: 24px;">为什么不合成一条？</h3>
      <div class="card-grid cols-2 anim" style="margin-top: 10px;">
        <div class="card" style="border-left: 3px solid var(--red);">
          <div class="card-title">方案 A：每轮都做全局整理</div>
          <div class="card-desc">
            每次对话结束后既提取新记忆，又读 transcript 做交叉验证、去重合并。<br>
            <strong class="text-red">问题：</strong>单轮延迟过高，后台 agent 占用大量 token，实际场景不可接受。
          </div>
        </div>
        <div class="card" style="border-left: 3px solid var(--red);">
          <div class="card-title">方案 B：只做周期整理，不做增量</div>
          <div class="card-desc">
            积攒足够多 session 后一次性整合，中间不提取。<br>
            <strong class="text-red">问题：</strong>两次整理之间的新对话信息完全丢失，记忆不完整。
          </div>
        </div>
      </div>
      <div class="highlight-box green anim" style="margin-top: 16px;">
        <strong>拆分后的效果：</strong>增量写入可以很轻（只看当轮对话，2-4 turn），全局整理可以做得很深（读 transcript、交叉验证、去重合并）。两者在 <code>stopHooks</code> 中顺序触发，互不阻塞。
      </div>
    `,
    notes: `
      <p>前面讲了存什么、不存什么，这一页从全局角度回答"记忆是怎么运转的"。</p>
      <p>系统将记忆写入拆成了两条独立的流水线。这是一个关键的架构决策。</p>
      <p><strong>extractMemories</strong> 是增量写入。每轮对话结束后，在 stopHooks 里以 fire-and-forget 方式触发。它只看当轮对话的内容，2 到 4 个 turn 就完成，工作量很轻。它的职责是"不漏"——确保每次有价值的对话内容都及时提取成记忆文件。</p>
      <p><strong>AutoDream</strong> 是周期整理。触发条件严格得多：距上次整合至少 24 小时，且期间至少积累了 5 个新 session。它的视野范围是整个记忆目录加上 transcript 历史，可以做交叉验证、去重、合并、纠错。它的职责是"不乱"——维护记忆库的长期质量。</p>
      <p>为什么不合成一条？两个反面方案说明了问题：如果每轮都做全局整理，延迟太高；如果只做周期整理不做增量，中间的对话信息就丢了。拆分后各自在自己的时间尺度上做到最优。</p>
      <p>两者在 stopHooks.ts 中顺序触发，都是 fire-and-forget，互不阻塞主对话循环。AutoDream 大多数情况下在门控阶段就返回了（一次 stat 调用），几乎零开销。这个设计我们在 Part 2 会详细展开。</p>
    `
  },

  // ── Slide 7: 召回逻辑——如何从海量记忆中选择 ──
  {
    html: `
      <h2 class="anim"><span class="icon">05</span> 召回逻辑：如何从海量记忆中选择</h2>
      <p class="anim">记忆积累到一定量后不可能全部塞入上下文，系统通过<strong>静态索引 + 动态选择</strong>两条路径解决召回问题：</p>

      <h3 class="anim" style="margin-top: 20px;">路径一：MEMORY.md 静态索引</h3>
      <div class="card anim" style="margin-top: 8px;">
        <div class="card-desc">
          每次会话启动时，<code>loadMemoryPrompt()</code> 将 <code>MEMORY.md</code> 的内容注入系统 Prompt。<br>
          索引格式：每条一行，不超过 150 字符，只写导览不放正文。
        </div>
        <div style="margin-top: 10px; text-align: right;">
          <button id="btn-memory-demo-s7"
            onclick="(function(btn){
              var panel = document.getElementById('memory-demo-panel-s7');
              var expanded = panel.style.display !== 'none';
              panel.style.display = expanded ? 'none' : 'block';
              btn.textContent = expanded ? '示例：完整记忆文件 ▸' : '收起 ▴';
            })(this)"
            style="background: none; border: 1px solid var(--green); color: var(--green); border-radius: 6px; padding: 5px 14px; font-size: 13px; cursor: pointer; font-family: inherit; transition: background 0.2s;"
            onmouseover="this.style.background='rgba(16,185,129,0.12)'"
            onmouseout="this.style.background='none'"
          >示例：完整记忆文件 ▸</button>
        </div>

        <div id="memory-demo-panel-s7" style="display:none; margin-top:10px; border:1px solid rgba(16,185,129,0.35); border-radius:10px; padding:16px 20px; background:rgba(16,185,129,0.05); font-size:13px;">
          <div style="margin-bottom:14px;">
            <div style="color:var(--green); font-weight:600; margin-bottom:6px; font-size:12px;">MEMORY.md（索引文件）</div>
            <div style="background:#0d1117; border-radius:8px; padding:12px 16px; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.8; color:#c9d1d9;">
              <span style="color:#8b949e;"># Auto Memory Index</span><br>
              <br>
              - <span style="color:#58a6ff;">[User Profile](user_profile.md)</span> <span style="color:#8b949e;">— 后端工程师，TypeScript 专家，React 新手</span><br>
              - <span style="color:#58a6ff;">[Testing Policy](feedback_testing.md)</span> <span style="color:#8b949e;">— 集成测试必须用真实 DB，禁止 mock；上季度事故教训</span><br>
              - <span style="color:#58a6ff;">[Auth Rewrite Context](project_auth_rewrite.md)</span> <span style="color:#8b949e;">— Auth 重写由合规要求驱动，非技术债，截止 2026-04-30</span><br>
              - <span style="color:#58a6ff;">[Infrastructure References](reference_infra.md)</span> <span style="color:#8b949e;">— Oncall 看板、Linear、部署流水线 URL 速查</span>
            </div>
          </div>
          <div style="display:flex; gap:6px; margin-bottom:10px; flex-wrap:wrap;">
            <button onclick="showS7MemTab('user')" id="s7-tab-user"
              style="padding:4px 12px; font-size:12px; border-radius:5px; cursor:pointer; font-family:inherit; border:1px solid var(--accent); background:var(--accent); color:#fff; transition:0.2s;">user</button>
            <button onclick="showS7MemTab('feedback')" id="s7-tab-feedback"
              style="padding:4px 12px; font-size:12px; border-radius:5px; cursor:pointer; font-family:inherit; border:1px solid rgba(255,255,255,0.15); background:none; color:var(--text-muted); transition:0.2s;">feedback</button>
            <button onclick="showS7MemTab('project')" id="s7-tab-project"
              style="padding:4px 12px; font-size:12px; border-radius:5px; cursor:pointer; font-family:inherit; border:1px solid rgba(255,255,255,0.15); background:none; color:var(--text-muted); transition:0.2s;">project</button>
            <button onclick="showS7MemTab('reference')" id="s7-tab-reference"
              style="padding:4px 12px; font-size:12px; border-radius:5px; cursor:pointer; font-family:inherit; border:1px solid rgba(255,255,255,0.15); background:none; color:var(--text-muted); transition:0.2s;">reference</button>
            <span id="s7-mem-filename" style="font-size:11px; color:var(--text-dim); align-self:center; margin-left:4px; font-family:'JetBrains Mono',monospace;">user_profile.md</span>
          </div>
          <div id="s7-mem-user" style="background:#0d1117; border-radius:8px; padding:14px 16px; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.9; color:#c9d1d9;">
            <span style="color:#8b949e;">---</span><br>
            <span style="color:#79c0ff;">name</span><span style="color:#c9d1d9;">: User Profile</span><br>
            <span style="color:#79c0ff;">description</span><span style="color:#c9d1d9;">: 后端工程师，8年 TypeScript/Node.js，React 新手；前端解释用后端类比</span><br>
            <span style="color:#79c0ff;">type</span><span style="color:#c9d1d9;">: </span><span style="color:#ffa657;">user</span><br>
            <span style="color:#8b949e;">---</span><br>
            <br>
            用户是后端工程师，8 年以上 TypeScript / Node.js 经验，熟悉系统设计和 API 架构。<br>
            第一次接触本项目的 React 前端部分。<br>
            <br>
            在解释前端概念时，优先使用后端类比帮助理解，例如：<br>
            - React state ≈ 服务端 session 状态<br>
            - useEffect ≈ 事件监听器的注册/清理生命周期<br>
            - 组件 props ≈ 函数参数（不可变传入）
          </div>
          <div id="s7-mem-feedback" style="display:none; background:#0d1117; border-radius:8px; padding:14px 16px; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.9; color:#c9d1d9;">
            <span style="color:#8b949e;">---</span><br>
            <span style="color:#79c0ff;">name</span><span style="color:#c9d1d9;">: Integration Test Policy</span><br>
            <span style="color:#79c0ff;">description</span><span style="color:#c9d1d9;">: 集成测试必须用真实 PostgreSQL，禁止 mock DB；上季度 mock 导致生产事故</span><br>
            <span style="color:#79c0ff;">type</span><span style="color:#c9d1d9;">: </span><span style="color:#ffa657;">feedback</span><br>
            <span style="color:#8b949e;">---</span><br>
            <br>
            集成测试必须连接真实 PostgreSQL 实例，禁止使用 jest.mock 或任何内存 DB 替代。<br>
            <br>
            <span style="color:#d2a8ff;"><strong>Why:</strong></span> 上季度一次 mock 测试全部通过的 migration，在生产环境执行时因 schema 差异崩溃，<br>
            排查耗时 4 小时，影响了当天的发版。mock 的 schema 没有跟随真实 DB 演进。<br>
            <br>
            <span style="color:#d2a8ff;"><strong>How to apply:</strong></span> 编写或建议涉及 DB 操作的测试代码时，始终使用<br>
            <span style="color:#8b949e;">scripts/test-db-setup.sh</span> 启动测试数据库。如看到 mock DB 的写法，提示替换。
          </div>
          <div id="s7-mem-project" style="display:none; background:#0d1117; border-radius:8px; padding:14px 16px; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.9; color:#c9d1d9;">
            <span style="color:#8b949e;">---</span><br>
            <span style="color:#79c0ff;">name</span><span style="color:#c9d1d9;">: Auth Middleware Rewrite</span><br>
            <span style="color:#79c0ff;">description</span><span style="color:#c9d1d9;">: Auth 重写由合规要求（session token 存储）驱动，非技术债；截止 2026-04-30</span><br>
            <span style="color:#79c0ff;">type</span><span style="color:#c9d1d9;">: </span><span style="color:#ffa657;">project</span><br>
            <span style="color:#8b949e;">---</span><br>
            <br>
            Auth middleware 重写（PR #847）由法务/合规要求驱动，而非技术债清理。<br>
            <br>
            <span style="color:#d2a8ff;"><strong>Why:</strong></span> 法务部门标记当前实现将原始 session token 存入 Redis 且无过期时间，<br>
            不符合 2026-05-01 生效的 SOC 2 新要求。<br>
            <br>
            <span style="color:#d2a8ff;"><strong>How to apply:</strong></span> 范围决策优先满足合规，不要建议保留旧存储模式的"简化方案"。<br>
            截止日期 2026-04-30，不可延期。任何该模块的改动需先确认不破坏合规边界。
          </div>
          <div id="s7-mem-reference" style="display:none; background:#0d1117; border-radius:8px; padding:14px 16px; font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.9; color:#c9d1d9;">
            <span style="color:#8b949e;">---</span><br>
            <span style="color:#79c0ff;">name</span><span style="color:#c9d1d9;">: Infrastructure References</span><br>
            <span style="color:#79c0ff;">description</span><span style="color:#c9d1d9;">: Oncall 看板、Linear 项目、部署流水线和 Staging 环境 URL 速查</span><br>
            <span style="color:#79c0ff;">type</span><span style="color:#c9d1d9;">: </span><span style="color:#ffa657;">reference</span><br>
            <span style="color:#8b949e;">---</span><br>
            <br>
            - <span style="color:#7ee787;"><strong>Bug 追踪：</strong></span>Linear 项目 "BACKEND-CORE" 追踪所有后端服务 bug<br>
            - <span style="color:#7ee787;"><strong>Oncall 看板：</strong></span>grafana.internal/d/api-latency — p99 &gt; 500ms 触发告警<br>
            - <span style="color:#7ee787;"><strong>部署流水线：</strong></span>GitHub Actions <span style="color:#8b949e;">deploy.yml</span>，生产部署须 @platform-team 审批<br>
            - <span style="color:#7ee787;"><strong>Staging 环境：</strong></span>staging.internal:3000，每天 02:00 UTC 重置
          </div>
        </div>
        <div class="card-desc" style="margin-top: 16px;">
          <strong>双重截断保护流程：</strong>
        </div>
        <div class="mermaid anim" style="margin-top: 12px; background: transparent;">
flowchart LR
    A["读取 MEMORY.md 原始内容"] --> B{"行数 > 200?"}
    B -- 是 --> C["截取前 200 行"]
    B -- 否 --> D["保留原内容"]
    C --> E{"字节数 > 25KB?"}
    D --> E
    E -- 是 --> F["在最后换行符处截断至 25KB"]
    E -- 否 --> G["内容通过"]
    F --> H["追加 WARNING 提示行"]
    G --> I["注入系统 Prompt"]
    H --> I
        </div>
        <div class="card-desc" style="margin-top: 10px;">
          <span class="dim small">防御场景：曾观察到不足 200 行却达 197KB 的情况——少量超长行绕过行数检查，故增加字节上限。</span>
        </div>
      </div>

      <h3 class="anim" style="margin-top: 24px;">路径二：findRelevantMemories 动态选择</h3>
      <div class="flow-diagram anim" style="margin-top: 8px;">
        <div class="flow-node blue">
          <div class="flow-label">scanMemoryFiles</div>
          <div class="flow-desc">读取所有 topic 文件<br>的 frontmatter</div>
        </div>
        <div class="flow-arrow">&rarr;</div>
        <div class="flow-node">
          <div class="flow-label">formatManifest</div>
          <div class="flow-desc">生成 filename +<br>description 清单</div>
        </div>
        <div class="flow-arrow">&rarr;</div>
        <div class="flow-node purple">
          <div class="flow-label">sideQuery</div>
          <div class="flow-desc">Sonnet 选择器判断<br>哪些与 query 相关</div>
        </div>
        <div class="flow-arrow">&rarr;</div>
        <div class="flow-node green">
          <div class="flow-label">注入上下文</div>
          <div class="flow-desc">最多 5 个文件<br>读取正文后注入</div>
        </div>
      </div>
      <div class="card-grid cols-3 anim" style="margin-top: 16px;">
        <div class="card">
          <div class="card-label-tag text-accent mono">选择依据</div>
          <div class="card-desc">选择器模型<strong>只看</strong> filename + description，不读正文。description 写得越精确，召回越准。</div>
        </div>
        <div class="card">
          <div class="card-label-tag text-green mono">去重过滤</div>
          <div class="card-desc"><code>alreadySurfaced</code> 参数过滤前几轮已注入的文件，选择器专注于新候选，避免重复注入。</div>
        </div>
        <div class="card">
          <div class="card-label-tag text-purple mono">上限控制</div>
          <div class="card-desc">单次最多返回 5 个文件；扫描最多处理 200 个候选；不确定则不选——宁缺毋滥。</div>
        </div>
      </div>

      <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
        <button id="recall-diff-btn"
          onclick="(function(btn){
            var panel = document.getElementById('recall-diff-panel');
            var expanded = panel.style.display !== 'none';
            panel.style.display = expanded ? 'none' : 'block';
            btn.textContent = expanded ? '扩展：MEMORY.md 索引 vs 路径二——本质区别 ▸' : '收起 ▴';
          })(this)"
          style="background: none; border: 1px solid rgba(210,168,86,0.5); color: #d2a856; border-radius: 6px; padding: 5px 14px; font-size: 13px; cursor: pointer; font-family: inherit; transition: background 0.2s;"
          onmouseover="this.style.background='rgba(210,168,86,0.1)'"
          onmouseout="this.style.background='none'"
        >扩展：MEMORY.md 索引 vs 路径二——本质区别 ▸</button>
      </div>
      <div id="recall-diff-panel" style="display:none; margin-top: 12px; background: rgba(210,168,86,0.04); border: 1px solid rgba(210,168,86,0.2); border-radius: 10px; padding: 20px 22px;">

          <div style="margin-bottom: 16px;">
            <div class="card-label-tag" style="color:#d2a856; background: rgba(210,168,86,0.12); display:inline-block; margin-bottom: 12px;">本质区别</div>
            <table style="width:100%; border-collapse:collapse; font-size:13px;">
              <thead>
                <tr style="background: rgba(210,168,86,0.1);">
                  <th style="padding:8px 12px; text-align:left; border:1px solid rgba(210,168,86,0.25); color:#d2a856;">维度</th>
                  <th style="padding:8px 12px; text-align:left; border:1px solid rgba(210,168,86,0.25); color:#d2a856;">MEMORY.md</th>
                  <th style="padding:8px 12px; text-align:left; border:1px solid rgba(210,168,86,0.25); color:#d2a856;">路径二 frontmatter</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08); color:var(--dim);">读取时机</td>
                  <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08);">会话启动一次</td>
                  <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08);">每次用户输入后触发</td>
                </tr>
                <tr style="background:rgba(255,255,255,0.02);">
                  <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08); color:var(--dim);">内容来源</td>
                  <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08);">写入时手动/模型填的 hook</td>
                  <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08);">文件自身 frontmatter 的 description</td>
                </tr>
                <tr>
                  <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08); color:var(--dim);">包含字段</td>
                  <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08);">title + filename + hook</td>
                  <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08);">description + type + mtime</td>
                </tr>
                <tr style="background:rgba(255,255,255,0.02);">
                  <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08); color:var(--dim);">是否含新鲜度</td>
                  <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08); color:var(--dim);">否</td>
                  <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08); color:#56d364;">是（mtimeMs）</td>
                </tr>
                <tr>
                  <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08); color:var(--dim);">是否含类型</td>
                  <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08); color:var(--dim);">否</td>
                  <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08); color:#56d364;">是（user/feedback/project/reference）</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="margin-top: 18px; padding-top: 16px; border-top: 1px solid rgba(210,168,86,0.15);">
            <div class="card-label-tag" style="color:#d2a856; background: rgba(210,168,86,0.12); display:inline-block; margin-bottom: 10px;">索引的真实用途</div>
            <p style="font-size:13px; line-height:1.75; margin:0 0 10px;">MEMORY.md 索引注入系统 Prompt 的核心用途是<strong>给写入流程查重</strong>，而不是给 coding 流程使用。</p>
            <p style="font-size:13px; line-height:1.75; margin:0 0 10px;">当 <code>extractMemories</code> 运行时，系统把现有 MEMORY.md 内容传给提取 agent，提示词明确写道：</p>
            <div class="quote" style="font-size:12px; font-style:italic; margin: 8px 0 10px; border-left-color: rgba(210,168,86,0.5);">
              "Check this list before writing — update an existing file rather than creating a duplicate."
            </div>
            <p style="font-size:13px; line-height:1.75; margin:0;">对 coding 行为的直接影响<strong>几乎没有</strong>——每条 hook 不超过 150 字符，远不足以指导编码决策。真正影响 coding 行为的是 topic 文件的完整正文（路径二注入），其中才有 <strong>Why:</strong> 和 <strong>How to apply:</strong> 详细指导。</p>
          </div>

          <div style="margin-top: 18px; padding-top: 16px; border-top: 1px solid rgba(210,168,86,0.15);">
            <div class="card-label-tag" style="color:#a371f7; background: rgba(163,113,247,0.12); display:inline-block; margin-bottom: 10px;">有意思的设计张力</div>
            <p style="font-size:13px; line-height:1.75; margin:0 0 10px;">源码里有一个 feature flag <code>tengu_moth_copse</code>（<span class="dim">memdir.ts:422 / claudemd.ts:1145</span>）——开启后同时做两件事：</p>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px;">
              <div style="background:rgba(163,113,247,0.07); border:1px solid rgba(163,113,247,0.2); border-radius:8px; padding:12px 14px; font-size:12px; line-height:1.7;">
                <div style="color:#a371f7; font-weight:600; margin-bottom:4px;">① 跳过注入</div>
                不再把 MEMORY.md 内容注入系统 Prompt
              </div>
              <div style="background:rgba(163,113,247,0.07); border:1px solid rgba(163,113,247,0.2); border-radius:8px; padding:12px 14px; font-size:12px; line-height:1.7;">
                <div style="color:#a371f7; font-weight:600; margin-bottom:4px;">② 跳过写入</div>
                写入流程也不再维护 MEMORY.md，只写 topic 文件
              </div>
            </div>
            <div class="quote" style="margin-top:12px; font-style:normal; font-size:12px; border-left-color: rgba(163,113,247,0.5);">
              与其把索引塞进固定上下文（消耗 token），不如让动态召回完全替代它的功能。
            </div>
          </div>

        </div>
    `,
    notes: `
      <p>前面讲了记忆怎么写入，这一页解决"写入之后怎么用"。记忆积累到几十上百条后，不可能全部塞进上下文窗口，所以需要选择机制。</p>
      <p>系统提供两条召回路径：</p>
      <p><strong>路径一是 MEMORY.md 静态索引。</strong>每次会话启动时，MEMORY.md 的内容直接注入系统 Prompt。这是"被动召回"——Claude 在理解用户意图时自然参考，不需要特别触发。关键约束是双重截断：先 200 行，再 25KB。字节截断是后来加的，因为实测中发现有用户的 MEMORY.md 不到 200 行但达到了 197KB——少量超长行绕过了行数检查。</p>
      <p><strong>路径二是 findRelevantMemories 动态选择。</strong>这是"主动召回"——当用户输入新 query 时，系统在后台用一个轻量的 Sonnet 模型做 sideQuery，从所有 topic 文件中选出最多 5 个与当前 query 相关的记忆，读取正文后注入上下文。</p>
      <p>选择器的判断依据只有 filename 和 description，不读正文。这就是为什么前面说 frontmatter 的 description 字段至关重要——它是召回的唯一线索。</p>
      <p>去重机制也值得一提：alreadySurfaced 参数记录了前几轮已经注入过的文件路径，选择器不会重复选择。这避免了多轮对话中同一条记忆被反复注入。</p>
      <p>另外还有一个实验性的非阻塞预取模式（tengu_moth_copse flag），在 skipIndex 实验中替代 MEMORY.md 的静态注入，但这属于实验细节，汇报时可以略过。</p>
    `
  },

  // ── Slide 8: 记忆新鲜度——把时间问题变成数据问题 ──
  {
    html: `
      <h2 class="anim"><span class="icon">06</span> 记忆新鲜度：把时间问题变成数据问题</h2>
      <p class="anim">召回的记忆可能包含过时的代码引用（如 <code>file:line</code>），系统通过<strong>新鲜度机制</strong>将"时间是否过期"转化为"数据是否可信"：</p>

      <div class="card anim" style="margin-top: 16px;">
        <div class="card-label-tag text-accent mono">memoryAge.ts</div>
        <div class="card-title" style="margin-top: 8px;">三层时间感知</div>
        <div class="card-grid cols-3" style="margin-top: 12px;">
          <div class="card" style="border: 1px solid var(--border); padding: 14px;">
            <div class="card-title text-accent">today <span style="font-size:11px;color:var(--dim);">d=0</span></div>
            <div class="card-desc">当天创建，无附加提示</div>
          </div>
          <div class="card" style="border: 1px solid var(--border); padding: 14px;">
            <div class="card-title text-accent">yesterday <span style="font-size:11px;color:var(--dim);">d=1</span></div>
            <div class="card-desc">昨天创建，<strong>同样无警告</strong><br><span class="dim small">d ≤ 1 均返回空字符串</span></div>
          </div>
          <div class="card" style="border: 1px solid var(--border); padding: 14px;">
            <div class="card-title text-red">N days ago <span style="font-size:11px;color:var(--dim);">d≥2</span></div>
            <div class="card-desc"><strong>≥ 2 天</strong>才携带显式过期警告</div>
          </div>
        </div>
      </div>

      <div class="quote anim" style="margin-top: 20px; font-style: normal; border-left-color: var(--orange);">
        <strong style="color: var(--text-primary);">关键洞察：</strong><br>
        "The memory says X exists" is not the same as "X exists now."
      </div>

      <div class="code-block anim" style="margin-top: 16px; font-size: 13px;">
        <span class="cm">// d ≥ 2（距今 2 天及以上）的记忆随附的 system-reminder</span><br>
        This memory is <span class="num">N</span> days old. Memories are point-in-time observations,<br>
        not live state — claims about code behavior or <span class="str">file:line</span> citations may be outdated.<br>
        <strong>Verify against current code before asserting as fact.</strong>
      </div>

      <div class="highlight-box orange anim" style="margin-top: 16px;">
        <strong>设计动机：</strong>用户反馈显示，合规写入的记忆中若含有具体路径或脚本引用，时间一长可能失效，但结构化的记忆格式反而让断言听起来更权威。通过显式过期提示，系统 Prompt 要求模型<strong>在断言前先验证当前状态</strong>（"Verify against current code before asserting as fact"），而非直接引用记忆。
      </div>
    `,
    notes: `
      <p>召回记忆之后还有一个问题：记忆可能过时。</p>
      <p>比如某条 feedback 记忆写的是"不要 mock 数据库，见 scripts/test-db-setup.sh"，如果这个脚本路径后来被迁移了，记忆里的路径就错了。更糟糕的是，因为记忆是结构化的、有具体引用，Claude 说出这些内容时听起来更权威，用户更容易盲信。</p>
      <p>注意：file:line 级别的代码引用（如"src/auth/index.ts 第 42 行"）按规范本就不应被存入记忆——这类内容属于 WHAT_NOT_TO_SAVE 明确排除的对象。新鲜度机制针对的是那些合规写入的记忆（用户偏好、项目决策等）中偶尔包含的具体路径引用。</p>
      <p>memoryAge.ts 模块把"时间"变成了"数据质量标签"。超过 1 天的记忆在注入上下文时，会附带一段 system-reminder，明确告诉 Claude：这是 N 天前的观察，不是实时状态，先验证再断言。</p>
      <p>关键提示语是："The memory says X exists is not the same as X exists now." 这句话直接写在系统 Prompt 的 TRUSTING_RECALL_SECTION 中。</p>
      <p>这个设计把"时间是否过期"这个难以判断的问题，转化为了"数据是否可信"这个可以明确提示的问题。源码的指令是"Verify against current code before asserting as fact"——系统 Prompt 要求模型在断言前先验证当前状态，而非直接引用记忆内容，但并未指定具体使用哪种工具。</p>
    `
  },

  // ── Slide 9: 安全设计 ──
  {
    html: `
      <h2 class="anim"><span class="icon">07</span> 安全设计</h2>
      <p class="anim">所有后台记忆 agent（extractMemories、AutoDream）共享同一套权限沙箱，确保只能操作记忆目录内的文件：</p>

      <div class="table-wrap anim" style="margin-top: 16px;">
        <table>
          <thead>
            <tr><th>工具</th><th>权限</th><th>约束条件</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>FileRead</code> / <code>Grep</code> / <code>Glob</code></td>
              <td><span class="text-green">允许</span></td>
              <td>只读，无限制</td>
            </tr>
            <tr>
              <td><code>Bash</code></td>
              <td><span class="text-green">有条件允许</span></td>
              <td>必须通过 <code>isReadOnly()</code> 检查（ls/find/cat/stat 等）</td>
            </tr>
            <tr>
              <td><code>FileEdit</code> / <code>FileWrite</code></td>
              <td><span class="text-green">有条件允许</span></td>
              <td>路径必须在 <code>autoMemPath</code> 内（<code>isAutoMemPath()</code> 验证）</td>
            </tr>
            <tr>
              <td><code>REPL</code></td>
              <td><span class="text-green">允许（外壳）</span></td>
              <td>内部原子工具仍经过同一沙箱检查</td>
            </tr>
            <tr>
              <td>其他所有工具</td>
              <td><span class="text-red">拒绝</span></td>
              <td>包括 Agent、TodoWrite、Web、写入型 Bash 等</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="anim" style="margin-top: 24px;">路径安全：双重校验防御符号链接逃逸</h3>
      <div class="card anim" style="margin-top: 8px;">
        <div class="card-desc">
          团队记忆目录的写入经过<strong>两轮路径校验</strong>（<code>validateTeamMemWritePath()</code> / <code>validateTeamMemKey()</code>）：
        </div>
        <div class="gate-steps" style="margin-top: 12px;">
          <div class="gate-step">
            <div class="step-num">1</div>
            <div class="step-content">
              <div class="step-title">字符串层面校验</div>
              <div class="step-desc"><code>path.resolve()</code> 消除 <code>..</code> 段，确认路径在 teamDir 内</div>
            </div>
          </div>
          <div class="gate-step">
            <div class="step-num">2</div>
            <div class="step-content">
              <div class="step-title">真实路径解析</div>
              <div class="step-desc"><code>realpathDeepestExisting()</code> 解析符号链接，确认最终位置在 teamDir 内</div>
            </div>
          </div>
        </div>
        <div class="highlight-box red anim" style="margin-top: 12px;">
          <strong>防御场景（PSR M22186）：</strong>攻击者在 team 目录内放置指向 <code>~/.ssh/authorized_keys</code> 的符号链接。仅靠 <code>path.resolve()</code> 无法检测，必须用 <code>realpath</code> 解析链接目标后再验证。
        </div>
      </div>

      <div class="highlight-box blue anim" style="margin-top: 16px;">
        <strong>遥测：</strong>每次工具被拒绝时触发 <code>tengu_auto_mem_tool_denied</code> 事件（携带脱敏工具名），为 Anthropic 收集"记忆 agent 在真实场景下需要哪些工具"的观测数据。
      </div>
    `,
    notes: `
      <p>Memory 系统的最后一页是安全设计。因为后台 agent（extractMemories 和 AutoDream）可以自动读写文件，必须严格限制其权限边界。</p>
      <p>权限沙箱由 createAutoMemCanUseTool(memoryDir) 统一提供。表格中值得注意的几点：</p>
      <p>Bash 被允许，但仅限于只读命令（通过 isReadOnly() 检查）。FileEdit/FileWrite 则必须写入 autoMemPath 目录内，由 isAutoMemPath() 验证。</p>
      <p>REPL 也被允许，但这只是外壳——在 ant 原生构建中，原子工具被隐藏，agent 通过 REPL 调用它们；真正的安全检查在原子工具层。如果为了 AutoDream 单独裁剪工具列表，会破坏 prompt cache 共享（工具列表是 cache key 的一部分）。</p>
      <p>团队记忆有额外的路径安全：两轮校验。第一轮用 path.resolve() 消除 .. 段，第二轮用 realpathDeepestExisting() 解析符号链接。这是为了防御 PSR M22186 漏洞——攻击者如果在 team 目录内放一个指向 ~/.ssh/authorized_keys 的符号链接，仅靠字符串检查无法检测。</p>
      <p>最后，所有工具拒绝都会触发遥测事件，帮助 Anthropic 了解记忆 agent 在真实场景下尝试使用哪些工具，用于后续优化。</p>
    `
  },

  // ── Slide 10: 对比主流记忆系统 ──
  {
    html: `
      <h2 class="anim"><span class="icon">08</span> 对比：CC vs 主流记忆系统</h2>
      <p class="anim small">为什么 CC 的记忆系统可以真正落地？</p>

      <div class="table-wrap anim" style="margin-top: 12px;">
        <table>
          <thead>
            <tr>
              <th>维度</th>
              <th style="color: var(--accent);">Claude Code</th>
              <th style="color: var(--orange);">Mem0</th>
              <th style="color: var(--purple);">LangChain Memory</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>存储介质</strong></td>
              <td>本地 Markdown 文件</td>
              <td>Vector DB + JSON（Qdrant / Pinecone）</td>
              <td>内存 / 外部 Store（依实现而定）</td>
            </tr>
            <tr>
              <td><strong>检索方式</strong></td>
              <td>LLM sideQuery 语义判断（最多 5 条）</td>
              <td>向量余弦相似度搜索</td>
              <td>摘要压缩 / 向量检索 / 实体抽取</td>
            </tr>
            <tr>
              <td><strong>外部依赖</strong></td>
              <td class="text-green"><strong>无</strong>（纯文件系统）</td>
              <td>Embedding API + Vector DB</td>
              <td>LLM API + 可选 Vector Store</td>
            </tr>
            <tr>
              <td><strong>记忆可读性</strong></td>
              <td class="text-green"><strong>完全透明</strong>（用户可直接编辑）</td>
              <td>向量不可读，黑盒</td>
              <td>摘要可读，但无结构化分类</td>
            </tr>
            <tr>
              <td><strong>写入成本</strong></td>
              <td>extractMemories（轻量）/ AutoDream（低频 + Cache 复用）</td>
              <td>每次写入触发 Embedding 调用</td>
              <td>ConversationSummary 每轮触发 LLM</td>
            </tr>
            <tr>
              <td><strong>上下文窗口感知</strong></td>
              <td class="text-green"><strong>专项设计</strong>（200行/25KB 截断保护）</td>
              <td>依赖检索 topK，无硬约束</td>
              <td>依赖摘要压缩，无精确限制</td>
            </tr>
            <tr>
              <td><strong>记忆边界约束</strong></td>
              <td>四类分类 + 明确排除清单（不存可推导事实）</td>
              <td>无强约束，容易存入冗余技术事实</td>
              <td>无分类，偏向会话历史压缩</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card-grid cols-3 anim" style="margin-top: 12px;">
        <div class="highlight-box green" style="margin: 0;">
          <strong>零基础设施</strong><br>
          <span class="small">不依赖 Vector DB / Embedding API，本地文件即可运行，无额外部署成本</span>
        </div>
        <div class="highlight-box blue" style="margin: 0;">
          <strong>透明可纠正</strong><br>
          <span class="small">记忆是可读的 Markdown，用户能检查、修正、删除；向量黑盒做不到这一点</span>
        </div>
        <div class="highlight-box orange" style="margin: 0;">
          <strong>成本-质量解耦</strong><br>
          <span class="small">增量写入（轻量实时）+ 周期整合（低频高质），不用在速度和准确性之间取舍</span>
        </div>
      </div>
    `,
    notes: `
      <p><strong>为什么要做这个对比？</strong>Mem0 和 LangChain 是目前最主流的 AI 记忆框架，但它们都面临真实落地的障碍。对比有助于理解 CC 的设计选择是刻意的工程决策，而不是"没做向量化"的缺陷。</p>

      <p><strong>零基础设施依赖：</strong>Mem0 要求部署 Qdrant 或接入 Pinecone，还需要调用 Embedding API（如 OpenAI text-embedding-3-small）。LangChain 的 VectorStoreRetrieverMemory 同样需要外部向量库。CC 的记忆完全是本地 Markdown 文件，任何有文件系统的环境都能直接运行，这是它能嵌入 CLI 工具的关键。</p>

      <p><strong>透明可纠正：</strong>向量数据库中存储的是高维浮点向量，用户根本无法知道里面记住了什么、记错了什么。CC 的记忆是 Markdown，用户可以直接 cat、vim、删除——这是工具信任度的基础。对于编程助手场景，"我能看见和控制它记住了什么"比"它记忆更准"更重要。</p>

      <p><strong>检索方式的差异：</strong>向量相似度搜索基于统计相关性；CC 的 findRelevantMemories 用一个 sideQuery 让 LLM 自己判断哪些记忆与当前问题相关——这是语义理解而非统计相似度，对长尾的专业判断更准确。</p>

      <p><strong>上下文窗口感知：</strong>Mem0 和 LangChain 的设计出发点是"尽量检索更多相关记忆"，没有对 LLM 上下文窗口的感知。CC 则专门设计了硬截断（200行/25KB）和最多 5 条动态召回的上限，确保记忆不会挤占过多上下文。</p>

      <p><strong>记忆边界约束：</strong>CC 明确规定不存什么（代码结构、git历史、调试方案），存"人类判断"而非"机器可推导事实"。这防止了记忆膨胀——Mem0 没有这类约束，在代码助手场景下很容易存入大量冗余的技术信息，反而降低检索质量。</p>

      <p><strong>成本-质量解耦：</strong>LangChain 的 ConversationSummaryMemory 每轮对话结束都触发一次 LLM 调用生成摘要，成本高且很多轮次没有值得摘要的内容。CC 的 extractMemories 是轻量增量写入，AutoDream 是低频深度整合（≥24h + ≥5 sessions 才触发），而且 AutoDream 通过 Prompt Cache 复用使整合成本接近零。</p>
    `
  },

  // ── Slide 11: Part 1 总结 — 记忆系统全流程 ──
  {
    html: `
      <h2 class="anim"><span class="icon">08</span> Part 1 总结：记忆系统全流程</h2>
      <div class="mermaid anim" style="margin-top: 8px;">
flowchart TB
    subgraph Init["会话启动阶段"]
        A[loadMemoryPrompt] --> B[注入 MEMORY.md<br/>截断至 200行/25KB]
    end

    subgraph Runtime["对话运行阶段"]
        D[用户输入] --> E{findRelevantMemories<br/>动态召回}
        E -->|扫描 topic 文件<br/>sideQuery 选择器| F[最多 5 个相关记忆]
        F --> G[附加新鲜度标记<br/>N days old?]
        G --> H[注入上下文]
        H --> I[Claude 生成回复]
    end

    subgraph EndOfTurn["每轮结束 — stopHooks"]
        I --> J[触发 executeExtractMemories]
        J --> K[forked agent 增量写入<br/>2-4 turn 完成]
        I --> L[触发 executeAutoDream]
        L --> M{门控检查<br/>≥24h & ≥5 sessions?}
        M -->|通过| N[forked agent 周期整理<br/>合并/去重/修正]
        M -->|未通过| O[静默跳过]
    end

    subgraph Storage["存储层"]
        P[(MEMORY.md<br/>索引文件)]
        Q[(topic 文件<br/>user/feedback/project/reference)]
    end

    P --> B
    K --> Q
    K --> P
    N --> P
    N --> Q
    Q --> E

    style Init fill:#1c2333,stroke:#58a6ff,stroke-width:2px
    style Runtime fill:#1c2333,stroke:#3fb950,stroke-width:2px
    style EndOfTurn fill:#1c2333,stroke:#d29922,stroke-width:2px
    style Storage fill:#1c2333,stroke:#bc8cff,stroke-width:2px
      </div>

      <div class="card-grid cols-4 anim" style="margin-top: 16px;">
        <div class="card" style="border-top: 2px solid var(--accent);">
          <div class="card-title text-accent">注入</div>
          <div class="card-desc small">MEMORY.md 静态索引<br/>系统 Prompt 常驻上下文</div>
        </div>
        <div class="card" style="border-top: 2px solid var(--green);">
          <div class="card-title text-green">召回</div>
          <div class="card-desc small">findRelevantMemories<br/>动态选择最多 5 个</div>
        </div>
        <div class="card" style="border-top: 2px solid var(--orange);">
          <div class="card-title text-orange">写入</div>
          <div class="card-desc small">extractMemories 增量<br/>AutoDream 周期整理</div>
        </div>
        <div class="card" style="border-top: 2px solid var(--purple);">
          <div class="card-title text-purple">安全</div>
          <div class="card-desc small">createAutoMemCanUseTool<br/>路径校验 + 权限沙箱</div>
        </div>
      </div>

      <div class="highlight-box blue anim" style="margin-top: 16px;">
        <strong>核心设计：</strong>静态索引（被动召回）+ 动态选择（主动召回）+ 双流水线写入（增量 + 周期）+ 权限沙箱，共同构成完整的记忆系统闭环。
      </div>
    `,
    notes: `
      <p>这是 Part 1 的总结页，用一张完整的流程图串联前面讲过的所有内容。</p>
      <p>流程图分为四个泳道：会话启动、对话运行、每轮结束、存储层。</p>
      <p><strong>会话启动阶段：</strong>loadMemoryPrompt 先根据当前模式（TEAMMEM/普通）选择不同的构建路径，再把对应的 MEMORY.md 注入系统 Prompt，双重截断保护。</p>
      <p><strong>对话运行阶段：</strong>用户每次输入后，findRelevantMemories 会扫描所有 topic 文件，用 Sonnet 选择器判断哪些与当前 query 相关，最多选 5 个，附加新鲜度标记后注入上下文。Claude 结合这些记忆生成回复。</p>
      <p><strong>每轮结束阶段：</strong>stopHooks 同时触发两条流水线。extractMemories 做增量写入，只看当轮对话，2-4 个 turn 完成。AutoDream 做周期整理，有严格的门控（≥24h & ≥5 sessions），通过后进行深度整合。</p>
      <p><strong>存储层：</strong>MEMORY.md 是索引，topic 文件是正文。extractMemories 每次增量写入都是两步：先写 topic 文件，再同步更新 MEMORY.md 索引。AutoDream 同理，.consolidate-lock 是 AutoDream 专属的竞争锁，在 Part 2 展开讲。</p>
      <p>四张卡片在底部总结四大机制：注入、召回、写入、安全。接下来进入 Part 2，深入 AutoDream 的实现细节。</p>
    `
  },

  // ── Slide 11: 章节封面 — AutoDream ──
  {
    className: 'section-slide',
    html: `
      <div class="section-number anim" style="color: var(--green);">02</div>
      <h2 class="anim">AutoDream</h2>
      <p class="section-desc anim">后台记忆整合系统<br>在时间和会话数量达标后，自动 fork 子 agent 对长期记忆进行反思与整合</p>
      <div class="tag-row anim" style="margin-top: 20px;">
        <span class="tag green">consolidation</span>
        <span class="tag blue">forked agent</span>
        <span class="tag purple">background</span>
      </div>
    `,
    notes: `
      <p><strong>过渡：</strong>现在进入第二部分——AutoDream。</p>
      <p>AutoDream 是 Claude Code 的后台记忆整合系统。与 extractMemories 的"增量写入"不同，它的职责是"周期整理"——在满足时间和会话数量双重条件后，自动 fork 一个子 agent，对积累的记忆文件执行四阶段的"反思与整合"操作。</p>
      <p>Part 2 将详细拆解 AutoDream 的五重门控、单文件锁机制、四阶段整合提示词，以及它如何通过 Prompt Cache 复用将整合成本压缩至接近零。</p>
    `
  },

  // ── Slide 12: 功能定位与设计动机 ──
  {
    html: `
      <h2 class="anim"><span class="icon">09</span> 功能定位与设计动机</h2>

      <div class="quote anim" style="font-style: normal; border-left-color: var(--green);">
        <strong style="color: var(--text-primary);">是什么：</strong><br>
        Background memory consolidation. Fires the /dream prompt as a forked subagent when time-gate passes AND enough sessions have accumulated.
      </div>

      <h3 class="anim" style="margin-top: 24px;">解决什么问题</h3>
      <p class="anim">extractMemories 在每轮对话后实时提取记忆，产生两个长期问题：</p>

      <div class="card-grid cols-2 anim" style="margin-top: 12px;">
        <div class="card" style="border-left: 3px solid var(--orange);">
          <div class="card-title text-orange">记忆碎片化</div>
          <div class="card-desc">
            多个会话写入的记忆可能重复、矛盾或表达不一致。例如：用户在 session 1 说"不用 mock"，session 5 又说"测试用真实 DB"——实际上说的是同一件事，但记忆文件变成两条。
          </div>
        </div>
        <div class="card" style="border-left: 3px solid var(--red);">
          <div class="card-title text-red">索引膨胀</div>
          <div class="card-desc">
            MEMORY.md（入口索引）随时间膨胀，可能超出上下文窗口限制。虽然有 200 行截断，但截断意味着丢失信息，而非解决问题。
          </div>
        </div>
      </div>

      <h3 class="anim" style="margin-top: 24px;">与 extractMemories 的互补关系</h3>
      <div class="table-wrap anim" style="margin-top: 12px;">
        <table>
          <thead>
            <tr><th>维度</th><th>extractMemories</th><th>AutoDream</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>触发频率</strong></td>
              <td>每轮对话结束（高频）</td>
              <td>每 24h + 5 sessions（低频）</td>
            </tr>
            <tr>
              <td><strong>职责</strong></td>
              <td>从当轮对话提取新记忆</td>
              <td>整合 / 修剪 / 修正已有记忆</td>
            </tr>
            <tr>
              <td><strong>写入内容</strong></td>
              <td>新增或更新 topic 文件，同步写入 MEMORY.md 索引</td>
              <td>合并、删除、修正已有文件</td>
            </tr>
            <tr>
              <td><strong>类比</strong></td>
              <td>实时笔记</td>
              <td>定期整理笔记本</td>
            </tr>
          </tbody>
        </table>
      </div>

    `,
    notes: `
      <p><strong>功能定位：</strong>AutoDream 的核心职责是"整合"而非"新增"。它不负责从对话中提取新记忆，而是负责把零散积累的记忆合并、修正、去重，维护记忆系统的长期健康。</p>
      <p><strong>解决的两个问题：</strong></p>
      <p>1. <strong>记忆碎片化</strong>——用户在不同会话中表达的同一偏好，可能被记录成多条略有不同的记忆。例如"不要用 mock"和"测试用真实数据库"实际上是同一个偏好的不同表述。</p>
      <p>2. <strong>索引膨胀</strong>——MEMORY.md 有 200 行上限，超过后被截断。这意味着老记忆会"消失"（对模型不可见），但实际上 topic 文件还在磁盘里。AutoDream 通过合并和修剪，确保索引始终精简有效。</p>
      <p><strong>与 extractMemories 的互补：</strong>对比表格总结了两者在触发频率、职责、写入内容上的差异。extractMemories 是"不漏"，AutoDream 是"不乱"。两者共享同一个权限沙箱（createAutoMemCanUseTool）。</p>
    `
  },

  // ── Slide 15: 触发门控系统 ──
  {
    html: `
      <h2 class="anim"><span class="icon">12</span> 触发门控系统</h2>
      <p class="anim">门控检查按<strong>成本从低到高</strong>排列，任何一关不通立即返回，不进入后续昂贵操作：</p>

      <div class="mermaid anim" style="margin-top: 16px;">
flowchart LR
    A[executeAutoDream] --> B{isGateOpen?}
    B -- 未通过 --> Z[跳过]
    B -- 通过 --> C[readLastConsolidatedAt]
    C --> D{hours >= 24h?}
    D -- 否 --> Z
    D -- 是 --> E{扫描节流}
    E -- 命中 --> Z
    E -- 通过 --> F[扫描 sessions]
    F --> G{count >= 5?}
    G -- 否 --> Z
    G -- 是 --> H[获取 lock]
    H -- 失败 --> Z
    H -- 成功 --> I[执行]

    style Z fill:#1c2333,stroke:#6e7681,stroke-dasharray: 5 5
    style I fill:#1c2333,stroke:#3fb950,stroke-width:2px
      </div>

      <div class="card-grid cols-3 anim" style="margin-top: 16px;">
        <div class="card" style="border-top: 2px solid var(--accent);">
          <div class="card-title text-accent">总开关</div>
          <div class="card-desc small">助理模式（长驻会话）跳过<br/>Remote 模式跳过<br/>autoMemory 未开启跳过</div>
        </div>
        <div class="card" style="border-top: 2px solid var(--orange);">
          <div class="card-title text-orange">时间与节流</div>
          <div class="card-desc small">≥24h 才触发<br/>10min 扫描节流<br/>防高频空转</div>
        </div>
        <div class="card" style="border-top: 2px solid var(--purple);">
          <div class="card-title text-purple">Session 与锁</div>
          <div class="card-desc small">≥5 个新 session<br/>竞争锁获取<br/>PID 回读验证</div>
        </div>
      </div>

      <div class="highlight-box green anim" style="margin-top: 16px;">
        <strong>设计原则：</strong>绝大多数轮次只花费最低成本（一次内存读取 + 一次 stat）就退出。只有门控全部通过时才进行昂贵的目录扫描和 fork。
      </div>
    `,
    notes: `
      <p><strong>门控设计原则：</strong>廉价优先。任何一关不通过就立即返回，避免不必要的开销。</p>
      <p><strong>五级门控详解：</strong></p>
      <p>1. <strong>isGateOpen</strong>——总开关。检查是否为长驻助理模式（有自己的整合机制）、Remote 模式、autoMemory 开关、autoDream 开关。任意一个条件不满足直接返回。</p>
      <p>2. <strong>时间门控</strong>——距上次整合是否超过 minHours（默认 24h）。成本仅为一次 fs.stat() 读取 mtime。</p>
      <p>3. <strong>扫描节流</strong>——10 分钟内的重复检查直接跳过。防止"时间门已过但 session 数不够"导致的高频空转。</p>
      <p>4. <strong>Session 门控</strong>——mtime 晚于上次整合的 session 数量是否达到 minSessions（默认 5 个）。这里需要扫描目录，成本较高。</p>
      <p>5. <strong>竞争锁</strong>——尝试获取 .consolidate-lock 文件。如果已被其他进程占用，本轮放弃。</p>
      <p><strong>性能效果：</strong>常规路径（未触发）成本极低：一次内存读取（GrowthBook 缓存）+ 一次 stat（约 1ms）。只在真正需要触发时才进行目录扫描和 fork。</p>
    `
  },

  // ── Slide 17: Phase 1-2 读取阶段 — Orient + Gather ──
  {
    html: `
      <h2 class="anim"><span class="icon">14</span> Phase 1-2：读取阶段 — Orient + Gather</h2>
      <p class="anim small">前两个阶段专注于<strong>理解现状</strong>和<strong>收集信号</strong>，不做任何写入：</p>

      <div class="card-grid cols-2 anim" style="margin-top: 10px;">
        <div class="card" style="border-left: 3px solid var(--accent); padding: 14px;">
          <div class="card-label-tag text-accent mono">Phase 1 — Orient（定向）</div>
          <div class="card-desc small" style="margin-top: 8px;">
            · <code>ls</code> memory 目录，了解整体结构<br>
            · 读取 <code>MEMORY.md</code>，掌握当前索引<br>
            · 浏览已有 topic 文件，<strong>避免创建重复</strong><br>
            · 检查 <code>logs/</code> 或 <code>sessions/</code> 子目录
          </div>
          <div class="code-block small" style="margin-top: 8px; padding: 6px 10px; font-size: 11px; color: var(--accent);">
            "Skim existing topic files so you<br>
            <strong>improve them</strong> rather than creating duplicates"
          </div>
        </div>
        <div class="card" style="border-left: 3px solid var(--green); padding: 14px;">
          <div class="card-label-tag text-green mono">Phase 2 — Gather（采集）</div>
          <div class="card-desc small" style="margin-top: 8px;">
            按成本从低到高的<strong>两层信号源</strong>：<br><br>
            <span class="text-accent">①</span> <strong>漂移检测</strong> — 读取已有 topic 文件，对比当前代码现实，<br>
            &nbsp;&nbsp;&nbsp;&nbsp;找出内容已失效的旧记忆（如路径变更、决策反转）<br><br>
            <span class="text-orange">②</span> <strong>Transcript 搜索</strong> — 当怀疑某件具体事情发生过，<br>
            &nbsp;&nbsp;&nbsp;&nbsp;对 <code>.jsonl</code> 会话记录做窄关键词 grep，按需触发
          </div>
          <div class="code-block small" style="margin-top: 8px; padding: 6px 10px; font-size: 11px; color: var(--orange);">
            "Don't exhaustively read transcripts.<br>
            Look only for things you already suspect matter."
          </div>
        </div>
      </div>

      <div class="highlight-box blue anim" style="margin-top: 10px;">
        <strong>成本控制设计：</strong>漂移检测优先（读现有文件，成本低），Transcript 搜索兜底（大文件 grep，成本高，严格按需）。两层信号源共同构成 agent 在 Phase 3 写入前的判断依据——<strong>AutoDream 是整合器，不是全量索引器</strong>。
      </div>

      <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
        <button id="orient-design-btn"
          onclick="(function(btn){
            var panel = document.getElementById('orient-design-panel');
            var expanded = panel.style.display !== 'none';
            panel.style.display = expanded ? 'none' : 'block';
            btn.textContent = expanded ? '扩展：为什么 Orient 不用固定脚本预注入？▸' : '收起 ▴';
          })(this)"
          style="background: none; border: 1px solid rgba(86,211,100,0.5); color: #56d364; border-radius: 6px; padding: 5px 14px; font-size: 13px; cursor: pointer; font-family: inherit; transition: background 0.2s;"
          onmouseover="this.style.background='rgba(86,211,100,0.08)'"
          onmouseout="this.style.background='none'"
        >扩展：为什么 Orient 不用固定脚本预注入？▸</button>
      </div>
      <div id="orient-design-panel" style="display:none; margin-top: 12px; background: rgba(86,211,100,0.03); border: 1px solid rgba(86,211,100,0.2); border-radius: 10px; padding: 20px 22px;">

        <div style="margin-bottom: 18px;">
          <div class="card-label-tag" style="color:#56d364; background:rgba(86,211,100,0.1); display:inline-block; margin-bottom:10px;">原因一：Prompt Cache 复用（最关键）</div>
          <p style="font-size:13px; line-height:1.75; margin:0 0 10px;">AutoDream fork 时调用 <code>createCacheSafeParams(context)</code>，直接复用主会话的 system prompt（原封不动传入），Anthropic 服务器端直接命中缓存。这是 AutoDream 整合成本接近零的根本原因。</p>
          <div class="quote" style="font-size:12px; font-style:normal; border-left-color: rgba(86,211,100,0.5); margin: 10px 0;">
            如果把 Orient 的结果（<code>ls</code> 输出、MEMORY.md 内容、topic 文件列表）预先注入到 prompt 里，prompt 就变成动态的——每次运行内容不同，缓存必然 miss，整合成本会大幅上升。
          </div>
        </div>

        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(86,211,100,0.15); margin-bottom: 18px;">
          <div class="card-label-tag" style="color:#56d364; background:rgba(86,211,100,0.1); display:inline-block; margin-bottom:10px;">原因二：agent 的判断能力比固定脚本更有价值</div>
          <p style="font-size:13px; line-height:1.75; margin:0 0 10px;"><code>buildConsolidationPrompt</code> 构建的是静态模板，不包含任何预读内容。Orient 阶段的核心指令是：</p>
          <div class="code-block" style="font-size:12px; padding: 10px 14px; margin: 8px 0 10px;">
            <span style="color:var(--dim);">- ls the memory directory</span><br>
            <span style="color:var(--dim);">- Read MEMORY.md</span><br>
            <span style="color:var(--accent);">- <strong>Skim</strong> existing topic files so you improve them rather than creating duplicates</span>
          </div>
          <p style="font-size:13px; line-height:1.75; margin:0;">关键词是 <strong>skim</strong>（略读）——agent 根据文件名和大小自己决定读多少。3 个 topic 文件全读，80 个只读相关的。固定脚本必须全量执行，agent 可以选择性跳过，反而更省。</p>
        </div>

        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(86,211,100,0.15);">
          <div class="card-label-tag" style="color:#56d364; background:rgba(86,211,100,0.1); display:inline-block; margin-bottom:12px;">对比总结</div>
          <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <thead>
              <tr style="background:rgba(86,211,100,0.08);">
                <th style="padding:8px 12px; text-align:left; border:1px solid rgba(86,211,100,0.2); color:#56d364;"></th>
                <th style="padding:8px 12px; text-align:left; border:1px solid rgba(86,211,100,0.2); color:#56d364;">固定脚本预注入</th>
                <th style="padding:8px 12px; text-align:left; border:1px solid rgba(86,211,100,0.2); color:#56d364;">agent 自主执行</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08); color:var(--dim);">Prompt Cache</td>
                <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08); color:var(--text-red);">必然 miss（内容每次不同）</td>
                <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08); color:#56d364;">完全命中（prompt 是静态模板）</td>
              </tr>
              <tr style="background:rgba(255,255,255,0.02);">
                <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08); color:var(--dim);">读取范围</td>
                <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08); color:var(--text-red);">全量执行，无法跳过</td>
                <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08); color:#56d364;">按需 skim，智能取舍</td>
              </tr>
              <tr>
                <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08); color:var(--dim);">成本</td>
                <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08); color:var(--text-red);">高（cache miss + 全量读）</td>
                <td style="padding:7px 12px; border:1px solid rgba(255,255,255,0.08); color:#56d364;">接近零（cache hit + 选择性读）</td>
              </tr>
            </tbody>
          </table>
          <div class="quote" style="margin-top:12px; font-style:normal; font-size:12px; border-left-color:rgba(86,211,100,0.5);">
            "用 LLM 的判断力换 Cache 命中率"的典型权衡——静态 prompt 既能命中缓存，agent 又比脚本更会取舍，两者方向一致。
          </div>
        </div>

      </div>
    `,
    notes: `
      <p><strong>Phase 1 — Orient：</strong>这是纯读取阶段。agent 必须先理解"已有记忆长什么样"，才能做出合理的整合决策。原始 prompt 的核心意图是 "improve them rather than creating duplicates"——列出目录、读取 MEMORY.md、浏览 topic 文件，确保 agent 不会创建重复文件，也不会盲目追加内容。</p>
      <p><strong>Phase 2 — Gather：</strong>这一阶段的本质是"采集新信号，形成写入判断"，输出不是文件，而是 agent context 里积累的认知，供 Phase 3 决策。两个信号源按成本排序：</p>
      <p>第一层<strong>漂移检测</strong>：读取已有 topic 文件内容，结合 Orient 阶段看到的代码现实，找出已经失效的旧记忆——比如路径变更、决策反转、版本升级导致的旧事实。成本较低，优先执行。</p>
      <p>第二层<strong>Transcript 搜索</strong>：当 agent 判断某件具体事情可能发生过（但在现有记忆和代码里找不到）时，才对 <code>.jsonl</code> 会话记录做窄关键词 grep。原始 prompt 明确约束："Don't exhaustively read transcripts. Look only for things you already suspect matter."成本最高，严格按需触发。</p>
    `
  },

  // ── Slide 18: Phase 3-4 写入阶段 — Consolidate + Prune ──
  {
    html: `
      <h2 class="anim"><span class="icon">15</span> Phase 3-4：写入阶段 — Consolidate + Prune</h2>
      <p class="anim small">后两个阶段专注于<strong>落盘写入</strong>和<strong>索引维护</strong>：</p>

      <div class="card-grid cols-2 anim" style="margin-top: 10px;">
        <div class="card" style="border-left: 3px solid var(--orange); padding: 14px;">
          <div class="card-label-tag text-orange mono">Phase 3 — Consolidate（整合）</div>
          <div class="card-desc small" style="margin-top: 8px;">
            <strong class="text-green">① 合并</strong> — 新信号并入已有 topic 文件，而非另建<br>
            <strong class="text-accent">② 绝对化</strong> — "昨天" / "上周" → 绝对日期<br>
            <strong class="text-red">③ 纠错</strong> — 发现矛盾直接修正旧记忆，不追加"更正"
          </div>
          <div class="code-block small" style="margin-top: 8px; padding: 6px 10px; font-size: 11px; color: var(--accent);">
            "Converting relative dates to absolute<br>
            dates so they remain interpretable<br>
            after time passes"
          </div>
          <div class="card-desc small" style="margin-top: 6px; color: var(--dim);">
            格式规范来自系统 Prompt 的 auto-memory 段——<br>
            consolidation prompt 不自定义格式，遵循全局约束
          </div>
        </div>
        <div class="card" style="border-left: 3px solid var(--purple); padding: 14px;">
          <div class="card-label-tag text-purple mono">Phase 4 — Prune and index（修剪）</div>
          <div class="card-desc small" style="margin-top: 8px;">
            维护 <code>MEMORY.md</code> 索引，硬约束：<br>
            <strong class="text-purple">≤200 行 / ≤25KB / ≤150 字符每条</strong><br>
            · 删除过期/错误/已被取代的指针<br>
            · 冗长条目（&gt;200字符）正文移入 topic 文件<br>
            · 解决文件间矛盾
          </div>
          <div class="code-block small" style="margin-top: 8px; padding: 6px 10px; font-size: 11px; color: var(--purple);">
            "It's an <strong>index</strong>, not a dump —<br>
            Never write memory content<br>
            directly into it."
          </div>
        </div>
      </div>

      <div class="highlight-box green anim" style="margin-top: 10px;">
        <strong>Phase 4 的意义：</strong>MEMORY.md 在每次会话启动时加载进上下文窗口——系统对其执行双重截断（200 行 + 25KB），超限部分直接丢失。Prune 决定了用户下次启动时能看到多少长期记忆。
      </div>
    `,
    notes: `
      <p><strong>Phase 3 — Consolidate：</strong>这是真正落盘写文件的阶段，有三个核心动作。</p>
      <p><strong>① 合并：</strong>原始 prompt 要求 "Merging new signal into existing topic files rather than creating near-duplicates"。新信号应该并入已有 topic 文件，而非另建文件。例如用户在不同会话中多次提到"不要用 mock"，应合并为一条完整记忆，而不是三条略有不同的记录。</p>
      <p><strong>② 时间绝对化：</strong>原始 prompt 要求 "Converting relative dates ('yesterday', 'last week') to absolute dates so they remain interpretable after time passes"。"昨天"在一个月后就失去意义，必须转为绝对日期。</p>
      <p><strong>③ 纠错：</strong>原始 prompt 要求 "Deleting contradicted facts — if today's investigation disproves an old memory, fix it at the source"。直接修正旧记忆本身，而不是追加一条"更正"记录，保持记忆的简洁性和权威性。</p>
      <p>另一个值得关注的细节：Phase 3 的格式规范来自系统 prompt 的 auto-memory 段（"it's the source of truth"），consolidation prompt 本身不定义记忆文件格式——frontmatter 结构、type 字段等均遵循全局规范。</p>
      <p><strong>Phase 4 — Prune：</strong>维护 MEMORY.md 索引，原始 prompt 明确定义："It's an index, not a dump — each entry should be one line under ~150 characters"，并 "Never write memory content directly into it"。硬约束：200 行、25KB。</p>
      <p>Phase 4 的意义在于：MEMORY.md 在每次会话启动时加载进上下文窗口，系统会执行双重截断（先行数后字节），超限内容直接丢失。Prune 直接决定了用户下次启动时能看到多少长期记忆。</p>
    `
  },

  // ── 模块架构与生命周期 ──
  {
    html: `
      <h2 class="anim"><span class="icon">11</span> 模块架构与生命周期</h2>

      <p class="anim" style="color: var(--text-secondary); font-size: 0.9em; margin-top: 16px;">
        <strong>模块依赖关系</strong> — 五文件分工与调用关系
      </p>
      <div class="mermaid anim" style="margin-top: 8px;">
flowchart TB
    subgraph Core["src/services/autoDream/"]
        direction TB
        A[autoDream.ts<br/><span style='font-size:11px'>主调度器：门控/fork/收尾</span>]
        B[config.ts<br/><span style='font-size:11px'>轻量叶子模块：开关判断</span>]
        C[consolidationLock.ts<br/><span style='font-size:11px'>锁文件管理：mtime</span>]
        D[consolidationPrompt.ts<br/><span style='font-size:11px'>Prompt构建：四阶段</span>]
    end

    subgraph UI["src/tasks/"]
        E[DreamTask.ts<br/><span style='font-size:11px'>UI可见性：注册/更新/kill</span>]
    end

    A -. 调用 .-> B
    A -. 调用 .-> C
    A -. 调用 .-> D
    A -. 注册/更新 .-> E

    style Core fill:#1c2333,stroke:#58a6ff,stroke-width:2px
    style UI fill:#1c2333,stroke:#3fb950,stroke-width:2px
      </div>

      <div class="divider anim" style="margin: 20px 0;"></div>

      <p class="anim" style="color: var(--text-secondary); font-size: 0.9em;">
        <strong>生命周期流程</strong> — 从启动到执行完整链路
      </p>
      <div class="mermaid anim">
flowchart LR
    A[进程启动<br/>initAutoDream] --> B[注册 runner 闭包]
    B -. 每轮对话结束 .-> C[executeAutoDream]
    C --> D{门控检查}
    D -->|通过| E[获取 lock]
    E --> F[注册 DreamTask]
    F --> G[fork agent]
    G --> H{执行结果}
    H -->|成功| I[complete]
    H -->|失败| J[rollback]
      </div>

      <div class="highlight-box orange anim" style="margin-top: 16px;">
        <strong>config.ts 的设计：</strong>被特意设计为<strong>轻依赖叶子模块</strong>，使 UI 组件读取 auto-dream 开关时，不会把 forked agent / task registry / message builder 等重依赖拖进渲染路径。
      </div>
    `,
    notes: `
      <p>这一页展示的是 AutoDream 的五文件架构。每个文件的职责是什么，为什么这样拆分，是理解整个系统的基础。</p>

      <p><strong>autoDream.ts — 主调度器</strong>：整个 AutoDream 的入口和协调中心。它做三件事：启动时通过 <code>initAutoDream()</code> 注册 runner 闭包；每轮对话结束后执行五级门控检查；门控通过后依次获取锁、注册 DreamTask、fork 子 agent、处理成功/失败收尾。可变状态（如 <code>lastSessionScanAt</code>）封装在闭包内，避免模块级污染。</p>

      <p><strong>config.ts — 配置模块</strong>：负责读取 AutoDream 的开关与调度阈值，核心配置项包括：是否启用（isAutoDreamEnabled）、触发所需最短间隔时间（minHours，默认 24h）、触发所需最少新 session 数（minSessions，默认 5）。</p>

      <p><strong>consolidationLock.ts — 锁文件管理</strong>：管理 <code>.consolidate-lock</code> 文件，承载两个语义：文件 mtime 记录上次整合时间（时间门控读它），文件内容存当前持有者 PID（竞争锁用它）。还提供 <code>listSessionsTouchedSince()</code>，扫描项目 transcript 目录统计新 session 数量，供 session 门控使用。</p>

      <p><strong>consolidationPrompt.ts — Prompt 构建器</strong>：只负责拼装四阶段整合提示词（Orient / Gather / Consolidate / Prune），传入 memoryRoot、transcriptDir、extra 三个参数，返回静态字符串。刻意不掺杂执行逻辑——静态模板是 Prompt Cache 能命中的前提。</p>

      <p><strong>DreamTask.ts — UI 可见性层</strong>：dream agent 本身完全不知道 DreamTask 的存在，这是纯粹的观察层。通过 <code>onMessage</code> 回调监听 agent 输出，用"第一个 FileEdit/FileWrite 出现"作为信号从 starting 翻转为 updating。用户按 kill 时，同时中止 agent、更新任务状态、回滚锁 mtime。</p>

      <p><strong>生命周期串联：</strong>进程启动 → autoDream.ts 注册闭包 → 每轮 stopHook 触发 → 门控（config.ts + consolidationLock.ts）→ 获取锁 → 注册 DreamTask.ts → fork agent（consolidationPrompt.ts 构建 prompt）→ 成功更新锁 mtime / 失败回滚。</p>
    `
  },

  // ── 锁机制：mtime 即状态 ──
  {
    html: `
      <h2 class="anim"><span class="icon">13</span> 锁机制：mtime 即状态</h2>
      <p class="anim"><code>consolidationLock.ts</code> 是系统最精巧的设计之一——<strong>单文件双语义</strong>：</p>

      <div class="card anim" style="margin-top: 16px;">
        <div class="card-grid cols-2" style="gap: 0;">
          <div class="card" style="border: none; border-right: 1px solid var(--border); border-radius: 0;">
            <div class="card-label-tag text-accent mono">文件 mtime</div>
            <div class="card-title" style="margin-top: 8px;">上次整合时间</div>
            <div class="card-desc small">readLastConsolidatedAt()<br/>s.mtimeMs → lastAt</div>
          </div>
          <div class="card" style="border: none; border-radius: 0;">
            <div class="card-label-tag text-purple mono">文件内容</div>
            <div class="card-title" style="margin-top: 8px;">当前持有者 PID</div>
            <div class="card-desc small">writeFile(path, String(pid))<br/>回读验证竞争</div>
          </div>
        </div>
      </div>

      <h3 class="anim" style="margin-top: 20px;">轻量竞争锁（乐观并发控制）</h3>
      <div class="gate-steps anim" style="margin-top: 8px;">
        <div class="gate-step">
          <div class="step-num">1</div>
          <div class="step-content">
            <div class="step-title">并行读取</div>
            <div class="step-desc">同时 stat mtime 和 readFile 读取 PID</div>
          </div>
        </div>
        <div class="gate-step">
          <div class="step-num">2</div>
          <div class="step-content">
            <div class="step-title">过期检查</div>
            <div class="step-desc">锁未过期（&lt;1h）且持有者存活 → 返回 null</div>
          </div>
        </div>
        <div class="gate-step">
          <div class="step-num">3</div>
          <div class="step-content">
            <div class="step-title">写入 PID</div>
            <div class="step-desc">writeFile 自动刷新 mtime，写入当前 PID</div>
          </div>
        </div>
        <div class="gate-step">
          <div class="step-num">4</div>
          <div class="step-content">
            <div class="step-title">回读验证</div>
            <div class="step-desc">再次 readFile，PID 不是自己 → 竞争失败</div>
          </div>
        </div>
      </div>

      <div class="highlight-box orange anim" style="margin-top: 16px;">
        <strong>回滚机制：</strong>fork 失败或用户 kill 时，调用 <code>rollbackConsolidationLock(priorMtime)</code> 使用 <code>utimes</code> 精确恢复旧 mtime，避免错误推迟下次触发。
      </div>
    `,
    notes: `
      <p><strong>单文件双语义：</strong>一个文件同时承载两个语义——mtime 表示"上次整合时间"，文件内容表示"当前持有者 PID"。这避免了多份状态之间的同步问题。</p>
      <p><strong>为什么不用 flock：</strong>源码采用"写入后回读验证"的轻量方案，而非操作系统级文件锁。这是 O(1) 的轻量竞争方案，两个进程同时写入时，最后写入的 PID 获胜，输者在回读验证时发现不是自己，主动退出。</p>
      <p><strong>过期保护：</strong>即使 PID 看起来活着，超过 1 小时（HOLDER_STALE_MS）也强制 reclaim。这是为了防止 PID 复用导致的误判。</p>
      <p><strong>回滚关键：</strong>utimes 系统调用允许精确恢复文件的 mtime。这是整个设计的关键——成功时保留新 mtime，失败时回滚到旧 mtime，让下次触发判断基于正确的时间基准。</p>
    `
  },

  // ── Slide 20: 核心设计总结 ──
  {
    html: `
      <h2 class="anim"><span class="icon">◆</span> 核心设计总结</h2>
      <p class="anim small">两大系统共同体现的设计哲学：<strong>低成本优先 · 状态语义复用 · 边界清晰 · 静默容错</strong></p>

      <div class="card-grid cols-3 anim" style="margin-top: 14px;">
        <div class="card" style="border-top: 2px solid var(--green);">
          <div class="card-label-tag text-green mono">廉价优先门控</div>
          <div class="card-desc small" style="margin-top: 6px;">
            五级门控按成本从低到高排列：<br>
            功能开关 → 时间（1次stat）→ 扫描节流 → Session数 → 竞争锁<br>
            任意一关不通立即返回，后续更贵的操作不执行
          </div>
        </div>
        <div class="card" style="border-top: 2px solid var(--purple);">
          <div class="card-label-tag text-purple mono">Prompt Cache 复用</div>
          <div class="card-desc small" style="margin-top: 6px;">
            dream agent 复用主会话已渲染的 system prompt（字节级一致），直接命中 Anthropic 服务器端缓存。<br>
            <strong>system prompt token 边际成本 ≈ 0</strong>
          </div>
        </div>
        <div class="card" style="border-top: 2px solid var(--orange);">
          <div class="card-label-tag text-orange mono">先读后写顺序</div>
          <div class="card-desc small" style="margin-top: 6px;">
            四阶段强制顺序：Orient → Gather（纯读）→ Consolidate → Prune（写）<br>
            避免 agent 盲目追加，防止重复文件和索引膨胀
          </div>
        </div>
      </div>

      <div class="card-grid cols-3 anim" style="margin-top: 10px;">
        <div class="card" style="border-top: 2px solid var(--accent);">
          <div class="card-label-tag text-accent mono">排除边界明确</div>
          <div class="card-desc small" style="margin-top: 6px;">
            记忆存"<strong>人类判断</strong>"，不存"机器可推导事实"：<br>
            代码结构、git 历史、调试方案均排除在外——防止记忆膨胀为代码库副本
          </div>
        </div>
        <div class="card" style="border-top: 2px solid var(--red);">
          <div class="card-label-tag" style="color: var(--red);" class="mono">静默容错</div>
          <div class="card-desc small" style="margin-top: 6px;">
            AutoDream 所有错误内部处理，不向用户暴露。失败触发回滚（<code>utimes</code> 精确恢复 mtime），确保不错误推迟下次触发
          </div>
        </div>
        <div class="card" style="border-top: 2px solid var(--accent);">
          <div class="card-label-tag text-accent mono">mtime 即状态</div>
          <div class="card-desc small" style="margin-top: 6px;">
            <code>.consolidate-lock</code> 一个文件同时承载：<br>
            <span class="text-accent">文件 mtime</span> = 上次整合时间<br>
            <span class="text-green">文件内容</span> = 当前持锁 PID<br>
            避免多份状态同步，读取成本仅 1 次 <code>stat()</code>
          </div>
        </div>
      </div>

      <div class="highlight-box blue anim" style="margin-top: 12px;">
        <strong>整体设计哲学：</strong>Memory 系统是"知识库"而非"聊天历史"，AutoDream 是"整合器"而非"索引器"。两者互补——extractMemories 负责实时写入，AutoDream 负责定期维护健康。
      </div>
    `,
    notes: `
      <p><strong>mtime 即状态：</strong>这是整个系统最精巧的设计——一个文件同时承载两个语义，避免了传统"锁文件 + 状态文件"的双文件同步问题。mtime 读取成本仅为一次 stat()，utimes 回滚精确到毫秒。</p>
      <p><strong>廉价优先门控：</strong>五级门控的排列顺序本身就是成本优化。功能开关是内存查询；时间门控仅需 1 次 stat()；只有前面都通过才会触发更贵的 session 目录扫描。扫描节流（10分钟）专门解决"时间门通过但 session 数不足时的热空转"问题。</p>
      <p><strong>Prompt Cache 复用：</strong>通过 createCacheSafeParams 复用主会话 system prompt 的字节级快照，dream agent 几乎完全命中服务器端 prompt cache。这使得 AutoDream 的 system prompt token 成本接近于零——只需支付整合输出本身的 token。</p>
      <p><strong>先读后写顺序：</strong>Orient + Gather 是纯读取阶段，不做任何写入。这确保 agent 充分理解"已有记忆的结构"，再决定写什么——防止创建重复文件，防止盲目追加。</p>
      <p><strong>排除边界明确：</strong>记忆系统存储的是"人类判断"——用户偏好、项目背景决策、外部系统指针。代码模式、架构、git 历史、调试方案均不应写入，否则记忆会膨胀为代码库的低质量副本。</p>
      <p><strong>静默容错：</strong>AutoDream 对用户完全透明，后台运行。所有错误内部处理，锁回滚使用 utimes 精确恢复旧 mtime，确保失败不会错误推迟下次触发窗口。</p>
    `
  },

  // ── Slide 21: 结束页 / Q&A ──
  {
    className: 'title-slide',
    html: `
      <h1 class="anim">感谢聆听</h1>
      <p class="subtitle anim">Q &amp; A</p>

      <p class="anim" style="margin-top: 5px; margin-bottom: 5px; font-size: 13px; color: var(--text-secondary); line-height: 2.0;">
        <strong style="color: var(--text-primary);">Boyu Ren</strong>
        &nbsp;·&nbsp; 基于 Claude Code CLI 泄漏源码 &nbsp;·&nbsp; TypeScript 完整源码阅读分析<br>
        <span class="dim" style="font-size: 12px;">Memory 系统深度解析 &nbsp;/&nbsp; AutoDream 自进化记忆机制</span>
      </p>

      <div style="margin-top: 5px; max-width: 820px; width: 100%; margin-left: auto; margin-right: auto; display: flex; flex-direction: column; gap: 10px; box-sizing: border-box;">

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="card anim" style="border-top: 2px solid var(--accent); text-align: left;">
            <div class="card-label-tag text-accent mono">源码起源</div>
            <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 7px; font-size: 12px; line-height: 1.6;">
              <div>
                <div class="dim" style="font-size: 11px; margin-bottom: 2px;">X 首发帖子</div>
                <a href="https://x.com/Fried_rice/status/2038894956459290963" target="_blank" style="color: var(--accent); text-decoration: none; word-break: break-all;">x.com/Fried_rice/status/2038894956459290963</a>
              </div>
              <div>
                <div class="dim" style="font-size: 11px; margin-bottom: 2px;">流出仓库（现已改写为 Rust）</div>
                <a href="https://github.com/ultraworkers/claw-code" target="_blank" style="color: var(--accent); text-decoration: none;">github.com/ultraworkers/claw-code</a>
              </div>
            </div>
          </div>

          <div class="card anim" style="border-top: 2px solid var(--green); text-align: left;">
            <div class="card-label-tag text-green mono">本报告使用版本</div>
            <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 7px; font-size: 12px; line-height: 1.6;">
              <div>
                <div class="dim" style="font-size: 11px; margin-bottom: 2px;">Fork 版（无改写，本次 report 基于此）</div>
                <a href="https://github.com/YarrowRen/claude-code" target="_blank" style="color: var(--green); text-decoration: none;">github.com/YarrowRen/claude-code</a>
              </div>
              <div>
                <div class="dim" style="font-size: 11px; margin-bottom: 2px;">修正版（补全环境，支持一键编译）</div>
                <a href="https://github.com/claude-code-best/claude-code" target="_blank" style="color: var(--green); text-decoration: none;">github.com/claude-code-best/claude-code</a>
              </div>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="card anim" style="border-top: 2px solid var(--purple); text-align: left;">
            <div class="card-label-tag text-purple mono">深度解析参考</div>
            <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 7px; font-size: 12px; line-height: 1.6;">
              <div>
                <div class="dim" style="font-size: 11px; margin-bottom: 2px;">Claude Code 深度解析报告</div>
                <a href="https://github.com/tvytlx/ai-agent-deep-dive" target="_blank" style="color: var(--purple); text-decoration: none;">github.com/tvytlx/ai-agent-deep-dive</a>
              </div>
              <div>
                <div class="dim" style="font-size: 11px; margin-bottom: 2px;">Claude Code 源码全解读</div>
                <a href="https://github.com/luyao618/Claude-Code-Source-Study" target="_blank" style="color: var(--purple); text-decoration: none;">github.com/luyao618/Claude-Code-Source-Study</a>
              </div>
            </div>
          </div>

          <div class="card anim" style="border-top: 2px solid var(--orange); text-align: left;">
            <div class="card-label-tag text-orange mono">个人总结报告</div>
            <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 7px; font-size: 12px; line-height: 1.6;">
              <div>
                <a href="https://yarrow.ren/posts/claude-code-memory/" target="_blank" style="color: var(--orange); text-decoration: none;">yarrow.ren — Memory 系统</a>
              </div>
              <div>
                <a href="https://yarrow.ren/posts/claude-code-autodream/" target="_blank" style="color: var(--orange); text-decoration: none;">yarrow.ren — AutoDream 机制</a>
              </div>
              <div>
                <a href="https://yarrow.ren/posts/claude-code-kairos/" target="_blank" style="color: var(--orange); text-decoration: none;">yarrow.ren — KAIROS 持久 Agent</a>
              </div>
            </div>
          </div>
        </div>


      </div>
    `,
    notes: `
      <p><strong>结束页要点：</strong>本次报告完整覆盖了 Claude Code 的两大记忆相关系统。</p>
      <p><strong>Memory 系统</strong>：三层记忆架构、四类分类法、两条写入流水线（extractMemories + AutoDream）、动态召回（findRelevantMemories）、记忆新鲜度感知、权限沙箱与路径安全。</p>
      <p><strong>AutoDream</strong>：五级廉价优先门控、单文件双语义锁机制（mtime即状态）、四阶段 Consolidation Prompt（先读后写）、Prompt Cache 复用（零边际成本）、DreamTask UI 可见性与 Kill 联动、静默容错与 utimes 精确回滚。</p>
      <p>所有分析基于完整的 TypeScript 源码阅读，不是猜测或逆向工程。欢迎就任何技术细节展开讨论。</p>
    `
  }
];

// ── State ──
let current = 0;
let notesVisible = true;

// ── DOM Refs ──
const slideContainer = document.getElementById('slide-container');
const notesContent   = document.getElementById('notes-content');
const notesPanel     = document.getElementById('notes-panel');
const navDots        = document.getElementById('nav-dots');
const slideCounter   = document.getElementById('slide-counter');
const btnPrev        = document.getElementById('btn-prev');
const btnNext        = document.getElementById('btn-next');
const btnNotesToggle = document.getElementById('btn-notes-toggle');

// ── Navigation ──
function buildDots() {
  navDots.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === current ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    navDots.appendChild(dot);
  });
}

function updateCounter() {
  slideCounter.textContent = `${current + 1} / ${slides.length}`;
}

function updateButtons() {
  btnPrev.disabled = current === 0;
  btnNext.disabled = current === slides.length - 1;
}

function renderSlide() {
  const slide = slides[current];
  const wrapper = document.createElement('div');
  wrapper.className = 'slide slide-enter' + (slide.className ? ' ' + slide.className : '');
  wrapper.innerHTML = slide.html;

  slideContainer.innerHTML = '';
  slideContainer.appendChild(wrapper);
  slideContainer.scrollTop = 0;

  // Notes
  notesContent.innerHTML = slide.notes || '<p class="dim">暂无备注</p>';

  // Dots
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });

  updateCounter();
  updateButtons();
}

function goTo(index) {
  if (index < 0 || index >= slides.length || index === current) return;
  current = index;
  renderSlide();
  // Re-run mermaid after slide change to render diagrams on new slides
  setTimeout(runMermaid, 50);
}

function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }

// ── Notes Toggle ──
function toggleNotes() {
  notesVisible = !notesVisible;
  const isMobile = window.innerWidth <= 900;
  if (isMobile) {
    notesPanel.classList.toggle('mobile-visible', notesVisible);
  } else {
    notesPanel.classList.toggle('hidden', !notesVisible);
  }
}

// ── Event Listeners ──
btnPrev.addEventListener('click', prev);
btnNext.addEventListener('click', next);
btnNotesToggle.addEventListener('click', toggleNotes);

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
    case ' ':
      e.preventDefault();
      next();
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault();
      prev();
      break;
    case 'Home':
      e.preventDefault();
      goTo(0);
      break;
    case 'End':
      e.preventDefault();
      goTo(slides.length - 1);
      break;
    case 'n':
    case 'N':
      if (!e.ctrlKey && !e.metaKey) toggleNotes();
      break;
  }
});

// ── Mermaid Support ──
function initMermaid() {
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#1c2333',
        primaryTextColor: '#e6edf3',
        primaryBorderColor: '#30363d',
        lineColor: '#8b949e',
        secondaryColor: '#161b22',
        tertiaryColor: '#0d1117',
        fontFamily: 'JetBrains Mono, monospace'
      },
      flowchart: {
        curve: 'basis',
        padding: 12
      }
    });
  }
}

function runMermaid() {
  if (typeof mermaid !== 'undefined') {
    mermaid.run({ querySelector: '.mermaid' });
  }
}

// ── Memory Demo Tab Switcher ──
function showMemTab(type) {
  const tabs = ['user', 'feedback', 'project', 'reference'];
  const filenames = {
    user: 'user_profile.md',
    feedback: 'feedback_testing.md',
    project: 'project_auth_rewrite.md',
    reference: 'reference_infra.md',
  };
  tabs.forEach(t => {
    const panel = document.getElementById('mem-' + t);
    const btn = document.getElementById('tab-' + t);
    if (!panel || !btn) return;
    if (t === type) {
      panel.style.display = 'block';
      btn.style.background = 'var(--accent)';
      btn.style.color = '#fff';
      btn.style.borderColor = 'var(--accent)';
    } else {
      panel.style.display = 'none';
      btn.style.background = 'none';
      btn.style.color = 'var(--text-muted)';
      btn.style.borderColor = 'rgba(255,255,255,0.15)';
    }
  });
  const label = document.getElementById('mem-filename');
  if (label) label.textContent = filenames[type] || '';
}

// ── Memory Demo Tab Switcher (Slide 7 copy) ──
function showS7MemTab(type) {
  const tabs = ['user', 'feedback', 'project', 'reference'];
  const filenames = {
    user: 'user_profile.md',
    feedback: 'feedback_testing.md',
    project: 'project_auth_rewrite.md',
    reference: 'reference_infra.md',
  };
  tabs.forEach(t => {
    const panel = document.getElementById('s7-mem-' + t);
    const btn = document.getElementById('s7-tab-' + t);
    if (!panel || !btn) return;
    if (t === type) {
      panel.style.display = 'block';
      btn.style.background = 'var(--accent)';
      btn.style.color = '#fff';
      btn.style.borderColor = 'var(--accent)';
    } else {
      panel.style.display = 'none';
      btn.style.background = 'none';
      btn.style.color = 'var(--text-muted)';
      btn.style.borderColor = 'rgba(255,255,255,0.15)';
    }
  });
  const label = document.getElementById('s7-mem-filename');
  if (label) label.textContent = filenames[type] || '';
}

// ── Init ──
initMermaid();
buildDots();
renderSlide();
runMermaid();
