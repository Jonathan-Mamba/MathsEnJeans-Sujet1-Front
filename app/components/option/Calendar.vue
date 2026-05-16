<script setup lang="ts">
const { calendar, addDay, removeDay, modifyDay } = useGameCalendar();
const { dayTypes } = useGameDayTypes();

const addedDayType = ref<string>("");
const modifiedDayType = ref<string>("");

const modifiedDay = ref<number>(0)

const setModifiedDay = (dayNumber: number) => {
  modifiedDay.value = dayNumber;
  modifiedDayType.value = calendar.value.at(dayNumber - 1)!.type ?? "";
}
</script>

<template>
  <div class="dialog-parent">
    <div :class="{'blurred': modifiedDay > 0}" class="option-menu">
      <p class="title">Calendrier</p>
      <OptionDataList 
      :items="calendar" 
      empty-text="Le calendrier est vide." 
      @edit="(_, index) => setModifiedDay(index + 1)" 
      @delete="(_, index) => removeDay(index + 1)" 
      :get-key="(item) => item.id" 
      has-edit has-delete numbered
      >
        <template #row="{ item }">{{ item.type }}</template>
      </OptionDataList>
      <form class="centered" @submit.prevent="addDay(addedDayType)">
        <OptionFormEntry type="select" :options="dayTypes" label="Type de jour" v-model="addedDayType" @update:model-value="addDay(addedDayType)"/>
        <button type="submit" class="blue">Ajouter au calendrier</button>
      </form>
    </div>
    <Dialog title="Modifier le jour" @confirm="modifyDay(modifiedDay, modifiedDayType); modifiedDay = 0" @cancel="modifiedDay = 0" v-if="modifiedDay > 0" class="dialog">
       <div class="centered">
        <OptionFormEntry type="select" :options="dayTypes" label="Type de jour" v-model="modifiedDayType" class="dialog-form-entry"/>
       </div>
    </Dialog>
  </div>
</template>

<style scoped>
@import "~/assets/option_menu.css";
div.dialog {
  min-width: 60%;
}
div.dialog-form-entry {
  width: 70%;
}
</style>