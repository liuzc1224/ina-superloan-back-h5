<template>
  <Row :gutter="10" class="feed-back-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('feedbackRecord.feedbackTime')">
              <Row>
                <Col span="11">
                  <DatePicker type="date" :placeholder="$t('messagePush.searchDate')" v-model="searchForm.startTime"></DatePicker>
                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                  <DatePicker type="date" :placeholder="$t('messagePush.searchDate')" v-model="searchForm.endTime"></DatePicker>
                </Col>
              </Row>
            </FormItem>
            <FormItem :label="$t('feedbackRecord.feedbackEmail')" prop="email">
              <Input v-model="searchForm.email" :placeholder="$t('feedbackRecord.feedbackEmailTip')"></Input>
            </FormItem>
          </Row>
          <FormItem>
            <Button type="primary" @click="search">{{$t('messagePush.search')}}</Button>
            <Button style="margin-left: 8px" @click="cleanSearch">{{$t('messagePush.reSet')}}</Button>
          </FormItem>
        </Form>
      </Card>
      <Card>
        <!-- <Button class="add-message-btn" type="primary" @click="showModal">新增反馈</Button> -->
        <feedback-modal class="admin-modal" :editModal="editModal" :chooseItem="chooseItem" v-on:changeModal="changeModal"  v-on:editSuccess="editSuccess"></feedback-modal>
        <Table stripe class="person-table" :columns="columns" :data="tableData" :loading="tableLoading"/>
        <Modal v-model="deleteModal" :title="$t('setUpPage.deleteTitle')" @on-ok="deleteItem">
          <p>{{$t('setUpPage.deleteTip')}}</p>
        </Modal>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;margin-bottom: 2px;">
            <Page :total="totalNumber" :current="currentPage" :page-size-opts="[10, 20, 30, 50]" @on-change="changePage" @on-page-size-change="pageSizeChange" show-elevator show-sizer show-total></Page>
          </div>
        </div>
      </Card>
    </i-col>
  </Row>
</template>

<script>
import FeedbackModal from '_c/operation-modal/feedback-modal.vue'
import { getFeedbackList } from '@/api/data'
import { dateToString } from '@/libs/tools'
export default {
  name: 'message_push_page',
  components: {
    FeedbackModal
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
        createTimes: '',
        email: '',
        opinionTheme: '',
        opinionContent: '',
        opinionVersion: '',
        opinionStatus: '',
        opinionRemark: '',
        id: ''
      },
      searchForm: {
        startTime: '',
        endTime: '',
        email: ''
      },
      columns: [
        {
          title: this.$t('messagePush.id'), key: 'id'
        },
        {
          title: this.$t('feedbackRecord.feedbackTime'), key: 'createTimes'
        },
        {
          title: this.$t('feedbackRecord.feedbackEmail'), key: 'email'
        },
        {
          title: this.$t('feedbackRecord.feedbackTitle'), key: 'opinionTheme', tooltip: true
        },
        {
          title: this.$t('feedbackRecord.feedbackContent'), key: 'opinionContent', tooltip: true
          // render (h, param) { // 自定义点击显示
          //   return h ('Poptip', {
          //     props: {
          //       width: '200', content: param.row.opinionContent, 'word-wrap':'word-wrap'
          //     },
          //     class: 'msg-content-div',
          //   },param.row.msgContent)
          // }
        },
        {
          title: this.$t('feedbackRecord.feedbackVersion'), key: 'opinionVersion'
        },
        {
          title: this.$t('feedbackRecord.feedbackStatus'), key: 'opinionStatus',
          render: (h, params) => {
            let opinionStatusName = ''
            switch (params.row.opinionStatus) {
              case 0:
                opinionStatusName = this.$t('feedbackRecord.unhandle')
                break;
              case 1:
                opinionStatusName = this.$t('feedbackRecord.handling')
                break;
              case 2:
                opinionStatusName = this.$t('feedbackRecord.handled')
                break;
              default:
                opinionStatusName = 'null'
            }
            return h('span', opinionStatusName)
          }
        },
        {
          title: this.$t('feedbackRecord.opinionRemark'), key: 'opinionRemark'
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
                    this.editMessage(params)
                  }
                }
              }, this.$t('setUpPage.edit'))// ,
              // h('Button', {
              //   props: {type: 'text', size: 'large', icon: 'md-trash'
              //   },
              //   class: 'delete-btn',
              //   on: {
              //     click: () => {
              //       this.removeMessage(params)
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
      let startTimeParam = ''
      let endTimeParam = ''
      if(this.searchForm.startTime) {
        startTimeParam = dateToString(this.searchForm.startTime, '-')
      }
      if(this.searchForm.endTime) {
        endTimeParam = dateToString(this.searchForm.endTime, '-') + ' 23:59:59'
      }
      let params = {
        startTime: startTimeParam || '',
        endTime: endTimeParam || '',
        email: this.searchForm.email || '' ,
        pageSize: this.pageSize,
        currentPage: this.currentPage,
      }
      this.tableLoading = this.tableLoading === false ? true : this.tableLoading
      getFeedbackList(params).then(res => {
        this.tableLoading = false
        if(res.data.success){
          this.tableData = res.data.data
        }else{
          this.$Message.error(res.data.message)
        }
        this.currentPage = res.data.page.currentPage
        this.pageSize = res.data.page.pageSize
        this.totalNumber = res.data.page.totalNumber
      })
    },
    showModal () {
      this.editModal = true
    },
    editMessage (params) {
      this.choose(params)
      this.editModal = true
    },
    cleanSearch () {
      this.$refs['searchForm'].resetFields()
      this.searchForm.startTime = ''
      this.searchForm.endTime = ''
    },
    removeMessage (params) {
      this.choose(params)
      this.deleteModal = true
    },
    pageSizeChange (params) {
      this.pageSize = params
      this.getTable()
    },
    choose (params) {
      this.chooseItem.createTimes = params.row.createTimes || ''
      this.chooseItem.email = params.row.email || ''
      this.chooseItem.opinionTheme = params.row.opinionTheme || ''
      this.chooseItem.opinionContent = params.row.opinionContent || ''
      this.chooseItem.opinionVersion = params.row.opinionVersion || ''
      this.chooseItem.opinionStatus = params.row.opinionStatus || ''
      this.chooseItem.opinionRemark = params.row.opinionRemark || ''
      this.chooseItem.id = params.row.id || ''
    },
    deleteItem () {

    },
    changeModal (param) {
      this.editModal = param
      this.choose({'row': {}})
    },
    editSuccess (param) {
      this.tableLoading = true
      this.getTable()
    },
    changePage (param) {
      this.currentPage = param
      this.getTable()
    },
    search () {
      this.getTable()
    }
  }
}
</script>

<style lang="less">
.feed-back-center-page{
  .search-card{
    margin-bottom: 20px;
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
