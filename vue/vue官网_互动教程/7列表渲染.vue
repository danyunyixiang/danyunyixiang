<!-- 我们可以使用 v-for 指令来渲染一个基于源数组的列表： -->
<template>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      {{ todo.text }}
    </li>
  </ul>
  <!-- 这里的 todo 是一个局部变量，表示当前正在迭代的数组元素。 -->
  <!-- 它只能在 v-for 所绑定的元素上或是其内部访问，就像函数的作用域一样。 -->
</template>

<script setup>
  import { ref } from 'vue';

  // 给每个 todo 对象一个唯一的 id
  let id = 0;

  const newTodo = ref('');
  const todos = ref([
    { id: id++, text: 'Learn HTML' },
    { id: id++, text: 'Learn JavaScript' },
    { id: id++, text: 'Learn Vue' },
  ]);

  // 更新列表的方式
  function addTodo() {
    // 1. 改变原数组的值
    todos.value.push({ id: id++, text: newTodo.value });
    newTodo.value = '';
  }

  function removeTodo(todo) {
    // 2. 用新数组替换原数组

    // const {id, text} = todo
    todos.value = todos.value.filter((item) => todo.id !== item.id);
  }
</script>

<template>
  <form @submit.prevent="addTodo">
    <input v-model="newTodo" required placeholder="new todo" />
    <button>Add Todo</button>
  </form>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      {{ todo.text }}
      <button @click="removeTodo(todo)">X</button>
    </li>
  </ul>
</template>
