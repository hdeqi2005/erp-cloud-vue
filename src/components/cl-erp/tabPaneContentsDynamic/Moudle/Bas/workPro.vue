<template>
  <div class="cl-moudle">
    <htmlTemplate
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
            tabletitle="工序资料主表"
            :height="tableHeight / 2"
            ref="master_list_table"
            :columns-url="functionParams.requestColBaseUrl +'/workProcFm'"
            url="/bas/workPro/page"
            :pagination="true"
            @row-click="tableRowClick"
            name="workProcFm"
          ></vTable>

        </div>
        <div slot="bottom" :style="{ 'padding-top': '6px' }">
          <Tabs>
            <TabPane label="工序资料明细" name="name1">
              <vTable
                tabletitle="工序资料明细"
                :height="tableHeight / 2-40"
                ref="tableFieldRef"
                :table-data="tableFieldData"
                :columns-url="functionParams.requestColBaseUrl +'/workProcItemFm'"
                :pagination="false"
                name="workProcItemFm"
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
import editForm from './edit/edit-workPro'
import listBaseMixins from '../mixins/list'
import request from '@/libs/request'
export default {
  mixins: [listBaseMixins],
  components: {
    'editForm': function (resolve) {
      // 组件的异步加载
      require(['./edit/edit-workPro'], resolve)
    },
    editForm,
    htmlTemplate,
    vTable
  },
  data () {
    return {
      functionParams: {
        requestBaseUrl: '/bas/workPro',
        uniqueId: 'workProcId'
      },
      // 查询参数 ,注意格式
      queryParamsDefault: [
        {
          title: '编号',
          code: 'wpNo',
          wpNo: ''
        },
        {
          title: '名称',
          name: 'wpName$like',
          'wpName$like': ''
        }
      ],
      tableFieldColuns: []
    }
  },
  methods: {
    tableRowClick (rowData, rowIndex) {
      this.formDetailData = {} // 清除上次缓存数据 增加体验良好
      this.masterRowSelection = rowData
      if (rowData != null) {
        // debugger
        // 是否 确认 审核 反审核 删除 禁用等 提示标题 列数据
        this.currrentRowItem.rowName = rowData.wpNo + ' ' + rowData.wpName
      }
      if (this.masterRowSelection) {
        this.getItemDataById()
      }
    },
    // 获取工序资料明细
    getItemDataById () {
      let url = `/bas/workPro/item/list`
      let data = {
        wpId: this.masterRowSelection.id
      }
      let _self = this
      request.post(url, data).then(res => {
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
