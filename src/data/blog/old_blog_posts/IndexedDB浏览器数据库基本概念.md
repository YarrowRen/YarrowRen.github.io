---
author: Boyu Ren
pubDatetime: &id001 2022-01-24 17:15:29
modDatetime: *id001
title: IndexedDB 浏览器数据库基本概念
slug: IndexedDB浏览器数据库基本概念
featured: false
draft: false
tags:
- IndexedDB
description: IndexedDB 是浏览器内置的本地数据库，适合复杂数据场景。文章介绍其基本概念、数据库创建与升级流程，并通过 Vue 示例演示 CRUD 操作。
---

参考文档：  
https://www.cnblogs.com/chenjun1/p/11644866.html

---

# IndexedDB 基本概念

**IndexedDB** 是浏览器内置的本地数据库方案，主要用于在客户端存储大量结构化数据。它具有以下特点：

- 基于 **Key-Value** 的对象存储（Object Store）
- 支持 **事务（Transaction）**
- 支持 **索引（Index）**，可高效查询
- 异步 API，不阻塞主线程
- 数据持久化，浏览器关闭后数据仍然存在

IndexedDB 更适合复杂数据场景（如离线应用、缓存系统、大量结构化数据存储），相比 `localStorage` 和 `sessionStorage` 更强大。

---

## 核心概念速览

| 概念 | 说明 |
|---|---|
| Database | 数据库实例，一个站点可有多个数据库 |
| ObjectStore | 类似关系型数据库中的“表” |
| KeyPath | 主键字段 |
| Index | 索引，用于高效查询 |
| Transaction | 事务，所有操作必须在事务中完成 |
| Request | 异步操作请求对象 |

---

## 数据库创建与升级

```js
const request = indexedDB.open('myDatabase')
let db
````

* 第一个参数：数据库名称
* 第二个参数（可选）：数据库版本号（整数）

### 打开数据库成功

```js
request.onsuccess = function (event) {
  db = request.result
  console.log('数据库打开成功')
}
```

### 打开数据库失败

```js
request.onerror = function (event) {
  console.log('数据库打开报错')
}
```

### 数据库升级（或首次创建）

```js
request.onupgradeneeded = function (event) {
  db = event.target.result
  let objectStore

  if (!db.objectStoreNames.contains('person')) {
    objectStore = db.createObjectStore('person', { keyPath: 'id' })
    objectStore.createIndex('name', 'name', { unique: false })
    objectStore.createIndex('email', 'email', { unique: true })
  }
}
```

说明：

* `onupgradeneeded` 在 **首次创建数据库** 或 **版本号变更** 时触发
* `objectStore` 相当于一张表
* `keyPath` 指定主键
* `createIndex` 用于创建索引（可唯一 / 非唯一）

---

## Vue 示例：IndexedDB CRUD 操作

以下示例基于 Vue 3 + `<script setup>` 语法。

### 模板结构

```html
<template>
  <div class="scroll-y">
    <div class="mb-2">IndexDbDemo.vue</div>

    <button @click="addData()">增加数据</button>
    <br /><br />
    <button @click="updateData()">编辑数据</button>
    <br /><br />
    <button @click="deleteData()">删除数据</button>
    <br /><br /><br />
    <button @click="findData()">查找数据</button>

    <div class="mt-2">显示的数据</div>
    <div>{{ personData }}</div>
  </div>
</template>
```

---

## 新增数据（Add）

```js
const addData = () => {
  let request = db
    .transaction(['person'], 'readwrite')
    .objectStore('person')
    .add({ id: 1, name: '张三', age: 24, email: 'zhangsan@example.com' })

  request.onsuccess = () => {
    console.log('数据写入成功')
  }

  request.onerror = () => {
    console.log('数据写入失败')
  }
}
```

说明：

* `transaction(['person'], 'readwrite')` 表示开启写事务
* `add()` 用于新增数据（主键重复会失败）

---

## 查询数据（Get）

```js
const findData = () => {
  let transaction = db.transaction(['person'])
  let objectStore = transaction.objectStore('person')
  let request = objectStore.get(1)

  request.onsuccess = () => {
    if (request.result) {
      state.personData = request.result
      console.log(request.result)
    } else {
      console.log('未获得数据记录')
    }
  }

  request.onerror = () => {
    console.log('事务失败')
  }
}
```

---

## 更新数据（Put）

```js
const updateData = () => {
  let request = db
    .transaction(['person'], 'readwrite')
    .objectStore('person')
    .put({ id: 1, name: '李四', age: 35, email: 'lisi@example.com' })

  request.onsuccess = () => {
    console.log('数据更新成功')
  }

  request.onerror = () => {
    console.log('数据更新失败')
  }
}
```

说明：

* `put()`：存在则更新，不存在则新增
* 与 `add()` 的区别在于是否允许覆盖主键

---

## 删除数据（Delete）

```js
const deleteData = () => {
  let request = db
    .transaction(['person'], 'readwrite')
    .objectStore('person')
    .delete(1)

  request.onsuccess = () => {
    console.log('数据删除成功')
  }
}
```

---

## 响应式数据绑定

```js
import { reactive, toRefs } from 'vue'

let state = reactive({
  personData: {}
})

const { personData } = toRefs(state)
```

---

## 使用 IndexedDB 的注意事项

1. **所有操作必须在事务中完成**
2. **API 全部是异步的**
3. 数据库结构只能在 `onupgradeneeded` 中修改
4. IndexedDB 更适合大数据量与复杂结构
5. 不同浏览器实现细节略有差异，需注意兼容性

---

## 总结

IndexedDB 是浏览器端最强大的本地存储方案，适用于：

* 离线应用
* 本地缓存系统
* 客户端数据库
* 大规模结构化数据存储

---

我的博客即将同步至腾讯云开发者社区，欢迎一同交流：
[https://cloud.tencent.com/developer/support-plan?invite_code=tnjsrr6rwrrk](https://cloud.tencent.com/developer/support-plan?invite_code=tnjsrr6rwrrk)

<!-- 2026.01.28由GPT5.2优化全文 -->