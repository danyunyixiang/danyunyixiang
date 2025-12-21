/**
 * 目标1：设置频道下拉菜单
 *  1.1 获取频道列表数据
 *  1.2 展示到下拉菜单中
 */
async function getChannels() {
  try {
    const res = await axios.get('v1_0/channels');

    const data = res.data.channels;

    let html = `<option value="" selected>请选择文章频道</option>`;
    data.forEach(({ id, name }) => {
      html += `<option value="${id}">${name}</option>`;
    });

    document.querySelector('.form-select').innerHTML = html;
  } catch (error) {
    console.log(error);
  }
}
getChannels();

/**
 * 目标2：文章封面设置
 *  2.1 准备标签结构和样式
 *  2.2 选择文件并保存在 FormData
 *  2.3 单独上传图片并得到图片 URL 网址
 *  2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
 */
document.getElementById('img').addEventListener('change', (e) => {
  const file = e.target.files[0];
  // 后悔检测o(￣┰￣*)ゞ
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);
  // for (let [key, value] of formData.entries()) {
  //   console.log(key, value);
  // }

  axios
    .post('/v1_0/upload', formData)
    .then((res) => {
      console.log(res.data.url);
      document.querySelector('img.rounded').src = res.data.url;
      document.querySelector('img.rounded').classList.add('show');
      document.querySelector('label.place').classList.add('hide');
    })
    .catch((err) => {
      console.error(err);
    });
});
document.querySelector('img.rounded').addEventListener('click', () => {
  document.getElementById('img').click();
});

/**
 * 目标3：发布文章保存
 *  3.1 基于 form-serialize 插件收集表单数据对象
 *  3.2 基于 axios 提交到服务器保存
 *  3.3 调用 Alert 警告框反馈结果给用户
 *  3.4 重置表单并跳转到列表页
 */
document.querySelector('button.btn').addEventListener('click', async () => {
  //没必要统一操作，徒增时间成本

  const data = {};
  ['form-control', 'form-select', 'publish-content'].forEach((i) => {
    const j = document.querySelector(`.${i}`);
    //属性名不能直接赋为变量
    data[j.name] = j.value;
  });
  data.cover = { type: 1, images: [document.querySelector('img.rounded').src] };
  // console.log(data);

  //校验
  for (let i of Object.values(data)) {
    //不完善，但懒得改了
    if (!i) {
      myAlert(false, '请检查信息填写是否完整！');
      return;
    }
  }

  try {
    const id = document.querySelector(`.art-form [name=id]`).value;
    if (id) {
      //目标5的判断逻辑
      await axios.put(`v1_0/mp/articles/${id}`, data);
      myAlert(true, '修改成功，两秒后跳转');
    } else {
      // const msg = await axios.post('/v1_0/mp/articles', data);
      await axios.post('/v1_0/mp/articles', data);
      myAlert(true, '提交成功，两秒后跳转');
    }
  } catch (error) {
    myAlert(false, error.response.data.message);
  }

  //没什么必要清除
  ['form-control', 'form-select', 'publish-content'].forEach((i) => {
    document.querySelector(`.${i}`).value = null;
  });
  editor.setHtml('');
  document.querySelector('img.rounded').src = null;
  document.querySelector('img.rounded').classList.remove('show');
  document.querySelector('label.place').classList.remove('hide');

  setTimeout(() => {
    location.href = '../content/index.html';
  }, 2000);
});

/**
 * 目标4：编辑-回显文章
 *  4.1 页面跳转传参（URL 查询参数方式）
 *  4.2 发布文章页面接收参数判断（共用同一套表单）
 *  4.3 修改标题和按钮文字
 *  4.4 获取文章详情数据并回显表单
 */
(async function () {
  const idStr = new URLSearchParams(location.search);
  // for (const [key, value] of idStr) {
  //   console.log(key, value);
  // }
  const id = idStr.toString().split('=')[1];

  try {
    const res = await axios.get(`/v1_0/mp/articles/${id}`);

    document.querySelector('.title span').innerText = '修改文章';
    document.querySelector('button.btn').innerText = '修改';

    // console.log(res);
    const { channel_id, content, cover, title } = res.data;

    // 检查提交按钮所需的信息
    let num = 0;
    const list = [title, channel_id, content];
    ['form-control', 'form-select', 'publish-content'].forEach((i) => {
      document.querySelector(`.${i}`).value = list[num];
      num++;
    });
    editor.setHtml(content);
    //暴露id
    document.querySelector(`.art-form [name=id]`).value = id;

    document.querySelector('img.rounded').src = cover.images[0];
    document.querySelector('img.rounded').classList.add('show');
    document.querySelector('label.place').classList.add('hide');
  } catch (error) {
    console.dir(error.message);
  }
})();

/**
 * 目标5：编辑-保存文章
 *  5.1 判断按钮文字，区分业务（因为共用一套表单）
 *  5.2 调用编辑文章接口，保存信息到服务器
 *  5.3 基于 Alert 反馈结果消息给用户
 */
