<template>
  <div>
    <Form ref="usersearch" inline>
      <Row>
        <Col span="5">
          <FormItem :label="$t('userList.registerTime')" :label-width="60">
            <DatePicker
              type="date"
              ref="createTimeStart"
              :placeholder="$t('accountList.timeStart')"
              v-model="searchForm.createTimeStart"
              style="width:100%;"
            ></DatePicker>
          </FormItem>
        </Col>
        <Col span="1" style="text-align: center">~</Col>
        <Col span="4">
          <FormItem>
            <DatePicker
              type="date"
              ref="createTimeEnd"
              :placeholder="$t('accountList.timeEnd')"
              v-model="searchForm.createTimeEnd"
            ></DatePicker>
          </FormItem>
        </Col>
        <Col span="10" offset="4">
          <c-chart :conf="chartsConf" v-if="chartsConf"></c-chart>
        </Col>
      </Row>
      <Row>
        <FormItem>
          <Button type="primary" @click="handleSubmit">{{$t('userList.search')}}</Button>
          <Button @click="handleReset" style="margin-left:10px">{{$t('userList.reset')}}</Button>
        </FormItem>
      </Row>
    </Form>
  </div>
</template>
<script>
import { formatDate } from "@/assets/js/date";
import CChart from "@/components/charts/commonChart";
import { getRiskMap } from "@/api/loanReport";
import { formatyAxis } from "@/libs/util";
export default {
  name: "tablesearch",
  components: {
    CChart
  },
  data() {
    return {
      chartsConf: null,
      searchForm: {
        createTimeStart: null,
        createTimeEnd: null
      }
    };
  },
  created() {
    this.getCharts({})
  },
  methods: {
     getCharts(obj) {
      getRiskMap("historical_repayment", obj)
        .then(res => {
          if (res.data.success === true) {
            if (res.data.data) {
              let obj = res.data.data;
              obj.series.map(item=>{
                item['yAxisIndex'] = item.yaxisIndex;
              });
              obj["xAxis"] = formatyAxis(obj.xaxis);
              obj["yAxis"] = formatyAxis(obj.yaxis);
              obj.grid = {
                bottom: 100
              }
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
    handleSubmit() {
      let data = {
        beginDate:
          this.searchForm.createTimeStart &&
          formatDate(
            new Date(this.searchForm.createTimeStart),
            "yyyy-MM-dd hh:mm:ss"
          ),
        endDate:
          this.searchForm.createTimeEnd &&
          formatDate(new Date(this.searchForm.createTimeEnd), "yyyy-MM-dd") +
            " 23:59:59"
      };
      this.getCharts(data);
      this.$emit("tableSearch", data);
    },
    handleReset() {
      this.$refs.createTimeStart.handleClear();
      this.$refs.createTimeEnd.handleClear();
      this.getCharts({});
      this.$emit("reset");
    }
  }
};
</script>
