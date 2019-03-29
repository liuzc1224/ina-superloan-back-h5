<template>
  <Row :gutter="10" class="product-click-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem label="日期选择">
              <Row>
                <Col span="11">
                  <DatePicker type="date" :placeholder="$t('messagePush.searchDate')" v-model="searchForm.startTime" :options="startTimeOption"></DatePicker>
                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                  <DatePicker type="date" :placeholder="$t('messagePush.searchDate')" v-model="searchForm.endTime" :options="endTimeOption"></DatePicker>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="排列方式" prop="sort">
              <Select v-model="searchForm.sort" style="width:200px">
                <Option value="loadOpenCount" key="按下载并打开">按下载并打开</Option>
                <Option value="applyCount" key="按申请">按申请</Option>
                <Option value="loanCount" key="按放款">按放款</Option>
                <Option value="loadRegister" key="按下载-注册转化">按下载-注册转化</Option>
                <Option value="registerApply" key="按注册-申请转化">按注册-申请转化</Option>
                <Option value="loadLoan" key="按下载-放款转化">按下载-放款转化</Option>
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
        <!-- <Button class="add-message-btn" type="primary" @click="showModal">新增反馈</Button> -->
        <Table stripe class="person-table" :columns="columns" :data="tableData" :loading="tableLoading"/>
        <!-- <div style="margin: 10px;overflow: hidden">
          <div style="float: right;margin-bottom: 2px;">
            <Page :total="totalNumber" :current="currentPage" :page-size-opts="[10, 20, 30, 50]" @on-change="changePage" @on-page-size-change="pageSizeChange" show-elevator show-sizer show-total></Page>
          </div>
        </div> -->
      </Card>
    </i-col>
  </Row>
</template>

<script>
import { getChannelChangeList } from '@/api/martData'
import { dateToString } from '@/libs/tools'
export default {
  name: 'message_push_page',
  data () {
    return {
      tableLoading: true,
      // currentPage: 1,
      // pageSize: 10,
      // totalNumber: 0,
      startTimeOption: {},  
      endTimeOption: {},
      searchForm: {
        startTime: '',
        endTime: ''
      },
      columns: [
        {
          title: '渠道代码', key: 'channelId', align: 'center'
        },
        {
          title: '渠道名称', key: 'channelName', align: 'center'
        },
        {
          title: '到下载页', key: 'toLoadCount', align: 'center'
        },
        {
          title: '下载并打开', key: 'loadOpenCount', align: 'center'
        },
        {
          title: '注册', key: 'registerCount', align: 'center'
        },
        {
          title: '注册成功', key: 'registerSuccessCount', align: 'center'
        },
        {
          title: '申请', key: 'applyCount', align: 'center'
        },
        {
          title: '申请成功', key: 'applySuccessCount', align: 'center'
        },
        {
          title: '放款', key: 'loanCount', align: 'center'
        },
        {
          title: '下载-注册转化', key: 'loadRegister', align: 'center',
          render: (h, params) => {
            return h("div", parseFloat(params.row.loadRegister * 100).toFixed(1) + '%');
          }
        },
        {
          title: '注册-申请转化', key: 'registerApply', align: 'center',
          render: (h, params) => {
            return h("div", parseFloat(params.row.registerApply * 100).toFixed(1) + '%');
          }
        },
        {
          title: '下载-放款转化', key: 'loadLoan', align: 'center',
          render: (h, params) => {
            return h("div", parseFloat(params.row.loadLoan * 100).toFixed(1) + '%');
          }
        }
      ],
      tableData: []
    }
  },
  mounted: function () {
    this.searchForm.startTime = new Date()
    this.searchForm.endTime = new Date()
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
      let columns = 'loadRegister'
      let orderBy = 'true'
      let params = {
        createTimeStart: startTimeParam || '',
        createTimeEnd: endTimeParam || '',
        // pageSize: this.pageSize,
        // currentPage: this.currentPage,
        columns: this.searchForm.sort,
        orderBy: orderBy
      }
      this.tableLoading = this.tableLoading === false ? true : this.tableLoading
      getChannelChangeList(params).then(res => {
        this.tableLoading = false
        if(res.data.success){
          this.tableData = res.data.data
        }else{
          this.$Message.error(res.data.message)
        }
        // this.currentPage = res.data.page.currentPage
        // this.pageSize = res.data.page.pageSize
        // this.totalNumber = res.data.page.totalNumber
      })
    },
    cleanSearch () {
      this.$refs['searchForm'].resetFields()
      this.searchForm.startTime = ''
      this.searchForm.endTime = ''
    },
    // pageSizeChange (params) {
    //   this.pageSize = params
    //   this.getTable()
    // },
    // changePage (param) {
    //   this.currentPage = param
    //   this.getTable()
    // },
    search () {
      this.getTable()
    }
  }
}
</script>

<style lang="less">
.product-click-page{
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
}
</style>
