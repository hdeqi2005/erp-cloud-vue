<template>
    <div class="paramsSettingBox">
           <div class="paramsSettingItem downsideBox">
                <div class="downsideItem leftContentBox">
                     <div class="leftContentItem paramsTitle">
                       <span>参数分类名称</span>
                     </div>
                     <div class="leftContentItem datalist">
                        <!-- 参数ID 列表 -->
                        <ul>
                           <li :class="[currentParamsId == item.dicValue?'selectdActive':'']"  @click="paramsClickEvent(item.dicValue)" :key="index" v-for="(item,index) in paramGroupList">{{item.dicLabel}}</li>
                         </ul>
                     </div>
                </div>
                <div class="downsideItem rightContentBox">
                     <div class="rightContentItem contentShowBox">
                          <!-- 内容显示区域 -->
                          <div v-if="tabContent['checkbox'] && tabContent['checkbox'].length > 0 "  class="contentShowItem checkBoxListBox">
                              <div v-for="(item, index) in tabContent['checkbox']" :key="index" class="checkBoxListItem">
                                    <div class="checkBoxListSubItem descInfo"> <span>{{item.paramName}}</span></div>
                                     <div class="checkBoxListSubItem checkBoxComp"> <Checkbox true-value="1" false-value="0"  style="margin:0 10px;" size="small" v-model="item.paramValue"><Icon type="ios-add" size=0 /> </Checkbox></div>

                              </div>
                         </div>
                          <div v-if="tabContent['select'] && tabContent['select'].length > 0 "  class="contentShowItem selectListBox">
                            <div  v-for="(item, index) in tabContent['select']" :key="index" class="selectListItem">
                                       <div class="selectListSubItem descInfo">
                                          <span>{{item.paramName}}</span>
                                      </div>
                                      <div class="selectListSubItem">
                                          <Select size="small"
                                          style="width:180px;margin:0 10px;"
                                        v-model="item.paramValue"
                                        :placeholder="`请选择${item.paramName}`"
                                      >
                                        <Option :key="index" v-for="(item, index) in item.paramSelectValue.split(',')" :value="item">{{item}}</Option>
                                      </Select>
                                      </div>

                            </div>

                         </div>
                          <div v-if="tabContent['text'] && tabContent['text'].length > 0 " class="contentShowItem textListBox">
                             <div v-for="(item, index) in tabContent['text']" :key="index"  class="textListBoxItemBox">
                                 <div class="textListItem descInfo">
                                   <span>{{item.paramName}}</span>
                                </div>
                                <div class="textListItem">
                                    <Input style="width:180px;margin:0 10px;" size="small" maxlength="40" v-model="item.paramValue" :placeholder="`请输入${item.paramName}`"/>
                                </div>
                            </div>
                         </div>

                     </div>
                     <div class="rightContentItem btnListBox">
                           <div class="btnListItem">
                               <Button :loading="isLoadding" @click="save" :disabled="!Object.keys(tabContent).length>0" type="primary">
                                 <Icon type="ios-arrow-down" />
                                      保存
                                </Button>
                           </div>
                     </div>
                </div>
            </div>
    </div>
</template>
<script>
import request from '@/libs/request'
import sysBaseMixin from '../mixins/index'
let _ = require('lodash')
export default {
  name: 'paramConfig',
  mixins: [sysBaseMixin],
  data () {
    return {
      isLoadding: false, // 是否提交数据中
      currentParamsId: 0, // 当前选择的参数ID
      paramGroupList: [], // 系统设置 参数分类名称
      tabContent: {}// 对应系统参数ID 的内容
    }
  },
  created () {
    this.loadSysParamGroup()
    this.getTabContentById() // 默认查询
  },
  methods: {
    // 修改保存
    save () {
      // debugger
      let url = `/sys/param/value/updateBatch`
      let dataList = []
      this.isLoadding = true
      if (this.tabContent['checkbox']) {
        dataList.push(...this.tabContent['checkbox'])
      }
      if (this.tabContent['select']) {
        dataList.push(...this.tabContent['select'])
      }
      if (this.tabContent['text']) {
        dataList.push(...this.tabContent['text'])
      }
      let data = {
        sysParamValues: this.formatPostData(dataList)
      }
      request.post(url, data).then(res => {
        this.isLoadding = false
        this.$Message.success('操作成功')
      })
    },
    // 格式化更新的数据,对应接口模式
    formatPostData (itemList) {
      let newPostArray = itemList.map((item) => {
        let formatItem = {
          'id': item.id,
          'paramValue': item.paramValue
        }

        return formatItem
      })
      return newPostArray
    },
    // 参数点击事件查询
    paramsClickEvent (paramsId) {
      this.currentParamsId = paramsId
      // console.log('paramsClickEvent: '+ paramsId)
      this.getTabContentById() // 根据参数查询
    },
    // 加载系统参数列表
    loadSysParamGroup () {
      let typeParams = 'paramGroup'
      this.getDataFromDictionaryBy(typeParams).then(res => {
        // console.log(JSON.stringify(res))
        this.paramGroupList = res
      })
    },
    // 获取对应的tab内容
    getTabContentById () {
      this.isLoadding = true
      let url = `sys/param/value/list`
      let data = {
        paramGroup: this.currentParamsId
      }
      request.post(url, data).then(res => {
        this.isLoadding = false
        let dataFormat = _.groupBy(res, 'paramControl') // 就可以实现按paramControl分组了。
        this.tabContent = dataFormat
      })
    }
  }
}
</script>

<style lang="scss">
    .paramsSettingBox{
        display: flex;
        flex-direction: column;
        width: 100vw;
        height:calc(100vh - 78px);// auto; //calc(100vh - 78px);//
        min-height: 600px;
        background: white;
        .paramsSettingItem{
          &.downsideBox{
             flex:1px;
             margin:10px;
             border:1px solid #ccc;
             display: flex;
             flex-direction: row;
             .downsideItem{
               &.leftContentBox{
                 width: 15%;
                 border-right:1px solid #ccc;
                 display: flex;
                 flex-direction:column;
                 .leftContentItem{
                   &.paramsTitle{
                     line-height: 2em;
                     text-align: center;
                     height: 30px;
                     background: #293CBF ;
                     color: white;
                   }
                   &.datalist{
                     flex:1;
                      ul{
                         height: 550px;
                         overflow-y: auto;
                         display: flex;
                         flex-direction: column;
                         padding-left:10px;
                         list-style: none;
                         //border:1px solid red;
                         li{
                           cursor:pointer;
                           border-bottom:1px solid #ccc;
                         }
                      }
                      .selectdActive{
                        background: #ccc;
                        color: black;
                      }
                   }

                 }

               }
               &.rightContentBox{
                 flex:1;
                 display: flex;
                 flex-direction: column;
                  .rightContentItem{
                    &.contentShowBox{
                       display: flex;
                       flex-direction: column;
                      flex:1;
                      .contentShowItem{
                         border-bottom:1px solid #ccc;
                        &.checkBoxListBox{
                          display: flex;
                          flex-direction: row;
                          flex-wrap: wrap;
                           margin-top: 10px;
                          .checkBoxListItem{
                           // border:1px solid purple;
                             width: 33.33%;
                             height: 35px;
                             display: flex;
                             .checkBoxListSubItem{
                                //width:50%;

                               &.descInfo{
                                // border:1px solid red;
                                   width:auto;
                                   min-width:50% ;
                                   text-align: right;
                               }
                               &.checkBoxComp{
                                 //border:1px solid olive;
                                  //width:auto;
                                  text-align: left;
                               }
                             }
                           //
                          }
                        }
                        &.selectListBox{
                           display: flex;
                           flex-direction: row;
                           flex-wrap: wrap;
                           margin-top: 10px;
                           // border-bottom:1px solid red;
                           .selectListItem{
                               display: flex;
                               width: 33.33%;
                               .selectListSubItem{
                                 height: 35px;
                                 //border:1px solid red;
                                 &.descInfo{
                                   width: 50%;
                                   text-align: right;
                                 }
                               }
                           }
                        }
                        &.textListBox{
                           border-bottom:none;
                           display: flex;
                           flex-direction: row;
                           flex-wrap: wrap;
                           margin-top: 10px;
                          .textListBoxItemBox{
                             width:33.33%;
                             display: flex;
                             flex-direction: row;
                             .textListItem{
                               width: 40%;
                               height: 35px;
                                &.descInfo{
                                   width:auto;
                                   min-width:50% ;
                                   text-align: right;
                                 }
                             }
                          }
                        }
                      }
                    }
                    &.btnListBox{
                      border-top:1px solid #ccc;
                      height: 50px;
                      display: flex;
                      justify-content: flex-end;
                      align-items: center;
                      .btnListItem{
                        margin: 0 10px;
                      }
                    }
                  }
               }
             }
          }

        }

    }
</style>
