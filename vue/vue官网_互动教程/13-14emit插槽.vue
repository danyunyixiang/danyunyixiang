<script setup>
import ChildComp from './子组件.vue'

const emitMsg = ref('No ChildComp')

</script>

<template>
<!-- 这里的处理函数接收了子组件触发事件时的额外参数并将它赋值给了本地状态 -->
<ChildComp @response = "(item) => {emitMsg = item}"/>
<p>{{ emitMsg }}</p>

<!-- 父组件还可以通过插槽 (slots) 将模板片段传递给子组件： -->
<ChildComp> 
  <!-- 插槽入口,传入的值 -->
  <p style="color: aqua;">come to slots</p>
</ChildComp>
</template>