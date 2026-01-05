```
// 看到ai重构的代码, 我死了喵~~~~
```;
// 单html无法使用env配置内容（本地调试）
const BASE_URL = 'http://127.0.0.1:3000/';

// DOM 元素
const render = document.getElementById('render');
const postForm = document.getElementById('PostForm');
const form = postForm.querySelector('form');
const updataBtnElement = form.querySelector('.updataBtn');
const submitBtnElement = form.querySelector('.submitBtn');

// 状态管理
const state = {
  currentEditId: null,
  updateHandler: null,
};

// API 服务层
const apiService = {
  async fetchData(endpoint = 'data', options = {}) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API请求失败:', error);
      alert('数据请求失败，请检查网络连接');
      return [];
    }
  },

  async getAllData() {
    return await this.fetchData('data');
  },

  async createUser(data) {
    return await this.fetchData('data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async updateUser(id, data) {
    return await this.fetchData(`data/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async deleteUser(id) {
    return await this.fetchData(`data/${id}`, {
      method: 'DELETE',
    });
  },
};

// UI 渲染层
const uiRenderer = {
  createUserItem({ id, name, birthday, group, position }) {
    return `
      <ul data-id="${id}">
        <li>${name}</li>
        <li>${birthday}</li>
        <li>${group}</li>
        <li>${position}</li>
        <li>
          <button class="edit-btn" data-id="${id}">Edit</button>
        </li>
        <li>
          <button class="delete-btn" data-id="${id}">Delete</button>
        </li>
      </ul>
    `;
  },

  renderHeader() {
    return `
      <ul style="background-color: rgba(127, 255, 212, 0.5)">
        <li><strong>name</strong></li>
        <li><strong>birthday</strong></li>
        <li><strong>group</strong></li>
        <li><strong>position</strong></li>
        <li><strong>edit</strong></li>
        <li><strong>delete</strong></li>
      </ul>
    `;
  },

  renderUserList(users) {
    if (!users || !users.length) {
      render.innerHTML = this.renderHeader() + '<p>暂无数据</p>';
      return;
    }

    const userItems = users.map((user) => this.createUserItem(user)).join('');
    render.innerHTML = this.renderHeader() + userItems;
  },

  populateForm(userData) {
    Object.keys(userData).forEach((key) => {
      const field = form.elements[key];
      if (field) field.value = userData[key];
    });
  },

  clearForm() {
    form.reset();
    state.currentEditId = null;
  },
};

// 业务逻辑层
const userManager = {
  async loadUsers() {
    const users = await apiService.getAllData();
    uiRenderer.renderUserList(users);
  },

  async deleteUser(id) {
    if (!confirm('确定要删除这条记录吗？')) return;

    await apiService.deleteUser(id);
    await this.loadUsers();
  },

  async editUser(id) {
    const ulElement = render.querySelector(`ul[data-id='${id}']`);
    if (!ulElement) return;

    const liElements = Array.from(ulElement.children);
    const userData = {
      name: liElements[0].textContent,
      birthday: liElements[1].textContent,
      group: liElements[2].textContent,
      position: liElements[3].textContent,
    };

    state.currentEditId = id;
    uiRenderer.populateForm(userData);
    postForm.showModal();
    this.setupUpdateMode();
  },

  async submitUser(e) {
    e.preventDefault();

    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());

    if (state.currentEditId) {
      await apiService.updateUser(state.currentEditId, userData);
    } else {
      await apiService.createUser(userData);
    }

    this.closeForm();
    await this.loadUsers();
  },

  setupUpdateMode() {
    // 切换按钮状态
    submitBtnElement.style.display = 'none';
    updataBtnElement.style.display = 'inline-block';
  },

  setupCreateMode() {
    // 切换按钮状态
    submitBtnElement.style.display = 'inline-block';
    updataBtnElement.style.display = 'none';
  },

  closeForm() {
    postForm.close();
    uiRenderer.clearForm();
    this.setupCreateMode();
  },

  // 从表单获取数据
  getFormData() {
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
  },
};

// 事件处理器
const eventHandler = {
  init() {
    // 表单提交事件
    form.addEventListener('submit', (e) => userManager.submitUser(e));

    // 更新按钮事件
    updataBtnElement.addEventListener('click', (e) => {
      e.preventDefault();
      userManager.submitUser(e);
    });

    // 关闭表单事件
    form.querySelector('.closeBtn')?.addEventListener('click', () => {
      userManager.closeForm();
    });

    // 事件委托：处理编辑和删除按钮
    render.addEventListener('click', (e) => {
      const target = e.target;

      if (target.classList.contains('edit-btn')) {
        const id = target.dataset.id;
        userManager.editUser(id);
      }

      if (target.classList.contains('delete-btn')) {
        const id = target.dataset.id;
        userManager.deleteUser(id);
      }
    });

    // 模态框点击外部关闭
    postForm.addEventListener('click', (e) => {
      if (e.target === postForm) {
        userManager.closeForm();
      }
    });
  },
};

// 初始化应用
const initApp = async () => {
  try {
    eventHandler.init();
    await userManager.loadUsers();
    userManager.setupCreateMode();
  } catch (error) {
    console.error('应用初始化失败:', error);
  }
};

// 启动应用
document.addEventListener('DOMContentLoaded', initApp);

// 暴露必要的方法到全局（如果需要）
window.editUser = (id) => userManager.editUser(id);
window.deleteUser = (id) => userManager.deleteUser(id);
