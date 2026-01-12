<script setup lang="ts">
  import axios from "axios";
  import {backendOrigin} from "@/util";
  import {onMounted, Ref, ref} from "vue";

  const addedDayType: Ref<string> = ref("");
  const modifiedDayType: Ref<string> = ref("");
  const calendar: Ref<Array<string>> = ref([])
  const dayTypes: Ref<Array<string>> = ref(["livraison", "marchands", "labeur", "doleances"])
  const modifiedDay: Ref<number> = ref(0)

  async function getCalendar() {
    axios.get(`${backendOrigin}/calendar`)
      .then((res) => {calendar.value = res.data})
      .catch((err) => {console.log(err);}) 
  }
  const addDay = () => {
    if (addedDayType.value === "") {
      return;
    }
    axios.post(`${backendOrigin}/calendar?day_type=${addedDayType.value}`, )
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
      <ul>
        <p v-if="calendar.length === 0" class="empty">Le calendrier est vide</p>
        <li v-for="[index, day] in calendar.entries()" :key="day">
          <label>{{index+1}} - </label>
          <span>{{day}}</span>
          <button class="edit" @click="modifiedDay = index+1">Modifier</button>
          <button @click="removeDay(index+1)"><img src="/icons/trash-bin-red.png"></button>
        </li>
      </ul>
      <div class="selection centered">
        <select v-model="addedDayType">
          <option v-for="dayType in dayTypes" :value="dayType">{{dayType}}</option>
        </select>
        <button @click="addDay()">Ajouter au calendrier</button>
      </div>
    </div>
    <div class="dialog centered" v-if="modifiedDay > 0">
      <div class="dialog_content1 centered">
        <label>Nouveau type de jour:
          <select v-model="modifiedDayType">
            <option v-for="dayType in dayTypes" :value="dayType">{{dayType}}</option>
          </select>
        </label>
      </div>
      <div class="dialog_content2">
        <button class="red" @click="modifiedDay = 0">Annuler</button>
        <button class="blue" @click="modifyDay(); modifiedDay = 0">Appliquer</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/components/options/option_menu";
ul {
  background-color: $gray3;
  border-radius: $radius;
  padding: 10px;
  width: 80%;
  padding-left: 0px;
  height: 25%;
  overflow-y: scroll;
}
div.content label {
  width: 7%;
  text-align: right;
  margin-right: 5px;
}
p.empty {
  text-align: center;
  font-family: $rfont;
  font-style: italic;
}
span {
  background-color: $gray5;
  padding-left: 10px;
  border-radius: 5px;
  font-family: $rfont;
  border: $gray3 solid 1px;
  font-style: italic;
  text-align: center;
  flex:1;
  font-size: $rfsize+2
}
li {
  list-style-type: none;
  padding-left: 10px;
  font-family: $rfont;
  margin-top: 3px;
  display: flex;
  justify-content: space-between;
  font-size: $rfsize+2
}
img {
  height: 20px;
  margin-top: 3px;
}
div.selection {
  flex-direction: row;
  border: $gray3 solid 1px;
  background-color: $gray3;
  border-radius: $radius;
  &:hover {
    border: $blue solid 1px;
  }
  select {
    border-radius: $radius 0 0 $radius;
    border: $gray5 solid 1px;
  }
  button {
    border-radius: 0 $radius $radius 0;
    background-color: $gray3;
    border: transparent solid 1px;
    &:active {
      background-color: $gray2;
    }
  }
}
div.dialog {
  min-width: 60%;
  min-height: 15%;
  max-height: 60%;
  border-radius: $radius+5;
  div.dialog_content1 {
    height: 90%;
    width: 100%;
    flex: 1;
  }
  div.dialog_content2 {
    display: flex;
    flex-direction: row-reverse;
    width: 100%;
    gap: 5px;
    margin: 0 10px 5px 0;
  }
}
div.content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>