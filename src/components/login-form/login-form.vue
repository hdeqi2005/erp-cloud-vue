<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    
    <FormItem prop="companyCode">
      <Input  class="loginInput" v-model="form.companyCode" :placeholder="$t('login.companyCodeLabelTips')" @on-blur="getCompany">
        <span slot="prepend">
          <!-- <Icon :size="16" type="md-home"></Icon> -->
          <Icon :size="16" type="ios-contact-outline" color="#2E68EA" />
        </span>
        <span slot="append">{{companyName}}</span>
      </Input>
    </FormItem>

    <FormItem prop="userName">
      <Input class="loginInput"  v-model="form.userName" :placeholder="$t('login.userCodeLabelTips')">
        <span slot="prepend">
          <!-- <Icon :size="16" type="ios-person"></Icon> -->
          <Icon :size="16" type="ios-phone-portrait" color="#2E68EA"/>
        </span>
      </Input>
    </FormItem>
    
    <FormItem prop="password">
      <Input class="loginInput"  type="password" v-model="form.password" :placeholder="$t('login.passwordLabelTips')">
        <span slot="prepend">
          <!-- <Icon :size="14" type="md-lock"></Icon> -->
          <Icon :size="16" type="ios-unlock-outline" color="#2E68EA"/>
        </span>
      </Input>
    </FormItem>

    <FormItem>
      <Button class="loginButton" @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'LoginForm',
  props: {
    companyCodeRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '单位编码不能为空', trigger: 'blur' }
        ]
      }
    },
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      companyName:'',
      form: {
        companyCode:'',
        companyId:'',
        userName: '',
        password: ''
      }
    }
  },
  watch:{
      '$route.path':function(newVal,oldVal){
        if(!!oldVal){
           this.$refs.loginForm.resetFields()
        }
      }
   },
  computed: {
    rules () {
      return {
        companyCode:this.companyCodeRules,
        userName: this.userNameRules,
        password: this.passwordRules
      }
    }
  },
  mounted(){
    this.getCompanyCodeFromUrl()
   // this.form.companyCode = ''
   // this.$refs.loginForm.resetFields()
  },
  methods: {
    ...mapActions([
      'userCompanyByCodeAction'
    ]),
    // 从分享链接中获取单位代码: XHZQ
    getCompanyCodeFromUrl(){
    //  debugger
      // http://erp.szclsoft.com/#/login?companyCode=XHZQ
      let _self = this
      let _companyCode = this.getUrlParams('companyCode')
      if(!!_companyCode){
        this.form.companyCode = _companyCode
        setTimeout(()=>{
           _self.getCompany()
        },200)
       
      }
    },
    getUrlParams(paramName,_url) {
      let url = _url || window.location.href
      if(!!!url){
        console.error('andy 无法获取url addr window.location.href')
        return ''
      }
      
       var urlParams = url.split("?")[1];//或者url.search获取参数字符串
      if(!!!urlParams){
        return ''
      }
        var paramArray = urlParams.split("&");
        var len = paramArray.length;
        var paramObj = {};//json对象
        var arr = [];//数组对象
        for (let i = 0; i < len; i++) {
            arr = paramArray[i].split("=");
            paramObj[arr[0]] = arr[1];
        }
        for (let key in paramObj) {
            if (key == paramName) {
                console.log('paramName:'+paramObj[paramName])
                return paramObj[paramName];
                break;
            }
        }

    },
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$store.commit('setCurrentPage','home')
          this.$store.commit('setCurrentTopMenu','')
          this.$emit('on-success-valid', {
            userCode: this.form.userName,
            password: this.form.password,
            companyId:this.form.companyId
          })
        }
      })
    },
    getCompany(){
      this.companyName="" // 清空
      let _self = this
      this.userCompanyByCodeAction(this.form).then(res => {
        // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
        _self.companyName = res.companyInfo.companyName;
        _self.form.companyId = res.companyInfo.id;
        if(res && (res.expire || res.tips)){
         // alert(res.message)
            _self.$Message.warning(res.message);
        }
      }).catch(res=>{
        _self.$Message.error(res.data.msg);
      })
    }
  }
}
</script>
<style scoped>
.loginInput{
  height:40px;
  border:1px solid rgba(179,179,179,1);
  border-radius:20px;
  padding: 6px;
}
.loginButton{
  height: 40px;
  background:linear-gradient(270deg,rgba(149,158,253,1),rgba(46,104,234,1));
  border-radius:20px;
}
</style>
