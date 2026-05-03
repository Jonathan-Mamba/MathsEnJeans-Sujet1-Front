<script setup lang="ts">
const { squares, addSquare, modifySquare, deleteSquare } = useGameSquares();
const modifiedSquare = ref<string>("");
const modifiedSquareName = ref<string>("");
const addedSquare = ref<string>("");
</script>

<template>
  <div class="dialog-parent">
    <div :class="{'blurred': modifiedSquare !== '', 'content': true, 'centered': true, 'option-menu': true}">
      <p class="title">Cases</p>
      <ul class="data-list">
        <p v-if="squares.length === 0" class="empty">La liste des cases est vide</p>
        <li v-for="square in squares" :key="square">
          <span>{{square}}</span>
          <button class="edit" @click="modifiedSquare = square">Modifier</button>
          <button @click="deleteSquare(square)"><img class="delete" src="/icons/trash-bin-red.png"></button>
        </li>
      </ul>
      <form class="centered" @submit.prevent="addSquare(addedSquare)">
         <div class="input-form-container centered">
          <label for="square_name">Nom de la case</label>
          <input type="text" v-model="addedSquare" placeholder="Entrez le nom de la case">
         </div>
        <button type="submit" class="blue">Ajouter à la liste</button>
      </form>
    </div>
    <Dialog v-if="modifiedSquare !== ''" title="Modifier la case" @confirm="modifySquare(modifiedSquare, modifiedSquareName); modifiedSquare = ''" @cancel="modifiedSquare = ''">
      <div class="centered">
        <div class="input-form-container centered">
          <label for="new_square_name">Nom de la case</label>
          <input name="new_square_name" type="text" v-model="modifiedSquareName" placeholder="Entrez le nom de la case">
         </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
@import "~/assets/option_menu.css";
span {
  padding: 3px 0px 2px 0px;
  flex: 1;
}
</style>