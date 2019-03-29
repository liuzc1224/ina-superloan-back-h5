<template>
  <div v-bind:hidden="!showModal">
    <Card>
      <Modal v-model="showModal" :title="formValidate.id? $t('product.modal.edit') : $t('product.modal.add')" :mask-closable="false">
        <div slot="close">
          <Icon @click="cancelSubmit()" type="ios-close"/>
        </div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
          <FormItem :label="$t('product.tabData.serialNumber')" prop="sortWeight">
            <Select v-model="formValidate.sortWeight" class="search-select-item" :placeholder="$t('product.prompt.serialNumber')" :disabled="isAble">
              <Option v-for="(item, i) in numberMax" :value="item" :key="`prod0-${i}`">{{item}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('product.tabData.status')" prop="status">
            <Select v-model="formValidate.status" class="search-select-item" :placeholder="$t('product.prompt.status')">
              <Option v-for="(item, i) in $t('product.status')" :value="item.value" :key="`prod1-${i}`">{{item.desc}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('product.tabData.name')" prop="productName">
            <Input v-model="formValidate.productName" :placeholder="$t('product.prompt.name')"></Input>
          </FormItem>
          <FormItem :label="$t('product.tabData.whether')" prop="flag">
            <Select v-model="formValidate.flag" class="search-select-item" :placeholder="$t('product.prompt.whether')">
              <Option v-for="(item, i) in $t('product.state')" :value="item.value" :key="`state1-${i}`">{{item.desc}}</Option>
            </Select>
          </FormItem>


          <FormItem v-if="formValidate.flag===1" :label="$t('product.tabData.time')" prop="newDate">
            <DatePicker
              type="date"
              :placeholder="$t('product.prompt.time')"
              v-model="formValidate.newDate"
              style="width:100%;"
            ></DatePicker>
          </FormItem>


          <FormItem :label="$t('product.tabData.icon')" prop="bannerUrl">
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
          <FormItem :label="$t('product.tabData.max')" prop="loanMoney">
            <Input v-model="formValidate.loanMoney" :placeholder="$t('product.prompt.max')"></Input>
          </FormItem>
          <FormItem :label="$t('product.tabData.processDays')" prop="applyDay">
            <Input v-model="formValidate.applyDay" :placeholder="$t('product.prompt.processDays')"></Input>
          </FormItem>
          <FormItem :label="$t('product.tabData.loanDays')" prop="loanTerm">
            <Input v-model="formValidate.loanTerm" :placeholder="$t('product.prompt.loanDays')"></Input>
          </FormItem>
          <FormItem :label="$t('product.tabData.dailyInterestRate')" prop="interest">
            <Input v-model="formValidate.interest" :placeholder="$t('product.prompt.dailyInterestRate')"></Input>
          </FormItem>

          <FormItem :label="$t('product.tabData.feature')" prop="loanRemarks">
            <Input v-model="formValidate.loanRemarks" :placeholder="$t('product.prompt.feature')"></Input>
          </FormItem>
          <FormItem :label="$t('product.tabData.dateAdded')" prop="googleDate">
            <DatePicker
              type="date"
              :placeholder="$t('product.prompt.dateAdded')"
              v-model="formValidate.googleDate"
              style="width:100%;"
            ></DatePicker>
          </FormItem>
          <FormItem :label="$t('product.tabData.borrowingRequirements')">
          </FormItem>
          <FormItem
            v-for="(item,index) in formValidate.loanProductRequires"
            :key="index"
            :label="$t('product.tabData.claim')+(index+1)"
          >
            <Row>
              <Col span="18">
                <Input v-model="item.description" :placeholder="$t('product.prompt.claim')+(index+1)"></Input>
              </Col>
              <Col span="4" offset="1">
                <Button @click="handleRemove(index)">Delete</Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row>
              <Col span="6">
                <Button type="dashed" long @click="handleAdd" icon="md-add">Add</Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem :label="$t('product.tabData.process')">
          </FormItem>

          <FormItem :label="$t('product.tabData.description')" prop="loanFlow1">
            <Input v-model="formValidate.loanFlow1" :placeholder="$t('product.prompt.description')"></Input>
          </FormItem>
          <FormItem :label="$t('product.tabData.info')" prop="loanFlow2">
            <Input v-model="formValidate.loanFlow2" :placeholder="$t('product.prompt.info')"></Input>
          </FormItem>
          <FormItem :label="$t('product.tabData.reviewProcess')" prop="loanFlow3">
            <Input v-model="formValidate.loanFlow3" :placeholder="$t('product.prompt.reviewProcess')"></Input>
          </FormItem>
          <FormItem :label="$t('product.tabData.repayment')" prop="loanFlow4">
            <Input v-model="formValidate.loanFlow4" :placeholder="$t('product.prompt.repayment')"></Input>
          </FormItem>

          <FormItem :label="$t('product.tabData.get')" prop="forwardUrl">
            <Input v-model="formValidate.forwardUrl" :placeholder="$t('product.prompt.get')"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="cancelSubmit()">{{$t('setUpPage.cancel')}}</Button>
          <Button type="primary" size="large" @click="handleSubmit()">{{$t('setUpPage.submit')}}</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import {editMsgListInfo, addProduct,updateProduct,imgUpload} from '@/api/data'
  import {dateToString, getLoginInfo} from '@/libs/tools'
  import {sessionRead} from '@/libs/util'
  import UpLoad from './upLoad'
  import { formatDate } from "@/assets/js/date";
  export default {
    name: "product",
    components:{UpLoad},
    props: ['editModal', 'chooseItem','isAble','numberMax'],
    data() {
      return {
        formValidate: {
          id: null,
          sortWeight:null,
          productName:null,
          bannerUrl:null,
          loanMoney:'',
          applyDay:null,
          loanTerm:null,
          interest:null,
          googleDate:null,
          loanRemarks:null,
          forwardUrl:null,
          status:null,
          loanProductRequires:[],
          loanFlow1:null,
          loanFlow2:null,
          loanFlow3:null,
          loanFlow4:null,
          flag:null,
          newDate:null,
        },
        ruleValidate: {
          sortWeight: [{
            required: true,
            message: this.$t('product.prompt.serialNumber'),
            trigger: 'change',
            type:'number'
          }],
          status: [{
            required: true,
            message: this.$t('product.prompt.status'),
            trigger: 'change',
            type:'number'
          }],
          flag:[{
            required: true,
            message: this.$t('product.prompt.whether'),
            trigger: 'change',
            type:'number'
          }],
          productName: [{
            required: true,
            message: this.$t('product.prompt.name'),
            trigger: 'blur',
          }],
          bannerUrl: [{
            required: true,
            message: this.$t('product.prompt.icon'),
            trigger: 'blur'
          }],
          loanMoney: [{
            required: true,
            message: this.$t('product.prompt.max'),
            trigger: 'blur',
            type:'string'
          }],
          applyDay: [{
            required: true,
            message: this.$t('product.prompt.processDays'),
            trigger: 'blur',
          }],
          loanTerm: [{
            required: true,
            message: this.$t('product.prompt.loanDays'),
            trigger: 'blur',
          }],
          interest: [{
            required: true,
            message: this.$t('product.prompt.dailyInterestRate'),
            trigger: 'blur',
          }],
          loanRemarks: [{
            required: true,
            message: this.$t('product.prompt.feature'),
            trigger: 'blur',
          }],
          googleDate: [{
            required: true,
            message: this.$t('product.prompt.dateAdded'),
            trigger: 'blur',
            type:'date'
          }],
          forwardUrl: [{
            required: true,
            message: this.$t('product.prompt.get'),
            trigger: 'blur',
            type:'url'
          }],
          // loanFlow1:[{
          //   required: true,
          //   message: this.$t('product.prompt.description'),
          //   trigger: 'blur',
          // }],
          // loanFlow2:[{
          //   required: true,
          //   message: this.$t('product.prompt.info'),
          //   trigger: 'blur',
          // }],
          // loanFlow3:[{
          //   required: true,
          //   message: this.$t('product.prompt.reviewProcess'),
          //   trigger: 'blur',
          // }],
          // loanFlow4:[{
          //   required: true,
          //   message: this.$t('product.prompt.repayment'),
          //   trigger: 'blur',
          // }],
          newDate:[{
            required: true,
            message: this.$t('product.prompt.time'),
            trigger: 'blur',
            type:'date'
          }],
        }
      }
    },
    methods: {
      handleSubmit() {
        console.log(formatDate(new Date(this.formValidate.newDate), "yyyy-MM-dd"));
        console.log(formatDate(new Date(this.formValidate.googleDate), "yyyy-MM-dd"));
        let loanProductRequires=this.formValidate.loanProductRequires.filter(item=>{
          return item.description;
        })
        console.log(loanProductRequires)
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            if(this.formValidate.newDate){
              this.formValidate.newDate=formatDate(new Date(this.formValidate.newDate), "yyyy-MM-dd")
            }
            this.formValidate.googleDate=formatDate(new Date(this.formValidate.googleDate), "yyyy-MM-dd");
            let loginInfo = sessionRead('loginInfo');
            let data=this.formValidate;
            if(data.id){
              updateProduct(data).then(res => {
                if (res.data.success) {
                  this.$Message.success(this.$t('common.editSuccess'));
                  this.$emit('editSuccess');
                  this.cancelSubmit();
                } else {
                  this.$Message.error(res.data.message)
                }
              })
            }else{
              addProduct(data).then(res => {
                  if (res.data.success) {
                    this.$Message.success(this.$t('common.addSuccess'));
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
        console.log(formData);
        imgUpload(formData).then(res => {
          if (res.data.success) {
            if(res.data.data){
              this.$Message.success(this.$t('common.imgSuccess'));
              this.formValidate.bannerUrl=res.data.data;
            }
            // this.$Message.success(this.$t('setUpPage.addSuccess'))
            // this.$emit('editSuccess')
            // this.cancelSubmit()
          } else {
            this.$Message.error(res.data.message)
          }
        });
        // this.formValidate.icon=avatar;
        // this.formValidate.file=file;
      },
      uploadImg(){
        let formData=new FormData();
        // formData.append("file",file);
      },
      handleAdd () {
        let id=this.formValidate.id;
        this.formValidate.loanProductRequires.push(
          {
            description : '',
            productId:id
          }
        );
      },
      handleRemove (index) {
        this.formValidate.loanProductRequires.splice(index,1);
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
