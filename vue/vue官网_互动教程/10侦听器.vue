<!-- 有时我们需要响应性地执行一些“副作用” -->
<!-- 监听一个ref,在其value发生改变时,执行其他代码 -->

<script setup>
import { ref,watch } from 'vue'
// watch参数
// watch(question, (newQuestion, oldQuestion) => {})

const todoId = ref(1)
const todoData = ref(null)

async function fetchData() {
  todoData.value = null
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  todoData.value = await res.json()
}

fetchData()
watch(todoId, () => {fetchData()})
</script>

<template>
  <p>Todo id: {{ todoId }}</p>
  <button @click="todoId++" :disabled="!todoData">Fetch next todo</button>
  <p v-if="!todoData">Loading...</p>
  <pre v-else>{{ todoData }}</pre>
</template>
