<template>
     
      <div class="cl-top-menu">
              <Modal title="请输入密码" v-model="showmodal" :mask-closable="false" :styles="{height:'100px'}">
                    <Input type="password" v-model="password" placeholder="请输入密码" style="width: 100%" />
                    <div slot="footer">
                        <Button type="text" @click="cancel">取消</Button>
                        <Button type="primary" @click="ok">确定</Button>
                    </div>
                </Modal>
            <!-- <template v-for="(item, index) in appTopMenuList" >
               <div :key="index" class="topMenuDiv" :class="{ active: currentSelected===item.routerUrl}"  @mouseover="menuMouceOver(item.routerUrl)" @mouseleave="menuMouseLeave(item.routerUrl)" @click="clickTopMenu(item)">
                    <img  class="menuImg" :src="getImgUrl(item.routerUrl)" />
                    <div class="menuText" :class="{ menuTextMouseOver: currentMouseOver===item.routerUrl}">
                        {{item.name}}
               </div>
               </div>
            </template> -->
               <div class="topMenuDiv" :class="{ active: currentSelected==='Sale'}"  @mouseover="menuMouceOver('Sale')" @mouseleave="menuMouseLeave('Sale')" @click="clickTopMenu('Sale')">
                    <img  class="menuImg" :src="Sale" key="max-Sale" />
                    <div class="menuText" :class="{ menuTextMouseOver: currentMouseOver==='Sale'}">
                        销售
                    </div>
               </div>
                <div class="topMenuDiv" :class="{ active: currentSelected==='Purchase'}"  @mouseover="menuMouceOver('Purchase')" @mouseleave="menuMouseLeave('Purchase')" @click="clickTopMenu('Purchase')">
                     <img class="menuImg" :src="Purchase" key="max-Purchase" />
                     <div class="menuText" :class="{ menuTextMouseOver: currentMouseOver==='Purchase'}">
                        采购
                    </div>
               </div>
               <div class="topMenuDiv" :class="{ active: currentSelected==='Mrp'}"  @mouseover="menuMouceOver('Mrp')" @mouseleave="menuMouseLeave('Mrp')" @click="clickTopMenu('Mrp')">
                      <img class="menuImg" :src="Mrp" key="max-Mrp" />
                      <div class="menuText" :class="{ menuTextMouseOver: currentMouseOver==='Mrp'}">
                        生产
                    </div>
               </div>
               <div class="topMenuDiv" :class="{ active: currentSelected==='Stock'}"  @mouseover="menuMouceOver('Stock')" @mouseleave="menuMouseLeave('Stock')" @click="clickTopMenu('Stock')">
                      <img class="menuImg" :src="Stock" key="max-Stock" />
                      <div class="menuText" :class="{ menuTextMouseOver: currentMouseOver==='Stock'}">
                        储运
                    </div>
               </div>
                <div class="topMenuDiv" :class="{ active: currentSelected==='Account'}"  @mouseover="menuMouceOver('Account')" @mouseleave="menuMouseLeave('Account')" @click="clickTopMenu('Account')">
                        <img class="menuImg" :src="Account" key="max-Account" />
                      <div class="menuText" :class="{ menuTextMouseOver: currentMouseOver==='Account'}">
                        财务
                    </div>
               </div>
                 <div class="topMenuDiv" :class="{ active: currentSelected==='Report'}"  @mouseover="menuMouceOver('Report')" @mouseleave="menuMouseLeave('Report')" @click="clickTopMenu('Report')">
                         <img class="menuImg" :src="Report" key="max-Report" />
                     <div class="menuText" :class="{ menuTextMouseOver: currentMouseOver==='Report'}">
                        报表
                    </div>
                </div>
                 <div class="topMenuDiv" :class="{ active: currentSelected==='Bas'}"  @mouseover="menuMouceOver('Bas')" @mouseleave="menuMouseLeave('Bas')" @click="clickTopMenu('Bas')">
                        <img class="menuImg" :src="Bas" key="max-Bas" />
                      <div class="menuText" :class="{ menuTextMouseOver: currentMouseOver==='Bas'}">
                        基础数据
                    </div>
               </div>
                 <div class="topMenuDiv" :class="{ active: currentSelected==='Sys'}"  @mouseover="menuMouceOver('Sys')" @mouseleave="menuMouseLeave('Sys')" @click="clickTopMenu('Sys')">
                          <img class="menuImg" :src="Sys" key="max-Sys" />
                     <div class="menuText" :class="{ menuTextMouseOver: currentMouseOver==='Sys'}">
                        系统设置
                    </div>
               </div>
           
    </div>
</template>
<script>
// 后期 做成一个控件 
import request from '@/libs/request'
import Account from '@/assets/images/topMenu/Account.png'
import Bas from '@/assets/images/topMenu/Bas.png'
import Mrp from '@/assets/images/topMenu/Mrp.png'
import Purchase from '@/assets/images/topMenu/Purchase.png'
import Report from '@/assets/images/topMenu/report.png'
import Sale from '@/assets/images/topMenu/sale.png'
import Stock from '@/assets/images/topMenu/Stock.png'
import Sys from '@/assets/images/topMenu/Sys.png'
import baseMixin from '@/mixins'
export default {
    data(){
        return {
            appTopMenuList:null,
            Account,Bas,Mrp,Purchase,Report,Sale,Stock,Sys,//图片路径
            currentMouseOver:'', //默认经过菜单 sale
            isSelected:false,
            showmodal:false,
            password:'',
        }
    },
    mixins:[baseMixin],
    computed:{
        // 默认 选中菜单
         currentSelected(){
             return this.$store.state.app.currentTopMenu
         },
        
    },
    created(){
        this.getTopMenu()
    },
    methods:{
         getImgUrl(type){
             switch (type) {
                 case 'Account':
                     return this.Account
                 case 'Bas':
                     return this.Bas
                 case 'Mrp':
                     return this.Mrp
                 case 'Purchase':
                     return this.Purchase
                 case 'Report':
                     return this.Report
                 case 'Sale':
                     return this.Sale
                 case 'Stock':
                     return this.Stock   
                 case 'Sys':
                     return this.Sys                                     
                 default:
                     break;
             }
         },
         // 获取一级顶部菜单
         getTopMenu(){
            let _url = `/sys/resource/top-level-resource`
            request.get(_url, {}).then(res => {
            this.appTopMenuList = res
            })
        },
        ok(){
            if (this.password == '') {
                this.$Message.warning("请输入密码")
                return
            }
            if (this.password == '1qaz') {
                this.turnToPage('Sys')
                this.showmodal = false
                this.password = ''
            }else{
                this.password = '',
                this.$Message.error("密码错误,请重新输入密码")
            }
        },
        cancel(){
            this.showmodal = false
            this.password = ''
        },
        // 访问前权限检查
        checkRightBeforeAccess(type){
           let flag = true
           if(!!!this.appTopMenuList || this.appTopMenuList.length==0){
               this.getTopMenu()
               return
           }
           let moduleItem = this.appTopMenuList.filter(item=>{
               return item.routerUrl==type
           }) 
           if(!!moduleItem && Array.isArray(moduleItem) && moduleItem.length>0 && !moduleItem[0].disabled){
                flag = false
                this.$store.commit('setTopMenuResourceId',moduleItem[0].id)
           }
           return flag
        },
        //选中菜单
        clickTopMenu(val){
         if(this.checkRightBeforeAccess(val)){
              this.$Message.warning("暂无权限,请与管理员联系!") 
              return
         }
         this.turnToPage(val)    
            // 缓存一级菜单资源ID
        //    this.$store.commit('setTopMenuResourceId',item.id)
        //    let val = item.routerUrl
        //    if(process.env.NODE_ENV === 'development'){
        //         this.turnToPage(val)
        //    }else{
        //         if(val ==='Sys'){
        //          this.showmodal = true 
        //         }else{
        //              if(!item.disabled){
        //                   this.turnToPage(val)
        //              }else{
        //                  this.$Message.warning("暂无权限,请与管理员联系!") 
        //              }
        //         }
        //    }
        },
        turnToPage(val){
           this.$store.commit('setCurrentTopMenu', val)
            if(this.currentCurrentPage!='main'){
                 this.$store.commit('setCurrentPage','main')
                 this.$router.push({name:'main',params:{menuType:val}})
                
            }
        },
        //经过菜单
        menuMouceOver(val){
            this.currentMouseOver =  val
        },
        //离开菜单
        menuMouseLeave(val){
             this.currentMouseOver =  ''
        }
    },
    
    beforeDestroy(){
        
    }
}
</script>
<style>
.menuImg{
    height:28px;
    width:auto;
}
.active{
    border-bottom:2px solid #0e67b7;
     color: #0e67b7;
}
.menuText{
    font-weight: bold;
    vertical-align: top;
   
}
.menuTextMouseOver {
    color: #0e67b7;
}
.topMenuDiv{
     cursor: pointer;
      margin-left: 15px;
      /* border: 1px solid red; */
}

.topMenuDiv img{
    
     /* border: 1px solid pink; */
     margin-top: 8px;
}
.cl-top-menu{
    text-align: center;
    /* border: 1px solid red; */
}
.cl-top-menu div{
    display:inline;
}
  .btn-topMenu{
      margin-left: 15px;
  }
</style>