import app from './app.js';

const HOST = process.env.HOST || 'http://127.0.0.1';
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`运行在 ${HOST}:${PORT} 上`);
});
