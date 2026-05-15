<script setup lang="ts">
const { calendar, addDay, removeDay, modifyDay } = useGameCalendar();
const { dayTypes } = useGameDayTypes();

const addedDayType = ref<string>("");
const modifiedDayType = ref<string>("");

const modifiedDay = ref<number>(0)

const setModifiedDay = (index: number) => {
  modifiedDay.value = index;
  modifiedDayType.value = calendar.value.at(index - 1) ?? "";
}
</script>

<template>
  <div class="option-menu dialog-parent">
    <div :class="{'blurred': modifiedDay > 0, 'content': true, 'centered': true}">
      <p class="title">Calendrier</p>
      <OptionDataList :items="calendar" empty-text="Le calendrier est vide." @edit="(_, index) => setModifiedDay(index)" @delete="(_, index) => removeDay(index + 1)" has-edit numbered>
        <template #row="{ item: day }">{{ day }}</template>
      </OptionDataList>
      <form class="centered" @submit.prevent="addDay(addedDayType)">
        <OptionFormEntry type="select" :options="dayTypes" label="Type de jour" v-model="addedDayType" @update:model-value="addDay(addedDayType)"/>
        <button type="submit" class="blue">Ajouter au calendrier</button>
      </form>
    </div>
    <Dialog title="Modifier le jour" @confirm="modifyDay(modifiedDay, modifiedDayType); modifiedDay = 0" @cancel="modifiedDay = 0" v-if="modifiedDay > 0">
       <div class="centered">
        <OptionFormEntry type="select" :options="dayTypes" label="Type de jour" v-model="modifiedDayType"/>
       </div>
    </Dialog>
  </div>
</template>

<style scoped>
@import "~/assets/option_menu.css";
div.dialog {
  min-width: 60%;
  border-radius: var(--radius2);
}
div.content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>