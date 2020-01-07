import axios from '@/libs/api.request'


export const getUserInfo = (token) => {
  return axios.request({
    url: 'get_info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}
/**
 * 获取单位信息，根据单位编号
 */
export const userCompanyByCode = ({companyCode})=>{
  return axios.request({
    url: `/sys/user/getCompanyNameByCode`,
    params:{companyCode},
    method: 'GET'
  })
}

/**
 * login
 * companyCode:单位编号
 * userCode:用户名
 * pwd:密码
 */
export const login = ({companyId,userCode, pwd }) => {
  let datas = {
    companyId:companyId,
    username:userCode,
    password:pwd
  }
  return axios.request({
    url: `/sys/user/login`,
    data:datas,
    method: 'POST',
    transformRequest: [function (data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
