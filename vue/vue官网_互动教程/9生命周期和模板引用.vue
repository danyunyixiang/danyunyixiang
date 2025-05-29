<!-- 手动操作 DOM -->
<!-- 需要使用模板引用——也就是指向模板中一个 DOM 元素的 ref -->
<p ref="pElementRef">hello</p>

<!-- 要访问该引用，我们需要声明一个同名的 ref -->
<script setup>
const pElementRef = ref(null)
</script>
<!-- 注意这个 ref 使用 null 值来初始化。这是因为当 <script setup> 执行时，DOM 元素还不存在 -->

<!-- 模板引用 ref 只能在组件挂载后访问 -->
<!-- 要在挂载之后执行代码，我们可以使用 onMounted() 函数 -->
<!-- 生命周期钩子——它允许我们注册一个在组件的 特定生命周期调用 的回调函数 -->

<!-- 先执行直接<script setup>中的代码,等待之后DOM元素 挂载 ,再会执行 生命周期钩子 中的代码 -->


<script setup>
import { ref,onMounted } from 'vue'

const pElementRef = ref(null)
onMounted(() => {
  pElementRef.value.textContent = '被改成不hello了'
})
</script>

<template>
  <p ref="pElementRef">Hello</p>
</template>