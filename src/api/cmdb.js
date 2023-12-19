import request from '@/utils/request'

export default {
  // CMDB-产品接口
  getProductList (params) {
    return request.get(`/product/`, params)
  },
  createProduct (params) {
    return request.post(`/product/`, params)
  },
  patchProduct (params) {
    return request.patch(`/product/${params.id}/`, params)
  },
  deleteProduct (params) {
    return request.delete(`/product/${params.id}`)
  },
  getProjectList (params) {
    return request.get(`/project/`, params)
  },
  createProject (params) {
    return request.post(`/project/`, params)
  },
  patchProject (params) {
    return request.patch(`/project/${params.id}/`, params)
  },
  deleteProject (params) {
    if (params[0]) {
      // 批量操作
      return request.delete(`/project/${params}/`)
    }
    return request.delete(`/project/${params.id}`)
  },
  getRegionList (params) {
    return request.get(`/region/`, params)
  },
  createRegion (params) {
    return request.post(`/region/`, params)
  },
  patchRegion (params) {
    return request.patch(`/region/${params.id}/`, params)
  },
  deleteRegion (params) {
    return request.delete(`/region/${params.id}`)
  },
  getEnvironmentList (params) {
    return request.get(`/environment/`, params)
  },
  createEnvironment (params) {
    return request.post(`/environment/`, params)
  },
  patchEnvironment (params) {
    return request.patch(`/environment/${params.id}/`, params)
  },
  deleteEnvironment (params) {
    return request.delete(`/environment/${params.id}`)
  },
  getDevLanguageList (params) {
    return request.get(`/app/language/`, params)
  },
  createDevLanguage (params) {
    return request.post(`/app/language/`, params)
  },
  patchDevLanguage (params) {
    return request.patch(`/app/language/${params.id}/`, params)
  },
  deleteDevLanguage (params) {
    return request.delete(`/app/language/${params.id}`)
  },
  getHarborResource (params) {
    return request.get(`/app/harbor/`, params)
  },
  getAppList (params) {
    return request.get(`/app/`, params)
  },
  createApp (params) {
    return request.post(`/app/`, params)
  },
  patchApp (params) {
    return request.patch(`/app/${params.id}/`, params)
  },
  deleteApp (params) {
    return request.delete(`/app/${params.id}`)
  },
  getAppVersionList (params) {
    return request.get(`/app/version/`, params)
  },
  // IDC管理
  getIdcList (params) {
    return request.get(`/asset/idc/`, params)
  },
  createIdc (params) {
    return request.post(`/asset/idc/`, params)
  },
  patchIdc (params) {
    return request.patch(`/asset/idc/${params.id}/`, params)
  },
  deleteIdc (params) {
    return request.delete(`/asset/idc/${params.id}`)
  },
  getIdcRepo (params) {
    return request.get(`/asset/idc/repo/`, params)
  }
}
