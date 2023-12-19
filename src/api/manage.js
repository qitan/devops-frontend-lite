import request from '@/utils/request'

const api = {
  user: '/users/',
  role: '/role/',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/organization/'
}

export default {
  getDataDict (params) {
    return request.get('/system/data/', params)
  },
  getPositionUser (params) {
    return request.get('/system/data/user/', params)
  },
  getUserList (params) {
    return request.get(api.user, params)
  },
  getRoleList (params) {
    return request.get(api.role, params)
  },
  getServiceList (params) {
    return request.get(api.service, params)
  },
  getPermissions (params) {
    return request.get(api.permissionNoPager, params)
  },
  getOrgTree (params) {
    return request.get(api.orgTree, params)
  },
  saveService (params) {
    const method = params.id ? 'put' : 'post'
    return request[method](api.service, params)
  },
  saveSub (sub) {
    const method = sub.id ? 'put' : 'post'
    return request[method]('/sub', sub)
  }
}

// export function getPositionUser (params) {
//   return request({
//     url: '/system/data/user/',
//     method: 'get',
//     params
//   })
// }

// export function getUserList (parameter) {
//   return request({
//     url: api.user,
//     method: 'get',
//     params: parameter
//   })
// }

// export function getRoleList (parameter) {
//   return request({
//     url: api.role,
//     method: 'get',
//     params: parameter
//   })
// }

// export function getServiceList (parameter) {
//   return request({
//     url: api.service,
//     method: 'get',
//     params: parameter
//   })
// }

// export function getPermissions (parameter) {
//   return request({
//     url: api.permissionNoPager,
//     method: 'get',
//     params: parameter
//   })
// }

// export function getOrgTree (parameter) {
//   return request({
//     url: api.orgTree,
//     method: 'get',
//     params: parameter
//   })
// }

// // id == 0 add     post
// // id != 0 update  put
// export function saveService (parameter) {
//   return request({
//     url: api.service,
//     method: parameter.id === 0 ? 'post' : 'put',
//     data: parameter
//   })
// }

// export function saveSub (sub) {
//   return request({
//     url: '/sub',
//     method: sub.id === 0 ? 'post' : 'put',
//     data: sub
//   })
// }
