<template>
  <div class="cl-moudle cl-analyzerNew">
    <Form
      ref="masterForm"
      :show-message="true"
      :model="formDataInfo"
      :rules="ruleValidate"
      :label-width="90"
    >
      <div class="edit-purPaperPoAnalyzSlave">
        <Row >
          <Col span="4">
            <FormItem :label-width="45" label="客户" prop="cusCode">
              <popup
                v-model="formDataInfo.cusCode"
                field-name="cusCode"
                popup-name="CustomerMultiBox"
                :fill-model.sync="formDataInfo"
                render-fields="custIds,cusCode,cusName" 
                from-fields="id,cusCode,cusName"
                :suffix="true"
                :suffix-model="formDataInfo.cusName"
                suffixModelName="cusName"
              />
                <!-- :suffix-model="formDataInfo.master.custName" -->
            </FormItem>
          </Col>
          <Col span="6">
            <Row>
                <Col span="14">
                <FormItem :label-width="75" label="日期范围">
                    <DatePicker
                    type="date"
                    format="yyyy-MM-dd"
                    v-model="formDataInfo.stratDateTime"
                    @on-change='clearData'
                    ></DatePicker>
                </FormItem>
              </Col>
                <Col span="10">
                    <FormItem :label-width="25"  label="--">
                    <DatePicker
                        type="date"
                        format="yyyy-MM-dd"
                        v-model="formDataInfo.endDateTime"
                        @on-change='clearData'
                    ></DatePicker>
                    </FormItem>
                </Col>
            </Row>
          </Col>
          <Col span="3">
            <FormItem  label="会计月份" prop="bdYm" :label-width="75">
                <DatePicker
                  @on-change='clearData'
                  transfer
                  clearable
                  v-model="formDataInfo.bdYm"
                  type="month"
                  format="yyyyMM"
                ></DatePicker>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem  label="业务员" prop="workCode" :label-width="65">
              <popup
                v-model="formDataInfo.workCode"
                field-name="workCode"
                :disabled="false"
                popup-name="WorkerSingleBox"
                :fill-model.sync="formDataInfo"
                render-fields="workerId,workerName,workCode"
                from-fields="id,workName,workCode"
                :suffix="true"
                :suffix-model="formDataInfo.workerName"
                suffixModelName="workerName"
                :query-params="{workOptType:1}"
              />
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem  label="货币" prop="coinCode" :label-width="65">
              <popup
                v-model="formDataInfo.coinCode"
                field-name="coinCode"
                :disabled="false"
                popup-name="CoinSingleBox"
                :fill-model.sync="formDataInfo"
                render-fields="coinId,coinCode,coinName"
                from-fields="id,coinCode,coinName"
                :suffix="true"
                :suffix-model="formDataInfo.coinName"
                suffixModelName="coinName"
              />
            </FormItem>
          </Col>
           <Col span="1" class="buttonMarginleft">
                <FormItem>
                  <Button @click="searchDataBy()" type="primary">
                    <Icon type="md-search" />搜索
                  </Button>
                </FormItem>
              </Col>
        </Row>
       
      </div>
    </Form>
    <div slot="top">
      <Tabs @on-click="TabsClickEvent" :animated="false">
        <TabPane label="明细" name="detailed">
          <vTable
            :height="tableHeight-26"
            ref="master_list_table"
            :columns-url="functionParams.requestColBaseUrl + '/statisAccreceDetailFm'"
            :table-data="tableBoxCoWorkProcData"
            :pagination="false"
            name="statisAccreceDetailFm"
          ></vTable>
        </TabPane>

        <TabPane label="汇总" name="Summary">
          <vTable
            :height="tableHeight-26"
            ref="tableFieldRef"
            :table-data="tableBoxCoWorkProcData"
            :columns-url="functionParams.requestColBaseUrl + '/statisAccreceGroupFm'"
            :pagination="false"
            name="statisAccreceGroupFm"
          ></vTable>
        </TabPane>
        <ReportPage 
            slot="extra" 
            @change='change' 
            ref="ReportPage"
            :total='page.total'
            :current='page.pageNumber'
            :pageSize='page.pageSize'
        ></ReportPage>
      </Tabs>
    </div>

  </div>
</template>
<script>
import ReportPage from '../components/ReportPage'
import vTable from "@/components/tables/vTable";
import eTable from "@/components/e-table/e-table";
import htmlTemplate from "../components/htmlTemplate";
import listBaseMixins from "../mixins/list";
import request from "@/libs/request";
import popup from "@/components/popup/popup";
import { deepCopy } from 'view-design/src/utils/assist'
import dayjs from "dayjs";
const default_formDataInfo = {
        coinId:'',//货币
        coinName:'',
        coinCode:'',
        custIds:'',//客户
        cusName:'',
        cusCode:'',
        endDateTime:dayjs().format("YYYY-MM-DD"),//结束时间
        stratDateTime:dayjs().subtract(30, 'day').format("YYYY-MM-DD"),//开始时间
        workerId:'',//业务员
        workerName:'',
        workCode:'',
        bdYm: "",  //会计月份

}
export default {
  mixins: [listBaseMixins],
  components: {
    htmlTemplate,
    vTable,
    eTable,
    popup,
    ReportPage
  },
  data() {
    return {
      modelname:'应收对账单查询',
      tableBoxCoWorkProcData: [], // 表单显示数据
      currentTabName: "detailed", // 当前TABL名称
       page:{
          total:1,
          pageSize:20,
          pageNumber:1,
      },
      formDataInfo: deepCopy(default_formDataInfo), // 防止添加和更新数据提交发生冲突
      ruleValidate: {},
      // 查询配置参数
      functionParams: {
        formInitPreName: "statisAccreceDetailFm", // 查询表格列头信息 前缀 例如:boxco mainFm/itemFm/mdataFm
        requestBaseUrl: "/report/account", // 查询 表格行 数据 接口前缀地址
      }
    };
  },
  methods: {
    clearData(e,v){
      switch (v) {
        case 'month':
          this.formDataInfo.endDateTime = ''
          this.formDataInfo.stratDateTime = ''
          this.onChange_apMonth(e,v)
          break;
        case 'date':
          this.formDataInfo.bdYm =''
          break;
        default:
          // this.formDataInfo.bdYm =''
          break;
      }
    },
    // 会计月份 改变时间回调事件
    onChange_apMonth (item) {
      if (!_.isEmpty(item)) {
        this.formDataInfo.bdYm = new Date(
          dayjs(item).format('YYYY-MM')
        )
      }else{
        this.formDataInfo.bdYm =''
      }
    },
    change(data){
        this.page.pageNumber = data
        this.LoadBoxCoWorkProcData(this.getreportUrl())
    },
    getreportUrl(){
      let url = '/spGetAccCustReceStatis'
      if (this.currentTabName=="Summary") {
        url = '/spGetAccCustReceGroup'
      }
      return url
    },
    // tab 切换事件
    TabsClickEvent(name) {
     this.currentTabName = name
     this.page.pageNumber = 1
     this.LoadBoxCoWorkProcData(this.getreportUrl())
    },
    //加载 数据
    LoadBoxCoWorkProcData(url) {
        this.tableBoxCoWorkProcData = []
        let params = {
            endDateTime:!!this.formDataInfo.endDateTime ?dayjs(this.formDataInfo.endDateTime).format('YYYY-MM-DD'):'',
            stratDateTime:!!this.formDataInfo.stratDateTime ?dayjs(this.formDataInfo.stratDateTime).format('YYYY-MM-DD'):'',
            bdYm:!!this.formDataInfo.bdYm ? dayjs(this.formDataInfo.bdYm).format('YYYYMM'):'',// 会计月份,
            coinId:this.formDataInfo.coinId,
            custIds:this.formDataInfo.custIds,
            workerId:this.formDataInfo.workerId,
        }
        let _self = this
        request.post(`/report/receiAccount${url}`,params,{pageNumber:this.page.pageNumber,pageSize:this.page.pageSize}).then(res=>{
             // 延迟赋值,不然数据还没有正确返回的情况下,无法绑定默认值
             if (res && res.records) {
               setTimeout(() => {
                  _self.page.total =Number(res.total)
                  // _self.page.pageSize =Number(res.size)
                  _self.tableBoxCoWorkProcData = res.records;
                }, 10);
             }
        })
    },
    // 通过参数查询数据列表
    searchDataBy() {
      //debugger
      this.page.pageNumber = 1
      this.LoadBoxCoWorkProcData(this.getreportUrl())
    }
  },
  created() {
    this.LoadBoxCoWorkProcData('/spGetAccCustReceStatis');
  },
  mounted() {}
};
</script>

<style>
.purPaperClass {
  margin-left: -46%;
}
.purPaperPoAnalyClass {
  width: 96%;
  margin: 0 auto;
}
.purDataClass {
  margin-left: 13%;
}
.edit-purPaperPoAnalyzSlave .ivu-col{
  height:32px;
}
.buttonMarginleft .ivu-form-item-content{
  margin-left: 36px !important;
}
</style>