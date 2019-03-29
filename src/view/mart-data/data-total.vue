<template>
  <div>
    <Row :gutter="16">
      <i-col :xs="12" :md="8" :lg="8" v-for="(infor, i) in registerData" :key="`infor-${i}`" style="margin-bottom: 15px;height: 120px">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36" :left="25">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20">
      <i-col :md="24" :lg="24" style="margin-bottom: 20px;">
        <Card shadow>
          <line-chart
            style="height: 310px"
            :dateArray="dateArray"
            :regisiterArray="regisiterArray"
            :loginArray="loginArray"
            :downloadCountArray="downloadCountArray"
            :downLoadUserCountArray="downLoadUserCountArray"
          />
        </Card>
      </i-col>
    </Row>
    <!--<Row :gutter="20">-->
    <!--<i-col :xs="12" :md="12" :lg="6" v-for="(infor, i) in productUseData" :key="`infor-${i}`" style="height: 120px;padding: 0 10px 20px;">-->
    <!--<infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36" :left="25">-->
    <!--<count-to :end="infor.count" count-class="count-style"/>-->
    <!--<p>{{ infor.title }}</p>-->
    <!--</infor-card>-->
    <!--</i-col>-->
    <!--</Row>-->
  </div>
</template>

<script>
import InforCard from "_c/info-card";
import CountTo from "_c/count-to";
import LineChart from "./line-chart.vue";
import { getTotalDataList } from "@/api/martData";
  import {dateToString} from '@/libs/tools'
export default {
  name: "data_center",
  components: {
    InforCard,
    CountTo,
    LineChart
  },
  data() {
    return {
      dateArray: [],
      regisiterArray: [],
      loginArray: [],
      downloadCountArray: [],
      downLoadUserCountArray: [],

      registerData: []
      // productUseData: []
    };
  },
  mounted() {
    this.getPageInfo();
  },
  methods: {
    getPageInfo() {
      getTotalDataList().then(res => {
        if (res.data.success) {
          let data = res.data.data;
          for ( let p in data.loginMap ) {
            //  创建横坐标
            let showDate = p.slice(0, 10)
            this.dateArray.push(showDate);
            // 创建纵坐标
            this.loginArray.push(data.loginMap[p])
            this.regisiterArray.push(data.registerMap[p])
            this.downLoadUserCountArray.push(data.downLoadUserContMap[p])
            this.downloadCountArray.push(data.downloadCountMap[p])
          }

          // 卡片数据
          this.registerData = [
            {
              title: this.$t("martDataTotal.registerTotal"),
              icon: "md-person-add",
              count: data.totalRegisterCount,
              color: "#2d8cf0"
            },
            {
              title: this.$t("martDataTotal.registerToday"), icon: "md-locate", count: data.todayRegisterCount, color: "#19be6b" },
            { title: this.$t('martDataTotal.loginToday'), icon: 'ios-card', count: data.todayLoginCount, color: '#ff9900' },
            { title: '今日点击下载用户总数', icon: 'ios-contact', count: data.downloadNewUserCount, color: '#ed3f14' },
            { title: '今日注册用户点击下载总数', icon: 'md-chatbubbles', count: data.todayRegisterCount, color: '#E46CBB' }
          ];
            // { title: this.$t('dataCenter.registerToday'), icon: 'md-locate', count: 5, color: '#19be6b' },
            // { title: this.$t('dataCenter.recordAdd'), icon: 'md-map', count: 5, color: '#9A66E4' },
            // { title: this.$t('dataCenter.recordQueryToTal'), icon: 'md-search', count: 5, color: '#19be6b' },
            // { title: this.$t('dataCenter.recordQueryAdd'), icon: 'ios-browsers-outline', count: 5, color: '#2d8cf0' }
        } else {
          this.$Message.error(res.data.message);
        }
      });
    }
  }
};
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
