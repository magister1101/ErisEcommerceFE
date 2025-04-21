<template>
  <q-page class="flex flex-center">
    <q-section class="full-width">
      <div class="q-gutter-md row justify-center items-center q-col-gutter-md">
        <q-card
          v-for="game in games"
          :key="game.name"
          class="game-card col-10 col-sm-6 col-md-4 col-lg-3"
          clickable
          @click="goToGame(game.route)"
        >
          <q-img :src="game.image" fit="contain" style="height: 200px" />
          <q-card-section class="text-center">
            <div class="text-h6">{{ game.name }}</div>
          </q-card-section>
        </q-card>
      </div>
    </q-section>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const games = [
  {
    name: 'YUGIOH',
    image: 'https://res.cloudinary.com/dvyjiepra/image/upload/v1745242597/Yu-Gi-Oh_frilmo.png',
    route: '/item/ygo',
  },
  // Add more games here...
]

function goToGame(route) {
  router.push(route)
}
</script>

<style scoped>
.game-card {
  transition: transform 0.2s;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.game-card:hover {
  transform: scale(1.03);
}
</style>
