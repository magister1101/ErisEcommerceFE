<template>
  <q-page padding>
    <div>
      <div class="row q-col-gutter-md">
        <!-- First Table -->
        <div class="col-12 col-md-6">
          <q-table
            :rows="filteredRarity"
            :columns="columnsRarity"
            row-key="_id"
            :pagination="paginationRarity"
            class="q-pa-none q-mb-sm rarityTable"
          >
            <template v-slot:top-left>
              <q-btn
                color="primary"
                icon="add"
                label="Add Rarity"
                @click="addRarityDialog = !addRarityDialog"
              />
            </template>

            <!-- Custom cell for "Name" -->
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <q-item>
                  <q-item-section>{{ props.row.name }}</q-item-section>
                </q-item>
              </q-td>
            </template>

            <!-- Custom cell for "Actions" -->
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  color="negative"
                  label="Delete"
                  @click="openDeleteCardRarity(props.row)"
                  class="q-ma-sm"
                  style="width: 100px"
                />
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- Second Table -->
        <div class="col-12 col-md-6">
          <q-table
            :rows="filteredGame"
            :columns="columnsGame"
            row-key="_id"
            :pagination="paginationGame"
            class="q-pa-none q-mb-sm rarityTable"
          >
            <template v-slot:top-left>
              <q-btn
                color="primary"
                icon="add"
                label="Add Game"
                @click="addGameDialog = !addGameDialog"
              />
            </template>

            <!-- Custom cell for "Name" -->
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <q-item>
                  <q-item-section>{{ props.row.name }}</q-item-section>
                </q-item>
              </q-td>
            </template>

            <!-- Custom cell for "Actions" -->
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  color="negative"
                  label="DELETE"
                  @click="openDeleteCardGame(props.row)"
                  class="q-ma-sm"
                  style="width: 100px"
                />
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>

    <!-- EXPANSION TABLE -->
    <q-table
      :rows="filteredExpansions"
      :columns="columnsExpansion"
      row-key="_id"
      :pagination="paginationExpansion"
      class="q-pa-none q-mb-sm expansionTable"
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
            @click="openEditDialogExpansion(props.row)"
            class="q-ma-sm"
            style="width: 100px"
          />
          <q-space />
          <q-btn
            color="negative"
            label="Delete"
            @click="openDeleteCardExpansion(props.row)"
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
            <p class="text-h5">Create a new expansion</p>
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

    <!-- edit expansion dialog -->
    <q-dialog v-model="editExpansionDialog" persistent>
      <q-card bordered style="border-radius: 10px; width: 100%">
        <q-form @submit.prevent="editExpansion" class="q-mx-xl">
          <q-card-section>
            <p class="text-h5">Create a new expansion</p>
          </q-card-section>

          <div>
            <q-input v-model="dialogName" label="Name" filled required />
            <q-input v-model="dialogCode" label="Code" filled required />
          </div>
          <q-card-action>
            <q-btn flat label="Cancel" v-close-popup color="negative" class="q-px-md" />
            <q-btn
              type="submit"
              flat
              color="positive"
              label="Save"
              class="q-px-md"
              :loading="editExpansionDialogLoading"
            />
          </q-card-action>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- delete expansion dialog -->
    <q-dialog v-model="deleteExpansionDialog" persistent>
      <q-card bordered class="delete_card_dialog" style="border-radius: 10px">
        <q-card-section>
          <p>Delete {{ dialogName }} - {{ dialogCode }}?</p>
        </q-card-section>
        <q-card-action>
          <q-btn flat label="Cancel" v-close-popup color="negative" class="q-px-md" />
          <q-btn
            type="submit"
            flat
            color="positive"
            label="Confirm"
            class="q-px-md"
            :loading="deleteLoading"
            @click="deleteExpansion()"
          />
        </q-card-action>
      </q-card>
    </q-dialog>

    <!-- delete game dialog -->
    <q-dialog v-model="deleteGameDialog" persistent>
      <q-card bordered class="delete_card_dialog" style="border-radius: 10px">
        <q-card-section>
          <p>Delete {{ dialogName }} - {{ dialogCode }}?</p>
        </q-card-section>
        <q-card-action>
          <q-btn flat label="Cancel" v-close-popup color="negative" class="q-px-md" />
          <q-btn
            type="submit"
            flat
            color="positive"
            label="Confirm"
            class="q-px-md"
            :loading="deleteLoading"
            @click="deleteGame()"
          />
        </q-card-action>
      </q-card>
    </q-dialog>

    <!-- add rarity dialog -->
    <q-dialog v-model="addRarityDialog" persistent>
      <q-card bordered style="border-radius: 10px; width: 100%">
        <q-form @submit.prevent="saveRarity" class="q-mx-xl">
          <q-card-section>
            <p class="text-h5">Create a new Rarity</p>
          </q-card-section>

          <div>
            <q-input v-model="dialogName" label="Name" filled required />
            <q-input v-model="dialogCode" label="Code" filled required mask="AAAAA" />
          </div>
          <q-card-action>
            <q-btn flat label="Cancel" v-close-popup color="negative" class="q-px-md" />
            <q-btn
              type="submit"
              flat
              color="positive"
              label="Save"
              class="q-px-md"
              :loading="addRarityDialogLoading"
            />
          </q-card-action>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- add Game Dialog -->
    <q-dialog v-model="addGameDialog" persistent>
      <q-card bordered style="border-radius: 10px; width: 100%">
        <q-form @submit.prevent="saveGame" class="q-mx-xl">
          <q-card-section>
            <p class="text-h5">Create a new Game</p>
          </q-card-section>

          <div>
            <q-input v-model="dialogName" label="Name" filled required />
            <q-input v-model="dialogCode" label="Code" filled required mask="AAAAA" />
          </div>
          <q-card-action>
            <q-btn flat label="Cancel" v-close-popup color="negative" class="q-px-md" />
            <q-btn
              type="submit"
              flat
              color="positive"
              label="Save"
              class="q-px-md"
              :loading="addGameDialogLoading"
            />
          </q-card-action>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- delete rarity dialog -->
    <q-dialog v-model="deleteRarityDialog" persistent>
      <q-card bordered class="delete_card_dialog" style="border-radius: 10px">
        <q-card-section>
          <p>Delete {{ dialogName }} - {{ dialogCode }}?</p>
        </q-card-section>
        <q-card-action>
          <q-btn flat label="Cancel" v-close-popup color="negative" class="q-px-md" />
          <q-btn
            type="submit"
            flat
            color="positive"
            label="Confirm"
            class="q-px-md"
            :loading="deleteLoading"
            @click="deleteRarity()"
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

const route = useRoute()

// Refs
const dialogId = ref('')
const dialogName = ref('')
const dialogCode = ref('')
const dialogImageFile = ref(null)

const expansions = ref([])
const paginationExpansion = ref({ rowsPerPage: 5 })
const paginationRarity = ref({ rowsPerPage: 5 })
const paginationGame = ref({ rowsPerPage: 5 })
const searchQuery = ref('')

const rarities = ref([])
const games = ref([])

// Dialog states
const addExpansionDialog = ref(false)
const editExpansionDialog = ref(false)
const deleteExpansionDialog = ref(false)
const deleteGameDialog = ref(false)
const addRarityDialog = ref(false)
const addGameDialog = ref(false)
const deleteRarityDialog = ref(false)

// Loading states
const addLoading = ref(false)
const editLoading = ref(false)
const deleteLoading = ref(false)
const addRarityDialogLoading = ref(false)
const addGameDialogLoading = ref(false)

// Columns
const columnsExpansion = [
  { name: 'file', label: 'Image', align: 'center', field: 'file' },
  { name: 'name', label: 'Name', align: 'left', field: 'name', sortable: true },
  { name: 'code', label: 'Code', align: 'left', field: 'code', sortable: true },
  { name: 'actions', label: 'Actions', align: 'center', field: 'actions' },
]

const columnsRarity = [
  { name: 'name', label: 'Name', align: 'left', field: 'name', sortable: true },
  { name: 'code', label: 'Code', align: 'left', field: 'code', sortable: true },
  { name: 'actions', label: 'Actions', align: 'center', field: 'actions' },
]

const columnsGame = [
  { name: 'name', label: 'Name', align: 'left', field: 'name', sortable: true },
  { name: 'code', label: 'Code', align: 'left', field: 'code', sortable: true },
  { name: 'actions', label: 'Actions', align: 'center', field: 'actions' },
]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function resetDialogFields() {
  dialogId.value = ''
  dialogName.value = ''
  dialogCode.value = ''
  dialogImageFile.value = null
}

function closeDialogs() {
  addExpansionDialog.value = false
  editExpansionDialog.value = false
  deleteExpansionDialog.value = false
  deleteGameDialog.value = false
  addRarityDialog.value = false
  deleteRarityDialog.value = false
  addGameDialog.value = false
  resetDialogFields()
}

// EXPANSIONS - start

const filteredExpansions = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return !query
    ? expansions.value
    : expansions.value.filter(({ name, code, series = '', rarity = '' }) =>
        [name, code, series, rarity].some((field) => field.toLowerCase().includes(query)),
      )
})

const filteredRarity = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return !query
    ? rarities.value
    : rarities.value.filter(({ name, code, series = '', rarity = '' }) =>
        [name, code].some((field) => field.toLowerCase().includes(query)),
      )
})

const filteredGame = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return !query
    ? games.value
    : games.value.filter(({ name, code, series = '', rarity = '' }) =>
        [name, code].some((field) => field.toLowerCase().includes(query)),
      )
})

async function getExpansion() {
  try {
    const { data } = await axios.get(
      `${process.env.api_host}/config/expansion/get?isArchived=false`,
    )
    expansions.value = data
  } catch (error) {
    console.error('Error fetching expansions:', error)
  }
}

async function saveExpansion() {
  addLoading.value = true
  try {
    const imageUrl = await uploadToCloud(dialogImageFile.value)
    await axios.post(`${process.env.api_host}/config/expansion/create`, {
      name: dialogName.value,
      code: dialogCode.value,
      file: imageUrl,
    })
  } catch (error) {
    console.error('Save Error:', error)
  } finally {
    closeDialogs()
    await sleep(300)
    getExpansion()
    addLoading.value = false
  }
}

async function openEditDialogExpansion(card) {
  editExpansionDialog.value = true
  try {
    const { data } = await axios.get(
      `${process.env.api_host}/config/expansion/get?query=${card._id}`,
    )
    const exp = data[0]
    dialogId.value = exp._id
    dialogName.value = exp.name
    dialogCode.value = exp.code
  } catch (err) {
    console.error('Edit Fetch Error:', err)
  }
}

async function editExpansion() {
  editLoading.value = true
  try {
    await axios.post(`${process.env.api_host}/config/expansion/update/${dialogId.value}`, {
      name: dialogName.value,
      code: dialogCode.value,
    })
  } catch (err) {
    console.error('Edit Save Error:', err)
  } finally {
    closeDialogs()
    await sleep(300)
    getExpansion()
    editLoading.value = false
  }
}

function openDeleteCardExpansion(card) {
  dialogId.value = card._id
  dialogName.value = card.name
  dialogCode.value = card.code
  deleteExpansionDialog.value = true
}

function openDeleteCardGame(card) {
  dialogId.value = card._id
  dialogName.value = card.name
  dialogCode.value = card.code
  deleteGameDialog.value = true
}

async function deleteExpansion() {
  deleteLoading.value = true
  try {
    await axios.post(`${process.env.api_host}/config/expansion/update/${dialogId.value}`, {
      isArchived: true,
    })
  } catch (err) {
    console.error('Delete Error:', err)
  } finally {
    closeDialogs()
    await sleep(300)
    getExpansion()
    deleteLoading.value = false
  }
}

async function deleteGame() {
  deleteLoading.value = true
  try {
    await axios.post(`${process.env.api_host}/config/game/update/${dialogId.value}`, {
      isArchived: true,
    })
  } catch (err) {
    console.error('Delete Error:', err)
  } finally {
    closeDialogs()
    await sleep(300)
    getGame()
    deleteLoading.value = false
  }
}

// EXPANSIONS - end
// RARITY - start

async function getRarity() {
  try {
    const { data } = await axios.get(`${process.env.api_host}/config/rarity/get?isArchived=false`)
    rarities.value = data
  } catch (error) {
    console.error('Error fetching rarity:', error)
  }
}

async function getGame() {
  try {
    const { data } = await axios.get(`${process.env.api_host}/config/game/get?isArchived=false`)
    games.value = data
  } catch (error) {
    console.error('Error fetching rarity:', error)
  }
}

async function saveRarity() {
  addLoading.value = true
  try {
    const ucName = dialogName.value.toUpperCase()
    const ucCode = dialogCode.value.toUpperCase()
    await axios.post(`${process.env.api_host}/config/rarity/create`, {
      name: ucName,
      code: ucCode,
    })
  } catch (error) {
    console.error('Save Error:', error)
  } finally {
    closeDialogs()
    await sleep(300)
    getRarity()
    addLoading.value = false
  }
}

async function saveGame() {
  addGameDialogLoading.value = true
  try {
    const ucName = dialogName.value.toUpperCase()
    const ucCode = dialogCode.value.toUpperCase()
    await axios.post(`${process.env.api_host}/config/game/create`, {
      name: ucName,
      code: ucCode,
    })
  } catch (error) {
    console.error('Save Error:', error)
  } finally {
    closeDialogs()
    await sleep(300)
    getGame()
    addGameDialogLoading.value = false
  }
}

function openDeleteCardRarity(card) {
  dialogId.value = card._id
  console.log(dialogId.value)
  dialogName.value = card.name
  dialogCode.value = card.code
  deleteRarityDialog.value = true
}

async function deleteRarity() {
  deleteLoading.value = true
  try {
    await axios.post(`${process.env.api_host}/config/rarity/update/${dialogId.value}`, {
      isArchived: true,
    })
  } catch (err) {
    console.error('Delete Error:', err)
  } finally {
    closeDialogs()
    await sleep(300)
    getRarity()
    deleteLoading.value = false
  }
}

// RARITY - end

onMounted(() => {
  getExpansion()
  getRarity()
  getGame()
})
</script>

<style lang="sass" scoped>

.table_card_img
  max-width: 50%



@media (max-width: 768px),( max-height: 768px)
  .table_card_img
    width: 100px
</style>
