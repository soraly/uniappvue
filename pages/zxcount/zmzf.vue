<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <!--顶部导航栏-->
    <nav-bar :isBack="true" :title="title">
      <block slot="right">
        <view class="uni-list-cell-db">
          <text class="uni-subtitle">期数</text>
          <input class="uni-input" v-model="period" @blur="numberAnalyze" @confirm="numberAnalyze" />
        </view>
      </block>
    </nav-bar>
    <!--列表-->
    <view class="mint-tab-container-item">
      <view class="title-box">
        <h4>当前统计期数：{{ period }}</h4>
      </view>
      <view id="chart" class="charts-box">
        <l-echart ref="chart"></l-echart>
      </view>
    </view>
    <!--底部-->
    <view class="footer">
      <count-fab :lotterytype="lotteryType"></count-fab>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import CountFab from "../../components/common/fab/CountFab"
import { numberAnalyze } from "../../utils/zxcount";
import Empty from "../../components/common/empty/empty";
import echarts from '../../static/js/echarts.min.js';
import LEchart from '../../uni_modules/lime-echart/components/l-echart/l-echart.vue';
import NavBar from "../../components/common/navBar/navBar.vue";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "zmzf",
  components: {
    AlertInjectLayer, LEchart, Empty, CountFab, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      lotteryType: 1,
      title: "正码总分",
      type: 1,
      period: 100,
      chartDataHot: {
        backgroundColor: "#fff",
        //dataZoom-inside 内置型数据区域缩放组件 所谓内置 1平移：在坐标系中滑动拖拽进行数据区域平移。2缩放：PC端：鼠标在坐标系范围内滚轮滚动（MAC触控板类同;移动端：在移动端触屏上，支持两指滑动缩放。
        dataZoom: [
          {
            type: 'inside', //1平移 缩放
            throttle: '50', //设置触发视图刷新的频率。单位为毫秒（ms）。
            minValueSpan: 4, //用于限制窗口大小的最小值,在类目轴上可以设置为 5 表示 5 个类目
            start: 1, //数据窗口范围的起始百分比 范围是：0 ~ 100。表示 0% ~ 100%。
            end: 1, //数据窗口范围的结束百分比。范围是：0 ~ 100。
            zoomLock: true //如果设置为 true 则锁定选择区域的大小，也就是说，只能平移，不能缩放。
          }
        ],
        //直角坐标系 grid 中的 x 轴，
        xAxis: {
          name: '类型:',
          nameLocation: 'start',     //有start  和end 分别为左右
          nameTextStyle: {
            fontWeight: 800,
            align: "center",
            verticalAlign: "top",
            lineHeight: 50,
            color: "#333",
            fontSize: 13,
          },
          position: 'bottom',
          axisTick: {
            show: false
          },
          type: 'category', //'category' 类目轴，适用于离散的类目数据，为该类型时必须通过 data 设置类目数据。
          // 类目数据，在类目轴（type: 'category'）中有效。
          data: [],
          axisLabel: {
            interval: 'auto',
            color: "#333",
            margin: 20,
            fontWeight: "bold",
            fontSize: '13',
          }
        },
        //直角坐标系 grid 中的 y 轴，
        yAxis: {
          name: '(次)',
          type: 'value', //'value' 数值轴，适用于连续数据。
          nameTextStyle: {
            align: "right"
          },
          axisLabel: {
            color: "#333"
          }
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            type: 'bar', //折线图是用折线将各个数据点标志连接起来的图表，用于展现数据的变化趋势。和全局设置type效果一样,表示折线图
            tooltip: {
              formatter: function (param) {
                return param.marker + " " + param.name + "：" + param.value;
              },
              borderWidth: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              textStyle: {
                color: "#fff",
              }
            },
            // 系列中的数据内容数组。数组项通常为具体的数据项。
            data: [],
            // 折线条的样式
            // 折线拐点的样式
            itemStyle: {
              color: "#c23531"
            },
            barWidth: 30,
            symbol: 'circle', //拐点样式
            symbolSize: 10 //拐点大小
          }
        ]
      },
    }
  },
  onLoad(option) {
    // #ifdef APP-NVUE
    const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
    // #endif
    // #ifndef APP-NVUE
    const eventChannel = this.getOpenerEventChannel();
    // #endif
    eventChannel.on('argParams', function (data) {
      this.lotteryType = data.lotteryType
    })
    this.lotteryType = uni.getStorageSync('lotteryType')
    if (this.lotteryType == 1) {
      this.title = '香港' + this.title
    } else if (this.lotteryType == 2) {
      this.title = '澳门' + this.title
    } else if (this.lotteryType == 3) {
      this.title = '台湾' + this.title
    } else {
      this.title = '新加坡' + this.title
    }
    uni.setNavigationBarTitle({
      title: this.title
    });
    setTimeout(() => {
      this.getDeviceEchart();
    }, 600);
  },
  methods: {
    getDeviceEchart() {
      const optionHot = this.chartDataHot
      this.$refs.chart.init(echarts, chart => {
        console.log(optionHot)
        chart.setOption(optionHot);
      });
      this.numberAnalyze()
    },
    //返回
    back: function () {
      uni.reLaunch({
        url: "/pages/home/index/Index" // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
      });
    },
    numberAnalyze: function () {
      let prams = { type: this.type, period: this.period };
      numberAnalyze(prams).then(res => {
        this.chartDataHot.xAxis.data = res.result.xAxis.data
        this.chartDataHot.series[0].data = res.result.series.data
        this.$refs.chart.setOption(this.chartDataHot)
        console.log(this.chartDataHot)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.header-box,
.header,
.box-bg {
  height: 46px;
}

.input-view {
  font-size: 16px;
}

.uni-subtitle {
  font-size: 14px;
}

.footer {
  height: 80px;
}

.title-box {
  box-sizing: border-box;
  padding: 10px 0;
  text-align: center;
}

.title-box h4 {
  text-align: center;
  color: #07c160;
  font-size: 16px;
  line-height: 30px;
  font-weight: 400;
}
</style>