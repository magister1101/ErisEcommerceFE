<template>
  <q-page class="flex flex-center page">
    <div class="container">
      <q-card class="q-pa-lg" style="margin: auto">
        <q-card-section>
          <div class="text-h6">Create User</div>
        </q-card-section>

        <q-form @submit.prevent="handleSubmit">
          <q-card-section>
            <q-input v-model="username" label="Username" outlined required class="q-mb-md" />
            <q-input
              v-model="password"
              label="Password"
              type="password"
              outlined
              required
              class="q-mb-md"
            />

            <q-input v-model="firstName" label="First Name" outlined class="q-mb-md" />
            <q-input v-model="lastName" label="Last Name" outlined class="q-mb-md" />
            <q-input v-model="middleName" label="Middle Name" outlined class="q-mb-md" />
            <q-input v-model="email" label="Email" type="email" outlined class="q-mb-md" />
          </q-card-section>
          <q-card-section>
            <q-btn
              class="q-py-lg q-px-lg"
              label="login"
              no-cap
              color="primary"
              icon="login"
              type="submit"
              :loading="loading"
              style="width: 100%; border-radius: 15px"
            />
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const username = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const middleName = ref('')
const email = ref('')

const loading = ref(false)

const handleSubmit = async () => {
  try {
    loading.value = true

    const response = await axios.post(
      `${process.env.api_host}/users/create`,
      {
        username: username.value,
        password: password.value,
        firstName: firstName.value,
        lastName: lastName.value,
        middleName: middleName.value,
        email: email.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    $q.notify({ type: 'positive', message: 'User created successfully' })
    console.log(response.data)
  } catch (err) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Error creating user' })
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="sass" scoped>

.container
  width: 900px
  height: fit-content
  background-color: #39B5FF
  border-radius: 24px
</style>
