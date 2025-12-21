import './index.css';
/**
 * 目标1：获取文章列表并展示
 *  1.1 准备查询参数对象
 *  1.2 获取文章列表数据
 *  1.3 展示到指定的标签结构中
 */
const queryObj = {
  status: '',
  channel_id: '',
  page: 1,
  per_page: 2,
};
let total_count;
let total_page;
async function setArticlesList() {
  try {
    const res = await axios.get('v1_0/mp/articles', { params: queryObj });
    // console.log(res);

    document.querySelector('tbody.art-list').innerHTML = res.data.results
      .map(
        ({
          cover,
          title,
          status,
          pubdate,
          read_count,
          comment_count,
          like_count,
          id, //不用
        }) =>
          `
        <tr>
          <td>
            <img
              src="${cover.images[0] ? cover.images[0] : 'https://img2.baidu.com/it/u=2640406343,1419332367&fm=253&fmt=auto&app=138&f=JPEG?w=708&h=500'}"
              alt="">
          </td>
          <td>${title}</td>
          <td>
            ${status === 2 ? '<span class="badge text-bg-success">审核通过</span>' : '<span class="badge text-bg-primary">待审核</span>'}
          </td>
          <td>
            <span>${pubdate}</span>
          </td>
          <td>
            <span>${read_count}</span>
          </td>
          <td>
            <span>${comment_count}</span>
          </td>
          <td>
            <span>${like_count}</span>
          </td>
          <td data-id='${id}'>
            <i class="bi bi-pencil-square edit"></i>
            <i class="bi bi-trash3 del"></i>
          </td>
        </tr>
      `
      )
      .join('');

    total_count = res.data.total_count;
    // console.log(queryObj.per_page);
    const tamp = total_count / queryObj.per_page;

    ~~tamp === total_count / queryObj.per_page ?
      (total_page = ~~tamp)
    : (total_page = ~~tamp + 1);
    document.querySelector('.total-count').innerHTML = `共${total_page}条`;
  } catch (error) {
    console.log(err);
  }
}
setArticlesList();
/**
 * 目标2：筛选文章列表
 *  2.1 设置频道列表数据
 *  2.2 监听筛选条件改变，保存查询信息到查询参数对象
 *  2.3 点击筛选时，传递查询参数对象到服务器
 *  2.4 获取匹配数据，覆盖到页面展示
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

document.querySelector('form.sel-form').addEventListener('click', (e) => {
  //接口：非数字
  if (e.target.tagName === 'INPUT') {
    queryObj.status = e.target.value;
  }
  if (e.target.tagName === 'SELECT') {
    queryObj.channel_id = e.target.value;
  }
  // console.log(queryObj);
});

document.querySelector('button.btn').addEventListener('click', () => {
  setArticlesList();
});

/**
 * 目标3：分页功能
 *  3.1 保存并设置文章总条数
 *  3.2 点击下一页，做临界值判断，并切换页码参数并请求最新数据
 *  3.3 点击上一页，做临界值判断，并切换页码参数并请求最新数据
 */
document.querySelector('li.last').addEventListener('click', () => {
  if (queryObj.page === 1) return;

  queryObj.page--;
  setArticlesList();
  document.querySelector('li.page-now').innerHTML = `第${queryObj.page}页`;
});
document.querySelector('li.next').addEventListener('click', () => {
  if (queryObj.page === total_page) return;

  queryObj.page++;
  setArticlesList();
  document.querySelector('li.page-now').innerHTML = `第${queryObj.page}页`;
});

/**
 * 目标4：删除功能
 *  4.1 关联文章 id 到删除图标
 *  4.2 点击删除时，获取文章 id
 *  4.3 调用删除接口，传递文章 id 到服务器
 *  4.4 重新获取文章列表，并覆盖展示
 *  4.5 删除最后一页的最后一条，需要自动向前翻页
 */

//1.在setArticlesList()中直接对所有del遍历先解绑事件再添加事件绑定
//2.父元素事件委托
document.querySelector('.art-list').addEventListener('click', async (e) => {
  if (e.target.tagName === 'I' && e.target.classList.contains('del')) {
    if (
      //三个条件
      queryObj.page === total_page &&
      total_count % queryObj.per_page === 1 &&
      queryObj.page !== 1
    ) {
      queryObj.page--;
      document.querySelector('li.page-now').innerHTML = `第${queryObj.page}页`;
    }

    await axios.delete(`v1_0/mp/articles/${e.target.parentNode.dataset.id}`);
    setArticlesList();
  }

  if (e.target.tagName === 'I' && e.target.classList.contains('edit')) {
    location.href = `../publish/index.html?id=${e.target.parentNode.dataset.id}`;
  }
});

// 点击编辑时，获取文章 id，跳转到发布文章页面传递文章 id 过去
