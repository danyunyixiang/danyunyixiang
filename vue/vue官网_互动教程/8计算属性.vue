<!-- 介绍一个新 API：computed()。它可以让我们创建一个计算属性 ref，这个 ref 会动态地根据其他响应式数据源来计算其 .value： -->

<!-- 动态api,能够根据其他响应式数据源,生成一个ref -->

<!-- 计算属性会自动跟踪其计算中所使用的到的其他响应式状态，并将它们收集为自己的依赖。 -->
<!-- 计算结果会被缓存，并只有在其依赖发生改变时才会被自动更新 -->

<script setup>
  import { ref, computed } from 'vue';

  let id = 0;

  const newTodo = ref('');
  const hideCompleted = ref(false);
  const todos = ref([
    { id: id++, text: 'Learn HTML', done: true },
    { id: id++, text: 'Learn JavaScript', done: true },
    { id: id++, text: 'Learn Vue', done: false },
  ]);

  function addTodo() {
    todos.value.push({ id: id++, text: newTodo.value, done: false });
    newTodo.value = '';
  }

  function removeTodo(todo) {
    todos.value = todos.value.filter((t) => t !== todo);
  }

  const filteredTodos = computed(() => {
    // 根据 `todos.value` & `hideCompleted.value`
    // 返回过滤后的 todo 项目
    return todos.value.filter((t) => t.done !== hideCompleted.value);
  });
</script>

<template>
  <form @submit.prevent="addTodo">
    <input v-model="newTodo" required placeholder="new todo" />
    <button>Add Todo</button>
  </form>
  <ul>
    <li v-for="todo in filteredTodos" :key="todo.id">
      <input type="checkbox" v-model="todo.done" />
      <span :class="{ done: todo.done }">{{ todo.text }}</span>
      <!-- :class="传递的是一个对象{属性名: 属性值}"       -->
      <button @click="removeTodo(todo)">X</button>
    </li>
  </ul>
  <button @click="hideCompleted = !hideCompleted">
    {{ hideCompleted ? 'Show all' : 'Hide completed' }}
  </button>
</template>

<style>
  .done {
    text-decoration: line-through;
  }
</style>
