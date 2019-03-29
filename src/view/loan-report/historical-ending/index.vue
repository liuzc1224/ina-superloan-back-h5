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
import { SearchModal } from "./search.modal";
import { formatDate } from "@/assets/js/date";
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
          title: "时间",
          key: "date",
          align: "center",
        },
        {
          title: "合同金额",
          key: "contractAmount",
          align: "center"
        },
        {
          title: "放款金额",
          key: "payAmount",
          align: "center"
        },
        {
          title: "还款金额",
          key: "repayAmount",
          align: "center"
        },
        {
          title: "罚息",
          key: "interestPenalty",
          align: "center"
        },
        {
          title: "利息",
          key: "interest",
          align: "center"
        },
        {
          title: "服务费",
          key: "serviceCharge",
          align: "center"
        },
        {
          title: "放款笔数",
          key: "payCount",
          align: "center"
        },
        {
          title: "还款笔数",
          key: "repayCount",
          align: "center"
        },
        {
          title: "复借申请笔数",
          key: "againLoanCount",
          align: "center"
        },
        {
          title: "复借放款笔数",
          key: "againPayCount",
          align: "center"
        },
        {
          title: "复借率",
          key: "againLoanRate",
          align: "center",
          render: function(h, params) {
            return h(
              "div",
              (this.row.againLoanRate*100).toFixed(2) + "%"
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
      getRiskData("historical_ending", this.searchModal)
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

