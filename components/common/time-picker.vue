<template>
  <view class="time-box" :style="{ marginTop: safeHeight }">
    <NavBar :isBack="false" :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor"
      :font-color="fontColor" :title-style="titleStyle">
      <block slot="left">
        <uni-icons @click="back" type="back" :color="fontColor" size="18" style="font-weight: bold;margin-left: 10px" />
      </block>
    </NavBar>
    <view class="notice-box">
      <view class="notice-row">
        <view class="title">选择不同日期可查询所选范围的记录</view>
        <view class="desc">备注：手机端只记录{{ diff }}天的数据</view>
      </view>
    </view>
    <scroll-view class="scroll-view" :scroll-y="true">
      <view class="list" v-for="(item, index) in dayList">
        <view class="year-box">
          {{ item.year + "年" + item.month + "月" }}
        </view>
        <view class="weeks" @click="scrollTolower()">
          <view class="week-item" v-for="(v, k) in week" :key="k">{{ v }}</view>
        </view>
        <view class="day-box">
          <view class="day-item" v-for="(t, i) in item.day" :class="{
            'day-info': t != '',
            'rang-date': rangDate(item.year, item.month, t),
            'active-date': activeDate(item.year, item.month, t)
          }" @click="selectTime(item.year, item.month, t)">
            {{ t }}
            <view class="coin"
              :class="setRemark(item.year, item.month, t) > 0 ? 'red' : setRemark(item.year, item.month, t) < 0 ? 'green' : ''">
              {{ setRemark(item.year, item.month, t) }}
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="btn-box">
      <view class="btn-row">
        <view class="btn" @click="cofim">确定</view>
      </view>
    </view>
  </view>
</template>

<script>
import NavBar from "./navBar/navBar";

export default {
  name: "time-picker",
  components: { NavBar },
  props: {
    startTimes: {
      type: String,
      default: ''
    },
    endTimes: {
      type: String,
      default: ''
    },
    dayStatMap: {
      type: Object,
      default: () => {
        return {}
      }
    },
    line: {
      type: String,
      default: '-'
    },
    diff: {
      type: Number,
      default: 30
    }
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "日期选择",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      todayYear: '', //今日年份
      todayMonth: '',  //今日月份
      today: '',       //今日日期
      //日历
      year: '', //当前年份
      month: '', //当前月份
      day: '', //当前天
      week: ['日', '一', '二', '三', '四', '五', '六'],
      dayList: [], //列表
      start: '',//时间范围开始时间
      end: '',  //时间范围结束时间
      startTime: this.startTimes,  //选中的时间
      endTime: this.endTimes
    }
  },
  computed: {
  },
  mounted() {
    this.setNow()
    this.setDay()
  },
  methods: {
    back() {
      this.$emit('closePay');
    },
    setRemark(year, month, day) {
      if (day == '') {
        return ''
      }
      month = month < 10 ? "0" + month : month
      day = day < 10 ? "0" + day : day
      let key = year + "-" + month + "-" + day
      if (!(key in this.dayStatMap)) {
        return ''
      }
      return this.dayStatMap[key] == 0 ? '0.00' : this.dayStatMap[key];
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
      return tYear + this.line + tMonth + this.line + tDate;
    },
    doHandleMonth(month) {
      var m = month;
      if (month.toString().length == 1) {
        m = "0" + month;
      }
      return m;
    },
    /**
     * 设置当前年月日
     */
    setNow() {
      let date = new Date();
      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;
      this.day = date.getDate();
      this.todayYear = date.getFullYear();
      this.todayMonth = date.getMonth() + 1;
      this.day = date.getDate();
      this.end = this.todayYear + this.line + this.todayMonth + this.line + this.day;
      this.start = this.getDay(-this.diff)
    },
    //计算当前时间是否大于或者小于时间范围
    rangDate(year, month, day) {
      if (day == '') {
        return false
      }
      let curDate = new Date(year, month - 1, day);
      let start = new Date(this.start.replace(/\./g, '/'));
      let end = new Date(this.end.replace(/\./g, '/'));
      if (curDate >= start && curDate <= end) {
        return true
      } else {
        return false
      }
    },
    activeDate(year, month, day) {
      if (day == '') {
        return false
      }
      let date = year + this.line + month + this.line + day
      if (date == this.startTime || date == this.endTime) {
        return true
      } else {
        return false
      }
    },
    selectTime(year, month, day) {
      let rangDate = this.rangDate(year, month, day)
      if (rangDate == false) {
        return false
      }
      let date = year + this.line + month + this.line + day
      let dateStr = new Date(year, month - 1, day)
      if (this.startTime == '' && this.endTime == '') {
        this.startTime = date
        this.endTime = date
      } else if (date == this.startTime && date == this.endTime) {
        this.startTime = ''
        this.endTime = ''
      } else if (date == this.startTime && date != this.endTime) {
        this.startTime = ''
      } else if (date != this.startTime && date == this.endTime) {
        this.endTime = ''
      } else {
        if (this.startTime != '' && this.endTime == '') {
          let start = new Date(this.startTime.replace(/\./g, '/'))
          if (dateStr > start) {
            this.endTime = date
          } else {
            this.endTime = this.startTime
            this.startTime = date
          }
        } else if (this.startTime == '' && this.endTime != '') {
          let end = new Date(this.endTime.replace(/\./g, '/'))
          if (dateStr >= end) {
            this.startTime = this.endTime
            this.endTime = date
          } else {
            this.startTime = date
          }
        } else {
          let start = new Date(this.startTime.replace(/\./g, '/'))
          let end = new Date(this.endTime.replace(/\./g, '/'))
          if (dateStr > end) {
            this.endTime = date
          } else if (dateStr < start) {
            this.startTime = date
          } else if (dateStr > start && dateStr < end) {
            this.endTime = date
          } else {
            this.startTime = date
          }
        }
      }
    },
    /**
     * 滚动到底
     */
    /*scrollTolower() {
      let y = this.getNextNDate(this.year, this.month, 2);
      this.year = y.year;
      this.month = y.month;
      console.log(this.year,this.month)
      this.setDay()
    },*/
    /**
     * 设置日历天,当前月分和后两个月
     */
    setDay() {
      //将日历增加3个月
      for (var j = 0; j < 2; j++) {
        let y = this.getNextNDate(this.year, this.month, j);
        let date = new Date(y.year, y.month - 1, 1);
        let date1 = new Date(y.year, y.month, 0);
        //获取当前月第一天是周几，0等于周日
        let oneDay = date.getDay();
        //获取当前月天数
        let monthDay = date1.getDate();
        let dayList = [];
        for (var i = 0; i < oneDay; i++) {
          dayList.push('')
        }
        for (var i = 0; i < monthDay; i++) {
          dayList.push(i + 1)
        }
        this.dayList.push({
          year: y.year,
          month: y.month,
          day: dayList
        })
      }
      this.dayList.reverse()
      console.log(this.dayList)
    },
    /**
     * 获取year,month后n天的日期
     */
    getNextNDate(year, month, n) {
      let m = 0;
      if (n > 12) {
        m = parseInt(n / 12);
        year -= m;
      }
      let mm = n - m * 12;
      if (month - mm <= 0) {
        year -= 1;
        month = 12;
      } else {
        month -= mm;
      }
      return {
        year: year,
        month: month
      }
    },
    cofim() {
      if (this.startTime != '' && this.endTime == '') {
        this.$emit('changeTime', { start: this.startTime, end: this.startTime });
      } else if (this.startTime == '' && this.endTime != '') {
        this.$emit('changeTime', { start: this.endTime, end: this.endTime });
      } else if (this.startTime != '' && this.endTime != '') {
        this.$emit('changeTime', { start: this.startTime, end: this.endTime });
      }
      this.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.time-box {
  max-width: 480px;
  margin: auto;
}

.scroll-view {
  height: calc(var(--vh) - 92rpx - 100rpx - 82rpx);
}

.notice-box {
  height: 100rpx;

  .notice-row {
    position: fixed;
    top: 92rpx;
    height: 100rpx;
    width: 100%;
    max-width: 480px;
    background: #FFF2DF;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .title {
      font-weight: 500;
      font-size: 24rpx;
      color: #666633;
    }

    .desc {
      font-weight: 500;
      font-size: 24rpx;
      color: #B8A68B;
    }
  }
}

.list {
  .year-box {
    height: 50rpx;
    font-weight: 500;
    font-size: 30rpx;
    line-height: 50rpx;
    color: #333333;
    text-align: center;
    margin-top: 20rpx;
  }

  .weeks {
    display: flex;
    flex: 1;
    justify-content: space-around;
    border-bottom: 1px solid rgba(221, 221, 221, 0.5);
    padding: 4rpx;
    margin-top: 30rpx;

    .week-item {
      width: 14%;
      text-align: center;
    }
  }

  .day-box {
    display: flex;
    flex-wrap: wrap;
    padding: 4rpx;

    .day-item {
      height: 98rpx;
      width: 98rpx;
      border-radius: 2px;
      font-weight: 400;
      font-size: 28rpx;
      text-align: center;
      color: #000000;
      margin: 4rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .coin {
        color: #699;
        width: 98rpx;
        overflow: hidden;
        text-overflow: ellipsis; //溢出用省略号显示
      }

      .green {
        color: #34B822;
      }

      .red {
        color: #DF2939;
      }
    }

    .day-info {
      background: #F4F4F4;
    }

    .rang-date {
      background: #e3edf1;
    }

    .active-date {
      background: #3881a8;
      color: #FFFFFF;

      .coin {
        color: #FFFFFF;
      }
    }
  }
}

.btn-box {
  height: 82rpx;

  .btn-row {
    width: 100%;
    max-width: 480px;
    height: 80rpx;
    position: fixed;
    background: #FFFFFF;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 260rpx;
      height: 62rpx;
      background: #086989;
      border-radius: 58rpx;
      font-weight: 500;
      font-size: 30rpx;
      color: #DDF2FB;
    }
  }
}
</style>