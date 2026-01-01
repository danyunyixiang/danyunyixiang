// 单html无法使用env配置内容（本地调试）
const BASE_URL = 'http://127.0.0.1:3000/';

const clickButton = document.querySelector('.ClickButton');
const postForm = document.getElementById('PostForm');
const submitBtn = document.querySelector('.submitBtn');
const render = document.getElementById('render');

clickButton.addEventListener('click', () => {
  postForm.showModal();
});

const renderData = (data) => {
  render.innerHTML += data
    .map(
      ({ name, birthday, group, position }) => `
            <ul>
              <li>${name}</li>
              <li>${birthday}</li>
              <li>${group}</li>
              <li>${position}</li>
            </ul>
            `
    )
    .join('');
};

submitBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  const form = postForm.querySelector('form');
  const formData = new FormData(form);
  const postData = Object.fromEntries(formData.entries());

  if (
    !postData.name ||
    !postData.birthday ||
    !postData.group ||
    !postData.position
  ) {
    alert('请填写完整信息！');
    return;
  }

  await fetch(BASE_URL + 'data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });

  // 重新获取数据并渲染
  render.innerHTML = `
      <ul style="background-color: rgba(127, 255, 212, 0.5)">
        <li><strong>name</strong></li>
        <li><strong>birthday</strong></li>
        <li><strong>group</strong></li>
        <li><strong>positon</strong></li>
      </ul>
      `;
  const newDataStr = await fetch(BASE_URL + 'data');
  renderData(await newDataStr.json());

  postForm.close();
});

// window.onload = function(){}
document.addEventListener('DOMContentLoaded', async () => {
  const dataStr = await fetch(BASE_URL + 'data');
  // const data = await dataStr.json();

  renderData(await dataStr.json());
});
