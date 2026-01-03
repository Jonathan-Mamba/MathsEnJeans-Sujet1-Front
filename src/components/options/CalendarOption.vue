<script setup lang="ts">
  import axios from "axios";
  import {backendOrigin} from "@/util";
  import {onMounted, Ref, ref} from "vue";

  const calendar: Ref<Array<string>> = ref([])
  const setCalendar = () => {
    axios.get(`${backendOrigin}/calendar`)
        .then((res) => {calendar.value = res.data})
        .catch((err) => {console.log(err);})
  }

  onMounted(() => {
   setCalendar();
  })
</script>

<template>
  <div class="container">
    <div class="calendar-list">
      <p>Calendrier: </p>
      <ul>
        <li v-for="day in calendar">{{day}}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
div.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: $gray1;
  height: 100%;
  width: 100%;
  border: $blue solid 1px;
  border-radius: 5px;

}
div.calendar-list {
  background-color: #333337;
  border-radius: 5px;
  padding: 10px;
  width: 80%;
  border: black solid 1px;
}
p {
  color: white;
  text-align: center;
}
</style>