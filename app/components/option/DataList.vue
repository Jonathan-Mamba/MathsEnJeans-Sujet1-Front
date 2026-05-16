<!-- OptionDataList.vue -->
<script setup lang="ts" generic="T">
const props = withDefaults(defineProps<{
   items: T[], 
   emptyText: string, 
   hasEdit?: boolean, 
   hasDelete?: boolean, 
   numbered?: boolean, 
   getKey?: (item: T, index: number) => any
  }>(), 
   {
    getKey: (_, i) => i
  })
defineEmits<{ edit: [item: T, index: number], delete: [item: T, index : number] }>();
</script>

<template>
  <ul :class="{'data-list': true, 'dashboard': $slots.header}">
    <li v-if="$slots.header" class="header">
      <span class="first-row">
        <slot name="header" />
      </span>
      <button v-if="hasEdit" class="edit" style="visibility: hidden;"><Icon name="lucide:edit"/></button>
      <button v-if="hasDelete" class="delete" style="visibility: hidden;"><Icon name="lucide:trash-2"/></button>
    </li>
    <p v-if="items.length === 0" class="empty">{{ emptyText }}</p>
    <TransitionGroup name="slide-in">
      <li v-for="(item, index) in items" :key="getKey(item, index)">
        <label v-if="numbered">{{ index + 1}} -</label>
        <span v-if="$slots.row">
          <slot name="row" :item="item" />
        </span>
        <span v-else>{{ item }}</span>
        <button v-if="hasEdit" class="edit centered" @click="$emit('edit', item, index)"><Icon name="lucide:edit"/></button>
        <button v-if="hasDelete" class="delete centered" @click="$emit('delete', item, index)"><Icon name="lucide:trash-2"/></button>
      </li>
    </TransitionGroup>
  </ul>
</template>

<style scoped>
ul.data-list {
  background-color: var(--gray3);
  border-radius: var(--radius);
  width: 80%;
  padding: 10px 10px 10px 0px;
  height: 25%;
  overflow-y: scroll; 
  & li {
    padding-left: 10px;
    font-family: var(--rfont);
    margin-top: 3px;
    display: flex;
    justify-content: space-between;
    font-size: calc(var(--rfsize) + 2px);
    height: 35px;
    height: fit-content;
    & span {
      background-color: var(--gray5);
      border-radius: var(--radius);
      font-family: var(--rfont);
      border: var(--gray3) solid 1px;
      font-style: italic;
      flex-grow: 1;
      text-align: center;
    }
    & > label {
      margin-right: 5px;
    }
    & button {
      flex: 0 0 auto;
      align-self: stretch;
      min-height: 35px;
      aspect-ratio: 1 / 1;
      stroke-width: 1;
      &.edit { color: white; }
      &.delete { color: var(--red); }
      & * {
        width: 90%;
        height: 90%;
      }
    }
  }
}

ul.dashboard {
  overflow-x: scroll;  
  & span {
    display: flex;
    justify-content: center;
    & :deep(label) {
      padding: 3px 5px 3px 5px;
      flex: 1;
      text-align: center;
      min-width: 13vw;
      background-color: var(--gray7);
      border-radius: var(--radius);
      text-overflow: ellipsis;
      overflow: hidden;
      margin: 5px;
      display: flex;
	    flex-direction: column; 
	    justify-content: center; 
	    align-items: center;
    }
    &.first-row :deep(label) {
      background-color: var(--gray6);
      font-weight: normal;
      font-size: var(--stfsize);
      font-style: normal;
      text-decoration: underline;
    }
  }
}

@media (max-width: 800px) {
  ul.dashboard span :deep(label) {
    min-width: 25vw;
  }
  ul.data-list li {
    height: 28px;
  }
  ul.data-list li button {
    min-height: fit-content;
  }
}

p.empty {
  text-align: center;
  font-style: italic;
}
</style>