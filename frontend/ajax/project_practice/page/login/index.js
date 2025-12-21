/**
 * 目标1：验证码登录
 * 1.1 在 utils/request.js 配置 axios 请求基地址
 * 1.2 收集手机号和验证码数据
 * 1.3 基于 axios 调用验证码登录接口
 * 1.4 使用 Bootstrap 的 Alert 警告框反馈结果给用户
 */
const button = document.querySelector('.login-form > div.item > button.btn');

button.addEventListener('click', () => {
  // const a = document.querySelectorAll('.login-form > div.item > input');
  // const a = document.querySelectorAll('form-control');

  // const [mobile, code] = document
  //   .querySelectorAll('.login-form > div.item > input')
  //   .map((item) => item.value);
  // 不能使用map，因为querySelectorAll返回的为nodelist不是数组，不能使用数组方法
  // 可以使用Array.from()将其转换成数组

  const [mobile, code] = [
    ...document.querySelectorAll('.login-form > div.item > input'),
  ].map((item) => item.value);

  // 手机号正则检验
  const telStr =
    /^[1](([3][0-9])|([4][0,1,4-9])|([5][0-3,5-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0-3,5-9]))[0-9]{8}$/;
  if (!telStr.test(mobile)) {
    myAlert(false, '请正确输入手机号');
    return;
  }

  axios
    .post('/v1_0/authorizations', {
      mobile,
      code,
    })
    .then((res) => {
      console.log(res);
      if (res.message !== 'OK') return;

      myAlert(true, '登入成功两秒后跳转页面');

      localStorage.setItem('token', res.data.token);
      setTimeout(() => {
        location.href = '../content/index.html';
      }, 2000);
    })
    .catch((err) => {
      // console.dir(err);
      myAlert(false, err.response.data.message);
    });
});
