<template>
  <q-layout class="container" view="lHh Lpr lFf">
    <q-header reveal elevated class="shadow-2" style="background-color: #114090">
      <q-toolbar v-if="user !== null" class="text-white q-px-lg q-py-md justify-between">
        <!-- Left: Logo + Brand -->
        <div class="row items-center no-wrap cursor-pointer" @click="navigate('/')">
          <img
            src="https://res.cloudinary.com/dvyjiepra/image/upload/v1744075727/Eris_LOGO_wy0z2j.png"
            alt="Eris Logo"
            style="width: 40px; height: auto"
          />
          <span class="q-ml-sm text-h5 text-bold brand-name">ERIS エリス</span>
        </div>

        <!-- Center Nav: Only visible on md and up -->
        <div class="row justify-center q-gutter-xl items-center gt-md q-md-flex">
          <span class="text-h6 cursor-pointer menu-items" @click="navigate('/cards')">Cards</span>
          <!-- <span class="text-h6 cursor-pointer menu-items" @click="navigate('/preOrders')"
            >Pre-Orders</span
          > -->
          <!-- <span class="text-h6 cursor-pointer menu-items" @click="navigate('/others')">Others</span> -->
        </div>

        <!-- Right: Account, Cart, and Mobile Menu -->
        <div class="row items-center q-gutter-md">
          <q-btn
            flat
            round
            dense
            icon="account_circle"
            @click="navigate('/myProfile')"
            class="q-hidden q-md-inline"
          />
          <q-btn
            flat
            round
            dense
            icon="shopping_cart"
            @click="navigate('/cart')"
            class="q-hidden q-md-inline"
          />
          <q-btn flat dense icon="menu" class="lt-lg" @click="mobileMenu = !mobileMenu" />
        </div>
      </q-toolbar>

      <q-toolbar v-if="user === null" class="text-white q-px-lg q-py-md justify-between">
        <!-- Left: Logo + Brand -->
        <div class="row items-center no-wrap cursor-pointer" @click="navigate('/')">
          <img
            src="https://res.cloudinary.com/dvyjiepra/image/upload/v1744075727/Eris_LOGO_wy0z2j.png"
            alt="Eris Logo"
            style="width: 40px; height: auto"
          />
          <span class="q-ml-sm text-h5 text-bold brand-name">ERIS エリス</span>
        </div>

        <!-- Center Nav: Only visible on md and up -->
        <div class="row justify-center q-gutter-xl items-center gt-md q-md-flex">
          <span class="text-h6 cursor-pointer menu-items" @click="navigate('/cards')">Cards</span>
          <!-- <span class="text-h6 cursor-pointer menu-items" @click="navigate('/preOrders')"
            >Pre-Orders</span
          > -->
          <!-- <span class="text-h6 cursor-pointer menu-items" @click="navigate('/others')">Others</span> -->
        </div>

        <!-- Right: Account, Cart, and Mobile Menu -->
        <div class="row items-center q-gutter-md">
          <q-btn
            flat
            round
            dense
            icon="account_circle"
            @click="navigate('/login')"
            class="q-hidden q-md-inline"
          />
          <q-btn
            flat
            round
            dense
            icon="shopping_cart"
            @click="navigate('/login')"
            class="q-hidden q-md-inline"
          />
          <q-btn flat dense icon="menu" class="lt-lg" @click="mobileMenu = !mobileMenu" />
        </div>
      </q-toolbar>

      <!-- Mobile Nav Slide Down -->
      <q-slide-transition>
        <div v-show="mobileMenu" class="column q-pa-md q-gutter-sm lt-lg">
          <span class="text-subtitle1 cursor-pointer" @click="navigate('/cards')">Cards</span>
          <span class="text-subtitle1 cursor-pointer" @click="navigate('/preOrders')"
            >Pre-Orders</span
          >
          <!-- <span class="text-subtitle1 cursor-pointer" @click="navigate('/others')">Others</span> -->
        </div>
      </q-slide-transition>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <Footer />
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '../components/footerComponent.vue'
import { Notify } from 'quasar'
import axios from 'axios'

const router = useRouter()
const mobileMenu = ref(false)

const user = ref(null)

const searchInput = ref('')

function navigate(path) {
  fetchProfile()
  mobileMenu.value = false
  router.push(path)
}

async function fetchProfile() {
  try {
    const response = await axios.get(`${process.env.api_host}/users/viewer`, {
      headers: { Authorization: localStorage.getItem('authToken') },
    })
    user.value = response.data.user
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<style lang="sass" scoped>
.container
  background: radial-gradient(circle, rgba(255,255,255,1) 50%, rgba(155,187,199,1) 100%)

.brand-name
  font-size: 1.25rem

.menu-items:hover
  color: #bbbbbb

@media (max-width: 768px), (max-height: 768px)
  .brand-name
    font-size: 1rem
  .searchBar
    width: 45%
</style>
