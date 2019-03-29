<template>
  <div>
    <Form ref="usersearch" inline>
      <Row>
        <Col span="2">数据选项:</Col>
        <Col span="5">
          <Select v-model="searchValue" clearable ref="dataSel">
            <Option
              v-for="(item,index) in searchList"
              :value="item.value"
              :key="index"
              :placeholder="searchList[0].label"
            >{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span="10" offset="7">
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
      searchValue: "TODAY",
      searchList: [
        {
          value: "TODAY",
          label: "今日渠道转化"
        },
        {
          value: "HISTORY",
          label: "历史渠道转化"
        }
      ]
    };
  },
  created() {
    this.getCharts({ channelConversionEnum: this.searchValue });
  },
  methods: {
    getCharts(obj) {
      getRiskMap("channel_transformation", obj)
        .then(res => {
          if (res.data.success === true) {
            if (res.data.data) {
              let obj = res.data.data;
              obj.series.map(item => {
                item["yAxisIndex"] = item.yaxisIndex;
              });
              obj["xAxis"] = formatyAxis(obj.xaxis);
              obj["yAxis"] = formatyAxis(obj.yaxis);
              obj.grid = {
                bottom: 100
              }
              this.chartsConf = obj;
            } else {
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
        channelConversionEnum: this.searchValue
      };
      this.getCharts({ channelConversionEnum: this.searchValue });
      this.$emit("tableSearch", data);
    },
    handleReset() {
      this.searchValue = "TODAY";
      this.getCharts({ channelConversionEnum: this.searchValue });
      this.$emit("reset");
    }
  }
};
</script>
