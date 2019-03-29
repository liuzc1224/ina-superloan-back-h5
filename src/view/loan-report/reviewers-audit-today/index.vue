<template>
  <div>
    <Card style="margin-bottom:10px">
      <Row>
        <Col span="10" offset="14">
          <c-chart :conf="chartsConf" v-if="chartsConf"></c-chart>
        </Col>
      </Row>
    </Card>
    <Card>
      <Table
        stripe
        :columns="columns"
        :data="tableData"
        :loading="loading"
        @on-sort-change="changeSort"
      ></Table>
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
import CChart from "@/components/charts/commonChart";
import { getRiskMap, getRiskData } from "@/api/loanReport";
import { getRegUserList } from "@/api/user";
import { formatyAxis } from "@/libs/util";
import { formatDate } from "@/assets/js/date";
import { SearchModal } from "./search.modal";
export default {
  name: "user-list",
  components: {
    CChart
  },
  data() {
    return {
      chartsConf: null,
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
          title: "姓名",
          key: "name",
          align: "center"
        },
        {
          title: "初审案件数",
          key: "firstAuditCount",
          align: "center",
          sortable: true
        },
        {
          title: "初审拒绝数",
          key: "firstAuditRefuseCount",
          align: "center"
        },
        {
          title: "初审通过数",
          key: "firstAuditPassCount",
          align: "center"
        },
        {
          title: "初审通过率",
          key: "firstAuditPassRate",
          align: "center",
          sortable: true,
          render: function(h, params) {
            return h(
              "div",
              (this.row.firstAuditPassRate*100).toFixed(2) + "%"
            );
          }
        }
      ]
    };
  },
  created() {
    this.search();
    this.getCharts();
  },
  methods: {
    changePage(page) {
      this.searchModal.currentPage = page;
      this.getList();
    },
    changeSort(item) {
      if (item.order === "asc") {
        this.searchModal.orderBy = true;
      } else {
        this.searchModal.orderBy = false;
      }
      this.searchModal.columns = item.key;
      this.getList();
      this.getCharts();
    },
    getCharts() {
      getRiskMap("reviewers_audit_today", this.searchModal)
        .then(res => {
          if (res.data.success === true) {
            if (res.data.data) {
              let obj = res.data.data;
              obj.series.map(item=>{
                item['yAxisIndex'] = item.yaxisIndex;
              });
              obj["xAxis"] = formatyAxis(obj.xaxis);
              obj["yAxis"] = formatyAxis(obj.yaxis);
              this.chartsConf = obj;
            }else{
                this.$Message.error("请先导入数据");
            }
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getList() {
      getRiskData("reviewers_audit_today", this.searchModal)
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

