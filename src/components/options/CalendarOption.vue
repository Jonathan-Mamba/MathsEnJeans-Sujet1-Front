<script setup lang="ts">
  import {Ref, ref, watchEffect} from "vue";
  import Dialog from "@/components/Dialog.vue";
  import { useCalendar, useDayTypes } from "@/composables";
  const { calendar, addDay, removeDay, modifyDay } = useCalendar();
  const { dayTypes } = useDayTypes();

  const addedDayType: Ref<string> = ref("");
  const modifiedDayType: Ref<string> = ref("");
  
  const modifiedDay: Ref<number> = ref(0)

  watchEffect(() => {
    if (modifiedDay.value > 0) {
      modifiedDayType.value = calendar.value[modifiedDay.value-1]
    }
  })

</script>

<template>
  <div class="option_menu dialog_parent">
    <div :class="{'blurred': modifiedDay > 0, 'content': true, 'centered': true}">
      <p class="title">Calendrier</p>
      <ul class="data_list">
        <p v-if="calendar.length === 0" class="empty">Le calendrier est vide</p>
        <li v-for="[index, day] in calendar.entries()" :key="day">
          <label>{{index+1}} - </label>
          <span>{{day}}</span>
          <button class="edit" @click="modifiedDay = index+1">Modifier</button>
          <button @click="removeDay(index+1)"><img class="delete" src="/icons/trash-bin-red.png"></button>
        </li>
      </ul>
      <form class="centered" @submit.prevent="">
         <div class="input_form_container centered">
          <label for="day_type">Type de jour</label>
          <select v-model="addedDayType" @change="addDay(addedDayType)">
            <option v-for="dayType in dayTypes" :value="dayType">{{dayType}}</option>
          </select>
         </div>
        <button @click="addDay(addedDayType)" class="blue">Ajouter au calendrier</button>
      </form>
    </div>
    <Dialog title="Modifier le jour" @confirm="modifyDay(modifiedDay, modifiedDayType); modifiedDay = 0" @cancel="modifiedDay = 0" v-if="modifiedDay > 0">
       <div class="centered">
        <label>Nouveau type de jour:
          <select v-model="modifiedDayType" >
            <option v-for="dayType in dayTypes" :value="dayType">{{dayType}}</option>
          </select>
        </label>
       </div>
    </Dialog>
  </div>
</template>

<style scoped>
@import "@/components/options/option_menu.css";
li label {
  width: 7%;
  text-align: right;
  margin-right: 5px;
}
p.empty {
  text-align: center;
  font-family: var(--rfont);
  font-style: italic;
}
img.delete {
  height: 20px;
  margin-top: 3px;
}
div.dialog {
  min-width: 60%;
  min-height: 15%;
  max-height: 60%;
  border-radius: calc(var(--radius) + 5px);
}
div.content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
ul.data_list span {
  flex: 1;
}
</style>