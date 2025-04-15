const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');
const readline = require('readline');

// 文件路径配置
const INPUT_FILE = path.join(__dirname, 'files', 'student_scores.txt');
const OUTPUT_DIR = path.join(__dirname, 'files', 'output');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

// 创建输出流
const excellentStream = fs.createWriteStream(path.join(OUTPUT_DIR, 'excellent.txt'));
const goodStream = fs.createWriteStream(path.join(OUTPUT_DIR, 'good.txt'));
const passStream = fs.createWriteStream(path.join(OUTPUT_DIR, 'pass.txt'));
const failStream = fs.createWriteStream(path.join(OUTPUT_DIR, 'fail.txt'));
const summaryStream = fs.createWriteStream(path.join(OUTPUT_DIR, 'summary.txt'));

// 创建转换流 - 处理学生成绩
const processScoreTransform = new Transform({
    objectMode: true, // 启用对象模式
    transform(chunk, encoding, callback) {
        try {
            const line = chunk.toString();
            const [name, ...scores] = line.split(',');
            
            // 解析成绩
            const scoreValues = scores.map(score => {
                const value = parseFloat(score.split(':')[1]);
                return Math.round(value); // 转换为整数
            });

            // 计算平均分
            const average = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;
            const roundedAverage = Math.round(average);

            // 构建输出数据
            const result = {
                name,
                scores: scoreValues,
                average: roundedAverage,
                level: getLevel(roundedAverage)
            };

            this.push(result);
            callback();
        } catch (err) {
            callback(err);
        }
    }
});

// 获取成绩等级
function getLevel(score) {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 60) return 'pass';
    return 'fail';
}

// 创建可读流
const readStream = fs.createReadStream(INPUT_FILE, {
    encoding: 'utf-8',
    highWaterMark: 1024
});

// 创建行读取接口
const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity
});

// 处理状态
let isPaused = false;
let processedCount = 0;

// 监听用户输入以控制暂停/继续
process.stdin.on('data', (data) => {
    const command = data.toString().trim();
    if (command === 'pause') {
        isPaused = true;
        rl.pause();
        console.log('处理已暂停，输入 "resume" 继续');
    } else if (command === 'resume') {
        isPaused = false;
        rl.resume();
        console.log('处理已继续');
    } else if (command === 'exit') {
        cleanup();
        process.exit(0);
    }
});

// 清理资源函数
function cleanup() {
    [excellentStream, goodStream, passStream, failStream, summaryStream].forEach(stream => {
        stream.end();
    });
    rl.close();
    readStream.destroy();
}

// 主处理逻辑
console.log('开始处理学生成绩...');
console.log('可用命令：pause(暂停), resume(继续), exit(退出)');

rl.on('line', (line) => {
    // 使用转换流处理每一行数据
    processScoreTransform.write(line, 'utf-8', () => {
        processedCount++;
        console.log(`已处理 ${processedCount} 条记录`);
    });
});

// 处理转换后的数据
processScoreTransform.on('data', (data) => {
    // 根据等级写入不同文件
    const output = `${data.name}: 平均分 ${data.average} (${data.scores.join(', ')})\n`;
    
    switch (data.level) {
        case 'excellent':
            excellentStream.write(output);
            break;
        case 'good':
            goodStream.write(output);
            break;
        case 'pass':
            passStream.write(output);
            break;
        case 'fail':
            failStream.write(output);
            break;
    }

    // 写入总结文件
    summaryStream.write(
        `${data.name} - 平均分: ${data.average}, 等级: ${data.level}\n`
    );
});

// 错误处理
[readStream, processScoreTransform, excellentStream, goodStream, passStream, failStream, summaryStream].forEach(stream => {
    stream.on('error', (err) => {
        console.error('发生错误:', err.message);
        cleanup();
        process.exit(1);
    });
});

// 处理完成
rl.on('close', () => {
    console.log('所有数据处理完成！');
    cleanup();
}); 