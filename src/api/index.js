import http from '@/utils/request'
import user from './login'
import manage from './manage'
import cmdb from './cmdb'
import system from './system'

const api = Object.assign(
    {},
    http,
    user,
    manage,
    cmdb,
    system
)

export default api
