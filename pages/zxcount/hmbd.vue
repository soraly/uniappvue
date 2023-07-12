<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <!--顶部导航栏-->
    <nav-bar :isBack="true" :left-width="60" :title="title">
      <block slot="right">
        <view class="uni-list-cell-db">
          <text class="uni-subtitle">期数</text>
          <input class="uni-input" v-model="period" @blur="numberRange" @confirm="numberRange" />
        </view>
      </block>
    </nav-bar>
    <!--饼图-->
    <view class="mint-tab-container-item">
      <view class="tab-wrap">
        <view :class="isActive == 0 ? 'active' : ''" @click="tab(0)">特码</view>
        <view :class="isActive == 1 ? 'active' : ''" @click="tab(1)">正码</view>
      </view>
      <view class="mint-tab-container-item">
        <view class="title-box">
          <h4>当前统计期数：{{ period }}</h4>
        </view>
        <view id="chart" class="chart" v-show="isActive == 0">
          <l-echart ref="chart"></l-echart>
        </view>
        <view id="chartCold" class="chart" v-show="isActive == 1">
          <l-echart ref="chartCold"></l-echart>
        </view>
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
import { numberRange } from "../../utils/zxcount";
import echarts from '../../static/js/echarts.min.js';
import LEchart from '../../uni_modules/lime-echart/components/l-echart/l-echart.vue';
import NavBar from "../../components/common/navBar/navBar.vue";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "bstm",
  components: {
    AlertInjectLayer, CountFab, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      lotteryType: 1,
      title: "波色特码冷热图",
      period: 100,
      isInt: false,
      isActive: 0,
      colorList: ['#61a0a8', '#c23531', '#2f4554'],
      hotData: {},
      coldData: {},
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
    //返回
    back: function () {
      uni.reLaunch({
        url: "/pages/home/index/Index" // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
      });
    },
    getDeviceEchart() {
      const optionHot = this.hotData
      this.$refs.chart.init(echarts, chart => {
        console.log(optionHot)
        chart.setOption(optionHot);
      });
      this.numberRange()
    },
    tab(key) {
      this.isActive = key
      if (key == 0) {
        this.$refs.chart.setOption(this.hotData)
      } else {
        if (this.isInt == false) {  //判断是否初始化
          this.$refs.chartCold.init(echarts, chart => {
            chart.setOption(this.coldData)
          })
          this.isInt = true
        } else {
          this.$refs.chartCold.setOption(this.coldData)
        }
      }
    },
    numberRange: function () {
      let prams = { period: this.period }
      numberRange(prams).then(res => {
        let data = res.result
        let hot = data.special.series.data
        let cold = data.normal.series.data
        hot.forEach((item, index) => {
          hot[index].label = {
            color: this.colorList[index]
          };
        })
        cold.map((item, index) => {
          cold[index].label = {
            color: this.colorList[index]
          };
        })
        this.setOption(hot, 1)
        this.setOption(cold, 2)
      }).catch(err => {
        console.log(err)
      })
    },
    setOption: function (data, type = 1) {
      const option = {
        backgroundColor: "#fff",
        tooltip: {
          trigger: 'item'
        },
        color: this.colorList,
        legend: {
          orient: "horizontal",
          bottom: "6%",
          padding: [5, 5, 5, 5],
          borderWidth: 1,
          borderRadius: [5, 5, 5, 5],
          shadowColor: "#ccc",
          formatter: function (name) {
            var total = 0;
            var tarValue;
            for (var i = 0, l = data.length; i < l; i++) {
              total += data[i].value;
              if (data[i].name == name) {
                name = data[i].name
                tarValue = data[i].value;
              }
            }
            return name + " " + tarValue;
          },
        },
        series: [{
          type: "pie",
          label: {
            normal: {
              show: true,
              formatter: '{b}:{d}%\n({c}次)' //自定义显示格式(b:name, c:value, d:百分比)
            }
          },
          emphasis: {
            disabled: false,
            scale: true,
            scaleSize: 20,
            label: {
              fontWeight: 800,
              fontSize: 25
            }
          },
          radius: ['25%', '50%'],
          center: ["50%", "35%"],
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
          data: data
        }]
      }
      if (type == 1) {
        this.hotData = option
        this.$refs.chart.setOption(option)
      } else {
        this.coldData = option
        this.$refs.chartCold.setOption(option)
      }
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

.chart {
  width: 100%;
  max-width: 480px;
  height: 67vh;
}

.tab-wrap {
  display: flex;
  justify-content: space-between;
  line-height: 50px;
  height: 50px;
  font-size: 16px;
  color: #333;
  text-align: center;
  background: #fff;
}

.tab-wrap>uni-view.active {
  color: #07c160;
}

.tab-wrap>uni-view {
  flex: 1;
}

.title-box {
  box-sizing: border-box;
  padding: 9px 14px;
}

.title-box h4 {
  text-align: left;
  color: #333;
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
}
</style>