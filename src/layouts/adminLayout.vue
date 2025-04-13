<template>
  <q-layout class="container" view="hHh Lpr lFf">
    <q-header elevated class="shadow-2" style="background-color: #114090">
      <q-toolbar class="text-white q-pa-sm">
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <p class="q-ma-xs text-h5">ERIS エリス</p>
        <q-space />
        <q-tabs shrink>
          <q-btn color="white" icon="logout" label="Logout" @click="logout()" flat />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" :width="250" :breakpoint="500" bordered class="bg-white" overlay>
      <q-scroll-area class="fit">
        <q-list>
          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item
              clickable
              v-ripple
              :to="menuItem.to"
              tag="router-link"
              active-class="q-item--active"
              class="q-ma-md"
            >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import { validation } from '../components/adminViewerUtility.js'

const drawer = ref(false)
const router = useRouter()

const viewer = ref(null)

const menuList = [
  {
    icon: 'list',
    label: 'Card List',
    to: '/admin/ygo/cardList',
  },
  {
    icon: 'bolt',
    label: 'Config',
    to: '/admin/ygo/config',
    separator: true,
  },
]

function logout() {
  try {
    localStorage.clear()
    Notify.create({
      message: 'Logout Success',
      type: 'positive',
      position: 'top',
      timeout: 1000,
    })
    router.push('/secret/')
  } catch (error) {
    console.log(error)
    Notify.create({
      message: 'Logout Failed',
      type: 'negative',
    })
  }
}

async function validate() {
  try {
    const response = await validation()
    viewer.value = response.user
  } catch (error) {
    console.log(error)
    Notify.create({
      message: 'error in validate function',
      type: 'negative',
    })
  }
}

onMounted(() => {
  validate()
})
</script>

<style lang="sass" scoped>
.container
  background: radial-gradient(circle, rgba(255,255,255,1) 60%, rgba(155,187,199,1) 100%);
</style>
