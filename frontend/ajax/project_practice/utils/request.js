// axios 公共配置
// 基地址
axios.defaults.baseURL = 'https://geek.itheima.net';

// 拦截器：对axios进行统一配置

// 所有axios请求头中的config配置
axios.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么;
    const token = localStorage.getItem('token');
    token ? (config.headers.Authorization = `Bearer ${token}`) : null;

    return config;
  },
  (err) => {
    // 对请求错误做些什么
    return Promise.reject(err);
  }
);

// 在所有的axios中then/catch之前执行
axios.interceptors.response.use(
  (res) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么

    // 优化/预处理
    const re = res.data;
    return re;
  },
  (err) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么

    // token错误
    // console.log(err);
    if (err?.response?.status === 401) {
      alert('身份验证失败或过期');
      localStorage.removeItem('token');
      location.href = '../login/index.html';
    }
    return Promise.reject(err);
  }
);
