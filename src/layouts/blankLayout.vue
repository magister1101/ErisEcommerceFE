<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup></script>

<style lang="sass" scoped>
.container
  background: radial-gradient(circle, rgba(255,255,255,1) 60%, rgba(155,187,199,1) 100%);
</style>
