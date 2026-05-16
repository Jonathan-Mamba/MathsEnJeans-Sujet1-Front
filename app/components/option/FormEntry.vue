<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string,
  type: 'input' | 'select' | 'info',
  options?: string[],
  placeholder?: string
  data?: any
}>(), {
  options: () => [],
  placeholder: "",
  data: ""
})
const model = defineModel()
</script>


<template>
  <div class="input-form-container centered">
    <label>{{ label }}</label>
    <input v-if="props.type === 'input'" v-model="model" required>
    <select v-if="props.type === 'select'" :placeholder="props.placeholder" v-model="model" required>
        <option v-for="option in props.options" :value="option">{{ option }}</option>
    </select>
    <span v-if="props.type === 'info'">{{ data }}</span>
  </div>
</template>

<style scoped>
div.input-form-container {
  display: flex;
  flex-direction: row;
  border: 1px solid var(--gray3);
  background-color: var(--gray3);
  border-radius: var(--radius);
  overflow: hidden;
  &:hover {
    border: var(--blue) solid 1px;
  }
  & label {
    border-radius: var(--radius) 0 0 var(--radius);
    background-color: var(--gray3);
    height: 100%;
    flex: 1;
    text-align: center;
    font-size: var(--rfsize);
  }
  & select, & input, & span {
    color: white;
    max-width: 50%;
    border-radius: 0 var(--radius) var(--radius) 0;
    border: var(--gray5) solid 1px;
    flex: 1;
    background-color: var(--gray5);
    height: 100%;
    box-sizing: border-box;
    font-size: var(--rfsize);
    margin: 0;
    padding: 0 0 0 2px;
  }
  & input:focus {
    outline: none;
    border: var(--blue) solid 1px;
  }
  & span {
    max-width: 50%;
    border-radius: 0 var(--radius) var(--radius) 0;
    border: var(--gray5) solid 1px;
    flex: 1;
    background-color: var(--gray5);
    height: 100%;
    box-sizing: border-box;
    font-size: var(--rfsize);
    margin: 0;
    padding-left: 2px;
    padding-bottom: 5px;
    text-overflow: ellipsis;
    text-align: center;
  }
}
</style>