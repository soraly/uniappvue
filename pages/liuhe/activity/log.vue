<template>
  <view>
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
    </NavBar>
    <view class="content">
      <view class="title">
        <view class="select">
          <uni-data-select v-model="searchValue" :localdata="range" :clear="false"></uni-data-select>
        </view>
        <view class="total">领取总额<text class="text">{{ Number(receivedAmount).toFixed(2) }}</text></view>
      </view>
      <z-paging :style="'height: calc(var(--vh) - 215rpx);'" class="paging" ref="paging" v-model="list" @query="getList"
        :lower-threshold="10" :refresher-enabled="true" :refresherAnimated="false" :show-refresher-update-time="true"
        :refresher-default-text="'松开刷新...'" :refresher-pulling-text="'松开刷新...'" show-refresher-when-reload
        :refresher-default-img="'/static/img/load.gif'" :refresher-pulling-img="'/static/img/load.gif'"
        :refresher-refreshing-img="'/static/img/load.gif'" :refresher-default-style="'#EEEEEE'"
        :refresher-img-style="{ width: '100rpx', height: '100rpx', transform: 'rotate(0deg)' }"
        :refresher-refreshing-text="'正在加载更多数据...'"
        :loading-more-loading-icon-custom-style="{ width: '100rpx', height: '100rpx' }"
        :loading-more-loading-icon-custom-image="'/static/img/load.gif'"
        :loading-more-custom-style="{ 'padding-top': '20rpx', }" :loading-more-loading-animated="false"
        :loading-more-default-as-loading="true" :show-loading-more-no-more-view="true"
        :loading-more-no-more-text="'没有更多数据了'" :hide-empty-view="false" :empty-view-center="true"
        :empty-view-text="'暂无记录'" :empty-view-img="'/static/img/img_none_jl 1.png'" :fixed="false"
        :empty-view-style="{ 'margin-bottom': '170px' }" :empty-view-img-style="{ 'width': '600rpx', 'height': '543rpx' }"
        :empty-view-title-style="{ 'color': ' #999999', 'font-size': '30rpx', 'line-height': '44rpx', 'margin-top': '10rpx' }">
        <view class="items">
          <view class="item" v-for="(item, index) in list">
            <view class="item-left">
              <view>{{ item.taskName }}</view>
              <view>{{ item.receiveTimeStr }}</view>
            </view>
            <view class="amount">{{ item.rewardMoney }}</view>
          </view>
        </view>
      </z-paging>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script >
import NavBar from "../../../components/common/navBar/navBar";
import { receiveRecord } from "../../../utils/activity/index";
import defaultTemplate from "../../../utils/defaultTemplate";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

function getStartEndDaysAgo(daysAgo) {
  var today = new Date(); // 获取当前日期和时间
  today.setHours(0, 0, 0, 0); // 将时、分、秒和毫秒设置为0

  if (daysAgo > 0) {
    today.setDate(today.getDate() - daysAgo);
  }

  var start = today.getTime(); // 获取开始时间的时间戳

  var startDate = new Date(start); // 转换开始时间为Date对象

  var startFormatted = formatDate(startDate); // 格式化开始时间
  var endFormatted = ''
  if (daysAgo === 1) {
    endFormatted = formatDate(today); // 格式化结束时间
  } else {
    endFormatted = formatDate(new Date()); // 格式化结束时间
  }

  return startFormatted + ',' + endFormatted
}

function formatDate(date) {
  var year = date.getFullYear();
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);

  return year + '-' + month + '-' + day;
}

export default {
  components: {
    AlertInjectLayer, NavBar,
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "领取记录",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      searchValue: getStartEndDaysAgo(0),
      range: [
        { value: getStartEndDaysAgo(0), text: "今日" },
        { value: getStartEndDaysAgo(1), text: "昨日" },
        { value: getStartEndDaysAgo(7), text: "近7日" },
        { value: getStartEndDaysAgo(15), text: "近15日" },
        { value: getStartEndDaysAgo(30), text: "近30日" },
      ],
      startTime: '',
      endTime: '',
      order: '',
      orderBy: '',
      pageNo: 1,
      pageSize: 10,
      type: 0,
      list: [],
      receivedAmount: 0.00
    }
  },
  watch: {
    searchValue(val) {
      this.$refs.paging.reload()
    }
  },
  methods: {
    getList(pageNo, pageSize = 10) {
      this.pageNo = pageNo
      this.pageSize = pageSize
      const times = this.searchValue.split(',')
      let prams = {
        "beginTime": times[0],
        "endTime": times[1],
        "order": "desc",
        "orderBy": "receiveTime",
        "pageNo": 1,
        "pageSize": 10,
        "type": 0
      }
      receiveRecord(prams).then(res => {
        const { pageList, statisticsData } = defaultTemplate({
          pageList: {
            records: [],
            total: 0,
            size: 10,
            current: 1,
            orders: [],
            optimizeCountSql: true,
            searchCount: true,
            countId: null,
            maxLimit: null,
            pages: 0
          },
          statisticsData: {
            receivedAmount: 0
          }
        }, res.result)
        const list = pageList.records
        this.list = list
        this.receivedAmount = statisticsData.receivedAmount
        this.$refs.paging.complete(list);
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  padding: 25rpx 28rpx;
  background: #eff6fe;

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .select {
      width: 100px;

      /deep/ .uni-select {
        border: none;
        width: 160rpx;
        height: 50rpx;
        border-radius: 50rpx;
        background: #fff;

        .uni-select__selector {
          z-index: 999;
        }
      }
    }

    .total {
      font-size: 22rpx;
      color: #222222;

      .text {
        color: #FF8A00;
        margin-left: 10rpx;
      }
    }
  }

  .items {
    display: grid;
    gap: 15rpx;

    .item {
      display: flex;
      justify-content: space-between;
      padding: 22rpx 20rpx;
      background: #fff;
      border-radius: 20rpx;
      align-items: center;

      .item-left {
        font-size: 20rpx;
        display: grid;
        gap: 10rpx;

        .type {
          color: #444444;
        }

        .createTime {
          color: #999999;
        }
      }

      .amount {
        font-size: 22rpx;
        color: #FF8A00;
      }
    }
  }
}
</style>