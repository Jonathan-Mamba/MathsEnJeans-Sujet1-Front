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
          <button class="edit" @click="modifiedSquare = square"><Icon name="lucide:edit"/></button>
          <button class="delete" @click="deleteSquare(square)"><Icon name="lucide:trash-2"/></button>
        </li>
      </ul>
      <form class="centered" @submit.prevent="addSquare(addedSquare)">
        <OptionFormEntry label="Nom de la case" type="input" placeholder="Entrez le nom de la case" v-model="addedSquare"/>
        <button type="submit" class="blue">Ajouter à la liste</button>
      </form>
    </div>
    <Dialog v-if="modifiedSquare !== ''" title="Modifier la case" @confirm="modifySquare(modifiedSquare, modifiedSquareName); modifiedSquare = ''" @cancel="modifiedSquare = ''">
      <div class="centered">
        <OptionFormEntry label="Nom de la case" type="input" placeholder="Entrez le nom de la case" v-model="addedSquare"/>
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