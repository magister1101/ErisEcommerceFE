<template>
  <q-page class="q-pa-md">
    <div>
      <div class="text-h5 text-center q-mb-md">Items for {{ game.toUpperCase() }}</div>

      <!-- Expansion Filter -->
      <div class="q-mb-md">
        <div class="searchContainer">
          <q-input filled v-model="selectedExpansion" />
          <q-select v-model="selectedExpansion" :options="expansions" label="Standard" filled />
        </div>
      </div>
    </div>
    <div v-if="tableLoading" class="flex flex-center q-my-xl">
      <q-spinner-dots color="primary" size="50px" />
    </div>

    <div v-else>
      <div v-if="filteredCards.length" class="q-gutter-md row cardAll">
        <div
          v-for="card in filteredCards"
          :key="card._id"
          class="col-12 col-sm-10 col-md-6 col-lg-5 col-xl-2"
        >
          <q-card flat bordered class="q-pa-sm row no-wrap items-start">
            <!-- Left: Image -->
            <q-img
              :src="card.file || 'https://via.placeholder.com/150x210?text=No+Image'"
              :alt="card.name"
              style="width: 120px; height: auto"
              class="q-mr-sm"
            />

            <!-- Right: Info -->
            <div class="column justify-between q-gutter-xs" style="flex: 1">
              <div>
                <div class="text-subtitle1 text-weight-medium">{{ card.name }}</div>
                <div class="text-caption text-grey">{{ card.expansion }}</div>
                <div class="text-caption text-grey">{{ card.code }}</div>
                <div class="text-caption text-grey">{{ card.series }}</div>
                <div class="text-caption text-grey">⭐ {{ card.rarity }}</div>
              </div>

              <div class="row items-center justify-between">
                <div class="text-bold text-primary">₱{{ card.price.toFixed(2) }}</div>
              </div>
            </div>
            <q-btn
              size="sm"
              :disable="card.quantity === 0"
              :label="card.quantity === 0 ? 'Out of Stock' : 'add'"
              color="primary"
              rounded
            />
          </q-card>
        </div>
      </div>

      <div v-else class="text-center text-grey q-mt-xl">
        <q-icon name="shopping_cart_off" size="40px" />
        <div class="q-mt-sm">No items available for this game.</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const game = route.params.game

const cards = ref([])
const filteredCards = ref([])
const expansions = ref([]) // Store the expansions
const selectedExpansion = ref(null) // The selected expansion filter
const tableLoading = ref(false)

// Fetch the list of expansions for the selected game
async function getExpansions() {
  try {
    const response = await axios.get(`${process.env.api_host}/config/expansion/get?game=${game}`)

    console.log(response.data.map((expansion) => expansion.name))
    expansions.value = response.data.map((expansion) => expansion.name)
  } catch (error) {
    console.error('Error fetching expansions:', error)
  }
}

// Fetch the cards for the selected game
async function getCards() {
  tableLoading.value = true
  try {
    const response = await axios.get(`${process.env.api_host}/cards?game=${game}&isArchived=false`)
    cards.value = response.data
    filteredCards.value = response.data // Initialize with all cards
  } catch (error) {
    console.error('Error fetching cards:', error)
  } finally {
    tableLoading.value = false
  }
}

// Filter cards based on the selected expansion
function filterCardsByExpansion() {
  console.log('Selected Expansion:', selectedExpansion.value)

  if (selectedExpansion.value) {
    // Ensure the expansion is being correctly compared (e.g., matching by ID or name)
    filteredCards.value = cards.value.filter((card) => card.expansion === selectedExpansion.value)
    console.log('Filtered Cards:', filteredCards.value)
  } else {
    filteredCards.value = cards.value
    console.log('Showing all cards:', filteredCards.value)
  }
}

onMounted(() => {
  getCards()
  getExpansions() // Fetch expansions when the component mounts
})
</script>

<style lang="sass" scoped>
@media (max-width: 768px),( max-height: 768px)
  .cardAll
    justify-content: center
</style>
