
/**
 * @desc index 描述 所有.vue 公共方法 .vue 中 添加mixin:[name]
 *
 * 主要用于 table 数据 操作
 *
 * @author Andy Huang
 *
 * @created 2019/11/20 17:08:28
 */

// import config from '@/config'
import '../mixins/common.css'
import request from '@/libs/request'
import { getFormInitData } from './common'
export default {
  data () {
    return {
      who: '', // 动态指定编辑控件
      splitModel: 0.5,
      currrentRowItem: {
        rowName: '',
        rowId: ''
      }, // 当前选择列的基本信息 操作时 需要用
      isLoaddingDone: false, // 获取详细 是否获取完成
      functionParams: { // 清酒基础路径
        requestBaseUrl: '',
        uniqueId: '',
        requestColBaseUrl: 'sys/form/columns'
      },
      master_list_tableName: 'master_list_table', // 默认当前主表 REF 名称,不一致时,子类中修改
      showEditWindow: false, // 是否显示编辑窗体
      columns: [], // 表格数据列表
      tableFieldData: [], // 子表数据集
      tableFieldData2: [], // 二级子表数据集
      tableFieldColuns: [], // 子表数据列
      masterRowSelection: {}, // 当前选择行
      formDetailData: {}, // 当前表单详细数据,再点击"修改/编辑"的时候,functionBtnList.vue ,会查询详情 赋值 formDetailData
      action: 'add', // 当前操作 添加 编辑
      tableHeight: 0, // 表格高度
      queryParamsDefault: [], // 默认搜索配置
      formInitData: {}, // 表单数据化数据,包含数据列,编辑初始数据,查询字段,列表信息 MR.Yang 2019.12.26
      slaveRowselection: {}, // 保存子表被选中的行信息
      slaveSlaveRowselection: {}, // 保存第三层表都选中的行信息
      detailDisabled: false, // 详情禁用
      detailConvertUpdate: false, // 是否可以从编辑状态变为修改
      tableContextMenu: null// 主表表格右键菜单
    }
  },
  computed: {
    needToUpdate () {
      return this.$store.state.app.updataSubItem
    }

  },
  watch: {
    // 监控 是否需要刷新查询子表数据
    needToUpdate (newVal, oldVal) {
      // debugger
      if (newVal === true) {
        this.handleUpdateEvent()
        this.$store.commit('setUpdataSubItem', false)
      }
    },
    // 监控打开编辑窗口状态
    showEditWindow (n, o) {
      this.showEditWindowTigger(n)
    }
  },
  created () {
    this.comptuedTableHeight()
  },

  mounted () {
    let _self = this
    this.$nextTick(() => {
      setTimeout(() => {
        _self.loadContextMenu()
      }, 1000)
    })
  },
  methods: {
    // 双击详情窗口
    showDetailswindow(rowData, rowIndex, column){
      this.showEditWindow = true;
      this.action = 'detail';
      this.isLoaddingDone = true;
      this.detailDisabled = true;
      if (rowData.iisAudit===1 || rowData.status===0) {
        this.detailConvertUpdate = false
      }else{
        this.detailConvertUpdate = true
      }
      this.detailAction(rowData);
    },
    //加载详情数据
    detailAction(rowData) {
      let _self = this
      let url = `${this.functionParams.requestBaseUrl}/detail?${this.functionParams.uniqueId}=${rowData.id}`;
      request
        .post(url)
        .then(res => {
          _self.formDetailData = _self.resNumToStr(res);
          console.log( _self.formDetailData)
          // this.$emit("isLoaddingDone", true);
        })
        .catch(err => {
          // this.$emit("isLoaddingDone", true);
        });
    },
    // 统一修改返回数字为字符串,方便绑定0-1值 如:CHECKBOX.. Number.isInteger
    resNumToStr(res) {
      if (res) {
        if (res.master != null) {
          res.master = this.changeNumToStrItem(res.master);
        } else {
          res = this.changeNumToStrItem(res);
        }
        return res;
      }
    },
    // 将所有数字转换字符串,避免验证数据时,提示
    changeNumToStrItem(res) {
      let keyArr = Object.keys(res);
      keyArr.forEach(item => {
        if (Number.isFinite(res[item])) {
          res[item] = res[item] + "";
        }
      });
      return res;
    },
    // 子类中重新,确认当前是否可以删除,默认true可以删除,false 返回false 不可以删除
    canIDeleteRowItem () {
      // let  message = "当前数据,不可操作";
      // this.$Message.warning(message);
      return true
    },
    // 加载右键菜单实体
    loadContextMenu () {
      let _self = this
      let contextNemuObj = _self.$refs['contextMenuTarget']
      if (contextNemuObj) {
        _self.$store.commit('setContextMenuObj', contextNemuObj)
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
    // 自定义菜单功能,继承类中重写,与functionBtnList.vue 页面绑定
    customerAction (type, func) {
      // type:当前菜单,func:功能名称
    },
    showEditWindowTigger (n) {

    },
    // 更新操作,可以子类中继承重写需要的操作
    handleUpdateEvent () {
      // do something you want to update in subItem

    },
    // 数据查询 master_list_table 为 talbe refs='master_list_table'
    search (queryParams) {
      // 查询前,先清空子表数据
      this.checkMasterTableHasData()
      let masterTable = this.$refs[this.master_list_tableName]
      if (masterTable) {
        masterTable.search(queryParams)
      }
    },
    // 当前主表数据,返回给打印列表 查询打印列数
    getTableDataItems () {
      let masterTable = this.$refs[this.master_list_tableName]
      if (masterTable) {
        return masterTable.tableDataItems
      } else {
        return []
      }
    },
    // 清空子表数据,后再做其它查询
    checkMasterTableHasData () {
      let slaveTable = this.$refs['slave_list_table']
      if (slaveTable) {
        // 清空数据
        slaveTable.reset()
      }
    },
    // 清除选择项
    cleanSelectedItem () {
      this.masterRowSelection = {}
    },
    // 是否加载完成
    getLoaddingDone (isDone) {
      this.isLoaddingDone = isDone
    },
    // 添加成功 回调事件 刷新数据
    submitSuccess () {
      this.search()
    },
    // 当前选择行的ID
    getMasterSelectId () {
      if (Object.keys(this.masterRowSelection).length === 0) {
        this.$Message.warning('请选择需要操作的数据')
        return false
      }
      return this.masterRowSelection.id
    },
    // 当前选择行的Item,整ROW的数据,供打印配置信息需要
    getMasterSelectItem () {
      if (Object.keys(this.masterRowSelection).length === 0) {
        this.$Message.warning('请选择需要操作的数据')
        return false
      }
      return this.masterRowSelection
    },
    refresh () {
      this.$refs['master_list_table'].search()
    },
    // 数据双击
    rowDblclick () {
      // console.log('=====rowDblclick====')
    },
    comptuedTableHeight () {
      // 计算table高度
      let height = document.body.offsetHeight
      this.tableHeight = height - (118)
    },
    getFormInitData (formName) {
      getFormInitData(this.$store, formName).then(res => {
        this.formInitData = res
      }).catch(err => {
        console.log(err)
      })
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
  }
}
