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
            盈亏：<text class="coin" :class="lastAmount > 0 ? 'red' : lastAmount < 0 ? 'green' : ''">{{ lastAmount || '0.00'
            }}</text>
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
            盈亏：<text class="num-text" :class="todayAmount > 0 ? 'red' : todayAmount < 0 ? 'green' : ''">
              {{ todayAmount || '0.00' }}
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
            盈亏：<text class="coin" :class="nextAmount > 0 ? 'red' : nextAmount < 0 ? 'green' : ''">{{ nextAmount || '0.00'
            }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="type-box">
      <uni-row class="row-box">
        <uni-col class="row-col" :span="7">
          <view class="title icon-box" @click="isShow = !isShow">
            第三方类别
          </view>

        </uni-col>
        <uni-col class="row-col" :span="4">
          <view class="title icon-box">
            投注总额
            <view class="sort-box" @click="setSort('all_bet')">
              <view class="asc" :class="{ 'act-asc': order == 'asc' && orderBy == 'all_bet' }">
              </view>
              <view class="desc" :class="{ 'act-desc': order == 'desc' && orderBy == 'all_bet' }">
              </view>
            </view>
          </view>
        </uni-col>
        <uni-col class="row-col" :span="5">
          <view class="title icon-box">
            盈亏
            <view class="sort-box" @click="setSort('profit')">
              <view class="asc" :class="{ 'act-asc': order == 'asc' && orderBy == 'profit' }">
              </view>
              <view class="desc" :class="{ 'act-desc': order == 'desc' && orderBy == 'profit' }">
              </view>
            </view>
          </view>
        </uni-col>
        <uni-col class="row-col" :span="8">
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

      <z-paging :style="'height: calc(var(--vh) - 96rpx - 90rpx - 50rpx);background: #EEEEEE;'" class="paging"
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
        :loading-more-loading-animated="false" :loading-more-default-as-loading="false"
        :show-loading-more-no-more-view="true" :loading-more-no-more-text="'没有更多数据了'" :hide-empty-view="false"
        :empty-view-center="true" :empty-view-text="'暂无记录'" :empty-view-img="'/static/img/empty.png'" :fixed="false"
        :empty-view-style="{ 'margin-bottom': '170px' }" :empty-view-img-style="{ 'width': '260rpx', 'height': '260rpx' }"
        :empty-view-title-style="{ 'color': ' #999999', 'font-size': '30rpx', 'line-height': '44rpx', 'margin-top': '10rpx' }">
        <view class="list-item" v-for="(item, index) in list" @click="detail(item)">
          <image class="new" v-if="item.timeText == '刚刚'" src="/static/img/user/accountlog/new.png"></image>
          <uni-row class="row-box list-row">
            <uni-col class="row-col" :span="7">
              <view class="title">
                <text class="type-text">{{ item.gameName }}</text>
              </view>
            </uni-col>
            <uni-col class="row-col" :span="4">
              <view class="title">
                <view class="bank gray">{{ item.allBet }}</view>
              </view>
            </uni-col>
            <uni-col class="row-col" :span="5">
              <view class="title">
                <view class="bank" :class="item.profit >= 0 ? 'red' : 'green'">{{ item.profit }}</view>
              </view>
            </uni-col>
            <uni-col class="row-col" :span="8">
              <view class="title">
                <view class="time">{{ item.createTime }}</view>
                <view class="time-text">{{ item.timeText }}</view>
              </view>
            </uni-col>
          </uni-row>
        </view>
      </z-paging>

      <view v-if="loading" class="loading">
        <image src="/static/img/load.gif"></image>
        <view>加载中...</view>
      </view>
    </view>
    <uni-drawer ref="pay" mode="right" :width="100" style="max-width: 480px;margin: auto;">
      <time-picker @closePay="closePay" @changeTime="changeTime" :line="'.'" :dayStatMap="dayStatMap"
        :startTimes="startTime" :endTimes="endTime">
      </time-picker>
    </uni-drawer>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import TimePicker from "../../../components/common/time-picker";
import { getTime } from "../../../utils/function"
import { record } from "../../../utils/lottery/mine";
import defaultTemplate from "../../../utils/defaultTemplate";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "detail",
  components: {
    AlertInjectLayer, UniCol, UniRow, NavBar, TimePicker
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "游戏明细",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      isShow: false,
      platformId: 0,
      start: '',
      end: '',
      startTime: '',
      endTime: '',
      dayStatMap: [],
      time: '',
      timeStr: '',
      today: '',
      GroupType: [],
      order: 'desc',
      orderBy: 'create_time',
      pageNo: 1,
      pageSize: 15,
      list: [],
      total: [],
      info: {},
      lastAmount: 0.00,
      nextAmount: 0.00,
      todayAmount: 0.00,
      loading: false
    }
  },
  onLoad(option) {
    this.title = option.title
    this.platformId = option.platformId

    let date = new Date();
    this.today = getTime(date)
    this.startTime = option.startTime
    this.endTime = option.endTime
    this.start = this.getDay(-30)
    this.end = this.today
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
    getList(pageNo, pageSIze, isLoading) {
      console.log('isLoading', isLoading);
      this.loading = isLoading
      this.pageNo = pageNo
      let prams = {
        'beginTime': this.startTime,
        'endTime': this.endTime,
        'order': this.order,
        'orderBy': this.orderBy,
        'pageNo': this.pageNo,
        'pageSize': this.pageSize,
        'platformId': this.platformId
      }
      console.log(123)
      record(prams).then(res => {
        const { list,
          dayStatMap,
          statList,
          lastAmount,
          nextAmount,
          todayAmount
        } = defaultTemplate({
          lastAmount: 0,
          todayAmount: 0,
          nextAmount: 0,
          list: [
            {
              id: "",
              orderNo: "",
              platformId: '',
              gameName: "",
              allBet: 0,
              profit: 0,
              createTime: "",
              timeText: ""
            },
          ],
          dayStatMap: {}
        }, res.result)
        this.dayStatMap = dayStatMap
        this.total = statList
        this.lastAmount = lastAmount
        this.nextAmount = nextAmount
        this.todayAmount = todayAmount
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

        .red {
          color: #CC3333;
        }

        .coin {
          font-size: 28rpx;
          color: #222222;
          max-width: 50%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .red {
          color: #CC3333;
        }

        .green {
          color: #34B822;
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
          .num-text {
            font-size: 28rpx;
          }

          .red {
            color: #CC3333;
          }

          .coin {
            font-weight: 400;
            font-size: 28rpx;
            color: #222222;
            ;
          }
        }
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
          font-weight: 400;
          font-size: 22rpx;
          text-align: center;
          color: #666666;

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

          .type-text {
            font-size: 22rpx;
            color: #444444;
          }

          .bank,
          .money-text {
            font-size: 22rpx;
            color: #444444;
          }

          .gift-money {
            font-size: 22rpx;
          }

          .gray {
            color: #666666;
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

              .container-list-item {
                margin: 13rpx;
                min-width: 220rpx;
                height: 60rpx;
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
</style>
