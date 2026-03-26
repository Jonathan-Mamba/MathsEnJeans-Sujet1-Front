<script setup lang="ts">
  import axios from "axios";
  import {backendOrigin, dayTypes, getDayTypes} from "@/util";
  import {Ref, ref, watchEffect} from "vue";
  import "@/components/Dialog.vue"
  import Dialog from "@/components/Dialog.vue";
  import { AxiosError } from 'axios';

  const addedDayType: Ref<string> = ref("");
  const modifiedDayType: Ref<string> = ref("");
  const calendar: Ref<Array<string>> = ref([])
  const modifiedDay: Ref<number> = ref(0)
  getDayTypes()

  async function getCalendar() {
    try {
      const res = await axios.get(`${backendOrigin}/calendar`);
      calendar.value = res.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        alert(`Erreur lors de la récupération du calendrier: ${err.response.data.detail}`);
      }
    }
  }
  const addDay = async () => {
    if (addedDayType.value === "") {
      return;
    }
    try {
      await axios.post(`${backendOrigin}/calendar?day_type=${addedDayType.value}`);
      getCalendar();
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        alert(`Erreur lors de l'ajout du jour: ${err.response.data.detail}`);
      }
    }
  }
  const removeDay = async (day_number: number) => {
    try {
      await axios.delete(`${backendOrigin}/calendar?day_number=${day_number}`);
      getCalendar();
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        alert(`Erreur lors de la suppression du jour: ${err.response.data.detail}`);
      }
    }
  }
  const modifyDay = async () => {
    if (modifiedDayType.value === "" || modifiedDay.value === 0) {
      return;
    }
    try {
      await axios.put(`${backendOrigin}/calendar?day_number=${modifiedDay.value}&new_day=${modifiedDayType.value}`);
      getCalendar();
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        alert(`Erreur lors de la modification du jour: ${err.response.data.detail}`);
      }
    }
  }
  watchEffect(() => {
    if (modifiedDay.value > 0) {
      modifiedDayType.value = calendar.value[modifiedDay.value-1]
    }
  })

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
      <form class="centered" @submit.prevent="">
         <div class="input_form_container centered">
          <label for="day_type">Type de jour</label>
          <select v-model="addedDayType" @change="addDay()">
            <option v-for="dayType in dayTypes" :value="dayType">{{dayType}}</option>
          </select>
         </div>
        <button @click="addDay()" class="blue">Ajouter au calendrier</button>
      </form>
    </div>
    <Dialog title="Modifier le jour" @confirm="modifyDay(); modifiedDay = 0" @cancel="modifiedDay = 0" v-if="modifiedDay > 0">
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