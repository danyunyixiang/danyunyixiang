const express = require('express'); // 引入 Express 框架，用于构建 Web 应用
const fs = require('fs'); // 引入 Node.js 文件系统模块，用于读写文件
const path = require('path'); // 引入 Node.js 路径处理模块，用于处理文件和目录路径
const cors = require('cors'); // 引入 CORS 中间件，用于处理跨域资源共享
const multer = require('multer'); // 引入 Multer 中间件，专门用于处理 multipart/form-data 类型的表单数据，常用于文件上传

const app = express(); // 创建 Express 应用实例
const port = 3001; // 定义服务器运行的端口号，选择 3001 以避免与其他示例冲突

// --- 中间件配置 ---
app.use(cors()); // 启用 CORS 中间件，允许来自任何源的跨域请求。生产环境中应配置具体的允许来源。
app.use(express.json()); // 启用 Express 内置的 JSON 解析中间件，用于解析请求体中的 JSON 数据 (Content-Type: application/json)

// 配置静态文件服务，用于托管上传的头像文件
// 这样前端就可以通过类似 http://localhost:3001/uploads/avatar-123.jpg 的 URL 访问上传的图片
// express.static() 中间件将指定目录下的文件对外提供访问
// path.join(__dirname, '..', 'uploads') 计算出 'ajax/uploads' 目录的绝对路径
// 第一个参数 '/uploads' 指定了 URL 访问时的前缀
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


// --- 数据存储配置 ---
// 定义用户数据 JSON 文件的存储路径 (ajax/json/4.json)
const dataFilePath = path.join(__dirname, '..', 'json', '4.json');
// 定义文件上传的目标目录 (ajax/uploads)
const uploadsDir = path.join(__dirname, '..', 'uploads');

// --- 初始化存储 --- (确保目录和文件存在)
function initializeStorage() {
    // 检查上传目录是否存在
    if (!fs.existsSync(uploadsDir)) {
        try {
            // 如果不存在，则递归创建目录 (recursive: true 允许创建嵌套目录)
            fs.mkdirSync(uploadsDir, { recursive: true });
            console.log(`上传目录已创建: ${uploadsDir}`);
        } catch (err) {
            console.error('创建上传目录时出错:', err);
            // 如果创建失败，则退出进程，因为文件上传功能将无法工作
            process.exit(1);
        }
    }

    // 检查用户数据 JSON 文件是否存在
    if (!fs.existsSync(dataFilePath)) {
        try {
            // 如果不存在，则创建文件并写入默认的用户数据结构
            const defaultData = {
                email: 'test@example.com',
                nickname: '默认用户',
                gender: 2, // 性别: 0 男性, 1 女性, 2 保密
                intro: '这个人很懒，什么都没留下...',
                avatar: '/img/avatar.png' // 默认头像路径 (相对于前端项目或静态资源)
                                         // 注意: 这里的默认路径可能需要根据前端实际情况调整
                                         // 或者初始设为 null
            };
            // 将默认数据对象转换为格式化的 JSON 字符串并写入文件
            // JSON.stringify(obj, null, 2) 会生成带缩进的美观 JSON 格式
            fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2), 'utf8');
            console.log(`用户数据文件已创建并写入默认数据: ${dataFilePath}`);
        } catch (err) {
            console.error('创建默认数据文件时出错:', err);
            // 如果创建失败，则退出进程
            process.exit(1);
        }
    }
}

// --- 数据读写辅助函数 ---

// 从 JSON 文件读取用户数据
function readUserData() {
    try {
        // 同步读取文件内容，指定编码为 utf8
        const data = fs.readFileSync(dataFilePath, 'utf8');
        // 将读取到的 JSON 字符串解析为 JavaScript 对象
        return JSON.parse(data);
    } catch (err) {
        console.error('读取用户数据文件时出错:', err);
        // 如果读取失败（例如文件损坏或不存在），返回一个空/默认对象，防止后续代码出错
        return { email: '', nickname: '', gender: null, intro: '', avatar: null };
    }
}

// 将用户数据写入 JSON 文件
function writeUserData(data) {
    try {
        // 同步将 JavaScript 对象转换为格式化的 JSON 字符串并写入文件
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
        // 写入成功返回 true
        return true;
    } catch (err) {
        console.error('写入用户数据文件时出错:', err);
        // 写入失败返回 false
        return false;
    }
}


// --- Multer 配置 (用于处理头像上传) ---
// 配置磁盘存储引擎 (DiskStorage)
const storage = multer.diskStorage({
    // destination: 指定文件存储的目录
    destination: function (req, file, cb) {
        // cb 是一个回调函数，第一个参数是错误对象 (null 表示没有错误)，第二个参数是存储路径
        cb(null, uploadsDir); // 将文件保存在之前定义的 uploadsDir (ajax/uploads)
    },
    // filename: 指定存储的文件名
    filename: function (req, file, cb) {
        // 生成一个相对唯一的文件名，避免重名覆盖
        // 包含字段名、当前时间戳、一个随机数和原始文件的扩展名
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname); // 获取原始文件的扩展名 (例如 '.jpg')
        // 组合成最终文件名，例如: 'avatar-1678886400000-123456789.jpg'
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

// 配置文件过滤器
const fileFilter = (req, file, cb) => {
    // 如果文件类型以 'image/' 开头，则接受上传
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        // 如果文件类型不匹配，则拒绝上传
        // 创建一个错误对象传递给回调函数，Multer 会捕获这个错误
        cb(new Error('仅支持上传图片文件!'), false);
    }
};

// 创建 Multer 实例并应用配置
const upload = multer({
    storage: storage, // 使用上面定义的磁盘存储引擎
    fileFilter: fileFilter, // 使用上面定义的文件过滤器
    limits: { // 配置上传限制
        fileSize: 5 * 1024 * 1024 // 限制文件大小为 5MB (字节数)
    }
}).single('avatar'); // 配置 Multer 只处理名为 'avatar' 的单个文件字段
                     // 这需要前端上传文件时，FormData 中的字段名是 'avatar'


// --- API 路由定义 ---

// GET /user-info - 获取当前用户信息
app.get('/user-info', (req, res) => {
    console.log('GET /user-info 请求');
    // 调用辅助函数读取用户数据
    const userData = readUserData();
    // 将用户数据以 JSON 格式发送回客户端
    res.json(userData);
});

// POST /user-info - 更新用户信息 (不包括头像)
app.post('/user-info', (req, res) => {
    console.log('POST /user-info 请求, body:', req.body);
    // 从解析后的请求体 (req.body) 中解构出需要的数据
    const { email, nickname, gender, intro } = req.body;

    // 进行基本的服务器端验证
    if (typeof email !== 'string' || typeof nickname !== 'string' || gender === undefined || typeof intro !== 'string') {
        // 如果数据类型或字段缺失，返回 400 Bad Request 错误
        return res.status(400).json({ message: '请求数据格式不正确或缺少字段' });
    }
    // 检查必填项是否为空 (去除前后空格后判断)
     if (!email.trim() || !nickname.trim()) {
        return res.status(400).json({ message: '邮箱和昵称不能为空' });
    }

    // 读取当前的用户数据
    const currentUserData = readUserData();

    // 创建更新后的用户数据对象
    const updatedUserData = {
        ...currentUserData, // 使用展开语法 (...) 复制当前所有数据，确保头像等其他信息保留
        email: email.trim(), // 更新 email (去除空格)
        nickname: nickname.trim(), // 更新 nickname (去除空格)
        gender: parseInt(gender, 10), // 将 gender 转换为数字类型存储
        intro: intro.trim() // 更新 intro (去除空格)
    };

    // 调用辅助函数将更新后的数据写入文件
    if (writeUserData(updatedUserData)) {
        // 如果写入成功，返回成功的消息和更新后的用户数据
        res.json({ message: '用户信息更新成功', userData: updatedUserData });
    } else {
        // 如果写入失败，返回 500 Internal Server Error 错误
        res.status(500).json({ message: '更新用户信息时写入文件失败' });
    }
});

// POST /avatar-img - 上传用户头像
app.post('/avatar-img', (req, res) => {
    console.log('POST /avatar-img 请求');

    // 调用 Multer 中间件来处理文件上传
    // upload 是一个函数，它会处理请求中的文件，并将结果或错误传递给回调函数
    upload(req, res, function (err) {
        // 首先处理 Multer 可能产生的错误
        if (err instanceof multer.MulterError) {
            console.error('Multer 错误:', err);
            // 如果是文件大小超限错误
             if (err.code === 'LIMIT_FILE_SIZE') {
                 return res.status(400).json({ message: '文件过大，请上传小于 5MB 的图片' });
             }
             // 其他 Multer 错误 (例如字段名不匹配)
            return res.status(400).json({ message: `文件上传错误: ${err.message}` });
        } else if (err) {
            // 处理其他非 Multer 错误 (例如文件过滤器返回的错误)
            console.error('未知上传错误:', err);
            return res.status(400).json({ message: err.message || '上传失败，请检查文件类型' });
        }

        // 检查文件是否成功上传
        // 如果 upload 成功，文件信息会被添加到 req.file 对象中
        if (!req.file) {
            // 如果没有文件被上传 (可能是前端没有发送文件或字段名错误)
            return res.status(400).json({ message: '未检测到上传的文件' });
        }

        // 文件上传成功
        console.log('文件上传成功:', req.file);

        // 更新 JSON 文件中的头像路径
        const currentUserData = readUserData();
        // 构建前端可访问的相对路径 (基于之前配置的静态服务)
        const newAvatarPath = `/uploads/${req.file.filename}`;

        // 可选: 删除旧头像文件 (如果存在且不是默认头像)
        // 检查当前头像路径是否存在，不是默认路径，并且是 /uploads/ 开头的（表示是之前上传的）
        if (currentUserData.avatar && currentUserData.avatar !== '/img/avatar.png' && currentUserData.avatar.startsWith('/uploads/')) {
             // 从路径中提取旧文件名
             const oldAvatarFileName = path.basename(currentUserData.avatar);
             // 构建旧文件的完整服务器路径
             const oldAvatarFullPath = path.join(uploadsDir, oldAvatarFileName);
             // 检查旧文件是否存在于服务器上
             if (fs.existsSync(oldAvatarFullPath)) {
                 // 异步删除旧文件
                 fs.unlink(oldAvatarFullPath, (unlinkErr) => {
                     if (unlinkErr) {
                         // 删除失败，仅记录错误，不中断流程
                         console.error('删除旧头像失败:', unlinkErr);
                     } else {
                         console.log('旧头像已删除:', oldAvatarFullPath);
                     }
                 });
             }
        }

        // 创建包含新头像路径的用户数据对象
        const updatedUserData = {
            ...currentUserData, // 复制其他用户信息
            avatar: newAvatarPath // 更新头像路径为新上传文件的访问路径
        };

        // 将更新后的数据写入 JSON 文件
        if (writeUserData(updatedUserData)) {
            // 写入成功，返回成功消息和新的头像路径
            // 将新路径返回给前端，方便前端立即更新头像预览
            res.json({
                message: '头像上传成功',
                avatarPath: newAvatarPath
            });
        } else {
            // 写入失败，返回 500 错误
            res.status(500).json({ message: '头像信息写入文件失败' });
        }
    });
});


// --- 初始化并启动服务器 ---
initializeStorage(); // 在服务器启动前，执行初始化检查，确保目录和文件就绪

// 启动 Express 应用，监听指定的端口
app.listen(port, () => {
    // 服务器成功启动后，在控制台输出提示信息
    console.log(`个人信息设置后端服务运行在 http://localhost:${port}`);
}); 