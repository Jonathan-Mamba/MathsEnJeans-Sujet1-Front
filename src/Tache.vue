<template>
  <label :class="{ barred: completed}" >
    <input type="checkbox" v-model="model" @change="onChange">
    <slot></slot>
  </label>
</template>

<script setup>
  const model = defineModel()
  const props = defineProps({
    completed: Boolean,
    date: Number
  })
  const emits = defineEmits(["check", "uncheck"])
  const onChange = (event) => {
    if (event.currentTarget.checked) { emits("check") }
    else { emits("uncheck") }
  }
</script>

<style scoped>
  .barred {
    text-decoration-style: dashed;
    background-color: #555;
  }
</style > 