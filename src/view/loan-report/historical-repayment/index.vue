<template>
  <div>
    <Card style="margin-bottom:10px">
      <table-search @tableSearch="search" @reset="reset"></table-search>
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
import { getRiskData } from "@/api/loanReport";
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
      searchModal: new SearchModal(),
      columns: [
        {
          title: "放款时间",
          key: "date",
          align: "center",
          render: function(h, params) {
            return h(
              "div",
              formatDate(new Date(this.row.payDate), "yyyy/MM/dd")
            );
          }
        },
        {
          title: "放款笔数",
          key: "payCount",
          align: "center"
        },
        {
          title: "放款本金",
          key: "payPrincipal",
          align: "center"
        },
        {
          title: "到期应还款笔数",
          key: "expireShouldRepayCount",
          align: "center"
        },
        {
          title: "到期应还本金",
          key: "expireShouldRepayPrincipal",
          align: "center"
        },
        {
          title: "已还清笔数",
          key: "payOffCount",
          align: "center"
        },
        {
          title: "已还清本金",
          key: "payOffPrincipal",
          align: "center"
        },
        {
          title: "到期未还笔数",
          key: "expireUnRepayCount",
          align: "center"
        },
        {
          title: "到期未还本金",
          key: "expireUnRepayPrincipal",
          align: "center"
        },
        {
          title: "到期未还订单占比",
          key: "expireUnRepayCountProportion",
          align: "center",
          render: function(h, params) {
            return h(
              "div",
              (this.row.expireUnRepayCountProportion*100).toFixed(2) + "%"
            );
          }
        },
        {
          title: "到期未还本金占比",
          key: "expireUnRepayPrincipalProportion",
          align: "center",
          render: function(h, params) {
            return h(
              "div",
              (this.row.expireUnRepayPrincipalProportion*100).toFixed(2) + "%"
            );
          }
        }
      ]
    };
  },
  created() {
    this.search();
  },
  methods: {
    changePage(page) {
      this.searchModal.currentPage = page;
      this.getList();
    },
    getList() {
      getRiskData("historical_repayment", this.searchModal)
        .then(res => {
          this.loading = false;
          if (res && res.data.success) {
            this.tableData = res.data.data;
            if (res.data.page) {
              this.searchModal.totalNumber = res.data.page.totalNumber;
              this.searchModal.currentPage = res.data.page.currentPage;
            } else {
              this.searchModal.totalNumber = 1;
              this.searchModal.currentPage = 1;
            }
          } else {
            this.$Message.error(this.$t("error") + res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    search(data) {
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

