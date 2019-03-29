<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <Row>
              <FormItem :label="$t('channel.tabData.channelId')">
                <Row>
                  <Col span="24">
                    <Input
                      v-model="searchForm.channelId"
                      :placeholder="$t('channel.prompt.channelId')"
                    ></Input>
                  </Col>
                </Row>
              </FormItem>
              <FormItem :label="$t('channel.tabData.channelName')">
                <Row>
                  <Col span="24">
                    <Input
                      v-model="searchForm.channelName"
                      :placeholder="$t('channel.prompt.channelName')"
                    ></Input>
                  </Col>
                </Row>
              </FormItem>
              <FormItem :label="$t('channel.tabData.status')">
                <Row>
                  <Col span="24">
                    <Select
                      v-model="searchForm.status"
                      class="search-select-item"
                      :placeholder="$t('channel.prompt.status')"
                    >
                      <Option v-for="(item, i) in $t('channel.status')" :value="item.value" :key="i">{{item.desc}}</Option>
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
        <Button class="add-message-btn" type="primary" @click="showModal">{{$t('channel.modal.add')}}</Button>
        <!--v-on:changeModal="changeModal"  v-on:editSuccess="editSuccess"-->
        <channel-modal
          class="admin-modal"
          :editModal="editModal"
          :chooseItem="chooseItem"
          v-on:changeModal="changeModal"
          v-on:editSuccess="editSuccess"
        ></channel-modal>

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
    <!--<Modal :title="$t('banner.tabData.banner')" v-model="isUrl" width="360">-->
      <!--<div class="flex-center">-->
        <!--<Spin fix v-if="imgLoading"></Spin>-->
        <!--<img-->
          <!--:src="url"-->
          <!--alt-->
          <!--class="img-show"-->
          <!--ref="imageShow"-->
          <!--style="width:100px;height:100px;display:block;margin:0 auto;"-->
        <!--&gt;-->
      <!--</div>-->
      <!--<div slot="footer">-->
        <!--<Button type="primary" size="large" @click="iconClose">{{$t('cardManage.sure')}}</Button>-->
      <!--</div>-->
    <!--</Modal>-->
  </Row>
</template>

<script>
  import { formatDate } from "@/assets/js/date";
  import ChannelModal from "_c/operation-modal/channel.vue";
  import { getChannel } from "@/api/data";
    export default {
      name: "channel",
      components: {
        ChannelModal
      },
      data(){
        return{
          imgLoading: false,
          editModal: false,
          tableLoading: false,
          pageSize: 10,
          totalNumber: 1,
          currentPage: 1,
          searchForm: {
            channelId: null,
            channelName: null,
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
              title: this.$t("channel.tabData.channelId"),
              key: "channelId",
              align: "center"
            },
            {
              title: this.$t("channel.tabData.channelName"),
              key: "channelName",
              align: "center",
              tooltip: true
            },
            {
              title: this.$t("channel.tabData.registerIp"),
              key: "registerIp",
              align: "center",
              tooltip: true
            },
            {
              title: this.$t("channel.tabData.applyIp"),
              key: "applyIp",
              align: "center",
              tooltip: true
            },
            {
              title: this.$t("channel.tabData.loanIp"),
              key: "loanIp",
              align: "center",
              tooltip: true
            },
            {
              title: this.$t("channel.tabData.status"),
              key: "status",
              align: "center",
              render: (h, params) => {
                let data = this.$t("channel.status");
                let type = data.filter(v => {
                  return v.value === params.row.status;
                });
                let state = type.length > 0 && type[0].desc ? type[0].desc : "";
                return h("div", state);
              }
            },
            {
              title: this.$t("channel.tabData.modifyTime"),
              key: "modifyTime",
              align: "center",
              render: function(h, params) {
                return h(
                  "span",
                  formatDate(new Date(this.row.modifyTime), "yyyy-MM-dd  hh:mm:ss")
                );
              },
            },
            {
              title: this.$t("common.operating"),
              key: "action",
              width: 120,
              align: "center",
              render: (h, params) => {
                return h("div", [
                  h('span', {
                    props: {
                      type: 'text', size: 'large', icon: 'md-menu'
                    },
                    class: 'edit-btn',
                    style: {
                      color: "#57a3f3",
                      marginRight: '5px',
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
                        this.editMessage(params)
                      }
                    }
                  }, this.$t('common.edit')),
                  h('span', {
                    props: {type: 'text', size: 'large', icon: 'md-trash'
                    },
                    style: {
                      color: "#57a3f3",
                      marginRight: '5px',
                      cursor: "pointer"
                    },
                    class: 'delete-btn',
                    on: {
                      click: () => {
                        window.open('http://h5.51fastloan.com/sdk.zip');
                      }
                    }
                  }, this.$t('channel.modal.downLoad'))
                ])
              }
            }
          ]
        }
      },
      mounted: function () {
        this.getTable();
      },
       methods: {
         search() {
           this.getTable();
         },
         cleanSearch() {
           this.$refs['searchForm'].resetFields();
           this.searchForm.channelId = '';
           this.searchForm.channelName='';
           this.searchForm.status = '';
           this.getTable();
         },
         showModal () {
           this.editModal = true;
         },
         changeModal(param) {
           console.log("asfass")
           this.editModal = param;
           this.modelItem({'row': {}});
         },
         editMessage(data){
            console.log(data);
           this.modelItem(data);
           this.editModal = true;
         },
         getTable(){
           let params = {
             channelId: this.searchForm.channelId,
             channelName: this.searchForm.channelName,
             status: this.searchForm.status,
             pageSize: this.pageSize,
             currentPage: this.currentPage,
           };
           this.tableLoading = this.tableLoading === false ? true : this.tableLoading;
           getChannel(params).then(res => {
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
         modelItem(params){
           this.chooseItem.id = params.row.id;
           this.chooseItem.channelId = params.row.channelId+"";
           this.chooseItem.channelName = params.row.channelName;
           this.chooseItem.registerIp = params.row.registerIp;
           this.chooseItem.applyIp = params.row.applyIp;
           this.chooseItem.loanIp = params.row.loanIp;
           this.chooseItem.status = params.row.status;
         },
         editSuccess (param) {
           this.tableLoading = true;
           this.getTable();
         },
         changePage (params) {
           this.currentPage = params;
           this.getTable();
         },
         pageSizeChange (params) {
           this.pageSize = params;
           this.getTable()
         },
       }
    }
</script>

<style scoped>

</style>
