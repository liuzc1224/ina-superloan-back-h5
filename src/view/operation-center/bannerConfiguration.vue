<template>
  <Row :gutter="10" class="banner-config-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <Row>
              <FormItem :label="$t('banner.tabData.source')">
                <Row>
                  <Col span="24">
                    <Input
                      v-model="searchForm.bannerSource"
                      :placeholder="$t('banner.prompt.source')"
                    ></Input>
                  </Col>
                </Row>
              </FormItem>
              <FormItem :label="$t('banner.tabData.status')">
                <Row>
                  <Col span="24">
                    <Select
                      v-model="searchForm.status"
                      class="search-select-item"
                      :placeholder="$t('banner.prompt.status')"
                      style="width:200px"
                    >
                      <Option v-for="(item, i) in $t('banner.status')" :value="item.value" :key="i">{{item.desc}}</Option>
                    </Select>
                  </Col>
                </Row>
              </FormItem>
            </Row>
            <FormItem>
              <Button type="primary" @click="search">{{$t('common.search')}}</Button>
              <Button style="margin-left: 30px" @click="cleanSearch">{{$t('common.reset')}}</Button>
            </FormItem>
          </Row>
        </Form>
      </Card>

      <Card>
        <Button class="add-message-btn" type="primary" @click="showModal">{{$t('common.add')}}</Button>
        <!--v-on:changeModal="changeModal"  v-on:editSuccess="editSuccess"-->
        <banner-modal
          class="admin-modal"
          :editModal="editModal"
          :chooseItem="chooseItem"
          v-on:changeModal="changeModal"
          :numberMax="numberMax"
          :isAble="isAble"
          v-on:editSuccess="editSuccess"
        ></banner-modal>

        <Table
          stripe
          class="person-table"
          :columns="columns"
          :data="tableData"
          :loading="tableLoading"
          style="margin-top: 10px"
        />

        <!--<Modal v-model="deleteModal" :title="$t('setUpPage.deleteTitle')" @on-ok="deleteItem">-->
        <!--<p>{{$t('setUpPage.deleteTip')}}</p>-->
        <!--</Modal>-->
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;margin-bottom: 2px;">
            <Page
              :total="totalNumber"
              :current="currentPage"
              :page-size-opts="[10, 20, 30, 50]"
              @on-change="changePage"
              @on-page-size-change="pageSizeChange"
              show-elevator
              show-sizer
              show-total
            ></Page>
          </div>
        </div>
      </Card>
    </i-col>
    <Modal :title="$t('banner.tabData.banner')" v-model="isUrl" width="360">
      <div class="flex-center">
        <Spin fix v-if="imgLoading"></Spin>
        <img
          :src="url"
          alt
          class="img-show"
          ref="imageShow"
          style="width:100px;height:100px;display:block;margin:0 auto;"
        >
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="iconClose">{{$t('cardManage.sure')}}</Button>
      </div>
    </Modal>
  </Row>
</template>

<script>
import BannerModal from "_c/operation-modal/banner.vue";
import { getBanner, getBannerNumberMax, updateBanner } from "@/api/data";
export default {
  name: "bannerConfiguration",
  components: {
    BannerModal
  },
  data() {
    return {
      numberMax: null,
      isAble: null,
      url: "",
      isUrl: false,
      imgLoading: false,
      editModal: false,
      tableLoading: false,
      pageSize: 10,
      totalNumber: 1,
      currentPage: 1,
      searchForm: {
        bannerSource: null,
        status: null
      },
      chooseItem: {
        id: "",
        sortWeight: "",
        bannerSource: "",
        bannerUrl: "",
        bannerExplain: "",
        forwardUrl: "",
        status: ""
      },
      tableData: [],
      columns: [
        {
          title: this.$t("banner.tabData.serialNumber"),
          key: "sortWeight",
          align: "center"
        },
        {
          title: this.$t("banner.tabData.source"),
          key: "bannerSource",
          align: "center",
          tooltip: true
        },
        {
          title: this.$t("banner.tabData.banner"),
          key: "bannerUrl",
          align: "center",
          render: (h, params) => {
            if (params.row.bannerUrl) {
              return h(
                "div",
                {
                  props: {},
                  style: {
                    color: "#57a3f3",
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.showIcon(params.row.bannerUrl);
                    }
                  }
                },
                this.$t("cardManage.check")
              );
            }
          }
        },
        {
          title: this.$t("banner.tabData.description"),
          key: "bannerExplain",
          align: "center",
          tooltip: true
        },
        {
          title: this.$t("banner.tabData.link"),
          key: "forwardUrl",
          align: "center",
          tooltip: true
        },
        {
          title: this.$t("banner.tabData.status"),
          key: "status",
          align: "center",
          render: (h, params) => {
            let data = this.$t("banner.status");
            let type = data.filter(v => {
              return v.value === params.row.status;
            });
            let state = type.length > 0 && type[0].desc ? type[0].desc : "";
            return h("div", state);
          }
        },
        {
          title: this.$t("banner.tabData.updateTime"),
          key: "modifyTimeStr",
          align: "center",
          tooltip: true
        },
        {
          title: this.$t("common.operating"),
          key: "action",
          width: 120,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "large",
                    icon: "md-menu"
                  },
                  class: "edit-btn",
                  style: {
                    backgroundColor: 'transparent',
                    color: "#57a3f3",
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.editMessage(params);
                    }
                  }
                }, this.$t('common.operating')),
              ])
            }
          }
        ]
      }
    },
    mounted: function () {
      this.getTable();
      let newImg = new Image();
      console.log('1');
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
        this.searchForm.bannerSource='';
        this.searchForm.status='';
        this.getTable();
      },
      showModal () {
        getBannerNumberMax().then(res => {
          if(res.data.success){
            if(res.data.data){
              let params={
                row: {
                  id: null,
                  sortWeight:res.data.data+1,
                  bannerSource:null,
                  bannerUrl:null,
                  bannerExplain:null,
                  forwardUrl:null,
                  status:null,
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
      changeModal(param) {
        console.log("asfass")
        this.editModal = param;
        this.modelItem({'row': {}});
      },
      editMessage(params){
        console.log(params);
        this.isAble=false;
        getBannerNumberMax().then(res => {
          if(res.data.success){
            if(res.data.data){
              console.log(res.data.data+"??????????????");
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
        this.chooseItem.id = params.row.id || '';
        this.chooseItem.sortWeight = params.row.sortWeight;
        this.chooseItem.bannerSource = params.row.bannerSource;
        this.chooseItem.bannerUrl = params.row.bannerUrl;
        this.chooseItem.bannerExplain = params.row.bannerExplain;
        this.chooseItem.forwardUrl = params.row.forwardUrl;
        this.chooseItem.status = params.row.status;
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
          bannerSource: this.searchForm.bannerSource,
          status: this.searchForm.status,
          pageSize: this.pageSize,
          currentPage: this.currentPage,
        };
        params.columns = "status,sort_weight";
        params.orderBy = "true,false";
        console.log(params);

        this.tableLoading = this.tableLoading === false ? true : this.tableLoading;
        getBanner(params).then(res => {
          this.tableLoading = false;
          if(res.data.success){
            console.log(res.data.data);
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
.banner-config-page{
  .search-card{
    margin-bottom: 20px;
  }
}
</style>
