<template>
  <view class="bet-body">
    <nav-bar :title="title" :fontColor="'#FFFFFF'" :titleStyle="titleStyle" :header-style="headerStyle">
      <block slot="right">
        <view class="right-box" @click="toNav">
          <image src="/static/img/liuhe/detail/qiu.png"></image>
          号码
        </view>
      </block>
    </nav-bar>
    <view class="title-box">
      <uni-row class="title-row">
        <uni-col class="title-col" :span="17">
          <view class="left-box">
            <view class="top">
              <span class="lottery-name">{{ detail.lotteryName }}</span>
              <span class="period">第{{ detail.lotteryNo }}期</span>
              <image src="/static/img/liuhe/detail/no.png"></image>
            </view>
            <view class="bottom">
              <span class="content">{{ detail.playName }}</span>
            </view>
          </view>
        </uni-col>
        <uni-col class="title-col" :span="7">
          <view class="right-box">
            <image class="status-img" :src="setStatusImg(detail.status)"></image>
            <!--            <image class="status-img" src="/static/img/liuhe/detail/cedan.png" v-if="detail.status == 3"></image>-->
            <!--            <image class="status-img" src="/static/img/liuhe/detail/zj.png" v-else-if="detail.status == 2"></image>-->
            <!--            <image class="status-img" src="/static/img/liuhe/detail/wzj.png" v-else-if="detail.status == 1"></image>-->
            <!--            <image class="status-img" src="/static/img/liuhe/detail/wkj.png" v-else></image>-->
          </view>
        </uni-col>
      </uni-row>
    </view>
    <view class="center-box">
      <view class="center">
        <uni-row class="center-row">
          <uni-col class="left" :span="4">
            投注号码
          </uni-col>
          <uni-col class="bet-text large-text" :span="19">
            {{ detail.betValue }}
          </uni-col>
        </uni-row>
        <uni-row class="center-row number-box">
          <uni-col class="left" :span="4">
            开奖号码
          </uni-col>
          <uni-col class="bet-text" :span="19" v-if="detail.lotteryTypeId === 4">
            <Number v-if="detail.status != 0" :lotteryDetail="detail.numberList" />
            <span style="color: #333" v-else>--</span>
          </uni-col>
          <uni-col class="bet-text" :span="19" v-if="detail.lotteryTypeId === 30"><!-- 时时彩 -->
            <view class="number-list" v-if="detail.status != 0">
              <view class="number-list-item" v-for="(item, key) in detail.numberList">
                {{ item.number }}
              </view>
            </view>
            <span style="color: #333" v-else>--</span>
            <view class="item-text">
              {{ detail.resultDetail }}
            </view>
          </uni-col>
          <uni-col class="bet-text" :span="19" v-if="detail.lotteryTypeId === 19"><!-- 11选5 -->
            <view class="number-list" v-if="detail.status != 0">
              <view class="number-list-item" v-for="(item, key) in detail.numberList">
                {{ item.number }}
              </view>
            </view>
            <span style="color: #333" v-else>--</span>
            <view class="item-text">
              {{ detail.resultDetail }}
            </view>
          </uni-col>
          <uni-col class="bet-text" :span="19" v-if="detail.lotteryTypeId === 29"><!-- 飞艇 -->
            <view class="number-list" v-if="detail.status != 0">
              <view class="feiting-item" :style="setBallStyle(item.number)" :key="key"
                v-for="(item, key) in detail.numberList"></view>
            </view>
            <span style="color: #333" v-else>--</span>
            <view class="item-text">
              {{ detail.resultDetail }}
            </view>

          </uni-col>
          <uni-col class="bet-text" :span="19" v-if="detail.lotteryTypeId === 10"><!-- PK -->
            <view class="number-list" v-if="detail.status != 0" v-for="(item, key) in detail.numberList">
              {{ item.number }}
            </view>
            <span style="color: #333" v-else>--</span>
          </uni-col>
          <uni-col class="bet-text" :span="19" v-if="detail.lotteryTypeId === 28"><!-- 快三 -->
            <view class="number-list" v-if="detail.status != 0">
              <view class="kuaisan-item" v-for="(item, key) in detail.numberList" :style="setBallStyle(item.number)"
                :key="key"></view>
            </view>
            <span style="color: #333" v-else>--</span>
            <view class="item-text">
              {{ detail.resultDetail }}
            </view>
          </uni-col>
          <uni-col class="bet-text" :span="19" v-if="detail.lotteryTypeId === 31"><!-- 澳洲幸运20 -->
            <view class="lucky-number-list" v-if="detail.status != 0">
              <view class="lucky-item" v-for="(item, key) in detail.numberList" :key="key">{{ item.number }}</view>
            </view>
            <span style="color: #333" v-else>--</span>
            <view class="item-text">
              {{ detail.resultDetail }}
            </view>
          </uni-col>
          <uni-col class="bet-text" :span="19" v-if="detail.lotteryTypeId === 26"><!-- pcEgg 幸运28 -->
            <view class="number-list pcEgg-result" v-if="detail.status != 0">
              <view class="number-list-wrap" v-for="(item, key) in detail.numberList" :key="key">
                <view class="number-list-item">
                  {{ item.number }}
                </view>
                <view class="number-symbol">
                  <image v-if="key !== 2" src="./../../static/img/liuhe/pcEgg/add.png"></image>
                  <image v-else src="./../../static/img/liuhe/pcEgg/equal.png"></image>
                </view>
              </view>
              <view class="number-list-item result-ball">
                  {{ detail.resultDetail && detail.resultDetail.split(" ")[0] || "" }}
                </view>
            </view>
            <span style="color: #333" v-else>--</span>
            <!-- <view class="item-text">
              {{ detail.resultDetail }}
            </view> -->
          </uni-col>
          <uni-col class="bet-text" :span="19" v-if="detail.lotteryTypeId === 32"><!-- 幸运农场 -->
            <view class="number-list" v-if="detail.status != 0">
              <view class="number-list-item lucky-farm-item" v-for="(item, key) in detail.numberList">
                {{ item.number }}
              </view>
            </view>
            <span style="color: #333" v-else>--</span>
            <!-- <view class="item-text">
              {{ detail.resultDetail }}
            </view> -->
          </uni-col>
        </uni-row>
        <uni-row class="center-row">
          <uni-col class="left" :span="4">
            投注时间
          </uni-col>
          <uni-col class="bet-text black" :span="19">
            {{ detail.createTime }}
          </uni-col>
        </uni-row>
        <uni-row class="center-row">
          <uni-col class="left" :span="4">
            注单编号
          </uni-col>
          <uni-col class="bet-text black" :span="19">
            {{ detail.orderNo }}
          </uni-col>
        </uni-row>
        <uni-row class="center-row">
          <uni-col class="left" :span="4">
            注式/模式
          </uni-col>
          <uni-col class="bet-text black" :span="7">
            {{ detail.mode == 1 ? "普通" : "追期" }}，{{ setAmount(detail.baseAmount) }}元
          </uni-col>
          <uni-col class="left" :span="4">
            注数/倍数
          </uni-col>
          <uni-col class="bet-text black" :span="7">
            {{ detail.betNum }}注，{{ detail.betAmount }}倍
          </uni-col>
        </uni-row>

        <uni-row class="center-row">
          <uni-col class="left" :span="4">
            投注金额
          </uni-col>
          <uni-col class="bet-text black" :span="7">
            {{ setAmount(detail.betAmount) }}
          </uni-col>
          <uni-col class="left" :span="4">
            中奖金额
          </uni-col>
          <uni-col class="bet-text win-money" :span="7">
            <span v-if="detail.winAmount > 0">{{ setAmount(detail.winAmount) }}</span>
            <span v-else style="color: #333333">--</span>
          </uni-col>
        </uni-row>

        <uni-row class="center-row">
          <uni-col class="left" :span="4">
            返点
          </uni-col>
          <uni-col class="bet-text black" :span="7">
            {{ setAmount(detail.rebateAmount) }}（{{ setAmount(detail.rebate) }}%）
          </uni-col>
          <uni-col class="left" :span="4">
            盈亏
          </uni-col>
          <uni-col class="bet-text loss" :span="7">
            <!--2=中奖；1=未中奖；0=未开奖；3=已撤销-->
            <span v-if="detail.status == 2" style="color: #DF2939">{{ setAmount(detail.winAmount - detail.betAmount)
            }}</span>
            <span v-else-if="detail.status == 1" style="color: #34B822">{{ "-" + setAmount(detail.betAmount) }}</span>
            <span v-else style="color: #333333">--</span>
          </uni-col>
        </uni-row>
      </view>
      <uni-popup ref="confirm" background-color="#fff">
        <view class="confirm-box">
          <view class="conftrm-text">
            撤单确认
          </view>
          <view class="confirm-content">
            <view>
              <view>确定要撤单吗？</view>
            </view>
          </view>
          <view class="bottom-btn">
            <view class="cancel" @click="cancelBtn">取消</view>
            <view class="confirm-act" @click="submit">确认</view>
          </view>
        </view>
      </uni-popup>
    </view>
    <!--    <view class="win-box">
          <view class="win">
            <view class="title">可中奖项</view>
            <uni-row class="tr th">
              <uni-col :span="6" class="td">名称</uni-col>
              <uni-col :span="6" class="td">奖项</uni-col>
              <uni-col :span="6" class="td">返点</uni-col>
              <uni-col :span="6" class="td">赔率</uni-col>
            </uni-row>
            <uni-row class="tr">
              <uni-col :span="6" class="td">特码A</uni-col>
              <uni-col :span="6" class="td">1-10</uni-col>
              <uni-col :span="6" class="td">0.00%</uni-col>
              <uni-col :span="6" class="td">4.700</uni-col>
            </uni-row>
            <uni-row class="tr">
              <uni-col :span="6" class="td">特码A</uni-col>
              <uni-col :span="6" class="td">1-10</uni-col>
              <uni-col :span="6" class="td">0.00%</uni-col>
              <uni-col :span="6" class="td">4.700</uni-col>
            </uni-row>
            <uni-row class="tr">
              <uni-col :span="6" class="td">特码A</uni-col>
              <uni-col :span="6" class="td">1-10</uni-col>
              <uni-col :span="6" class="td">0.00%</uni-col>
              <uni-col :span="6" class="td">4.700</uni-col>
            </uni-row>
            <uni-row class="tr">
              <uni-col :span="6" class="td">特码A</uni-col>
              <uni-col :span="6" class="td">1-10</uni-col>
              <uni-col :span="6" class="td">0.00%</uni-col>
              <uni-col :span="6" class="td">4.700</uni-col>
            </uni-row>
          </view>
        </view>-->
    <view class="footer">
      <view class="footer-box">
        <view class="botton-box">
          <view class="bet-btn" @click="toCart">
            再次下注
          </view>
          <view class="share-btn" v-if="detail.status == 0" @click="cancel">
            撤单
          </view>
          <view class="share-btn" v-else-if="detail.status == 1 || detail.status == 2">
            分享结果
          </view>
        </view>
      </view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import Number from "../../components/common/lottery/Number";
import UniRow from "../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../uni_modules/uni-row/components/uni-col/uni-col";
import { cancel, betOrderDetail } from "../../utils/lottery/betting";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
import Playing from "../../utils/common/playing";
export default {
  name: "bet_details",
  components: {
    AlertInjectLayer, UniCol, UniRow, NavBar, Number
  },
  data() {
    return {
      title: "注单详情",
      playing: new Playing(),
      headerStyle: {
        backgroundColor: '#03536E',
      },
      titleStyle: {
        color: '#FFFFFF',
      },
      detail: {},
      prams: {
        bettingVo: {
          lotteryId: 1,
          lotteryNo: 20230203,
        }
      }
    }
  },
  onLoad(option) {
    /*    console.log(option);*/
    //方式二：接收参数
    // #ifdef APP-NVUE
    const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
    // #endif
    // #ifndef APP-NVUE
    const eventChannel = this.getOpenerEventChannel();
    // #endif
    eventChannel.on('argParams', function (data) {
      option = data
    })
    this.detail = option
    console.log(this.detail)
    this.getDetail()
  },
  methods: {
    setStatusImg(status) {
      switch (status) {
        case 0:
          return require('./../../static/img/liuhe/detail/wkj.png')
        case 1:
          return require('./../../static/img/liuhe/detail/wzj.png')
        case 2:
          return require('./../../static/img/liuhe/detail/zj.png')
        case 3:
          return require('./../../static/img/liuhe/detail/cedan.png')
        case 4:
          return require('./../../static/img/liuhe/detail/system.png')
        case 9:
          return require('./../../static/img/liuhe/detail/tie.png')
      }
    },
    setBallStyle(num) {
      if (this.detail.lotteryTypeId === 29) {
        return {
          backgroundImage: `url(./../../static/img/liuhe/airship/numbers/${num}.png)`,
          backgroundPosition: "center",
          backgroundSize: "100% 100%"
        }
      } else if (this.detail.lotteryTypeId === 28) {
        if (num === "*") {
          num = "star"
        }
        return {
          backgroundImage: `url(./../../static/img/liuhe/kuaisan/${num}.png)`,
          backgroundPosition: "center",
          backgroundSize: "100% 100%"
        }
      }

    },
    setAmount(num) {
      return this.playing.setAmount(num, 2, '.', ',')
    },
    toNav() {
      uni.navigateTo({
        url: '/pages/liuhe/bet_num?num=' + this.detail.betValue
      })
    },
    getDetail() {
      betOrderDetail({ id: this.detail.id, createTime: this.detail.createTime }).then(res => {
        if (res.code === 200) {
          this.detail = res.result
        }
      })
    },
    cancel() {
      this.$refs.confirm.open('center')
    },
    cancelBtn() {
      this.$refs.confirm.close()
    },
    submit() {
      let prams = {
        betId: this.detail.id,
        createTime: this.detail.createTime
      };
      cancel(prams).then(res => {
        pop(res.message, 1000);
        if (res.code === 200) {
          // this.detail.status = 3
          // this.cancelBtn()
          // this.getDetail()
          uni.redirectTo({
            url: '/pages/liuhe/liuhePlaying?id=' + this.detail.lotteryId + '&cancel=' + 0
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //再次下注跳转购物车
    toCart() {
      console.log(this.detail);
      let data = {
        chaseNum: 0,
        chaseStop: 1,
        code: this.detail.playParentCode,
        content: this.detail.betSource,
        methodName: this.detail.playName,
        mode: 1,
        name: this.detail.betValue,
        playId: this.detail.playId,
        rebatePoint: 0,
        stakeCount: this.detail.betNum,
        totalPrice: this.detail.betNum * this.detail.betAmount,
        unitPrice: this.detail.betAmount
      }
      this.playing.setStorage(this.detail.playParentCode, [data]);
      uni.redirectTo({
        url: '/pages/liuhe/cart?code=' + this.detail.playParentCode + '&id=' + this.detail.lotteryId
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.bet-body {
  background: #EEEEEE;
  height: var(--vh);
  font-family: 'PingFang SC';

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

  .right-box {
    line-height: 92rpx;
    display: flex;
    align-items: center;
    font-size: 30rpx;

    image {
      width: 40rpx;
      height: 40rpx;
    }
  }

  .title-box {
    height: 144rpx;
    background: #FFFFFF;
    border-bottom: 2rpx solid #DDDDDD;

    .title-row {
      height: 100%;

      .title-col {
        height: 100%;

        .left-box {
          height: 100%;
          display: flex;
          align-items: flex-start;
          flex-direction: column;
          justify-content: center;
          margin-left: 20rpx;

          .top {
            display: flex;
            align-items: center;

            .lottery-name {
              margin-right: 14rpx;
              ////font-weight: 500;
              font-size: 30rpx;
              line-height: 42rpx;
              color: #333333;
            }

            .period {
              margin-right: 15rpx;
              ////font-weight: 500;
              font-size: 25rpx;
              line-height: 35rpx;
              text-align: center;
              color: #999999;
            }

            image {
              width: 40rpx;
              height: 40rpx;
            }
          }

          .bottom {
            margin-top: 5rpx;

            .content {
              color: #03536E;
              ////font-weight: 500;
              font-size: 30rpx;
            }
          }
        }

        .right-box {
          height: 100%;
          display: flex;
          align-items: center;

          .status-img {
            width: 176rpx;
            height: 104rpx;
          }
        }
      }
    }
  }

  .center-box {
    background: #EEEEEE;
    padding: 26rpx 22rpx;

    .center {
      box-sizing: border-box;
      background: #FFFFFF;
      border-bottom: 2rpx solid #DDDDDD;
      border-radius: 20rpx;
      padding: 1rpx 0rpx;

      .center-row {
        display: flex;
        align-items: center;
        margin: 37rpx 0;

        .left {
          ////font-weight: 500;
          font-size: 25rpx;
          line-height: 35rpx;
          color: #999999;
          margin-left: 20rpx;
        }

        .bet-text {
          ////font-weight: 500;
          font-size: 24rpx;
          color: #DF2939;
          // display: flex;

          .number-list {
            display: flex;

            .feiting-item {
              width: 40rpx;
              height: 40rpx;
            }

            .kuaisan-item {
              width: 76rpx;
              height: 77rpx;
              margin-right: 20rpx;
            }


            .number-list-item {
              width: 70rpx;
              height: 70rpx;
              background: #D3556A;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 20rpx;
              font-weight: 500;
              font-size: 42rpx;
              color: #EBFDFF;
            }
            .lucky-farm-item {
              width: 58rpx;
              height: 58rpx;
              font-size: 36rpx;
              margin-right: 10rpx;
            }

          }
          .pcEgg-result {
            .number-list-wrap {
              display: flex;
              align-items: center;
              justify-content: center;
              .number-list-item {
                margin-right: 10rpx;
                margin-left: 10rpx;
              }
              .number-symbol {
                margin-top: 10rpx;
                image {
                  width: 35rpx;
                  height: 35rpx;
                }
              }
            }
            .number-list-wrap:first-of-type {
              .number-list-item {
                margin-left: 0;
              }
            }
            .result-ball {
              margin-left: 10rpx;
            }
          }
          .lucky-number-list {
            display: flex;
            align-items: flex-start;
            flex-flow: row wrap;
            gap: 6rpx;

            .lucky-item {
              display: flex;
              width: 50rpx;
              height: 59rpx;
              flex-direction: column;
              color: #222;
              text-align: center;
              font-family: PingFang SC;
              font-size: 26rpx;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
              letter-spacing: -0.375rpx;
            }
          }

          .item-text {
            font-size: 24rpx;
            color: #222222;
            margin-top: 10rpx;
          }
        }

        .bet-text.large-text {
          font-size: 30rpx;
        }

        .black {
          color: #333333;
        }

        .win-money {
          font-weight: 400;
          font-size: 28rpx;
          line-height: 24rpx;
          color: #DF2939;
        }
      }
    }
  }

  .win-box {
    background: #EEEEEE;
    padding: 26rpx 22rpx;

    .win {
      box-sizing: border-box;
      background: #FFFFFF;
      border-bottom: 2rpx solid #DDDDDD;
      border-radius: 20rpx;
      padding: 1rpx 20rpx;

      .title {
        ////font-weight: 500;
        font-size: 30rpx;
        line-height: 42rpx;
        text-align: center;
        color: #8CB2C9;
        margin: 18rpx 0;
      }

      .tr {
        margin: 10rpx 0;
        padding: 20rpx 0;

        .td {
          //font-weight: 500;
          font-size: 25rpx;
          line-height: 35rpx;
          color: #222222;
          text-align: center;
        }
      }

      .th {
        border-top: 2rpx solid #E7E7E7;
        border-bottom: 2rpx solid #E7E7E7;

        .td {
          color: #999999;
        }
      }
    }
  }

  .footer {
    width: 100%;
    height: 100rpx;

    .footer-box {
      position: absolute;
      box-sizing: border-box;
      display: flex;
      width: 100%;
      height: 100rpx;
      bottom: 0;
      background: #FFFFFF;
      border-top: 2rpx solid #C0C0C0;

      .botton-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;

        view {
          font-weight: 400;
          border-radius: 10rpx;
          height: 70rpx;
          font-size: 30rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #FFFFFF;
        }

        .bet-btn {
          background: #FF9900;
          width: 60%;
        }

        .share-btn {
          width: 30%;
          background: #8CB2C9;
          margin-left: 10rpx;
        }
      }
    }
  }
}</style>
