<template>
  <q-page class="column q-pa-none" style="min-height: 100vh">
    <!-- Hero Section (Full Width) -->
    <div class="cover">
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
      <q-card-section>
        <p class="text-h5 text-bold">Featured Cards</p>

        <div class="row q-col-gutter-md q-mt-md">
          <div
            v-for="card in featuredCards"
            :key="card._id"
            class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
          >
            <q-card
              clickable
              @click="dialogCart(card._id)"
              flat
              bordered
              class="q-pa-sm card-hover"
            >
              <div class="row no-wrap items-start">
                <q-img
                  :src="card.file || 'https://via.placeholder.com/150x210?text=No+Image'"
                  :alt="card.name"
                  style="width: 100px; height: auto"
                  class="q-mr-sm"
                />

                <div class="column q-gutter-xs" style="flex: 1; min-height: 150px">
                  <div>
                    <div class="text-subtitle1 text-bold text-accent">
                      {{ card.name }}
                    </div>
                    <div class="text-caption text-grey">{{ card.expansion }}</div>
                    <div class="text-caption text-grey">{{ card.code }}</div>
                    <div class="text-caption text-grey">{{ card.series }}</div>
                    <div class="text-caption text-grey">⭐ {{ card.rarity }}</div>
                  </div>

                  <div class="q-mt-auto">
                    <div class="row items-center justify-between">
                      <div class="text-bold text-primary">{{ card.quantity }} in Stock</div>
                      <div class="text-bold text-accent text-h6">₱{{ card.price.toFixed(2) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </div>

    <div class="q-mx-xl q-my-md">
      <q-card-section>
        <p class="text-h5 text-bold">Newly Added Cards</p>

        <div class="row q-col-gutter-md q-mt-md">
          <div
            v-for="card in newlyAddedCards"
            :key="card._id"
            class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
          >
            <q-card
              clickable
              @click="dialogCart(card._id)"
              flat
              bordered
              class="q-pa-sm card-hover"
            >
              <div class="row no-wrap items-start">
                <q-img
                  :src="card.file || 'https://via.placeholder.com/150x210?text=No+Image'"
                  :alt="card.name"
                  style="width: 100px; height: auto"
                  class="q-mr-sm"
                />

                <div class="column q-gutter-xs" style="flex: 1; min-height: 150px">
                  <div>
                    <div class="text-subtitle1 text-bold text-accent">
                      {{ card.name }}
                    </div>
                    <div class="text-caption text-grey">{{ card.expansion }}</div>
                    <div class="text-caption text-grey">{{ card.code }}</div>
                    <div class="text-caption text-grey">{{ card.series }}</div>
                    <div class="text-caption text-grey">⭐ {{ card.rarity }}</div>
                  </div>

                  <div class="q-mt-auto">
                    <div class="row items-center justify-between">
                      <div class="text-bold text-primary">{{ card.quantity }} in Stock</div>
                      <div class="text-bold text-accent text-h6">₱{{ card.price.toFixed(2) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const router = useRouter()

const tableLoading = ref(false)
const featuredCards = ref([])
const newlyAddedCards = ref([])
const filteredCards = ref([])

async function getCards() {
  tableLoading.value = true
  try {
    const response = await axios.get(
      `${process.env.api_host}/cards?isArchived=false&isPreorder=false`,
    )

    featuredCards.value = response.data
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(0, 4)

    newlyAddedCards.value = response.data
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4)

    filteredCards.value = response.data
  } catch (error) {
    console.error('Error fetching cards:', error)
  } finally {
    tableLoading.value = false
  }
}

onMounted(() => {
  getCards()
})
</script>

<style lang="sass" scoped>
.display-cards
  margin: 0px 10% 0px 10%

.card-hover:hover
  transform: scale(1.02)
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1)
  z-index: 2
  cursor: pointer
.cover
  position: relative
  background-image: url(https://res.cloudinary.com/dvyjiepra/image/upload/v1746225405/bg_kibedb.jpg)
  background-size: cover
  background-position: center
  width: 100%
  min-height: 800px
  display: flex
  justify-content: center
  align-items: center
  text-align: center
  padding: 2rem

@media (max-width: 768px)
  .display-cards
    margin: 0px 0px 0px 0px

  .cover
      min-height: 400px
</style>
