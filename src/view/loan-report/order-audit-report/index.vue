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
              formatDate(new Date(this.row.date), "yyyy/MM/dd")
            );
          }
        },
        {
          title: "机审案件数",
          key: "machineAuditCount",
          align: "center"
        },
        {
          title: "机审拒绝数",
          key: "machineRefuseCount",
          align: "center"
        },
        {
          title: "机审通过数",
          key: "machinePassCount",
          align: "center"
        },
        {
          title: "机审通过率",
          key: "machinePassRate",
          align: "center",
          render: function(h, params) {
            return h(
              "div",
              (this.row.machinePassRate*100).toFixed(2) + "%"
            );
          }
        },
        {
          title: "初审拒绝数",
          key: "firstAuditRefuseCount",
          align: "center"
        },
        {
          title: "机审-初审拒绝率",
          key: "machinePassFirstAuditRefuseRate",
          align: "center",
          render: function(h, params) {
            return h(
              "div",
              (this.row.machinePassFirstAuditRefuseRate*100).toFixed(2) + "%"
            );
          }
        },
        {
          title: "初审关闭数",
          key: "firstAuditCloseCount",
          align: "center"
        },
        {
          title: "初审通过数",
          key: "firstAuditPassCount",
          align: "center"
        },
        {
          title: "申请-初审通过率",
          key: "applyFirstAuditPassRate",
          align: "center",
          render: function(h, params) {
            return h(
              "div",
              (this.row.applyFirstAuditPassRate*100).toFixed(2) + "%"
            );
          }
        },
        {
          title: "机审-初审通过率",
          key: "machineFirstAuditPassRate",
          align: "center",
          render: function(h, params) {
            return h(
              "div",
              (this.row.machineFirstAuditPassRate*100).toFixed(2) + "%"
            );
          }
        },
        {
          title: "终审拒绝数",
          key: "finalAuditRefuseCount",
          align: "center"
        },
        {
          title: "终审通过数",
          key: "finalAuditPassCount",
          align: "center"
        },
        {
          title: "放款失败笔数",
          key: "payFailCount",
          align: "center"
        },
        {
          title: "放款笔数",
          key: "payCount",
          align: "center"
        },
        {
          title: "已还清笔数",
          key: "payOffCount",
          align: "center"
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
      getRiskData("order_audit_report", this.searchModal)
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

