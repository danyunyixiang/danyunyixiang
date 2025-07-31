# 使用事项

## package.json

```json
  "devDependencies": {
    "webpack": "^5.101.0",
    "webpack-cli": "^6.0.1"
  }
```

dev代表开发环境，

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"
  },
```

其中scripts下为自定义命令，在terminal中 < npm run xxx > 启动



## webpack.package.js

默认为common js模块，当其为webpack.package.mjs或package.json中设置"type"="module"时，视为ES模块。

```js
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  }
```

