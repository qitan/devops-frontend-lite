import store from '@/store'

/**
 * 判断用户是否拥有操作权限
 * 根据传入的权限标识，查看是否存在用户权限标识集合
 * @param perms
 */
export function checkHasPermission (perms) {
  let hasPermission = false
  const permissions = store.state.user.perms
  // if (permissions.indexOf('admin') !== -1) {
  //   return true
  // }
  for (let i = 0, len = permissions.length; i < len; i++) {
    if (permissions[i] === perms) {
      hasPermission = true
      break
    }
  }
  return hasPermission
}

function hasPerm (perms) {
  // 根据权限标识和外部指示状态进行权限判断
  let hasPerm = false
  console.log('检查permsss', perms)
  for (let i = 0, len = perms.length; i < len; i++) {
    hasPerm = checkHasPermission(perms[i])
    if (hasPerm) {
      hasPerm = true
      break
    }
  }
  return hasPerm
}

function checkPermission (el, binding) {
  // console.debug('checkPermission el === ', el)
  // console.debug('checkPermission binding === ', binding)
  let perms = binding.value
  if (typeof perms === 'string') perms = [perms]
  const isHasPerm = hasPerm(perms)
  // console.debug('hasPerm(perms)---', isHasPerm)
  if (isHasPerm) {
    return
  }
  el.disabled = true
  el.classList.add('is-disabled')
  el.style['pointer-events'] = 'none'
  el.style['text-decoration'] = 'line-through'
  el.style['cursor'] = 'not-allowed'
}

export default {
  inserted (el, binding) {
    checkPermission(el, binding)
  },
  update (el, binding) {
    checkPermission(el, binding)
  }
}

export const PERMISSION_ENUM = {
  'add': { key: 'add', label: '新增' },
  'delete': { key: 'delete', label: '删除' },
  'edit': { key: 'edit', label: '修改' },
  'query': { key: 'query', label: '查询' },
  'get': { key: 'get', label: '详情' },
  'enable': { key: 'enable', label: '启用' },
  'disable': { key: 'disable', label: '禁用' },
  'import': { key: 'import', label: '导入' },
  'export': { key: 'export', label: '导出' }
}
