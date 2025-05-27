<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Left Panel: User Profile -->
      <div class="col-12 col-md-4">
        <q-card class="q-pa-md">
          <q-avatar size="100px" class="q-mb-md">
            <q-icon name="account_circle" size="100px" />
          </q-avatar>
          <div class="text-h6">{{ user.firstName }} {{ user.lastName }}</div>
          <div class="text-subtitle2 text-grey">{{ user.email }}</div>
          <div class="q-mt-sm">
            <q-badge color="primary" label="Username" class="q-mr-sm" />
            {{ user.username }}
          </div>
        </q-card>
      </div>

      <!-- Right Panel: Order History -->
      <div class="col-12 col-md-8">
        <q-card class="q-pa-md">
          <div class="text-h6 q-mb-md">My Orders</div>
          <q-separator />
          <div v-if="orders.length === 0" class="q-mt-md text-grey">No orders found.</div>
          <q-list v-else bordered class="q-mt-md">
            <q-expansion-item
              v-for="order in orders"
              :key="order._id"
              :label="`Order ID: ${order._id}`"
              :caption="`Status: ${order.status} | Total: ₱${order.totalPrice}`"
              expand-separator
            >
              <q-item-label header class="q-mb-sm">Products</q-item-label>
              <q-item v-for="p in order.products" :key="p._id" class="q-mb-sm">
                <q-item-section avatar>
                  <q-img
                    :src="p.product.file"
                    style="width: 60px; height: 60px"
                    spinner-color="white"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ p.product.name }}</q-item-label>
                  <q-item-label caption>
                    Quantity: {{ p.quantity }} | Price: ₱{{ p.product.price }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <div class="text-right q-mt-sm text-caption">
                Payment: {{ order.paymentMethod }} | Pickup: {{ order.isPickup ? 'Yes' : 'No' }}
              </div>
            </q-expansion-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'

const user = ref({})
const orders = ref([])

async function fetchProfile() {
  try {
    const response = await axios.get(`${process.env.api_host}/users/viewer`, {
      headers: { Authorization: localStorage.getItem('authToken') },
    })
    user.value = response.data.user
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Failed to load profile',
    })
  }

  fetchOrders()
}

async function fetchOrders() {
  try {
    const token = localStorage.getItem('authToken')

    const ordersRes = await axios.get(`${process.env.api_host}/orders/myOrders`, {
      headers: { Authorization: token },
    })
    console.log(ordersRes)

    orders.value = ordersRes.data
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: 'Failed to load profile or orders',
    })
  }
}

onMounted(async () => {
  fetchProfile()
  fetchOrders()
})
</script>
