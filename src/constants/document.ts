const _prefix = `jsapi`
function toCamel(str: string, firstUpper = false) {
  let result = str.replace(
    /([^_-])(?:(_|-)+([^_-]))/g,
    (mather: string, match1: string, match2: string, match3: string) => {
      return match1 + match3.toUpperCase()
    }
  )

  if (firstUpper) {
    result = result.charAt(0).toUpperCase() + result.substring(1)
  }
  return result
}
const _wrapperPrefix = (name: string) => {
  return {
    name: `${_prefix}-${name}`,
    schema: `${toCamel(`${_prefix}${name}`)}Model`
  }
}
// 短链
export const shortIdCollection = () => {
  return _wrapperPrefix(`short-ids`)
}

// 管理其他平台的服务端配置
export const ssrSettingCollection = () => {
  return _wrapperPrefix(`ssr-settings`)
}

// ip 查询
export const ipCollection = () => {
  return _wrapperPrefix(`ips`)
}

// 一些任务
export const taskCollection = () => {
  return _wrapperPrefix(`tasks`)
}
// 权限表
export const permissionCollection = () => {
  return _wrapperPrefix(`permissions`)
}
