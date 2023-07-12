<template>
  <view class="log-box" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
    </NavBar>
    <view class="menu-box">
      <view class="menu-item" v-for="(item, index) in menu" :class="{ active: type == index }" @click="selectType(index)">
        {{ item.name }}
      </view>
    </view>
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
        <uni-col class="row-col" :span="4">
          <view class="title">{{ type == 0 ? '类型' : '渠道' }}</view>
        </uni-col>
        <uni-col class="row-col" :span="6">
          <view class="title">{{ type == 0 ? '渠道' : '金额' }}</view>
        </uni-col>
        <uni-col class="row-col" :span="4">
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
        <uni-col class="row-col" :span="10">
          <view class="title icon-box">
            时间
            <view class="sort-box" @click="setSort('create_time')">
              <view class="asc" :class="{ 'act-asc': order == 'asc' && orderBy == 'create_time' }">
              </view>
              <view class="desc" :class="{ 'act-desc': order == 'desc' && orderBy == 'create_time' }">
              </view>
            </view>
          </view>
        </uni-col>
      </uni-row>

      <z-paging :style="'height: calc(var(--vh) - 100rpx - 60rpx - 90rpx - 50rpx - 120rpx);background: #EEEEEE;'"
        class="paging" ref="paging" v-model="list" @query="getList" :lower-threshold="10" :refresher-enabled="true"
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
        <!--        <scroll-view :scroll-top="scrollTop"
                     scroll-y="true" class="scroll-Y"
                     @scrolltoupper="upper"
                     @scrolltolower="lower"
                     @scroll="scroll">-->
        <view class="list-item" v-for="(item, index) in list" @click="detail(item)">
          <image class="new" v-if="item.timeText == '刚刚'" src="/static/img/user/accountlog/new.png"></image>
          <uni-row class="row-box list-row">
            <uni-col class="row-col" :span="4">
              <view class="title">
                <text class="type-text">{{ type == 0 ? item.type : item.childType }}</text>
              </view>
            </uni-col>
            <uni-col class="row-col" :span="6">
              <view class="title">
                <view class="bank" v-if="type == 0">{{ item.childType }}</view>
                <view class="money-text">{{ item.amount }}</view>
              </view>
            </uni-col>
            <uni-col class="row-col" :span="4">
              <view class="title">
                <text class="fq" v-if="item.status == -1">{{ item.statusText }}</text>
                <text class="sl" v-else-if="item.status == 0">{{ item.statusText }}</text>
                <text class="ok" v-else-if="item.status == 1">{{ item.statusText }}</text>
                <text class="err" v-else-if="item.status == 2">{{ item.statusText }}</text>
              </view>
            </uni-col>
            <uni-col class="row-col" :span="10">
              <view class="title">
                <view class="time">{{ item.createTime }}</view>
                <view class="time-text">{{ item.timeText }}</view>
              </view>
            </uni-col>
          </uni-row>
        </view>
        <!--      </scroll-view>-->
      </z-paging>
      <view v-if="loading" class="loading">
        <image src="/static/img/load.gif"></image>
        <view>加载中...</view>
      </view>
      <view style="height: 120rpx">
        <Common :total="total" />
      </view>
    </view>
    <uni-drawer ref="pay" mode="right" :width="100">
      <time-picker @closePay="closePay" @changeTime="changeTime" :line="'.'" :startTimes="startTime" :endTimes="endTime">
      </time-picker>
    </uni-drawer>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import Common from "./common/common";
import TimePicker from "../../../components/common/time-picker";
import { getTime } from "../../../utils/function"
import { accessRecord } from "../../../utils/lottery/mine";
import defaultTemplate from "../../../utils/defaultTemplate";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "index",
  components: {
    AlertInjectLayer, UniCol, UniRow, NavBar, Common, TimePicker
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "存取记录",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      type: 0,
      menu: [{ name: '全部' }, { name: "充值" }, { name: '提现' }],
      start: '',
      end: '',
      startTime: '',
      endTime: '',
      time: '',
      timeStr: '',
      today: '',
      order: '',
      orderBy: '',
      pageNo: 1,
      pageSize: 12,
      list: [],
      total: [],
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
      uni.navigateTo({
        url: 'detail?createTime=' + item.createTime + "&id=" + item.id + "&source=" + item.source,
        success: function (res) {
          res.eventChannel.emit('argParams', item)
        }
      })
    },
    selectType(index) {
      this.type = index
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
      this.loading = true
      this.pageNo = pageNo
      let prams = {
        'beginTime': this.startTime,
        'endTime': this.endTime,
        'order': this.order,
        'orderBy': this.orderBy,
        'pageNo': this.pageNo,
        'pageSize': this.pageSize,
        'type': this.type,
      }
      accessRecord(prams).then(res => {
        const { list, stat: total } = defaultTemplate({
          list: [{
            id: "",
            orderNo: "",
            bankNumber: 0,
            source: '1',
            type: "",
            childType: "",
            amount: 0,
            discountAmount: 0,
            fee: 0,
            feeRatio: 0,
            status: 1,
            statusText: "",
            createTime: "",
            lockTime: "",
            confirmTime: "",
            remark: "",
            timeText: ""
          }],
          stat: {
            totalRechargeAmount: 0,
            totalDrawAmount: 0,
            rechargeSuccessAmount: 0,
            drawSuccessAmount: 0
          }
        }, res.result)
        if (this.type == 0) {
          this.total = [
            { title: '充值总额', amount: total.totalRechargeAmount },
            { title: '提现总额', amount: total.totalDrawAmount },
            { title: '充值成功', amount: total.rechargeSuccessAmount },
            { title: '提现成功', amount: total.drawSuccessAmount },
          ]
        } else if (this.type == 1) {
          this.total = [
            { title: '充值总额', amount: total.totalRechargeAmount },
            { title: '充值成功', amount: total.rechargeSuccessAmount },
          ]
        } else {
          this.total = [
            { title: '提现总额', amount: total.totalDrawAmount },
            { title: '提现成功', amount: total.drawSuccessAmount },
          ]
        }
        this.$refs.paging.complete(list);
        this.loading = false
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

  image {
    width: 100rpx;
    height: 100rpx;
  }
}

.log-box {
  font-family: 'PingFang SC';
  position: fixed;

  .menu-box {
    height: 60rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #FFFFFF;
    border-bottom: 1px solid #87CEC1;

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

        .title {
          /* font-weight: 400;*/
          font-size: 22rpx;
          text-align: center;
          color: #666666;

          .type-text {
            font-size: 22rpx;
            color: #444444;
          }

          .bank,
          .money-text {
            font-size: 22rpx;
            color: #444444;
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
</style>