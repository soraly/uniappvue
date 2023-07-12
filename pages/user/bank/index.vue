<template>
  <view class="bank-box" :style="{ marginTop: safeHeight }">
    <NavBar :isBack="false" :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor"
      :font-color="fontColor" :title-style="titleStyle">
      <block slot="left">
        <uni-icons @click="back" type="back" :color="fontColor" size="18" style="font-weight: bold;margin-left: 10px" />
      </block>
      <block slot="right">
        <view class="kefu" @click="isShow = !isShow">筛选</view>
      </block>
    </NavBar>

    <view class="filter-box" v-show="isShow" @click="isShow = false">
      <view class="filter-row" @click.stop="isShow = true">
        <view class="filter-list">
          <view class="filter-item" v-for="(item, index) in filterMenus" :class="{ act: curr == index }"
            @click.stop="selcetType(item, index)">
            {{ item.name }}
          </view>
        </view>
        <view class="filter-btn">
          <view class="cancel-btn" @click.stop="isShow = false">取消</view>
          <view class="confirm-btn" @click.stop="confirmBtn">确认</view>
        </view>
      </view>
    </view>

    <view class="bank-list">
      <view class="list-item" v-for="(item, index) in bankList">
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
          <view class="untie-btn" @click="untie(item)">解<br />绑</view>
        </view>
      </view>

      <!--      <view class="list-item">
        <view class="left">
          <view class="top">
            <view class="img">
              <image src="../../../static/img/user/bank/bank.png"></image>
            </view>
            <view class="title">
              <view class="name">OKpay钱包</view>
              <view class="desc"></view>
            </view>
          </view>
          <view class="card-bt">
            TMAHKaSdCz148808FTtjYWscaz83pbYdAMt
          </view>
        </view>
        <view class="right">
          <view class="untie-btn disabled">解<br/>绑</view>
        </view>
      </view>-->
    </view>
    <view class="btn-box">
      <view class="btn" @click="toUrl('/pages/user/bank/add')">+添加新银行卡</view>
      <view class="btn" @click="toUrl('/pages/user/bank/usdt')">+添加USDT地址</view>
      <view class="btn" @click="toUrl('/pages/user/bank/wallet')">+添加第三方钱包</view>
      <view class="btn" @click="toUrl('/pages/user/bank/qrcode')">+添加收款二维码</view>
    </view>
    <view class="hint">
      <view class="hint-box">
        <text class="hint-title">温馨提示：</text>
        <view class="content">
          <view class="label">
            <view class="text">您最多只能绑定5张银行卡</view>
          </view>
          <view class="label">
            <view class="text">您最多只能绑定1个USDT地址</view>
          </view>
          <view class="label">
            <view class="text">您最多只能绑定1个第三方钱包</view>
          </view>
          <view class="label">
            <view class="text">您最多只能绑定1个支付宝账号和1个微信账户</view>
          </view>
        </view>
      </view>
    </view>
    <uni-popup ref="popup" type="center" :mask-click="false">
      <view class="pwd-box">
        <view class="top-box">
          <view class="title">请输入支付密码</view>
          <view class="close" @click="closed">
            <uni-icons type="closeempty" style="color: #C6C6C6;" size="25"></uni-icons>
          </view>
        </view>
        <one-input v-model="pwd" :maxlength="6" :isPwd="true" @finish="finishedOne" ref="hi" type="box">
        </one-input>
        <view class="forget" @click="toUrl('/pages/user/service/index')">忘记密码</view>
      </view>
    </uni-popup>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import { bankCardList, unbindBank } from "../../../utils/lottery/mine";
import oneInput from '@/components/myp-one/myp-one'
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "index",
  components: {
    AlertInjectLayer, UniCol, UniRow, NavBar, oneInput
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "我的银行卡",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      isShow: false,
      curr: 0,
      filterMenus: [
        { type: 0, name: '全部' },
        { type: 1, name: '银行卡' },
        { type: 2, name: '钱包' },
        { type: 3, name: '二维码' },
        { type: 4, name: 'USDT' }
      ],
      checkData: null,
      prams: {
        type: '',
      },
      pwd: '',
      bankList: [],
      unId: 0,
    }
  },
  onLoad() {
  },
  onShow() {
    this.getBankCardList()
  },
  methods: {
    back() {
      uni.redirectTo({
        url: "/pages/safe/index"
      })
    },
    filterBtn() {
      this.$refs.popup.open();
    },
    selcetType(item, index) {
      this.curr = index
      this.checkData = item
    },
    confirmBtn() {
      this.isShow = false
      if (this.checkData != null) {
        if (this.checkData.type == 0) {
          this.prams.type = ""
        } else {
          this.prams.type = this.checkData.type
        }
        this.getBankCardList()
      }
    },
    //解绑
    untie(item) {
      this.unId = item.id
      this.$refs.popup.open()
    },
    closed() {
      this.$refs.popup.close()
    },
    finishedOne(val) {
      /*console.log(val)*/
      let prams = { id: this.unId, pinCode: val };
      this.$refs.popup.close()
      this.pwd = '';
      unbindBank(prams).then(res => {
        if (res.code == 200) {
          pop(res.message, 2000)
          this.getBankCardList()
        } else {
          pop(res.message, 2000)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    toClear() {
      this.test = ''
      this.$refs.hi.clear()
    },
    toUrl(url) {
      uni.navigateTo({
        url: url
      })
    },
    //获取银行卡列表
    getBankCardList() {
      let prams = this.prams
      bankCardList(prams).then(res => {
        this.bankList = res.result
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

  .bank-list {
    display: flex;
    flex-direction: column;
    align-items: center;

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
        width: 15%;
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

  .hint {
    display: flex;
    justify-content: center;
    padding-bottom: 50rpx;

    .hint-box {
      width: 705rpx;

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