import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
// import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 120000 // 请求超时时间
})

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    // const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 404) {
      notification.error({
        message: 'Not Found',
        description: data.message,
        duration: 3
      })
    }
    if (error.response.status === 401) { // && !(data.result && data.result.isLogin)) {
      if (+error.response.data.code === 40101) {
        // refresh token过期，不再刷新token
        console.log('refresh token过期，不再刷新token')
        notification.error({
          message: 'Token过期',
          description: '刷新Token已过期，请重新登录！'
        })
        store.dispatch('resetToken').then(() => {
          location.reload()
        })
      } else if (+error.response.data.code === 40108) {
        console.log('login exception')
        notification.error({
          message: '用户名或密码错误',
          description: '请输入正确的用户名和密码'
        })
      } else {
        return refreshToken(request, error.response.config)
      }
      // notification.error({
      //   message: 'Unauthorized',
      //   description: 'Authorization verification failed'
      // })
      // if (token) {
      //   store.dispatch('Logout').then(() => {
      //     setTimeout(() => {
      //       window.location.reload()
      //     }, 1500)
      //   })
      // }
    }
  }
  console.log('request接口错误', error)
  return Promise.reject(error)
}

async function refreshToken (service, config) {
  //   let isRefreshing = false
  if (isRefreshing === false) {
    isRefreshing = true
    try {
      const result = await store.dispatch('refreshToken')
      if (result.data && !result.data.access) {
        return Promise.reject(new Error('Token刷新失败，请重新登录！'))
      }
      // 已经刷新了token，将所有队列中的请求进行重试
      requests.forEach((cb) => cb())
      // 重试完了别忘了清空这个队列
      requests = []
      isRefreshing = false
      // 重新请求时url已经包含api，而baseURL也是api，所以需要删除一个
      config.url = config.url.replace('api/api/', 'api/')
      return service(config)
    } catch (error) {
      // logout()
      // location.reload()
      console.log('Token刷新异常！！！', error)
      //   store.dispatch('user/resetToken').then(() => {
      //     location.reload()
      //   })
      return Promise.reject(error)
    }
  } else {
    // 正在刷新token，返回一个未执行resolve的promise
    return new Promise((resolve) => {
      // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
      requests.push(() => {
        resolve(service(config))
      })
    })
  }
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    // config.headers[ACCESS_TOKEN] = token
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  return response.data
}, errorHandler)

// const installer = {
//   vm: {},
//   install (Vue) {
//     Vue.use(VueAxios, request)
//   }
// }

export default {
  request,
  get (url, param) {
    return new Promise((resolve, reject) => {
      // store.commit('app/SET_COUNTRYNAME', window.localStorage.getItem(store.getters.id + 'countryIcon') && window.localStorage.getItem(store.getters.id + 'countryIcon').indexOf('{') !== -1 ? JSON.parse(window.localStorage.getItem(store.getters.id + 'countryIcon')).alias : '所有区域')
      // store.commit('app/SET_COUNTRYICON', window.localStorage.getItem(store.getters.id + 'countryIcon') && window.localStorage.getItem(store.getters.id + 'countryIcon').indexOf('{') !== -1 ? JSON.parse(window.localStorage.getItem(store.getters.id + 'countryIcon')).icon : '')
      // // let params = param
      // if (param === undefined || param.type === undefined || param.region_filter || !param.region) {
      //   param = { region: window.localStorage.getItem(store.getters.id + 'country') || '', ...param }
      // }
      // if (param.type === 'filter') {
      //   params = param
      // } else {
      //   params = { ...param, region: (param === undefined || param.type === undefined) ? window.localStorage.getItem(store.getters.id + 'country') || '' : '' }
      // }
      request({
        method: 'get',
        url,
        params: param
        // paramsSerializer: (params) => {
        //   return qs.stringify(params, { indices: false });
        // },
      })
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  post (url, param, config) {
    return new Promise((resolve, reject) => {
      request
        .post(url, param, config)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  patch (url, param) {
    return new Promise((resolve, reject) => {
      request
        .patch(url, param)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  put (url, param) {
    return new Promise((resolve, reject) => {
      request
        .put(url, param)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  delete (url, param) {
    return new Promise((resolve, reject) => {
      request
        .delete(url, { params: param })
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

// export {
//   installer as VueAxios,
//   request as axios
// }
