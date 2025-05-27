import axios from "axios";
import { Notify } from "quasar";
import { useRouter } from 'vue-router'
const router = useRouter()

export async function validation() {
  try {
    const token = localStorage.getItem('authToken')

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
    localStorage.clear()
    return false

  }
};