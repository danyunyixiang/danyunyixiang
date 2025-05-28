<!-- 我们可以使用 v-if 指令来有条件地渲染元素： -->
<h1 v-if="awesome">Vue is awesome!</h1>
<!-- 这个 <h1> 标签只会在 awesome 的值为真值 (Truthy) 时渲染。若 awesome 更改为假值 (Falsy)，它将被从 DOM 中移除。 -->

<!-- 我们也可以使用 v-else 和 v-else-if 来表示其他的条件分支 -->
<script setup>
  import { ref } from 'vue';

  const awesome = ref(true);

  function toggle() {
    awesome.value = !awesome.value;
  }
</script>

<template>
  <button @click="toggle">Toggle</button>
  <h1 v-if="awesome">Vue is awesome!</h1>
  <h1 v-else>Oh no 😢</h1>
</template>
