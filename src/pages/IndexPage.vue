<template>
  <q-page class="column q-pa-none" style="min-height: 100vh">
    <!-- Hero Section (Full Width) -->
    <div
      style="
        position: relative;
        background-image: url(https://res.cloudinary.com/dvyjiepra/image/upload/v1746225405/bg_kibedb.jpg);
        background-size: cover;
        background-position: center;
        width: 100%;
        min-height: 800px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 2rem;
      "
    >
      <!-- Dark Overlay -->
      <div
        style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5); /* Dark overlay */
          z-index: 1;
        "
      ></div>

      <!-- Content -->
      <div style="position: relative; z-index: 2">
        <p class="text-h1" style="font-weight: bold; color: white">
          ERIS <span style="white-space: nowrap">エリス</span>
        </p>
        <p style="font-weight: bold; font-size: 1rem; color: white">
          Your ultimate destination for premium cards, unbeatable deals, and fast, reliable
          delivery.
        </p>
      </div>
    </div>

    <!-- Additional Sections -->
    <div class="q-mx-xl q-my-md">
      <q-card-section class="display-cards">
        <p class="text-h5" style="font-weight: bold">Featured Cards</p>
        <div class="q-my-xl">
          <p>DISPLAY FEATURED CARDS HERE</p>
        </div>
      </q-card-section>
    </div>

    <div class="q-mx-xl q-my-md">
      <q-card-section class="display-cards">
        <p class="text-h5" style="font-weight: bold">Newly Added Cards</p>
        <div class="q-my-xl">
          <p>DISPLAY NEWLY ADDED CARDS HERE</p>
        </div>
      </q-card-section>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style lang="sass" scoped>
.display-cards
  margin: 0px 10% 0px 10%


@media (max-width: 768px)
  .display-cards
    margin: 0px 0px 0px 0px
</style>
