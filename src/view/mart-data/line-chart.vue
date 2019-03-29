<template>
    <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
export default {
  name: 'serviceRequests',
  props:{
    dateArray:{ type:Array, default:[0, 0, 0, 0, 0, 0, 0] },
    regisiterArray:{ type:Array, default:[0, 0, 0, 0, 0, 0, 0] },
    loginArray:{ type:Array, default:[0, 0, 0, 0, 0, 0, 0] },
    downLoadUserCountArray:{ type:Array, default:[0, 0, 0, 0, 0, 0, 0] },
    downloadCountArray:{ type:Array, default:[0, 0, 0, 0, 0, 0, 0] }
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    drawChart () {
      const option = {
        color: ['#83CDD2', '#99CC82', '#FFE45F', '#F19EC2', '#A591C3', '#EF8586'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
            data:['每日注册用户数','每日登录用户数','每日点击下载用户总数','每日点击下载数']
        },
        // title: {
        //   left: 'center',
        //   text: this.$t('dataCenter.registerMonth'),
        // },
        grid: {
          // top: '3%',
          left: '1.2%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.dateArray
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '每日注册用户数',
            type: 'line',
            smooth: true,
            data: this.regisiterArray
          },
          {
            name: '每日登录用户数',
            type: 'line',
            smooth: true,
            data: this.loginArray
          },
          {
            name: '每日点击下载用户总数',
            type: 'line',
            smooth: true,
            data: this.downLoadUserCountArray
          },
          {
            name: '每日点击下载数',
            type: 'line',
            smooth: true,
            data: this.downloadCountArray
          }
        ]
      }
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(option)
      this.resize()
    }
  },
  mounted () {
    this.drawChart()
    on(window, 'resize', this.resize)
  },
  watch: {
    dateArray: function (newDate, oldDate) {
      this.drawChart()
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
