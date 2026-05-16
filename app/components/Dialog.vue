<script lang="ts" setup>
const props = withDefaults(defineProps<{
  title: string
  confirmText?: string
  cancelText?: string
}>(), {
  confirmText: "Appliquer",
  cancelText: "Annuler"
})
const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div class="dialog">
    <p class="title">{{ props.title }}</p>
    <div class="content">
      <slot></slot>
    </div>
    <div class="footer">
      <button class="blue" @click="emit('confirm')">{{ props.confirmText }}</button>
      <button class="red" @click="emit('cancel')">{{ props.cancelText }}</button>
    </div>
  </div>
</template>

<style scoped>
div.dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--gray2);
  border: antiquewhite solid 1px;
  color: white;
  font-family: var(--rfont);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--radius);
  & p.title {
    font-size: var(--stfsize);
    background-color: var(--blue);
    color: white;
    text-align: center;
    margin-top: 0px;
    padding-bottom: 2px;
    order: -2;
  }
  & div.content {
    flex: 1;
    padding: 10px;
  }
  & div.footer {
    display: flex;
    flex-direction: row-reverse;
    width: 100%;
    gap: 5px;
    margin: 0 10px 5px 0;
    & button {
      border: none;
      border-radius: var(--radius);
      color: white;
      font-family: var(--rfont);
      font-size: var(--rfsize);
    }
  }
}
</style>