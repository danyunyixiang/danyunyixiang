//fs模块
const fs = require('fs')
const path = require('path')



//写 创个文件
fs.writeFile(path.join(__dirname, 'files', '成绩fin.txt'),'A=80 B=87 C=94 D=85 E=92',function(err){
    if(err)console.log(err);
})
//读
fs.readFile(path.join(__dirname, 'files', '成绩ori.txt'),'utf-8',function(err, ori){  
    //
    if(err)console.log(err.message);

    // 文件内容处理
    const fin = ori.split(' ').map(item => {
        return item.replace('=',':')
    }).join(',\n') + '。'  // + 拼接字符串



    console.log(`中间过程
        1:${ori.split(' ')}
        2:${ori.split(' ').map(item => {return item.replace('=',':')})}`
    );
    
    //写入
    fs.writeFile('./node.js/files/成绩fin.txt', `${fin}`, function(err){
        if(err)console.log(err.message);
        console.log(`读取最终写入文件:\n${fin}`)
    })
    
})

