<script setup lang="ts">
  import axios from "axios";
  import {backendOrigin, dayTypes, getDayTypes} from "@/util";
  import {Ref, ref} from "vue";
  import "@/components/Dialog.vue"
  import Dialog from "@/components/Dialog.vue";

  const addedDayType: Ref<string> = ref("");
  const modifiedDayType: Ref<string> = ref("");
  const calendar: Ref<Array<string>> = ref([])
  const modifiedDay: Ref<number> = ref(0)
  getDayTypes()

  async function getCalendar() {
    axios.get(`${backendOrigin}/calendar`)
      .then((res) => {calendar.value = res.data})
      .catch((err) => {console.log(err);}) 
  }
  const addDay = () => {
    if (addedDayType.value === "") {
      return;
    }
    axios.post(`${backendOrigin}/calendar?day_type=${addedDayType.value}`)
      .then((res) => {getCalendar()})
      .catch((err) => {console.log(err);})
  }
  const removeDay = (day_number: number) => {
    axios.delete(`${backendOrigin}/calendar?day_number=${day_number}`, )
      .then((res) => {getCalendar()})
      .catch((err) => {console.log(err);})
  }
  const modifyDay = () => {
    if (modifiedDayType.value === "" || modifiedDay.value === 0) {
      return;
    }
    axios.put(`${backendOrigin}/calendar?day_number=${modifiedDay.value}&new_day=${modifiedDayType.value}`)
        .then((res) => {getCalendar()})
        .catch((err) => {console.log(err);})
  }
  getCalendar()
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
      <div class="button_form_container centered">
        <select v-model="addedDayType">
          <option v-for="dayType in dayTypes" :value="dayType">{{dayType}}</option>
        </select>
        <button @click="addDay(); console.log('Added day:', addedDayType)">Ajouter au calendrier</button>
      </div>
    </div>
    <Dialog title="Modifier le jour" :is_open="modifiedDay > 0" @confirm="modifyDay(); modifiedDay = 0" @cancel="modifiedDay = 0" v-if="modifiedDay > 0">
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

<style scoped lang="scss">
@import "@/components/options/option_menu";
li label {
  width: 7%;
  text-align: right;
  margin-right: 5px;
}
p.empty {
  text-align: center;
  font-family: $rfont;
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
  border-radius: $radius+5;
}
div.content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
ul.data_list {
  span {
    flex: 1;
  }
}
</style>