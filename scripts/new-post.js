#!/usr/bin/env node

import fs from "fs";
import path from "path";

// 获取命令行参数作为标题
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("❌ 请输入文章标题！");
  process.exit(1);
}

const title = args.join(" ");
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const now = new Date();
const isoDate = now.toISOString();

const filePath = path.join("src/data/blog", `${slug}.md`);

const content = `---
title: "${title}"
description: ""
pubDatetime: ${isoDate}
modDatetime: ${isoDate}
author: "Boyu Ren"
slug: "${slug}"
tags: 
draft: false
featured: false
---

写点什么吧～
`;

fs.writeFileSync(filePath, content);
console.log(`✅ 新文章已创建：${filePath}`);
