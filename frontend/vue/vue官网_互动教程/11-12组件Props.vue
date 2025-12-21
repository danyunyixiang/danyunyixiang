<!-- 组件 -->
<!-- 父组件可以在模板中渲染另一个组件作为子组件 -->
<script setup>
// 使用名 可以和 文件名不同
import ChildComp from './子组件.vue'

import {ref} from 'vue'

// ChildComp绑定的ref
const greeting = ref('传入给子组件的字符串')

</script>


<template>

<!-- 父组件可以像声明 HTML attributes 一样传递 props。 -->
<!-- 若要传递动态值，也可以使用 v-bind 语法： -->
  <ChildComp :msg="greeting" num="6"/>
<!-- 传递了静态值 num -->
</template>

