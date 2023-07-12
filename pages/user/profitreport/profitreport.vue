<template>
  <view class="log-box" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
    </NavBar>
    <view class="date-box">
      <view class="pre" @click="pre()">
        <view class="pre-item" v-show="isShowPre">
          <view class="text">
            前一天
          </view>
          <view class="coin-box">
            盈亏：
            <text class="coin" :class="lastAmount > 0 ? 'red' : lastAmount < 0 ? 'green' : ''">
              {{ lastAmount }}
            </text>
          </view>
        </view>
      </view>
      <view class="time-item">
        <view class="icon">
          <image src="/static/img/user/accountlog/date.png"></image>
        </view>
        <view class="time" @click="openTime">
          <view class="time-text">{{ showTime }}</view>
          <view class="coin-text">
            盈亏：
            <text class="coin" :class="total > 0 ? 'red' : total < 0 ? 'green' : ''">
              {{ total }}
            </text>
          </view>

        </view>
      </view>
      <view class="next" @click="next()">
        <view class="next-item" v-show="isShowNext">
          <view class="text">
            后一天
          </view>
          <view class="coin-box">
            盈亏：<text class="coin" :class="nextAmount > 0 ? 'red' : nextAmount < 0 ? 'green' : ''">{{ nextAmount }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="tip">温馨提示：2-20分钟注单延迟</view>
    <view v-if="loading" class="loading">
      <image src="/static/img/load.gif"></image>
      <view>加载中...</view>
    </view>

    <view class="list-box" v-else>
      <view class="list-item" v-for="(item, index) in list">
        <view class="top">
          <view class="item-top">
            <image class="img" :src="item.logo || '/static/img/cp.png'"></image>
            <text class="title">{{ item.title }}</text>
          </view>
          <view class="item-top right-item">
            <view class="coin" :class="item.todayAmount >= 0 ? 'red' : item.todayAmount < 0 ? 'green' : ''">{{
              item.todayAmount }}</view>
            <image class="right" src="/static/img/user/accountlog/right.png" @click="toUrl(item)"></image>
          </view>
        </view>
        <view class="bottom">
          <view class="row-item active-item">
            <view class="coin">{{ item.bettingAmount }}</view>
            <view class="title">投注</view>
          </view>
          <view class="row-item active-item">
            <view class="coin">{{ item.winAmount }}</view>
            <view class="title">中奖</view>
          </view>
          <view class="row-item">
            <view class="coin">{{ item.rebateAmount }}</view>
            <view class="title">返点</view>
          </view>
        </view>
      </view>
    </view>
    <uni-drawer ref="pay" mode="right" :width="100">
      <time-picker @closePay="closePay" @changeTime="changeTime" :line="'.'" :dayStatMap="dayStatMap"
        :startTimes="startTime" :endTimes="endTime">
      </time-picker>
    </uni-drawer>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import TimePicker from "../../../components/common/time-picker";
import { getTime, isWithinSevenDays } from "../../../utils/function"
import { winLoseRecord } from "../../../utils/lottery/mine";
import defaultTemplate from "../../../utils/defaultTemplate";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "profitreport",
  components: {
    AlertInjectLayer, NavBar, TimePicker
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "盈亏报表",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      dayStatMap: {},
      type: 0,
      start: '',
      end: '',
      startTime: '',
      endTime: '',
      time: '',
      timeStr: '',
      list: [],
      total: 0.00,
      lastAmount: 0.00,
      nextAmount: 0.00,
      loading: false
    }
  },
  mounted() {
    let date = new Date();
    this.today = getTime(date)
    this.startTime = this.today
    this.endTime = this.today
    this.start = this.getDay(-30)
    this.end = this.today
    this.getList()
  },
  computed: {
    showTime() {
      let start = new Date(this.startTime.replace(/\./g, '/'))
      let end = new Date(this.endTime.replace(/\./g, '/'))
      let startTime = getTime(start, '.', 2, 'date')
      let endTime = getTime(end, '.', 2, 'date')
      if (startTime == endTime) {
        return startTime
      } else {
        return startTime + "-" + endTime
      }
    },
    isShowPre() {
      let startTime = new Date(this.startTime.replace(/\./g, '/'))
      let start = new Date(this.start.replace(/\./g, '/'))
      if (this.startTime == this.start) {
        return false
      } else if (startTime <= start) {
        return false
      } else {
        return true
      }
    },
    isShowNext() {
      let endTime = new Date(this.endTime.replace(/\./g, '/'))
      let end = new Date(this.end.replace(/\./g, '/'))
      if (this.endTime == this.end) {
        return false
      } else if (endTime >= end) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    toUrl(item) {
      if (item.type == 0) {
        uni.navigateTo({
          url: '/pages/liuhe/history/index' + `?startTime=${this.startTime}&endTime=${this.endTime}`
        })
      } else {
        uni.navigateTo({
          url: './detail?title=' + item.title + "&platformId=" + item.type + `&startTime=${this.startTime}&endTime=${this.endTime}`
        })
      }
    },
    getDay(day) {
      var today = new Date();
      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
      today.setTime(targetday_milliseconds);

      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();
      tMonth = this.doHandleMonth(tMonth + 1);
      tDate = this.doHandleMonth(tDate);
      return tYear + "." + tMonth + "." + tDate;
    },
    doHandleMonth(month) {
      var m = month;
      if (month.toString().length == 1) {
        m = "0" + month;
      }
      return m;
    },
    openTime() {
      this.$refs.pay.open()
    },
    closePay() {
      this.$refs.pay.close()
    },
    changeTime(time) {
      this.startTime = time.start
      this.endTime = time.end
      this.getList()
    },
    pre() {
      if (!this.isShowPre) return
      let start = new Date(this.startTime.replace(/\./g, '/'))
      let date = start.getTime() - 3600 * 1000 * 24
      if (this.startTime == this.endTime) {
        this.endTime = getTime(date)
      }
      this.startTime = getTime(date)
      this.getList()
    },
    next() {
      if (!this.isShowNext) return
      let end = new Date(this.endTime.replace(/\./g, '/'))
      let date = end.getTime() + 3600 * 1000 * 24
      if (this.startTime == this.endTime) {
        this.startTime = getTime(date)
      }
      this.endTime = getTime(date)
      this.getList()
    },
    getDefaultTemplate(data) {
      return defaultTemplate(
        {
          lastAmount: 0,
          nextAmount: 0,
          statList: [
            {
              type: '',
              title: "",
              logo: '',
              todayAmount: 0,
              bettingAmount: 0,
              winAmount: 0,
              rebateAmount: 0
            },
          ],
          dayStatMap: {}
        },
        data
      )
    },
    getList() {
      this.loading = true
      let _this = this;

      if (this.startTime === this.endTime && isWithinSevenDays(this.startTime)) {
        const data = uni.getStorageSync('profitreport') || {}
        if (data[this.startTime]) {
          const { lastAmount, nextAmount, statList, dayStatMap } = this.getDefaultTemplate(data[this.startTime])
          let total = 0;
          _this.list = statList
          _this.dayStatMap = dayStatMap
          _this.lastAmount = lastAmount;
          _this.nextAmount = nextAmount;// res.result.nextAmount
          _this.list.forEach((item, index) => {
            total += parseFloat(item.todayAmount);
          })
          _this.total = total.toFixed(2)
          setTimeout(() => {
            this.loading = false
          }, 100);
        }
      }
      let prams = {
        'beginTime': this.startTime,
        'endTime': this.endTime,
      }
      winLoseRecord(prams).then(res => {
        const { lastAmount, nextAmount, statList, dayStatMap } = this.getDefaultTemplate(res.result)
        let total = 0;
        _this.list = statList
        _this.dayStatMap = dayStatMap
        _this.lastAmount = lastAmount;
        _this.nextAmount = nextAmount;// res.result.nextAmount
        _this.list.forEach((item, index) => {
          total += parseFloat(item.todayAmount);
        })
        _this.total = total.toFixed(2)
        this.loading = false
        if (this.startTime === this.endTime) {
          const data = uni.getStorageSync('profitreport') || {}
          for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
              if (!isWithinSevenDays(key)) {
                delete data[key]
              }
            }
          }
          data[this.startTime] = res.result
          uni.setStorageSync('profitreport', data)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 100vh;
  width: 100vw;
  background: #eee;

  image {
    width: 100rpx;
    height: 100rpx;
  }
}

.log-box {
  font-family: 'PingFang SC';

  .date-box {
    display: flex;
    border-bottom: 1px solid #DDDDDD;
    position: sticky;
    top: 92rpx;
    z-index: 1;

    .pre,
    .next {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 186rpx;
      height: 90rpx;
      background: #F4FCFF;
      font-weight: 400;
      font-size: 22rpx;
      color: #666666;

      .pre-item,
      .next-item {
        display: flex;
        align-items: center;
        flex-direction: column;

        .coin-box {
          width: 186rpx;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .coin {
          display: inline-block;
          font-size: 28rpx;
          color: #222222;
          max-width: 50%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .green {
          color: #34B822;
        }

        .red {
          color: #DF2939;
        }
      }
    }

    .time-item {
      width: 378rpx;
      height: 90rpx;
      background: #FFFFFF;
      border: 1px solid #DDDDDD;
      border-bottom: 0px;
      display: flex;
      align-items: center;
      justify-content: center;

      .icon {
        width: 20%;

        image {
          margin-left: 24rpx;
          height: 55rpx;
          width: 55rpx;
        }
      }

      .time {
        width: 100%;
        text-align: center;
        font-weight: 400;
        font-size: 20rpx;
        text-align: center;
        color: #666666;

        .coin-text {
          .coin {
            font-weight: 400;
            font-size: 28rpx;
          }

          .green {
            color: #34B822;
          }

          .red {
            color: #DF2939;
          }
        }
      }
    }
  }

  .tip {
    font-size: 24rpx;
    color: #DF2939;
    position: sticky;
    top: 180rpx;
    padding: 10rpx;
    background: #f8f8f8;
    z-index: 1;
  }

  .list-box {
    .list-item {
      background: #FFFFFF;
      margin-bottom: 20rpx;
      border-top: 1px solid #088972;

      .top {
        height: 60rpx;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #EEEEEE;

        .item-top {
          width: 50%;
          display: flex;
          align-items: center;

          .img {
            margin-left: 30rpx;
            height: 50rpx;
            width: 61rpx;
          }

          .title {
            font-weight: 400;
            font-size: 26rpx;
            color: #444444;
            margin-left: 5rpx;
          }

          .icon-text {
            font-size: 40rpx;
          }

          .coin {
            margin-right: 30rpx;
            font-weight: 400;
            font-size: 26rpx;
          }

          .green {
            color: #34B822;
          }

          .red {
            color: #DF2939;
          }

          .right {
            height: 40rpx;
            width: 40rpx;
            margin-right: 30rpx;
          }
        }

        .right-item {
          justify-content: flex-end;
        }
      }

      .bottom {
        display: flex;
        height: 80rpx;

        .row-item {
          width: 33%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          .coin {
            font-weight: 400;
            font-size: 28rpx;
            color: #666666;
          }

          .green {
            color: #34B822;
          }

          .red {
            color: #DF2939;
          }

          .title {
            font-weight: 400;
            font-size: 22rpx;
            color: #999999;
          }
        }

        .active-item {
          border-right: 1px solid #e8e8e8;
        }
      }
    }
  }
}
</style>