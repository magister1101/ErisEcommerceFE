<template>
  <q-page padding>
    <q-table
      :rows="filteredCards"
      :columns="columns"
      row-key="_id"
      :pagination="pagination"
      class="q-pa-none"
    >
      <template v-slot:top-left>
        <q-btn
          color="primary"
          icon="add"
          label="Add Expansion"
          @click="addExpansionDialog = !addExpansionDialog"
        />
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

    <br />

    <q-table
      :rows="filteredCards"
      :columns="columns"
      row-key="_id"
      :pagination="pagination"
      class="q-pa-none"
    >
      <template v-slot:top-left>
        <q-btn
          color="primary"
          icon="add"
          label="Add Expansion"
          @click="addExpansionDialog = !addExpansionDialog"
        />
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

    <!-- add expansion dialog -->
    <q-dialog v-model="addExpansionDialog" persistent>
      <q-card bordered style="border-radius: 10px; width: 100%">
        <q-form @submit.prevent="saveExpansion" class="q-mx-xl">
          <q-card-section>
            <p class="text-h5">Create a new expansion - {{ game }}</p>
          </q-card-section>

          <div>
            <q-input v-model="dialogName" label="Name" filled required />
            <q-input v-model="dialogCode" label="Code" filled required />
            <q-file
              class="q-px-md"
              v-model="dialogImageFile"
              accept="image/*"
              borderless
              label="Upload Profile Image"
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
              :loading="addExpansionDialogLoading"
            />
          </q-card-action>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { uploadToCloud } from 'src/components/cloudinaryUtility'

const route = useRoute()
const game = route.params.game

const dialogName = ref('')
const dialogCode = ref('')
const dialogImageFile = ref(null)

const expansion = ref([]) // Stores the cards data
const pagination = ref({ rowsPerPage: 10 })
const searchQuery = ref('')
const addExpansionDialog = ref(false) // Assuming you're toggling this for add modal

const addExpansionDialogLoading = ref(false)

// Table column definitions
const columns = [
  { name: 'file', label: 'Image', align: 'center', field: 'file' },
  { name: 'name', label: 'Name', align: 'left', field: 'name', sortable: true },
  { name: 'code', label: 'Code', align: 'left', field: 'code', sortable: true },
  { name: 'actions', label: 'Actions', align: 'center', field: 'actions' },
]

// Computed filtered rows
const filteredCards = computed(() => {
  if (!searchQuery.value) return expansion.value
  const q = searchQuery.value.toLowerCase()
  return expansion.value.filter(
    (card) =>
      card.name.toLowerCase().includes(q) ||
      card.code.toLowerCase().includes(q) ||
      (card.series && card.series.toLowerCase().includes(q)) ||
      (card.rarity && card.rarity.toLowerCase().includes(q)),
  )
})

// Fetch cards
async function getExpansion() {
  try {
    const response = await axios.get(
      `${process.env.api_host}/config/expansion/get?game=${game}&isArchived=false`,
    )
    expansion.value = response.data
  } catch (error) {
    console.error('Error fetching cards:', error)
  }
}

async function saveExpansion() {
  try {
    addExpansionDialogLoading.value = true
    const imageUrl = await uploadToCloud(dialogImageFile.value)

    const response = await axios.post(`${process.env.api_host}/config/expansion/create`, {
      name: dialogName.value,
      code: dialogCode.value,
      file: imageUrl,
      game: game,
    })

    dialogName.value = ''
    dialogCode.value = ''
    dialogImageFile.value = null
    addExpansionDialog.value = false

    getExpansion()
  } catch (error) {
    console.log(error)
  } finally {
    addExpansionDialogLoading.value = false
  }
}

function openEditDialog(card) {
  console.log('Edit', card)
  // Your logic to open the edit dialog goes here
}

function openDeleteCard(card) {
  console.log('Delete', card)
  // Your logic to confirm and delete card goes here
}

onMounted(() => {
  getExpansion()
})
</script>

<style lang="sass" scoped>

.table_card_img
  max-width: 50%

@media (max-width: 768px),( max-height: 768px)
  .table_card_img
    width: 100px
</style>
