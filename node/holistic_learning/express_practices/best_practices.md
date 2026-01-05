### 本文件是为对express学习文件夹内容

### 文件结构的优化和代码的重构

### 示例

📁 express  
├── 📁 src  
 │ ├── 📁 config # Configuration files (e.g., database, environment variables)  
 │ ├── 📁 controllers # Business logic (handles requests/responses)  
 │ ├── 📁 models # Database models & schemas  
 │ ├── 📁 routes # API route definitions  
 │ ├── 📁 middlewares # Custom middleware (authentication, logging, error handling)  
 │ ├── 📁 services # Business logic or external API interactions  
 │ ├── 📁 utils # Helper functions and utilities  
 │ ├── app.js # Express app setup  
 │ └── server.js # Server initialization  
 ├── .env # Environment variables  
 ├── .gitignore # Files to ignore in version control  
 ├── package.json # Dependencies and scripts  
 ├── README.md # Project documentation

### Studing所使用文件结构

📁 express  
├── 📁 src  
 │ ├── 📁 controllers # 处理响应与回复  
 │ ├── 📁 routes # 路由  
 │ ├── app.js # Express app  
 │ └── server.js # 服务  
 │ └── data.json # 数据储存  
 ├── .env #环境变量  
 ├── .gitignore #git忽略  
 ├── package.json  
 ├── README.md

### 加入数据库后

📁 express  
├── 📁 frontend # 前端部分  
├── 📁 generated # prisma客户端  
├── 📁 prisma # prisma模型  
├── 📁 src  
 │ ├── 📁 controllers # 处理响应与回复  
 │ ├── 📁 libs # 外部工具函数  
 │ ├── 📁 routes # 路由  
 │ ├── 📁 servers # 核心业务逻辑  
 │ ├── app.js # Express app  
 │ └── server.js # 服务  
 ├── .env #环境变量  
 ├── .gitignore #git忽略  
 ├── package.json  
 ├── pnpm-lock.yaml  
 ├── prisma.config.ts
