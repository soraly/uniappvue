<template>
  <view class="bank-div">
    <view class="bank-box" :style="{ marginTop: safeHeight }">
      <NavBar :isBack="false" :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor"
        :font-color="fontColor" :title-style="titleStyle">
        <block slot="left">
          <uni-icons @click="back" type="back" :color="fontColor" size="18" style="font-weight: bold;margin-left: 10px" />
        </block>
      </NavBar>
      <scroll-view class="scroll-view-box" scroll-y="true">
        <view class="bank-list">
          <view class="list-item" v-for="(item, index) in bankList" @click="setBank(item)">
            <view class="left">
              <view class="top" :class="{ 'is-qrcode': item.type == 3 }">
                <view class="img">
                  <image :src="item.logoMobile || '/static/img/user/bank/usdt.png'"></image>
                </view>
                <view class="title">
                  <view class="name">{{ item.type == 4 ? 'USDT地址' : item.bankName }}</view>
                  <view class="desc" v-if="item.type == 1">储蓄卡</view>
                  <view class="desc" v-if="item.type == 4">{{ item.bankName }}</view>
                </view>
                <view class="qrcode" v-if="item.type == 3">
                  <image :src="item.bankNumber"></image>
                </view>
              </view>
              <view class="card" v-if="item.type == 1">
                <text style="margin-top: 20rpx;margin-right: 10rpx">**** **** ****</text>
                {{ " " + item.bankNumber.substr(-4) }}
              </view>
              <view class="card-bt" v-if="item.type == 2 || item.type == 4">
                {{ item.bankNumber }}
              </view>
            </view>
            <view class="right">
              <view class="untie-btn"></view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import { bankCardList, unbindBank } from "../../../utils/lottery/mine";

export default {
  name: "list",
  components: { UniCol, UniRow, NavBar },
  props: {
    bankList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "请选择提现账户",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
    }
  },
  onLoad() {
  },
  methods: {
    back() {
      this.$emit('closePay');
    },
    //解绑
    untie(item) {
      this.unId = item.id
      this.$refs.popup.open()
    },
    setBank(item) {
      console.log(item)
      this.$emit('setBank', item)
      this.back()
    },
  }
}
</script>

<style lang="scss" scoped>
.bank-div {
  width: 100vw;
  background: rgba(0, 0, 0, 0.1);
}

.bank-box {
  font-family: 'PingFang SC';
  width: 100vw;
  max-width: 480px;
  margin: auto;
  height: var(--vh);
  background: #ffffff;

  .kefu {
    font-weight: 500;
    font-size: 28rpx;
    line-height: 39rpx;
    color: #FFFFFF;
  }

  .filter-box {
    width: 100%;
    max-width: 480px;

    .filter-row {
      width: 100%;
      max-width: 480px;
      position: fixed;
      z-index: 20;
      height: var(--vh);
      background: rgba(0, 0, 0, 0.5);

      .filter-list {
        height: 158rpx;
        background: #F6F6F6;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 0px 28rpx;
        gap: 20rpx;

        .filter-item {
          width: 20%;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 83rpx;
          background: #FFFFFF;
          border: 1px solid #DDDDDD;
          border-radius: 10rpx;
          padding: 10rpx;
          gap: 10rpx;
          font-weight: 400;
          font-size: 16rpx;
          line-height: 22rpx;
          text-align: center;
          color: #000000;
        }

        .act {
          background: #8BB1C9;
          color: #FFFFFF;
        }
      }

      .filter-btn {
        margin-top: -1px;
        display: flex;
        background: #FFFFFF;
        border-radius: 0px 0px 30rpx 30rpx;
        font-weight: 400;
        font-size: 24rpx;
        text-align: center;

        .cancel-btn {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 10rpx;
          width: 50%;
          height: 80rpx;
          color: #949494;
        }

        .confirm-btn {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 10rpx;
          width: 50%;
          height: 80rpx;
          color: #A6C4D6;
        }
      }
    }
  }

  .scroll-view-box {
    height: calc(var(--vh) - 110rpx);
  }

  .bank-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 20rpx;

    .list-item {
      height: 206rpx;
      width: 672rpx;
      background: #FFFFFF;
      border: 2rpx solid #DDDDDD;
      border-radius: 10rpx;
      display: flex;
      margin-top: 46rpx;

      .left {
        width: 85%;
        padding: 29rpx;
        background: #FFFFFF;
        border-radius: 10rpx;

        .top {
          display: flex;

          .img {
            margin-right: 36rpx;

            image {
              height: 90rpx;
              width: 90rpx;
            }
          }

          .title {
            display: flex;
            flex-direction: column;
            justify-content: center;

            .name {
              font-weight: 600;
              font-size: 32rpx;
              line-height: 32rpx;
              color: #222222;
              margin-bottom: 8rpx;
            }

            .desc {
              font-weight: 500;
              font-size: 24rpx;
              line-height: 24rpx;
              color: #999999;
            }
          }

          .qrcode {
            width: 40%;
            display: flex;
            align-items: center;
            flex-direction: row-reverse;

            image {
              height: 60rpx;
              width: 60rpx;
            }
          }
        }

        .is-qrcode {
          height: 100%;
          align-items: center;
        }

        .card {
          font-weight: 500;
          font-size: 48rpx;
          line-height: 48rpx;
          color: #222222;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .card-bt {
          font-weight: 500;
          font-size: 19rpx;
          line-height: 48rpx;
          color: #222222;
          width: 90%;
          overflow: hidden;
        }
      }

      .right {
        width: 75rpx;
        border-top-right-radius: 10rpx;
        border-bottom-right-radius: 10rpx;

        .untie-btn {
          height: 100%;
          background: #FF9900;
          display: flex;
          font-weight: 400;
          font-size: 16rpx;
          line-height: 22rpx;
          color: #FFFFFF;
          border-top-right-radius: 10rpx;
          border-bottom-right-radius: 10rpx;
          align-items: center;
          justify-content: center;
        }

        .disabled {
          background: #D7D7D7;
        }
      }

      &:last-child {
        margin-bottom: 100px;
      }
    }
  }

  .btn-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 76rpx;

    .btn {
      width: 674rpx;
      height: 90rpx;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 10rpx;
      background: #FFFFFF;
      border: 1px solid #3881A8;
      border-radius: 10rpx;
      font-weight: 400;
      font-size: 30rpx;
      line-height: 40rpx;
      color: #3881A8;
      margin-bottom: 30rpx;
    }
  }

  .pwd-box {
    height: 290rpx;
    width: 710rpx;
    border-radius: 20rpx;
    background: #FFFFFF;

    .top-box {
      display: flex;
      height: 80rpx;
      margin-bottom: 16rpx;

      .title {
        width: 85%;
        font-weight: 400;
        font-size: 30rpx;
        line-height: 30rpx;
        text-align: center;
        color: #222222;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .close {
        width: 15%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .forget {
      margin-top: 22rpx;
      font-weight: 400;
      font-size: 24rpx;
      line-height: 30rpx;
      text-align: center;
      color: #CC3333;
    }
  }
}
</style>