const fs = require('fs')
const path = require('path')

// 经典示例：setTimeout
function delayedLog(message, callback) {
    setTimeout(() => {
      console.log(message)
      callback() // 条件满足时调用回调
    }, 1000)
  }
  
  delayedLog('Hello', () => {console.log('回调执行了！')})


//   Node.js 错误优先约定
function readJSON(filename, callback) {
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) return callback(err) // 错误优先
  
    try {
      const parsed = JSON.parse(data)
      callback(null, parsed) // 成功返回 null
    } catch (e) {
      callback(e)
    }
  })
}
/*
错误处理三原则：
永远检查第一个参数
使用 return 阻止后续执行
同步操作用 try/catch 包裹
*/

fs.stat(path.join(__dirname, '../要点.md'),(err,file) => {
  if(err) console.log(err.message);
   
  console.log(`文件大小: ${file.size}字节`);
  console.log(`是否为文件: ${file.isFile()}`);
  console.log(`是否为目录: ${file.isDirectory()}`);
  console.log(`创建时间: ${file.birthtime}`);
  console.log(`修改时间: ${file.mtime}`);
})

//创建单层目录
fs.mkdir(path.join(__dirname, '../fs', 'makingdir'), e => {if(e) console.log(e.message)})

//读取目录内容
fs.readdir(path.join(__dirname, '../'), (e,files) => {
  if(e) console.log(e.message)
  console.log(files); //files为数组
})

//检查文件存在
if(fs.existsSync(path.join(__dirname, '../files', '1.txt'))){
//复制文件
fs.copyFile(path.join(__dirname, '../files', 'copy.txt'), path.join(__dirname, '../files', '1.txt'), err => {
  console.log(err.message);
})
}