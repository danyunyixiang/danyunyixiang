# node学习记录

## Terminal命令

1. node+文件名 => 运行指定文件
2. 直接输入node，可以在terminal中编写执行javascript代码，通过ctrl+d退出
3. node --watch server.js <==> nodemon server.js

## ES模块

ES模块在导入时都是异步的/common js(不用)则为同步的。

```js
//导入示例
import * as fs from 'node:fs';
import * as fs from 'node:fs/promises';
```
