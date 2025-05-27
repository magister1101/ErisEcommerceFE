<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">My Cart</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="cart"
          :columns="columns"
          :row-key="(row) => row.product._id + '-' + row.quantity"
          :loading="loading"
          flat
          bordered
          no-data-label="Your cart is empty"
          selection="multiple"
          v-model:selected="selectedRows"
        >
          <!-- Product Image -->
          <template #body-cell-image="props">
            <q-td :props="props">
              <q-img
                :src="props.row.product.file"
                style="width: 75px; height: 75px; border-radius: 8px; cursor: pointer"
                spinner-color="primary"
                :alt="props.row.product.name"
                @click="previewImage(props.row.product.file)"
                :ratio="1"
                transition="fade"
                placeholder-src="https://via.placeholder.com/75"
              />
            </q-td>
          </template>

          <!-- Product Details -->
          <template #body-cell-product="props">
            <q-td :props="props">
              <div class="text-subtitle1">{{ props.row.product.name }}</div>
              <div class="text-caption text-grey">
                {{ props.row.product.game }} — {{ props.row.product.series }}<br />
                Code: {{ props.row.product.code }}<br />
                Rarity: {{ props.row.product.rarity }}
              </div>
            </q-td>
          </template>

          <!-- Quantity -->
          <template #body-cell-quantity="props">
            <q-td :props="props">
              {{ props.row.quantity }}
            </q-td>
          </template>

          <!-- Price x Quantity -->
          <template #body-cell-total="props">
            <q-td :props="props">
              ₱{{ (props.row.product.price * props.row.quantity).toFixed(2) }}
            </q-td>
          </template>
        </q-table>

        <!-- Order Form -->
        <div class="q-mt-md">
          <q-form @submit.prevent="submitOrder" ref="orderForm">
            <q-select
              v-model="paymentMethod"
              :options="['Gcash']"
              label="Payment Method"
              filled
              emit-value
              map-options
              required
            />
            <q-toggle v-model="isPickup" label="Pickup" color="primary" class="q-mt-sm" />
            <q-input
              v-if="!isPickup"
              v-model="shippingAddress"
              label="Shipping Address"
              required
              filled
              class="q-mt-sm"
            />
            <div class="text-h6 q-mt-md">Total: ₱{{ totalSelectedPrice.toFixed(2) }}</div>
            <q-btn
              label="Create Order"
              type="submit"
              color="primary"
              :disable="
                selectedRows.length === 0 || !paymentMethod || (!isPickup && !shippingAddress)
              "
              class="q-mt-sm"
            />
          </q-form>
        </div>
      </q-card-section>
    </q-card>

    <!-- Image Preview Dialog -->
    <q-dialog v-model="previewImageUrl">
      <q-card style="max-width: 90vw; max-height: 90vh">
        <q-img :src="previewImageUrl" style="max-width: 100%; max-height: 100%" />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import { validation } from '../../components/userViewerUtility.js'

const userId = ref('')
const viewer = ref(null)

const router = useRouter()

const loading = ref(true)
const cart = ref([])
const previewImageUrl = ref(null)
const selectedRows = ref([])

const paymentMethod = ref('')
const isPickup = ref(true)
const shippingAddress = ref('')

const columns = [
  {
    name: 'image',
    label: 'Image',
    align: 'left',
    field: (row) => row.product.file,
  },
  {
    name: 'product',
    label: 'Product',
    align: 'left',
    field: (row) => row.product.name,
    sortable: true,
  },
  {
    name: 'quantity',
    label: 'Quantity',
    align: 'center',
    field: 'quantity',
    sortable: true,
  },
  {
    name: 'total',
    label: 'Total Price',
    align: 'right',
    field: (row) => row.quantity * row.product.price,
    sortable: true,
  },
]

async function validate() {
  try {
    const response = await validation()
    viewer.value = response

    if (!viewer.value.valid) {
      router.push('/login')
    }

    userId.value = viewer.value.user._id
  } catch (error) {
    console.log(error)
    Notify.create({
      message: 'Must be logged in',
      type: 'negative',
    })
  }
}

function previewImage(url) {
  previewImageUrl.value = url
}

async function fetchUserCart() {
  try {
    const { data } = await axios.get(`${process.env.api_host}/users?query=${userId.value}`)

    if (data.length > 0) {
      cart.value = data[0].cart
    } else {
      Notify.create({ type: 'warning', message: 'User not found' })
    }
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Failed to load cart' })
  } finally {
    loading.value = false
  }
}

// Calculate total price of selected items (product.price * quantity)
const totalSelectedPrice = computed(() => {
  return selectedRows.value.reduce((acc, item) => {
    return acc + item.product.price * item.quantity
  }, 0)
})

async function submitOrder() {
  if (selectedRows.value.length === 0) {
    Notify.create({ type: 'warning', message: 'Please select products to order' })
    return
  }

  const products = selectedRows.value.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
  }))

  try {
    const orderPayload = {
      products,
      totalPrice: totalSelectedPrice.value,
      paymentMethod: paymentMethod.value,
      isPickup: isPickup.value,
      shippingAddress: isPickup.value ? '' : shippingAddress.value,
      shippingPrice: isPickup.value ? 0 : 50,
    }

    const token = localStorage.getItem('authToken')

    const response = await axios.post(`${process.env.api_host}/orders/createOrder`, orderPayload, {
      headers: {
        Authorization: token,
      },
    })

    Notify.create({ type: 'positive', message: 'Order created successfully!' })

    selectedRows.value = []
    paymentMethod.value = ''
    isPickup.value = true
    shippingAddress.value = ''

    await fetchUserCart()
  } catch (error) {
    console.error(error)
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to create order',
    })
  }
}

onMounted(() => {
  validate()
  fetchUserCart()
})
</script>
