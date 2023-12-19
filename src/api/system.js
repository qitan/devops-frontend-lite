import request from '@/utils/request'

export default {
  // 菜单接口
  getMenuList (params) {
    return request.get('/menu/', params)
  },
  createMenu (params) {
    return request.post('/menu/', params)
  },
  patchMenu (params) {
    return request.patch(`/menu/${params.id}/`, params)
  },
  deleteMenu (params) {
    return request.delete(`/menu/${params.id}/`)
  },
  // 角色接口
  getRoleList (params) {
    return request.get('/role/', params)
  },
  createRole (params) {
    return request.post('/role/', params)
  },
  patchRole (params) {
    return request.patch(`/role/${params.id}/`, params)
  },
  deleteRole (params) {
    return request.delete(`/role/${params.id}/`)
  }
}
