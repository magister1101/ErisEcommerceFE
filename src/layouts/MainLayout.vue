<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal elevated class="shadow-2" style="background-color: #114090">
      <q-toolbar class="text-white q-pa-sm">
        <p v-on:click="$router.push('/')" class="q-ma-xs text-h5 brand-name">ERIS エリス</p>
        <q-space />

        <q-input
          dark
          dense
          standout
          debounce="300"
          class="q-ml-md searchBar"
          v-model="searchInput"
          placeholder="Search..."
          style="max-width: 300px"
        >
          <template #append>
            <q-btn flat icon="search" @click="search" :loading="searchLoading" />
          </template>
        </q-input>
        <q-btn flat icon="shopping_cart" @click="$router.push('/cart')" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal class="text-white q-pa-md" style="background-color: #114090">
      <div class="row items-center justify-between">
        <!-- Brand / Logo -->
        <!-- <div class="text-h6">MyApp</div> -->

        <!-- Navigation Links -->
        <!-- <div class="row q-gutter-sm items-center">
          <q-btn flat dense label="Home" to="/" class="text-white" />
          <q-btn flat dense label="About" to="/about" class="text-white" />
          <q-btn flat dense label="Contact" to="/contact" class="text-white" />
        </div> -->
      </div>

      <div class="text-caption text-center q-mt-sm">
        © {{ new Date().getFullYear() }} Eris. All rights reserved.
      </div>
    </q-footer>
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
.brand-name
  font-size: 1.5rem

@media (max-width: 768px),( max-height: 768px)
  .brand-name
    font-size: 1rem
  .searchBar
    width: 45%
</style>
