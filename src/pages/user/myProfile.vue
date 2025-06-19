<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Profile Card -->
      <div class="col-12 col-md-4">
        <q-card class="q-pa-md text-center">
          <q-avatar size="100px" class="q-mb-sm">
            <q-icon name="account_circle" size="100px" />
          </q-avatar>
          <div class="text-h6">{{ user.firstName }} {{ user.lastName }}</div>
          <div class="text-subtitle2 text-grey">{{ user.email }}</div>

          <div class="q-mt-sm">
            <q-chip icon="person" color="primary" text-color="white">
              {{ user.username }}
            </q-chip>
          </div>

          <q-btn
            color="negative"
            label="Logout"
            icon="logout"
            class="q-mt-md"
            unelevated
            @click="logout"
          />
        </q-card>
      </div>

      <!-- Order History -->
      <div class="col-12 col-md-8">
        <q-card class="q-pa-md">
          <div class="text-h6 q-mb-md">My Orders</div>
          <q-separator />

          <div v-if="orders.length === 0" class="q-mt-md text-grey text-center">
            No orders found.
          </div>

          <q-list v-else bordered class="q-mt-md">
            <q-expansion-item v-for="order in orders" :key="order._id" expand-separator>
              <template v-slot:header>
                <q-item-section>
                  <q-item-label><strong>Order #:</strong> {{ order._id }}</q-item-label>
                  <q-item-label caption>
                    Status: {{ order.status }} | Total: ₱{{ order.totalPrice }}
                  </q-item-label>
                </q-item-section>
              </template>

              <q-card class="q-pa-sm bg-grey-1">
                <q-item-label header class="q-mb-sm">Products</q-item-label>

                <q-item
                  v-for="p in order.products"
                  :key="p._id"
                  class="q-mb-sm"
                  style="align-items: center"
                >
                  <q-item-section avatar>
                    <q-img
                      :src="p.product.file"
                      style="width: 60px; height: 60px; object-fit: contain"
                      spinner-color="white"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ p.product.name }}</q-item-label>
                    <q-item-label caption>
                      Qty: {{ p.quantity }} | ₱{{ p.product.price }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />
                <div class="text-right text-caption q-mt-sm">
                  Payment: {{ order.paymentMethod }}<br />
                  Pickup: {{ order.isPickup ? 'Yes' : 'No' }}<br />
                  <span v-if="order.shippingAddress">
                    {{ order.isPickup ? 'Pickup Address' : 'Shipping Address' }}:
                    {{ order.shippingAddress }}
                  </span>
                </div>
              </q-card>
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
import { useRouter } from 'vue-router'

const router = useRouter()

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
    noUser()
  }
  fetchOrders()
}

async function fetchOrders() {
  try {
    const token = localStorage.getItem('authToken')
    const ordersRes = await axios.get(`${process.env.api_host}/orders/myOrders`, {
      headers: { Authorization: token },
    })
    orders.value = ordersRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (err) {
    console.error(err)
  }
}

function logout() {
  try {
    Notify.create({
      message: 'Logout Success',
      type: 'positive',
      position: 'top',
      timeout: 1000,
    })
    localStorage.clear()
    router.replace('/')
  } catch (error) {
    Notify.create({
      message: 'Logout Failed',
      type: 'negative',
    })
  }
}

function noUser() {
  router.replace('/')
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.q-avatar {
  background-color: #f5f5f5;
}
</style>
