import request from '@/utils/request'

const userApi = {
  Login: '/user/login/',
  Logout: '/user/logout/',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/user/profile/info/',
  UserMenu: '/user/profile/menus/',
  UserTokenRefresh: '/user/refresh/'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */

export default {
  login (params) {
    return request.post(userApi.Login, params)
  },
  getInfo () {
    return request.get(userApi.UserInfo)
  },
  getCurrentUserNav () {
    return request.get(userApi.UserMenu)
  },
  logout () {
    return request.get(userApi.Logout)
  },
  get2step (parameter) {
    return request.post(userApi.twoStepCode, parameter)
  },
  getSmsCaptcha (parameter) {
    return request.post(userApi.SendSms, parameter)
  },
  refreshUserToken (data) {
    return request.post(userApi.UserTokenRefresh, data)
  }
}
