import express from 'express';
import cors from 'cors';
import router from './routes/data_routes.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use('', router);
// 使用路由前缀，便于版本管理
// app.use('/v1', router);

export default app;
