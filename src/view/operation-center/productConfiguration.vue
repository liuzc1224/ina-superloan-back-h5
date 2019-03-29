<template>
  <Row :gutter="10" class="product-config-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="100" inline>
          <Row>
            <FormItem :label="$t('product.tabData.name')">
              <Row>
                <Col span="24">
                  <Input v-model="searchForm.productName" :placeholder="$t('product.prompt.name')"></Input>
                </Col>
              </Row>
            </FormItem>
            <FormItem :label="$t('product.tabData.status')">
              <Row>
                <Col span="24">
                  <Select
                    v-model="searchForm.status"
                    class="search-select-item"
                    :placeholder="$t('product.prompt.status')"
                    style="width:200px"
                  >
                    <Option v-for="(item, i) in $t('product.status')" :value="item.value" :key="i">{{item.desc}}</Option>
                  </Select>
                </Col>
              </Row>
            </FormItem>
          </Row>
          <FormItem>
            <Button type="primary" @click="search">{{$t('common.search')}}</Button>
            <Button style="margin-left: 30px" @click="cleanSearch">{{$t('common.reset')}}</Button>
          </FormItem>
        </Form>
      </Card>

      <Card>
        <Button class="add-message-btn" type="primary" @click="showModal">{{$t('common.add')}}</Button>
        <!--v-on:changeModal="changeModal"  v-on:editSuccess="editSuccess"-->

        <Table stripe class="person-table" :columns="columns" :data="tableData" :loading="tableLoading" style="margin-top: 10px"/>

        <product-modal class="admin-modal" :editModal="editModal" :chooseItem="chooseItem" v-on:changeModal="changeModal" :numberMax="numberMax" :isAble="isAble" v-on:editSuccess="editSuccess"></product-modal>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;margin-bottom: 2px;">
            <Page
              :total="totalNumber"
              :current="currentPage"
              :page-size-opts="[10, 20, 30, 50]"
              @on-change="changePage"
              @on-page-size-change="pageSizeChange"
              show-elevator show-sizer show-total></Page>
          </div>
        </div>
      </Card>
    </i-col>
    <Modal :title="$t('product.tabData.icon')" v-model="isUrl" width="360">
      <div class="flex-center">
        <Spin fix v-if="imgLoading"></Spin>
        <img :src="url" alt="" class="img-show " ref="imageShow" style="width:100px;height:100px;display:block;margin:0 auto;">
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="iconClose">{{$t('cardManage.sure')}}</Button>
      </div>
    </Modal>
  </Row>
</template>

<script>
  import { formatDate } from "@/assets/js/date";
  import ProductModal from '_c/operation-modal/product.vue'
  import { getProduct ,getProductNumberMax ,updateProduct} from '@/api/data'
    export default {
      name: "productConfiguration",
      components: {
        ProductModal
      },
      data(){
        return {
          url:'',
          isUrl:false,
          imgLoading:false,
          editModal:false,
          tableLoading:false,
          pageSize: 10,
          totalNumber: 1,
          currentPage: 1,
          searchForm: {
            productName: null,
            status: null,
          },
          numberMax:null,
          isAble:null,
          chooseItem: {
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
          tableData: [],
          columns: [
            {
              title: this.$t('product.tabData.serialNumber'), key: 'sortWeight',align: 'center'
            },
            {
              title: this.$t('product.tabData.name'), key: 'productName',align: 'center',tooltip: true
            },
            {
              title: this.$t('product.tabData.icon'), key: 'bannerUrl',align: 'center',
              render:(h,params)=>{
                if(params.row.bannerUrl) {
                  return h('div', {
                    props: {},
                    style: {
                      color: '#57a3f3',
                      cursor: "pointer",
                    },
                    on: {
                      click: () => {
                        this.showIcon(params.row.bannerUrl);
                      }
                    }
                  }, this.$t('cardManage.check'))
                }
              }
            },
            {
              title: this.$t('product.tabData.max'), key: 'loanMoney',align: 'center',tooltip: true
            },
            {
              title: this.$t('product.tabData.processDays'), key: 'applyDay',align: 'center',tooltip: true
            },
            {
              title: this.$t('product.tabData.loanDays'), key: 'loanTerm',align: 'center',tooltip: true
            },
            {
              title: this.$t('product.tabData.dailyInterestRate'), key: 'interest',align: 'center',tooltip: true
            },
            {
              title: this.$t('product.tabData.feature'), key: 'loanRemarks',align: 'center',tooltip: true
            },
            {
              title: this.$t('product.tabData.dateAdded'), key: 'googleDate',align: 'center',
              render: function(h, params) {
                return h(
                  "p",
                  formatDate(new Date(this.row.modifyTime), "yyyy-MM-dd")
                );
              },
            },
            {
              title: this.$t('product.tabData.borrowingRequirements'), key: 'loanProductRequires',align: 'center',tooltip: true,
              render: function(h, params) {
                let length;
                if(params.row.loanProductRequires){
                  length=params.row.loanProductRequires.length
                }else{
                  length=0;
                }
                return h(
                  "span",
                  length
                );
              },
            },
            {
              title: this.$t('product.tabData.process'),align: 'center',tooltip: true,
              render: function(h, params) {
                let num=0;
                if(params.row.loanFlow1){
                  num++;
                }
                if(params.row.loanFlow2){
                  num++;
                }
                if(params.row.loanFlow3){
                  num++;
                }
                if(params.row.loanFlow4){
                  num++;
                }
                return h(
                  "span",
                  num
                );
              },
            },
            {
              title: this.$t('product.tabData.get'), key: 'forwardUrl',align: 'center',tooltip: true
            },
            {
              title: this.$t('product.tabData.status'), key: 'status',align: 'center',
              render:(h,params)=>{
                let data=this.$t('product.status');
                let type=data.filter(v => {
                  return v.value===params.row.status;
                });
                let state=(type.length>0 && type[0].desc) ? type[0].desc : "";
                return h('div',state);
              }
            },
            {
              title: this.$t('product.tabData.updateTime'), key: 'createTimeStr',align: 'center',tooltip: true,
            },
            {
              title: this.$t('common.operating'),
              key: 'action',
              width: 120,
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'text', size: 'large', icon: 'md-menu'
                    },
                    class: 'edit-btn',
                    style: {
                      backgroundColor: 'transparent',
                      color:'#57a3f3',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.editMessage(params)
                      }
                    }
                  }, this.$t('common.edit')),
                ])
              }
            }
          ]
        }
      },
      mounted: function () {
        this.getTable();
        let newImg = new Image();
        newImg.src ='';
        newImg.onload=()=>{ // 图片加载成功后把地址给原来的img
          this.url = newImg.src;
          this.imgLoading=false;
        }
      },
      methods:{
        search(){
          this.getTable();
        },
        cleanSearch(){
          this.$refs['searchForm'].resetFields();
          this.searchForm.productName='';
          this.searchForm.status='';
          this.getTable();
        },
        showModal () {
          getProductNumberMax().then(res => {
            if(res.data.success){
              if(res.data.data){
                let params={
                  row: {
                    id: null,
                    sortWeight:res.data.data+1,
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
                  }
                };
                this.modelItem(params);
                this.numberMax=res.data.data+1;
                this.editModal = true;
                this.isAble=true;
              }
            }else{
              this.$Message.error(res.data.message)
            }
          });
        },
        changeModal (param) {
          this.editModal = param;
          this.modelItem({'row': {}});
        },
        editMessage(params){
          this.isAble=false;
          getProductNumberMax().then(res => {
            if(res.data.success){
              if(res.data.data){
                this.modelItem(params);
                this.numberMax=res.data.data;
                this.editModal = true;
              }
            }else{
              this.$Message.error(res.data.message)
            }
          });
        },
        modelItem(params){
          let date="";
          if(params.row.googleDate){
            date=formatDate(new Date(params.row.googleDate), "yyyy-MM-dd")
          }
          let newDate="";
          if(params.row.newDate){
            newDate=formatDate(new Date(params.row.newDate), "yyyy-MM-dd")
          }
          this.chooseItem.id = params.row.id || '';
          this.chooseItem.sortWeight = params.row.sortWeight;
          this.chooseItem.productName = params.row.productName || '';
          this.chooseItem.bannerUrl = params.row.bannerUrl || '';
          this.chooseItem.loanMoney = params.row.loanMoney+"" || '';
          this.chooseItem.applyDay = params.row.applyDay || '';
          this.chooseItem.loanTerm = params.row.loanTerm || '';
          this.chooseItem.interest = params.row.interest || '';
          this.chooseItem.googleDate=date;
          this.chooseItem.loanRemarks = params.row.loanRemarks || '';
          this.chooseItem.forwardUrl = params.row.forwardUrl || '';
          this.chooseItem.status = params.row.status;

          this.chooseItem.loanFlow1 = params.row.loanFlow1 || '';
          this.chooseItem.loanFlow2= params.row.loanFlow2 || '';
          this.chooseItem.loanFlow3= params.row.loanFlow3 || '';
          this.chooseItem.loanFlow4= params.row.loanFlow4 || '';
          this.chooseItem.loanProductRequires =params.row.loanProductRequires || [];
          this.chooseItem.newDate = newDate;
          if(params.row.newDate){
            let dd=new Date(formatDate(new Date(), "yyyy-MM-dd"));
            let cc=new Date(newDate);
            if(dd.getTime()-cc.getTime()>0){
              this.chooseItem.flag=0;
            }else{
              this.chooseItem.flag=1;
            }
          }else{
            this.chooseItem.flag=0;
          }
        },
        editSuccess (param) {
          this.tableLoading = true;
          this.getTable()
        },
        changePage (params) {
          this.currentPage = params;
          this.getTable();
        },
        pageSizeChange (params) {
          this.pageSize = params;
          this.getTable()
        },
        getTable(){
          let params = {
            productName: this.searchForm.productName,
            status: this.searchForm.status,
            pageSize: this.pageSize,
            currentPage: this.currentPage,
          };
          params.columns = "status,sort_weight";
          params.orderBy = "true,false";
          this.tableLoading = this.tableLoading === false ? true : this.tableLoading;
          getProduct(params).then(res => {
            this.tableLoading = false;
            if(res.data.success){
              if( res.data.data && res.data.data.length !==0 ){
                this.tableData = res.data.data
              }else{
                this.tableData = []
              }
              this.currentPage = res.data.page.currentPage;
              this.pageSize = res.data.page.pageSize;
              this.totalNumber = res.data.page.totalNumber;
            }else{
              this.$Message.error(res.data.message)
            }
          })
        },
        showIcon(url){
          this.isUrl=true;
          this.imgLoading=true;
          // let newImg = new Image();
          console.log(url);
          // newImg.src =url;
          // newImg.onload=()=>{ // 图片加载成功后把地址给原来的img
            console.log('222');
            this.url = url;
            this.imgLoading=false;
          // }
        },
        iconClose(){
          this.url='';
          this.imgLoading=false;
          this.isUrl=false;
        },
      }
    }
</script>

<style lang="less">
.product-config-page{
  .search-card{
    margin-bottom: 20px;
  }
}
</style>
