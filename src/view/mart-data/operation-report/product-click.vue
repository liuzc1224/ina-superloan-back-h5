<template>
  <Row :gutter="10" class="product-click-page">
    <i-col span="24">
      <Card class="search-card">
        <Form ref="searchForm" :model="searchForm" :label-width="80" inline>
          <Row>
            <FormItem label="时间">
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
            <FormItem label="产品名称" prop="productName">
              <Input v-model="searchForm.productName" placeholder="请输入产品名称"></Input>
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
import { getProductClickList } from '@/api/martData'
import { dateToString } from '@/libs/tools'
import { formatDate } from "@/assets/js/date";
export default {
  name: 'message_push_page',
  data () {
    return {
      tableLoading: true,
      currentPage: 1,
      pageSize: 10,
      totalNumber: 0,
      timeList: [],
      startTimeOption: {},  
      endTimeOption: {},
      searchForm: {
        startTime: '',
        endTime: '',
        productName: ''
      },
      columns: [
        {
          title: '产品名称', key: 'productName', fixed: 'left', width: 100, align: 'center'
        }
      ],
      tableData: []
    }
  },
  mounted: function () {
    this.searchForm.startTime = new Date()
    this.searchForm.endTime = new Date()
    this.searchForm.startTime.setDate( new Date().getDate() - 30 )
    // this.onStartTimeChange(this.searchForm.startTime)
    // this.onEndTimeChange(this.searchForm.endTime)
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
        endTimeParam = dateToString(this.searchForm.endTime, '-')
      }
      let params = {
        beginTime: startTimeParam || '',
        endTime: endTimeParam || '',
        productName: this.searchForm.productName || '' ,
        pageSize: this.pageSize,
        currentPage: this.currentPage,
      }
      this.tableLoading = this.tableLoading === false ? true : this.tableLoading
      getProductClickList(params).then(res => {
        this.tableLoading = false
        if(res.data.success){
          let data = res.data.data || {}
          let tableData = []
          this.columns = [{ title: '产品名称', key: 'productName', fixed: 'left', width: 100, align: 'center'}]
          this.timeList = []
          let i = 0;
          for ( var p in data ) {
            // 创建横坐标
            if ( i == 0 ) {
              data[p].forEach( (item, index) => {
                this.timeList.push(item.showTime)
              })
              i = 1
            }
            // 创建表格数据
            let row = { productName: p };
            data[p].forEach( (item, index) => {
              row[item.showTime] = item.statisticsNum
            })
            tableData.push(row)
          }

          this.tableData = tableData
          this.timeList.forEach( (item, index) => {
            let column = {
              title: formatDate(new Date(item), "yyyy-MM-dd"), key: item, width: 100, align: 'center'
            }
            this.columns.push(column)
          })
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
      this.searchForm.startTime = new Date()
      this.searchForm.endTime = new Date()
      this.searchForm.startTime.setDate( new Date().getDate() - 30 )
    },
    pageSizeChange (params) {
      this.pageSize = params
      this.getTable()
    },
    changePage (param) {
      this.currentPage = param
      this.getTable()
    },
    search () {
      this.getTable()
    },
    // onStartTimeChange ( startTime, type ) {
    //   let maxDate = new Date(startTime)
    //   startTime = new Date(startTime)
    //   maxDate.setDate( startTime.getDate() + 30 )
    //   this.searchForm.endTime = startTime
    //   this.endTimeOption = {
    //     disabledDate(endTime) {
    //       return endTime < startTime || endTime > Date.now() || endTime > maxDate
    //     }
    //   }
    // },
    // onEndTimeChange(endTime, type) {
    //   this.startTimeOption = {
    //     disabledDate(startTime) {
    //       return startTime > new Date(this.searchForm.endTime) || startTime > Date.now()
    //     }
    //   }
    // }
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
