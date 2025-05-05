<template>
  <q-page padding>
    <!-- Search Input -->
    <q-table
      :rows="filteredCards"
      :columns="columns"
      :loading="tableLoading"
      row-key="_id"
      :pagination="pagination"
      class="q-pa-none"
    >
      <template v-slot:top-left>
        <q-btn color="primary" icon="add" label="Add card" @click="addDialog = !addDialog" />
      </template>
      <template v-slot:top-right>
        <q-input oninput debounce="300" v-model="searchQuery" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <!-- Custom cell for "Name" -->
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <q-item>
            <q-item-section>{{ props.row.name }}</q-item-section>
          </q-item>
        </q-td>
      </template>

      <!-- Custom cell for "Image" -->
      <template v-slot:body-cell-file="props">
        <q-td :props="props">
          <q-img :src="props.row.file" alt="Card Image" class="table_card_img" />
        </q-td>
      </template>

      <!-- Custom cell for "Actions" -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            color="primary"
            label="Edit"
            @click="openEditDialog(props.row)"
            class="q-ma-sm"
            style="width: 100px"
          />
          <q-space />
          <q-btn
            color="negative"
            label="Delete"
            @click="openDeleteCard(props.row)"
            class="q-ma-sm"
            style="width: 100px"
          />
        </q-td>
      </template>
    </q-table>

    <!-- add dialog -->
    <q-dialog v-model="addDialog" persistent>
      <q-card bordered style="border-radius: 10px; width: 100%">
        <q-form @submit.prevent="saveCard" class="q-mx-xl">
          <q-card-section>
            <p class="text-h5">Create a new card</p>
          </q-card-section>

          <div>
            <q-input class="q-pb-sm" v-model="dialogName" label="Name" filled required dense />
            <q-input class="q-pb-sm" v-model="dialogCode" label="Code" filled required dense />
            <q-input class="q-pb-sm" v-model="dialogSeries" label="Series" filled required dense />
            <q-select
              class="q-pb-sm"
              v-model="dialogRarity"
              :options="rarities"
              label="Rarity"
              filled
              required
              dense
            />
            <q-select
              class="q-pb-sm"
              v-model="dialogGame"
              :options="games"
              label="Game"
              filled
              required
              dense
            />
            <q-select
              class="q-pb-sm"
              v-model="dialogExpansion"
              :options="expansions"
              label="Expansion"
              filled
              required
              dense
            />
            <q-select
              class="q-pb-sm"
              v-model="dialogIsPreorder"
              :options="preorders"
              label="PreOrder?"
              emit-value
              filled
              required
              dense
            />
            <q-input
              v-if="dialogIsPreorder === true"
              class="q-pb-sm"
              v-model="dialogUrl"
              label="YYT-URL"
              filled
              required
              dense
            />

            <q-input
              v-if="dialogIsPreorder === false"
              class="q-pb-sm"
              v-model="dialogQuantity"
              label="Quantity"
              type="number"
              filled
              required
              dense
            />

            <q-input
              v-if="dialogIsPreorder === false"
              class="q-pb-sm"
              v-model="dialogPrice"
              label="Price"
              type="number"
              filled
              required
              dense
            />
            <q-file
              class="q-px-md"
              v-model="dialogImageFile"
              accept="image/*"
              borderless
              label="Upload Profile Image"
              dense
            >
              <template #append>
                <q-icon name="upload"></q-icon>
              </template>
            </q-file>
          </div>
          <q-card-action>
            <q-btn flat label="Cancel" v-close-popup color="negative" class="q-px-md" />
            <q-btn
              type="submit"
              flat
              color="positive"
              label="Save"
              class="q-px-md"
              :loading="dialogLoading"
            />
            <q-btn flat color="info" label="Clear" class="q-px-md" @click="clearDialogs()" />
          </q-card-action>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- edit dialog -->
    <q-dialog v-model="editDialog" persistent>
      <q-card bordered style="border-radius: 10px; width: 100%">
        <q-form @submit.prevent="saveEditCard" class="q-mx-xl">
          <q-card-section>
            <p class="text-h5">Edit a card</p>
          </q-card-section>

          <div>
            <q-input class="q-pb-sm" v-model="dialogName" label="Name" filled required dense />
            <q-input class="q-pb-sm" v-model="dialogCode" label="Code" filled required dense />
            <q-input class="q-pb-sm" v-model="dialogSeries" label="Series" filled required dense />
            <q-select
              class="q-pb-sm"
              v-model="dialogRarity"
              :options="rarities"
              label="Rarity"
              filled
              required
              dense
            />
            <q-select
              class="q-pb-sm"
              v-model="dialogGame"
              :options="games"
              label="Game"
              filled
              required
              dense
            />
            <q-select
              class="q-pb-sm"
              v-model="dialogExpansion"
              :options="expansions"
              label="Expansion"
              filled
              required
              dense
            />
            <q-select
              class="q-pb-sm"
              v-model="dialogIsPreorder"
              :options="preorders"
              label="PreOrder?"
              emit-value
              filled
              required
              dense
            />
            <q-input
              v-if="dialogIsPreorder === true"
              class="q-pb-sm"
              v-model="dialogUrl"
              label="YYT-URL"
              filled
              required
              dense
            />

            <q-input
              v-if="dialogIsPreorder === false"
              class="q-pb-sm"
              v-model="dialogQuantity"
              label="Quantity"
              type="number"
              filled
              required
              dense
            />

            <q-input
              v-if="dialogIsPreorder === false"
              class="q-pb-sm"
              v-model="dialogPrice"
              label="Price"
              type="number"
              filled
              required
              dense
            />
            <q-file
              class="q-px-md"
              v-model="dialogImageFile"
              accept="image/*"
              borderless
              label="Upload Profile Image"
              dense
            >
              <template #append>
                <q-icon name="upload"></q-icon>
              </template>
            </q-file>
          </div>
          <q-card-action>
            <q-btn
              flat
              label="Cancel"
              @click="resetDialogs()"
              v-close-popup
              color="negative"
              class="q-px-md"
            />
            <q-btn
              type="submit"
              flat
              color="positive"
              label="Save"
              class="q-px-md"
              :loading="dialogLoading"
            />
          </q-card-action>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deleteDialog" persistent>
      <q-card bordered class="delete_card_dialog" style="border-radius: 10px">
        <q-card-section>
          <p>Delete {{ dialogGame }}: {{ dialogName }} - {{ dialogRarity }}?</p>
        </q-card-section>
        <q-card-action>
          <q-btn flat label="Cancel" v-close-popup color="negative" class="q-px-md" />
          <q-btn
            type="submit"
            flat
            color="positive"
            label="Confirm"
            class="q-px-md"
            :loading="dialogLoading"
            @click="deleteCard()"
          />
        </q-card-action>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { uploadToCloud } from 'src/components/cloudinaryUtility'
import { Notify } from 'quasar'

const route = useRoute()

const game = route.params.game

const addDialog = ref(false)
const editDialog = ref(false)
const deleteDialog = ref(false)

//loadings
const dialogLoading = ref(false)
const tableLoading = ref(false)

// Dialog input data
const dialogName = ref('')
const dialogCode = ref('')
const dialogSeries = ref('')
const dialogRarity = ref('')
const dialogExpansion = ref('')
const dialogPrice = ref(0)
const dialogQuantity = ref(0)
const dialogIsPreorder = ref(false)
const dialogUrl = ref('')
const dialogImageFile = ref(null)
const dialogGame = ref('')
const dialogId = ref('')

const cards = ref([]) // This will store the cards data

//options
const expansions = ref([])
const preorders = ref([
  { label: 'True', value: true },
  { label: 'False', value: false },
])
const rarities = ref([])
const games = ref([])

const pagination = ref({ rowsPerPage: 10 })
const searchQuery = ref('')

// Define the table columns
const columns = [
  { name: 'file', label: 'Image', align: 'center', field: 'file' },
  { name: 'game', label: 'Game', align: 'center', field: 'game' },
  { name: 'name', label: 'Name', align: 'left', field: 'name', sortable: true },
  { name: 'code', label: 'Code', align: 'left', field: 'code', sortable: true },
  { name: 'series', label: 'Series', align: 'left', field: 'series' },
  { name: 'expansion', label: 'Expansion', align: 'left', field: 'expansion' },
  { name: 'Is Pre-Order', label: 'Is Pre-Order', align: 'left', field: 'isPreorder' },
  { name: 'rarity', label: 'Rarity', align: 'left', field: 'rarity' },
  { name: 'price', label: 'Price', align: 'right', field: 'price' },
  { name: 'quantity', label: 'Quantity', align: 'right', field: 'quantity' },
  { name: 'actions', label: 'Actions', align: 'center', field: 'actions' },
]

// Filtered cards based on the search query
const filteredCards = computed(() => {
  if (!searchQuery.value) {
    return cards.value
  }
  return cards.value.filter((card) => {
    return (
      card.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      card.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      card.series.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      card.rarity.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

// Submit form handler
async function saveCard() {
  dialogLoading.value = true
  try {
    const imageUrl = await uploadToCloud(dialogImageFile.value)

    // Send data to the backend API
    const response = await axios.post(`${process.env.api_host}/cards/create`, {
      name: dialogName.value,
      code: dialogCode.value,
      series: dialogSeries.value,
      rarity: dialogRarity.value,
      expansion: dialogExpansion.value,
      price: dialogPrice.value,
      quantity: dialogQuantity.value,
      isPreorder: dialogIsPreorder.value,
      url: dialogUrl.value,
      file: imageUrl,
      game: dialogGame.value,
    })

    // Reset form after successful submission
    resetDialogs()

    getCards()
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    dialogLoading.value = false
  }
}

async function resetDialogs() {
  try {
    dialogName.value = ''
    dialogCode.value = ''
    dialogSeries.value = ''
    dialogRarity.value = ''
    dialogExpansion.value = ''
    dialogPrice.value = ''
    dialogQuantity.value = ''
    dialogIsPreorder.value = false
    dialogUrl.value = ''
    dialogImageFile.value = null
    dialogGame.value = ''
    addDialog.value = false
  } catch (err) {
    console.console.error('Error resetting dialogs:', err)
  }
}

async function clearDialogs() {
  try {
    dialogName.value = ''
    dialogCode.value = ''
    dialogSeries.value = ''
    dialogRarity.value = ''
    dialogExpansion.value = ''
    dialogPrice.value = ''
    dialogQuantity.value = ''
    dialogIsPreorder.value = false
    dialogUrl.value = ''
    dialogImageFile.value = null
    dialogGame.value = ''
  } catch (err) {
    console.console.error('Error resetting dialogs:', err)
  }
}

async function getCards() {
  tableLoading.value = true

  try {
    const response = await axios.get(`${process.env.api_host}/cards?isArchived=false`)
    const fetchedCards = response.data

    for (const card of fetchedCards) {
      // Only attempt to scrape if it's a preorder and has a URL
      if (card.isPreorder && card.url) {
        try {
          const scrapedData = await scrape(card.url)

          if (scrapedData) {
            // Only update price if it's valid and current price is 0
            if (!isNaN(scrapedData.price) && card.price === 0) {
              card.price = scrapedData.price
            }

            // Optionally update stock if you want to use/display it
            card.quantity = !isNaN(scrapedData.stock) ? scrapedData.stock : 0
          }
        } catch (err) {
          console.error(`Failed to scrape price for ${card.name}:`, err)
        }
      }
    }

    cards.value = fetchedCards
  } catch (error) {
    console.error('Error fetching cards:', error)
  } finally {
    tableLoading.value = false
  }
}

async function scrape(url) {
  try {
    const response = await axios.post(`${process.env.api_host}/cards/scrapePrice`, {
      url: url,
    })

    return response.data // Should contain { price, stock }
  } catch (err) {
    console.error('Scrape error:', err)
    return null
  }
}

async function getExpansions() {
  try {
    const response = await axios.get(`${process.env.api_host}/config/expansion/get`)

    expansions.value = response.data.map((expansion) => expansion.name)
  } catch (error) {
    console.error('Error fetching expansions:', error)
  }
}

async function getRarities() {
  try {
    const response = await axios.get(`${process.env.api_host}/config/rarity/get`)

    rarities.value = response.data.map((rarity) => rarity.code)
  } catch (error) {
    console.error('Error fetching expansion:', error)
  }
}

async function getGames() {
  try {
    const response = await axios.get(`${process.env.api_host}/config/game/get`)

    games.value = response.data.map((game) => game.name)
  } catch (error) {
    console.error('Error fetching expansion:', error)
  }
}

async function openEditDialog(card) {
  editDialog.value = true
  try {
    const response = await axios.get(`${process.env.api_host}/cards?query=${card._id}`)
    dialogName.value = response.data[0].name
    dialogCode.value = response.data[0].code
    dialogSeries.value = response.data[0].series
    dialogRarity.value = response.data[0].rarity
    dialogExpansion.value = response.data[0].expansion
    dialogPrice.value = response.data[0].price
    dialogGame.value = response.data[0].game
    dialogIsPreorder.value = response.data[0].isPreorder
    dialogUrl.value = response.data[0].url
    dialogQuantity.value = response.data[0].quantity
    dialogId.value = card._id
  } catch (error) {
    console.error('Error editing card:', error)
  }
}

async function saveEditCard() {
  dialogLoading.value = true
  try {
    const response = await axios.post(`${process.env.api_host}/cards/update/${dialogId.value}`, {
      name: dialogName.value,
      code: dialogCode.value,
      series: dialogSeries.value,
      rarity: dialogRarity.value,
      expansion: dialogExpansion.value,
      price: dialogPrice.value,
      game: dialogGame.value,
      quantity: dialogQuantity.value,
      isPreorder: dialogIsPreorder.value,
      url: dialogUrl.value,
    })
    Notify.create({
      type: 'positive',
      message: 'Card Updated',
      position: 'bottom',
      timeout: 2000,
    })
    editDialog.value = false

    // Reset form after successful submission
    clearDialogs()

    getCards()
  } catch (error) {
    console.error('Error saving edited card:', error)
  } finally {
    dialogLoading.value = false
  }
}

function openDeleteCard(card) {
  deleteDialog.value = true
  dialogName.value = card.name
  dialogRarity.value = card.rarity
  dialogGame.value = card.game
  dialogId.value = card._id
}

async function deleteCard() {
  dialogLoading.value = true
  try {
    const response = await axios.post(`${process.env.api_host}/cards/update/${dialogId.value}`, {
      isArchived: true,
    })
    Notify.create({
      type: 'positive',
      message: 'Card Deleted',
      position: 'bottom',
      timeout: 2000,
    })
    deleteDialog.value = false
    getCards()
  } catch (error) {
    console.error('Error deleting card:', error)
  } finally {
    dialogLoading.value = false
  }
}

onMounted(() => {
  getCards()
  getRarities()
  getGames()
  getExpansions()
})
</script>

<style lang="sass" scoped>
.q-dialog__content
  padding: 20px;
  max-width: 500px;


.q-card
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);


.q-card-section
  padding: 16px;


.q-form
  padding: 16px;




.q-btn
  margin-right: 8px;


.q-btn.flat
  padding: 10px 16px;


.q-btn:hover
  background-color: #f4f4f4;

.q-card-action
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;


.q-card-action .q-btn
  min-width: 100px;


.q-file__input
  margin-top: 10px;



.table_card_img
  max-width: 80%

.delete_card_dialog
  width: 20%


@media (max-width: 768px),( max-height: 768px)
  .table_card_img
    width: 100px
  .delete_card_dialog
    width: 100%
</style>
