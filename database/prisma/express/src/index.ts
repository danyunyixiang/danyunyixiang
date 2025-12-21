import { Prisma, PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import express from 'express'

const prisma = new PrismaClient().$extends(withAccelerate())

const app = express()

app.use(express.json())

app.post(`/signup`, async (req, res) => {
  const { name, email, posts } = req.body

  const postData = posts?.map((post: Prisma.PostCreateInput) => {
    return { title: post?.title, content: post?.content }
  })

  const result = await prisma.user.create({
    data: {
      name,
      email,
      posts: {
        create: postData,
      },
    },
  })
  res.json(result)
})

app.post(`/post`, async (req, res) => {
  const { title, content, authorEmail } = req.body
  const result = await prisma.post.create({
    data: {
      title,
      content,
      author: { connect: { email: authorEmail } },
    },
  })
  res.json(result)
})

app.post('/user/:id/profile', async (req, res) => {
  const { id } = req.params
  const { bio } = req.body

  const profile = await prisma.profile.create({
    data: {
      bio,
      user: {
        connect: {
          id: Number(id)
        }
      }
    }
  })

  res.json(profile)
})

app.put('/post/:id/views', async (req, res) => {
  const { id } = req.params

  try {
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })

    res.json(post)
  } catch (error) {
    res.json({ error: `Post with ID ${id} does not exist in the database` })
  }
})

app.put('/publish/:id', async (req, res) => {
  const { id } = req.params

  try {
    const postData = await prisma.post.findUnique({
      where: { id: Number(id) },
      select: {
        published: true,
      },
    })

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) || undefined },
      data: { published: !postData?.published },
    })
    res.json(updatedPost)
  } catch (error) {
    res.json({ error: `Post with ID ${id} does not exist in the database` })
  }
})

app.delete(`/post/:id`, async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(post)
})

// get返回html，提供发送post接口
// 当前为静态数据
app.get('/', (req, res) => {
  res.send(`
    <div style="margin: 20px;">
      <div style="margin-bottom: 20px;">
        <h3>创建用户档案</h3>
        <input type="number" id="userId" placeholder="输入用户ID">
        <input type="text" id="userBio" placeholder="输入用户简介">
        <button onclick="createProfile()">创建用户档案</button>
      </div>
      
      <div>
        <h3>查看用户档案</h3>
        <input type="number" id="viewUserId" placeholder="输入要查看的用户ID">
        <button onclick="viewProfile()">查看档案</button>
        <div id="profileResult" style="margin-top: 10px; white-space: pre-wrap;"></div>
      </div>
    </div>

    <script>
      function createProfile() {
        const userId = document.getElementById('userId').value;
        const userBio = document.getElementById('userBio').value;
        
        if (!userId || !userBio) {
          alert('请输入用户ID和简介');
          return;
        }

        fetch(\`/user/\${userId}/profile\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            bio: userBio
          })
        })
        .then(res => res.json())
        .then(data => {
          console.log('创建的档案:', data);
          alert('档案创建成功！');
        })
        .catch(err => {
          console.error('错误:', err);
          alert('创建档案失败，请检查用户ID是否存在');
        });
      }

      function viewProfile() {
        const userId = document.getElementById('viewUserId').value;
        const resultDiv = document.getElementById('profileResult');
        
        if (!userId) {
          alert('请输入要查看的用户ID');
          return;
        }

        resultDiv.innerHTML = '加载中...';
        
        fetch(\`/user/\${userId}/profile\`)
          .then(res => res.json())
          .then(data => {
            if (data.error) {
              resultDiv.innerHTML = \`错误: \${data.error}\`;
            } else {
              resultDiv.innerHTML = JSON.stringify(data, null, 2);
            }
          })
          .catch(err => {
            console.error('错误:', err);
            resultDiv.innerHTML = '获取档案失败';
          });
      }
    </script>
    `)
})

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.get('/user/:id/drafts', async (req, res) => {
  const { id } = req.params

  const drafts = await prisma.post.findMany({
    where: {
      authorId: Number(id),
      published: false,
    },
  })

  res.json(drafts)
})

app.get(`/post/:id`, async (req, res) => {
  const { id }: { id?: string } = req.params

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  })
  res.json(post)
})

// 获取用户档案
app.get('/user/:id/profile', async (req, res) => {
  const { id } = req.params

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: Number(id) },
      include: { user: true }  // 包含关联的用户信息
    })

    if (!profile) {
      return res.status(404).json({ error: `未找到用户 ID ${id} 的档案` })
    }

    res.json(profile)
  } catch (error) {
    res.status(500).json({ error: '获取档案失败' })
  }
})

app.get('/feed', async (req, res) => {
  const { searchString, skip, take, orderBy } = req.query

  const or: Prisma.PostWhereInput = searchString
    ? {
        OR: [
          { title: { contains: searchString as string } },
          { content: { contains: searchString as string } },
        ],
      }
    : {}

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...or,
    },
    include: { author: true },
    take: Number(take) || undefined,
    skip: Number(skip) || undefined,
    orderBy: {
      updatedAt: orderBy as Prisma.SortOrder,
    },
  })

  res.json(posts)
})

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: https://github.com/prisma/prisma-examples/blob/latest/orm/express/README.md#using-the-rest-api`),
)
