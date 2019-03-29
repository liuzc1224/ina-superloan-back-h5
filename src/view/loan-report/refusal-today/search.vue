<template>
  <div>
    <Form ref="usersearch" inline>
      <Row style="margin-bottom:20px;">
        <Col span="2" style="text-align: center;line-height:30px;">拒绝阶段</Col>
        <Col span="3">
          <Select v-model="searchValue" clearable ref="dataSel">
            <Option
              v-for="(item,index) in searchList"
              :value="item.value"
              :key="index"
              :placeholder="searchList[0].label"
            >{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span="18" offset="1">
          <c-chart :conf="chartsConf" v-if="chartsConf" :styles="{height:'400px',width:'100%'}"></c-chart>
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
const labelSer = {
  normal: {
    formatter: "{hr|}\n  {b|{b}:}  {per|{d}%}  ",
    backgroundColor: "#eee",
    borderColor: "#aaa",
    borderWidth: 1,
    borderRadius: 4,
    rich: {
      a: {
        color: "#999",
        lineHeight: 14,
        align: "center"
      },
      hr: {
        borderColor: "#aaa",
        width: "100%",
        borderWidth: 0.5,
        height: 0
      },
      b: {
        fontSize: 12,
        lineHeight: 33
      },
      per: {
        color: "#eee",
        backgroundColor: "#334455",
        padding: [2, 4],
        borderRadius: 2
      }
    }
  }
};
let orterLabel = {
  normal: {
    backgroundColor: "#eee",
    borderColor: "#777",
    borderWidth: 1,
    borderRadius: 4,
    rich: {
      title: {
        color: "#eee",
        align: "center"
      },
      abg: {
        backgroundColor: "#333",
        width: "100%",
        align: "right",
        height: 20,
        borderRadius: [4, 4, 0, 0]
      },
      Txt: {
        height: 18,
        align: "left"
      },
      rate: {
        width: 60,
        align: "right",
        padding: [0, 10, 0, 0]
      }
    }
  }
};
export default {
  name: "tablesearch",
  components: {
    CChart
  },
  data() {
    return {
      chartsConf: null,
      searchValue: null,
      searchList: [
        {
          value: "预审",
          label: "预审"
        },
        {
          value: "初审",
          label: "初审"
        },
        {
          value: "复审",
          label: "复审"
        },
        {
          value: "终审",
          label: "终审"
        }
      ]
    };
  },
  created() {
    this.getCharts();
  },
  methods: {
    getCharts() {
      getRiskMap("refusal_today", {
        orderAuditStatementEnum: this.searchValue
      })
        .then(res => {
          if (res.data.success === true) {
            if (res.data.data) {
              let obj = res.data.data;
              obj.series[0].label = labelSer;
              obj.series[0].radius = "40%";
              obj.series[0].center = ["50%","60%"];
              obj.series[0].data.forEach(item => {
                if (item.name === "其他") {
                  orterLabel.normal.formatter = this.formatterOrther(
                    item.formatter
                  ).join("\n");
                  item.label = orterLabel;
                  return false;
                }
              });
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
        refuseStage: this.searchValue
      };
      this.getCharts();
      this.$emit("tableSearch", data);
    },
    handleReset() {
      this.searchValue = null;
      this.$refs.dataSel.clearSingleSelect();
      this.getCharts();
      this.$emit("reset");
    },
    formatterOrther(arr) {
      let strList = ["{title|{b}}{abg|}"];
      Object.keys(arr).map(k => {
        strList.push(`  {Txt|${k}}:{rate|${arr[k].toFixed(2)}%}`);
      });
      return strList;
    }
  }
};
</script>
