<script lang="ts" setup>
const props = withDefaults(defineProps<{
  title: string
  is_open: boolean
  confirm_text?: string
  cancel_text?: string
}>(), {
  confirm_text: "Appliquer",
  cancel_text: "Annuler"
})
const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template lang="html">
  <div class="dialog" v-if="props.is_open">
    <p class="dialog_title">{{ props.title }}</p>
    <div class="dialog_content">
      <slot></slot>
    </div>
    <div class="dialog_footer">
      <button class="blue" @click="emit('confirm')">{{ props.confirm_text }}</button>
      <button class="red" @click="emit('cancel')">{{ props.cancel_text }}</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  div.dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: $gray2;
  border: $lightblue solid 1px;
  color: white;
  font-family: $rfont;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: $radius;
  p.dialog_title {
    font-size: $stfsize;
    background-color: $gray8;
    color: white;
    text-align: center;
    margin-top: 0px;
    padding-bottom: 2px;
    order: -2;
  }
  div.dialog_content {
    order: -1;
    flex: 1;
    padding: 0 10px 0 10px;
  }
  div.dialog_footer {
    display: flex;
    flex-direction: row-reverse;
    width: 100%;
    gap: 5px;
    margin: 10px 10px 5px 0;
    button {
      border: none;
      border-radius: $radius;
      color: white;
      font-family: $rfont;
      font-size: $rfsize ;
    }
  }
}
</style>