<template>
  <div>
    <editWindow
      :title="actionLableName"
      v-model="showWindow"
      :fullscreen="false"
      width="50%"
      :loading="!isLoaddingDone"
      @on-ok="formDataSubmit()"
    >
      <Form
        ref="formDataInfo"
        :show-massage="false"
        :model="formDataInfo"
        :rules="ruleValidate"
        :label-width="80"
      >
        <FormItem label="单位编号" prop="utCode">
          <referenceField
           ref='firstFocusInput'
          :disabled="detailDisabled"
            v-model="formDataInfo.utCode"
            maxlength="20"
            placeholder="请输入物料编号"
            :form-name="formmastername"
            :id="formDataInfo.id"
          ></referenceField>
          <!-- <referenceField
            v-model="formDataInfo.resumeCode"
            maxlength="20"
            placeholder="请输入摘要说明"
            :form-name="formmastername"
            :id="formDataInfo.id"
          ></referenceField> -->
        </FormItem>
        <FormItem label="单位名称" prop="utName">
          <Input
          :disabled="detailDisabled"
            v-model="formDataInfo.utName"
            maxlength="20"
            placeholder="请输入物料名称"
          ></Input>
        </FormItem>

        <FormItem label="备注" prop="remark">
          <Input
            v-model="formDataInfo.remark"
            :disabled="detailDisabled"
            maxlength="100"
            placeholder="请输入备注..."
          ></Input>
        </FormItem>
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
import referenceField from '@/components/referenceField/referenceField'
import editBaseMixins from '../../mixins/edit'
import { customValidator, uniqueValidator } from '@/libs/validator'
const default_formDataInfo = {
  utName: '',
  utCode: '',
  remark: ''
}
export default {
  name: 'edit-unit',
  mixins: [editBaseMixins],
  components: { referenceField },

  data () {
    return {
      formmastername: 'unitFm',
      actionSubtitle: '计量单位', // 当前操作副标题
      requestBaseUrl: '/bas/unit', // 请求 查询 操作的基础路径
      formDataInfo: Object.assign({}, default_formDataInfo), // 防止添加和更新数据提交发生冲突
      // 需要验证的数据
      ruleValidate: {
        utCode: [
          { required: true, message: '物料编号不能为空', trigger: 'blur' },
          {
            validator: customValidator,
            trigger: 'blur',
            customRule: ['identifier'],
            fieldDesc: '物料编号'
          },
          {
            validator: uniqueValidator,
            trigger: 'blur',
            fieldDesc: '物料编号',
            params: {
              fieldName: 'utCode',
              formName: 'unitFm',
              id: () => {
                return this.formDataInfo.id
              }
            }
          }
        ],
        utName: [
          { required: true, message: '物料名称不能为空', trigger: 'blur' },
          {
            validator: customValidator,
            trigger: 'blur',
            customRule: ['toCDB', 'spaceStr'],
            fieldDesc: '物料名称'
          }
        ]
      }
    }
  },

  methods: {
    // 重写父类,添加时候,清空数据
    HandleFormDataInfo () {
      this.formDataInfo = Object.assign({}, default_formDataInfo)
    }
  }
}
</script>

<style></style>
