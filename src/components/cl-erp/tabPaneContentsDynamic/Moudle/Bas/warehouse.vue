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
            tabletitle="仓库主表"
            :height="tableHeight / 2"
            ref="master_list_table"
           :columns-url="functionParams.requestColBaseUrl + '/warehouseFm'"
            url="/bas/warehouse/page"
            :pagination="true"
            @row-click="tableRowClick"
            name="warehouseFm"
          ></vTable>
        </div>
        <div slot="bottom" :style="{ 'padding-top': '6px' }">
          <Tabs>
            <TabPane label="仓位信息" name="name1">
              <vTable
                tabletitle="仓位信息"
                :height="tableHeight / 2"
                ref="tableFieldRef"
                :table-data="tableFieldData"
                :columns-url="functionParams.requestColBaseUrl + '/wareHouseItemFm'"
                :pagination="false"
                name="wareHouseItemFm"
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
    editForm: function (resolve) {
      // 组件的异步加载
      require(['./edit/edit-warehouse'], resolve)
    },
    htmlTemplate,
    vTable
  },
  data () {
    return {
      // who:'editForm', // 动态指定编辑控件
      functionParams: {
        requestBaseUrl: '/bas/warehouse',
        uniqueId: 'wareHouseId'
      },
      // 查询参数 ,注意格式
      queryParamsDefault: [
        {
          title: '仓库编号',
          code: 'whCode',
          whCode: ''
        },
        {
          title: '仓库名称',
          name: 'whName$like',
          'whName$like': ''
        }
      ],
      columns: [
        {
          title: '仓库编号',
          key: 'whCode',
          align: 'center'
        },
        {
          title: '仓库名称',
          key: 'whName',
          align: 'center'
        },
        {
          title: '仓库类型',
          key: 'whType',
          align: 'center'
        },
        {
          title: '备注',
          key: 'remark',
          align: 'center'
        },
        {
          title: '审核状态',
          key: 'iisAudit',
          align: 'center'
        },
        {
          title: '状态',
          key: 'status',
          align: 'center'
        },
        {
          title: '创建人',
          key: 'createUser',
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '修改人',
          key: 'updateUser',
          align: 'center'
        },
        {
          title: '修改时间',
          key: 'updateTime',
          align: 'center'
        },
        {
          title: '审核人',
          key: 'auditUser',
          align: 'center'
        },
        {
          title: '审核时间',
          key: 'auditTime',
          align: 'center'
        }
      ],
      tableFieldColuns: [
        {
          title: '仓位编号',
          key: 'wsCode',
          align: 'center'
        },
        {
          title: '仓位名称',
          key: 'wsName',
          align: 'center'
        },
        {
          title: '备注',
          key: 'remark',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    tableRowClick (rowData, rowIndex) {
      this.formDetailData = {} // 清除上次缓存数据 增加体验良好
      this.masterRowSelection = rowData
      if (rowData != null) {
        // debugger
        // 是否 确认 审核 反审核 删除 禁用等 提示标题 列数据
        this.currrentRowItem.rowName = rowData.whCode + ' ' + rowData.whName
      }
      if (this.masterRowSelection) {
        this.getItemDataById()
      }
    },
    // 获取仓位数据
    getItemDataById () {
      // debugger
      let url = `/bas/warehouse/item/list`
      let data = {
        whId: this.masterRowSelection.id
      }
      let _self = this
      request.post(url, data).then(res => {
        // debugger
        _self.tableFieldData = res
      })
    },
    // 重写父类方法, 更新操作
    handleUpdateEvent () {
      debugger
      this.getItemDataById()
    }
  }
}
</script>

<style></style>
