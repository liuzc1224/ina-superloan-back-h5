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
          title: "渠道",
          key: "channel",
          align: "center"
        },
        {
          title: "设备量",
          key: "deviceCount",
          align: "center"
        },
        {
          title: "注册人数",
          key: "registerCount",
          align: "center"
        },
        {
          title: "申请人数",
          key: "applyCount",
          align: "center"
        },
        {
          title: "放款人数",
          key: "payCount",
          align: "center"
        },
        {
          title: "逾期30天+人数",
          key: "overdueThirtyDayCount",
          align: "center"
        },
        {
          title: "下载到注册",
          key: "downloadToRegister",
          align: "center",
          render: function(h, params) {
            return h(
              "div",
              (this.row.downloadToRegister*100).toFixed(2) + "%"
            );
          }
        },
        {
          title: "下载到申请",
          key: "downloadToApply",
          align: "center",
          render: function(h, params) {
            return h(
              "div",
              (this.row.downloadToApply*100).toFixed(2) + "%"
            );
          }
        },
        {
          title: "下载到放款",
          key: "downloadToPay",
          align: "center",
          render: function(h, params) {
            return h(
              "div",
              (this.row.downloadToPay*100).toFixed(2) + "%"
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
      getRiskData("channel_transformation", this.searchModal)
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

