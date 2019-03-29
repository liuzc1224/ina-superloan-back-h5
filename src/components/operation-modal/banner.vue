<template>
  <div v-bind:hidden="!showModal">
    <Card>
      <Modal v-model="showModal" :title="formValidate.id? $t('banner.modal.edit') : $t('banner.modal.add')"
             :mask-closable="false">
        <div slot="close">
          <Icon @click="cancelSubmit()" type="ios-close"/>
        </div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
          <FormItem :label="$t('banner.tabData.serialNumber')" prop="sortWeight">
            <Select v-model="formValidate.sortWeight" class="search-select-item" :placeholder="$t('banner.prompt.serialNumber')" :disabled="isAble">
              <Option v-for="item in numberMax" :value="item">{{item}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('banner.tabData.status')" prop="status">
            <Select v-model="formValidate.status" class="search-select-item" :placeholder="$t('banner.prompt.status')">
              <Option v-for="item in $t('banner.status')" :value="item.value">{{item.desc}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('banner.tabData.source')" prop="bannerSource">
            <Input v-model="formValidate.bannerSource" :placeholder="$t('banner.prompt.source')"></Input>
          </FormItem>
          <FormItem :label="$t('banner.tabData.banner')" prop="banner">
            <up-load
              ref="upload"
              :uploadType="`head`"
              :format="['jpg','jpeg','png']"
              :imgWidth="`50px`"
              :imgHeight="`50px`"
              :imgUrl="formValidate.bannerUrl"
              @getUrl="getImgUrl"
            >
            </up-load>
          </FormItem>
          <FormItem :label="$t('banner.tabData.description')" prop="bannerExplain">
            <Input v-model="formValidate.bannerExplain" :placeholder="$t('banner.prompt.description')"></Input>
          </FormItem>
          <FormItem :label="$t('banner.tabData.link')" prop="forwardUrl">
            <Input v-model="formValidate.forwardUrl" :placeholder="$t('banner.prompt.link')"></Input>
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
  import { addBanner ,updateBanner,imgUpload} from '@/api/data'
  import {dateToString, getLoginInfo} from '@/libs/tools'
  import {sessionRead} from '@/libs/util'
  import UpLoad from './upLoad'
  export default {
    name: "banner",
    components:{UpLoad},
    props: ['editModal', 'chooseItem','isAble','numberMax'],
    data() {
      return {
        formValidate: {
          id: '',
          sortWeight:'',
          bannerSource:'',
          bannerUrl:'',
          bannerExplain:'',
          forwardUrl:'',
          status:''
        },
        ruleValidate: {
          sortWeight: [{
            required: true,
            message: this.$t('banner.prompt.serialNumber'),
            trigger: 'change',
            type:'number'
          }],
          status: [{
            required: true,
            message: this.$t('banner.prompt.status'),
            trigger: 'change',
            type:'number'
          }],
          bannerSource: [{
            required: true,
            message: this.$t('banner.prompt.source'),
            trigger: 'blur',
          }],
          bannerUrl: [{
            required: true,
            message: this.$t('banner.prompt.banner'),
            trigger: 'change'
          }],
          bannerExplain: [{
            required: true,
            message: this.$t('banner.prompt.description'),
            trigger: 'blur',
          }],
          forwardUrl: [{
            required: true,
            message: this.$t('banner.prompt.link'),
            trigger: 'blur',
            type:'url'
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
              updateBanner(data).then(res => {
                if (res.data.success) {
                  this.$Message.success(this.$t('common.editSuccess'))
                  this.$emit('editSuccess');
                  this.cancelSubmit();
                } else {
                  this.$Message.error(res.data.message)
                }
              })
            }else{
              addBanner(data).then(res => {
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
      getImgUrl(file,avatar){
        let formData=new FormData();
        formData.append("multipartFile",file);
        imgUpload(formData).then(res => {
          if (res.data.success) {
            if(res.data.data){
              this.$Message.success(this.$t('common.imgSuccess'));
              this.formValidate.bannerUrl=res.data.data;
            }
          } else {
            this.$Message.error(res.data.message)
          }
        });
      },
      uploadImg(){

      }
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
