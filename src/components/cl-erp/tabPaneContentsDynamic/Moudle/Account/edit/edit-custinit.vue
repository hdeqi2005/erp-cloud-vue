<template>
  <div>
    <editWindow
      class="cl-edit-custinit"
      :title="actionLableName"
      v-model="showWindow"
      :fullscreen="false"
      width="80%"
      :loading="!isLoaddingDone"
      @on-ok="formDataSubmit()"
      :disabledSubmitBtn="disabledSubmitBtn"
    >
      <Form
        ref="formDataInfo"
        :show-message="true"
        :model="formDataInfo"
        :rules="ruleValidate"
        :label-width="100"
        :disabled="detailDisabled"
      >
         <Row type="flex">
          <Col span="12">
            <FormItem label="初始单号" prop="initNo">
              <Input disabled v-model="formDataInfo.initNo" maxlength="80" placeholder="初始单号"></Input>
            </FormItem>
          </Col>
           <Col span="12">
            <FormItem label="日期" prop="initDate">
              <DatePicker type="date" v-model="formDataInfo.initDate" :editable='false' :clearable='false' format="yyyy-MM-dd"></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="客户" prop="custCode">
            <!-- BoxDeliCustomerSingBox   -->
              <popup
                ref='firstFocusInput'
                v-model="formDataInfo.custCode"
                field-name="custCode"
                popup-name="CustomerCommonSingleBox"
                :fill-model.sync="formDataInfo"
                render-fields="custId,custCode,custName,taxRate,rate,taxType"
                from-fields="id,cusCode,cusName,taxRate,coinRate,taxTP"
                :suffix="true"
                :suffix-model="formDataInfo.custName"
                suffixModelName="custName" 
                @on-fill="valdate"
              />
            </FormItem>
          </Col>
          
          <Col span="12">
            <FormItem label="货币" prop="coinCode">
              <popup
                v-model="formDataInfo.coinCode"
                field-name="coinCode"
                popup-name="CoinSingleBox"
                :fill-model.sync="formDataInfo"
                render-fields="coinId,coinCode,coinName"
                from-fields="id,coinCode,coinName"
                :suffix="true"
                :suffix-model="formDataInfo.coinName"
                suffixModelName="coinName" 
                @on-fill="coinCodevaldate"
              />
            </FormItem>
          </Col>
          <Col span="24">
            <Row>
              <Col span="12">
                <FormItem label="税率" prop="taxRate">
                  <Input disabled type="number" v-model="formDataInfo.taxRate" maxlength="20" placeholder="税率"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="税别" prop="taxType">
                  <optionSearch
                   disabled
                    maxlength="20"
                    @onChange="optionOnChange"
                    :defaultItem="formDataInfo.taxType+''"
                    :loaddingDataWhen="showWindow"
                    query="taxTP"
                  />
                </FormItem>
              </Col>
            </Row>
          </Col>
         <Col span="12">
            <FormItem label="初始化金额" prop="initAmt">
              <inputNumber  style="width:100%" v-model="formDataInfo.initAmt" maxlength="12" placeholder="初始化金额"></inputNumber>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="备注" prop="remark">
              <Input v-model="formDataInfo.remark" maxlength="100" placeholder="备注"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </editWindow>
  </div>
</template>

<script>
/**
 * @desc edit-dept 描述
 * 所有重要 可以重用的方法 放在了基类,继承即可用重复使用 dyBaseMixins,
 * 可以根据需求重写所需的方法:
 *
 * @params 参数
 *
 * @return 返回
 *
 * @author Andy Huang
 *
 * @created 2019/11/20 17:07:54
 */
import inputNumber from "@/components/input-number";
import referenceField from "@/components/referenceField/referenceField";
import editBaseMixins from "../../mixins/edit";
import popup from "@/components/popup/popup";
import optionSearch from "../../components/optionSearch";
import request from "@/libs/request";
import dayjs from "dayjs";
import { deepCopy } from "view-design/src/utils/assist";
import { customValidator, uniqueValidator } from "@/libs/validator";
const default_formDataInfo = {
  coinCode: '',
  coinId: 0,
  coinName: '',
  custCode: '',
  custId: 0,
  custName: '',
  iisAudit: 0,
  initAmt: 0,
  initDate: dayjs().format('YYYY-MM-DD'),
  initNo: '',
  invoicedAmt: 0,
  notInvoicedAmt: 0,
  notWriteOffAmt: 0,
  rate: 0,
  remark: '',
  taxRate: 0,
  taxType:"0",
  taxTypeText: '',
  writeOffAmt: 0
}
export default {
  name: 'edit-custinit',
  mixins: [editBaseMixins],
  components: {
    optionSearch,
    popup,
    referenceField,
    inputNumber,
    deepCopy
  },
  props: {
    rowData: {
      type: Object,
      default: ''
    }
  },
  data () {
    return {
      disabledSubmitBtn: false, // 编辑框确认按钮是否禁用
      frommastername: 'accountCustInitFm',
      actionSubtitle: '客户财务初始化', // 当前操作副标题
      requestBaseUrl: '/account/custinit', // 请求 查询 操作的基础路径
      formDataInfo: deepCopy(default_formDataInfo), // 防止添加和更新数据提交发生冲突
      // 需要验证的数据
      ruleValidate: {
        custCode: [
          { required: true, message: '客户不能为空', trigger: 'blur' }
        ],
        coinCode: [
          { required: true, message: '货币不能为空', trigger: 'blur' }
        ]
      },
      cityCascader: [],
      cityCascaderCount: 0
    }
  },

  methods: {
    // 货币弹框数据填充回调事件
    coinCodevaldate () {
      this.$refs['formDataInfo'].validateField('coinCode', err => {
      })
    },
    // 客户弹框数据填充回调事件
    valdate (data) {
      let vladata = data[0].data
      let orignData = data[0].orignData
      if (vladata.custId != null) {
        this.formDataInfo.coinId = orignData.coinId
        this.formDataInfo.coinName = orignData.coinName
        this.formDataInfo.coinCode = orignData.coinCode
        this.coinCodevaldate()
      }
      this.$refs['formDataInfo'].validateField('custCode', err => {
      })
    },
    // 重写父类,添加时候,清空数据
    HandleFormDataInfo () {
      // debugger
      this.formDataInfo = deepCopy(default_formDataInfo);
      this.$refs.formDataInfo.resetFields()
    },
    // 继承中修改,添加数据时,重置修改一些提交的数据
    resetAddformDataInfo (_data) {
        _data.initDate = dayjs(_data.initDate).format("YYYY-MM-DD")+" 00:00:00"
        _data.notWriteOffAmt = JSON.parse(_data.initAmt)
      return _data
    },
    // 继承中修改,更新数据时,重置修改一些提交的数据
    resetformDataInfo (_data) {
      _data.initDate = dayjs(_data.initDate).format('YYYY-MM-DD')+" 00:00:00"
      _data.notWriteOffAmt = JSON.parse(_data.initAmt)
      return _data
    },
    // 关闭窗口触发
    // closeActionTigger () {
    //   this.formDataInfo = deepCopy(default_formDataInfo);
    // },
    // 打开窗口触发
    openActionTigger () {
      if (this.action != 'add') {
        if (this.rowData.invoicedAmt > 0) {
          this.disabledSubmitBtn = true
          return
        }
      }
      this.disabledSubmitBtn = false
    }
  }
}
</script>

<style>
.cl-edit-custinit .ivu-select-item {
  display: block;
}
.cl-edit-custinit .right-text {
  width: 160%;
}
</style>
