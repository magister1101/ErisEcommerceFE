<template>
  <q-page class="flex flex-center page">
    <div class="loginContainer">
      <q-card-section class="flex flex-center">
        <img
          src="https://res.cloudinary.com/dvyjiepra/image/upload/v1744075727/Eris_LOGO_wy0z2j.png"
          style="width: 132px"
        />
      </q-card-section>

      <q-card-section class="flex flex-center text-center">
        <p class="text-h5" style="font-weight: bold">Welcome! Login to your account</p>
      </q-card-section>

      <div class="q-ma-md">
        <q-form @submit.prevent="login">
          <q-card-section style="width: 100%">
            <div style="width: 100%">
              <q-input v-model="username" color="babyblue" bg-color="white" filled label="username">
                <template v-slot:prepend>
                  <q-icon name="person" size="34px" />
                </template>
              </q-input>
            </div>
          </q-card-section>

          <q-card-section style="width: 100%" class="flex flex-center">
            <div style="width: 100%">
              <q-input
                v-model="password"
                :type="isPwd ? 'password' : 'text'"
                color="babyblue"
                bg-color="white"
                filled
                label="password"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" size="34px" />
                </template>

                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>
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

        <q-card-section class="flex flex-center">
          <p class="" style="font-weight: bold">Forgot your password?</p>
        </q-card-section>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import { validation } from 'src/components/adminViewerUtility'

const loading = ref(false)
const username = ref('testuser01')
const password = ref('testpassword')

const isPwd = ref(true)
const router = useRouter()

async function login() {
  loading.value = true
  try {
    const response = await axios.post(
      `${process.env.api_host}/users/loginAdmin`,
      {
        username: username.value,
        password: password.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.data.token) {
      const token = response.data.token
      localStorage.setItem('authToken', 'bearer ' + token)
      console.log(process.env.api_host)
      Notify.create({
        type: 'positive',
        message: response.data.message,
        position: 'bottom',
        timeout: 2000,
      })
      router.replace('/admin/cardList/')
    }
  } catch (error) {
    console.log(error)
    Notify.create({
      type: 'negative',
      message: 'Login failed',
      position: 'bottom',
      timeout: 2000,
    })
  } finally {
    loading.value = false
  }
}

async function validate() {
  try {
    const response = await validation()
    const valid = response.valid

    if (valid) {
      router.replace('/admin/cardList/')
    } else {
      return
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  validate()
})
</script>

<style lang="sass" scoped>
.loginContainer
  width: 900px
  height: fit-content
  background-color: #39B5FF
  border-radius: 24px

.loginContainer p
  color: #FFFFFF



@media (max-width: 768px),( max-height: 768px)
  .loginContainer
    background: rgba(0,0,0,0.0)
  .page
    background-color: #39B5FF
</style>
