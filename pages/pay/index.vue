<template>
  <view class="pay-box" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle" :back-style="{ fontSize: '22px' }">
      <block slot="right">
        <view class="kefu">联系客服</view>
      </block>
    </NavBar>
    <view class="list-box" v-show="type == 1">
      <uni-list class="list-row">
        <uni-list-item class="list-item" :clickable="true" showArrow :arrowStyle="{ fontSize: '40rpx' }"
          v-for="(val, key) in payGroup" :key="key" @click="onClick(1, val)">
          <template v-slot:header>
            <view class="slot-box">
              <image class="slot-image" :src="val.img" mode="widthFix"></image>
            </view>
          </template>
          <!-- 自定义 body -->
          <template v-slot:body>
            <text class="slot-text">{{ val.groupName }}</text>
          </template>
        </uni-list-item>
      </uni-list>
    </view>
    <uni-drawer ref="pay" mode="right" :width="100" style="margin: auto;">
      <bankMoney v-if="payInfo.type == 1" :info="payInfo" @closePay="closePay" />
      <Money v-else-if="payInfo.type == 3" @closePay="closePay" :info="payInfo" />
      <walletMoney v-else @closePay="closePay" :info="payInfo" />
    </uni-drawer>
    <uni-popup ref="popup" type="bottom">
      <view class="type-box">
        <view class="header-box">
          <view class="title">选择充值方式</view>
          <view class="icon" @click="closePop">
            <image src="/static/img/pay/user.png"></image>
          </view>
        </view>
        <scroll-view :scroll-top="scrollTop" @scroll="scroll" scroll-y="true" class="scroll-Y">
          <view class="type-list">
            <uni-list class="list-row">
              <uni-list-item class="list-item" :clickable="true" v-for="(val, key) in payList" :key="key"
                @click="onClick(2, val)">
                <template v-slot:header>
                  <view class="slot-box">
                    <image class="slot-image" :src="val.logoMobile" mode="widthFix"></image>
                  </view>
                </template>
                <!-- 自定义 body -->
                <template v-slot:body>
                  <view class="slot-center">
                    <text class="slot-text">{{ val.title }}</text>
                    <view class="note">{{ val.remark }}</view>
                  </view>
                </template>
              </uni-list-item>
            </uni-list>
          </view>
        </scroll-view>
      </view>
    </uni-popup>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import UniCol from "../../uni_modules/uni-row/components/uni-col/uni-col";
import UniRow from "../../uni_modules/uni-row/components/uni-row/uni-row";
import Money from "./common/money";
import bankMoney from "./common/bankMoney";
import walletMoney from "./common/walletMoney";
import { getRechargeGroup, getRechargeType } from "../../utils/lottery/mine";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "index",
  components: {
    AlertInjectLayer, UniCol, UniRow, NavBar, Money, bankMoney, walletMoney
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "充值",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      payGroup: [],
      payList: [],
      payInfo: {},
      type: 1,
      scrollTop: 0,
    }
  },
  onLoad() {
    this.rechargeGroup()
  },
  methods: {
    scroll(e) {
      console.log(e)
    },
    onClick(type, val) {
      if (type == 1) {
        this.payList = []
        this.rechargeType(val.id)
        this.$refs.popup.open()
      } else if (type == 2) {
        this.payInfo = val
        this.$refs.pay.open()
        this.$refs.popup.close()
      }
    },
    closePay() {
      this.$refs.pay.close()
    },
    closePop() {
      this.$refs.popup.close()
    },
    rechargeGroup() {
      getRechargeGroup().then(res => {
        this.payGroup = res.result
      }).catch(err => {
        console.log(err)
      })
    },
    rechargeType(groupId) {
      let prams = { groupId: groupId };
      getRechargeType(prams).then(res => {
        this.payList = res.result
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pay-box {
  font-family: 'PingFang SC';
  height: var(--vh);
  background: #FFFFFF;
  z-index: 1;

  .kefu {
    font-weight: 500;
    font-size: 14px;
    line-height: 39rpx;
    color: #FFFFFF;
  }

  .list-box {
    .list-row {
      background: #F6F6F6;

      .list-item {
        margin-top: 10rpx;
        background: #FFFFFF;
        height: 120rpx;

        .slot-box {
          display: flex;
          align-items: center;

          .slot-image {
            height: 54rpx;
            width: 54rpx;
          }
        }

        .slot-text {
          font-weight: 400;
          font-size: 32rpx;
          line-height: 45rpx;
          display: flex;
          align-items: center;
          color: #222222;
          margin-left: 18rpx;
        }
      }
    }
  }

  .scroll-Y {
    height: calc(50vh - 76rpx);
  }

  .type-box {
    background: #FFFFFF;
    border-radius: 15px 15px 0px 0px;
    max-width: 480px;
    margin: auto;
    height: 50vh;

    .header-box {
      height: 76rpx;
      width: 100%;
      max-width: 480px;
      display: flex;
      align-items: center;

      .title {
        width: 90%;
        text-align: center;
        font-weight: 500;
        font-size: 26rpx;
        line-height: 36rpx;
        color: #999999;
      }

      .icon {
        image {
          height: 40rpx;
          width: 53rpx;
          border-radius: 5px;
        }
      }
    }

    .type-list {
      .list-row {
        .list-item {
          height: 154rpx;

          .slot-box {
            display: flex;
            align-items: center;

            .slot-image {
              height: 54rpx;
              width: 54rpx;
            }
          }

          .slot-center {
            margin-left: 18rpx;

            .slot-text {
              font-weight: 400;
              font-size: 32rpx;
              line-height: 45rpx;
              color: #000000;
            }

            .note {
              font-size: 20rpx;
              color: #999999
            }
          }
        }
      }
    }
  }
}
</style>