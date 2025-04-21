<template>
  <q-page class="q-pa-md">
    <div>
      <div class="text-h5 text-left q-mb-md">{{ game.toUpperCase() }}</div>
    </div>

    <!-- Search input -->
    <q-input v-model="searchQuery" label="Search Cards" outlined debounce="300" class="q-mb-md" />

    <!-- Items per page selection -->
    <!-- <q-select
      outlined
      v-model="itemsPerPage"
      :options="[6, 12, 24, 48]"
      label="Items per page"
      class="q-mb-md"
    /> -->

    <div v-if="tableLoading" class="flex flex-center q-my-xl">
      <q-spinner-dots color="primary" size="50px" />
    </div>

    <div v-else>
      <div v-if="paginatedGroupedByRarity.length">
        <div v-for="(group, index) in paginatedGroupedByRarity" :key="index">
          <div class="text-accent text-bold text-h6 q-my-md">
            {{ group.rarity }} ({{ group.cards.length }} Cards)
          </div>

          <div class="q-gutter-md row cardAll">
            <div
              v-for="card in group.cards"
              :key="card._id"
              class="col-12 col-sm-11 col-md-5 col-lg-5 col-xl-3"
              style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)"
            >
              <q-card
                flat
                bordered
                class="q-pa-sm row no-wrap items-start card-hover"
                style="
                  transition:
                    transform 0.2s ease,
                    box-shadow 0.2s ease;
                "
              >
                <q-img
                  :src="card.file || 'https://via.placeholder.com/150x210?text=No+Image'"
                  :alt="card.name"
                  style="width: 120px; height: auto"
                  class="q-mr-sm"
                />

                <div
                  class="column q-gutter-xs"
                  style="flex: 1; position: relative; min-height: 200px"
                >
                  <div>
                    <div class="text-subtitle1 text-bold text-accent">
                      {{ card.name }}
                    </div>
                    <div class="text-caption text-grey">{{ card.expansion }}</div>
                    <div class="text-caption text-grey">{{ card.code }}</div>
                    <div class="text-caption text-grey">{{ card.series }}</div>
                    <div class="text-caption text-grey">⭐ {{ card.rarity }}</div>
                  </div>

                  <div
                    class="row items-center justify-between bottomDiv"
                    style="position: absolute; bottom: 0; left: 0; right: 0"
                  >
                    <div class="text-bold text-primary">{{ card.quantity }} in Stock</div>
                    <div class="text-bold text-accent text-h6">₱{{ card.price.toFixed(2) }}</div>
                  </div>
                </div>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div class="flex justify-center q-mt-lg">
          <q-pagination
            v-model="currentPage"
            :max="totalPages"
            :max-pages="6"
            boundary-numbers
            direction-links
            color="primary"
          />
        </div>
      </div>

      <div v-else class="text-center text-grey q-mt-xl">
        <div class="q-mt-sm">No items available.</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const game = route.params.game

const cards = ref([])
const filteredCards = ref([])
const searchQuery = ref('')
const tableLoading = ref(false)
const itemsPerPage = ref(24)
const currentPage = ref(1)

// Group cards by rarity
const groupedByRarity = computed(() => {
  const groups = {}
  filteredCards.value.forEach((card) => {
    const rarity = card.rarity || 'Unknown'
    if (!groups[rarity]) {
      groups[rarity] = []
    }
    groups[rarity].push(card)
  })

  const sortedGroups = Object.keys(groups)
    .sort((a, b) => groups[a].length - groups[b].length)
    .map((rarity) => ({
      rarity,
      cards: groups[rarity],
    }))

  return sortedGroups
})

// Flatten the sorted groups for pagination
const flatSortedCards = computed(() => {
  return groupedByRarity.value.flatMap((group) => group.cards)
})

// Paginated cards (flat)
const paginatedFlatCards = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return flatSortedCards.value.slice(start, start + itemsPerPage.value)
})

// Regroup paginated cards by rarity
const paginatedGroupedByRarity = computed(() => {
  const groups = {}
  paginatedFlatCards.value.forEach((card) => {
    const rarity = card.rarity || 'Unknown'
    if (!groups[rarity]) {
      groups[rarity] = []
    }
    groups[rarity].push(card)
  })

  return Object.keys(groups).map((rarity) => ({
    rarity,
    cards: groups[rarity],
  }))
})

// Total pages
const totalPages = computed(() => Math.ceil(flatSortedCards.value.length / itemsPerPage.value))

// Fetch cards
async function getCards() {
  tableLoading.value = true
  try {
    const response = await axios.get(`${process.env.api_host}/cards?game=${game}&isArchived=false`)
    cards.value = response.data
    filteredCards.value = response.data
  } catch (error) {
    console.error('Error fetching cards:', error)
  } finally {
    tableLoading.value = false
  }
}

// Filter on search
watch(searchQuery, () => {
  currentPage.value = 1
  filteredCards.value = cards.value.filter((card) => {
    return (
      card.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      card.expansion.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      card.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      card.series.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

onMounted(() => {
  getCards()
})
</script>

<style lang="sass" scoped>
.card-hover:hover
  transform: scale(1.02)
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1)
  z-index: 2

@media (max-width: 768px), (max-height: 768px)
  .cardAll
    justify-content: center
</style>
