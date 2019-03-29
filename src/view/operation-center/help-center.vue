<template>
  <Row :gutter="10" class="help-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('helpCenter.textFlag')" prop="msgType">
              <Select v-model="searchForm.msgType" class="search-select-item">
                <Option :value="1">{{$t('helpCenter.bill')}}</Option>
                <Option :value="2">{{$t('helpCenter.charge')}}</Option>
                <Option :value="3">{{$t('helpCenter.credit')}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('helpCenter.isShow')" prop="isShow">
              <Select v-model="searchForm.isShow" :placeholder="$t('helpCenter.isShow')" class="search-select-item">
                <Option :value="1">{{$t('helpCenter.yes')}}</Option>
                <Option :value="0">{{$t('helpCenter.no')}}</Option>
              </Select>
            </FormItem>
          </Row>
          <FormItem>
            <Button type="primary" @click="search">{{$t('messagePush.search')}}</Button>
            <Button style="margin-left: 8px" @click="cleanSearch">{{$t('messagePush.reSet')}}</Button>
          </FormItem>
        </Form>
      </Card>
      <Card>
        <Button class="add-message-btn" type="primary" @click="showModal">{{$t('helpCenter.addHelp')}}</Button>
        <message-modal class="admin-modal" :editModal="editModal" :chooseItem="chooseItem" v-on:changeModal="changeModal"  v-on:editSuccess="editSuccess"></message-modal>
        <Table stripe class="person-table" :columns="columns" :data="tableData" :loading="tableLoading"/>
        <Modal v-model="deleteModal" :title="$t('setUpPage.deleteTitle')" @on-ok="deleteItem">
          <p>{{$t('setUpPage.deleteTip')}}</p>
        </Modal>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;margin-bottom: 2px;">
            <Page
              v-if="totalNumber != 0"
              :total="totalNumber"
              :current="currentPage"
              :page-size="pageSize"
              :page-size-opts="[10, 20, 30, 50]"
              @on-change="changePage"
              @on-page-size-change="pageSizeChange"
              show-elevator show-sizer show-total></Page>
          </div>
        </div>
      </Card>
    </i-col>
  </Row>
</template>

<script>
import MessageModal from '_c/operation-modal/help-modal.vue'
import { getHelpList } from '@/api/data'
export default {
  name: 'message_push_page',
  components: {
    MessageModal
  },
  data () {
    return {
      editModal: false,
      tableLoading: true,
      deleteModal: false,
      currentPage: 1,
      pageSize: 10,
      totalNumber: 0,
      chooseItem: {
        id: '',
        textFlag: '',
        textOrder: '',
        textQuestion: '',
        textAnswer: '',
        isShow: '',
        modifyOperatorName: '',
        modifyOperatorId: '',
        modifyTimes: ''
      },
      searchForm: {
        msgType: '',
        isShow: ''
      },
      columns: [
        {
          title: this.$t('messagePush.id'), key: 'id'
        },
        {
          title: this.$t('helpCenter.textFlag'), key: 'textFlag',
          render: (h, params) => {
            let textFlagName = ''
            switch (params.row.textFlag) {
              case 1:
                textFlagName = this.$t('helpCenter.bill')
                break;
              case 2:
                textFlagName = this.$t('helpCenter.charge')
                break;
              case 3:
                textFlagName = this.$t('helpCenter.credit')
                break;
              default:
                textFlagName = 'null'
            }
            return h('span', textFlagName)
          }
        },
        {
          title: this.$t('helpCenter.textOrder'), key: 'textOrder'
        },
        {
          title: this.$t('helpCenter.question'), key: 'textQuestion', tooltip: true
        },
        {
          title: this.$t('helpCenter.answer'), key: 'textAnswer', tooltip: true
        },
        {
          title: this.$t('helpCenter.isShow'), key: 'isShow',
          render: (h, params) => {
            let isShowName = ''
            switch (params.row.isShow) {
              case 1:
                isShowName = this.$t('helpCenter.yes')
                break;
              case 0:
                isShowName = this.$t('helpCenter.no')
                break;
              default:
                isShowName = 'null'
            }
            return h('span', isShowName)
          }
        },
        {
          title: this.$t('messagePush.operator'), key: 'modifyOperatorName'
        },
        {
          title: this.$t('helpCenter.operatTime'), key: 'modifyTimes'
        },
        {
          title: this.$t('setUpPage.operating'),
          key: 'action',
          width: 250,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text', size: 'large', icon: 'md-menu'
                },
                class: 'edit-btn',
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.editPerson(params)
                  }
                }
              }, this.$t('setUpPage.edit')),
              // h('Button', {
              //   props: {type: 'text', size: 'large', icon: 'md-trash'
              //   },
              //   class: 'delete-btn',
              //   on: {
              //     click: () => {
              //       this.removePerson(params)
              //     }
              //   }
              // }, this.$t('setUpPage.delete'))
            ])
          }
        }
      ],
      tableData: []
    }
  },
  mounted: function () {
    this.getTable()
  },
  methods: {
    getTable () {
      let params = {
        textFlag: this.searchForm.msgType || '',
        isShow: this.searchForm.isShow === undefined ? '' : this.searchForm.isShow ,
        pageSize: this.pageSize,
        currentPage: this.currentPage,
      }
      this.tableLoading = this.tableLoading === false ? true : this.tableLoading
      getHelpList(params).then(res => {
        this.tableLoading = false
        if(res.data.success){
          if( res.data.data && res.data.data.length !=0 ){
            this.tableData = res.data.data
          }else{
            this.tableData = []
          }
          this.currentPage = res.data.page.currentPage
          this.pageSize = res.data.page.pageSize
          this.totalNumber = res.data.page.totalNumber
        }else{
          this.$Message.error(res.data.message)
        }
      })
    },
    showModal () {
      this.editModal = true
    },
    editPerson (params) {
      this.choose(params)
      this.editModal = true
    },

    removePerson (params) {
      this.choose(params)
      this.deleteModal = true
    },

    choose (params) {
      this.chooseItem.id = params.row.id || ''
      this.chooseItem.textFlag = params.row.textFlag || ''
      this.chooseItem.textOrder = params.row.textOrder || ''
      this.chooseItem.textQuestion = params.row.textQuestion || ''
      this.chooseItem.textAnswer = params.row.textAnswer || ''
      this.chooseItem.isShow = params.row.isShow || 0
      this.chooseItem.modifyOperatorName = params.row.modifyOperatorName || ''
      this.chooseItem.modifyOperatorId = params.row.modifyOperatorId || ''
      this.chooseItem.modifyTimes = params.row.modifyTimes || ''
    },
    deleteItem () {

    },
    cleanSearch () {
      this.$refs['searchForm'].resetFields()
    },
    changeModal (param) {
      this.editModal = param
      this.choose({'row': {}})
    },
    editSuccess () {
      this.tableLoading = true
      this.getTable()
    },
    changePage (param) {
      this.currentPage = param
      this.getTable()
    },
    pageSizeChange (params) {
      this.pageSize = params
      this.getTable()
    },
    search () {
      this.getTable()
    }
  }
}
</script>

<style lang="less">
.help-center-page{
  .search-card{
    margin-bottom: 20px;
    .search-select-item{
      width: 200px;
    }
  }
  .add-message-btn{
    margin-bottom: 15px;
  }
  .person-table{
    .ivu-btn-text,.ivu-btn-text:hover,.ivu-btn-text:focus{
      background-color: transparent;
      box-shadow: none;
    }
    .ivu-btn-text.edit-btn{
      color: #57a3f3;
    }
    .ivu-btn-text.delete-btn{
      color: #ed4014;
    }
  }
  .admin-modal{
    .ivu-card-bordered{
      border: 0;
    }
    .ivu-card-body{
      padding: 0;
    }
  }
}
</style>
