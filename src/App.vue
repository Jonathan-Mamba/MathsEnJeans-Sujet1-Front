<template>
  <h1>Todo list</h1>
  <p>{{  }}</p>
  <form @submit.prevent="ajouterTache">
    <input type="text" placeholder="Name" v-model="nomTache">
    <button type="submit">Ajouter la tache</button>
  </form>

  <p v-if="listeTaches.length === 0">Veuillez remplir des tâches</p>

  <div>
    <input type="checkbox" v-model="masquerTerm" name="checkbox-masquer">
    <label for="checkbox-masquer">Masquer les tâches complétées.</label>
    <p>Tâches:</p>

    <div v-for="[index, name] in listeTaches.entries()">
      <input type="checkbox" :name="index" v-model="listeCoches" :value="index" v-if="!(masquerTerm && verifierCoche(index))" @change="trierTaches()">
      <label :for="index" :class="{barred: verifierCoche(index)}" v-if="!(masquerTerm && verifierCoche(index))">{{name}}</label>
    </div>
  </div>
</template>


<script setup>
  import {ref} from 'vue';

  const listeTaches = ref([]);
  const nomTache = ref('');
  const listeCoches = ref([]);
  const masquerTerm = ref(false);

  const verifierCoche = (index) => {
    for (const tache of listeCoches.value) {
      if (index === tache) {
        return true;
      }
    }
    return false;
  }

  const compareTrucs = (a, b) => {
    if (a[1] === b[1]) {
       return 0;
    } else if (a[1]) {
      return 1
    } else {
      return -1;
    }
  }
  const trierTaches = () => {
    const arrayCoche = Array(listeTaches.value.length);
    arrayCoche.fill(false);
    for (const index of listeCoches.value) {
      arrayCoche[index] = true;
    }
    const zipped = listeTaches.value.map((value, index) => [value, arrayCoche[index]]);
    console.log(zipped);
    zipped.sort(compareTrucs);
    console.log(zipped);
    listeTaches.value = zipped.map((value) => value[0]);
    listeCoches.value = zipped.map((value, index) => value[1] ? index : -1).filter((value) => value >= 0);
  }

  const ajouterTache = () => {
    listeTaches.value.push(nomTache.value);
    nomTache.value = '';
    trierTaches();
  };
</script>

<style scoped>
.barred {
  text-decoration-style: dashed;
  background-color: #555;
}
</style > 