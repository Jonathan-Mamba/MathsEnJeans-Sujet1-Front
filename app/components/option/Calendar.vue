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
      <ul class="data-list">
        <p v-if="calendar.length === 0" class="empty">Le calendrier est vide</p>
        <li v-for="[index, day] in calendar.entries()" :key="day">
          <label>{{index+1}} - </label>
          <span>{{day}}</span>
          <button class="edit" @click="setModifiedDay(index + 1)">Modifier</button>
          <button @click="removeDay(index + 1)"><img class="delete" src="/icons/trash-bin-red.png"></button>
        </li>
      </ul>
      <form class="centered" @submit.prevent="addDay(addedDayType)">
         <div class="input-form-container centered">
          <label for="day_type">Type de jour</label>
          <select v-model="addedDayType" @change="addDay(addedDayType)">
            <option v-for="dayType in dayTypes" :value="dayType">{{dayType}}</option>
          </select>
         </div>
        <button type="submit" class="blue">Ajouter au calendrier</button>
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
@import "~/assets/option_menu.css";
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
ul.data-list span {
  flex: 1;
}
</style>