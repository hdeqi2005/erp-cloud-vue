<template>
  <div style=" ">
    <Row>
      <Col span="1">&nbsp;</Col>
      <Col span="6" offset="1">
        <Card>
          <p slot="title">平台运维</p>
          <p style="padding: 10px;">
            <Button @click="handleSubMenuEvent('sysForm','setplatform-form','表单')" type="info">表单</Button>
          </p>
          <p style="padding: 10px;">
            <Button
              @click="handleSubMenuEvent('popopConfig','popop-config','弹框配置')"
              type="info"
            >弹框配置</Button>
          </p>
          <p style="padding: 10px;">
            <Button
              @click="handleSubMenuEvent('platformResource','platform-resource','资源配置')"
              type="info"
            >资源配置</Button>
          </p>
            <p style="padding: 10px;">
            <Button
              @click="showCreateFactoryPopup()"
              type="info"
            >一键开厂</Button>
          </p>
        </Card>
      </Col>
      <Col span="6">
        <Card>
          <p slot="title">系统设置</p>
         <p style="padding: 10px;">
            <Button @click="handleSubMenuEvent('sysReport','setplatform-report','报表设计')" type="info">报表设计</Button>
          </p>
        </Card>
      </Col>
    </Row>
    <editWindow width="400" v-model="showCreateFactoryWindow" @on-ok="submitCreateFactory()"  @on-cancel="cancelCreateFactory()"  :fullscreen="false" title="一键开厂">
          <Form :label-width="120" ref="formCreateFac"  :model="formCreateFac" :rules="ruleCrateFac" inline>
             <div class="formCreateFacBox">
                 <FormItem label="源单位Id:" class="formCreateFacItem" prop="baseCompanyId">
                <Input type="text" v-model="formCreateFac.baseCompanyId" placeholder="源单位Id">
                    <!-- <Icon type="ios-aperture-outline" slot="prepend"></Icon> -->
                </Input>
            </FormItem>
            <FormItem label="新开厂单位Id:" class="formCreateFacItem" prop="targetCompanyId">
                <Input  type="text" v-model="formCreateFac.targetCompanyId" placeholder="新开厂单位Id">
                    <!-- <Icon type="ios-aperture" slot="prepend"></Icon> -->
                </Input>
            </FormItem>
             </div>
          
        </Form>
         <div slot="footer">
         <Button  :loading="loaddingBtn" type="primary" @click="submitCreateFactory()">
                <Icon type="ios-arrow-down" />
                确定
           </Button>
            <Button @click="cancelCreateFactory()">
              <Icon color="red" type="md-close" />
                取消
           </Button>
      </div>
    </editWindow>
  </div>
 
</template>

<script>
import request from "@/libs/request";
  import editWindow from '_c/edit-window/edit-window'
import globleMixin from "@/mixins";
export default {
  mixins: [globleMixin],
  components:{editWindow},
  data() {
    return {
      loaddingBtn:false,
      formCreateFac:{
        baseCompanyId:null,
        targetCompanyId:null
      },
      ruleCrateFac: {
                    baseCompanyId: [
                        { required: true, message: '源单位Id必填', trigger: 'blur' }
                    ],
                    targetCompanyId: [
                        { required: true, message: '新开厂单位Id必填', trigger: 'blur' },
                    ]
                },
      showCreateFactoryWindow:false,// 是否显示一键开厂
    };
  },
  methods: {
    // 显示一键开厂窗体
    showCreateFactoryPopup(){
      this.showCreateFactoryWindow = true
    },
    // 提交一键开厂窗体
    submitCreateFactory(){
     
       this.$refs["formCreateFac"].validate(valid => {
        if (valid) {
           this.loaddingBtn = true
          let _url=`/sys/init/initSysData?baseCompanyId=${this.formCreateFac.baseCompanyId}&targetCompanyId=${this.formCreateFac.targetCompanyId}`
          let params = {
            
          }
           request.post(_url, params).then(res => {
              this.loaddingBtn = false
            this.$Message.success("一键开厂成功!");
            this.showCreateFactoryWindow = false
          }).catch(err=>{
            this.loaddingBtn = false
          });
          
        }
      })
     
    },
    // 关闭一键开厂窗体
    cancelCreateFactory(){
       this.$refs["formCreateFac"].resetFields();
      this.showCreateFactoryWindow = false;
      this.loaddingBtn = false
    },
    // 子页面 参数: 页面.vue,唯一区别ID,TAB 标签显示名称
    handleSubMenuEvent(currentPage, uniqueKey, tabName, ) {
      let params = {
        menuName: "SetPlatform",
        page: currentPage, //显示控件页面
        uniqueKey: uniqueKey,
        lable: tabName,
        isActive: true
      };
      this.handleMenuBaseEvent(params,true); // 调用MIXIN 共用方法
     
    }
  }
};
</script>

<style lang="scss">
.formCreateFacBox{
  display: flex;
  flex-direction: column;
  height: 200px;
  .formCreateFacItem{
    height: 50px;
   // width: 200px;
  }
}

</style>
