<template>
  <view class="log-box" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
    </NavBar>
    <view class="date-box">
      <view class="pre" @click="pre()">{{ isShowPre ? '前一天' : '' }}</view>
      <view class="time-item">
        <view class="icon">
          <image src="/static/img/user/accountlog/date.png"></image>
        </view>
        <view class="time" @click="openTime">{{ showTime }}</view>
      </view>
      <view class="next" @click="next()">{{ isShowNext ? '后一天' : '' }}</view>
    </view>
    <view class="type-box">
      <uni-row class="row-box">
        <uni-col class="row-col" :span="6">
          <view class="title icon-box">
            类型
          </view>
        </uni-col>
        <uni-col class="row-col" :span="5">
          <view class="title icon-box">
            任务
          </view>
        </uni-col>
        <uni-col class="row-col" :span="5">
          <view class="title icon-box">
            状态
            <view class="sort-box" @click="setSort('status')">
              <view class="asc" :class="{ 'act-asc': order == 'asc' && orderBy == 'status' }">
              </view>
              <view class="desc" :class="{ 'act-desc': order == 'desc' && orderBy == 'status' }">
              </view>
            </view>
          </view>
        </uni-col>
        <uni-col class="row-col" :span="8">
          <view class="title icon-box">
            时间
            <view class="sort-box" @click="setSort('receiveTime')">
              <view class="asc" :class="{ 'act-asc': order == 'asc' && orderBy == 'receiveTime' }">
              </view>
              <view class="desc" :class="{ 'act-desc': order == 'desc' && orderBy == 'receiveTime' }">
              </view>
            </view>
          </view>
        </uni-col>
      </uni-row>

      <z-paging :style="'height: calc(var(--vh) - 96rpx - 90rpx - 50rpx - 120rpx);background: #EEEEEE;'" class="paging"
        ref="paging" v-model="list" @query="getList" :lower-threshold="10" :refresher-enabled="true"
        :refresherAnimated="false" :show-refresher-update-time="true" :refresher-default-text="'松开刷新...'"
        :refresher-pulling-text="'松开刷新...'" :refresher-default-img="'/static/img/load.gif'"
        :refresher-pulling-img="'/static/img/load.gif'" :refresher-refreshing-img="'/static/img/load.gif'"
        :refresher-default-style="'#EEEEEE'" :refresher-background="'#EEEEEE'" :refresher-fixed-background="'#EEEEEE'"
        :refresher-img-style="{ width: '100rpx', height: '100rpx', transform: 'rotate(0deg)' }"
        :refresher-refreshing-text="'正在加载更多数据...'"
        :loading-more-loading-icon-custom-style="{ width: '100rpx', height: '100rpx' }"
        :loading-more-loading-icon-custom-image="'/static/img/load.gif'"
        :loading-more-custom-style="{ 'padding-top': '20rpx', 'background': '#EEEEEE' }"
        :loading-more-loading-animated="false" :loading-more-default-as-loading="true"
        :show-loading-more-no-more-view="true" :loading-more-no-more-text="'没有更多数据了'" :hide-empty-view="false"
        :empty-view-center="true" :empty-view-text="'暂无记录'" :empty-view-img="'/static/img/empty.png'" :fixed="false"
        :empty-view-style="{ 'margin-bottom': '170px' }" :empty-view-img-style="{ 'width': '260rpx', 'height': '260rpx' }"
        :empty-view-title-style="{ 'color': ' #999999', 'font-size': '30rpx', 'line-height': '44rpx', 'margin-top': '10rpx' }">
        <view class="list-item" v-for="(item, index) in list" @click="detail(item)">
          <image class="new" v-if="item.receiveTimeGapStr == '刚刚'" src="/static/img/user/accountlog/new.png"></image>
          <uni-row class="row-box list-row">
            <uni-col class="row-col" :span="6">
              <view class="title">
                <view class="bank">{{ item.type == 1 ? '领取' : '申请' }}{{ item.rewardType == 1 ? '金额' : '金币' }}</view>
              </view>
            </uni-col>
            <uni-col class="row-col" :span="5">
              <view class="title">
                <view class="bank">{{ item.taskName }}</view>
                <view class="bank">{{ item.rewardMoney }}</view>
              </view>
            </uni-col>
            <uni-col class="row-col" :span="5">
              <view class="title">
                <view class="bank" :class="item.status == 1 ? 'red' : 'green'">{{ item.type == 1 ? '领取' : '申请' }}{{
                  item.status == 1 ? '成功' : "失败" }}</view>
              </view>
            </uni-col>
            <uni-col class="row-col" :span="8">
              <view class="title">
                <view class="time">{{ item.receiveTimeStr }}</view>
                <view class="time-text">{{ item.receiveTimeGapStr }}</view>
              </view>
            </uni-col>
          </uni-row>
        </view>
      </z-paging>
      <view style="height: 120rpx">
        <Common :total="total" />
      </view>
    </view>
    <uni-drawer ref="pay" mode="right" :width="100" style="max-width: 480px;margin: auto;">
      <time-picker @closePay="closePay" @changeTime="changeTime" :line="'.'" :startTimes="startTime" :endTimes="endTime">
      </time-picker>
    </uni-drawer>
    <uni-drawer ref="change" mode="right" :width="100">
      <Change :info="info" @closeDetail="closeDetail" />
    </uni-drawer>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import Common from "../../user/accountLog/common/common";
import Change from "../../user/accountLog/common/change";
import TimePicker from "../../../components/common/time-picker";
import { getTime, getTimes } from "../../../utils/function"
import { receiveRecord } from "../../../utils/activity/index";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "index",
  components: {
    AlertInjectLayer, UniCol, UniRow, NavBar, Common, TimePicker, Change
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "领取记录",
      headerStyle: {
        backgroundColor: "#03536E"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      isShow: false,
      type: 0,
      typeTitle: '全部',
      start: '',
      end: '',
      code: '',
      startTime: '',
      endTime: '',
      time: '',
      timeStr: '',
      today: '',
      GroupType: [],
      order: 'desc',
      orderBy: 'receiveTime',
      pageNo: 1,
      pageSize: 10,
      list: [],
      total: [],
      info: {},
    }
  },
  onShow() {
    let date = new Date();
    this.today = getTime(date)
    this.startTime = this.today
    this.endTime = this.today
    this.start = this.getDay(-30)
    this.end = this.today
    /*    this.getGroupTypeList();*/
    /*this.getList();*/
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
    getReceiveTime(times) {
      console.log(time)
      let time = new Date(times)
      return getTime(time, '.', 2, 'datetime')
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
    detail(item) {
      this.info = item;
      this.$refs.change.open()
    },
    closeDetail() {
      this.$refs.change.close()
    },
    setGroupType(item = null) {
      if (item != null) {
        this.code = item.code
        this.typeTitle = item.title
      } else {
        this.code = ""
        this.typeTitle = "全部"
      }
      this.isShow = false
      this.$refs.paging.reload()
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
      this.$refs.paging.reload()
    },
    pre() {
      if (!this.isShowPre) return
      let start = new Date(this.startTime.replace(/\./g, '/'))
      let date = start.getTime() - 3600 * 1000 * 24
      if (this.startTime == this.endTime) {
        this.endTime = getTime(date)
      }
      this.startTime = getTime(date)
      this.$refs.paging.reload()
    },
    next() {
      if (!this.isShowNext) return
      let end = new Date(this.endTime.replace(/\./g, '/'))
      let date = end.getTime() + 3600 * 1000 * 24
      if (this.startTime == this.endTime) {
        this.startTime = getTime(date)
      }
      this.endTime = getTime(date)
      this.$refs.paging.reload()
    },
    setSort(orderBy) {
      this.orderBy = orderBy
      if (this.order == 'asc') {
        this.order = 'desc'
      } else {
        this.order = 'asc'
      }
      this.$refs.paging.reload()
    },
    getList(pageNo, pageSize = 10) {
      this.pageNo = pageNo
      this.pageSize = pageSize
      let startTime = getTimes(this.startTime)
      let endTime = getTimes(this.endTime)
      let prams = {
        'beginTime': startTime,
        'endTime': endTime,
        'order': this.order,
        'orderBy': this.orderBy,
        'pageNo': this.pageNo,
        'pageSize': this.pageSize,
      }
      receiveRecord(prams).then(res => {
        let list = res.result.pageList.records
        let total = res.result.statisticsData
        this.total = [
          { title: '领取金币', amount: '0.00' },
          { title: '申请金币', amount: '0.00' },
          { title: '领取金额', amount: '0.00' },
          { title: '申请金额', amount: '0.00' },
        ]
        if (total != null) {
          this.total = [
            { title: '领取金币', amount: total.receivedCoins },
            { title: '申请金币', amount: total.appliedCoins },
            { title: '领取金额', amount: total.receivedAmount },
            { title: '申请金额', amount: total.appliedAmount },
          ]
        }
        this.$refs.paging.complete(list);
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.log-box {
  font-family: 'PingFang SC';

  .sx {
    font-weight: 500;
    font-size: 28rpx;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;

    image {
      height: 40rpx;
      width: 40rpx;
    }
  }

  .menu-box {
    height: 60rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .menu-item {
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-weight: 400;
      font-size: 24rpx;
      text-align: center;
      color: #333333;
      height: 100%;
      width: 33.3%;
    }

    .active {
      color: #088972;
      position: relative;

      &::after {
        position: absolute;
        bottom: 0px;
        content: '';
        width: 26rpx;
        margin: 0 auto;
        border: 4rpx solid #088972;
      }
    }
  }

  .date-box {
    display: flex;
    border-bottom: 1px solid #DDDDDD;

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
    }

    .time-item {
      width: 378rpx;
      height: 90rpx;
      background: #FFFFFF;
      border-top: 1px solid #DDDDDD;
      border-right: 1px solid #DDDDDD;
      border-left: 1px solid #DDDDDD;
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
      }
    }
  }

  .type-box {
    .row-box {
      background: #FFFFFF;
      height: 50rpx;
      border-bottom: 1px solid #DDDDDD;

      .row-col {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;

        .firstTitle {
          width: 100%;
          padding-left: 30rpx;
        }

        .title {
          font-size: 22rpx;
          text-align: left;
          color: #999999;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          /*display: flex;
          justify-content: center;
          align-items: center;*/
          .icon {
            background: #C5CCCE;
            height: 30rpx;
            width: 30rpx;
            border-radius: 50%;
            margin-left: 10rpx;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .group-text {
            font-size: 22rpx;
            color: #222222;
          }

          .type-text {
            font-size: 22rpx;
            color: #999999;
          }

          .bank,
          .money-text {
            font-size: 22rpx;
            color: #444444;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .red {
            color: #CC3333;
          }

          .green {
            color: #34B822;
          }

          .fq {
            font-size: 22rpx;
            color: #0099CC;
          }

          .sl {
            font-size: 22rpx;
            color: #666666;
          }

          .ok {
            font-size: 22rpx;
            color: #CC3333;
          }

          .err {
            font-size: 22rpx;
            color: #34B822;
          }

          .time {
            font-size: 20rpx;
            text-align: center;
            color: #999999;
          }

          .time-text {
            font-size: 20rpx;
            text-align: center;
            color: #CC3333;
          }
        }

        .icon-box {
          display: flex;

          .sort-box {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-left: 6rpx;

            .asc {
              border-bottom: 10rpx solid #CECECD;
              border-left: 10rpx solid transparent;
              border-right: 10rpx solid transparent;
            }

            .desc {
              margin-top: 4rpx;
              border-top: 10rpx solid #CECECD;
              border-left: 10rpx solid transparent;
              border-right: 10rpx solid transparent;
            }

            .act-asc {
              border-bottom: 10rpx solid #858583;
            }

            .act-desc {
              border-top: 10rpx solid #858583;
            }
          }
        }
      }

      .container-data {
        position: relative;

        .container-box {
          position: absolute;
          top: 48rpx;
          z-index: 999;
          width: 100%;
          max-width: 480px;
          background: #EEEEEE;
          height: calc(var(--vh) - 96rpx - 90rpx - 50rpx - 120rpx);

          .container-row {
            .container-title {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;
              padding: 0px 0px 0px 30rpx;
              height: 50rpx;
              background: #EEEEEE;
              font-weight: 400;
              font-size: 24rpx;
              color: #666666;
            }

            .container-list {
              background: #F6F6F6;
              display: flex;
              flex-wrap: wrap;
              padding: 0 20rpx;

              .container-list-item {
                min-width: 134rpx;
                height: 60rpx;
                margin: 20rpx 10rpx 20rpx 0;
                font-size: 26rpx;
                border: 1px solid #e7e7e7;
                border-radius: 50rpx;
                background: #FFFFFF;
                text-align: center;
                line-height: 60rpx;
              }

              .active {
                background: #8CB2C9;
                color: #FFFFFF;
              }
            }
          }
        }

        .fadeOutUp {
          animation-name: fadeOutUp;
        }

        .fadeOutDown {
          animation-name: fadeOutDown;
        }
      }
    }

    .list-item {
      position: relative;

      .new {
        height: 35rpx;
        width: 42rpx;
        position: absolute;
        top: 0;
        z-index: 1;
      }
    }

    .list-row {
      height: 100rpx;
    }
  }
}

@keyframes fadeOutUp {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }
}

@keyframes fadeOutDown {
  0% {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }

  100% {
    opacity: 1;
    transform: translateZ(0);
  }
}
</style>