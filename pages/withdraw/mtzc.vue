<template>
  <view class="bank-box" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
    </NavBar>
    <view class="bank-row">
      <uni-list class="list-row">
        <uni-list-item class="list-item">
          <template v-slot:header>
            <view class="slot-box">
              <image class="slot-image" src="/static/img/mtzc.png" mode="widthFix"></image>
            </view>
          </template>
          <!-- 自定义 body -->
          <template v-slot:body>
            <text class="slot-text">
              直充到账金额：{{ dz }}
              <view class="card">含优惠金额：{{ yh }}</view>
            </text>
          </template>
        </uni-list-item>
      </uni-list>
    </view>
    <view class="withdraw-box">
      <view class="title">提现金额</view>
      <view class="input-box">
        <input class="uni-input" :placeholder-class="'input-placeholder-text'" :placeholder-style="placeholderStyle"
          type="number" v-model="money" :placeholder="'单笔可提' + init.minAmount + '-' + init.maxAmount + ''" />
        <text class="label-text" @click="allBtn">全部提现</text>
      </view>
      <view class="notice">
        可提现金额：<text>{{ init.drawAmount }}</text>
      </view>
    </view>
    <view class="detail">
      <view class="item">
        <view class="title">收款人</view>
        <view class="desc">{{ init.realName || '****' }}</view>
      </view>
      <view class="item">
        <view class="title">账户余额</view>
        <view class="desc">{{ init.balance }}</view>
      </view>
      <view class="item">
        <view class="title">当前不可提额度</view>
        <view class="desc">{{ init.noDrawAmount }}</view>
      </view>
      <view class="item">
        <view class="title">提取需要有效投注</view>
        <view class="desc">{{ init.bettingAmount }}</view>
      </view>
      <view class="item">
        <view class="title">剩余提现次数</view>
        <view class="desc">{{ init.drawCount }}</view>
      </view>
    </view>
    <view class="next">
      <view class="next-btn" @click="actBtn">下一步</view>
    </view>

    <view class="hint">
      <view class="hint-box">
        <text class="hint-title">温馨提示：</text>
        <view class="content">
          <view class="label">
            １．<view class="text">【可提现额度】=有效投注金额+奖金派送+活动礼金。</view>
          </view>
          <view class="label">
            ２．<view class="text">当期投注开奖后，平台系统会自动更新可提现额度。</view>
          </view>
          <view class="label">
            ３．<view class="text">您每天只能进行10提现，提现将会载发起后两小时内到账。</view>
          </view>
          <view class="label">
            ４．<view class="text">休息时间为00:00 — 00:00，在这期间将无法发起提现。</view>
          </view>
          <view class="label">５．
            <view class="text">免提直充：金额到账发起免提直充账号。</view>
          </view>
        </view>
      </view>
    </view>
    <uni-popup ref="popup" type="center" :mask-click="false">
      <view class="pwd-box">
        <view class="top-box">
          <view class="title">请输入支付密码</view>
          <view class="close" @click="closePopup">
            <uni-icons type="closeempty" style="color: #C6C6C6;" size="25"></uni-icons>
          </view>
        </view>
        <one-input v-model="pwd" :maxlength="6" :isPwd="true" @finish="finishedOne" ref="hi" type="box">
        </one-input>
        <view class="forget" @click="toUrl('/pages/user/service/index')">忘记密码</view>
      </view>
    </uni-popup>

    <uni-drawer ref="ok" mode="right" :width="100">
      <Success :msg="'免提直充成功，正在处理中...'" />
    </uni-drawer>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import UniCol from "../../uni_modules/uni-row/components/uni-col/uni-col";
import UniRow from "../../uni_modules/uni-row/components/uni-row/uni-row";
import List from "./common/list";
import Success from "./common/success";
import oneInput from '@/components/myp-one/myp-one'

import { incomeDirect, inits } from "../../utils/lottery/mine";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "mtzc",
  components: {
    AlertInjectLayer, UniCol, UniRow, NavBar, List, oneInput, Success
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "免提直充",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      placeholderStyle: "'font-weight': '400';'font-size': '45rpx';'color': '#CCCCCC';",
      info: null,
      init: {
        minAmount: '0.00',
        maxAmount: "0.00"
      },
      money: '',
      pwd: '',
    }
  },
  onLoad() {
    this.getInit()
  },
  computed: {
    dz() {
      if (this.money != '') {
        return this.money * 1 + this.yh * 1
      } else {
        return 0.00
      }
    },
    yh() {
      if (this.money == '') {
        return 0.00
      }
      let yh = this.money * this.init.discountRatio
      yh = parseFloat(yh).toFixed(2)
      if (yh > this.init.discountLimit * 1) {
        return this.init.discountLimit
      } else {
        return yh
      }
    }
  },
  methods: {
    toUrl(url) {
      uni.navigateTo({
        url: url
      })
    },
    onClick() {
      this.$refs.pay.open()
    },
    closePay() {
      this.$refs.pay.close()
    },
    setBank(item) {
      this.info = item
    },
    allBtn() {
      this.money = this.init.balance
    },
    getInit() {
      inits().then(res => {
        if (res.code == 200) {
          this.init = res.result
        }
      }).catch(err => {
        console.log(err)
      })
    },
    closePopup() {
      this.pwd = ''
      this.$refs.popup.close();
    },
    //提现
    actBtn() {
      if (this.money < this.init.minAmount) {
        pop("提现金额不能小于" + this.init.minAmount, 2000)
        return false
      }
      /*if(this.money > this.init.maxAmount){
        pop("提现金额不能大于" + this.init.maxAmount,2000)
        return false
      }*/
      this.$refs.popup.open();
    },
    finishedOne() {
      let prams = {
        amount: this.money,
        pinCode: this.pwd
      };
      console.log(prams)
      incomeDirect(prams).then(res => {
        if (res.code == 200) {
          this.$refs.popup.close()
          this.$refs.ok.open()
        } else {
          pop(res.message, 2000)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bank-box {
  font-family: 'PingFang SC';

  .bank-row {
    .list-row {
      .list-item {
        height: 150rpx;

        .slot-box {
          margin-right: 20rpx;
          height: 100%;
          display: flex;

          .slot-image {
            height: 90rpx;
            width: 90rpx;
          }
        }

        .slot-text {
          display: flex;
          font-weight: 400;
          font-size: 36rpx;
          color: #222222;

          .card {
            font-weight: 400;
            font-size: 24rpx;
            display: flex;
            align-items: center;
            color: #D3556A;
            margin-top: 10rpx;
          }
        }
      }
    }
  }

  .withdraw-box {
    height: 236rpx;
    margin-top: 20rpx;
    background: #FFFFFF;
    padding: 30rpx 30rpx 0 30rpx;

    .title {
      font-weight: 400;
      font-size: 20rpx;
      color: #666666;
    }

    .input-box {
      display: flex;
      align-items: center;
      height: 124rpx;
      border-bottom: 1px solid rgba(221, 221, 221, 0.5);

      .uni-input {
        width: 80%;
        height: 80rpx;
        border: 0;
        background: #fff;
        text-align: left;
      }

      .label-text {
        width: 20%;
        font-weight: 400;
        font-size: 26rpx;
        text-align: center;
        color: #D3556A;
      }

      .input-placeholder-text {
        font-weight: 400;
        font-size: 45rpx;
        color: #CCCCCC;
      }
    }

    .notice {
      display: flex;
      margin-top: 20rpx;
      font-weight: 400;
      font-size: 20rpx;
      line-height: 26px;
      color: #999999;

      text {
        color: #D3556A;
      }
    }
  }

  .detail {
    height: 354rpx;
    padding: 24rpx 30rpx 40rpx 30rpx;
    background: #FFFFFF;
    margin-top: 20rpx;

    .item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 22rpx;

      .title {
        font-weight: 400;
        font-size: 26rpx;
        line-height: 36rpx;
        color: #444444;
      }

      .desc {
        font-weight: 400;
        font-size: 26rpx;
        line-height: 36rpx;
        color: #999999;
      }
    }
  }

  .next {
    margin-top: 40rpx;
    display: flex;
    justify-content: center;

    .next-btn {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 705rpx;
      height: 90rpx;
      background: #16A7FB;
      border-radius: 50rpx;
      font-weight: 500;
      font-size: 32rpx;
      color: #FFFFFF;
    }
  }

  .hint {
    display: flex;
    justify-content: center;

    .hint-box {
      width: 705rpx;
      margin-top: 42rpx;
      margin-bottom: 200rpx;

      .hint-title {
        font-weight: 500;
        font-size: 30rpx;
        line-height: 42rpx;
        text-align: center;
        color: #CC3333;
      }

      .content {
        font-weight: 400;
        font-size: 24rpx;
        line-height: 34rpx;
        color: #A1A1A1;
        margin: 6rpx 6rpx 0 0;

        .label {
          display: flex;

          .text {
            width: 90%;
          }
        }
      }
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