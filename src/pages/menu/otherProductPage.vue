<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-lg">
      <!-- Filters: Left Side -->
      <div class="col-12 col-md-3 col-lg-2">
        <div class="q-pa-md">
          <q-input
            v-model="searchQuery"
            label="Search Product"
            outlined
            debounce="300"
            class="q-mb-md"
          />

          <q-select
            v-model="selectedCategory"
            :options="categoryOptions"
            label="Filter by Category"
            outlined
            clearable
            class="q-mb-md"
          />
        </div>
      </div>

      <!-- Products: Right Side -->
      <div class="col-12 col-md-9">
        <div v-if="tableLoading" class="flex flex-center q-my-xl">
          <q-spinner-dots color="primary" size="50px" />
        </div>

        <div v-else>
          <div v-if="paginatedGroupedByCategory.length">
            <div v-for="(group, index) in paginatedGroupedByCategory" :key="index">
              <div class="text-accent text-bold text-h6 q-my-md">
                {{ group.category }} ({{ group.products.length }} Item)
              </div>

              <div class="q-gutter-md row productAll">
                <div
                  v-for="otherProducts in group.products"
                  :key="otherProducts._id"
                  class="col-12 col-sm-5 col-md-5 col-lg-2 col-xl-2"
                  style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)"
                >
                  <q-card
                    clickable
                    @click="goToProduct(otherProducts._id)"
                    flat
                    bordered
                    class="q-pa-sm row no-wrap items-start card-hover"
                    style="
                      transition:
                        transform 0.2s ease,
                        box-shadow 0.2s ease;
                    "
                  >
                    <div
                      class="column q-gutter-xs"
                      style="flex: 1; position: relative; min-height: 150px"
                    >
                      <q-img
                        :src="
                          otherProducts.file || 'https://via.placeholder.com/150x210?text=No+Image'
                        "
                        :alt="otherProducts.name"
                        style="width: auto; height: 150px"
                        class="q-mr-sm"
                      />
                      <div>
                        <div class="text-subtitle1 text-bold text-accent">
                          {{ otherProducts.name }}
                        </div>
                        <div class="text-caption text-grey">{{ otherProducts.expansion }}</div>
                        <div class="text-caption text-grey">{{ otherProducts.code }}</div>
                        <div class="text-caption text-grey">{{ otherProducts.series }}</div>
                        <div class="text-caption text-grey">{{ otherProducts.category }}</div>
                      </div>

                      <div
                        class="row items-center justify-between bottomDiv"
                        style="bottom: 0; left: 0; right: 0; margin-top: auto"
                      >
                        <div class="text-bold text-primary">
                          {{ otherProducts.quantity }} in Stock
                        </div>
                        <div class="text-bold text-accent text-h6">
                          ₱{{ otherProducts.price.toFixed(2) }}
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
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const products = ref([])
const filteredOtherProducts = ref([])
const tableLoading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref(null)

const itemsPerPage = ref(24)
const currentPage = ref(1)

// Dynamic filter options
const categoryOptions = computed(() => {
  const set = new Set(products.value.map((c) => c.category).filter(Boolean))
  return Array.from(set).sort()
})

// Filter logic
watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1
  filteredOtherProducts.value = products.value.filter((otherProduct) => {
    const matchesSearch = searchQuery.value
      ? [otherProduct.name, otherProduct.code, otherProduct.category]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(searchQuery.value.toLowerCase()))
      : true

    const matchesCategory = selectedCategory.value
      ? otherProduct.category === selectedCategory.value
      : true

    return matchesSearch && matchesCategory
  })
})

// Grouping and pagination logic
const groupedByCategory = computed(() => {
  const groups = {}
  filteredOtherProducts.value.forEach((product) => {
    const category = product.category || 'Unknown'
    if (!groups[category]) groups[category] = []
    groups[category].push(product)
  })

  return Object.entries(groups)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([category, products]) => ({ category, products }))
})

const flatSortedProducts = computed(() =>
  groupedByCategory.value.flatMap((group) => group.products),
)

const paginatedFlatOtherProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return flatSortedProducts.value.slice(start, start + itemsPerPage.value)
})

const paginatedGroupedByCategory = computed(() => {
  const groups = {}
  paginatedFlatOtherProducts.value.forEach((otherProducts) => {
    const category = otherProducts.category || 'Unknown'
    if (!groups[category]) groups[category] = []
    groups[category].push(otherProducts)
  })

  return Object.entries(groups).map(([category, products]) => ({ category, products }))
})

const totalPages = computed(() => Math.ceil(flatSortedProducts.value.length / itemsPerPage.value))

async function getOtherProducts() {
  tableLoading.value = true
  try {
    const response = await axios.get(
      `${process.env.api_host}/otherProducts?isArchived=false&isPreorder=false`,
    )
    products.value = response.data
    filteredOtherProducts.value = response.data
  } catch (error) {
    console.error('Error fetching Products:', error)
  } finally {
    tableLoading.value = false
  }
}

async function goToProduct(productId) {
  try {
    await router.push(`/product/${productId}`)
  } catch (error) {
    console.error('Error redirecting to product:', error)
  }
}

onMounted(() => {
  getOtherProducts()
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
  .productAll
    justify-content: center
</style>
