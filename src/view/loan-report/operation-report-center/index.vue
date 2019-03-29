<template>
  <div>
    <Card style="margin-bottom:10px">
      <table-search @tableSearch="search" @reset="reset"></table-search>
        <p>今日美元兑人民币汇率：
          <Input v-model="rate" style="width: 60px;"></Input>
        </p>
    </Card>
    <Card>
      <Table stripe :columns="columns" :data="tableData" :loading="loading"></Table>
      <div style="margin:10px;overflow: hidden;">
        <div class="flex-center">
          <Page
            :total="searchModal.totalNumber"
            :current="1"
            @on-change="changePage"
            show-elevator
            show-total
          ></Page>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import TableSearch from "./search";
import { getOperateReportList, getRate } from "@/api/loanReport";
import { SUCC_CODE } from "@/api/config";
import { formatDate } from "@/assets/js/date";
import { SearchModal } from "./search.modal";
export default {
  name: "user-list",
  components: {
    TableSearch
  },
  data() {
    return {
      loading: true,
      tableData: [],
      rate: 0,
      searchModal: new SearchModal(),
      columns: [
        { title: "日期", key: "reportDateStr", align: "center", width: 100 },
        { title: "负责人", key: "principal", align: "center", width: 80 },
        {
          title: "渠道ID", key: "channelId", align: "center", width: 80,
          // render: function(h, params) {
          //   return h(
          //     "div",
          //     formatDate(new Date(this.row.createTime), "yyyy-MM-dd  hh:mm:ss")
          //   );
          // }
        },
        { title: "渠道名称", key: "channelName", align: "center", width: 100, },
        { title: "设备量", key: "deviceCount", align: "center", width: 80 },
        { title: "注册人数", key: "registerCount", align: "center", width: 100 },
        { title: "申请人数", key: "applyCount", align: "center", width: 100 },
        { title: "放款人数", key: "loanCount", align: "center", width: 100
        },
        { title: "实际放款人数", key: "realLoanCount", align: "center", width: 90
        },
        { title: "安装-注册", key: "installRegister", align: "center", width: 100,
          render: (h, params) => {
            return h("div", parseFloat(params.row.installRegister * 100).toFixed(1) + '%');
          }
        },
        { title: "注册-申请", key: "registerApply", align: "center", width: 100,
          render: (h, params) => {
            return h("div", parseFloat(params.row.registerApply * 100).toFixed(1) + '%');
          }
        },
        { title: "申请-放款", key: "applyLoan", align: "center", width: 100,
          render: (h, params) => {
            return h("div", parseFloat(params.row.applyLoan * 100).toFixed(1) + '%');
          }
        },
        { title: "安装-放款 (首次归因)", key: "installLoan", align: "center", width: 100,
          render: (h, params) => {
            return h("div", parseFloat(params.row.installLoan * 100).toFixed(1) + '%');
          }
        },
        { title: "安装-放款 (多次归因)", key: "installLoans", align: "center", width: 100,
          render: (h, params) => {
            return h("div", parseFloat(params.row.installLoans * 100).toFixed(1) + '%');
          }
        },
        { title: "合作方式", key: "cooperation", align: "center", width: 100
        },
        { title: "单价", key: "price", align: "center", width: 80
        },
        { title: "总成本", key: "totalCoat", align: "center", width: 80
        },
        { title: "单个用户成本 (USD)", key: "oneUSD", align: "center", width: 110
        },
        { title: "单个用户成本 (CNZ)", key: "oneCNZ", align: "center", width: 110
        },
        { title: "实际放款用户成本 (USD)", key: "realUSD", align: "center", width: 110
        },
        { title: "实际放款用户成本 (CNZ)", key: "realCNZ", align: "center", width: 110
        },
        { title: "kPI", key: "kpi", align: "center", width: 80
        },
        { title: "美元结算", key: "dollarExr", align: "center", width: 100
        },
        { title: "换算人民币结算", key: "rmbExr", align: "center", width: 100
        },
        { title: "备注", key: "remark", align: "center", width: 80
        }
      ]
    };
  },
  created() {
    this.getRate();
  },
  methods: {
    changePage(page) {
      this.searchModal.currentPage = page;
      this.getList();
    },
    getList() {
      for ( let p in this.searchModal ) {
        if ( this.searchModal[p] == '' ) {
          delete this.searchModal[p];
        }
      }
      if ( this.searchModal.createTimeStart && this.searchModal.createTimeStart.getDate ) {
        this.searchModal.createTimeStart = formatDate (this.searchModal.createTimeStart, 'yyyy-MM-dd') + ' 00:00:00'
      }
      if ( this.searchModal.createTimeEnd && this.searchModal.createTimeEnd.getDate ) {
        this.searchModal.createTimeEnd = formatDate (this.searchModal.createTimeEnd, 'yyyy-MM-dd') + ' 23:59:59'
      }
      getOperateReportList('operate_report',this.searchModal)
        .then(res => {
          this.loading = false;
          if (res && res.data.success) {
            this.tableData = res.data.data || [];
            if (res.data.page) {
              this.searchModal.totalNumber = res.data.page.totalNumber;
              this.searchModal.currentPage = res.data.page.currentPage;
            } else {
              this.searchModal.totalNumber = 1;
              this.searchModal.currentPage = 1;
            }
          } else {
            this.$Message.error( this.$t("error") + res.data.message );
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getRate() {
      getRate()
        .then(res => {
          this.loading = false;
          if (res && res.data.success) {
            this.rate = res.data.data
            this.search();
          } else {
            this.$Message.error(this.$t("error") + res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    search(data) {
      if ( data ) {
        data.rate = this.rate
      } else {
        this.searchModal.rate = this.rate
      }
      Object.assign(this.searchModal, data);
      this.getList();
    },
    reset() {
      this.searchModal = new SearchModal();
      this.getList();
    }
  }
};
</script>
<style lang="less" scoped>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

