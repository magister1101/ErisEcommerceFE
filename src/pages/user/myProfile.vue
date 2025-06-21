<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
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

          <q-separator class="q-my-md" />

          <q-btn-dropdown color="primary" label="Account Settings" icon="settings" class="q-mb-sm">
            <q-list>
              <q-item clickable v-close-popup @click="updateDialog = true">
                <q-item-section avatar><q-icon name="edit" /></q-item-section>
                <q-item-section>Update Profile</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="passwordDialog = true">
                <q-item-section avatar><q-icon name="lock" /></q-item-section>
                <q-item-section>Change Password</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-dialog v-model="passwordDialog" persistent>
            <q-card style="min-width: 350px; max-width: 500px">
              <q-card-section class="row items-center q-pa-sm q-gutter-sm">
                <q-icon name="lock" />
                <div class="text-h6">Change Password</div>
              </q-card-section>

              <q-card-section class="q-pa-md q-gutter-md column">
                <q-input
                  v-model="passwordForm.currentPassword"
                  label="Current Password"
                  type="password"
                  filled
                />
                <q-input
                  v-model="passwordForm.newPassword"
                  label="New Password"
                  type="password"
                  filled
                />
                <q-input
                  v-model="passwordForm.confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  filled
                />
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="Cancel" color="grey" @click="passwordDialog = false" />
                <q-btn color="primary" label="Update" @click="submitPasswordChange" />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <q-dialog v-model="updateDialog" persistent>
            <q-card style="min-width: 350px; max-width: 500px">
              <q-card-section class="row items-center q-pa-sm q-gutter-sm">
                <q-icon name="edit" />
                <div class="text-h6">Update Profile</div>
              </q-card-section>

              <q-card-section class="q-pa-md q-gutter-md column">
                <q-input v-model="form.firstName" label="First Name" filled />
                <q-input v-model="form.middleName" label="Middle Name" filled />
                <q-input v-model="form.lastName" label="Last Name" filled />
                <q-input v-model="form.username" label="Username" filled />
                <q-input v-model="form.email" label="Email" filled type="email" />
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="Cancel" color="grey" @click="updateDialog = false" />
                <q-btn color="primary" label="Save" @click="submitUpdate" />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <q-separator class="q-my-md" />

          <div class="text-left">
            <div class="text-subtitle2 text-weight-bold q-mb-sm">Order Statistics</div>
            <q-item dense>
              <q-item-section avatar><q-icon name="list" /></q-item-section>
              <q-item-section>Total Orders</q-item-section>
              <q-item-section side>{{ stats.total }}</q-item-section>
            </q-item>

            <q-item dense>
              <q-item-section avatar><q-icon name="pending" /></q-item-section>
              <q-item-section>Pending</q-item-section>
              <q-item-section side>{{ stats.pending }}</q-item-section>
            </q-item>

            <q-item dense>
              <q-item-section avatar><q-icon name="local_shipping" /></q-item-section>
              <q-item-section>Shipped</q-item-section>
              <q-item-section side>{{ stats.shipped }}</q-item-section>
            </q-item>

            <q-item dense>
              <q-item-section avatar><q-icon name="check_circle" /></q-item-section>
              <q-item-section>Completed</q-item-section>
              <q-item-section side>{{ stats.completed }}</q-item-section>
            </q-item>
          </div>
        </q-card>
      </div>

      <!-- Order History -->
      <div class="col-12 col-md-8">
        <q-card class="q-pa-md">
          <div class="text-h6 q-mb-md">My Orders</div>
          <q-separator />

          <div v-if="tableLoading" class="flex flex-center q-my-xl">
            <q-spinner-dots color="primary" size="50px" />
          </div>

          <div v-if="orders.length === 0" class="q-mt-md text-grey text-center">
            No orders found.
          </div>

          <q-list v-else bordered class="q-mt-md">
            <q-expansion-item v-for="order in orders" :key="order._id" expand-separator>
              <template v-slot:header>
                <q-item-section>
                  <div>
                    <q-badge
                      :color="getStatusColor(order.status)"
                      class="q-mt-xs q-pa-sm text-weight-bold"
                    >
                      {{ order.status }}
                    </q-badge>
                  </div>
                  <q-item-label><strong>Order #:</strong> {{ order._id }}</q-item-label>
                  <q-item-label caption> Total: ₱{{ order.totalPrice }} </q-item-label>
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
                <q-item-label header class="q-mb-sm">Update</q-item-label>
                <div
                  style="
                    width: 100%;
                    max-width: 200px;
                    background-color: #f5f5f5;
                    border: 1px solid #ccc;
                    cursor: pointer;
                  "
                >
                  <q-img :src="order.fileUpdate"></q-img>
                </div>

                <q-separator />
                <div class="text-right text-caption q-mt-sm">
                  Payment: {{ order.paymentMethod }}<br />
                  Pickup: {{ order.isPickup ? 'Yes' : 'No' }}<br />
                  <span v-if="order.shippingAddress">
                    {{ order.isPickup ? 'Pickup Address' : 'Shipping Address' }}:
                    {{ order.shippingAddress }}
                  </span>
                </div>
                <q-separator class="q-my-sm" />

                <div class="row justify-end">
                  <q-btn
                    v-if="order.status === 'shipped'"
                    color="positive"
                    label="Mark as Completed"
                    icon="check_circle"
                    unelevated
                    @click="markAsCompleted(order._id)"
                  />
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
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'

const router = useRouter()

const tableLoading = ref(false)

const user = ref({})
const orders = ref([])
const passwordDialog = ref(false)
const updateDialog = ref(false)

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const form = ref({
  firstName: '',
  middleName: '',
  lastName: '',
  username: '',
  email: '',
})

const stats = computed(() => {
  return {
    total: orders.value.length,
    pending: orders.value.filter((o) => o.status === 'pending').length,
    shipped: orders.value.filter((o) => o.status === 'shipped').length,
    completed: orders.value.filter((o) => o.status === 'completed').length,
  }
})

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

async function fetchProfile() {
  try {
    const response = await axios.get(`${process.env.api_host}/users/viewer`, {
      headers: { Authorization: localStorage.getItem('authToken') },
    })
    user.value = response.data.user
    form.value = {
      firstName: user.value.firstName || '',
      middleName: user.value.middleName || '',
      lastName: user.value.lastName || '',
      username: user.value.username || '',
      email: user.value.email || '',
    }
  } catch (err) {
    console.error(err)
    noUser()
  }
  fetchOrders()
}

async function fetchOrders() {
  try {
    tableLoading.value = true
    const token = localStorage.getItem('authToken')
    const ordersRes = await axios.get(`${process.env.api_host}/orders/myOrders`, {
      headers: { Authorization: token },
    })
    orders.value = ordersRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (err) {
    console.error(err)
  } finally {
    tableLoading.value = false
  }
}

async function submitUpdate() {
  try {
    const token = localStorage.getItem('authToken')
    await axios.post(`${process.env.api_host}/users/update/${user.value._id}`, form.value, {
      headers: { Authorization: token },
    })
    Notify.create({
      type: 'positive',
      message: 'Profile updated successfully!',
    })
    updateDialog.value = false
    fetchProfile()
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Failed to update profile.' })
  }
}

async function submitPasswordChange() {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    Notify.create({ type: 'negative', message: 'New passwords do not match.' })
    return
  }
  try {
    const token = localStorage.getItem('authToken')
    await axios.post(
      `${process.env.api_host}/users/changePassword`,
      {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword,
      },
      { headers: { Authorization: token } },
    )
    Notify.create({ type: 'positive', message: 'Password changed successfully.' })
    passwordDialog.value = false
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (err) {
    console.error(err)
    Notify.create({
      type: 'negative',
      message: err.response?.data?.message || 'Failed to change password.',
    })
  }
}

function logout() {
  try {
    Notify.create({ message: 'Logout Success', type: 'positive', position: 'top', timeout: 1000 })
    localStorage.clear()
    router.replace('/')
  } catch (error) {
    Notify.create({ message: 'Logout Failed', type: 'negative' })
  }
}

async function markAsCompleted(orderId) {
  try {
    const token = localStorage.getItem('authToken')
    await axios.post(
      `${process.env.api_host}/orders/updateOrder/${orderId}`,
      { status: 'completed' },
      { headers: { Authorization: token } },
    )
    Notify.create({ message: 'Order marked as completed!', type: 'positive', position: 'top' })
    fetchOrders()
  } catch (err) {
    console.error(err)
    Notify.create({ message: 'Failed to update order status', type: 'negative' })
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
