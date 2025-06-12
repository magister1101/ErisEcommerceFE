<template>
  <q-page padding>
    <q-table
      :rows="orders"
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
                    <q-badge class="q-mt-xs q-pa-sm" color="primary">Order #</q-badge>
                    {{ props.row.buyer.firstName.toUpperCase() }}
                    {{ props.row.buyer.lastName.toUpperCase() }}
                  </q-item-label>
                  <q-item-label>
                    <q-badge class="q-mt-xs q-pa-sm" color="accent">Order #</q-badge>
                    {{ props.row._id }}</q-item-label
                  >
                  <q-item-label caption>
                    <q-badge
                      :color="getStatusColor(props.row.status)"
                      class="q-mt-xs q-pa-sm"
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
                    <div v-if="props.row.proofOfPayment" class="q-mt-sm">
                      <strong>Proof of Payment:</strong><br />
                      <q-img
                        :src="props.row.proofOfPayment"
                        :width="80"
                        :height="80"
                        class="q-mt-xs rounded-borders"
                        style="object-fit: cover"
                      />
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
                        Qty: {{ item.quantity }} x ₱{{ item.product.price }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="q-mt-sm text-right">
                  <q-badge
                    color="warning"
                    label="UPDATE ORDER"
                    clicakble
                    @click="openUpdateDialog(props.row)"
                    class="q-mr-sm q-pa-md cursor-pointer text-white text-weight-bold"
                  />
                </div>
              </q-card>
            </q-expansion-item>
          </q-td>
        </q-tr>
      </template>
    </q-table>

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
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { date, Notify } from 'quasar'

const orders = ref([])

const orderId = ref('')
const updateOrderDialog = ref(false)
const updateOrderLoading = ref(false)

const selectedStatus = ref('')
const selectedPayment = ref('')

const statusOptions = ['pending', 'paid', 'shipped', 'cancelled', 'completed']
const paymentOptions = ['Cash on Delivery', 'GCash', 'Credit Card']

const tableLoading = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
})

function getStatusColor(status) {
  switch (status) {
    case 'pending':
      return 'orange'
    case 'paid':
      return 'info'
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
  try {
    tableLoading.value = true
    const res = await axios.get(`${process.env.api_host}/orders`)
    orders.value = res.data
  } catch (err) {
    console.error('Failed to load orders:', err)
  } finally {
    tableLoading.value = false
  }
}

const columns = [
  {
    name: 'orders',
    label: 'Orders',
    align: 'left',
    field: (row) => row.buyer.firstName + ' ' + row.buyer.lastName,
  },
]

function formatDate(datetime) {
  return date.formatDate(datetime, 'YYYY-MM-DD HH:mm')
}

function openUpdateDialog(order) {
  orderId.value = order._id
  selectedStatus.value = order.status
  selectedPayment.value = order.paymentMethod

  updateOrderDialog.value = true
}

async function submitOrderUpdate() {
  try {
    updateOrderLoading.value = true
    const token = localStorage.getItem('authToken')
    const response = await axios.post(
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
  } catch (error) {
    console.error('Failed to update order:', error)
  } finally {
    updateOrderDialog.value = false
    updateOrderLoading.value = false
    getOrders()
  }
}

onMounted(() => {
  getOrders()
})
</script>

<style lang="sass" scoped>
.product-card
  width: 120px
  display: flex
  flex-direction: column
  align-items: center
  text-align: center

.product-info
  font-size: 12px
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  width: 100%
</style>
