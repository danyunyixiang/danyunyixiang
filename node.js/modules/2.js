// const fs = require('fs')
// fs.writeFile(new URL('file:///D:/vscode/studing/node.js/files/1.txt'),`能用模板字符串吗?111`,'utf-8',function(err){
//     // URL绝对路径  空格会断？
//     if(err){
//     console.log(err.message)}
//     else{
//         fs.readFile('D:/vscode/studing/node.js/files/1.txt','utf-8',function(err, Datestr){
//             console.log(Datestr)
//         })
//     }
// })

const fs = require('fs')
const { Transform } = require('stream')
const path = require('path')

const fileDir = path.join('D:', 'vscode', 'studing', 'node.js')
//  fileDir ===  __dirname

const readFile = fs.createReadStream(path.join( fileDir , 'stream', 'files', 'destination.txt') )
const writeFile = fs.createWriteStream(path.join( fileDir, 'files', '1.txt'))

class CountStream extends Transform{  //标准式 继承

    //三段式 ㄟ( ▔, ▔ )ㄏ

    // 初始化
    constructor(options = {}) {
        super(options);  //调用父类 Transform 的构造函数，初始化流的相关属性和方法
        this.num = 0; 
    }

    //数据处理中心
    _transform(chunk, encoding ,callback){
        try{
            this.num += chunk.toString().length
            this.push(chunk)
            callback()
        } catch(err) {
            callback(err)
        }

    }

    //收尾
    _flush(callback){
        try{
            this.push(`\n共为${String(this.num)}字符串`)
            callback()
        } catch(err) {
            callback(err)
        }
    }
}

const countStream = new CountStream(); //继承需实例化

//错误处理
countStream.on('err', ()=>{
    console.log(err.message)
    countStream.destroy();
})
writeFile.on('err', ()=>{
    console.log(err.message)
    writeFile.destroy();  //清理资源
})

readFile.pipe(countStream).pipe(writeFile)
