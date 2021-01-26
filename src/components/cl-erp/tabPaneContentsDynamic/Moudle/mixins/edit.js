/**
 * @desc index 描述 所有.vue 公共方法 .vue 中 添加mixin:[name]
 *
 * 主要用于 表单的的添加 删除  update mixins
 *
 * @author Andy Huang
 *
 * @created 2019/11/20 17:08:28
 */
// import AsyncValidator from 'async-validator'
// import config from '@/config'
import clTabs from '@/components/cl-erp/tabs'
import clTabPane from '@/components/cl-erp/tabs/pane'
import editWindow from '@/components/edit-window/edit-window'
import eTable from '@/components/e-table/e-table'
import request from '@/libs/request'
import Form from '@/components/form/form'
import { getFormInitData } from './common'
import InputNumber from '@/components/input-number'
let _ = require('lodash')
const  default_pageConfig = {
  pageNum:1,//(当前页),
  pageSize:10,//(每页显示条数)
  total:0,// 总条数
}
export default {
  data () {
    return {
      // 表格约定名称
      // firstTableRules: {},
      // firstTableColumn: [],
      firstTableData: [],

      // // 表格约定名称
      // secondTableRules: {},
      // secondTableColumn: [],
      secondTableData: [],

      // // 表格约定名称
      // thirdTableRules: {},
      // thirdTableColumn: [],
      thirdTableData: [],
      // 分页配置
      pageConfig:Object.assign({},default_pageConfig),
      // 客户 >>小数位格式化配置
      amountFormatConfig:{
        decimalPls: 2 , // 金额保留小数位 最大6
        carryMode:0, //金额进位方式:carryMode:0 四舍五入,1:只舍不进,2:只进不舍
        ctDot:2,// 单价小数位
        priceType:0 // 单价进位方式
      },
      // 供应商>>小数位格式化配置
      supplierPriceFormatConfig:{
        amtDot:2, //金额小数位
        ctDot:2,// 单价小数位
        carryMode:0 //进位方式:carryMode:0 四舍五入,1:只舍不进,2:只进不舍
      },
      formDataInfoName:'formDataInfo',// 编辑宽主题名称
      editWindowBoxHeight:0,// 编辑弹框高度
      isMasterAndSlave:false,// 是否主从表结构
      disableResetFields: false, // 是否屏蔽重置
      spinLoaddingText: '提交中...', // 加载SPin 提示信息
      updateId: -1, // 当前数据是否可以更新
      actionLableName: '增加', // 当前操作行为的标题
      actionSubtitle: '', // 副标题 当前操作页面 描述
      showWindow: false, // 是否显示窗体S
      requestBaseUrl: '', // 请求的基础路径
      formDataInfo: {}, // 表单的内容 ,在基础类中重写
      tableFieldInitData: {}, // 编辑子表数据
      tableFieldsValidator: {}, // 子表TABLE列验证规则
      initData: {},
      masterHeight: 0, // 表单高度
      otherHeight: 0, // 剩余高度
      datePickerOptions: { // 自定义时间快捷方式
        shortcuts: [
          {
            text: '当前时间',
            value () {
              return new Date()
            },
            onClick: (picker) => {
              // this.$Message.info('Click today');
            }
          }
          // {
          //     text: 'Yesterday',
          //     value () {
          //         const date = new Date();
          //         date.setTime(date.getTime() - 3600 * 1000 * 24);
          //         return date;
          //     },
          //     onClick: (picker) => {
          //         this.$Message.info('Click yesterday');
          //     }
          // },
          // {
          //     text: 'One week',
          //     value () {
          //         const date = new Date();
          //         date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
          //         return date;
          //     },
          //     onClick: (picker) => {
          //         this.$Message.info('Click a week ago');
          //     }
          // }
        ]
      }
    }
  },
  components: {
    InputNumber,
    Form,
    clTabs,
    clTabPane,
    editWindow,
    eTable
  },
  props: {
    // 是否加载完成
    isLoaddingDone: {
      type: Boolean,
      default: false
    },
    // 是否显示
    value: {
      type: Boolean,
      default: false
    },
    // 表单+表格列头 默认初始值  add by andy 2020/01/06
    formInitData: {
      default: () => {
        return {}
      }
    },
    // 表单详细 注意[点击"修改/编辑"的时候,functionBtnList.vue ,会查询详情 赋值 formDetailData]
    formDetailData: {
      default: () => {
        return {}
      }
    },
    // 当前操作 添加/更新
    action: {
      type: String,
      default: 'add'
    },
    // 当前操作模块 特殊处理 标记
    moduleName: {
      type: String,
      default: ''
    },
    detailDisabled: {
      type: Boolean,
      default: false
    },
    detailConvertUpdate: {
      type: Boolean,
      default: false
    }
  },
  watch: {
      // // 监控 快捷键远程保存 ctrl+s 保存,
      // isSavingNow(n,o){
      //    debugger
      //    if(!!n && n=='true'){
      //       if(isMasterAndSlave){
      //            // 主从表
      //        this.formTableDataSubmit()
      //       }else{
      //            // 单表
      //        this.formDataSubmit()
      //       }
      //       // 重置,每次点击都可以触发
      //       this.$store.commit('setIsSavingNow','')
      //    }
      //  },
    // 回调
    showWindow (n, o) {
      this.$emit('input', n)
      if (n) {
        this.fouceInFirstInput()
       
      }
    },
    // 是否实现当前窗体
    value (n, o) {
      // debugger
      this.showWindow = n
      // 修改标题
      this.resetTitle()
      // 清除动作/数据/缓存
      this.cleanOrResetData()
      // 关闭窗口时触发事件n
      if (!n) {
        this.closeActionTiggerMustDo()
        this.closeActionTigger()
      }
    },
    // 当前添加 OR 修改
    action (n, o) {

    },
   
    // 点击"修改/编辑"的时候,functionBtnList.vue ,会查询详情 赋值 formDetailData
    // 变化时 监控
    formDetailData (n, o) {
      this.isMasterAndSlave = false
      if (n && Object.keys(n).length > 0) {
        this.formDataInfo = n // 表单 需要更新的数据,子类中需要添加实际所需字段
        // fix 主从表字段无效问题
        if (n.master != null && n.master.id) {
          this.isMasterAndSlave = true
          this.updateId = n.master.id // 获取当前数据的ID
        } else if (n.id) { // 单表是没有master的
          this.updateId = n.id
        }
        // MR.Yang 数据初始化后,可能还需要再对数据处理,
        if (this.formDetailDataCall) {
          this.formDetailDataCall()
        }
      }
    }
  },
  computed: {
     // 是否保存中
     isSavingNow(){
      return this.$store.state.app.isSavingNow
    },
    tableInitData () {
      if (this.initData.initData) {
        return this.initData.initData
      }
      return {}
    }
  },
  methods: {
    // 重置页面信息
    resetPageConfig(){
      this.pageConfig = Object.assign({},default_pageConfig)
    },
      // 格式化客户>>金额
      formatAmountByTypeWith(_amount){
       let formatAmount= this.formatAmountByType(_amount,this.amountFormatConfig.decimalPls,this.amountFormatConfig.carryMode)
       return formatAmount
      },
       // 格式化客户>>单价
       formatCtByTypeWith(_amount){
        let formatAmount= this.formatAmountByType(_amount,this.amountFormatConfig.ctDot,this.amountFormatConfig.priceType)
        return formatAmount
       },
      // 格式化供应商>>金额
      formatSupplierAmtPrice(_amount){
        let formatAmount= this.formatAmountByType(_amount,this.supplierPriceFormatConfig.amtDot,this.supplierPriceFormatConfig.carryMode)
        return formatAmount
      },
      // 格式化供应商>>单价
      formatSupplierCtPrice(_amount){
        let formatAmount= this.formatAmountByType(_amount,this.supplierPriceFormatConfig.ctDot,this.supplierPriceFormatConfig.carryMode)
        return formatAmount
      },
    // 金额 保留小数位&进位方式(从客户选择信息哪里获取)
    // 进位方式:carryMode:0 四舍五入,1:只舍不进,2:只进不舍
    // 保留小数 _decimalPls 最大保留6位
    formatAmountByType(_amount,_decimalPls =2,_carryMode = 0){
        if (isNaN(_amount) || _amount == undefined || _amount == null) 
        { 
          return 0
        }
        if (isNaN(_decimalPls) || _decimalPls == undefined || _decimalPls == null) {
          _decimalPls = 2 
        }
        if (isNaN(_carryMode) || _carryMode == undefined || _carryMode == null) {
          _carryMode = 0 
        }
       _decimalPls = Math.pow(10,Number(_decimalPls))
      switch (Number(_carryMode)) {
        // 四舍五入
        case 0:
          _amount = Math.round(_amount * _decimalPls)/_decimalPls 
          break;
        // 只舍不进 Math.floor(-0.5) ;  //向下取整 得-1
        case 1:
          _amount = Math.floor(_amount * _decimalPls)/_decimalPls 
          break;
        // 只进不舍 Math.ceil(2.1) ;	//向上取整 得 3
        case 2:
          _amount = Math.ceil(_amount * _decimalPls)/_decimalPls  
          break;  
        default:
          _amount = Math.round(_amount * _decimalPls)/_decimalPls 
          break;
      }
      return _amount
    },
    //
    calEditWindowBoxHeight(){
      this.$nextTick(()=>{
          // 获取总高度
          let editWindowBoxObj = document.getElementById('editWindowBox');
          if(!!editWindowBoxObj){
            this.editWindowBoxHeight = editWindowBoxObj.offsetHeight
            console.log('editWindowBoxHeight===: '+this.editWindowBoxHeight)
          }
      })
    },
    // 聚焦到第一个可输入的编辑输入框
    fouceInFirstInput () {
      if (this.action === 'add') {
        this.$nextTick(() => {
          let inputConponents = this.$refs['firstFocusInput']
          if(!!!inputConponents){
            return
          }
          try {
            // 普通的input
            this.$refs['firstFocusInput'].focus()
          } catch (error) {
            try {
              // referenceField INPUT
              this.$refs['firstFocusInput'].$children[0].focus()
            } catch (error) {
             
              try {
                    // popup INPUT
                   this.$refs['firstFocusInput'].$children[0].$children[0].focus()
              } catch (error) {
                    //个别 popup INPUT
                   this.$refs['firstFocusInput'][0].$children[0].$children[0].focus()
              }
            
            }
          }
        })
      }
    },
    // 通用数据请求
    getDataByUrl (_url, requestDataObj) {
      return new Promise((resolve, reject) => {
        request.post(_url, requestDataObj).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getDataFromDictionaryBy (itemValue) {
      // 获取数据字典数据列表
      return new Promise((resolve, reject) => {
        request.get('/common/sys/dic/childList/' + itemValue, {}, {
          qt: 'pValue'
        }).then(res => {
          res.forEach(item => {
            item.dicValue = parseInt(item.dicValue)
          })
          resolve(res)
        })
      })
    },
    // 单表绑定 下拉框切换事件[静态数据查询]
    optionOnChange (itemObj) {
      // debugger
      if (itemObj) {
        this.formDataInfo[itemObj.key] = itemObj.value
      }
    },
    // 主从表绑定 下拉框切换事件[静态数据查询]
    optionOnChangeBy (itemObj) {
      // debugger
      if (itemObj) {
        this.formDataInfo.master[itemObj.key] = itemObj.value
      }
      this._optionOnChangeBy(itemObj)
    },
    // 主从表绑定 下拉框切换事件[静态数据查询]>>选择改变触发回调事件>>子类中重写
    _optionOnChangeBy(itemObj){

    },
    // 修改标题
    resetTitle () {
      // debugger
      this.actionLableName = '增加' + this.actionSubtitle
      if (this.action === 'update') {
        this.actionLableName = '修改' + this.actionSubtitle
      } else if (this.action === 'detail') {
        this.actionLableName = '查看' + this.actionSubtitle
      }
    },
    // 清除动作/数据/缓存
    cleanOrResetData () {
      if (this.action === 'add') {
        this.tableFieldInitData = {}
        this.HandleFormDataInfo()
      } else {
        this.updateActionTiggerEvent()
      }
      this.$nextTick(() => {
        this.openActionTigger()
      })
    },
    // 继承中修改 打开窗口时 触发事件
    openActionTigger () {

    },
    // 继承中修改 关闭窗口时 触发事件
    closeActionTigger () {
     
    },
    closeActionTiggerMustDo(){
      if (this.disableResetFields) {
        return
      }
      // fix 清除上次的错误提示 formDataInfo 为表单ref名称
      let resetForm = this.$refs[this.formDataInfoName]
      // 如果子表继承中,名称不一致 可以直接修改名称 his.formDataInfoName ='当前表单名称'
      if (resetForm) {
        resetForm.resetFields()
      }
      let tableReset = this.$refs['slave_list_table_edit']
      if (tableReset) {
        tableReset.reset()
      }
    },
    // 继承中修改 打开更新操作时 触发事件
    updateActionTiggerEvent () {

    },
    // 继承中修改 添加时候,清空数据,附加默认值
    HandleFormDataInfo () {
      // 因为每个模块的的字段不一样
    },
    // 提交主从表数据,延迟提交,防止个别计算来不及验证
    formTableDataSubmit () {
      let _self = this
      setTimeout(()=>{
        this.$refs['formDataInfo'].validate(valid => {
          if (!valid) {
            return
          }
          let result = this.$refs['tableFields'].validate()
          if (result) {
            return
          }
          _self.insertOrUpdateData()
        })
      },1000)
    },
    // 提交表单数据
    formDataSubmit () {
      let _self = this
      this.$refs['formDataInfo'].validate(valid => {
        if (valid) {
          if (_self.action === 'add') {
            _self.insertData()
          } else {
            _self.updateData()
          }
        }
      })
    },
    // 增加 or 更新 主从表数据
    insertOrUpdateData () {
      // debugger
      if (this.validateBeforePost()) {
        return
      }
      // debugger
      // let _self = this
      let url = `${this.requestBaseUrl}/saveOrUpdate`
      let data = this.resetformDataInfo(this.formDataInfo)
      request.post(url, data).then(res => {
        this.showWindow = false // 关闭当前编辑窗口
        this.tableFieldInitData = {
          // id: ""
        }
        this.$refs['tableFields'].reset()
        this.$store.commit('setUpdataSubItem', true) // 更新字表数据查询
        this.infoTips()
      })
    },
    // 增加 数据
    insertData () {
      if (this.validateBeforePost()) {
        return
      }
      let url = `${this.requestBaseUrl}/save`
      let data = this.resetAddformDataInfo(this.formDataInfo)
      request
        .post(url, data)
        .then(res => {
          this.infoTips()
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.spinLoaddingText = ''
        })
    },
    // 更新 数据
    updateData () {
      // debugger
      if (this.validateBeforePost()) {
        return
      }
      if (this.updateId === -1) {
        this.$Message.error('获取数据异常,请稍后重试!')
        return
      }
      let url = `${this.requestBaseUrl}/update?id=${this.updateId}`
      let data = this.resetformDataInfo(this.formDataInfo)
      request
        .post(url, data)
        .then(res => {
          this.infoTips()
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.spinLoaddingText = ''
        })
    },
    // 继承中修改,添加数据时,重置修改一些提交的数据
    resetAddformDataInfo (_data) {
      return _data
    },
    // 继承中修改,更新数据时,重置修改一些提交的数据
    resetformDataInfo (_data) {
      return _data
    },
    // 继承中修改,提交数据前 验证数据 ,默认 false 没有错误
    validateBeforePost () {
      return false
    },
    // 修改对象KEY 值 返回 修改后的对象
    coverObjectKeyToOtherKey (obj, oldKey, newKey) {
      let stringObj = JSON.stringify(obj) // 对象转换微字符串 修改字段
      stringObj = stringObj.replace(new RegExp(oldKey, 'g'), newKey) // 替换字段
      return JSON.parse(stringObj) // 转换微对象 返回
      // alert(str.replace(new RegExp(old_str,'gm'),new_str));
    },
    // 信息提示
    infoTips () {
      this.$Message.success('操作成功')
      if (this.action !== 'add') {
        // 组从表,需要查询更新字表数据查询
        this.showWindow = false // 更新时,关闭当前比较窗口
      }
      if (this.action === 'add') {
        this.showWindow = false // ,关闭当前窗口
        this.$refs['formDataInfo'].resetFields()
      }
      this.$emit('submit-success')
    },
    // 注册窗口事件
    registerEvent () {
      let _self = this // 赋值vue的this
      window.onresize = () => {
        // 调用methods中的事件
        _self.pageResize()
      }
    },
    // 触发窗口大小变化事件
    pageResize () {
      this.$nextTick(() => {
        this.getTabWindowHeight()
      })
    },
    // 获取当前TAB标签的实际高度
    getTabWindowHeight () {
      this.getMasterheight()
      // 因为使用V-SHOW 隐藏,实际还会占用高度,所以切换时,设置为0 或使用V-IF 可以不用那么麻烦,但性能较低
      if (this.$refs['masterHeight']) {
        this.masterHeight = this.$refs['masterHeight'].offsetHeight
       // console.log('masterHeight===:'+this.masterHeight)
      }
      if (this.$refs['otherHeight']) {
        this.otherHeight = this.$refs['otherHeight'].offsetHeight
      }
    },
    // 默认上部高度
    getMasterheight () {
      return 30
    },
    // 全屏加载
    fullLoading () {
      ViewUI.Spin.show({
        render: (h) => {
          return h('div', {
            style: {
              'background-color': 'rgba(0, 0, 0, 0.5)',
              'padding': '0.5rem',
              'border-radius': '0.3rem',
              'color': '#ffffff'
            }
          }, [
            h('Icon', {
              style: {
                'animation': 'ani-demo-spin 1s linear infinite'
              },
              props: {
                type: 'ios-loading',
                size: 24
              }
            }),
            h('div', '数据加载中,请稍等...')
          ])
        }
      })
    }
  },
  created () {
    getFormInitData(this.$store, this.formName).then(res => {
      this.initData = res
    })
  },
  mounted () {

  }
}
