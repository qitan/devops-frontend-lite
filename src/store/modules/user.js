import storage from 'store'
import expirePlugin from 'store/plugins/expire'
// import { login, getInfo, logout } from '@/api/login'
import uApi from '@/api/login'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

storage.addPlugin(expirePlugin)
const user = {
  state: {
    token: '',
    rtoken: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    perms: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_REFRESH: (state, rtoken) => {
      state.rtoken = rtoken
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_TITLE: (state, title) => {
      state.title = title
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMS: (state, perms) => {
      state.perms = perms
    },
    SET_USER_EXTRA: (state, user_extra) => {
      state.user_extra = user_extra
    },
    SET_MOBILE: (state, mobile) => {
      state.mobile = mobile
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        uApi.login(userInfo).then(response => {
          const result = response.data
          storage.set(ACCESS_TOKEN, result.access, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
          storage.set(REFRESH_TOKEN, result.refresh, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
          commit('SET_REFRESH', result.refresh)
          commit('SET_TOKEN', result.access)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        // 请求后端获取用户信息 /api/user/info
        uApi.getInfo().then(response => {
          const { data } = response
          if (!data) {
            reject(new Error('Verification failed, please Login again.'))
          }
          const {
            id,
            title,
            roles,
            name,
            username,
            avatar,
            email,
            mobile,
            date_joined,
            last_login,
            user_department,
            position,
            user_director,
            permissions,
            is_superuser
          } = data

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          commit('SET_ROLES', roles)
          commit('SET_ID', id)
          commit('SET_TITLE', title)
          commit('SET_NAME', { name: name, welcome: welcome() })

          commit('SET_USERNAME', username)
          commit('SET_EMAIL', email)
          commit('SET_MOBILE', mobile)
          commit('SET_USER_EXTRA', {
            date_joined: date_joined,
            last_login: last_login,
            user_department: user_department,
            position: position,
            user_director: user_director,
            is_superuser: is_superuser
          })
          commit('SET_AVATAR', avatar)
          console.log('set perms', permissions)
          commit('SET_PERMS', permissions)
          resolve(data)
        }).catch(error => {
          console.log('请求用户信息异常', error)
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        uApi.logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          resolve()
        }).catch((err) => {
          console.log('logout fail:', err)
          // resolve()
        }).finally(() => {
        })
      })
    },
    // remove token
    resetToken ({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_REFRESH', '')
        commit('SET_ROLES', [])
        commit('SET_PERMS', [])
        storage.remove(ACCESS_TOKEN)
        resolve()
      })
    },
    // 刷新token
    refreshToken ({ commit }) {
      return new Promise((resolve, reject) => {
        uApi.refreshUserToken({ refresh: storage.get(REFRESH_TOKEN) }).then((response) => {
          const { access } = response.data
          commit('SET_TOKEN', access)
          storage.set(ACCESS_TOKEN, access, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
          resolve(response)
        })
      })
    }
  }
}

export default user
