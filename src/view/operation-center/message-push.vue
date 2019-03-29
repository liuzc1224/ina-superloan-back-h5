<template>
  <Row :gutter="10" class="set-message-center-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem :label="$t('messagePush.takeEffectTime')">
              <Row>
                <Col span="11">
                  <DatePicker type="date" :placeholder="$t('messagePush.searchDate')" v-model="searchForm.beginDate"></DatePicker>
                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                  <DatePicker type="date" :placeholder="$t('messagePush.searchDate')" v-model="searchForm.endDate"></DatePicker>
                </Col>
              </Row>
            </FormItem>
            <FormItem :label="$t('messagePush.sendChannel')" prop="channel">
              <Select v-model="searchForm.channel" class="search-select-item">
                <Option value="0">{{$t('messagePush.messageCenter')}}</Option>
                <Option value="1">{{$t('messagePush.push')}}</Option>
                <Option value="2">{{$t('messagePush.messageAndPush')}}</Option>
              </Select>
            </FormItem>
          </Row>
          <Row>
            <FormItem :label="$t('messagePush.messageType')" prop="msgType">
              <Select v-model="searchForm.msgType" class="search-select-item">
                <Option value="0">{{$t('messagePush.announcement')}}</Option>
                <Option value="1">{{$t('messagePush.notice')}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('messagePush.sendTarget')" prop="sendTarget">
              <Select v-model="searchForm.sendTarget" class="search-select-item">
                <Option value="0">{{$t('messagePush.allPeople')}}</Option>
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
        <Button class="add-message-btn" type="primary" @click="showModal">{{$t('messagePush.addMessage')}}</Button>
        <message-modal class="admin-modal" :editModal="editModal" :chooseItem="chooseItem" v-on:changeModal="changeModal"  v-on:editSuccess="editSuccess"></message-modal>
        <Table stripe class="person-table" :columns="columns" :data="tableData" :loading="tableLoading"/>
        <Modal v-model="deleteModal" :title="$t('setUpPage.deleteTitle')" @on-ok="deleteItem">
          <p>{{$t('setUpPage.deleteTip')}}</p>
        </Modal>
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
  </Row>
</template>

<script>
import MessageModal from '_c/operation-modal/message-modal.vue'
import { dateToString } from '@/libs/tools'
import { getMsgList, deleteMessage } from '@/api/data'
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
      pageSize: 10,
      totalNumber: 1,
      currentPage: 1,
      chooseItem: {
        id: '',
        takeEffectTime: '',
        sendChannel: '',
        sendTarget: '',
        msgType: '',
        title: '',
        text: '',
        status: '',
        operatorName: ''
      },
      searchForm: {
        beginDate: '',
        endDate: '',
        channel: '',
        msgType: '',
        sendTarget: ''
      },
      columns: [
        {
          title: this.$t('messagePush.id'), key: 'id'
        },
        {
          title: this.$t('messagePush.takeEffectTime'), key: 'takeEffectTimeStr',
          render: (h, params) => {
            return h('span', params.row.takeEffectTimeStr.substring(0, 10))
          }
        },
        {
          title: this.$t('messagePush.sendChannel'), key: 'sendChannel',
          render: (h, params) => {
            let channelName = ''
            switch (params.row.sendChannel) {
              case 0:
                channelName = this.$t('messagePush.messageCenter')
                break;
              case 1:
                channelName = this.$t('messagePush.push')
                break;
              case 2:
                channelName = this.$t('messagePush.messageAndPush')
                break;
              default:
                channelName = 'null'
            }
            return h('span', channelName)
          }
        },
        {
          title: this.$t('messagePush.sendTarget'), key: 'sendTarget',
          render: (h, params) => {
            let targetName = ''
            switch (params.row.sendTarget) {
              case 0:
                targetName = this.$t('messagePush.allPeople')
                break;
              default:
                targetName = 'null'
            }
            return h('span', targetName)
          }
        },
        {
          title: this.$t('messagePush.messageType'), key: 'msgType',
          render: (h, params) => {
            let typeName = ''
            switch (params.row.msgType) {
              case 0:
                typeName = this.$t('messagePush.announcement')
                break;
              case 1:
                typeName = this.$t('messagePush.notice')
                break;
              default:
                typeName = 'null'
            }
            return h('span', typeName)
          }
        },
        {
          title: this.$t('messagePush.messageTitle'), key: 'title'
        },
        {
          title: this.$t('messagePush.messageText'), key: 'text', tooltip: true
          // render (h, param) {
          //   return h ('Poptip', {
          //     props: {
          //       width: '200', content: param.row.text, 'word-wrap':'word-wrap'
          //     },
          //     class: 'msg-content-div',
          //   },param.row.text)
          // }
        },
        {
          title: this.$t('messagePush.sendStaus'), key: 'sendType',
          render: (h, params) => {
            let sendStaus = ''
            switch (params.row.sendType) {
              case 0:
                sendStaus = this.$t('messagePush.isSend')
                break;
              case 1:
                sendStaus = this.$t('messagePush.waitSend')
                break;
              default:
                sendStaus = 'null'
            }
            return h('span', sendStaus)
          }
        },
        {
          title: this.$t('messagePush.operator'), key: 'operatorName'
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
              }, this.$t('setUpPage.edit')),
              h('Button', {
                props: {type: 'text', size: 'large', icon: 'md-trash'
                },
                class: 'delete-btn',
                on: {
                  click: () => {
                    this.removeMessage(params)
                  }
                }
              }, this.$t('setUpPage.delete'))
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
      if(this.searchForm.beginDate) {
        startTimeParam = dateToString(this.searchForm.beginDate, '-')
      }
      if(this.searchForm.endDate) {
        endTimeParam = dateToString(this.searchForm.endDate, '-') + ' 23:59:59'
      }
      let params = {
        takeEffectTimeStart: startTimeParam || '',
        takeEffectTimeEnd: endTimeParam || '', 
        sendChannel: this.searchForm.channel || '' , 
        msgType: this.searchForm.msgType || '' ,
        sendTarget: this.searchForm.sendTarget || '' ,
        pageSize: this.pageSize,
        currentPage: this.currentPage,
      }
      this.tableLoading = this.tableLoading === false ? true : this.tableLoading
      getMsgList(params).then(res => {
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
    editMessage (params) {
      this.choose(params)
      this.editModal = true
    },

    removeMessage (params) {
      this.choose(params)
      this.deleteModal = true
    },

    choose (params) {
      this.chooseItem.id = params.row.id || ''
      this.chooseItem.takeEffectTime = params.row.takeEffectTimeStr || ''
      this.chooseItem.sendChannel = params.row.sendChannel === 0 ? 0 : params.row.sendChannel
      this.chooseItem.sendTarget = params.row.sendTarget === 0 ? 0 : params.row.sendTarget
      this.chooseItem.msgType = params.row.msgType === 0 ? 0 : params.row.msgType
      this.chooseItem.title = params.row.title || ''
      this.chooseItem.text = params.row.text || ''
      this.chooseItem.status = params.row.status || ''
      this.chooseItem.operatorName = params.row.operatorName || ''
    },
    deleteItem () {
      let params = this.chooseItem
      params.status = 1
      deleteMessage(params).then(res => {
        if(res.data.success){
          this.$Message.success(this.$t('setUpPage.deleteSuccess'))
          this.choose({'row': {}})
          this.getTable()
        }else{
          this.$Message.error(res.data.message)
        }
      })
    },
    changeModal (param) {
      this.editModal = param
      this.choose({'row': {}})
    },
    editSuccess (param) {
      this.tableLoading = true
      this.getTable()
    },
    changePage (params) {
      this.currentPage = params;
      this.getTable();
    },
    pageSizeChange (params) {
      this.pageSize = params
      this.getTable()
    },
    cleanSearch () {
      this.$refs['searchForm'].resetFields()
      this.searchForm.beginDate = ''
      this.searchForm.endDate = ''
    },
    search () {
      this.getTable()
    }
  }
}
</script>

<style lang="less">
.set-message-center-page{
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
    .msg-content-div{
      cursor: pointer;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      div{
        width: 100%;
      }
      .ivu-poptip-arrow{
        width: auto;
      }
      .ivu-poptip-inner{
        cursor: auto;
      }
    }
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
