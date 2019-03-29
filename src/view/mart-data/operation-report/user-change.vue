<template>
  <Row :gutter="10" class="user-change-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem label="日期">
                  <DatePicker type="date" :placeholder="$t('messagePush.searchDate')" v-model="searchForm.showTime"></DatePicker>
            </FormItem>
            <FormItem label="产品名称" prop="productName">
              <Input v-model="searchForm.productName" :placeholder="$t('feedbackRecord.feedbackEmailTip')"></Input>
            </FormItem>
            <FormItem label="排列方式" prop="orderType">
              <Select v-model="searchForm.orderType" style="width:200px">
                <Option value="1" key="1">产品点击总数</Option>
                <Option value="2" key="2">下载点击总数</Option>
                <Option value="3" key="3">产品-下载点击总用户转化</Option>
                <Option value="4" key="4">产品-下载点击新用户转化</Option>
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
        <Row class="table-info">注册用户数：<span>{{registerCount}}</span>登录用户数：<span>{{loginCount}}</span>首页二次登陆用户数：<span>{{mainCount}}</span></Row>
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
import { getUseChangeList, getConversion } from '@/api/martData'
import { dateToString } from '@/libs/tools'
export default {
  name: 'message_push_page',
  data () {
    return {
      tableLoading: true,
      registerCount: 0,
      loginCount: 0,
      mainCount: 0,
      // currentPage: 1,
      // pageSize: 10,
      // totalNumber: 0,
      searchForm: {
        showTime: '',
        productName: '',
        orderType: ''
      },
      columns: [
        { title: '产品名称', key: 'productName'
        },
        { title: '产品点击总数', key: 'totalClickCount'
        },
        { title: '产品新用户点击数', key: 'newUserClickCount'
        },
        { title: '产品点击用户总数', key: 'totalClickUserCount'
        },
        { title: '产品点击新用户数', key: 'clickNewUserCount'
        },
        { title: '产品单用户平均点击数', key: 'avgClickNum'
        },
        { title: '产品单新用户平均点击数', key: 'avgNewClickNum'
        },
        { title: '下载点击总数', key: 'totalDownloadCount'
        },
        { title: '下载新用户点击数', key: 'newDownloadCount'
        },
        { title: '下载点击用户总数', key: 'totalDownloadUserCount'
        },
        { title: '下载点击新用户数', key: 'downloadNewUserCount'
        },
        { title: '单用户下载平均点击数', key: 'avgDownloadNum'
        },
        { title: '单新用户下载平均点击数', key: 'avgNewDownloadNum'
        },
        { title: '产品-下载总用户转化', key: 'downloadConversion',
          render: (h, params) => {
            return h("div", params.row.downloadConversion + '%');
          }
        },
        { title: '产品-下载新用户转化', key: 'downloadNewConversion',
          render: (h, params) => {
            return h("div", params.row.downloadNewConversion + '%');
          }
        }
      ],
      tableData: []
    }
  },
  mounted: function () {
    this.getTable();
    this.searchForm.showTime = new Date()
  },
  methods: {
    getTable () {
      let showTimeParam = ''
      if ( this.searchForm.showTime ) {
        showTimeParam = dateToString(this.searchForm.showTime, '-')
      } else {
        showTimeParam = dateToString(new Date(), '-')
      }
      let params = {
        showTime: showTimeParam || '',
        productName: this.searchForm.productName || '' ,
        orderType: this.searchForm.orderType,
        // pageSize: this.pageSize,
        // currentPage: this.currentPage,
      }
      for ( let p in params ) {
        if ( params[p] == '' ) {
          delete params[p];
        }
      }
      this.tableLoading = this.tableLoading === false ? true : this.tableLoading
      getUseChangeList(params).then(res => {
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

      this.tableLoading = false

      getConversion({showTime: params.showTime}).then(res => {
        if(res.data.success){
          this.registerCount = res.data.data.registerCount
          this.loginCount = res.data.data.loginCount
          this.mainCount = res.data.data.mainCount
        }else{
          this.$Message.error(res.data.message)
        }
      })
    },
    cleanSearch () {
      this.$refs['searchForm'].resetFields()
      this.searchForm.showTime = new Date()
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
.user-change-page{
  .search-card{
    margin-bottom: 20px;
  }
  .table-info{
    margin-bottom: 15px;
    span{
      font-weight: bold;
      margin: 0 20px 0 0;
    }
  }
}
</style>
