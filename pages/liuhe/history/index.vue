<template>
  <view class="history-records" :style="{ height: windowHeight }">
    <view class="nav">
      <nav-bar :left-width="navWidth.left" :right-width="navWidth.right" :headerStyle="headerStyle"
        :fontColor="headerStyle.color">
        <block slot="title">
          <view class="nav-title">
            <view class="nav-tabs">
              <view v-for="item in headerTab" :key="item.key"
                :class="param.dataType === item.key ? 'nav-tabs-item active' : 'nav-tabs-item'"
                @click="onChangeTab(item.key)">
                {{ item.value }}</view>
            </view>
          </view>
        </block>
      </nav-bar>
    </view>
    <view class="calendar-content" :style="{ height: windowHeight }" v-if="showCalendar">
      <time-picker :dayStatMap="dayStatMap" @closePay="back" @changeTime="changeTime" :line="'.'" :diff="15"
        :startTimes="startTime" :endTimes="endTime"></time-picker>
    </view>
    <view class="record-content">
      <view class="record-tab" v-if="param.dataType === 1">
        <view :class="param.detailStatus === item.value ? 'record-tab-item selected' : 'record-tab-item'"
          @click="onSelectStatus(item.value)" v-for="(item, index) in recordTypes" :key="index">
          {{ item.label }}
          <view class="line"></view>
        </view>
      </view>
      <view class="record-tab" v-if="param.dataType === 2">
        <view :class="param.detailStatus === item.value ? 'record-tab-item selected' : 'record-tab-item'"
          @click="onSelectStatus(item.value)" v-for="(item, index) in numRecords" :key="index">
          {{ item.label }}
          <view class="line"></view>
        </view>
      </view>
      <view class="record-tab" v-if="param.dataType === 3">
        <view :class="param.detailStatus === item.value ? 'record-tab-item selected' : 'record-tab-item'"
          @click="onSelectStatus(item.value)" v-for="(item, index) in cancelRecords" :key="index">
          {{ item.label }}
          <view class="line"></view>
        </view>
      </view>
      <view class="date-set">
        <view class="prev">
          <view v-show="isShowPre" @click="setBefore">
            <view class="line1">前一天</view>
            <view class="line2">
              <view class="name">盈亏：</view>
              <view class="amount" :style="setFontColor(currentDetail.lastAmount)">
                {{ setAmount(currentDetail.lastAmount) }}
              </view>
            </view>
          </view>
        </view>
        <view class="current" @click="toCalendar">
          <view class="left">
            <image src="./../../../static/img/liuhe/calendar.png"></image>
          </view>
          <view class="right">
            <view class="line1">{{ showTime }}</view>
            <view class="line2">
              <text class="name">盈亏：</text>
              <text class="amount" :style="setFontColor(currentDetail.profitAmount)">
                {{ setAmount(currentDetail.profitAmount) }}
              </text>
            </view>
          </view>
        </view>
        <view class="next">
          <view v-if="isShowNext" @click="setAfter">
            <view class="line1">后一天</view>
            <view class="line2">
              <view class="name">盈亏：</view>
              <view class="amount" :style="setFontColor(currentDetail.nextAmount)">
                {{ setAmount(currentDetail.nextAmount) }}
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="content-list-header">
        <view class="header-item" @click="onSelectFilter(0)">
          <view class="text">全部</view>
          <view :class="isShowType ? 'all show' : 'all'"></view>
        </view>
        <view v-for="(item, index) in sortList" :key="index" class="header-item" @click="sortData(index)">
          <view class="text">{{ item.title }}</view>
          <view :class="['sort', { up: item.isUp, down: item.isDown }]"></view>
        </view>
      </view>
      <view :class="isShowType === true ? 'lottery-type active' : 'lottery-type'">
        <view :class="currentType === item.id ? 'type-item active' : 'type-item'" v-for="(item, index) in lotteryType"
          :key="index" @click="onSelectType(item.id)">{{ item.name }}</view>
      </view>
      <view class="list-content">
        <z-paging ref="paging" v-model="recordList" @query="loadingList"
          :class="isExpand ? 'content-list active' : 'content-list'" v-show="recordList.length > 0" :lower-threshold="10"
          :refresher-enabled="true" :refresherAnimated="false" :show-refresher-update-time="true"
          :refresher-default-text="'松开刷新...'" :refresher-pulling-text="'松开刷新...'"
          :refresher-default-img="'/static/img/load.gif'" :refresher-pulling-img="'/static/img/load.gif'"
          :refresher-refreshing-img="'/static/img/load.gif'" :refresher-default-style="'#EEEEEE'"
          :refresher-background="'#EEEEEE'" :refresher-fixed-background="'#EEEEEE'"
          :refresher-img-style="{ width: '100rpx', height: '100rpx', transform: 'rotate(0deg)' }"
          :refresher-refreshing-text="'正在加载更多数据...'"
          :loading-more-loading-icon-custom-style="{ width: '100rpx', height: '100rpx' }"
          :loading-more-loading-icon-custom-image="'/static/img/load.gif'"
          :loading-more-custom-style="{ 'padding-top': '20rpx', 'background': '#EEEEEE' }"
          :loading-more-loading-animated="false" :loading-more-default-as-loading="true"
          :show-loading-more-no-more-view="true" :loading-more-no-more-text="'没有更多数据了'" :hide-empty-view="false"
          :empty-view-center="true" :empty-view-text="'暂无记录'" :empty-view-img="'/static/img/empty.png'" :fixed="false"
          :empty-view-style="{ 'margin-bottom': '170px' }"
          :empty-view-img-style="{ 'width': '260rpx', 'height': '260rpx' }"
          :empty-view-title-style="{ 'color': ' #999999', 'font-size': '30rpx', 'line-height': '44rpx', 'margin-top': '10rpx' }">
          <view :class="index % 2 === 0 ? 'content-list-item item' : 'content-list-item'"
            v-for="(item, index) in recordList" :key="index" @click="detail(item)">
            <view class="item-card all">
              <view class="name">{{ item.lotteryName }}</view>
              <view class="num">{{ item.lotteryNo }}</view>
            </view>
            <view class="item-card betting">
              <view class="play-name">{{ item.secondPlayName }}@{{ item.betValue }}</view>
              <view class="amount">{{ setAmount(item.betAmount * item.baseAmount * item.betNum) }}</view>
            </view>
            <view class="item-card un-open">
              <view class="status" :style="setStyle(item.status)">{{ item.statusName }}</view>
              <view class="win" :style="setStyle(item.status)">{{ showPrice(item) }}</view>
            </view>
            <view class="item-card time-m">
              <view class="date">{{ item.otherCreateTime }}</view>
              <view class="current">{{ item.shortCreateTimeStr }}</view>
            </view>
          </view>
        </z-paging>

        <view v-if="loading && recordList.length < 1" class="loading">
          <image src="/static/img/load.gif"></image>
          <view>加载中...</view>
        </view>

        <view class="list-empty" v-else-if="!loading && recordList.length == 0">
          <view class="list-empty-content">
            <image src="./../../../static/img/liuhe/emptyOrder.png"></image>
            <view class="empty-msg">
              您于{{ emptyDateText }} 无{{ headerTab[param.dataType - 1].short }}订单
            </view>
            <view class="empty-tip">
              快去参与投注，赢得属于您的奖金吧
            </view>
          </view>
        </view>
        <view class="bottom-box" :style="currentStyle">
          <view class="bottom-info" :style="currentStyle" v-if="param.dataType === 1">
            <view class="left">
              <image :src="recordImg"></image>
              <view>
                合计
              </view>
            </view>
            <view class="mid">
              <view class="line">账户余额<text>{{ $store.state.appInfoStore.userInfo.userBalance }}</text></view>
              <view class="line">投注总额<text>{{ setAmount(currentDetail.betAmount) }}</text></view>
              <view class="line">有效投注<text>{{ setAmount(currentDetail.effectiveAmount) }}</text></view>
              <view class="line">未开奖金额<text>{{ setAmount(currentDetail.unOpenAmount) }}</text></view>
            </view>
            <view class="right">
              <view class="expand-arrow" @click="setMore">
                <uni-icons :type="isExpand ? 'bottom' : 'top'" size="30"></uni-icons>
              </view>
              <view class="line">中奖金额<text>{{ setAmount(currentDetail.winAmount) }}</text></view>
              <view class="line" v-if="currentDetail.profitAmount < 0">盈亏<text :style="'color:#9ACD32'">{{
                setAmount(currentDetail.profitAmount) }}</text></view>
              <view class="line" v-else>盈亏<text :style="'color:#DF2939'">{{ setAmount(currentDetail.profitAmount)
              }}</text></view>
              <view class="line">返点<text>{{ setAmount(currentDetail.rebateAmount) }}</text></view>
              <view class="line">撤单<text>{{ setAmount(currentDetail.cancelAmount) }}</text></view>
            </view>
          </view>
          <view class="bottom-info" :style="currentStyle" v-else-if="param.dataType === 2">
            <view class="left">
              <image :src="recordImg"></image>
              <view>
                合计
              </view>
            </view>
            <view class="mid">
              <view class="line">账户余额<text>{{ $store.state.appInfoStore.userInfo.userBalance }}</text></view>
              <view class="line">投注总额<text>{{ setAmount(currentDetail.betAmount) }}</text></view>
              <view class="line">有效投注<text>{{ setAmount(currentDetail.effectiveAmount) }}</text></view>
              <view class="line">未开奖金额<text>{{ setAmount(currentDetail.unOpenAmount) }}</text></view>
            </view>
            <view class="right">
              <view class="expand-arrow" @click="setMore">
                <uni-icons :type="isExpand ? 'bottom' : 'top'" size="30"></uni-icons>
              </view>
              <view class="line">中奖金额<text>{{ setAmount(currentDetail.winAmount) }}</text></view>
              <view class="line" v-if="currentDetail.profitAmount < 0">盈亏<text :style="'color:#9ACD32'">{{
                setAmount(currentDetail.profitAmount) }}</text></view>
              <view class="line" v-else>盈亏<text :style="'color:#DF2939'">{{ setAmount(currentDetail.profitAmount)
              }}</text></view>
              <view class="line">返点<text>{{ setAmount(currentDetail.rebateAmount) }}</text></view>
              <view class="line">撤单<text>{{ setAmount(currentDetail.cancelAmount) }}</text></view>
            </view>
          </view>
          <view class="bottom-info-2" :style="currentStyle" v-else>
            <view class="left">
              <image :src="recordImg"></image>
              <view>
                合计
              </view>
            </view>
            <view class="mid">
              <view class="line">账户余额<text>{{ $store.state.appInfoStore.userInfo.userBalance }}</text></view>
            </view>
            <view class="right">
              <view class="line">撤单<text>{{ setAmount(currentDetail.cancelAmount) }}</text></view>
            </view>
          </view>
        </view>
      </view>

    </view>
    <AlertInjectLayer />
  </view>
</template>
<script>
import NavBar from "../../../components/common/navBar/navBar";
import { getLotteryList, list } from "../../../utils/lottery/betting";
import Playing from "../../../utils/common/playing";
import TimePicker from "../../../components/common/time-picker";
import { getTime } from "../../../utils/function"
import defaultTemplate from "../../../utils/defaultTemplate";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  components: {
    AlertInjectLayer,
    NavBar,
    TimePicker
  },
  data() {
    return {
      playing: new Playing(),
      isExpand: false,
      sortText: 'default',
      isSort: false,
      sortList: [
        {
          title: "投注",
          isUp: false,
          isDown: false,
        }, {
          title: "盈亏",
          isUp: false,
          isDown: false,
        }, {
          title: "时间",
          isUp: false,
          isDown: false,
        }
      ],
      showCalendar: false,
      // contentText: { contentdown: "上拉加载更多", contentrefresh: "正在加载...", contentnomore: "没有更多数据了" },
      loadStatus: "more",
      windowHeight: uni.$sys.windowHeight + 'px',
      headerStyle: {
        backgroundColor: '#1794FF',
        color: '#fff',
        height: 47
      },
      current: 1,
      navWidth: {
        left: 50,
        right: 50
      },
      currentStyle: {
        height: '120rpx',
        transition: '.3s'
      },
      headerTab: [
        {
          key: 1,
          value: '历史报表',
          short: '历史',
        },
        {
          key: 2,
          value: '追号记录',
          short: '追号',
        },
        {
          key: 3,
          value: '撤单记录',
          short: '撤单',
        },
      ],
      cancelRecords: [
        {
          label: '全部',
          value: null
        },
        {
          label: '主动撤单',
          value: 1
        },
        {
          label: '系统撤单',
          value: 2
        },
        {
          label: '中奖追停',
          value: 3
        }
      ],
      numRecords: [
        {
          label: '全部',
          value: null
        },
        {
          label: '进行中',
          value: 0
        },
        {
          label: '已完成',
          value: 1
        }
      ],
      recordTypes: [
        {
          label: '全部',
          value: null
        },
        {
          label: '未开奖',
          value: 0
        },
        {
          label: '已中奖',
          value: 2
        },
        {
          label: '未中奖',
          value: 1
        },
        {
          label: '已撤单',
          value: 3
        },
      ],
      lotteryType: [],
      currentType: 0,
      isShowType: false,
      recordList: [],
      param: {
        type: 1,
        date: '',
        detailStatus: null,
        dataType: 1,
        lotteryId: "",
        pageNo: 1,
        pageSize: 15,
        status: null,
        sort: ""
      },
      dateObj: { date: null, text: "" },
      start: '',
      end: '',
      startTime: '',
      endTime: '',
      dayStatMap: null,
      currentDetail: {
        profitAmount: '',
      },
      recordImg: require('./../../../static/img/liuhe/record.png'),
      loading: false
    }
  },
  onShow() {

  },
  onLoad(option) {
    if (option.startTime && option.endTime) {
      const daysDiff = Math.ceil(Math.abs(new Date().getTime() - new Date(option.startTime).getTime()) / (1000 * 3600 * 24)) - 1;

      let date = new Date();
      this.today = getTime(date)
      this.startTime = daysDiff <= 15 ? option.startTime : this.getDay(-15)
      this.endTime = option.endTime
      this.start = this.getDay(-15)
      this.end = this.today

      if (this.start == this.end) {
        this.param.type = 1
      } else {
        this.param.type = 5
      }
    } else {
      let date = new Date();
      this.today = getTime(date)
      this.startTime = this.today
      this.endTime = this.today
      this.start = this.getDay(-15)
      this.end = this.today
    }
    this.loadLotteryList()
    this.$store.dispatch("updateUserBalanceFromServer")
  },
  computed: {
    emptyDateText() {
      const { startTime, endTime } = this
      console.log('this.start == this.end', startTime, endTime);
      if (!startTime && !endTime) {
        return
      }
      if (startTime === endTime) {
        return this.$u.timeFormat(startTime, 'yyyy年mm月dd日')
      }
      return this.$u.timeFormat(startTime, 'yyyy年mm月dd日') + '至' + this.$u.timeFormat(endTime, 'yyyy年mm月dd日')
    },
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
      let startStr = new Date(this.startTime)
      startStr = this.formatDate(startStr.setDate(startStr.getDate()), '-')
      if (startStr == this.start) {
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

      let endStr = new Date(this.endTime)
      endStr = this.formatDate(endStr.setDate(endStr.getDate()), '-')
      console.log(endStr)
      if (endStr == this.end) {
        return false
      } else if (endTime >= end) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {

    detail(item) {
      uni.navigateTo({
        url: '/pages/liuhe/bet_details',
        success: function (res) {
          res.eventChannel.emit('argParams', item)
        }
      })
    },
    showPrice(item) {
      if (item.status === 1) {
        return '-' + this.setAmount(item.betAmount)
      } else if (item.status === 2) {
        return this.setAmount(item.winAmount)
      } else {
        return "--"
      }
    },
    toCalendar() {
      this.showCalendar = true;
    },
    back() {
      this.showCalendar = false;
    },
    sortData(key) {
      this.recordList = [];
      this.isSort = !this.isSort;

      switch (key) {
        case 0:
          this.sortList[1].isDown = false;
          this.sortList[1].isUp = false;
          this.sortList[2].isDown = false;
          this.sortList[2].isUp = false;
          if (this.isSort) {
            this.sortList[key].isDown = true;
            this.sortList[key].isUp = false;
          } else {
            this.sortList[key].isUp = true
            this.sortList[key].isDown = false;
          }
          if (this.sortList[key].isDown) {
            this.param.sort = 1;
          } else {
            this.param.sort = 2;
          }
          break;
        case 1:
          this.sortList[0].isDown = false;
          this.sortList[0].isUp = false;
          this.sortList[2].isDown = false;
          this.sortList[2].isUp = false;
          if (this.isSort) {
            this.sortList[key].isDown = true;
            this.sortList[key].isUp = false;
          } else {
            this.sortList[key].isUp = true
            this.sortList[key].isDown = false;
          }
          if (this.sortList[key].isDown) {
            this.param.sort = 3;
          } else {
            this.param.sort = 4;
          }
          break;
        case 2:
          this.sortList[0].isDown = false;
          this.sortList[0].isUp = false;
          this.sortList[1].isDown = false;
          this.sortList[1].isUp = false;
          if (this.isSort) {
            this.sortList[key].isDown = true;
            this.sortList[key].isUp = false;
          } else {
            this.sortList[key].isUp = true
            this.sortList[key].isDown = false;
          }
          if (this.sortList[key].isDown) {
            this.param.sort = 5;
          } else {
            this.param.sort = 6;
          }
          break;
      }
      this.$refs.paging.reload()
    },
    changeTime(obj) {
      if (obj.start == obj.end) {
        this.param.type = 1
      } else {
        this.param.type = 5
      }
      this.startTime = obj.start
      this.endTime = obj.end
      this.$refs.paging.reload()
    },
    setMore() {
      this.isExpand = !this.isExpand;
      if (this.isExpand) {
        this.currentStyle.height = '240rpx'
      } else {
        this.currentStyle.height = '120rpx'
      }
    },
    setFontColor(num) {
      // console.log(num)
      if (num === 0) {
        return {
          color: "#222222"
        }
      } else if (num > 0) {
        return {
          color: "#DF2939"
        }
      } else {
        return {
          color: "#9ACD32"
        }
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
    getDate() {
      let dateTime = new Date();
      this.dateObj.date = dateTime;
      this.dateObj.text = this.formatDate(dateTime, '.');
      this.startTime = this.formatDate(dateTime, '-');
      this.endTime = this.startTime
      this.getEmptyDateText(this.formatDate(dateTime, '-'));
      console.log(this.dateObj);
      this.start = this.getDay(-30)
      this.end = this.endTime
    },
    formatDate(date, cut, h) {
      let myDate = new Date(date);
      let YY = myDate.getFullYear() + cut;
      let MM =
        (myDate.getMonth() + 1 < 10
          ? "0" + (myDate.getMonth() + 1)
          : myDate.getMonth() + 1) + cut;
      let DD = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
      if (h) {
        let hh =
          (myDate.getHours() < 10 ? "0" + myDate.getHours() : myDate.getHours()) + ":";
        let mm =
          (myDate.getMinutes() < 10 ? "0" + myDate.getMinutes() : myDate.getMinutes()) +
          ":";
        let ss =
          myDate.getSeconds() < 10 ? "0" + myDate.getSeconds() : myDate.getSeconds();
        return YY + MM + DD + " " + hh + mm + ss;

      } else {
        return YY + MM + DD;
      }


    },
    getEmptyDateText(dateText) {
      let reg = /(\d{4})\-(\d{2})\-(\d{2})/;
      this.emptyDateText = dateText.replace(reg, "$1年$2月$3日");
    },
    setBefore() {
      console.log(111)
      if (!this.isShowPre) return
      let start = new Date(this.startTime.replace(/\./g, '/'))
      let date = start.getTime() - 3600 * 1000 * 24
      if (this.startTime == this.endTime) {
        this.endTime = getTime(date)
      }
      this.startTime = getTime(date)
      console.log(this.startTime, this.endTime)
      this.$refs.paging.reload()
    },
    setAfter() {
      if (!this.isShowNext) return
      let end = new Date(this.endTime.replace(/\./g, '/'))
      let date = end.getTime() + 3600 * 1000 * 24
      if (this.startTime == this.endTime) {
        this.startTime = getTime(date)
      }
      this.endTime = getTime(date)
      this.$refs.paging.reload()
    },
    setAmount(num) {
      return this.playing.setAmount(num, 2, '.', ',')
    },
    setStyle(status) {
      switch (status) {
        case 0:
          return {
            color: '#0099CC'
          }
        case 1:
          return {
            color: '#34B822'
          }
        case 2:
          return {
            color: '#DF2939'
          }
        case 3:
          return {
            color: '#333'
          }
        case 4:
          return {
            color: '#6BB3CE'
          }
        case 5:
          return {
            color: '#d43658'
          }
        case 6:
          return {
            color: '#d43658'
          }
        case 7:
          return {
            color: '#6b853f'
          }
        case 8:
          return {
            color: '#43AFD8'
          }
        case 9:
          return {
            color: '#AAAAAA'
          }
        case 11:
          return {
            color: '#fef5a5'
          }
      }
    },
    onChangeTab(index) {
      this.param.dataType = index;
      this.$refs.paging.reload()
    },
    onSelectStatus(val) {
      this.param.detailStatus = val;
      this.$refs.paging.reload()
    },
    loadingList(pageNo, pageSize = 15) {
      this.loading = true
      this.param.pageNo = pageNo
      this.param.pageSize = 15
      let start = new Date(this.startTime)
      let end = new Date(this.endTime)
      if (this.param.type == 1) {
        this.param.date = this.formatDate(start, '-');
      } else {
        this.param.date = this.formatDate(start, '-');
        this.param.endDate = this.formatDate(end, '-');
      }
      list(this.param).then(res => {
        if (res.code === 200) {
          const result = defaultTemplate({
            page: {
              pageIndex: 1,
              pageSize: 15,
              pages: 0,
              records: [],
              total: 0
            },
            dayStatMap: {},
            betAmount: 0,
            winAmount: 0,
            profitAmount: 0,
            effectiveAmount: 0,
            rebateAmount: 0,
            unOpenAmount: 0,
            unWinAmount: 0,
            cancelAmount: 0,
            lastAmount: 0,
            nextAmount: 0
          }, res.result)
          this.currentDetail = result;
          this.dayStatMap = result.dayStatMap
          this.recordList = this.recordList.concat(result.page.records);
          this.$refs.paging.complete(result.page.records);
          this.loading = false
        }
      })
    },
    scrollToLower() {
      if (this.loadStatus === 'noMore') {
        return
      }
      this.param.pageNo += 1;
      this.loadStatus = 'loading';
      this.loadingList();
    },
    //获取彩种列表
    loadLotteryList() {
      getLotteryList().then(res => {
        if (res.code === 200) {
          let obj = {
            name: "全部",
            id: 0
          }
          res.result.unshift(obj);
          this.lotteryType = res.result
        }
      })
    },
    onSelectFilter(index) {
      switch (index) {
        case 0:
          this.isShowType = !this.isShowType
          break;
      }
    },
    onSelectType(id) {
      this.recordList = [];
      this.isShowType = false;
      this.currentType = id;
      this.param.lotteryId = id;
      this.$refs.paging.reload()
    }
  }
}

</script>
<style lang="scss" scoped>
.history-records {
  display: flex;
  position: relative;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;

  .nav {
    height: fit-content;
  }

  .calendar-content {
    width: 100%;
    position: absolute;
    background: #FFFFFF;
    z-index: 11;
  }

  .calendar-content.active {
    right: 0;
    transition: all .3s linear;
  }

  .nav-title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;

    .nav-tabs {
      display: flex;
      //width: 438rpx;
      border-radius: 50rpx;
      margin: 0 auto;
      border: 1px solid #4E8699;

      .nav-tabs-item {
        //text-align: center;
        font-size: 26rpx;
        padding: 9rpx 21rpx 9rpx 21rpx;
        transition: .3s;
      }

      .nav-tabs-item:nth-child(1) {
        border-top-left-radius: 50rpx;
        border-bottom-left-radius: 50rpx;
      }

      .nav-tabs-item:nth-child(3) {
        border-top-right-radius: 50rpx;
        border-bottom-right-radius: 50rpx;
      }

      .nav-tabs-item.active {
        background-color: #fff;
        color: #03536E;
        transition: .3s;
      }
    }
  }

  .record-content {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;

    .record-tab {
      height: 60rpx;
      width: 100%;
      background-color: #fff;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .record-tab-item {
        font-size: 24rpx;
        height: 60rpx;
        position: relative;
        line-height: 60rpx;
        display: flex;
        justify-content: center;
        color: #333333;
        transition: .3s;
      }

      .record-tab-item.selected {
        transition: .3s;
        color: #088972;

        .line {
          position: absolute;
          bottom: 0;
          width: 28rpx;
          height: 4rpx;
          background-color: #088972;
          transition: .3s;
        }
      }
    }

    .date-set {
      height: 90rpx;
      width: 100%;
      display: flex;
      box-sizing: border-box;

      .prev {
        background-color: #F4FCFF;
        width: 186rpx;
        box-sizing: border-box;
        padding: 14rpx 12rpx 14rpx 12rpx;
        border-top: 1rpx solid #87CEC1;
        border-bottom: 1rpx solid #DDDDDD;
        border-right: 1rpx solid #DDDDDD;

        // flex: 1;
        .line1 {
          font-size: 22rpx;
          color: #666666;
          text-align: center;
          white-space: nowrap;
        }

        .line2 {
          display: flex;
          align-items: center;

          .name {
            font-size: 20rpx;
            color: #666666;
            white-space: nowrap;
          }

          .amount {
            font-size: 28rpx;
            color: #DF2939;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
          }
        }
      }

      .current {
        background-color: #FFFFFF;
        width: 378rpx;
        padding: 17rpx 24rpx 17rpx 24rpx;
        border-top: 1rpx solid #87CEC1;
        border-bottom: 1rpx solid #DDDDDD;
        display: flex;
        align-items: center;
        box-sizing: border-box;

        // flex: 2;
        .left {
          margin-right: 24rpx;
          display: flex;
          align-items: center;
          justify-content: center;

          image {
            width: 55rpx;
            height: 55rpx;
          }
        }

        .right {
          width: 280rpx;
          text-align: center;

          .line1 {
            font-size: 20rpx;
            color: #666666;
            text-align: center;
            white-space: nowrap;
          }

          .line2 {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            .name {
              font-size: 20rpx;
              color: #666666;
            }

            .amount {
              font-size: 28rpx;
              color: #222222;
            }
          }
        }
      }

      .next {
        background-color: #F4FCFF;
        width: 186rpx;
        box-sizing: border-box;
        padding: 14rpx 12rpx 14rpx 12rpx;
        border-top: 1rpx solid #87CEC1;
        border-bottom: 1rpx solid #DDDDDD;
        border-left: 1rpx solid #DDDDDD;

        // flex: 1;
        .line1 {
          font-size: 22rpx;
          color: #666666;
          text-align: center;
          white-space: nowrap;
        }

        .line2 {
          display: flex;
          align-items: center;

          .name {
            font-size: 20rpx;
            color: #666666;
            white-space: nowrap;
          }

          .amount {
            font-size: 28rpx;
            color: #DF2939;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
          }
        }
      }
    }

    .content-list-header {
      display: flex;
      justify-content: space-around;
      background-color: #FFFFFF;
      height: 50rpx;
      border-bottom: 1rpx solid #DDDDDD;

      .header-item {
        color: #666666;
        font-size: 22rpx;
        padding: 9rpx 0 9rpx 0;
        display: flex;
        align-items: center;

        .all {
          width: 30rpx;
          height: 30rpx;
          background-repeat: no-repeat;
          background-image: url("./../../../static/img/liuhe/Ellipse.png");
          background-size: 100% 100%;
          margin-left: 4rpx;
        }

        .all.show {
          transform: rotate(-180deg);
        }

        .sort {
          width: 17rpx;
          height: 17rpx;
          background-repeat: no-repeat;
          background-image: url("./../../../static/img/liuhe/sort.png");
          background-size: 100% 100%;
          margin-left: 4rpx;

          &.down {
            width: 17rpx;
            height: 17rpx;
            background-repeat: no-repeat;
            background-image: url("./../../../static/img/liuhe/sort-down.png");
            background-size: 100% 100%;
            margin-left: 4rpx;
          }

          &.up {
            width: 17rpx;
            height: 17rpx;
            background-repeat: no-repeat;
            background-image: url("./../../../static/img/liuhe/sort-down.png");
            background-size: 100% 100%;
            margin-left: 4rpx;
            transform: rotate(-180deg);
          }
        }
      }
    }

    .lottery-type {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      height: 0;
      grid-column-gap: 30rpx;
      grid-row-gap: 30rpx;
      box-sizing: border-box;
      overflow-y: scroll;
      transition: height .3s linear;
      top: 215rpx;
      position: absolute;
      background: #F6F6F6;
      z-index: 1;

      .type-item {
        text-align: center;
        line-height: 60rpx;
        font-size: 25rpx;
        width: 218rpx;
        height: 60rpx;
        background: #ffffff;
        border: 1rpx solid #E7E7E7;
        border-radius: 50rpx;
        color: #333333;
      }

      .type-item.active {
        background: #8CB2C9;
        color: #FFFFFF;
      }
    }

    .lottery-type.active {
      display: flex;
      padding: 15rpx;
      flex-wrap: wrap;
      height: 60vh;
      align-content: flex-start;
      box-sizing: border-box;
      grid-column-gap: 30rpx;
      grid-row-gap: 30rpx;
      overflow-y: scroll;
      transition: height .3s linear;

      //position: absolute;
      //background: #F6F6F6;
      //width: 100%;
      //z-index: 1;
      .type-item {
        text-align: center;
        line-height: 60rpx;
        font-size: 25rpx;
        width: 218rpx;
        height: 60rpx;
        background: #ffffff;
        border: 1rpx solid #E7E7E7;
        border-radius: 50rpx;
        color: #333333;
      }

      .type-item.active {
        background: #8CB2C9;
        color: #FFFFFF;
      }
    }

    .list-empty {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;

      .list-empty-content {
        text-align: center;

        image {
          width: 260rpx;
          height: 260rpx;
        }

        .empty-msg {
          font-weight: 400;
          font-size: 30rpx;
          line-height: 40rpx;
          /* identical to box height, or 133% */
          text-align: center;
          color: #999999;
          margin-bottom: 15rpx;
        }

        .empty-tip {
          font-weight: 400;
          font-size: 24rpx;
          line-height: 34rpx;
          /* identical to box height */
          text-align: center;
          color: #999999;
        }
      }
    }

    .bottom-info {
      width: 100%;
      max-width: 480px;
      background-color: #FFF2DF;
      //position: fixed;
      //bottom: 0;
      //z-index: 1;
      display: flex;
      padding: 23rpx 20rpx 0 15rpx;
      box-sizing: border-box;

      .line {
        font-size: 20rpx;
        margin-bottom: 26rpx;
        color: #B8A68B;
      }

      .left {
        //padding: 25rpx 0 0 0;
        font-size: 25rpx;
        width: 116rpx;
        height: 100%;

        image {
          width: 50rpx;
          height: 50rpx;
        }
      }

      .mid {
        width: 297rpx;
        height: 100%;
        margin-right: 22rpx;

        text {
          float: right;
        }
      }

      .right {
        position: relative;
        width: 297rpx;
        height: 100%;

        text {
          float: right;
        }

        .expand-arrow {
          position: absolute;
          right: 23rpx;
        }
      }
    }

    .bottom-info-2 {
      width: 100%;
      max-width: 480px;
      background-color: #FFF2DF;
      // position: absolute;
      position: fixed;
      bottom: 0;
      z-index: 10;
      display: flex;
      padding: 23rpx 20rpx 0 15rpx;
      box-sizing: border-box;

      .line {
        font-size: 20rpx;
        width: 100%;
        margin-bottom: 26rpx;
        color: #B8A68B;
      }

      .left {
        //padding: 25rpx 0 0 0;
        font-size: 25rpx;
        width: 116rpx;
        height: 100%;

        image {
          width: 50rpx;
          height: 50rpx;
        }
      }

      .mid {
        width: 297rpx;
        height: 100%;
        margin-right: 22rpx;
        display: flex;
        align-items: center;

        text {
          float: right;
          color: #666633;
        }
      }

      .right {
        position: relative;
        width: 297rpx;
        height: 100%;
        display: flex;
        align-items: center;

        text {
          float: right;
          color: #666633;
        }

        .expand-arrow {
          position: absolute;
          right: 23rpx;
        }
      }
    }

    .list-content {
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      background-color: #EEEEEE;

      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: auto;

        image {
          width: 100rpx;
          height: 100rpx;
        }
      }

      .bottom-info {
        width: 100%;
        background-color: #FFF2DF;
        // position: absolute;
        position: fixed;
        bottom: 0;
        z-index: 10;
        display: flex;
        padding: 23rpx 20rpx 0 15rpx;
        box-sizing: border-box;

        .line {
          font-size: 20rpx;
          margin-bottom: 26rpx;
          color: #B8A68B;
        }

        .left {
          //padding: 25rpx 0 0 0;
          font-size: 25rpx;
          width: 116rpx;
          height: 100%;

          image {
            width: 50rpx;
            height: 50rpx;
          }
        }

        .mid {
          width: 297rpx;
          height: 100%;
          margin-right: 22rpx;

          text {
            float: right;
            color: #666633;
          }
        }

        .right {
          position: relative;
          width: 297rpx;
          height: 100%;

          text {
            float: right;
            color: #666633;
          }

          .expand-arrow {
            position: absolute;
            right: 23rpx;
          }
        }
      }

      .content-list.active {
        transition: .3s;
      }

      .content-list {
        height: 100%;
        transition: .3s;
        display: flex;
        flex-direction: column;

        .content-list-item {
          height: 110rpx;
          box-sizing: border-box;
          background: #FFFFFF;
          padding: 17.5rpx 14rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .time-m {
            text-align: center;
            width: 176rpx;
          }

          .un-open {
            width: 140rpx;
          }

          .betting {
            width: 188rpx;
          }

          .all {
            width: 218rpx;
          }

          .item-card {}

          .name {
            color: #444444;
            font-size: 26rpx;
          }

          .num {
            color: #999999;
            font-size: 22rpx;
          }

          .play-name {
            color: #333333;
            font-size: 24rpx;
          }

          .amount {
            color: #333333;
            font-size: 24rpx;
          }

          .status {
            font-size: 26rpx;
          }

          .win {
            font-size: 26rpx;
          }

          .date {
            color: #999999;
            font-size: 22rpx;
          }

          .current {
            font-size: 20rpx;
            color: #DF2939;
          }
        }

        .content-list-item.item {
          background: #EEEEEE;
        }
      }
    }

  }
}
</style>
