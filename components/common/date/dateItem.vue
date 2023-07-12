<template>
  <view>
    <view class="red-hd">
      <span>
        <uni-icons @click="getPreMonth" v-show="key>0 || showLeft" type="left" size="20" color="#fff"></uni-icons>
      </span>
      <span>{{ year }}-{{ month < 10 ? '0'+ month : month }}</span>
      <span>
        <uni-icons @click="getNextMonth" v-show="key<list.length-1 || showRight" type="right" size="20" color="#fff"></uni-icons>
      </span>
    </view>
    <view class="date-bd">
      <view class="day-item">
        <span v-for="(item,index) in dateList" @click="isOpen(item.date,item.month)">
          <b :class="month == item.month && item.date == dayAc ? 'hover' : item.color">{{ item.date }}</b>
        </span>
      </view>
    </view>
    <div class="ft">
      {{ noticeStr }}
    </div>
  </view>
</template>

<script>
import {listLotteryDate} from '../../../utils/lottery/index'
export default {
  name: "dateItem",
  props:{
    lotteryType: {
      type:Number,
      default:'',
    }
  },
  data(){
    return{
      showLeft:false,
      showRight:true,
      year:0,
      month:1,
      key:0,
      dateStr:'',
      todayMonth:0,
      day:0,
      todayDay:0,
      dayAc:0,
      dateList:[],
      list:[],
      dayList:[],
      noticeStr:'',
    }
  },
  mounted(){
    this.listLotteryDate()
    let date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1; // 7
    this.todayMonth = date.getMonth() + 1;
    console.log(this.todayMonth)
    this.day = date.getDate()
    this.dayAc = date.getDate()
    this.todayDay = date.getDate()
    let dayStr = this.day < 10 ? '0' + this.day : this.day
    let dateStr = this.year + "-" + this.month + "-" + dayStr
    if(this.dayList.includes(dateStr)){
      this.noticeStr = "今天:"+dateStr + "是开奖日期"
    }else{
      this.noticeStr = "今天:"+dateStr + "非开奖日期"
    }
  },
  methods:{
    //开奖日期
    listLotteryDate(){
      let prams = {lotteryType:this.lotteryType}
      listLotteryDate(prams).then(res=>{
        this.list = res.result
        this.dayList = res.result[this.key].dayList
        this.dateStr = res.result[this.key].month
        let dateArr = this.dateStr.split("-")
        this.year = parseInt(dateArr[0])
        this.month = parseInt(dateArr[1])
        this.getDays()
      }).catch(err=>{
        console.log(err)
      })
    },
    isOpen(day,month){
      if(!day){
        return false
      }
      this.month = month
      this.dayAc = day
      let monthStr = this.month < 10 ? '0' + this.month : this.month
      let dayStr = this.dayAc < 10 ? '0' + this.dayAc : this.dayAc
      let dateStr = this.year + "-" + monthStr + "-" + dayStr
      if(this.dayList.includes(dateStr)){
        if((this.month + "-" + this.dayAc) == (this.todayMonth + "-" + this.todayDay) ){
          this.noticeStr = "今天:"+dateStr + " 是开奖日期"
        }else{
          this.noticeStr = dateStr + " 是开奖日期"
        }
      }else{
        if((this.month + "-" + this.dayAc) == (this.todayMonth + "-" + this.todayDay) ){
          this.noticeStr = "今天:"+dateStr + " 非开奖日期"
        }else{
          this.noticeStr = dateStr + " 非开奖日期"
        }
      }
    },
    /**获取上一个月 */
    getPreMonth() {
      this.key = this.key-1
      if(this.list[this.key]){
        this.dateStr = this.list[this.key].month
        this.dayList = this.list[this.key].dayList
        let dateArr = this.dateStr.split("-")
        this.year = parseInt(dateArr[0])
        this.month = parseInt(dateArr[1])
      }else{
        var year2 = this.year;
        var month2 = this.month - 1;
        if (month2 == 0) {
          //1月的上一月是前一年的12月
          this.year = year2 - 1;
          this.month = 12;
        }
        this.dayList = this.list[0].dayList
      }
      this.showRight = true
      this.showLeft = false
      this.dayAc = this.day
      this.getDays()
    },
    //获取下一月
    getNextMonth() {
      this.key = this.key+1
      if(this.list[this.key]) {
        this.dateStr = this.list[this.key].month
        let dateArr = this.dateStr.split("-")
        this.year = parseInt(dateArr[0])
        this.month = parseInt(dateArr[1])
        this.dayList = this.list[this.key].dayList
      }else{
        var year2  = this.year;
        var month2 = this.month + 1;
        if (month2 == 13) {
          //12月的下月是下年的1月
          this.year = year2 + 1
          this.month = 1;
        }else{
          this.month = this.month + 1
        }
        this.dayList = this.list[0].dayList
      }
      this.showRight = false
      this.showLeft = true

      this.dayAc = this.day
      this.getDays()
    },
    daysInMonth(month, year) {
      return new Date(year, month + 1, 0).getDate();
    },
    getDays(){
      let dayStr = '';
      this.dateList = []
      // 每个月的第一天
      let firstDay = new Date(this.year,this.month-1,1);
      let dayInMonth = this.daysInMonth(this.month-1,this.year);
      // 每个月的最后一天
      let lastDay = new Date(this.year,this.month-1,dayInMonth);
      // 第一天星期几(0-6)
      let weekday = firstDay.getDay();
      // 每一个都是从1号开始
      let date = 1;
      let i = 0
      let color = ''
      let obj = {}
      let arr = []
      let monthStr = ''
      let dateStr = ''
      if(weekday == 0){
        weekday = 2
      }
      for(let j = 0; j < weekday-1; j++){
        obj = {
          'date' : '',
          'color': 0
        }
        this.dateList.push(obj)
      }
      for(;date <= dayInMonth;date++){
        color = ''
        monthStr = this.month > 9 ? this.month : '0' + this.month
        dayStr = date < 10 ? '0'+date : date
        dateStr = this.year + "-" + monthStr + "-" + dayStr
        if(this.dayList.includes(dateStr)){
          color = 'act'
        }
        arr.push({'date':date,'color':color})
        this.dateList.push({'month':this.month,'date':date,'color':color})
        this.isOpen(this.day,this.month);
      }
      if(weekday > 0){
        this.dateList[i] = arr
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.red-hd{
  background-color: #07c160;
  height: 92rpx;
  margin-top: 40rpx;
  color: #fff;
  line-height: 100rpx;
  font-size: 32rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  span {
    display: block;
    color: #fff;
    font-size: 32rpx;
  }
}
.date-bd{
  padding-top: 40rpx;
  background: #fff;
  span {
    display: inline-block;
    width: 14.28571428%;
    margin-bottom: 20rpx;
    text-align: center;
    b {
      display: inline-block;
      width: 60rpx;
      height: 60rpx;
      line-height: 60rpx;
      border-radius: 100%;
      font-size: 24rpx;
      font-weight: 200;
      border: 1Px solid rgba(255,0,0,0);
    }
    .act {
      background: #07c160;
      color: #fff;
      border: 1Px solid #07c160;
    }
    .hover{
      border: 1px solid #07c160;
      background: #fff;
      color: #07c160;
    }
  }
}
.ft {
  text-align: center;
  padding: 60rpx 0;
}
</style>