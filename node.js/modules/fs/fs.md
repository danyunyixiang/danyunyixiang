## Node.js fs 模块详解

### 文件操作

#### 同步 vs 异步

```javascript
// 同步读取
const data = fs.readFileSync("file.txt", "utf8");

// 异步读取
fs.readFile("file.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Promise方式（Node.js 10+）
const { promises: fsPromises } = require("fs");
async function readFile() {
  const data = await fsPromises.readFile("file.txt", "utf8");
  console.log(data);
}
```

#### 常用文件操作

1. **读取文件**

   ```javascript
   // 完整读取
   fs.readFile("file.txt", "utf8", (err, data) => {});

   // 流式读取（适合大文件）
   const readStream = fs.createReadStream("file.txt", {
     encoding: "utf8",
     highWaterMark: 64 * 1024, // 64KB块
   });

   readStream.on("data", (chunk) => {
     console.log(chunk);
   });
   ```

2. **写入文件**

   ```javascript
   // 完整写入（覆盖）
   fs.writeFile("file.txt", "Hello World", (err) => {});

   // 追加内容
   fs.appendFile("file.txt", "\nNew Line", (err) => {});

   // 流式写入
   const writeStream = fs.createWriteStream("file.txt");
   writeStream.write("数据块1");
   writeStream.write("数据块2");
   writeStream.end();
   ```

3. **文件复制**

   ```javascript
   // 使用流（高效方式）
   fs.createReadStream("source.txt").pipe(
     fs.createWriteStream("destination.txt")
   );

   // 简单方式
   fs.copyFile("source.txt", "destination.txt", (err) => {});
   ```

4. **文件信息**

   ```javascript
   fs.stat("file.txt", (err, stats) => {
     console.log(`文件大小: ${stats.size}字节`);
     console.log(`是否为文件: ${stats.isFile()}`);
     console.log(`是否为目录: ${stats.isDirectory()}`);
     console.log(`创建时间: ${stats.birthtime}`);
     console.log(`修改时间: ${stats.mtime}`);
   });
   ```

5. **文件存在检查**

   ```javascript
   // 推荐方式
   fs.access("file.txt", fs.constants.F_OK, (err) => {
     console.log(err ? "不存在" : "存在");
   });

   // 非推荐方式(已废弃)
   if (fs.existsSync("file.txt")) {
     console.log("文件存在");
   }
   ```

### 目录操作

1. **创建目录**

   ```javascript
   // 创建单层目录
   fs.mkdir("newDir", (err) => {});

   // 递归创建多层目录
   fs.mkdir("parent/child/grandchild", { recursive: true }, (err) => {});
   ```

2. **读取目录内容**

   ```javascript
   fs.readdir("directory", (err, files) => {
     files.forEach((file) => {
       console.log(file);
     });
   });

   // 包含文件类型信息
   fs.readdir("directory", { withFileTypes: true }, (err, dirents) => {
     dirents.forEach((dirent) => {
       console.log(`${dirent.name}: ${dirent.isFile() ? "文件" : "目录"}`);
     });
   });
   ```

3. **递归遍历目录**

   ```javascript
   function walkDir(dir) {
     fs.readdirSync(dir).forEach((file) => {
       const fullPath = path.join(dir, file);
       if (fs.statSync(fullPath).isDirectory()) {
         walkDir(fullPath);
       } else {
         console.log(fullPath);
       }
     });
   }
   ```

4. **监视文件变化**
   ```javascript
   fs.watch("file.txt", (eventType, filename) => {
     console.log(`文件${filename}发生了${eventType}事件`);
   });
   ```

### 文件系统标记

```javascript
// 文件打开模式
// 'r': 读取 (默认)
// 'w': 写入 (创建或覆盖)
// 'a': 追加
// 'r+': 读写
// 'w+': 读写 (创建或覆盖)
// 'a+': 读取和追加

const file = fs.openSync("file.txt", "r+");
```

### 实用技巧

1. **流式处理大文件**

   ```javascript
   const readStream = fs.createReadStream("bigfile.txt");
   const writeStream = fs.createWriteStream("output.txt");

   // 基本管道
   readStream.pipe(writeStream);

   // 数据转换
   const { Transform } = require("stream");
   const uppercase = new Transform({
     transform(chunk, encoding, callback) {
       callback(null, chunk.toString().toUpperCase());
     },
   });

   readStream.pipe(uppercase).pipe(writeStream);
   ```

2. **临时文件操作**

   ```javascript
   const os = require("os");
   const path = require("path");

   const tempFile = path.join(os.tmpdir(), "temp-" + Date.now());
   fs.writeFileSync(tempFile, "Temporary data");
   // 使用完后删除
   fs.unlinkSync(tempFile);
   ```

3. **文件锁定与原子操作**
   ```javascript
   // 使用appendFile实现原子写入
   fs.appendFile("log.txt", "New log entry\n", { flag: "a" }, (err) => {});
   ```

### 最佳实践

1. **总是处理错误**

   ```javascript
   fs.readFile("file.txt", (err, data) => {
     if (err) {
       if (err.code === "ENOENT") {
         console.error("文件不存在");
       } else {
         console.error("其他错误:", err);
       }
       return;
     }
     console.log(data);
   });
   ```

2. **使用相对路径时注意工作目录**

   ```javascript
   const path = require("path");
   const filePath = path.join(__dirname, "files", "data.txt");
   ```

3. **大文件操作选择流**

   ```javascript
   // 不要这样做
   // const largeFile = fs.readFileSync('huge.log');

   // 应该这样做
   const readStream = fs.createReadStream("huge.log");
   ```

4. **使用 fsPromises 简化异步代码**

   ```javascript
   const { promises: fsPromises } = require("fs");

   async function processFile() {
     try {
       await fsPromises.mkdir("output", { recursive: true });
       const data = await fsPromises.readFile("input.txt", "utf8");
       await fsPromises.writeFile("output/result.txt", data.toUpperCase());
     } catch (err) {
       console.error("处理失败:", err);
     }
   }
   ```
