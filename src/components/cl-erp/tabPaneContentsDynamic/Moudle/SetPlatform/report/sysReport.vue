<template>
  <div class="cl-modal">
    <div class="toolbar-container">
      <Card :bordered="false">
        <Row>
          <Col span="12">
            <Row>
              <Col span="4">
                <page></page>
              </Col>
              <Col span="2">
                <clButton
                iconColor="#0cb05b"
                icon="md-add-circle"
                type="customer"
                size="small"
                @click="addDesignAction()"
              >增加</clButton>
              </Col>
              <Col span="2"  class="marginLeft">
                <clButton
                iconColor="#0cb05b"
                icon="md-create"
                type="customer"
                size="small"
                @click="editAction()"
              >修改</clButton>
              </Col>
              <Col span="2"  class="marginLeft">
                 <clButton
                iconColor="#e16205"
                icon="md-remove-circle"
                type="customer"
                size="small"
                @click="deleteAction()"
              >删除</clButton>
              </Col>
                <Col span="2"  class="marginLeft">
                  <clButton
                iconColor="#e16205"
                icon="md-warning"
                type="customer"
                size="small"
                @click="disabledAction()"
              >禁用</clButton>
              </Col>
              <Col span="2"  class="marginLeft">
                <clButton
                  iconColor="#FFD200"
                  icon="md-copy"
                  type="customer"
                  size="small"
                  @click="copeAction()"
                >复制</clButton>
              </Col>
            </Row>
          </Col>
          <Col span="12">
            <Row :gutter="10" type="flex" justify="end">
              <Col span="4">
                <Input
                  placeholder="模板名称"
                  v-model="queryParams.templateName"
                  size="small"
                />
              </Col>
              <Col span="4">
                <Input
                  placeholder="模板路径"
                  size="small"
                  v-model="queryParams.templatePath"
                />
              </Col>

              <Col span="2" style="text-align: right;">
                <Button type="info" size="small" @click="search()">搜索</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>

    <div class="content-container" :style="{ height: tableHeight + 'px' }">
      <div slot="top">
        <vTable
          name="sysReport"
          :upDownMove="true"
          :height="tableHeight"
          ref="master_list_table"
          :columns="columns"
          url="/report/template/page"
          :pagination="true"
          @row-click="tableRowClick"
        >
           
        </vTable>
      </div>
    </div>
   
     <editForm
      ref="editForm"
      :formDetailData="formDetailData"
      :action="action"
      @submit-success="search()"
      v-model="showEditWindow"
    />
     <!-- <editWindow
      title="添加报表设计"
      v-model="showDesignWindow"
      :fullscreen="true"
      width="50%"
      :loading="false"
      @on-ok="submitDesign()"
    >
      <iframe :src="iframeReportSrc" id="reportDialogFrame" frameborder="0" scrolling="no" style="width: 100%; height: 100%; top: 0;left:0;"></iframe>
    </editWindow> -->
  </div>

</template>
<script>
import {setToken,getToken} from '@/libs/util'
import editWindow from "@/components/edit-window/edit-window";
import clButton from "@/components/cl-erp/button";
import request from '@/libs/request'
import vTable from "@/components/tables/vTable";
import editForm from './edit-report'
import baseMixin from '../mixins'
import page from "@/components/page/page";
export default {
  components: {
    vTable,
    editForm,
    page,
    clButton,
    editWindow
  },
  mixins:[baseMixin],
  data() {
    return {
      // modal1:false,//复制弹出层是否显示
      iframeReportSrc:'',// 报表创建地址
      showDesignWindow:false,// 是否显示报表设计窗口
      queryParams: {
          templateName:'',
          templatePath:''
      },
      columns: [
        {
          title: "禁用",
          key: "status",
          render: (h, params) => {
            return h('div', {
              attrs: {
                class: 'checkbox-disabled'
              }
            }, [ h("Checkbox", {
              props: {
                value: !!!params.row.status,
                disabled: true,
                size: 'small'
              }
            })])
          },
          align: "center",
          width: 50
        },
         {
          title: "公用",
          key: "iisPublic",
           render: (h, params) => {
             return h("Checkbox", {
              props: {
                value: !!params.row.iisPublic,
                disabled: true,
                size: 'small'
              }
            })
          },
          align: "center",
          width: 50
        },
        {
          resizable:false,
          width: 260,
          title: "模板路径",
          slot: "report.slot.templatePath",
        },
        {
          title: "模板名称",
          key: 'templateName',
          align: "left",
          width: 150
        },
        {
          title: "报表绑定资源",
          key: "resourceName",
          align: "center",
          width: 100
        },
         {
          title: "报表变量",
          key: "params",
          align: "left",
          width: 100
        },
       
          {
          title: "备注",
          key: "remark",
          align: "left",
          width: 200
        },
         {
          title: "创建时间",
          key: "createTime",
          align: "left",
          width: 100
        },
         {
          title: "创建人",
          key: "createUser",
          align: "left",
          width: 100
        },
       
      ],
      functionParams: { // 清酒基础路径
        requestBaseUrl: '/report/template',
        uniqueIdName: 'templateId',
      },
    };
  },
  methods: {
    // 复制方法
    copeAction(){
      this.masterRowSelection//选中数据
        this.$Modal.confirm({
        title: "复制确认",
        content: `确定要复制当前选中[${this.masterRowSelection.templateName}]数据吗？`,
        onOk: () => {
          let url = `/report/template/copy`;
          let _self = this;
          let templateId=this.masterRowSelection.id
          request.post(`/report/template/copy?templateId=${templateId}`).then(res => {
            // this.showTipInfo();
            this.search();
          });
        }
      });
    },
     tableRowClick(rowData, rowIndex) {
        this.masterRowSelection = rowData;
      },
      addDesignAction(){
        //  this.showDesignWindow =true
           let token = getToken()
        //   let src = 'http://127.0.0.1:8080/report/design?token='+token
        //   this.iframeReportSrc =src
          window.open(this.$config.reportUrl+"/report/design?token="+token)
      },
      submitDesign(){
         this.showDesignWindow =false
      }
  },
  created() {
    // http://localhost:8080/127.0.0.1:8080/report/design?token=MjU4N2YxZjAyNzA1YzcyZWY2YWUwNWVmMWY1NzExYmY=
 
  }
};
</script>

<style>
.marginLeft{
  margin-left: 10px;
}
</style>
