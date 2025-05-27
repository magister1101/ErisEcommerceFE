<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-lg">
      <!-- Filters: Left Side -->
      <div class="col-12 col-md-3 col-lg-2">
        <div class="q-pa-md">
          <q-input
            v-model="searchQuery"
            label="Search Cards"
            outlined
            debounce="300"
            class="q-mb-md"
          />

          <q-select
            v-model="selectedGame"
            :options="gameOptions"
            label="Filter by Game"
            outlined
            clearable
            class="q-mb-md"
          />

          <q-select
            v-model="selectedRarity"
            :options="rarityOptions"
            label="Filter by Rarity"
            outlined
            clearable
            class="q-mb-md"
          />

          <q-select
            v-model="selectedExpansion"
            :options="expansionOptions"
            label="Filter by Expansion"
            outlined
            clearable
          />
        </div>
      </div>

      <!-- Cards: Right Side -->
      <div class="col-12 col-md-9">
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
                  class="col-12 col-sm-4 col-md-5 col-lg-3 col-xl-3"
                  style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)"
                >
                  <q-card
                    clickable
                    @click="dialogCart(card._id)"
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
                      style="width: 100px; height: auto"
                      class="q-mr-sm"
                    />

                    <div
                      class="column q-gutter-xs"
                      style="flex: 1; position: relative; min-height: 150px"
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
                        style="bottom: 0; left: 0; right: 0; margin-top: auto"
                      >
                        <div class="text-bold text-primary">{{ card.quantity }} in Stock</div>
                        <div class="text-bold text-accent text-h6">
                          ₱{{ card.price.toFixed(2) }}
                        </div>
                      </div>
                    </div>
                  </q-card>
                </div>
              </div>
            </div>

            <div class="flex justify-center q-mt-lg">
              <q-pagination
                v-model="currentPage"
                :max="totalPages"
                :max-pages="5"
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
      </div>
    </div>

    <q-dialog v-model="addToCartDialog" persistent>
      <q-card>
        <q-card-section class="row items-center q-pa-sm">
          <q-icon name="warning" color="red" size="md" class="q-mr-sm" />
          <div class="text-h6">Confirmation</div>
        </q-card-section>

        <q-card-section> Add to Cart? </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Yes" color="primary " @click="addToCart()" v-close-popup />
          <q-btn flat label="No, Cancel" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { mdiCarChildSeat } from '@quasar/extras/mdi-v4'
import { Notify } from 'quasar'

const router = useRouter()

const cards = ref([])
const filteredCards = ref([])
const tableLoading = ref(false)
const searchQuery = ref('')
const selectedGame = ref(null)
const selectedRarity = ref(null)
const selectedExpansion = ref(null)
const addToCartDialog = ref(false)

const cardToCart = ref(null)
const cartQuantity = ref(1)

const itemsPerPage = ref(24)
const currentPage = ref(1)

// Dynamic filter options
const gameOptions = computed(() => {
  const set = new Set(cards.value.map((c) => c.game).filter(Boolean))
  return Array.from(set).sort()
})

const rarityOptions = computed(() => {
  const set = new Set(cards.value.map((c) => c.rarity).filter(Boolean))
  return Array.from(set).sort()
})

const expansionOptions = computed(() => {
  const set = new Set(cards.value.map((c) => c.expansion).filter(Boolean))
  return Array.from(set).sort()
})

// Filter logic
watch([searchQuery, selectedGame, selectedRarity, selectedExpansion], () => {
  currentPage.value = 1
  filteredCards.value = cards.value.filter((card) => {
    const matchesSearch = searchQuery.value
      ? [card.name, card.code, card.series, card.expansion, card.rarity]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(searchQuery.value.toLowerCase()))
      : true

    const matchesGame = selectedGame.value ? card.game === selectedGame.value : true

    const matchesRarity = selectedRarity.value ? card.rarity === selectedRarity.value : true

    const matchesExpansion = selectedExpansion.value
      ? card.expansion === selectedExpansion.value
      : true

    return matchesSearch && matchesGame && matchesRarity && matchesExpansion
  })
})

// Grouping and pagination logic
const groupedByRarity = computed(() => {
  const groups = {}
  filteredCards.value.forEach((card) => {
    const rarity = card.rarity || 'Unknown'
    if (!groups[rarity]) groups[rarity] = []
    groups[rarity].push(card)
  })

  return Object.entries(groups)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([rarity, cards]) => ({ rarity, cards }))
})

const flatSortedCards = computed(() => groupedByRarity.value.flatMap((group) => group.cards))

const paginatedFlatCards = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return flatSortedCards.value.slice(start, start + itemsPerPage.value)
})

const paginatedGroupedByRarity = computed(() => {
  const groups = {}
  paginatedFlatCards.value.forEach((card) => {
    const rarity = card.rarity || 'Unknown'
    if (!groups[rarity]) groups[rarity] = []
    groups[rarity].push(card)
  })

  return Object.entries(groups).map(([rarity, cards]) => ({ rarity, cards }))
})

const totalPages = computed(() => Math.ceil(flatSortedCards.value.length / itemsPerPage.value))

async function getCards() {
  tableLoading.value = true
  try {
    const response = await axios.get(
      `${process.env.api_host}/cards?isArchived=false&isPreorder=false`,
    )
    cards.value = response.data
    filteredCards.value = response.data
  } catch (error) {
    console.error('Error fetching cards:', error)
  } finally {
    tableLoading.value = false
  }
}

async function dialogCart(cardId) {
  try {
    addToCartDialog.value = true
    cardToCart.value = cardId
    cartQuantity.value = 1
  } catch (error) {
    console.error('Error redirecting to card:', error)
  }
}

async function addToCart() {
  try {
    const token = localStorage.getItem('authToken')
    console.log(cardToCart.value)
    const response = await axios.post(
      `${process.env.api_host}/users/addToCart`,
      {
        productId: cardToCart.value,
        quantity: cartQuantity.value,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    )
    Notify.create({
      message: 'Card added to cart',
      color: 'positive',
      icon: mdiCarChildSeat,
      timeout: 2000,
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
  }
}

onMounted(() => {
  getCards()
})
</script>

<style lang="sass" scoped>
.card-hover:hover
  transform: scale(1.02)
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1)
  z-index: 2
  cursor: pointer

.text-caption
  font-size: 0.6rem



@media (max-width: 768px), (max-height: 768px)
  .cardAll
    justify-content: center
</style>
