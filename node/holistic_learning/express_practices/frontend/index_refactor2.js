```
// 看到ai重构的代码, 我死了喵~~~~
```;
// 单html无法使用env配置内容（本地调试）
const BASE_URL = 'http://127.0.0.1:3000/';
const PER_PAGE = 10; // 每页显示条数

// DOM 元素（集中管理）
const DOM = {
  render: document.getElementById('render'),
  clickButton: document.querySelector('.ClickButton'),
  pagination: document.getElementById('pagination'),
  prevBtn: document.getElementById('pagination')?.querySelector('.prevBtn'),
  nextBtn: document.getElementById('pagination')?.querySelector('.nextBtn'),
  pageNumbers: document
    .getElementById('pagination')
    ?.querySelector('.pageNumbers'),
  postForm: document.getElementById('PostForm'),
  form: document.getElementById('PostForm')?.querySelector('form'),
  submitBtn: document.getElementById('PostForm')?.querySelector('.submitBtn'),
  updataBtn: document.getElementById('PostForm')?.querySelector('.updataBtn'),
};

// 状态管理（集中管理）
const state = {
  currentPage: 1,
  totalPages: 1,
  currentEditId: null,
  updateHandler: null,
};

// 检查DOM元素是否存在（防止空指针）
Object.keys(DOM).forEach((key) => {
  if (!DOM[key]) {
    console.warn(`DOM元素 ${key} 未找到`);
  }
});

const apiService = {
  async fetchData(endpoint = 'data', options = {}) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API请求失败:', error);
      alert('数据请求失败，请检查网络连接');
      return null;
    }
  },

  async getUsers(page = 1, perPage = PER_PAGE) {
    return await this.fetchData(`data?page=${page}&per_page=${perPage}`);
  },

  async getTotalCount() {
    const result = await this.fetchData('data/count');
    return result?.dataCount || 0;
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

const uiRenderer = {
  // 用户列表项模板
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

  // 表格头部
  createTableHeader() {
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

  // 渲染用户列表
  renderUserList(users) {
    if (!users || !users.length) {
      DOM.render.innerHTML = this.createTableHeader() + '<p>暂无数据</p>';
      return;
    }

    const userItems = users.map((user) => this.createUserItem(user)).join('');
    DOM.render.innerHTML = this.createTableHeader() + userItems;
  },

  // 渲染分页按钮
  renderPagination(totalItems) {
    if (!DOM.pageNumbers) return;

    const totalPages = Math.ceil(totalItems / PER_PAGE);
    state.totalPages = totalPages;

    // 清空并重新生成页码按钮
    DOM.pageNumbers.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.className = 'pageBtn';
      button.textContent = i;
      if (i === state.currentPage) {
        button.classList.add('active');
      }
      DOM.pageNumbers.appendChild(button);
    }

    // 更新上一页/下一页按钮状态
    this.updatePaginationButtons();
  },

  // 更新分页按钮状态
  updatePaginationButtons() {
    if (!DOM.prevBtn || !DOM.nextBtn) return;

    DOM.prevBtn.disabled = state.currentPage === 1;
    DOM.nextBtn.disabled = state.currentPage === state.totalPages;

    // 移除所有active类
    document.querySelectorAll('.pageBtn').forEach((btn) => {
      btn.classList.remove('active');
    });

    // 为当前页码添加active类
    const currentPageBtn = document.querySelector(
      `.pageBtn:nth-child(${state.currentPage})`
    );
    if (currentPageBtn) {
      currentPageBtn.classList.add('active');
    }
  },

  // 填充表单
  populateForm(userData) {
    Object.keys(userData).forEach((key) => {
      const field = DOM.form?.elements[key];
      if (field) field.value = userData[key];
    });
  },

  // 清空表单
  clearForm() {
    DOM.form?.reset();
    state.currentEditId = null;
  },

  // 显示表单（新增模式）
  showFormForCreate() {
    this.clearForm();
    this.setFormMode('create');
    DOM.postForm?.showModal();
  },

  // 显示表单（编辑模式）
  showFormForEdit(userData, id) {
    this.populateForm(userData);
    state.currentEditId = id;
    this.setFormMode('edit');
    DOM.postForm?.showModal();
  },

  // 设置表单模式（创建/编辑）
  setFormMode(mode) {
    if (!DOM.submitBtn || !DOM.updataBtn) return;

    if (mode === 'create') {
      DOM.submitBtn.style.display = 'inline-block';
      DOM.updataBtn.style.display = 'none';
    } else if (mode === 'edit') {
      DOM.submitBtn.style.display = 'none';
      DOM.updataBtn.style.display = 'inline-block';
    }
  },

  // 关闭表单
  closeForm() {
    DOM.postForm?.close();
    this.clearForm();
    this.setFormMode('create');
  },
};

const userManager = {
  // 加载用户数据（带分页）
  async loadUsers() {
    try {
      // 并行获取数据总数和当前页数据
      const [totalCount, users] = await Promise.all([
        apiService.getTotalCount(),
        apiService.getUsers(state.currentPage, PER_PAGE),
      ]);

      if (users) {
        uiRenderer.renderUserList(users);
      }

      if (totalCount !== null) {
        uiRenderer.renderPagination(totalCount);
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
    }
  },

  // 处理页码切换
  async changePage(newPage) {
    // 验证页码有效性
    if (newPage < 1 || newPage > state.totalPages) {
      return;
    }

    state.currentPage = newPage;
    await this.loadUsers();
  },

  // 上一页
  async prevPage() {
    if (state.currentPage > 1) {
      await this.changePage(state.currentPage - 1);
    }
  },

  // 下一页
  async nextPage() {
    if (state.currentPage < state.totalPages) {
      await this.changePage(state.currentPage + 1);
    }
  },

  // 删除用户
  async deleteUser(id) {
    if (!confirm('确定要删除这条记录吗？')) return;

    await apiService.deleteUser(id);
    // 删除后可能需要调整页码
    await this.adjustPageAfterDelete();
    await this.loadUsers();
  },

  // 删除后调整页码（如果当前页没数据了，就回退一页）
  async adjustPageAfterDelete() {
    const totalCount = await apiService.getTotalCount();
    const totalPages = Math.ceil(totalCount / PER_PAGE);

    if (state.currentPage > totalPages) {
      state.currentPage = Math.max(1, totalPages);
    }
  },

  // 编辑用户
  async editUser(id) {
    // 从当前DOM中获取用户数据（因为数据已经在页面上）
    const ulElement = DOM.render.querySelector(`ul[data-id='${id}']`);
    if (!ulElement) return;

    const liElements = Array.from(ulElement.children);
    const userData = {
      name: liElements[0].textContent,
      birthday: liElements[1].textContent,
      group: liElements[2].textContent,
      position: liElements[3].textContent,
    };

    uiRenderer.showFormForEdit(userData, id);
  },

  // 提交用户（创建或更新）
  async submitUser(formData) {
    try {
      if (state.currentEditId) {
        await apiService.updateUser(state.currentEditId, formData);
      } else {
        await apiService.createUser(formData);
      }

      uiRenderer.closeForm();
      await this.loadUsers();
    } catch (error) {
      console.error('提交用户数据失败:', error);
      alert('提交失败，请重试');
    }
  },

  // 从表单获取数据
  getFormData() {
    const formData = new FormData(DOM.form);
    return Object.fromEntries(formData.entries());
  },
};

const eventHandler = {
  init() {
    this.initFormEvents();
    this.initPaginationEvents();
    this.initUserListEvents();
    this.initModalEvents();
  },

  // 表单事件
  initFormEvents() {
    if (!DOM.form) return;

    // 表单提交
    DOM.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = userManager.getFormData();
      await userManager.submitUser(formData);
    });

    // 更新按钮（编辑模式）
    if (DOM.updataBtn) {
      DOM.updataBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const formData = userManager.getFormData();
        await userManager.submitUser(formData);
      });
    }

    // 新增按钮
    if (DOM.clickButton) {
      DOM.clickButton.addEventListener('click', () => {
        uiRenderer.showFormForCreate();
      });
    }
  },

  // 分页事件
  initPaginationEvents() {
    if (!DOM.pagination) return;

    DOM.pagination.addEventListener('click', (e) => {
      const target = e.target;

      if (target.classList.contains('prevBtn')) {
        userManager.prevPage();
      } else if (target.classList.contains('nextBtn')) {
        userManager.nextPage();
      } else if (target.classList.contains('pageBtn')) {
        const pageNum = parseInt(target.textContent);
        userManager.changePage(pageNum);
      }
    });
  },

  // 用户列表事件（事件委托）
  initUserListEvents() {
    DOM.render.addEventListener('click', (e) => {
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
  },

  // 模态框事件
  initModalEvents() {
    if (!DOM.postForm) return;

    // 点击模态框外部关闭
    DOM.postForm.addEventListener('click', (e) => {
      if (e.target === DOM.postForm) {
        uiRenderer.closeForm();
      }
    });

    // ESC键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.postForm.open) {
        uiRenderer.closeForm();
      }
    });
  },
};

const initApp = async () => {
  try {
    // 初始化事件监听
    eventHandler.init();

    // 加载初始数据
    await userManager.loadUsers();

    // 设置初始表单模式
    uiRenderer.setFormMode('create');

    console.log('应用初始化完成');
  } catch (error) {
    console.error('应用初始化失败:', error);
    alert('应用初始化失败，请刷新页面重试');
  }
};

// 启动应用
document.addEventListener('DOMContentLoaded', initApp);

// 暴露必要的方法到全局（为了兼容原有代码）
window.editUser = (id) => userManager.editUser(id);
window.deleteUser = (id) => userManager.deleteUser(id);
