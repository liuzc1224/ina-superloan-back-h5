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
import { getRegUserList } from "@/api/user";
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
      searchModal: new SearchModal(),
      columns: [
        { title: this.$t("userList.userNo"), type: "index", align: "center" },
        {
          title: this.$t("userList.phoneNumber"),
          key: "phoneNumber",
          align: "center"
        },
        {
          title: this.$t("userList.createTime"),
          key: "createTime",
          align: "center",
          render: function(h, params) {
            return h(
              "div",
              formatDate(new Date(this.row.createTime), "yyyy-MM-dd  hh:mm:ss")
            );
          }
        },
        {
          title: this.$t("userList.status"),
          key: "status",
          align: "center",
          render: (h, params) => {
            return h("div", this.$t("userList.naomal"));
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
      getRegUserList(this.searchModal)
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

