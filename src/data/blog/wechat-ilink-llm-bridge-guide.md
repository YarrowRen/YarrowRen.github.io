---
title: "从微信 ClawBot 到 iLink：解析官方 Bot 协议，构建独立 WeChat-Bot"
description: 
    "本文基于 @tencent-weixin/openclaw-weixin@1.0.2 公开源码和实测，描述 iLink 协议的工作机制，以及如何在不依赖 OpenClaw 框架的前提下，用 Python 构建所需Bot服务。"
pubDatetime: 2026-03-23T11:01:18.002Z
modDatetime: 2026-03-23T11:01:18.002Z
author: "Boyu Ren"
slug: "wechat-ilink-llm-bridge-guide"
tags: 
    - Agent
    - OpenClaw
    - Bot
draft: false
featured: false
---

> 本文基于 `@tencent-weixin/openclaw-weixin@1.0.2` 公开源码和实测，描述 iLink 协议的工作机制，以及如何在不依赖 OpenClaw 框架的前提下，用 Python 构建所需Bot服务。

---

## 一、背景：微信官方开放 Bot 接口

### 1.1 ClawBot 是什么

微信长期以来没有面向个人开发者的官方 Bot 接口。开发者若想生成类似Telegram Bot，只能通过模拟客户端协议的方式。（存在法律风险并且稳定性欠佳）

前几天（2026/03/21）随着openclaw的火爆，腾讯通过一个名为 **openclaw-weixin** 的 插件框架，正式开放了微信的 Bot 能力，底层接口为 **iLink**，服务域名为 `ilinkai.weixin.qq.com`。

### 1.2 openclaw 包

**`@tencent-weixin/openclaw-weixin-cli`**：安装工具，核心是 `cli.mjs` 脚本，作用是检测 OpenClaw CLI 是否已安装、调用 `openclaw plugins install` 安装插件、触发扫码登录，以及重启 Gateway。这个包本身不包含协议实现。

**`@tencent-weixin/openclaw-weixin`**：真正的协议实现包，41 个 TypeScript 源文件，包含从认证到媒体处理的完整实现。本文的技术分析主要基于这个包的源码。

### 1.3 本文的出发点

相比较于官方实现的`openclaw-weixin`，本次更新最重要的是开放了iLink接口能力，这让长久以来封闭的微信Bot相关实现重新成为热点并且给出了许多的可能。从常规角度考虑的可以便捷的接入各种Multi-Agent Framework（Claude code、OpenClaw、CodeX），另一方面也让未来可能在微信相对自由的发布各种功能性Bot（功能助手、流水线流程）成为可能

本文的目标是：读懂协议，剥离框架依赖，用更轻量的方式直接对接 iLink，并以 LLM 调用作为演示功能。

---

## 二、OpenClaw 插件架构解析

### 2.1 插件目录结构

插件的核心模块划分如下：

```
src/
├── api/           # iLink HTTP 请求封装（api.ts、types.ts）
├── auth/          # QR Code登录流程（login-qr.ts）、账号持久化（accounts.ts）
├── cdn/           # AES-128-ECB 加解密（aes-ecb.ts）、CDN 上传（cdn-upload.ts）
├── media/         # 媒体下载解密（media-download.ts）、SILK 转码（silk-transcode.ts）
├── messaging/     # 消息入站规范化（inbound.ts）、文本发送（send.ts）
├── monitor/       # 长轮询主循环（monitor.ts）
├── storage/       # sync_buf 游标持久化（sync-buf.ts）
└── util/          # 日志（logger.ts）、脱敏（redact.ts）
```

`channel.ts` 是整个插件的入口，它实现了 OpenClaw 的 `ChannelPlugin` 接口，通过 `plugin.registerChannel(weixinPlugin)` 注入框架。

### 2.2 耦合点分析

通过阅读代码，与框架产生耦合的具体位置是：

- `api/api.ts` 中的 `loadConfigRouteTag()`：直接从框架全局配置读取路由标签
- `messaging/send.ts` 中对 `contextToken` 的强约束：若消息不含 `context_token` 则抛出异常，这是协议层面的要求，与框架无关，但错误提示中夹杂了框架术语
- `channel.ts` 中对 `channelRuntime.recordInboundSession()` 和 `channelRuntime.dispatchReplyFromConfig()` 的调用：这两个方法是 OpenClaw 的 AI 路由机制，负责将消息转发给 AI 并将回复分发给对应渠道

去耦合的核心工作量集中在：将 `routeTag` 改为构造函数参数，以及用自己的 LLM 调用逻辑替代 `dispatchReplyFromConfig`。

---

## 三、iLink Bot 协议技术详解

### 3.1 服务端点与常量

从源码中可以提取以下固定常量：

```
API Base URL:  https://ilinkai.weixin.qq.com
CDN Base URL:  https://novac2c.cdn.weixin.qq.com/c2c
bot_type:      "3"（硬编码于 login-qr.ts，含义未公开文档说明）
```

所有业务接口路径均以 `/ilink/bot/` 为前缀：

| 路径 | HTTP 方法 | 功能 | 超时建议 |
|------|-----------|------|---------|
| `ilink/bot/get_bot_qrcode` | GET | 获取登录二维码 | 15s |
| `ilink/bot/get_qrcode_status` | GET | 轮询扫码状态 | 35s（长轮询） |
| `ilink/bot/getupdates` | POST | 拉取新消息 | 35s（长轮询） |
| `ilink/bot/sendmessage` | POST | 发送消息 | 15s |
| `ilink/bot/getuploadurl` | POST | 获取 CDN 上传预签名参数 | 15s |
| `ilink/bot/getconfig` | POST | 获取 typing_ticket | 10s |
| `ilink/bot/sendtyping` | POST | 发送"正在输入"状态 | 10s |

### 3.2 请求鉴权：三个 Header

阅读 `api/api.ts` 中的 `buildHeaders()` 函数，每个 API 请求都必须携带三个关键 Header：

```
Content-Type:      application/json
AuthorizationType: ilink_bot_token
X-WECHAT-UIN:      <随机值，见下文>
Authorization:     Bearer <bot_token>   // 登录后才携带
```

`AuthorizationType: ilink_bot_token` 是固定字符串，用于标识鉴权方式。`Authorization` Header 遵循标准 Bearer Token 格式，值为登录时获取的 `bot_token`。

### 3.3 `X-WECHAT-UIN` 的生成逻辑

从 `api.ts` 源码可以清楚看到：

```typescript
function randomWechatUin(): string {
  const uint32 = crypto.randomBytes(4).readUInt32BE(0);
  return Buffer.from(String(uint32), "utf-8").toString("base64");
}
```

步骤是：生成 4 个随机字节 → 读取为无符号 32 位整数 → 转为十进制字符串 → 对这个字符串做 base64 编码。每次请求都会重新生成，起到防重放作用。

值得注意：base64 编码的对象是十进制数字字符串，而非原始字节。

### 3.4 `base_info.channel_version`

每个 POST 请求的 body 中都包含：

```json
{ "base_info": { "channel_version": "1.0.2" } }
```

`channel_version` 的值来自插件自身的 `package.json`，在 `api.ts` 启动时读取并缓存。这相当于 API 的客户端版本号，服务端可用于兼容性判断或日志追踪。

### 3.5 二维码登录流程

登录流程的完整实现在 `auth/login-qr.ts`，状态机如下：

```
GET /ilink/bot/get_bot_qrcode?bot_type=3
    └─▶ { qrcode: "<id>", qrcode_img_content: "<url>" }

GET /ilink/bot/get_qrcode_status?qrcode=<id>
    ├─ status: "wait"       → 继续轮询
    ├─ status: "scaned"     → 已扫码，等待确认
    ├─ status: "expired"    → 二维码过期，刷新（最多 3 次）
    └─ status: "confirmed"  → 登录成功
          └─▶ { bot_token, baseurl, ilink_bot_id, ilink_user_id }
```

几个值得关注的细节：

**`qrcode_status` 是长轮询**：`get_qrcode_status` 请求附带了 `iLink-App-ClientVersion: 1` Header，且客户端设置了 35 秒超时。服务端会 hold 住连接直到状态变化，而非立即返回。

**二维码刷新上限**：代码中 `MAX_QR_REFRESH_COUNT = 3`，超过 3 次过期会放弃登录，向用户返回超时错误。

**`baseurl` 字段**：登录成功响应中的 `baseurl` 字段可能与默认的 `ilinkai.weixin.qq.com` 不同——这是服务端分配给该账号的专属接入点，后续所有 API 请求应使用这个地址而非硬编码的默认值。这也是 `credentials.json` 中需要单独保存 `base_url` 的原因。

**`bot_type=3` 的含义**：这个值在 `login-qr.ts` 中以常量 `DEFAULT_ILINK_BOT_TYPE = "3"` 硬编码，注释仅说明是"this channel build"，官方文档中并无进一步说明，推测对应个人账号 Bot 套餐。

### 3.6 消息收取：getupdates 长轮询

消息收取的核心接口是 `getupdates`，采用长轮询设计。请求体结构：

```json
{
  "get_updates_buf": "<上次响应返回的游标，首次为空字符串>",
  "base_info": { "channel_version": "1.0.2" }
}
```

服务端会 hold 住连接最长约 35 秒，有新消息时立即返回，超时时返回空 `msgs`。响应结构：

```json
{
  "ret": 0,
  "errcode": 0,
  "msgs": [ ...WeixinMessage[] ],
  "get_updates_buf": "<新游标>",
  "longpolling_timeout_ms": 35000
}
```

**`get_updates_buf` 的重要性**：这是整个消息收取机制的核心。它是一个不透明的游标字符串，服务端用来标记"你上次读到哪里了"。如果不保存并在下次请求中带上这个值，服务端会重新从某个历史位置返回消息，导致重复处理。正确做法是在本地持久化这个值（写入磁盘），确保程序重启后也能续传。

**超时行为**：从 `api.ts` 源码可以看到，当客户端侧触发超时（`AbortError`），函数返回 `{ ret: 0, msgs: [], get_updates_buf: <原值> }`，即当作空响应处理，调用方无需区分超时与无消息两种情况。

**错误码 -14**：`errcode: -14` 表示 session 已过期，通常是 `bot_token` 失效。这种情况下应立即停止轮询，等待一段时间后重新登录，而不是继续重试（否则可能触发更严格的限制）。

### 3.7 消息结构（基于 types.ts）

每条消息对应 `WeixinMessage` 接口，核心字段：

```typescript
interface WeixinMessage {
  from_user_id?: string;      // 发送方 ID，格式: "xxx@im.wechat"
  to_user_id?: string;        // 接收方 ID，格式: "xxx@im.bot"
  message_type?: number;      // 1=用户发出, 2=Bot发出
  message_state?: number;     // 0=NEW, 1=GENERATING, 2=FINISH
  context_token?: string;     // 对话关联凭证，回复时必须原样带上
  group_id?: string;          // 群聊 ID（私聊时为空）
  item_list?: MessageItem[];  // 消息内容列表
}
```

**`message_type` 过滤**：Bot 自己发出的消息也会出现在 `getupdates` 的响应中（`message_type: 2`）。如果不过滤，Bot 会响应自己的消息，形成死循环。因此处理逻辑必须只处理 `message_type === 1` 的消息。

**`item_list` 的多内容类型**：一条消息可能包含多个内容项，类型由 `type` 字段区分：

| type | 含义 | 对应接口 |
|------|------|---------|
| 1 | 文本 | `text_item: { text: string }` |
| 2 | 图片 | `image_item: { media, thumb_media, aeskey, ... }` |
| 3 | 语音 | `voice_item: { media, encode_type, playtime, text }` |
| 4 | 文件 | `file_item: { media, file_name, len }` |
| 5 | 视频 | `video_item: { media, video_size, ... }` |

语音消息的 `voice_item.text` 字段值得关注——服务端会尝试提供语音转文字内容，但不保证所有消息都有。语音编码类型 `encode_type` 的值在 `types.ts` 的注释中列举：1=pcm, 2=adpcm, 3=feature, 4=speex, 5=amr, **6=silk**, 7=mp3, 8=ogg-speex。微信实际传输的是 SILK 格式（值=6）。

### 3.8 `context_token`：对话关联的必填凭证

这是协议中最容易忽略也最容易出错的细节。`context_token` 是服务端维护的对话上下文标识符，每条入站消息都会携带一个。发送回复时，必须将这个值原样放入 `sendmessage` 的 `msg.context_token` 字段。

缺少 `context_token` 的直接后果是：消息可能发送成功，但不会出现在对应的对话窗口中，或无法正确关联到该用户的会话。

从 `messaging/send.ts` 源码来看，函数在构建发送 payload 时会做显式检查——若 `contextToken` 为空则抛出异常，而非静默发送。

`context_token` 不需要持久化：它是每次收到消息时从 payload 中取得的，属于会话级状态，并非账号凭证。程序重启后，第一条收到的新消息会带来新的 `context_token`。

### 3.9 媒体文件处理

#### CDN 下载与解密

媒体文件存储在 `novac2c.cdn.weixin.qq.com/c2c`，下载路径需要 `encrypt_query_param` 参数，这个参数来自 `CDNMedia.encrypt_query_param` 字段。下载后的内容是 AES 加密的密文，需要用对应的 key 解密。

#### 两种 aes_key 编码格式

阅读 `media-download.ts` 中的 `parseAesKey` 函数（以及其中的注释），`aes_key` 存在两种编码方式：

1. **`CDNMedia.aes_key`（文件、语音、视频使用）**：base64 编码的字节数据，解码后可能是 16 字节原始 key，也可能是 32 个 ASCII hex 字符（代表 16 字节 key 的十六进制表示）。

2. **`ImageItem.aeskey`（图片入站消息使用）**：直接的 16 字节 key 的十六进制字符串，即 32 个十六进制字符，**不经过 base64 编码**。

类型定义文件 `types.ts` 第 87 行的注释明确写明：

```typescript
/** Raw AES-128 key as hex string (16 bytes); preferred over media.aes_key for inbound decryption. */
aeskey?: string;
```

处理图片时，正确做法是：`bytes.fromhex(img.aeskey)` 直接解码为 16 字节，而非对其进行 base64 解码。我在实现过程中曾踩过这个坑——将 hex 字符串误当 base64 解码，得到的是 24 字节乱码，导致 AES 解密失败。

#### sendTyping 与 typing_ticket

`sendtyping` 接口需要一个 `typing_ticket` 参数，这个值通过 `getconfig` 接口动态获取，与用户 ID 和 `context_token` 绑定。它不是固定值，需要在每次开始处理新对话时预先获取并缓存。`sendTyping` 失败是非致命错误——"正在输入"状态的显示只是用户体验，不影响消息最终能否送达。

### 3.10 消息发送的必填字段

`sendmessage` 的请求体需要构造一个 `WeixinMessage` 对象：

```json
{
  "msg": {
    "to_user_id": "<从入站消息的 from_user_id 取得>",
    "message_type": 2,
    "message_state": 2,
    "context_token": "<从入站消息取得，必填>",
    "item_list": [
      { "type": 1, "text_item": { "text": "回复内容" } }
    ]
  },
  "base_info": { "channel_version": "1.0.2" }
}
```

`message_type: 2` 表示这是 Bot 发出的消息，`message_state: 2` 表示 FINISH（完整消息，区别于流式生成中的 GENERATING 状态）。

---

## 四、去耦合：构建独立 Python 桥接服务

### 4.1 去除 OpenClaw 依赖的方案

读完源码后，需要替换的 OpenClaw 依赖归纳为三类：

| 依赖点 | 原插件方式 | 独立方案 |
|--------|-----------|---------|
| `routeTag` 读取 | `loadConfigRouteTag()` 读框架配置 | 构造函数参数传入 |
| LLM 调用 | `channelRuntime.dispatchReplyFromConfig()` | 直接调用 LLM API |
| 媒体存储 | `SaveMediaFn` 框架回调 | 直接写入本地文件系统 |

### 4.2 项目结构

```
ilink-llm-bridge/
├── login.py                 # 独立登录脚本
├── config.yaml              # 用户配置
├── src/
│   ├── config/              # 配置类型与加载
│   ├── ilink/               # API 客户端、会话保护、消息出站
│   ├── cdn/                 # CDN 下载与 AES 解密
│   ├── history/             # 对话历史管理
│   ├── llm/providers/       # 7 个 LLM 适配器
│   ├── bridge/              # 主循环、消息处理、分块
│   └── util/                # 日志、脱敏工具
```

### 4.3 异步 HTTP 封装

Python 实现选用 `httpx` 作为 HTTP 客户端，与 TypeScript 实现中使用 `fetch` + `AbortController` 的模式对应：

```python
class ILinkClient:
    async def get_updates(self, get_updates_buf: str = "") -> dict:
        try:
            async with httpx.AsyncClient(timeout=38.0) as client:
                resp = await client.post(
                    self._url("ilink/bot/getupdates"),
                    json={"get_updates_buf": get_updates_buf,
                          "base_info": {"channel_version": CHANNEL_VERSION}},
                    headers=self._headers()
                )
                resp.raise_for_status()
                return resp.json()
        except httpx.TimeoutException:
            return {"ret": 0, "msgs": [], "get_updates_buf": get_updates_buf}
```

超时异常被捕获并返回空响应，与 TypeScript 实现的处理逻辑保持一致。

### 4.4 会话保护机制

errcode -14 出现时，立即停止所有 API 调用并进入 1 小时冷却：

```python
SESSION_PAUSE_SECONDS = 3600

_paused_until: dict[str, float] = {}

def pause_session(account_id: str) -> None:
    _paused_until[account_id] = time.time() + SESSION_PAUSE_SECONDS

def is_session_paused(account_id: str) -> bool:
    return time.time() < _paused_until.get(account_id, 0)
```

主循环每次迭代前检查此状态，触发后需要重新运行登录脚本获取新 token。

### 4.5 `get_updates_buf` 磁盘持久化

```python
BUF_FILE = "data/sync_buf.txt"

def _load_buf() -> str:
    try:
        return Path(BUF_FILE).read_text(encoding="utf-8").strip()
    except FileNotFoundError:
        return ""

def _save_buf(buf: str) -> None:
    Path(BUF_FILE).parent.mkdir(parents=True, exist_ok=True)
    Path(BUF_FILE).write_text(buf, encoding="utf-8")
```

每次收到新的 `get_updates_buf` 时立即写盘，确保程序重启后能从断点续传，不重复处理已收到的消息。

### 4.6 per-user 消息串行化

同一用户的多条消息必须串行处理（等待 LLM 返回后再处理下一条），但不同用户之间可以并行。用 `asyncio.Task` 链实现：

```python
class MessageHandler:
    def __init__(self):
        self._queues: dict[str, asyncio.Task] = {}

    def enqueue(self, msg: WeixinMessage) -> None:
        user_id = msg.from_user_id
        prev = self._queues.get(user_id)
        task = asyncio.ensure_future(self._chain(prev, msg))
        self._queues[user_id] = task

    async def _chain(self, prev, msg):
        if prev and not prev.done():
            try:
                await prev
            except Exception:
                pass
        await self._handle(msg)
```

新消息到来时，创建一个等待前一个任务完成的 Task，从而自然地形成每用户的串行队列。

---

## 五、LLM 接入：适配层设计

### 5.1 抽象接口

将 LLM 调用抽象为一个简单接口：

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class LLMRequest:
    messages: list[dict]    # [{"role": "...", "content": "..."}]
    model: str
    max_tokens: int = 2048

@dataclass
class LLMResponse:
    text: str
    error: str = ""

class LLMProvider(ABC):
    @property
    @abstractmethod
    def name(self) -> str: ...

    @abstractmethod
    async def complete(self, request: LLMRequest) -> LLMResponse: ...
```

`messages` 使用 OpenAI 的对话格式作为内部标准格式——每个提供商的适配器负责将其转换为自身 API 要求的格式。

### 5.2 OpenAI 兼容层

OpenAI、Qwen（通义千问）、Grok（xAI）、Seed（字节跳动豆包）四个提供商都兼容 OpenAI 的 `/chat/completions` 接口，消息格式完全相同，唯一区别是 `base_url`：

| 提供商 | base_url |
|--------|---------|
| OpenAI | `https://api.openai.com/v1` |
| Qwen   | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| Grok   | `https://api.x.ai/v1` |
| Seed   | `https://ark.cn-beijing.volces.com/api/v3` |

四者共用同一个实现类，构造时传入 `provider_name` 和 `base_url` 即可。

### 5.3 Claude 的特殊性

Claude（Anthropic）的 `/v1/messages` 接口与 OpenAI 存在三处重要差异，必须在适配器中处理：

**（1）鉴权 Header 不同**：不使用 `Authorization: Bearer`，而是 `x-api-key: <key>`，同时必须附带 `anthropic-version: 2023-06-01`。

**（2）system 角色的处理**：OpenAI 允许将系统提示作为 `role: "system"` 的消息放在列表中，Claude 要求 `system` 必须作为请求体的顶层字段，不能混在 `messages` 数组里：

```python
system_messages = [m for m in messages if m["role"] == "system"]
user_messages = [m for m in messages if m["role"] != "system"]
body = {
    "model": model,
    "max_tokens": max_tokens,
    "system": system_messages[0]["content"] if system_messages else "",
    "messages": user_messages,
}
```

**（3）`max_tokens` 必填**：Claude API 要求 `max_tokens` 字段，没有默认值，不传会报错。

**（4）图片格式转换**：OpenAI 使用 `{"type": "image_url", "image_url": {"url": "data:image/jpeg;base64,..."}}` 格式，Claude 使用：
```python
{"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": "<base64>"}}
```

适配器需要扫描 `messages` 中的 content 列表，将 `image_url` 类型的 part 转换为 Claude 的 `source` 格式。

### 5.4 Gemini 的特殊性

Google Gemini 的 `generateContent` 接口有四处差异：

**（1）API key 位置**：不放在 Header 里，而是作为 URL query param：`?key=<api_key>`

**（2）role 映射**：OpenAI 的 `assistant` 在 Gemini 中对应 `model`

**（3）content 格式**：OpenAI 的 `content: "text"` 在 Gemini 中是 `parts: [{"text": "..."}]`

**（4）系统提示独立字段**：类似 Claude，Gemini 的系统提示不在 `contents` 数组中，而是顶层的 `systemInstruction` 字段：
```python
body = {
    "systemInstruction": {"parts": [{"text": system_prompt}]},
    "contents": [  # 不含 system role
        {"role": "model" if m["role"] == "assistant" else "user",
         "parts": [{"text": m["content"]}]}
        for m in non_system_messages
    ]
}
```

### 5.5 Dify 的特殊性

Dify 是一个应用层平台，接口设计与直接调用 LLM 模型有本质不同：

**（1）query 字段而非 messages 数组**：Dify 的 `/chat-messages` 接口只接受当前这条用户输入作为 `query`，对话历史由 Dify 服务端通过 `conversation_id` 维护，不需要客户端传递历史消息列表。

**（2）SSE 流式响应**：接口默认返回 SSE（Server-Sent Events）格式的流式响应，需要逐行解析 `data:` 前缀的 JSON：

```python
async with client.stream("POST", url, json=body, headers=headers) as resp:
    async for line in resp.aiter_lines():
        if not line.startswith("data:"):
            continue
        data = json.loads(line[5:].strip())
        if data.get("event") == "message":
            accumulated += data.get("answer", "")
        elif data.get("event") == "message_end":
            conversation_id = data.get("conversation_id", "")
            break
```

**（3）`conversation_id` 管理**：首次对话不传 `conversation_id`，Dify 会在 `message_end` 事件中返回一个新的 ID。后续对话需要带上这个 ID 才能保持上下文连续性。需要在内存中维护 `user_key → conversation_id` 的映射，程序重启后映射清空，但 Dify 服务端历史仍在，只是无法继续之前的上下文。

**（4）stale conversation_id 处理**：当 Dify 应用被重置或对话历史被删除时，旧的 `conversation_id` 会返回 404。适配器需要捕获 404 响应，清除本地缓存的 ID，并作为新对话重试。

### 5.6 工厂函数：配置驱动的提供商切换

```python
def create_provider(config: ProviderConfig) -> LLMProvider:
    match config.name:
        case "openai" | "qwen" | "grok" | "seed":
            return OpenAICompatProvider(
                provider_name=config.name,
                base_url=config.resolved_base_url(),
                api_key=config.api_key,
            )
        case "claude":
            return ClaudeProvider(api_key=config.api_key)
        case "gemini":
            return GeminiProvider(api_key=config.api_key, model=config.model)
        case "dify":
            return DifyProvider(base_url=config.resolved_base_url(), api_key=config.api_key)
        case _:
            raise ValueError(f"Unknown provider: {config.name}")
```

修改 `config.yaml` 中的 `provider.name` 并重启，即可切换到任意提供商，无需改动其他代码。

---

## 六、端到端消息处理流程

### 6.1 完整数据流

```
微信用户发消息
    │
    ▼
loop.py: run_loop()
    ├─ POST /ilink/bot/getupdates（最长等待 35 秒）
    ├─ 检查 errcode -14 → 触发 pause_session()
    ├─ 更新 get_updates_buf 并写盘
    └─ 过滤 message_type != 1，逐条 enqueue()
                          │
                          ▼
                handler.py: _handle()
                    ├─ allow_from 白名单过滤
                    ├─ POST /ilink/bot/getconfig → 获取 typing_ticket
                    ├─ POST /ilink/bot/sendtyping（status=1，"正在输入"）
                    ├─ 提取文本内容
                    ├─ 若有图片：CDN 下载 → AES 解密 → base64 编码
                    ├─ history.build_messages()（系统提示 + 历史 + 当前消息）
                    ├─ provider.complete(LLMRequest)
                    ├─ history.append_assistant()
                    ├─ split_chunks(reply, chunk_size=1000)
                    ├─ 逐块 POST /ilink/bot/sendmessage（各块间隔 300ms）
                    └─ POST /ilink/bot/sendtyping（status=2，取消输入状态）
```

### 6.2 为什么不做流式推送

iLink 的 `sendmessage` 是一个标准 HTTP 接口，每次调用发送一条完整消息。微信客户端对每条消息有完整的渲染和展示，不存在 Telegram 那种"持续更新同一条消息"的机制。

这意味着即使 LLM 提供商支持流式输出，也无法将 token 级别的增量实时推送给微信用户。当前实现的策略是：等待 LLM 返回完整响应后，按 1000 字为单位分块，多条消息依次发送，以"正在输入"状态作为用户等待期间的反馈。

### 6.3 长回复分块策略

分块时按语义边界优先，依次尝试：`\n\n`（段落边界）→ 句尾标点（`。！？`等）→ 空格 → 强制截断。确保每块不超过 `chunk_size` 字符，且尽量在自然语义处断开。

---

## 七、注意事项

**群聊**：`WeixinMessage` 的类型定义中有 `group_id` 字段，但当前实现仅处理私聊场景。群聊消息是否需要额外权限、发送时是否需要附加 `group_id` 尚未验证。

**历史消息拉取**：iLink 没有提供拉取历史对话记录的接口，`getupdates` 只返回服务端游标之后的新消息。本地历史仅从程序启动后开始记录。

**速率限制**：官方未公开具体的频率限制，当前实现没有主动限速逻辑。如有需要，可在 `send_text` 中增加调用间隔控制。

**`bot_type` 的隐含约束**：登录时固定传递 `bot_type=3`，此参数的含义及与账号类型/套餐的关联未见官方说明，不同账号环境下的行为可能存在差异。

---

## 附：参考资源

- [@tencent-weixin/openclaw-weixin](https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin) — 腾讯官方 iLink 微信渠道插件，本文 iLink API 分析的主要源码依据
- [@tencent-weixin/openclaw-weixin-cli](https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin-cli) — 配套 CLI 安装工具
- [hao-ji-xing/openclaw-weixin](https://github.com/hao-ji-xing/openclaw-weixin) — 社区版 OpenClaw 微信插件，含协议说明与 Demo

---

*本文基于 `@tencent-weixin/openclaw-weixin@1.0.2` 源码阅读与实测，截止 2026 年 3 月。iLink 协议细节可能随版本更新变化，请以官方最新发布为准。*
