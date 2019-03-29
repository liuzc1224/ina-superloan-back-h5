<template>
  <div>
    <Card style="margin-bottom:10px">
      <Row>
        <Button type="primary" @click="importPop = true">导入统一模板表格</Button>
        <Button type="primary" @click="exportsAll" style="margin-left:10px">导出报表图</Button>
        <Button
          type="primary"
          :loading="modal_loading"
          @click="clearAll"
          style="margin-left:10px"
        >清除所有数据</Button>
      </Row>
    </Card>
    <Card style="margin-bottom:10px">
      <Row>
        <Col span="24">
          <c-chart
            :conf="chartsConf"
            v-if="chartsConf"
            :styles="{height:'4000px',width:'100%'}"
            :fullScreenStyle="{height:'4000px',width:'100%'}"
            ref="allDom"
          ></c-chart>
        </Col>
      </Row>
    </Card>
    <Modal v-model="importPop" title="选择文件导入" width="360">
      <Row>
        <Col span="6">
          <span>批量导入</span>
        </Col>
        <Col span="8">
          <Upload
            ref="uploadFile"
            with-credentials
            :action="`${baseUrl}/risk/statement/import`"
            :on-format-error="handleFormatError"
            :on-success="handleSuccess"
          >
            <Button icon="ios-cloud-upload-outline">选择文件</Button>
          </Upload>
        </Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
import CChart from "@/components/charts/commonChart";
import config from "@/config";
import { downloadFile } from "@/libs/util";
import { delRiskData, getRiskMap } from "@/api/loanReport";
import { formatyAxis } from "@/libs/util";
const Con_grid = [
  { left: "15%", top: "2%", width: "80%", height: "10%" },
  { left: "15%", top: "14%", width: "80%", height: "10%" },
  { left: "15%", top: "26%", width: "80%", height: "10%" },
  { left: "15%", top: "38%", width: "80%", height: "10%" },
  { left: "15%", top: "50%", width: "80%", height: "10%" },
  { left: "15%", top: "62%", width: "80%", height: "10%" },
  { left: "15%", top: "74%", width: "80%", height: "10%" }
];
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
  name: "total-data",
  components: {
    CChart
  },
  data() {
    return {
      chartsConf: null,
      importPop: false,
      modal_loading: false
    };
  },
  created() {
    this.baseUrl;
    if (process.env.NODE_ENV === "onlinetest") {
      this.baseUrl = config.baseUrl.online;
    } else if (process.env.NODE_ENV === "production") {
      this.baseUrl = config.baseUrl.pro;
    } else {
      this.baseUrl = config.baseUrl.dev;
    }
    this.getMap();
  },
  mounted() {
    //测试配置项
    let testOption = {
      //title 标题
      title: [
        {
          text: "2019年1月4日印尼数据",
          top: "top",
          left: "center"
        },
        {
          text: "今日订单审核报表",
          textStyle: {
            fontSize: 16,
            fontWeight: "normal"
          },
          left: "10%",
          top: "1%"
        },
        {
          text: "历史订单审核趋势",
          textStyle: {
            fontSize: 16,
            fontWeight: "normal"
          },
          left: "10%",
          top: "13%"
        },
        {
          text: "今日信审人员审核情况",
          textStyle: {
            fontSize: 16,
            fontWeight: "normal"
          },
          left: "10%",
          top: "25%"
        },
        {
          text: "历史放款情况",
          textStyle: {
            fontSize: 16,
            fontWeight: "normal"
          },
          left: "10%",
          top: "37%"
        },
        {
          text: "历史还款情况",
          textStyle: {
            fontSize: 16,
            fontWeight: "normal"
          },
          left: "10%",
          top: "49%"
        },
        {
          text: "渠道转化情况",
          textStyle: {
            fontSize: 16,
            fontWeight: "normal"
          },
          left: "10%",
          top: "61%"
        },
        {
          text: "今日遗留审核订单",
          textStyle: {
            fontSize: 16,
            fontWeight: "normal"
          },
          left: "10%",
          top: "73%"
        },
        {
          text: "今日拒绝情况",
          textStyle: {
            fontSize: 16,
            fontWeight: "normal"
          },
          left: "16%",
          top: "87%"
        }
      ],
      //grid 各坐标系位置， 宽高
      grid: [
        { left: "15%", top: "2%", width: "80%", height: "10%" },
        { left: "15%", top: "14%", width: "80%", height: "10%" },
        { left: "15%", top: "26%", width: "80%", height: "10%" },

        { left: "15%", top: "38%", width: "80%", height: "10%" },

        { left: "15%", top: "50%", width: "80%", height: "10%" },
        { left: "15%", top: "62%", width: "80%", height: "10%" },
        { left: "15%", top: "74%", width: "80%", height: "10%" }
      ],
      //tooltip 数据显示
      tooltip: {
        formatter: "{a}: ({c})"
      },
      //legend 类目标志
      legend: [
        {
          data: ["机审案件数", "机审通过数", "初审通过数", "放款笔数"],
          left: 0,
          top: "2%",
          orient: "vertical"
        },
        {
          data: ["机审案件数 ", "初审通过数 ", "放款笔数 "],
          left: 0,
          top: "14%",
          orient: "vertical"
        },
        {
          data: ["初审案件数", "初审通过数  ", "初审通过率"],
          left: 0,
          top: "26%",
          orient: "vertical"
        },
        {
          data: ["放款笔数  ", "复借放款笔数", "复借率"],
          left: 0,
          top: "38%",
          orient: "vertical"
        },
        {
          data: ["到期应还款笔数", "到期未还笔数", "到期未还订单占比"],
          left: 0,
          top: "50%",
          orient: "vertical"
        },
        {
          data: ["设备量", "放款人数", "下载到放款"],
          left: 0,
          top: "62%",
          orient: "vertical"
        }
      ],
      //toolbox 工具栏
      toolbox: {
        feature: {
          //系统:下载功能
          saveAsImage: {}
        }
      },
      //x轴配置，接口返回的A为小写，需要手动替换为大写
      //gridIndex  关联对应的grid 坐标系位置配置
      xAxis: [
        { gridIndex: 0, type: "category", data: ["2019.1.12"] },
        {
          gridIndex: 1,
          type: "category",
          data: [
            "2019.1.12",
            "2019.1.13",
            "2019.1.14",
            "2019.1.15",
            "2019.1.16"
          ]
        },
        {
          gridIndex: 2,
          type: "category",
          data: [
            "2019.1.12",
            "2019.1.13",
            "2019.1.14",
            "2019.1.15",
            "2019.1.16"
          ]
        },
        { gridIndex: 3, type: "category" },
        { gridIndex: 4, type: "category" },
        { gridIndex: 5, type: "category" },
        {
          gridIndex: 6,
          type: "category",
          data: ["历史遗留订单数", "今日审核订单数", "今日遗留订单数"]
        }
      ],
      //y轴配置，接口返回的A为小写，需要手动替换为大写
      //gridIndex  关联对应的grid 坐标系位置配置
      //若同个坐标系有两个y轴，关联同个gridIndex 即可
      yAxis: [
        {
          gridIndex: 0,
          type: "value",
          axisLabel: {
            formatter: "{value} %"
          }
        },
        { gridIndex: 1, type: "value" },
        { gridIndex: 2, type: "value" },
        {
          gridIndex: 3,
          type: "value"
        },
        {
          gridIndex: 4,
          type: "value"
        },
        { gridIndex: 5, type: "value" },
        { gridIndex: 6, type: "value" },
        {
          gridIndex: 2,
          type: "value",
          axisLabel: {
            formatter: "{value} %"
          }
        },
        {
          gridIndex: 3,
          type: "value",
          axisLabel: {
            formatter: "{value} %"
          }
        },
        {
          gridIndex: 4,
          type: "value",
          axisLabel: {
            formatter: "{value} %"
          }
        },
        {
          gridIndex: 5,
          type: "value",
          axisLabel: {
            formatter: "{value} %"
          }
        }
      ],
      //series 数据配置项 有多个坐标系时，需要关联对应的x，y轴配置，xAxisIndex，yAxisIndex 对应（xAxis，yAxis）的下标
      series: [
        {
          name: "机审案件数",
          type: "bar",
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: [20],
          stack: "今日单日实际放款数据",
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{a}:{c}%"
            }
          }
        },
        {
          name: "机审通过数",
          type: "bar",
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: [10],
          stack: "今日单日实际放款数据",
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{a}:{c}%"
            }
          }
        },
        {
          name: "初审通过数",
          type: "bar",
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: [50],
          stack: "今日单日实际放款数据",
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{a}:{c}%"
            }
          }
        },
        {
          name: "放款笔数",
          type: "bar",
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: [20],
          stack: "今日单日实际放款数据",
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{a}:{c}%"
            }
          }
        },
        {
          name: "机审案件数 ",
          type: "line",
          xAxisIndex: 1,
          yAxisIndex: 1,
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{a}:{c}"
            }
          },
          data: [330, 220, 110, 201, 111]
        },
        {
          name: "初审通过数 ",
          type: "line",
          xAxisIndex: 1,
          yAxisIndex: 1,
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{a}:{c}"
            }
          },
          data: [220, 123, 342, 453, 131]
        },
        {
          name: "放款笔数 ",
          type: "line",
          xAxisIndex: 1,
          yAxisIndex: 1,
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{a}:{c}"
            }
          },
          data: [234, 234, 235, 353, 234]
        },
        {
          name: "初审案件数",
          type: "bar",
          xAxisIndex: 2,
          yAxisIndex: 2,
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{a}:{c}"
            }
          },
          data: [330, 220, 110, 201, 111]
        },
        {
          name: "初审通过数  ",
          type: "bar",
          xAxisIndex: 2,
          yAxisIndex: 2,
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{a}:{c}"
            }
          },
          data: [220, 123, 342, 453, 131]
        },
        {
          name: "初审通过率",
          type: "line",
          xAxisIndex: 2,
          yAxisIndex: 7,
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{a}:{c}%"
            }
          },
          data: [234, 234, 235, 353, 234]
        },
        {
          name: "放款笔数  ",
          type: "bar",
          xAxisIndex: 3,
          yAxisIndex: 3,
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{a}:{c}"
            }
          },
          data: [234, 234, 235, 353, 234]
        },
        {
          name: "复借放款笔数",
          type: "bar",
          xAxisIndex: 3,
          yAxisIndex: 3,
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{a}:{c}"
            }
          },
          data: [11, 22, 344, 545, 234]
        },
        {
          name: "复借率",
          type: "line",
          xAxisIndex: 3,
          yAxisIndex: 8,
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{a}:{c}%"
            }
          },
          data: [10, 20, 30, 40, 50]
        },
        {
          name: "到期应还款笔数",
          type: "bar",
          xAxisIndex: 4,
          yAxisIndex: 4,
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{a}:{c}"
            }
          },
          data: [80, 36, 12, 54]
        },
        {
          name: "到期未还笔数",
          type: "bar",
          xAxisIndex: 4,
          yAxisIndex: 4,
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{a}:{c}"
            }
          },
          data: [20, 30, 23, 87]
        },
        {
          name: "到期未还订单占比",
          type: "line",
          xAxisIndex: 4,
          yAxisIndex: 9,
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{a}:{c}%"
            }
          },
          data: [10, 20, 12, 40]
        },
        {
          name: "设备量",
          type: "bar",
          xAxisIndex: 5,
          yAxisIndex: 5,
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{a}:{c}"
            }
          },
          data: [20, 30]
        },
        {
          name: "放款人数",
          type: "bar",
          xAxisIndex: 5,
          yAxisIndex: 5,
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{a}:{c}"
            }
          },
          data: [20, 30]
        },
        {
          name: "下载到放款",
          type: "line",
          xAxisIndex: 5,
          yAxisIndex: 10,
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{a}:{c}"
            }
          },
          data: [20, 30]
        },
        {
          name: "辅助",
          type: "bar",
          stack: "总量",
          xAxisIndex: 6,
          yAxisIndex: 6,
          itemStyle: {
            normal: {
              barBorderColor: "rgba(0,0,0,0)",
              color: "rgba(0,0,0,0)"
            },
            emphasis: {
              barBorderColor: "rgba(0,0,0,0)",
              color: "rgba(0,0,0,0)"
            }
          },
          data: [0, 0, 2900]
        },
        {
          name: "生活费",
          type: "bar",
          stack: "总量",
          xAxisIndex: 6,
          yAxisIndex: 6,
          label: {
            normal: {
              show: true,
              position: "inside"
            }
          },
          data: [900, 2900, 300]
        },
        {
          name: "访问来源",
          type: "pie",
          radius: "35%",//圆饼的大小
          center: ["50%", "92%"],//圆饼中心点的位置
          data: [
            { value: 335, name: "直接访问" },
            { value: 310, name: "邮件营销" },
            { value: 234, name: "联盟广告" },
            { value: 135, name: "视频广告" },
            { value: 1548, name: "搜索引擎" }
          ]
        }
      ]
    };
    // this.chartsConf = testOption;
  },
  methods: {
    getMap() {
      getRiskMap("operate_map", { isShowSummary: false })
        .then(res => {
          if (res.data.success === true) {
            if (res.data.data) {
              let obj = res.data.data;
              obj["xAxis"] = formatyAxis(obj.xaxis);
              obj["yAxis"] = formatyAxis(obj.yaxis);
              obj.series.map((item, i) => {
                item.xAxisIndex = item.xaxisIndex;
                item.yAxisIndex = item.yaxisIndex;
                item.label = {
                  normal: {
                    show: true,
                    position: "inside",
                    formatter: "{c}"
                  }
                };
                if (item.name === "辅助") {
                  item.itemStyle = {
                    normal: {
                      barBorderColor: "rgba(0,0,0,0)",
                      color: "rgba(0,0,0,0)"
                    },
                    emphasis: {
                      barBorderColor: "rgba(0,0,0,0)",
                      color: "rgba(0,0,0,0)"
                    }
                  };
                }
                if (item.type === "pie") {
                  item.label = labelSer;
                  item.data.forEach(item => {
                    if (item.name === "其他") {
                      orterLabel.normal.formatter = this.formatterOrther(
                        item.formatter
                      ).join("\n");
                      item.label = orterLabel;
                      return false;
                    }
                  });
                }
              });
              obj["grid"] = Con_grid;
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
    exportsAll() {
      let dataUrl = this.$refs["allDom"].dom.getDataURL({
        pixelRatio: 2,
        backgroundColor: "#fff",
        type: "png"
      });
      downloadFile("印尼数据", dataUrl);
    },
    clearAll() {
      this.modal_loading = true;
      delRiskData()
        .then(res => {
          this.modal_loading = false;
          if (res.data.success === true) {
            this.$Message.success("清楚数据成功!");
            this.getMap();
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(err => {
          this.modal_loading = false;
          console.log(err);
        });
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "上传文件类型错误",
        desc: "上传文件:" + file.name + "请选择.xls"
      });
    },
    handleSuccess(res, file) {
      if (res.success) {
        this.uploadCount = res.data;
      } else {
        this.$Message.error(res.message);
      }
    },
    clearUploadList() {
      if (this.$refs.uploadFile) {
        this.$refs.uploadFile.clearFiles();
      }
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

<style>
</style>
