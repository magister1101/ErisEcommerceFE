<template>
  <q-page padding>
    <!-- Filters -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-6">
        <q-input
          filled
          v-model="filter"
          label="Search Orders"
          debounce="300"
          clearable
          placeholder="Search by name or order ID"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-4">
        <q-select
          filled
          v-model="statusFilter"
          :options="['All', ...statusOptions]"
          label="Filter by Status"
          emit-value
          map-options
          dense
          clearable
        />
      </div>
    </div>

    <!-- Orders Table -->
    <q-table
      :rows="filteredOrders"
      :columns="columns"
      row-key="_id"
      :loading="tableLoading"
      flat
      bordered
      v-model:pagination="pagination"
      :rows-per-page-options="[10, 20, 30, 40, 50]"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>
            <q-expansion-item expand-separator>
              <template #header>
                <q-item-section>
                  <q-item-label>
                    <q-badge class="q-mt-xs q-pa-sm text-black text-weight-bold" color="info">
                      Customer
                    </q-badge>
                    {{ props.row.buyer.firstName.toUpperCase() }}
                    {{ props.row.buyer.lastName.toUpperCase() }}
                  </q-item-label>
                  <q-item-label>
                    <q-badge class="q-mt-xs q-pa-sm text-black text-weight-bold" color="info">
                      Order #
                    </q-badge>
                    {{ props.row._id }}
                  </q-item-label>
                  <q-item-label>
                    <q-badge class="q-mt-xs q-pa-sm text-black text-weight-bold" color="info">
                      Ordered At:
                    </q-badge>
                    {{ formatDate(props.row.createdAt) }}
                  </q-item-label>
                  <q-item-label caption>
                    <q-badge
                      :color="getStatusColor(props.row.status)"
                      class="q-mt-xs q-pa-sm text-weight-bold"
                      align="top"
                    >
                      {{ props.row.status }}
                    </q-badge>
                  </q-item-label>
                </q-item-section>
              </template>

              <q-card class="q-pa-md bg-grey-1">
                <div class="row q-col-gutter-md items-start">
                  <div class="col-12 col-md-6">
                    <div class="text-h6 q-mb-sm">Buyer Info</div>
                    <div>
                      <strong>Name:</strong> {{ props.row.buyer.firstName }}
                      {{ props.row.buyer.lastName }}
                    </div>
                    <div><strong>Email:</strong> {{ props.row.buyer.email }}</div>
                    <div>
                      <strong>Mode of Delivery:</strong>
                      {{ props.row.isPickup ? 'Pickup' : 'Delivery' }}
                    </div>
                    <div>
                      <strong>
                        {{ props.row.isPickup ? 'Pickup Location:' : 'Delivery Address:' }}</strong
                      >
                      {{ props.row.shippingAddress }}
                    </div>

                    <div v-if="props.row.proofOfPayment" class="q-mt-sm">
                      <strong>Proof of Payment:</strong><br />
                      <div
                        class="q-mt-sm q-pa-sm rounded-borders"
                        @click="showPreview(props.row.proofOfPayment)"
                        style="
                          width: 100%;
                          max-width: 200px;
                          background-color: #f5f5f5;
                          border: 1px solid #ccc;
                          cursor: pointer;
                        "
                      >
                        <img
                          :src="props.row.proofOfPayment"
                          style="width: 100%; height: auto; display: block; object-fit: contain"
                          alt="Proof of Payment"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="col-12 col-md-6">
                    <div class="text-h6 q-mb-sm">Order Info</div>
                    <div><strong>Total:</strong> ₱{{ props.row.totalPrice }}</div>
                    <div><strong>Status:</strong> {{ props.row.status }}</div>
                    <div><strong>Payment Method:</strong> {{ props.row.paymentMethod }}</div>
                    <div><strong>Pickup:</strong> {{ props.row.isPickup ? 'Yes' : 'No' }}</div>
                    <div v-if="!props.row.isPickup">
                      <strong>Shipping Address:</strong> {{ props.row.shippingAddress || 'N/A' }}
                    </div>
                    <div v-if="!props.row.isPickup">
                      <strong>Shipping Price:</strong> ₱{{ props.row.shippingPrice || 0 }}
                    </div>
                    <div><strong>Ordered At:</strong> {{ formatDate(props.row.createdAt) }}</div>

                    <div v-if="props.row.fileUpdate" class="q-mt-sm">
                      <strong>Update:</strong><br />
                      <div
                        class="q-mt-sm q-pa-sm rounded-borders"
                        @click="showPreview(props.row.fileUpdate)"
                        style="
                          width: 100%;
                          max-width: 200px;
                          background-color: #f5f5f5;
                          border: 1px solid #ccc;
                          cursor: pointer;
                        "
                      >
                        <img
                          :src="props.row.fileUpdate"
                          style="width: 100%; height: auto; display: block; object-fit: contain"
                          alt="Proof of Payment"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="q-mt-md">
                  <div class="text-h6 q-mb-sm">Products</div>
                  <div class="row q-col-gutter-md items-start justify-start q-gutter-md">
                    <div v-for="item in props.row.products" :key="item._id" class="product-card">
                      <q-img
                        :src="item.product.file"
                        class="rounded-borders bg-grey-3"
                        style="object-fit: contain"
                      />
                      <div class="product-info q-mt-xs">
                        <strong>{{ item.product.name }}</strong
                        ><br />
                        Code: {{ item.product.code }}<br />
                        series: {{ item.product.series }} <br />
                        rarity: {{ item.product.rarity }} <br />
                        Qty: {{ item.quantity }} x ₱{{ item.product.price }} <br />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="q-mt-sm text-right">
                  <q-btn-dropdown
                    color="warning"
                    label="Update Order"
                    icon="settings"
                    class="q-mb-sm"
                    flat
                    dense
                  >
                    <q-list>
                      <q-item
                        clickable
                        v-close-popup
                        @click="openUpdateStatusDialog(props.row)"
                        class="q-px-sm"
                      >
                        <q-item-section avatar>
                          <q-icon name="edit" color="info" />
                        </q-item-section>
                        <q-item-section class="text-info"> Status </q-item-section>
                      </q-item>

                      <q-item
                        clickable
                        v-close-popup
                        @click="openUpdateUploadDialog(props.row)"
                        class="q-px-sm"
                      >
                        <q-item-section avatar>
                          <q-icon name="edit" color="info" />
                        </q-item-section>
                        <q-item-section class="text-info"> Upload </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </div>
              </q-card>
            </q-expansion-item>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Preview Image Dialog -->
    <q-dialog v-model="previewDialog" persistent>
      <q-card flat bordered style="width: 100%; max-width: 500px; max-height: 80vh; overflow: auto">
        <q-card-section class="row justify-end">
          <q-btn icon="close" flat dense round @click="previewDialog = false" />
        </q-card-section>

        <q-img
          :src="previewImage"
          style="width: 100%; height: auto; object-fit: contain; background-color: #f5f5f5"
        />
      </q-card>
    </q-dialog>

    <!-- Update Order Dialog -->
    <q-dialog v-model="updateOrderDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Update Order</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-select
            v-model="selectedStatus"
            :options="statusOptions"
            label="Order Status"
            dense
            outlined
          />
          <q-select
            v-model="selectedPayment"
            :options="paymentOptions"
            label="Payment Method"
            dense
            outlined
            class="q-mt-md"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn
            :loading="updateOrderLoading"
            label="Save"
            color="primary"
            @click="submitOrderUpdate"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Update upload Dialog -->
    <q-dialog v-model="updateOrderUploadDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Upload Update</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
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
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn :loading="dialogUploadLoading" label="Save" color="primary" @click="saveUpdate" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { date, Notify } from 'quasar'
import { useRouter } from 'vue-router'
import { uploadToCloud } from 'src/components/cloudinaryUtility'

const router = useRouter()

const orders = ref([])

const orderId = ref('')
const updateOrderDialog = ref(false)
const updateOrderUploadDialog = ref(false)
const updateOrderLoading = ref(false)
const dialogUploadLoading = ref(false)

const selectedStatus = ref('')
const selectedPayment = ref('')
const dialogImageFile = ref('')

const previewDialog = ref(false)
const previewImage = ref('')

const filter = ref('')
const statusFilter = ref('All')

const statusOptions = ['pending', 'paid', 'shipped', 'cancelled', 'completed']
const paymentOptions = ['Cash on Delivery', 'GCash', 'Credit Card']

const tableLoading = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
})

const columns = [
  {
    name: 'orders',
    label: 'Orders',
    align: 'left',
    field: (row) => row.buyer.firstName + ' ' + row.buyer.lastName,
  },
]

function showPreview(img) {
  previewImage.value = img
  previewDialog.value = true
}

function getStatusColor(status) {
  switch (status) {
    case 'pending':
      return 'orange'
    case 'paid':
      return 'yellow'
    case 'shipped':
      return 'primary'
    case 'cancelled':
      return 'red'
    case 'completed':
      return 'green'
    default:
      return 'grey'
  }
}

async function getOrders() {
  tableLoading.value = true
  try {
    const res = await axios.get(`${process.env.api_host}/orders`)
    orders.value = res.data
  } catch (err) {
    console.error('Failed to load orders:', err)
  } finally {
    tableLoading.value = false
  }
}

async function saveUpdate() {
  try {
    dialogUploadLoading.value = true
    const imageUrl = await uploadToCloud(dialogImageFile.value)

    const token = localStorage.getItem('authToken')

    await axios.post(
      `${process.env.api_host}/orders/updateOrder/${orderId.value}`,
      {
        fileUpdate: imageUrl,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    )

    Notify.create({
      message: 'Uploaded successfully',
      color: 'positive',
      textColor: 'white',
    })

    await getOrders()
    orders.value = [...orders.value]

    router.go()
  } catch (error) {
    console.error(error)
  } finally {
    dialogUploadLoading.value = true
    updateOrderUploadDialog.value = false
  }
}

const filteredOrders = computed(() => {
  const search = filter.value.toLowerCase().trim()
  const status = statusFilter.value

  return orders.value.filter((order) => {
    const fullName = `${order.buyer.firstName} ${order.buyer.lastName}`.toLowerCase()
    const matchSearch =
      !search || fullName.includes(search) || order._id.toLowerCase().includes(search)

    const matchStatus = status === 'All' || order.status === status

    return matchSearch && matchStatus
  })
})

function formatDate(datetime) {
  return date.formatDate(datetime, 'MMMM DD, YYYY HH:mm')
}

function openUpdateStatusDialog(order) {
  orderId.value = order._id
  selectedStatus.value = order.status
  selectedPayment.value = order.paymentMethod
  updateOrderDialog.value = true
}

function openUpdateUploadDialog(order) {
  orderId.value = order._id
  updateOrderUploadDialog.value = true
}

async function submitOrderUpdate() {
  try {
    updateOrderLoading.value = true
    const token = localStorage.getItem('authToken')

    await axios.post(
      `${process.env.api_host}/orders/updateOrder/${orderId.value}`,
      {
        status: selectedStatus.value,
        paymentMethod: selectedPayment.value,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    )

    Notify.create({
      message: 'Order updated successfully',
      color: 'positive',
      textColor: 'white',
    })

    await getOrders()
    orders.value = [...orders.value]

    updateOrderDialog.value = false
  } catch (error) {
    console.error('Failed to update order:', error)
  } finally {
    updateOrderLoading.value = false
    router.go()
  }
}

onMounted(() => {
  getOrders()
})
</script>

<style scoped lang="sass">
.product-card
  width: 120px
  display: flex
  flex-direction: column
  align-items: center
  text-align: center

  .product-card
  width: 150px
  display: flex
  flex-direction: column
  align-items: center
  text-align: left
  overflow: hidden

  &:hover
    overflow: visible

.product-info
  font-size: 12px
  white-space: normal
  text-overflow: initial
  overflow: visible
  width: 100%
</style>
