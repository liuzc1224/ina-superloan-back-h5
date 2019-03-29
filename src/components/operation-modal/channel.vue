<template>
  <div v-bind:hidden="!showModal">
    <Card>
      <Modal v-model="showModal" :title="formValidate.id? $t('channel.modal.edit') : $t('channel.modal.add')"
             :mask-closable="false">
        <div slot="close">
          <Icon @click="cancelSubmit()" type="ios-close"/>
        </div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
          <FormItem :label="$t('channel.tabData.channelId')" prop="channelId">
            <Input v-model="formValidate.channelId" :placeholder="$t('channel.prompt.channelId')"></Input>
          </FormItem>
          <FormItem :label="$t('channel.tabData.channelName')" prop="channelName">
            <Input v-model="formValidate.channelName" :placeholder="$t('channel.prompt.channelName')"></Input>
          </FormItem>
          <FormItem :label="$t('channel.tabData.registerIp')">
            <Input v-model="formValidate.registerIp" :placeholder="$t('channel.prompt.registerIp')"></Input>
          </FormItem>
          <FormItem :label="$t('channel.tabData.applyIp')">
            <Input v-model="formValidate.applyIp" :placeholder="$t('channel.prompt.applyIp')"></Input>
          </FormItem>
          <FormItem :label="$t('channel.tabData.loanIp')">
            <Input v-model="formValidate.loanIp" :placeholder="$t('channel.prompt.loanIp')"></Input>
          </FormItem>
          <FormItem :label="$t('channel.tabData.status')" prop="status">
            <Select v-model="formValidate.status" class="search-select-item" :placeholder="$t('banner.prompt.status')">
              <Option v-for="item in $t('channel.status')" :value="item.value">{{item.desc}}</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="cancelSubmit()">{{$t('common.cancel')}}</Button>
          <Button type="primary" size="large" @click="handleSubmit('formValidate')">{{$t('common.submit')}}</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import { addChannel ,updateChannel} from '@/api/data'
  import {dateToString, getLoginInfo} from '@/libs/tools'
  import {sessionRead} from '@/libs/util'
  export default {
    name: "channel",
    props: ['editModal', 'chooseItem'],
    data() {
      return {
        formValidate: {
          id: '',
          channelId:'',
          channelName:'',
          registerIp:'',
          applyIp:'',
          loanIp:'',
          status:''
        },
        ruleValidate: {
          channelId: [{
            required: true,
            message: this.$t('channel.prompt.channelId'),
            trigger: 'change',
          }],
          channelName:[{
            required: true,
            message: this.$t('channel.prompt.channelName'),
            trigger: 'change',
          }],
          status: [{
            required: true,
            message: this.$t('channel.prompt.status'),
            trigger: 'change',
            type:'number'
          }],
        }
      }
    },
    methods: {
      handleSubmit() {
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            let loginInfo = sessionRead('loginInfo');
            let data=this.formValidate;
            if(data.id){
              updateChannel(data).then(res => {
                if (res.data.success) {
                  this.$Message.success(this.$t('common.editSuccess'))
                  this.$emit('editSuccess');
                  this.cancelSubmit();
                } else {
                  this.$Message.error(res.data.message)
                }
              })
            }else{
              addChannel(data).then(res => {
                if (res.data.success) {
                  this.$Message.success(this.$t('common.addSuccess'))
                  this.$emit('editSuccess');
                  this.cancelSubmit()
                } else {
                  this.$Message.error(res.data.message)
                }
              })
            }
          }
        })
      },
      cancelSubmit() {
        this.$emit('changeModal', false);
        this.$refs['formValidate'].resetFields();
        this.$refs.upload.init();
      },
    },
    mounted() {
      this.formValidate = this.chooseItem;
      this.imgUrl=this.chooseItem['bannerUrl'];
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

<style scoped>

</style>
