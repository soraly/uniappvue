<template>
  <view class="toolbox-warp1" :style="{ marginTop: safeHeight }">
    <NavBar :title="title"></NavBar>
    <view class="date-body" style="">
      <notice :content="content" :styleContent="styleContent"></notice>
      <view class="calendar-box">
        <view class="calendar-title">
          <span>
            <uni-icons @click="getPreMonth" v-show="showLeft" type="left" size="20" color="#fff"></uni-icons>
          </span>
          <span>{{ year }}-{{ month < 10 ? '0' + month : month }}</span>
              <span>
                <uni-icons @click="getNextMonth" v-show="showRight" type="right" size="20" color="#fff"></uni-icons>
              </span>
        </view>
        <table border="0">
          <tr>
            <th>日</th>
            <th>一</th>
            <th>二</th>
            <th>三</th>
            <th>四</th>
            <th>五</th>
            <th>六</th>
          </tr>
          <tr v-for="(item, index) in dateList" :key="index">
            <td v-for="(val, key) in item" :key="key" :class="{ disabled: day > val.date }" @click="isOpen(val.date)">
              <span v-if="dayAc === val.date" class="active">{{ val.date }}</span>
              <span v-else :class="val.color">{{ val.date }}</span>
            </td>
          </tr>
        </table>
        <p class="calendar-notice">{{ noticeStr }}</p>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import Notice from "../../components/common/notice/notice";
import { listLotteryDate } from '../../utils/lottery/index'
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "date",
  components: {
    AlertInjectLayer, NavBar, Notice
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '搅珠日期',
      content: '搅珠日期对照表，可查看当月及下一个月的搅珠开奖日期',
      noticeStr: '',
      styleContent: {
        'font-size': '24rpx',
        'margin-top': '20rpx',
        'text-align': 'center',
      },
      lotteryType: uni.getStorageSync('lotteryType'),
      showLeft: false,
      showRight: true,
      year: 0,
      month: 1,
      todayMonth: 0,
      day: 0,
      todayDay: 0,
      dayAc: 0,
      dateList: [],
      dayList: [],
    }
  },
  onLoad() {
    let date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1; // 7
    this.todayMonth = date.getMonth() + 1;
    this.day = date.getDate()
    this.dayAc = date.getDate()
    this.todayDay = date.getDate()
    let dayStr = this.day < 10 ? '0' + this.day : this.day
    let dateStr = this.year + "-" + this.month + "-" + dayStr
    if (this.dayList.includes(dateStr)) {
      this.noticeStr = "今天:" + dateStr + "是开奖日期"
    } else {
      this.noticeStr = "今天:" + dateStr + "非是开奖日期"
    }
    if (this.lotteryType == 1) {
      this.title = '香港' + this.title
    } else if (this.lotteryType == 2) {
      this.title = '澳门' + this.title
    } else if (this.lotteryType == 3) {
      this.title = '台湾' + this.title
    } else {
      this.title = '新加坡' + this.title
    }
    this.listLotteryDate()
  },
  methods: {
    isOpen(day) {
      if (!day) {
        return false
      }
      this.dayAc = day
      let monthStr = this.month < 10 ? '0' + this.month : this.month
      let dayStr = this.dayAc < 10 ? '0' + this.dayAc : this.dayAc
      let dateStr = this.year + "-" + monthStr + "-" + dayStr
      if (this.dayList.includes(dateStr)) {
        if ((this.month + "-" + this.dayAc) == (this.todayMonth + "-" + this.todayDay)) {
          this.noticeStr = "今天:" + dateStr + "是开奖日期"
        } else {
          this.noticeStr = dateStr + "是开奖日期"
        }
      } else {
        if ((this.month + "-" + this.dayAc) == (this.todayMonth + "-" + this.todayDay)) {
          this.noticeStr = "今天:" + dateStr + "非是开奖日期"
        } else {
          this.noticeStr = dateStr + "非是开奖日期"
        }
      }
    },
    /**获取上一个月 */
    getPreMonth() {
      var year2 = this.year;
      var month2 = this.month - 1;
      if (month2 == 0) {
        //1月的上一月是前一年的12月
        this.year = year2 - 1;
        this.month = 12;
      }
      this.showRight = true
      this.showLeft = false
      this.dayAc = this.day
      this.getDays()
    },
    //获取下一月
    getNextMonth() {
      var year2 = this.year;
      var month2 = this.month + 1;
      if (month2 == 13) {
        //12月的下月是下年的1月
        this.year = year2 + 1
        this.month = 1;
      } else {
        this.month = this.month + 1
      }
      this.showRight = false
      this.showLeft = true
      this.dayAc = 0
      this.getDays()
    },
    daysInMonth(month, year) {
      return new Date(year, month + 1, 0).getDate();
    },
    getDays() {
      let dayStr = '';
      // 每个月的第一天
      let firstDay = new Date(this.year, this.month - 1, 1);
      let dayInMonth = this.daysInMonth(this.month - 1, this.year);
      // 每个月的最后一天
      let lastDay = new Date(this.year, this.month - 1, dayInMonth);
      // 第一天星期几(0-6)
      let weekday = firstDay.getDay();
      // 每一个都是从1号开始
      let date = 1;
      let i = 0
      let color = ''
      let obj = {}
      let arr = []
      let dateStr = ''
      for (let j = 0; j < weekday; j++) {
        obj = {
          'date': '',
          'color': 0
        }
        arr.push(obj)
      }
      let dateList = []
      let monthStr = this.month < 10 ? "0" + this.month : this.month
      for (; date <= dayInMonth; date++) {
        weekday++
        color = ''
        dayStr = date < 10 ? '0' + date : date

        dateStr = this.year + "-" + monthStr + "-" + dayStr
        if (this.dayList.includes(dateStr)) {
          color = 'color'
        }
        arr.push({ 'date': date, 'color': color })
        if (weekday % 7 == 0) {
          weekday = 0;
          dateList[i] = arr
          arr = []
          i++
        }
      }
      if (weekday > 0) {
        dateList[i] = arr
      }
      this.dateList = dateList
      console.log(this.dateList)
    },
    //开奖日期
    async listLotteryDate() {
      let prams = { lotteryType: uni.getStorageSync('lotteryType') }
      await listLotteryDate(prams).then(res => {
        res.result.forEach((item, index) => {
          this.dayList.push(...item.dayList)
        })
        console.log(this.dayList)
        this.getDays()
        this.isOpen(this.dayAc)
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.date-body {
  margin-top: 12rpx;
  box-sizing: border-box;
  padding: 24rpx;

  .calendar-box {
    margin-top: 38rpx;

    .calendar-title {
      height: 92rpx;
      line-height: 92rpx;
      padding: 0 24rpx;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      background: #07c160;

      span {
        display: block;
        color: #fff;
        font-size: 32rpx;
      }
    }

    table {
      width: 100%;
      border-spacing: 0;
      color: #333;
      font-size: 28rpx;
      border: 2rpx solid #dfdfdf;
      border-top: none;
      text-align: center;

      tr {
        height: 84rpx;

        th {
          font-weight: 400;
          width: 14.2857%;
        }

        span {
          display: block;
          width: 40rpx;
          height: 40rpx;
          line-height: 40rpx;
          margin: 0 auto;
          border-radius: 50%;
          overflow: hidden;
        }

        .color {
          background: #07c160;
          color: #fff;
        }

        .active {
          background: #fff;
          border: 2rpx solid #ff6b6b;
          color: #ff6b6b;
        }

        .disabled .color {
          background: #cfcfcf;
          color: #fff !important;
        }
      }

      tr:nth-of-type(2n) {
        background: #fbfbfb;
      }
    }

    .calendar-notice {
      text-align: center;
      color: #333;
      font-size: 36rpx;
      margin-top: 36rpx;
      line-height: 50rpx;
    }
  }
}</style>