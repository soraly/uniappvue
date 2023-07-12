<template>
  <view class="betting-results" :style="{ marginTop: safeHeight + 'px' }">
    <nav-bar :fontColor="'#FFFFFF'" :isBack="false" :left-width="120" :right-width="120" :titleStyle="titleStyle"
      :title="title" :headerStyle="headerStyle">
      <block slot="right">
        <view class="nav-right">
          <view :class="refresh ? 'balance refresh' : 'balance'" @click="refreshBalance">
            <text class="balance-text">{{ $store.state.appInfoStore.userInfo.userBalance }}</text>
            <image class="refresh-icon" src="./../../static/img/liuhe/refresh.png"></image>
          </view>
        </view>
      </block>
    </nav-bar>
    <scroll-view scroll-y class="result-list">
      <view class="result-list-item" v-for="(item, index) in results" :key="index">
        <view class="label-type">
          <view class="label-type-text">普通</view>
        </view>
        <view class="item-top">
          <uni-row>
            <uni-col :span="12">
              <view class="title">{{ item.lotteryName }}</view>
              <view class="num">第{{ item.lotteryNo }}期</view>
            </uni-col>
            <uni-col :span="12">
              <view class="item-right">
                <view class="date">
                  {{ item.createTime }}
                </view>
              </view>
            </uni-col>
          </uni-row>
        </view>
        <view class="item-center">
          <uni-row>
            <uni-col :span="12">
              <view class="bet-value">{{ item.betValue }}</view>
              <view class="bet-info">
                <text class="play-name">{{ item.playName }}</text>
                <text class="bet-num">{{ item.betNum }}注</text>
              </view>
              <view class="bet-price">
                <text class="bet-amount">{{ item.betAmount }}倍</text>
                <text class="amount">{{ setAmount(item.betAmount * item.betNum) }}元</text>
              </view>
            </uni-col>
            <uni-col :span="12">
              <view class="item-center-right">
                <view class="withdraw" @click="setWithdraw(item)" v-if="item.status == 0">
                  <image src="./../../static/img/liuhe/withdraw.png"></image>
                  撤单
                </view>
                <view class="reback" v-if="item.status == 3">
                  <image src="./../../static/img/liuhe/detail/cedan.png"></image>
                </view>
              </view>
            </uni-col>
          </uni-row>
        </view>
        <view class="item-bottom">
          <text class="order-num-label">注单编号</text>
          <text class="order-num">{{ item.orderNo }}</text>
        </view>
      </view>
    </scroll-view>
    <view class="total-count">
      <uni-row>
        <uni-col :span="12">第{{ results[0] ? results[0].lotteryNo : null }}期</uni-col>
        <uni-col :span="12">共{{ totalBetNo }}注，{{ setAmount(totalPrice) }}元</uni-col>
      </uni-row>
    </view>
    <view class="btn-group">
      <view class="btn-group-btn" @click="onToNav(1)">查看记录</view>
      <view class="btn-group-btn" @click="onToNav(2)">继续下单</view>
    </view>
    <uni-popup ref="confirm" background-color="#fff">
      <view class="confirm-box">
        <view class="conftrm-text">
          撤单确认
        </view>
        <view class="confirm-content">
          <view>
            <view>{{ itemDetail.lotteryName }}</view>
            <view>{{ itemDetail.lotteryNo }}</view>
            <view>{{ itemDetail.playName }}{{ itemDetail.betValue }}</view>
            <view>{{ setAmount(itemDetail.betAmount) }}</view>
          </view>
        </view>
        <view class="bottom-btn">
          <view class="cancel" @click="cancelBtn">取消</view>
          <view class="confirm-act" @click="submit">确认</view>
        </view>
      </view>
    </uni-popup>

    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import { list, cancel } from "../../utils/lottery/betting";
import UniRow from "../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../uni_modules/uni-row/components/uni-col/uni-col";
import Playing from "../../utils/common/playing";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "betting_results",
  components: {
    AlertInjectLayer,
    UniCol,
    UniRow,
    NavBar
  },
  data() {
    return {
      title: '投注结果',
      playing: new Playing(),
      refresh: false,
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top,
      headerStyle: {
        backgroundColor: 'rgb(23, 148, 255)',
      },
      titleStyle: {
        'font-weight': 500,
        'font-size': '32rpx',
        'line-height': '45rpx',
        'color': '#FFFFFF'
      },
      results: [],
      totalBetNo: 0,
      totalPrice: 0,
      itemDetail: {},
      lotteryId: '',
      listParam: {
        type: 1,
        lotteryNo: ''
      },
    }
  },
  onLoad(param) {
    if (param.lotteryNo) {
      uni.showToast({
        title: "投注成功",
        icon: "success"
      })
      this.listParam.lotteryNo = param.lotteryNo;
      this.listParam.lotteryId = param.lotteryId;
    }
    this.loadingBalance();
    this.getBettingList();

  },
  methods: {
    setAmount(num) {
      return this.playing.setAmount(num, 2, '.', ',')
    },
    //获取余额
    async loadingBalance() {
      await this.$store.dispatch("updateUserBalanceFromServer")
      this.refresh = false;
    },
    //额度刷新
    refreshBalance() {
      this.refresh = true;
      this.loadingBalance()
    },
    getBettingList() {
      let _this = this;
      list(this.listParam).then(res => {
        if (res.code === 200) {
          _this.results = res.result.page.records;
          /**
           * TODO
           * BUG 4220 兼容可能会出现的报错点 onLoad已赋值 此处在赋值
           * 猜测能是 不带参数加载时 重新赋值
           * 另外优化方案 借用localstore 锁定 当前正在进行游戏的lotteryId
           */
          if (_this.results instanceof Array == false || _this.results.length < 1) {
            return;
          }
          _this.lotteryId = res.result.page.records && res.result.page.records.length > 0 ? res.result.page.records[0].lotteryId : _this.lotteryId;
          _this.results.forEach(item => {
            _this.totalBetNo += item.betNum;
            _this.totalPrice += item.betNum * item.betAmount * item.baseAmount;
          })
        }
      })
    },
    setWithdraw(item) {
      console.log(item);
      this.itemDetail = item;
      this.$refs.confirm.open('center')
    },
    cancelBtn() {
      this.$refs.confirm.close()
    },
    submit() {
      if (this.itemDetail.status === 0) {
        cancel({ betId: this.itemDetail.id, createTime: this.itemDetail.createTime }).then(res => {
          if (res.code === 200) {
            this.cancelBtn()
            this.getBettingList()
          } else {
            uni.showToast({
              title: res.message,
              icon: 'none'
            })
          }
        })
      }
    },
    onToNav(index) {
      let path = '';
      switch (this.results[0].lotteryTypeId) {
        case 30:
          path = "shishicai";
          break;
        case 4:
          path = "liuhePlaying";
          break;
        case 28://MRZ  遗漏快三类型跳转逻辑
          path = "kuaisan";
          break;
        case 29:
          path = "airship"
          break;
        case 10:
          path = "PK"
          break;
        case 28:
          path = "kuaisan"
          break;
        case 19:
          path = "elevenOutOfFive"
          break;
        case 31:
          path = "luckyTwenty"
          break;
        case 26:
          path = "pcEgg"
          break;
        case 32:
          path = "luckyFarm"
          break;
      }
      let url = '';
      if (index === 1) {
        url = '/pages/liuhe/' + path + '?records=true' + '&id=' + this.lotteryId;
      } else {
        url = '/pages/liuhe/' + path + '?id=' + this.lotteryId
      }
      uni.redirectTo({
        url: url
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.betting-results {
  background-color: #EEEEEE;

  .nav-right {
    display: flex;

    .balance {
      display: flex;
      justify-content: center;

      .balance-text {
        font-weight: 400;
        font-size: 26rpx;
        text-align: right;
        letter-spacing: -0.5rpx;
        color: #FFFF99;
      }

      .refresh-icon {
        width: 36rpx;
        height: 36rpx;
        transition: 1s;
      }
    }

    .balance.refresh {
      .refresh-icon {
        animation: mymove 1s infinite;
        /*Safari 和 Chrome:*/
        -webkit-animation: mymove 5s infinite;
      }
    }

    @keyframes mymove {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }

    .menu {
      height: 40rpx;
      width: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .confirm-box {
    width: 540rpx;
    height: 456rpx;
    background: #FFFFFF;
    border-radius: 10rpx;

    .conftrm-text {
      padding: 0 17rpx 0 17rpx;
      border: 2rpx solid #E6E6E6;
      font-size: 32rpx;
      line-height: 70rpx;
      text-align: center;
      letter-spacing: -1rpx;
      color: #9A9A9A;
      border-top-left-radius: 10rpx;
      border-top-right-radius: 10rpx;
    }

    .confirm-content {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28rpx;
      text-align: center;
      letter-spacing: -1rpx;
      color: #333333;
      height: 296rpx;
    }

    .bottom-btn {
      display: flex;
      justify-content: space-evenly;

      .cancel,
      .confirm-act {
        border-radius: 264rpx;
        height: 60rpx;
        width: 200rpx;
        text-align: center;
        color: #FFFFFF;
        line-height: 60rpx;
      }

      .cancel {
        background: #8CB2C9;
      }

      .confirm-act {
        background: #FF9900;
      }

      .confirm-act-close {
        border-radius: 264rpx;
        height: 60rpx;
        width: 200rpx;
        text-align: center;
        color: #FFFFFF;
        line-height: 60rpx;
        background: #CCCCCC;
      }
    }
  }

  .result-list {
    height: calc(var(--vh) - 92rpx);
    padding-bottom: 140rpx;

    .result-list-item {
      padding: 0 0 0 48rpx;
      margin-bottom: 26rpx;
      /*border-top: 6rpx solid #3881A8;*/
      background-color: #FFFFFF;
      position: relative;

      .label-type {
        position: absolute;
        left: 0;
        top: -4rpx;
        background-image: url("./../../static/img/liuhe/Vector.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
        width: 84rpx;
        height: 92rpx;

        .label-type-text {
          font-weight: 400;
          font-size: 24rpx;
          line-height: 40rpx;
          color: #FFFFFF;
          transform: rotate(-45deg);
        }
      }

      .item-top {
        padding: 32rpx 0 26rpx 0;
        border-bottom: 1rpx solid #E7E7E7;

        .title {
          font-weight: bold;
          font-size: 30rpx;
          line-height: 42rpx;
          color: #333333;
        }

        .num {
          font-weight: 500;
          font-size: 23rpx;
          line-height: 32rpx;
          color: #999999;
        }

        .item-right {
          position: relative;
          height: 74rpx;

          .date {
            position: absolute;
            font-weight: 500;
            font-size: 24rpx;
            line-height: 34rpx;
            color: #999999;
            bottom: 4rpx;
            right: 40rpx;
          }
        }
      }

      .item-center {
        padding: 26rpx 0 36rpx 0;
        border-bottom: 1rpx solid #E7E7E7;
        height: 160rpx;

        .bet-value {
          font-weight: 400;
          font-size: 35rpx;
          line-height: 49rpx;
          color: #CC3434;
        }

        .bet-info {
          .play-name {
            font-weight: 400;
            font-size: 26rpx;
            line-height: 36rpx;
            color: #333333;
          }

          .bet-num {
            font-weight: 400;
            font-size: 26rpx;
            line-height: 36rpx;
            color: #333333;
            margin-left: 16rpx;
          }
        }

        .bet-price {
          .bet-amount {
            font-weight: 400;
            font-size: 26rpx;
            line-height: 36rpx;
            color: #333333;
          }

          .amount {
            font-weight: 400;
            font-size: 26rpx;
            line-height: 36rpx;
            color: #333333;
            margin-left: 16rpx;
          }
        }

        .item-center-right {
          height: 100%;
          position: relative;

          .withdraw {
            position: absolute;
            right: 12rpx;
            width: 140rpx;
            height: 48rpx;
            background: #8CB2C9;
            border-radius: 30rpx;
            font-weight: 400;
            font-size: 28rpx;
            line-height: 39rpx;
            color: #FFFFFF;
            display: flex;
            justify-content: center;
            align-items: center;

            image {
              width: 32rpx;
              height: 32rpx;
            }
          }

          .reback {
            position: absolute;
            top: 18rpx;
            right: 43rpx;
            width: 140rpx;
            height: 48rpx;

            image {
              width: 176rpx;
              height: 104rpx;
            }
          }
        }
      }

      .item-bottom {
        padding: 37rpx 0 43rpx 0;

        .order-num-label {
          font-weight: 400;
          font-size: 24rpx;
          line-height: 34rpx;
          color: #666666;
        }

        .order-num {
          font-weight: 400;
          font-size: 24rpx;
          line-height: 34rpx;
          color: #666666;
          margin-left: 34rpx;
        }
      }
    }
  }

  .total-count {
    position: fixed;
    max-width: 480px;
    background: #FFF2DF;
    height: 60rpx;
    width: 100%;
    bottom: 80rpx;
    font-size: 25rpx;
    line-height: 60rpx;
    color: #333333;
    text-align: center;
  }

  .btn-group {
    position: fixed;
    max-width: 480px;
    bottom: 0;
    width: 100%;
    height: 70rpx;
    display: flex;
    justify-content: space-around;
    background: #EEEEEE;
    padding: 10rpx 0 0 0;

    .btn-group-btn {
      background: #8CB2C9;
      border-radius: 30rpx;
      width: 290rpx;
      height: 60rpx;
      color: #FFFFFF;
      font-size: 30rpx;
      line-height: 60rpx;
      text-align: center;
    }

    .btn-group-btn:nth-child(2) {
      background: #FF9900;
      border-radius: 30rpx;
      width: 290rpx;
      height: 60rpx;
      color: #FFFFFF;
      font-size: 30rpx;
      line-height: 60rpx;
      text-align: center;
    }
  }
}
</style>
