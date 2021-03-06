import {login,logout,getUserInfo,userCompanyByCode} from '@/api/user'
import {setToken,getToken} from '@/libs/util'
import {passwordEncrypt} from '@/libs/password'


export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false
  },
  mutations: {
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId(state, id) {
      state.userId = id
    },
    setUserName(state, name) {
      state.userName = name
    },
    setAccess(state, access) {
      state.access = access
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    }
  },
  actions: {
    loginAction({commit}, {companyId,userCode,password}) {
      let pwd = passwordEncrypt(userCode,password);
      return new Promise((resolve, reject) => {
        login({companyId,userCode,pwd}).then(res => {
          if (res.data.success) {
            commit('setToken',res.data.result.token);
            resolve(res.data.result);
          } else {
            reject(res.data);
          }
        }).catch((err)=>{
			reject(err);
		});
      })
    },userCompanyByCodeAction({commit}, {companyCode}){
      return new Promise((resolve,reject)=>{
           userCompanyByCode({companyCode}).then(res=>{
            if(res.data.success) {
                 resolve(res.data.result);
            }else{
                reject(res);
            }
          });
       })
    }
  }
}
