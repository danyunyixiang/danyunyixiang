---
title: 默认模块
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"
---

apifox编写文档调试完成，没有问题后，导出成Markdown形式

# 默认模块

Base URLs:

* <a href="http://127.0.0.1:3000/">开发环境: http://127.0.0.1:3000/</a>

# prisma_express

## PUT viewCount

PUT /post/{id}/views

浏览量更新计算

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "id": 4,
  "createdAt": "2026-01-01T15:32:36.970Z",
  "updatedAt": "2026-01-01T16:29:55.786Z",
  "title": "Prisma on YouTube",
  "content": "https://pris.ly/youtube",
  "published": false,
  "viewCount": 1,
  "authorId": 3
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» id|integer|true|none||none|
|» createdAt|string|true|none||none|
|» updatedAt|string|true|none||none|
|» title|string|true|none||none|
|» content|string|true|none||none|
|» published|boolean|true|none||none|
|» viewCount|integer|true|none||none|
|» authorId|integer|true|none||none|

# prisma_express/post

## GET post_id

GET /post/{id}

查询post表中指定id数据

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "id": 1,
  "createdAt": "2026-01-01T15:32:34.141Z",
  "updatedAt": "2026-01-01T15:32:34.141Z",
  "title": "Join the Prisma Discord",
  "content": "https://pris.ly/discord",
  "published": true,
  "viewCount": 0,
  "authorId": 1
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» id|integer|true|none||none|
|» createdAt|string|true|none||none|
|» updatedAt|string|true|none||none|
|» title|string|true|none||none|
|» content|string|true|none||none|
|» published|boolean|true|none||none|
|» viewCount|integer|true|none||none|
|» authorId|integer|true|none||none|

## DELETE post_delete

DELETE /post/{id}

删除post表中指定id数据

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "id": 1,
  "createdAt": "2026-01-01T15:32:34.141Z",
  "updatedAt": "2026-01-01T15:32:34.141Z",
  "title": "Join the Prisma Discord",
  "content": "https://pris.ly/discord",
  "published": true,
  "viewCount": 0,
  "authorId": 1
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» id|integer|true|none||none|
|» createdAt|string|true|none||none|
|» updatedAt|string|true|none||none|
|» title|string|true|none||none|
|» content|string|true|none||none|
|» published|boolean|true|none||none|
|» viewCount|integer|true|none||none|
|» authorId|integer|true|none||none|

## GET feed

GET /feed

查询已发布帖子的列表

> 返回示例

> 200 Response

```json
[
  {
    "id": 1,
    "createdAt": "2026-01-01T15:32:34.141Z",
    "updatedAt": "2026-01-01T15:32:34.141Z",
    "title": "Join the Prisma Discord",
    "content": "https://pris.ly/discord",
    "published": true,
    "viewCount": 0,
    "authorId": 1,
    "author": {
      "id": 1,
      "email": "alice@prisma.io",
      "name": "Alice"
    }
  },
  {
    "id": 2,
    "createdAt": "2026-01-01T15:32:35.585Z",
    "updatedAt": "2026-01-01T15:32:35.585Z",
    "title": "Follow Prisma on Twitter",
    "content": "https://www.twitter.com/prisma",
    "published": true,
    "viewCount": 0,
    "authorId": 2,
    "author": {
      "id": 2,
      "email": "nilu@prisma.io",
      "name": "Nilu"
    }
  },
  {
    "id": 3,
    "createdAt": "2026-01-01T15:32:36.970Z",
    "updatedAt": "2026-01-01T15:32:36.970Z",
    "title": "Ask a question about Prisma on GitHub",
    "content": "https://www.github.com/prisma/prisma/discussions",
    "published": true,
    "viewCount": 0,
    "authorId": 3,
    "author": {
      "id": 3,
      "email": "mahmoud@prisma.io",
      "name": "Mahmoud"
    }
  }
]
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» id|integer|true|none||none|
|» createdAt|string|true|none||none|
|» updatedAt|string|true|none||none|
|» title|string|true|none||none|
|» content|string|true|none||none|
|» published|boolean|true|none||none|
|» viewCount|integer|true|none||none|
|» authorId|integer|true|none||none|
|» author|object|true|none||none|
|»» id|integer|true|none||none|
|»» email|string|true|none||none|
|»» name|string|true|none||none|

# prisma_express/user

## GET user

GET /users

查询所有用户

> 返回示例

> 200 Response

```json
[
  {
    "id": 1,
    "email": "alice@prisma.io",
    "name": "Alice"
  },
  {
    "id": 2,
    "email": "nilu@prisma.io",
    "name": "Nilu"
  },
  {
    "id": 3,
    "email": "mahmoud@prisma.io",
    "name": "Mahmoud"
  }
]
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» id|integer|true|none||none|
|» email|string|true|none||none|
|» name|string|true|none||none|

## GET user_id_drafts

GET /user/{id}/drafts

由于指定 published: false,所以部分id返回内容可能为空

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|string| 是 |none|

> 返回示例

> 200 Response

```json
[
  {
    "id": 4,
    "createdAt": "2026-01-01T15:32:36.970Z",
    "updatedAt": "2026-01-01T15:32:36.970Z",
    "title": "Prisma on YouTube",
    "content": "https://pris.ly/youtube",
    "published": false,
    "viewCount": 0,
    "authorId": 3
  }
]
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» id|integer|false|none||none|
|» createdAt|string|false|none||none|
|» updatedAt|string|false|none||none|
|» title|string|false|none||none|
|» content|string|false|none||none|
|» published|boolean|false|none||none|
|» viewCount|integer|false|none||none|
|» authorId|integer|false|none||none|

# prisma_express/user_action

## POST signup

POST /signup

注册

> Body 请求参数

```json
{
  "name": "荀沐辰",
  "email": "izhlq4_g3066@yahoo.cn",
  "posts": [
    {
      "title": "仿佛很净聪明箱子马虎靠近顺便说一下",
      "content": "et reprehenderit magna aliqua"
    },
    {
      "title": "协助书架当撕细代表除了",
      "content": "eu adipisicing reprehenderit fugiat sint"
    }
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» name|body|string| 是 |用户的姓名|
|» email|body|string(email)| 是 |用户的电子邮件地址|
|» posts|body|[object]| 是 |用户关联的文章列表|
|»» title|body|string| 是 |文章的标题|
|»» content|body|string| 是 |文章的内容|

> 返回示例

> 200 Response

```json
{
  "id": 4,
  "email": "izhlq4_g3066@yahoo.cn",
  "name": "荀沐辰"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» id|integer|true|none||none|
|» email|string|true|none||none|
|» name|string|true|none||none|

## POST post

POST /post

发表上传文章，根据authorEmail对齐

> Body 请求参数

```json
{
  "title": "在类比哇鉴于由",
  "content": "in qui",
  "authorEmail": "izhlq4_g3066@yahoo.cn"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|
|» title|body|string| 是 |帖子的标题|
|» content|body|string| 是 |帖子的内容|
|» authorEmail|body|string| 是 |作者的电子邮件地址，用于关联作者|

> 返回示例

> 200 Response

```json
{
  "id": 7,
  "createdAt": "2026-01-01T16:25:41.242Z",
  "updatedAt": "2026-01-01T16:25:41.242Z",
  "title": "在类比哇鉴于由",
  "content": "in qui",
  "published": false,
  "viewCount": 0,
  "authorId": 4
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» id|integer|true|none||none|
|» createdAt|string|true|none||none|
|» updatedAt|string|true|none||none|
|» title|string|true|none||none|
|» content|string|true|none||none|
|» published|boolean|true|none||none|
|» viewCount|integer|true|none||none|
|» authorId|integer|true|none||none|

## PUT publlish_change

PUT /publish/{id}

切换帖子发布状态

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "id": 4,
  "createdAt": "2026-01-01T15:32:36.970Z",
  "updatedAt": "2026-01-01T16:40:43.816Z",
  "title": "Prisma on YouTube",
  "content": "https://pris.ly/youtube",
  "published": true,
  "viewCount": 1,
  "authorId": 3
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» id|integer|true|none||none|
|» createdAt|string|true|none||none|
|» updatedAt|string|true|none||none|
|» title|string|true|none||none|
|» content|string|true|none||none|
|» published|boolean|true|none||none|
|» viewCount|integer|true|none||none|
|» authorId|integer|true|none||none|



