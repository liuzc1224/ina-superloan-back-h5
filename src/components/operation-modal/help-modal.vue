<template>
  <div>
    <Card>
      <Modal v-model="showModal" :title="formValidate.id? $t('helpCenter.editHelp') : $t('helpCenter.addHelp')" :mask-closable="false">
        <div slot="close">
          <Icon @click="cancelSubmit()" type="ios-close" />
        </div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" class="help-modal">
          <FormItem :label="$t('helpCenter.textFlag')" prop="textFlag">
            <Select v-model="formValidate.textFlag" :placeholder="$t('helpCenter.selectFlag')" @on-change="changeFlag" :disabled="formValidate.id? true : false">
              <Option :value="1">{{$t('helpCenter.bill')}}</Option>
              <Option :value="2">{{$t('helpCenter.charge')}}</Option>
              <Option :value="3">{{$t('helpCenter.credit')}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('helpCenter.textOrder')" prop="textOrder">
            <Input v-model="formValidate.textOrder" placeholder="" :disabled="true" class="textOrderIpt"></Input>
          </FormItem>
          <FormItem :label="$t('helpCenter.isShow')" prop="isShow">
            <Select v-model="formValidate.isShow" :placeholder="$t('helpCenter.isShow')">
              <Option :value="1">{{$t('helpCenter.yes')}}</Option>
              <Option :value="0">{{$t('helpCenter.no')}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('helpCenter.question')" prop="textQuestion">
            <Input v-model="formValidate.textQuestion" :placeholder="$t('helpCenter.inputQuestion')"></Input>
          </FormItem>
          <FormItem :label="$t('helpCenter.answer')" prop="textAnswer">
            <Input v-model="formValidate.textAnswer" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('helpCenter.inputAnswer')"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="cancelSubmit()">{{$t('setUpPage.cancel')}}</Button>
          <Button type="primary" size="large" @click="handleSubmit('formValidate')">{{$t('setUpPage.submit')}}</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
import { editHelpInfo, addHelpInfo, getFlagInfo } from '@/api/data'
export default {
  name: 'MessageModal',
  props: ['editModal', 'chooseItem'],
  data () {
    return {
      formValidate: {
        id: null,
        textFlag: null,
        textOrder: '',
        textQuestion: '',
        textAnswer: '',
        isShow: '',
        modifyOperatorName: '',
        modifyOperatorId: '',
        modifyTime: ''
      },
      ruleValidate: {
        textFlag: [ { required: true, message: this.$t('helpCenter.selectFlag'), trigger: 'change', type: 'number' } ],
        textOrder: [  ],
        isShow: [ { required: true, message: this.$t('helpCenter.selectShow'), trigger: 'change', type: 'number' } ],
        textQuestion: [ { required: true, message: this.$t('helpCenter.inputQuestion'), trigger: 'blur' } ],
        textAnswer: [ { required: true, message: this.$t('helpCenter.inputAnswer'), trigger: 'blur' } ]
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          const submitData = {
            id: this.formValidate.id || 0,
            textFlag: this.formValidate.textFlag,
            textOrder: this.formValidate.textOrder,
            textQuestion: this.formValidate.textQuestion,
            textAnswer: this.formValidate.textAnswer,
            isShow: this.formValidate.isShow,
            modifyOperatorName: this.formValidate.modifyOperatorName,
            modifyOperatorId: this.formValidate.modifyOperatorId,
            modifyTime: this.formValidate.modifyTime
          }
          if(submitData.id){
            editHelpInfo( submitData ).then(res => {
              if(res.data.success){
                this.$Message.success(this.$t('setUpPage.editSuccess'))
                this.$emit('editSuccess')
                this.cancelSubmit()
              }else{
                this.$Message.error(res.data.message)
              }
            })
          }else{
            addHelpInfo( submitData ).then(res => {
              if(res.data.success){
                this.$Message.success(this.$t('setUpPage.addSuccess'))
                this.$emit('editSuccess')
                this.cancelSubmit()
              }else{
                this.$Message.error(res.data.message)
              }
            })
          }
        } else {
          this.$Message.error(this.$t('setUpPage.validateError'))
        }
      })
    },
    cancelSubmit () {
      this.$emit('changeModal', false)
      this.$refs['formValidate'].resetFields()
    },
    changeFlag (param) {
      if(param){
        getFlagInfo( param ).then(res => {
          if(res.data.success){
            this.formValidate.textOrder = res.data.data
          }
        })
      }
    }
  },
  mounted () {
    this.formValidate = this.chooseItem
  },
  computed: {
    showModal: {
      get: function () {
        return this.editModal
      },
      set: function () {
      }
    }
  }
}
</script>

<style lang="less">
.help-modal{
  .ivu-form-item{
    .ivu-input[disabled],.ivu-select-disabled .ivu-select-selection{
      background-color: #fff;
      color: #515a6e;
    }
  }
}
</style>
