<template>
  <view class="bet-body">
    <view class="tab">
      <uni-row>
        <uni-col class="tab-col" v-for="(item, index) in nav" :span="8">
          <view class="tab-nav" :class="{ active: index == curr }" @click="selectType(index, item)">{{ item.name }}</view>
        </uni-col>
      </uni-row>
    </view>
    <view class="paging">
      <z-paging class="bet-box" ref="paging" v-model="dataList" @query="getList" :lower-threshold="10"
        :refresher-enabled="true" :refresherAnimated="false" :show-refresher-update-time="true"
        :refresher-default-text="'松开刷新...'" :refresher-pulling-text="'松开刷新...'"
        :refresher-default-img="'/static/img/loading.gif'" :refresher-pulling-img="'/static/img/loading.gif'"
        :refresher-refreshing-img="'/static/img/loading.gif'" :refresher-default-style="'#CCDBEE'"
        :refresher-background="'#CCDBEE'" :refresher-fixed-background="'#CCDBEE'"
        :refresher-img-style="{ width: '100rpx', height: '100rpx', transform: 'rotate(0deg)' }"
        :refresher-refreshing-text="'正在加载更多数据...'"
        :loading-more-loading-icon-custom-style="{ width: '100rpx', height: '100rpx' }"
        :loading-more-loading-icon-custom-image="'/static/img/loading.gif'"
        :loading-more-custom-style="{ 'padding-top': '20rpx', 'background': '#CCDBEE' }" :loading-more-loading-animated="false"
        :loading-more-default-as-loading="true" :show-loading-more-no-more-view="true"
        :loading-more-no-more-text="'没有更多数据了'" :show-loading-more-no-more-line="false" :hide-empty-view="false"
        :empty-view-center="true" :empty-view-text="''" :empty-view-img="'/static/img/liuhe/empty.png'" :fixed="false"
        :empty-view-style="{ 'margin-bottom': '170px' }" :empty-view-img-style="{ 'width': '260rpx', 'height': '260rpx' }"
        :empty-view-title-style="{ 'color': ' #999999', 'font-size': '30rpx', 'line-height': '44rpx', 'margin-top': '10rpx' }">
        <view v-for="(item, index) in dataList" :key="index" @click="detail(item)">
          <view :class="index % 2 === 0 ? 'bet-row' : 'bet-row other'">
            <view class="bet-col item1">
              <view class="center">
                <view class="lottery-name">{{ item.lotteryName }}</view>
                <view class="period">{{ item.lotteryNo }}</view>
              </view>
            </view>
            <view class="bet-col item2">
              <view class="center">
                <view class="detail">{{ item.secondPlayName }}<text>@{{ item.betValue }}</text></view>
                <view class="bet-num">{{ setAmount(item.betAmount) }}</view>
              </view>
            </view>
            <view class="bet-col item3">
              <view class="center" v-if="item.status == 0">
                <view class="status">
                  {{ item.statusName }}
                </view>
                <view class="profit">--</view>
              </view>
              <view class="center" v-else-if="item.status == 1">
                <view class="status not-win">
                  {{ item.statusName }}
                </view>
                <view class="profit" style="color:#34B822">--</view>
              </view>
              <view class="center" v-else-if="item.status == 2">
                <view class="status win">
                  {{ item.statusName }}
                </view>
                <view class="profit rewards">{{ setAmount(item.winAmount) }}</view>
              </view>

              <view class="center" v-else-if="item.status == 9">
                <view class="status win">
                  {{ item.statusName }}
                </view>
                <view class="profit rewards">{{ setAmount(item.winAmount) }}</view>
              </view>
              <view class="center" v-else>
                <view class="status back">
                  {{ item.statusName }}
                </view>
                <view class="profit">--</view>
              </view>
            </view>
            <view class="bet-col item4">
              <view class="center">
                <view class="time">{{ item.createTime.slice(11, 19) }}</view>
                <view class="time-text">{{ item.shortCreateTimeStr }}</view>
              </view>
            </view>
          </view>
        </view>
      </z-paging>
    </view>
    <view class="order-footer">
      <view class="order-footer-item" v-if="curr === 0">
        <view>
          <view class="line">投注金额<text>{{ setAmount(recordDetail.betAmount) }}</text></view>
          <view class="line">中奖金额<text style="color: #DF2939">{{ setAmount(recordDetail.winAmount) }}</text></view>
        </view>
        <view>
          <view class="line">有效投注<text>{{ setAmount(recordDetail.effectiveAmount) }}</text></view>
          <view class="line">盈亏金额<text style="color: #34B822">{{ setAmount(recordDetail.profitAmount) }}</text></view>
        </view>
      </view>
      <view class="order-footer-item" v-if="curr === 1">
        <view>
          <view class="line">投注金额<text>{{ setAmount(recordDetail.betAmount) }}</text></view>
        </view>
        <view>
          <view class="line">未开奖金额<text>{{ setAmount(recordDetail.unOpenAmount) }}</text></view>
        </view>
      </view>
      <view class="order-footer-item" v-if="curr === 2">
        <view>
          <view class="line">投注金额<text>{{ setAmount(recordDetail.betAmount) }}</text></view>
          <view class="line">已中奖金额<text style="color: #DF2939">{{ setAmount(recordDetail.winAmount) }}</text></view>
        </view>
        <view>
          <view class="line">未中奖金额<text style="color: #34B822">{{ setAmount(recordDetail.unWinAmount) }}</text></view>
          <view class="line">盈亏金额<text style="color: #34B822">{{ setAmount(recordDetail.profitAmount) }}</text></view>
        </view>
      </view>
      <view>
        <view class="records-button" @click="toHistory" v-if="userInfo">购彩记录</view>
      </view>
    </view>
  </view>
</template>

<script>
import { list } from "../../../utils/lottery/betting";
import Playing from "../../../utils/common/playing";
// import ZPaging from "../../../uni_modules/z-paging/components/z-paging/js/z-paging-main";
export default {
  name: "BetSlip",
  // components: {ZPaging},
  props: {
    lotteryId: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      curr: 0,
      dataList: [],
      userInfo: uni.getStorageSync('userInfo'),
      recordDetail: {
        betAmount: "",
        winAmount: "",
        effectiveAmount: "",
        profitAmount: "",
        unOpenAmount: "",
        unWinAmount: ""
      },
      playing: new Playing(),
      nav: [
        { name: "全部", status: null },
        { name: "未开奖", status: 0 },
        { name: "已开奖", status: 1 },
      ],
      type: 1,
      pageNo: 1,
      pageSize: 10,
      itemStatus: null,
      status: 'more',
      contentText: {
        contentdown: '查看更多',
        contentrefresh: '加载中',
        contentnomore: '没有更多'
      }
    }
  },
  mounted() {
    this.getList()
  },

  methods: {
    setAmount(val) {
      return this.playing.setAmount(val, 2, '.', ',')
    },
    //前往购彩记录
    toHistory() {
      uni.navigateTo({
        url: '/pages/liuhe/history/index'
      })
    },
    detail(item) {
      uni.navigateTo({
        url: '/pages/liuhe/bet_details',
        success: function (res) {
          res.eventChannel.emit('argParams', item)
        }
      })
    },
    selectType(index, item) {
      this.curr = index;
      this.itemStatus = item.status
      this.$refs.paging.reload()
    },
    getList(pageNo = 1, pageSize = 10) {
      this.pageNo = pageNo
      this.pageSize = pageSize
      let prams = { type: this.type, pageNo: this.pageNo, pageSize: this.pageSize, status: this.itemStatus };
      if (!isLogin()) {
        this.$refs.paging.complete([]);
        return false
      }
      list(prams).then(res => {
        this.recordDetail = res.result;
        this.$refs.paging.complete(res.result.page.records);
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bet-body {
  width: 100%;
  padding: 0;
  margin: 0;

  .tab {
    width: 100%;
    height: 70rpx;
    background-color: #CCDBEE;
    border-bottom: 2px solid #B5D4E6;

    .tab-col {
      line-height: 70rpx;
      font-size: 30rpx;
      font-weight: 400;
      text-align: center;
      color: #458198;

      .active {
        color: #03536E;
        position: relative;
        margin: auto;
        display: inline-block;

        &:after {
          position: absolute;
          box-sizing: border-box;
          content: " ";
          pointer-events: none;
          right: 0%;
          bottom: 0px;
          left: 25%;
          border-bottom: 3px solid #0099CC;
          width: 50%;
        }
      }
    }
  }

  .paging {
    width: 100%;
    height: calc(var(--vh) - 70rpx);
    background: #CCDBEE;

    .bet-box {
      height: calc(var(--vh) - 530rpx);

      .bet-row.other {
        background: #CCDBEE;
        border-bottom: 2rpx solid #B5D4E6;
      }

      .bet-row {
        height: 120rpx;
        padding: 20rpx 30rpx;
        background: #DEEAFA;
        box-sizing: border-box;
        border-bottom: 2rpx solid #B5D4E6;
        display: flex;

        .bet-col {
          font-family: 'PingFang SC';
          font-size: 20rpx;
          font-weight: 400;
          height: 100%;

          .center {
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            line-height: 36rpx;

            .lottery-name {
              font-size: 28rpx;
              color: #03536E;
              text-align: left;
            }

            .period {
              font-size: 24rpx;
              color: #8CB2C9;
              text-align: left;
            }

            .detail {
              font-size: 28rpx;
              color: #03536E;
              overflow: hidden; //超出的文本隐藏
              text-overflow: ellipsis; //溢出用省略号显示
              white-space: nowrap; //溢出不换行
            }

            .bet-num {
              font-size: 24rpx;
              color: #03536E;
            }

            .profit {
              font-size: 24rpx;
              color: #0099CC;
              overflow: hidden; //超出的文本隐藏
              text-overflow: ellipsis; //溢出用省略号显示
              white-space: nowrap; //溢出不换行
              width: 6.5em;
            }

            .status {
              font-size: 26rpx;
              color: #0099CC
            }

            .profit.rewards {
              color: #DF2939;
            }

            .not-win {
              color: #34B822;
            }

            .win {
              color: #DF2939;
            }

            .time {
              font-size: 26rpx;
              color: #8CB2C9;
            }

            .time-text {
              color: #DF2939;
              font-size: 24rpx;
            }
          }
        }

        .bet-col.item1 {
          width: 168rpx;
          margin-right: 30rpx;
        }

        .bet-col.item2 {
          width: 170rpx;
          margin-right: 30rpx;
        }

        .bet-col.item3 {
          width: 136rpx;
          margin-right: 30rpx;
        }

        .bet-col.item4 {
          width: 106rpx;
        }
      }
    }

    .empty {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50%;
      width: 100%;

      .empty-img {
        width: 238rpx;
        height: 178rpx;

        image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .order-footer {
    height: 120rpx;
    position: absolute;
    z-index: 10;
    bottom: 0;
    background: #F2F8FF;
    width: 100%;
    display: flex;
    text-align: left;
    padding: 0 20rpx 0 20rpx;
    justify-content: space-between;
    box-sizing: border-box;

    .order-footer-item {
      display: flex;
      align-items: center;
      height: 100%;
      flex: 1 1 0;

      view {
        flex: 1 1 0;
      }

      .line {
        color: #8CB2C9;
        font-size: 24rpx;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
        width: 100%;

        text {
          margin-left: 10rpx;
        }
      }

      .line:nth-child(1) {
        margin-bottom: 18rpx;
      }
    }

    view {
      width: 200rpx;

      .records-button {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10rpx;
        width: 200rpx;
        height: 60rpx;
        background: #3881A8;
        border-radius: 6rpx;
        font-size: 32rpx;
        line-height: 45rpx;
        color: #FFFDFD;
        margin-top: 30rpx;
      }
    }
  }
}</style>
