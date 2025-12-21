<!-- 直接编写 .vue 文件为Vue 单文件组件 -->
<!-- 使用 npm run serve 启动 -->
<!--  在vue官网调试:https://cn.vuejs.org/tutorial/#step-1 -->
<!-- 单文件组件是一种可复用的代码组织形式，
 它将从属于同一个组件的 HTML、CSS 和 JavaScript 封装在使用 .vue 后缀的文件中 -->
<script setup>
  import { reactive, ref } from 'vue';

  // reactive() 创建的对象都是 JavaScript Proxy，其行为与普通对象一样
  const reactiveObj = reactive({
    num: 1,
  });
  console.log('reactive()创建对象:', reactiveObj.num);

  // ref 会返回一个包裹对象，并在 .value 属性下暴露内部值
  let refObj = ref('hello vue');
  console.log('ref()创建对象:', refObj.value);

  const v_bind_class = ref('vcolor');

  const oneFun = () => {
    refObj = refObj.value.split('').reverse().join('');
  };

  function onInput(e) {
    // v-on 处理函数会接收原生 DOM 事件作为其参数。
    text.value = e.target.value;
  }
</script>

<template>
  <!-- 在双花括号中的内容并不只限于标识符或路径——我们可以使用任何有效的 JavaScript 表达式 -->
  <h1>{{ reactiveObj.num }}</h1>
  <h1>{{ refObj }}</h1>
  <h1>{{ refObj.split('').reverse().join('') }}</h1>

  <!-- mustache 语法 (即双大括号) 只能用于文本插值。为了给 attribute 绑定一个动态值，需要使用 v-bind 指令 -->
  <div v-bind:id="dynamicId"></div>
  <!-- v-bind 使用地非常频繁，它有一个专门的简写语法 -->
  <div :class="v_bind_class">v-bind</div>

  <!-- 我们可以使用 v-on 指令监听 DOM 事件： -->
  <button v-on:click="oneFun">{{ refObj }}</button>
  <!-- 因为其经常使用，v-on 也有一个简写语法： -->
  <button @click=""></button>

  <!-- 我们可以同时使用 v-bind 和 v-on 来在表单的输入元素上创建双向绑定： -->
  <input :value="text" @input="onInput" />
  <!-- 为了简化双向绑定，Vue 提供了一个 v-model 指令，它实际上是上述操作的语法糖： -->
  <input v-model="text" />
</template>

<style>
  #dynamicId {
    color: brown;
  }
  .vcolor {
    color: aqua;
  }
</style>
