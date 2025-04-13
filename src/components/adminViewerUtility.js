import axios from "axios";
import { Notify } from "quasar";
import { useRouter } from 'vue-router'
const router = useRouter()

export async function validation() {
  const token = localStorage.getItem('authToken')

  try {

    if (!token) {
      return ''
    }

    const response = await axios.get(`${process.env.api_host}/users/viewer`, {
      headers: {
        Authorization: token,
      },
    })
    if (response.data.valid) {
      return response.data
    }
  } catch (error) {
    console.log(error)
    Notify.create({
      message: 'validation Failed',
      type: 'negative',
    })
    localStorage.clear()
    router.push('/secret/')
  }
};