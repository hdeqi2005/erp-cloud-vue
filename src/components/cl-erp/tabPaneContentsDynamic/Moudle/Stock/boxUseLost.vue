<template>
  <div class="cl-moudle">
    <htmlTemplate
     ref="htmlTemplate"
      :currrentRowItem="currrentRowItem"
      @isLoaddingDone="getLoaddingDone"
      :requestBaseUrl="functionParams.requestBaseUrl"
      :uniqueId="functionParams.uniqueId"
      :queryParamsDefault="queryParamsDefault"
    >
    </htmlTemplate>
    <div ref="contextMenuTarget" class="content-container" :style="{ height: tableHeight + 'px' }">
      <Split :v-model="splitModel" mode="vertical">
        <div slot="top" class="demo-split-pane">
          <vTable :upDownMove="true"
            @row-dblclick="showDetailswindow"
            tabletitle="纸板用料报损"
            :height="tableHeight / 2"
            ref="master_list_table"
            :columns-url="functionParams.requestColBaseUrl + '/stockBoxUseLostFm'"
            url="/stock/boxUseLost/page"
            :pagination="true"
            @row-click="tableRowClick"
            name="stockBoxUseLostFm"
          ></vTable>
        </div>
        <div slot="bottom" :style="{ 'padding-top': '6px' }">
          <Tabs>
            <TabPane label="纸板用料报损明细" name="name1">
              <vTable
                tabletitle="纸箱用料报损明细"
                :height="tableHeight / 2 - 35"
                ref="tableFieldRef"
                :table-data="tableFieldData"
                :columns-url="functionParams.requestColBaseUrl + '/stockBoxUseLostItemFm'"
                :pagination="false"
                name="stockBoxUseLostItemFm"
              ></vTable>
            </TabPane>
          </Tabs>
        </div>
      </Split>
    </div>

    <editForm
     ref="editForm"
      :isLoaddingDone="isLoaddingDone"
      :form-detail-data="formDetailData"
      moduleName="worker"
      :action="action"
      @submit-success="search()"
      v-model="showEditWindow"
      :detailDisabled="detailDisabled"
      :detailConvertUpdate="detailConvertUpdate"
    />
  </div>
</template>
<script>
import vTable from '@/components/tables/vTable'
import htmlTemplate from '../components/htmlTemplate'
// import editForm from "./edit/edit-warehouse";
import listBaseMixins from '../mixins/list'
import request from '@/libs/request'
export default {
  mixins: [listBaseMixins],
  components: {
    'editForm': function (resolve) { // 组件的异步加载
      require(['./edit/edit-boxUseLost'], resolve)
    },

    htmlTemplate,
    vTable
  },
  data () {
    return {
      // who:'editForm', // 动态指定编辑控件
      functionParams: {
        requestBaseUrl: '/stock/boxUseLost',
        uniqueId: 'plId'
      },
      // 查询参数 ,注意格式
      queryParamsDefault: [
        {
          title: '报损人编号',
          code: 'workerCode',
          workerCode: ''
        },
        {
          title: '报损人名称',
          name: 'workerName$like',
          workerName$like: ''
        }

      ],
      columns: [

      ],
      // 纸箱入库明细
      tableFieldColuns: [

      ]

    }
  },
  methods: {
    tableRowClick (rowData, rowIndex) {
      // debugger
      this.formDetailData = {} // 清除上次缓存数据 增加体验良好
      this.masterRowSelection = rowData
      if (rowData != null) {
        // debugger
        // 是否 确认 审核 反审核 删除 禁用等 提示标题 列数据
        this.currrentRowItem.rowName = rowData.workerCode + ' ' + rowData.workerName
      }
      if (this.masterRowSelection) {
        this.getItemDataById()
      }
    },
    // 获取报损明细
    getItemDataById () {
      // debugger
      let url = `/stock/boxUseLost/item/list`
      let data = {
        plId: this.masterRowSelection.id
      }
      let _self = this
      request.post(url, data).then(res => {
        // debugger
        _self.tableFieldData = res
      })
    },
    // 重写父类方法, 更新操作
    handleUpdateEvent () {
      this.getItemDataById()
    }
  }
}
</script>

<style></style>
