<script setup>



// <!-- Props -->
// 子组件可以通过 props 从父组件接受动态数据。
// 首先，需要声明它（子组件）所接受的 props：
const props = defineProps({
  msg: String,
  num: Number
})
// 注意 defineProps() 是一个编译时宏，并不需要导入。
// 一旦声明，msg prop 就可以在子组件的模板中使用。
// 它也可以通过 defineProps() 所返回的对象在 JavaScript 中访问。

// 可以在父组件中使用 msg 并赋值传递给子组件


// <!-- emit -->
// 子组件还可以向父组件触发事件
const emit = defineEmits(['response'])
// 带参数触发
emit('response', 'hello from child')

</script>

<template>
<slot>
  插槽默认值
  <!-- 在父组件通过slots传入值时，slot将被替换 -->
</slot>
</template>