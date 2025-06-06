<template>
  <q-page padding>
    <q-table
      :rows="orders"
      :columns="columns"
      row-key="_id"
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
                    {{ props.row.buyer.firstName.toUpperCase() }}
                    {{ props.row.buyer.lastName.toUpperCase() }}
                  </q-item-label>
                  <q-item-label caption>
                    <q-badge :color="getStatusColor(props.row.status)" class="q-mt-xs" align="top">
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
              </q-card>
            </q-expansion-item>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { date } from 'quasar'

const orders = ref([])

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
})

function getStatusColor(status) {
  switch (status) {
    case 'pending':
      return 'orange'
    case 'paid':
      return 'green'
    case 'shipped':
      return 'primary'
    case 'cancelled':
      return 'red'
    default:
      return 'grey'
  }
}

async function getOrders() {
  try {
    const res = await axios.get(`${process.env.api_host}/orders`)
    orders.value = res.data
  } catch (err) {
    console.error('Failed to load orders:', err)
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
