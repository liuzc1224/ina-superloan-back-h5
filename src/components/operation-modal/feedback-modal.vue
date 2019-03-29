<template>
  <div>
    <Card>
      <Modal v-model="showModal" :title="formValidate.id? $t('feedbackRecord.editFeedback') : $t('feedbackRecord.addFeedback')" :mask-closable="false">
        <div slot="close">
          <Icon @click="cancelSubmit()" type="ios-close" />
        </div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" class="feedback-modal-form">
          <FormItem :label="$t('feedbackRecord.feedbackTime')" prop="createTimes" >
            <Input v-model="formValidate.createTimes" placeholder="请输入反馈时间" :disabled="true"></Input>
          </FormItem>
          <FormItem :label="$t('feedbackRecord.feedbackVersion')" prop="opinionVersion"> <!-- TODO 多语言 -->
            <Input v-model="formValidate.opinionVersion" placeholder="请输入反馈版本" :disabled="true"></Input>
          </FormItem>
          <FormItem :label="$t('feedbackRecord.feedbackTitle')" prop="opinionTheme">
            <Input v-model="formValidate.opinionTheme" placeholder="请输入反馈标题" :disabled="true"></Input>
          </FormItem>
          <FormItem :label="$t('feedbackRecord.feedbackContent')" prop="opinionContent">
            <Input v-model="formValidate.opinionContent" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入反馈内容" :disabled="true"></Input>
          </FormItem>
          <FormItem :label="$t('feedbackRecord.feedbackStatus')" prop="opinionStatus">
            <Select v-model="formValidate.opinionStatus" :placeholder="$t('feedbackRecord.feedbackStatusTip')">
              <Option :value="1">{{$t('feedbackRecord.unhandle')}}</Option>
              <Option :value="2">{{$t('feedbackRecord.handling')}}</Option>
              <Option :value="3">{{$t('feedbackRecord.handled')}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('feedbackRecord.opinionRemark')" prop="opinionRemark">
            <Input v-model="formValidate.opinionRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('feedbackRecord.opinionRemarkTip')"></Input>
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
import { editFeedbackInfo } from '@/api/data'
export default {
  name: 'FeedbackModal',
  props: ['editModal', 'chooseItem'],
  data () {
    return {
      formValidate: {
        createTimes: '',
        email: '',
        opinionTheme: '',
        opinionContent: '',
        opinionVersion: '',
        opinionStatus: '',
        opinionRemark: '',
        id: ''
      },
      ruleValidate: {
        
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          const submitData = {
            createTimes: this.formValidate.createTimes,
            email: this.formValidate.email,
            opinionTheme: this.formValidate.opinionTheme,
            opinionContent: this.formValidate.opinionContent,
            opinionVersion: this.formValidate.opinionVersion,
            opinionStatus: this.formValidate.opinionStatus,
            opinionRemark: this.formValidate.opinionRemark,
            id: this.formValidate.id,
          }
          editFeedbackInfo( submitData ).then(res => {
            if(res.data.success){
              this.$Message.success(this.$t('setUpPage.editSuccess'))
              this.$emit('editSuccess')
              this.cancelSubmit()
            }
          })
        } else {
          this.$Message.error(this.$t('setUpPage.validateError'))
        }
      })
    },
    cancelSubmit () {
      this.$refs['formValidate'].resetFields()
      this.$emit('changeModal', false)
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
.feedback-modal-form{
  .ivu-input[disabled]{
      background-color: #fff;
      color: #515a6e;
  }
}
</style>
