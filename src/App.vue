<template>
  <h1>Todo list</h1>
  <form @submit.prevent="ajouterTache">
    <input type="text" placeholder="Name" v-model="nomTache">
    <button type="submit">Ajouter la tache</button>
  </form>

  <p v-if="listeTaches.length === 0">Veuillez remplir des tâches</p>

  <div>
    <input type="checkbox" v-model="masquerTerm" name="checkbox-masquer">
    <label for="checkbox-masquer">Masquer les tâches complétées.</label>
    <p>Tâches:</p>

    <div v-for="tache in getListeTaches">
      <label :class="{barred: tache.completed}" :key="tache.date">
        <input type="checkbox" v-model="tache.completed">
        {{tache.title}}
      </label>
    </div>
  </div>
</template>


<script setup>
  import {computed, ref} from 'vue';

  const listeTaches = ref([]);
  const nomTache = ref('');
  const masquerTerm = ref(false);

  const getListeTaches = computed(() => {
    let l = listeTaches.value.toSorted((a, b) => a.completed > b.completed ? 1 : -1)
    if (masquerTerm.value) {
      return l.filter((tache) => !tache.completed)
    }
    return l

  })

  const ajouterTache = () => {
    listeTaches.value.push({
      title: nomTache.value,
      completed: false,
      date: Date.now(),
    });
    nomTache.value = '';
  };
</script>

<style scoped>
.barred {
  text-decoration-style: dashed;
  background-color: #555;
}
</style > 