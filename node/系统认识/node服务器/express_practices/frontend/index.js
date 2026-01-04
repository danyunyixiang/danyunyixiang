// 单html无法使用env配置内容（本地调试）
const BASE_URL = 'http://127.0.0.1:3000/';

const render = document.getElementById('render');
const clickButton = document.querySelector('.ClickButton');

const pagination = document.getElementById('pagination');
const prevBtn = pagination.querySelector('.prevBtn');
const nextBtn = pagination.querySelector('.nextBtn');
let pageBtnList = pagination.querySelectorAll('.pageBtn');
const pageNumbers = pagination.querySelector('.pageNumbers');

const postForm = document.getElementById('PostForm');
const form = postForm.querySelector('form');
const submitBtnElement = form.querySelector('.submitBtn');
const updataBtnElement = form.querySelector('.updataBtn');

// updataBtn按钮事件委托
let updataEventListenerId = null;
// 当前页码
let currentPage = 1;

const renderData = (data) => {
  // 重新获取数据并渲染
  render.innerHTML = `
    <ul style="background-color: rgba(127, 255, 212, 0.5)">
      <li><strong>name</strong></li>
      <li><strong>birthday</strong></li>
      <li><strong>group</strong></li>
      <li><strong>position</strong></li>
      <li><strong>edit</strong></li>
      <li><strong>delete</strong></li>
    </ul>
    `;

  render.innerHTML += data
    .map(
      ({ id, name, birthday, group, position }) => `
    <ul data-id="${id}">
      <li>${name}</li>
      <li>${birthday}</li>
      <li>${group}</li>
      <li>${position}</li>
      <li><button onclick="editUser('${id}')">Edit</button></li>
      <li><button onclick="deleteUser('${id}')">Delete</button></li>
    </ul>
    `
    )
    .join('');
};

const renderPagination = ({ dataCount = 0, per_page = 10 }) => {
  const totalPages = ~~(dataCount / per_page) + 1;
  pageNumbers.innerHTML = `<button class="pageBtn">1</button>`;
  for (let i = 2; i <= totalPages; i++) {
    pageNumbers.innerHTML += `<button class="pageBtn">${i}</button>`;
  }

  pageBtnList = pagination.querySelectorAll('.pageBtn');
  pageBtnList[currentPage - 1].classList.add('active');

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === pageBtnList.length;
};

// 清除数据并关闭表单
const closeBtn = () => {
  form.reset();
  postForm.close();
};

// 新增用户按钮入口
clickButton.addEventListener('click', () => {
  postForm.showModal();
  submitBtnElement.style.display = 'inline-block';
  updataBtnElement.style.display = 'none';
});

const deleteUser = async (id) => {
  // OVER: 后端根据id删除数据
  // 更新路径router -> controller -> server -> prisma
  const response = await fetch(BASE_URL + `data/${id}`, {
    method: 'DELETE',
  });

  reRender(currentPage);
};

const editUser = (id) => {
  const ulElement = render.querySelector(`ul[data-id='${id}']`);
  const userData = Array.from(ulElement.children).map((li) => li.textContent);
  const userDataStructure = {
    name: userData[0],
    birthday: userData[1],
    group: userData[2],
    position: userData[3],
  };

  postForm.showModal();
  for (let key in userDataStructure) {
    // 根据数据结构检验替换字段
    const field = form.elements[key];
    // console.log(field);
    field && (field.value = userDataStructure[key]);
  }

  // submitBtn与updataBtn按钮切换
  submitBtnElement.style.display = 'none';
  updataBtnElement.style.display = 'inline-block';

  updataBtn(id);
};

const updataBtn = async (id) => {
  // 先清除原先在updataBtn按钮上的事件委托
  if (updataEventListenerId) {
    updataBtnElement.removeEventListener('click', updataEventListenerId);
    // console.log('已移除原先事件委托');
  }

  // 在依据editUserc函数中填充的id，添加新的事件委托
  updataEventListenerId = async (e) => {
    const postData = beforeBtn(e);

    // OVER: 后端根据id更新数据
    await fetch(BASE_URL + `data/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    reRender(currentPage);
  };

  updataBtnElement.addEventListener('click', updataEventListenerId);
};

// 统一一下提交前的操作
const beforeBtn = (e) => {
  e.preventDefault();
  postForm.close();

  const formData = new FormData(form);
  const postData = Object.fromEntries(formData.entries());
  form.reset();

  return postData;
};

const submitBtn = async (e) => {
  const postData = beforeBtn(e);

  await fetch(BASE_URL + 'data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });

  reRender(currentPage);
};

const reRender = async (currentPage) => {
  const [dataCountStr, newDataStr] = await Promise.all([
    // TODO: 后端新增获取数据条数接口和更改/data get路由参数
    // dataCount = {dataCount: number, per_page: number}
    fetch(BASE_URL + 'data/count'),
    fetch(BASE_URL + `data?page=${currentPage}`),
  ]);
  const [dataCount, newData] = await Promise.all([
    dataCountStr.json(),
    newDataStr.json(),
  ]);

  renderPagination(dataCount);
  renderData(newData);
};

pagination.addEventListener('click', async (e) => {
  const isPrev = e.target.classList.contains('prevBtn');
  const isNext = e.target.classList.contains('nextBtn');
  const isPage = e.target.classList.contains('pageBtn');

  // 三种情况不更新currentPage
  // 1. 点击非prevBtn、nextBtn、pageBtn
  // 2. 点击prevBtn，且currentPage为1
  // 3. 点击nextBtn，且currentPage为pageBtnList.length
  if (
    (!isPrev && !isNext && !isPage) ||
    (isPrev && currentPage === 1) ||
    (isNext && currentPage === pageBtnList.length)
  ) {
    return;
  }

  // 三个if，更新currentPage与display状态
  if (isPrev) currentPage -= 1;
  else if (isNext) currentPage += 1;
  else if (isPage) currentPage = Number(e.target.textContent);

  reRender(currentPage);
});

// window.onload = function(){}
document.addEventListener('DOMContentLoaded', async () => {
  reRender(currentPage);
});
