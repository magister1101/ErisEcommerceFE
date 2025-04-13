<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="shadow-2" style="background-color: #114090">
      <q-toolbar class="text-white q-pa-sm">
        <p class="q-ma-xs text-h5">ERIS エリス</p>
        <q-space />

        <q-input
          dark
          dense
          standout
          debounce="300"
          class="q-ml-md"
          v-model="searchInput"
          placeholder="Search..."
          style="max-width: 300px"
        >
          <template #append>
            <q-btn flat icon="search" @click="search" :loading="searchLoading" />
          </template>
        </q-input>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'

const searchInput = ref('')
const searchLoading = ref(false)

async function search() {
  searchLoading.value = true
  try {
    //route to search when done
    Notify.create({
      message: searchInput.value,
      type: 'positive',
      position: 'bottom',
      timeout: 2000,
    })
  } catch (error) {
    console.log(error)
    Notify.create({
      message: 'Error searching',
      type: 'negative',
      position: 'top',
      timeout: 2000,
    })
  } finally {
    searchLoading.value = false
  }
}
</script>

<style lang="sass" scoped>
/* You can add custom styling here if needed */
</style>
