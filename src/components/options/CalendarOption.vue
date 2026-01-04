<script setup lang="ts">
  import axios from "axios";
  import {backendOrigin} from "@/util";
  import {onMounted, Ref, ref} from "vue";

  const addedDayType: Ref<string> = ref("");
  const modifiedDayType: Ref<string> = ref("");
  const calendar: Ref<Array<string>> = ref([])
  const dayTypes: Ref<Array<string>> = ref(["livraison", "marchands", "labeur", "doleances"])
  const modifiedDay: Ref<number> = ref(0)
  const getCalendar = () => {
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
      .then((res) => {
        if (day_number === modifiedDay.value) {
          modifiedDay.value = 0;
        } else if (day_number > modifiedDay.value) {
          modifiedDay.value--;
        }
      })
      .catch((err) => {console.log(err);})
  }
  const modifyDay = (day_number: number) => {
    if (modifiedDayType.value === "" || day_number === 0) {
      return;
    }
    axios.put(`${backendOrigin}/calendar?day_number=${day_number}`)
        .then((res) => {getCalendar()})
        .catch((err) => {console.log(err);})
  }

  onMounted(() => {
   getCalendar();
  })

</script>

<template>
  <div class="option_menu">
    <p class="label">Calendrier</p>
    <ul>
      <p v-if="calendar.length === 0" class="empty">Le calendrier est vide</p>
      <li v-for="[index, day] in calendar.entries()" :key="day">
        {{index+1}} - <span>{{day}}</span>
        <button class="edit">Edit</button>
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
</template>

<style scoped lang="scss">
* {
  color: white;
}
ul {
  background-color: $gray3;
  border-radius: 5px;
  padding: 10px;
  width: 80%;
  padding-left: 0px;
  height: 25%;
  overflow-y: scroll;
}
p.label {
  text-align: center;
  font-family: $stfont;
  text-decoration: underline;
  background-color: $gray2;
  width: 90%;
  border-radius: $radius;
  padding: 10px;
  font-style: italic;
  margin-top: 40%;
  font-size: $stfsize;
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
span:hover {
  background-color: $gray6;
  border: $blue solid 1px;
}
img {
  height: 20px;
  margin-top: 3px;
}
button, select {
  height: 100%;
  background-color: $gray5;
  border-radius: $radius;
  border: 1px solid $gray3;
  font-size: $rfsize;
  margin-bottom: 0px;
}
button:hover, select:hover {
  border: 1px solid $blue;
  background-color: $gray6;
}
button:active, select:active {
  background-color: $gray3;
}
div.selection {
  flex-direction: row;
  border: $gray4 solid 1px;
  border-radius: $radius;
  background-color: $gray4;
}
div.selection > select {
  border-radius: $radius 0 0 $radius;
  border: $gray5 solid 1px;
}
div.selection > button {
  border-radius: 0 $radius $radius 0;
  background-color: $gray3;
  border: $gray3 solid 1px;
}
div.selection:hover {
  background-color: $blue;
  border: $blue solid 1px;
}
</style>