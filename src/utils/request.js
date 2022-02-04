import axios from "axios";
import store from '@/store'

const service = axios.create()

service.interceptors.request.use(
  config => {
    config.headers['token'] = localStorage.getItem("token")
    console.log(localStorage.getItem("token"))
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(response => {
    let res = response.data;
    console.log(res)

    if (res.code === 200) {
      return response
    } else {
      return Promise.reject(response.data.message)
    }
  },
  error => {
    console.log(error)
    if (error.response.data) {
      error.message = error.response.data.message
    }

    if (error.response.status === 401) {
      this.router.push("/login")
    }
  }
)

export default service
