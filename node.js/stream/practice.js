
// 1.从一个大文件( student_scores.txt)中读取学生成绩数据
// 2.对数据进行如下处理：
// ·将所有成绩转换为整数
// ·计算每个学生的平均分
// ·将成绩按照分数段分类(优秀:≥90,良好:80-89,及格,60-79,不及格:<60)
// 3.将处理后的数据写入不同的文件
// 4.实现暂停/继续处理的功能
// 5.添加适当的错误处理和日志记录

//一版  没用上流式处理的特性  

//不对。是没用上pipe管道


const fs = require('fs');
const path = require('path');

const baseDir = path.join('D:', 'vscode', 'studing', 'node.js', 'stream' ,'files');
// baseDir === path.join(__dirname, 'files')
const readstream = fs.createReadStream(path.join(__dirname, 'files', 'student_scores.txt'))
const writestream = fs.createWriteStream(path.join(__dirname, 'files', 'destination.txt'))
//  D:\vscode\studing\node.js\stream\student_scores.txt

readstream
    .on('error',err => console.log(err.message))
        
    .on('data',(chunk) => { 
try{
    //chunk 为Buffer对象  需转换为string
    const students = chunk.toString().split('\r\n')

    const average = []
    const output = []
    students.forEach(item => {     //分人
        const dataarr = item.split(',')
        //分name，成绩
        let name = null
        const grate = {
            subject:[],
            num:[],
            level:[]
        }
        // const {subject, num, level} => 
        // grate.subject => subject 
        // grate.num => num
        // grate.level => level
        for(let i = 0; i<dataarr.length; i++){
            if(i === 0){  //根据传入数据结构
                name = dataarr[i]
            }else{
                grate.subject.push( dataarr[i].split(':')[0] )
                grate.num.push(parseInt( dataarr[i].split(':')[1] ))
            }
        }

        //分等级函数
        grate.level = grate.num.map(item => {
            if(item < 60) return '不及格'
            if(item < 80) return '及格'
            if(item < 90) return '良好'
            return '优秀'
        })
        //成绩划分等级
        const student = []
        student.push(name)
        for(let i = 0; i<(dataarr.length - 1); i++){
            student.push( grate.subject[i] + ':' + grate.level[i] )
        }
        output.push(student.join(','))

        //处理平均成绩
        // let totalnum = 0
        // grate.num.forEach(gratenum => {totalnum += gratenum})
        // average.push( (totalnum/grate.num.length).toFixed(1) )
        average.push( (grate.num.reduce((a, b) => a+b, 0)/grate.num.length).toFixed(1) )

    });

    //最后 追加平均成绩
    const final = []
    for(let i = 0; i < students.length; i++){
        final.push(`${output[i]}{平均成绩${average[i]}}`)
        // output[i] + '{' +'平均成绩:' + average[i] + '}'
    }
    writestream.write( final.join('\r\n') )
} catch(e) {  //错误处理
    console.log(e.message)
}
})







