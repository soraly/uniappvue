<template>
  <view class="cart-page" :style="{ marginTop: safeHeight }">
    <nav-bar :fontColor="'#FFFFFF'" :isBack="true" :titleStyle="titleStyle" :title="title" :headerStyle="headerStyle"
      @goBack="setFlag"></nav-bar>
    <view class="detail-box">
      <view class="top">
        <view class="time-box">
          <view class="period">距离{{ headInfo.nextNo }}期 截止</view>
          <view class="time">{{ runtimes }}</view>
        </view>
        <view class="line"></view>
        <view class="account">
          <view class="text">账户余额</view>
          <view class="balance">{{ $store.state.appInfoStore.userInfo.userBalance }}</view>
        </view>
      </view>
      <view class="clear-box">
        <view class="clear" @click="clearCart">清空列表</view>
      </view>
    </view>
    <view class="list-box">
      <view class="list-col" v-for="(item, i) in playList" :key="i">
        <view class="list-item">
          <view class="detail">
            <view class="left">
              <view class="title">{{ item.name }}</view>
              <view class="betting">
                <text>{{ item.methodName }}</text>
                <text>{{ item.stakeCount }}注</text>
                <text>{{ item.unitPrice }}倍</text>
                <text>{{ setAmount(setBetting(item, i)) }}元</text>
              </view>
            </view>
            <view class="right">
              <image src="../../static/img/liuhe/cart/del.png" @click="delItem(i)"></image>
            </view>
          </view>
          <view class="multiple-box">
            <text>投</text>
            <input :value="item.unitPrice" class="multiple" type="number" inputmode="numeric" placeholder=""
              @input="(e) => onChangeBetting(e, i)" />
            <text>倍</text>
          </view>
        </view>
      </view>
    </view>
    <view class="action-box" v-if="isShow">
      <view class="action-div">
        <view class="left-box">
          <text>共{{ total.count }}注，投注{{ setAmount(total.price) }}元</text>
        </view>
        <view class="rigth-box">
          <view :class="playList.length === 0 ? 'act-btn no-list' : 'act-btn'" @click="confirm">
            确认投注
          </view>
        </view>
      </view>
    </view>
    <view class="multiple-box" v-else>
      <view class="multiple-row">
        <view class="multiple-btn">
          投5倍
        </view>
        <view class="multiple-btn">
          投10倍
        </view>
        <view class="multiple-btn">
          投20倍
        </view>
      </view>
    </view>

    <uni-popup ref="confirm" background-color="#fff">
      <view class="confirm-box">
        <view class="confirm-div">
          <view class="header">
            确认投注
          </view>
          <view class="list-box">
            <view class="title">
              <view class="name">{{ title }}</view>
              <view class="period">{{ headInfo.nextNo }}期</view>
            </view>
            <scroll-view scroll-y class="list-row">
              <view class="list-item" v-for="(item, index) in playList">
                <view class="played">
                  {{ item.methodName }}
                </view>
                <view class="number">
                  @[{{ item.name }}]
                </view>
                <view class="note-box">
                  <text class="note">{{ item.stakeCount }}注</text>
                  <text class="money">{{ setAmount(item.unitPrice) }}元</text>
                </view>
              </view>
            </scroll-view>
          </view>
          <view class="count-box">
            <text>共</text>
            <text class="note-total">{{ total.count }}</text>
            <text>注</text>
            <text class="moeney-total">{{ setAmount(total.price) }}</text>
            <text>元</text>
          </view>
          <view class="btn-box">
            <view class="cancel" @click="cancelBtn">取消</view>
            <view v-if="isClosing" class="confirm-act closing">封单中</view>
            <view v-else class="confirm-act" @click="submit">确认</view>
          </view>
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="balance" background-color="#fff">
      <view class="balance-box">
        <view class="image-item">
          <image src="../../static/img/liuhe/cart/money.png"></image>
        </view>
        <view class="tips">您的账户余额不足</view>
        <view class="tips-desc">请充值后完成投注</view>
        <view class="btn-box">
          <view class="give-up" @click="closeModal">放弃投注</view>
          <view class="recharge" @click="toCharge">立即充值</view>
        </view>
      </view>
    </uni-popup>
    <uni-popup :title="'提示'" type="dialog" ref="result">
      <view class="error-modal">
        <view class="title">
          提示
        </view>
        <view class="content">
          {{ errorMsg }}
        </view>
        <view class="footer" @click="yes()">
          知道了
        </view>
      </view>
    </uni-popup>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import TabBar from "../../components/common/tabbar/TabBar";
import UniRow from "../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../uni_modules/uni-row/components/uni-col/uni-col";
import LotteryList from "./common/LotteryList";
import Recommend from "./common/Recommend";
import Playing from "../../utils/common/playing";
import _default, { mapGetters } from 'vuex';
import { hot, lottery, getRewardsInfo, buyOrder } from "../../utils/lottery/betting"
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "index",
  components: {
    AlertInjectLayer,
    UniCol,
    UniRow,
    NavBar,
    TabBar,
    LotteryList,
    Recommend,
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      playing: new Playing(),
      title: uni.getStorageSync('lotteryNameTitle').title,
      headerStyle: {
        backgroundColor: 'rgb(23, 148, 255)',
      },
      titleStyle: {
        'font-weight': 500,
        'font-size': '32rpx',
        'line-height': '45rpx',
        'color': '#FFFFFF'
      },
      errorMsg: '',
      userInfo: null,
      isShow: true,
      playList: [],
      total: {
        count: 0,
        price: 0
      },
      runtimes: '',
      headInfo: {},
      isClosing: false,
      times: null,
      lotteryId: '',
    }
  },
  onUnload() {
    clearInterval(this.times);
  },
  onLoad(option) {
    this.lotteryId = option.id;
    this.getHeadInfo();
    this.$store.dispatch("updateUserBalanceFromServer")
    this.setPlayList(option.code)
    this.isLogin = global.isLogin()
    if (!this.isLogin) {
      uni.navigateTo({
        url: "/pages/liuhe/login"
      })
    } else {
      this.userInfo = uni.getStorageSync('userInfo');
      /*console.log(this.userInfo)*/
    }
  },
  computed: {
    ...mapGetters(['orderList'])
  },
  methods: {
    setFlag() {
      uni.setStorageSync("cartBack", true)
    },
    closeModal() {
      this.$refs.balance.close();
    },
    toCharge() {
      if (this.playing.getStorage('userInfo').userType == 'demo') {
        this.closeModal()
        uni.$emit('showPop', { refName: 'AlertTestMsg', })
      } else {
        uni.navigateTo({
          url: '/pages/pay/index'
        })
      }
    },
    delItem(index) {
      let arr = this.playList;
      this.playList = arr.filter((item, i) => i !== index)
      this.setTotalShow(this.playList);
      this.playing.setStorage('playingList', this.playList);
    },
    setAmount(val) {
      return this.playing.setAmount(val, 2, '.', ',')
    },
    submit() {
      if (this.$store.state.appInfoStore.userInfo.userBalance > 0) {
        let menuList = this.playing.getStorage('menuList:' + this.lotteryId);//获取菜单内容，下注时校验快速购买和购物车是否同时开启
        if (!menuList) {
          uni.showToast({
            title: "错误码#CA00246"
          })
          return;
        }

        this.playList.forEach(item => {
          item.chaseNum = 0;
          delete item.code; // true
        })
        console.log(this.playList);
        let param = {
          "lotteryId": this.lotteryId,
          "lotteryNo": this.headInfo.nextNo,
          "orderList": this.playList,
        }
        buyOrder(param).then(res => {
          if (res.code === 200) {
            this.playing.removeStorage('playingList');
            console.log("buy order");
            console.log(menuList[4].isOpen && menuList[5].isOpen)
            console.log(this.headInfo.lotteryTypeId);
            if (menuList[4].isOpen && menuList[5].isOpen) {
              if (this.headInfo.lotteryTypeId === 30) {
                uni.redirectTo({
                  url: '/pages/liuhe/shishicai?id=' + this.lotteryId + "&down=true"
                })
              } else if (this.headInfo.lotteryTypeId === 29) {//飞艇
                uni.redirectTo({
                  url: '/pages/liuhe/airship?id=' + this.lotteryId + "&down=true"
                })
              } else if (this.headInfo.lotteryTypeId === 28) {//快三
                uni.redirectTo({
                  url: '/pages/liuhe/kuaisan?id=' + this.lotteryId + "&down=true"
                })
              }else if (this.headInfo.lotteryTypeId === 19) {//11选5
                uni.redirectTo({
                  url: '/pages/liuhe/elevenOutOfFive?id=' + this.lotteryId + "&down=true"
                })
              } else if (this.headInfo.lotteryTypeId === 31) {//幸运20
                uni.redirectTo({
                  url: '/pages/liuhe/luckyTwenty?id=' + this.lotteryId + "&down=true"
                })
              } else {
                uni.redirectTo({
                  url: '/pages/liuhe/liuhePlaying?id=' + this.lotteryId + "&down=true"
                })
              }
            } else {
              if (this.headInfo.lotteryTypeId === 30) {
                uni.redirectTo({
                  url: '/pages/liuhe/ssc/betting_results?lotteryNo=' + param.lotteryNo + '&lotteryId=' + this.lotteryId
                })
              } else if (this.headInfo.lotteryTypeId === 29) {
                uni.redirectTo({
                  url: '/pages/liuhe/airship/betting_results?lotteryNo=' + param.lotteryNo + '&lotteryId=' + this.lotteryId
                })
              } else if (this.headInfo.lotteryTypeId === 28) {
                console.log("跳转快三下注结果界面");
                uni.redirectTo({
                  url: '/pages/liuhe/kuaisan/betting_results?lotteryNo=' + param.lotteryNo + '&lotteryId=' + this.lotteryId
                })
              } else {
                uni.redirectTo({
                  url: '/pages/liuhe/betting_results?lotteryNo=' + param.lotteryNo + '&lotteryId=' + this.lotteryId
                })
              }

            }
            uni.showToast({
              title: res.message,
              icon: "none"
            })
          } else if (res.code === 774) {
            this.$refs.confirm.close();
            this.$refs.balance.open("center");
          } else if (res.code === 701) {
            this.errorMsg = res.message;
            this.$refs.result.open()
          } else {
            uni.showToast({
              title: res.message,
              icon: "none"
            })
          }
        })
      } else {
        this.cancelBtn();
        if (this.playing.getStorage('userInfo').userType == 'demo') {
          uni.$emit('showPop', { refName: 'AlertTestMsg', })
        } else {
          this.$refs.balance.open("center");
        }
      }
    },
    yes(){
      this.$refs.result.close()
    },
    //获取头部开奖信息
    getHeadInfo() {
      getRewardsInfo({ lotteryId: this.lotteryId }).then(res => {
        // console.log(res);
        this.headInfo = res.result;
        this.setRewardsTimeOut(this.headInfo.closeTimeStamp)
        this.isClosing = res.result.stampType === 3;
      })
    },
    //设置倒计时
    setRewardsTimeOut(time) {
      if (time === 0) {
        this.getHeadInfo()
      } else {
        this.times = setInterval(() => {
          time -= 1;
          this.runtimes = this.playing.timestampToDate(time)
          if (time === 0) {
            this.getHeadInfo()
            clearInterval(this.times);
          }
        }, 1000)
      }
    },
    onChangeBetting(e, i) {
      // console.log(e.detail.value, i);
      this.playList[i].unitPrice = Number(e.detail.value);
      this.setTotalShow(this.playList);
    },
    setBetting(item, index) {
      this.playList[index].totalPrice = Number(item.unitPrice) * Number(item.stakeCount);
      return Number(item.unitPrice) * Number(item.stakeCount)
    },

    //从storage取出购物车列表
    setPlayList(code) {
      let list = this.playing.getStorage(code);
      this.playing.removeStorage(code);
      if (list === '') {
        this.playList = this.playing.getStorage('playingList') ? this.playing.getStorage('playingList') : [];
        this.setTotalShow(this.playList);
      } else {
        this.playList = this.playing.getStorage('playingList') ? this.playing.getStorage('playingList') : [];
        this.playList = this.playList.concat(list);
        this.setTotalShow(this.playList);
        this.playing.setStorage("playingList", this.playList);
        this.playList.map(item => {
          if (item.unitPrice === 0) {
            item.unitPrice = 1
          }
        })
      }
    },
    //设置显示列表总注数和价格
    setTotalShow(list) {
      this.total = {
        count: 0,
        price: 0
      }
      list.forEach(item => {
        if (item.unitPrice === 0) {
          item.unitPrice = 1
        }
        this.total.count += item.stakeCount;
        this.total.price += item.stakeCount * item.unitPrice;
      })
      // console.log(this.total);
    },
    confirm() {
      if (this.playList.length === 0) {
        return
      }
      this.$refs.confirm.open("center");
    },
    cancelBtn() {
      this.$refs.confirm.close();
    },
    clearCart() {
      console.log("购物车清空了")
      this.playing.removeStorage('playingList');
      this.$store.dispatch('setOrderList', []);
      this.playList = [];
      this.total.count = 0;
      this.total.price = 0;
    },
    onBackGame() {
      this.clearCart();
    },
  }
}
</script>

<style lang="scss">
.cart-page {
  background: #EEEEEE;
  font-family: 'PingFang SC';
  height: var(--vh);

  .error-modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 54rpx;
    gap: 30rpx;
    width: 540rpx;
    height: 380rpx;
    background: #FFFFFF;
    border-radius: 10rpx;

    .title {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;
      gap: 10rpx;
      width: 500rpx;
      height: 60rpx;
      border-bottom: 1rpx solid #DDDDDD;
      flex: none;
      order: 0;
      flex-grow: 0;
      font-size: 32rpx;
      line-height: 40rpx;
      text-align: center;
      letter-spacing: -1rpx;
      color: #9A9A9A;
    }

    .content {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      padding: 30rpx 0 50rpx;
      gap: 10rpx;
      width: 406rpx;
      height: 160rpx;
      font-size: 28rpx;
      line-height: 40rpx;
      text-align: center;
      letter-spacing: -1rpx;
      color: #222222;
    }

    .footer {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 10rpx 74rpx;
      gap: 20rpx;
      background: #FF9900;
      border-radius: 264rpx;
      font-size: 26rpx;
      line-height: 40rpx;
      text-align: center;
      letter-spacing: -1rpx;
      color: #FFFFFF;
    }
  }

  .detail-box {
    height: 190rpx;
    background: #F6F6F6;

    .top {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      padding-top: 22rpx;

      .time-box {
        width: 50%;
        text-align: center;

        .period {
          font-weight: 400;
          font-size: 25rpx;
          line-height: 35rpx;
          letter-spacing: -1px;
          color: #666666;
        }

        .time {
          font-weight: 400;
          font-size: 30rpx;
          line-height: 42rpx;
          letter-spacing: -1px;
          color: #DF2939;
        }
      }

      .line {
        border: 2rpx solid #E7E7E7;
        height: 82rpx;
      }

      .account {
        width: 50%;
        text-align: center;

        .text {
          font-weight: 400;
          font-size: 25rpx;
          line-height: 35rpx;
          letter-spacing: -1px;
          color: #666666;
        }

        .balance {
          font-weight: 400;
          font-size: 30rpx;
          line-height: 42rpx;
          letter-spacing: -1px;
          color: #333333;
        }
      }
    }

    .clear-box {
      display: flex;
      justify-content: center;

      .clear {
        background: #8CB2C9;
        border-radius: 30rpx;
        height: 60rpx;
        width: 278rpx;
        font-weight: 400;
        font-size: 35rpx;
        line-height: 49rpx;
        letter-spacing: -1px;
        color: #FFFFFF;
        text-align: center;
        line-height: 60rpx;
        margin: 12rpx 0 12rpx;
      }
    }

  }

  .list-box {
    .list-col {
      padding: 20rpx;

      .list-item {
        height: 244rpx;
        border-radius: 10rpx;
        background: #FFFFFF;
        border-left: 8rpx solid #FF9900;

        .detail {
          margin-left: 30rpx;
          margin-right: 20rpx;
          display: flex;
          border-bottom: 2rpx solid #E7E7E7;

          .left {
            width: 80%;

            .title {
              margin-left: 8rpx;
              font-weight: 400;
              font-size: 30rpx;
              line-height: 42rpx;
              letter-spacing: -1px;
              color: #DF2939;
              margin-top: 21rpx;
              margin-bottom: 25rpx;
            }

            .betting {
              margin-left: 8rpx;
              font-weight: 400;
              font-size: 30rpx;
              line-height: 42rpx;
              letter-spacing: -1px;
              color: #333333;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              -o-text-overflow: ellipsis;

              text {
                margin-right: 10rpx;
              }
            }
          }

          .right {
            width: 20%;
            display: flex;
            justify-content: center;

            image {
              margin: 26rpx auto 0;
              height: 74rpx;
              width: 74rpx;
            }
          }
        }

        .multiple-box {
          margin-left: 30rpx;
          display: flex;
          margin-top: 34rpx;
          align-items: center;

          text {
            font-size: 28rpx;
            color: #A1A1A1;
          }

          .multiple {
            width: 110rpx;
            height: 54rpx;
            background: #FFFFFF;
            border: 2rpx solid #E8E8E8;
            border-radius: 10rpx;
            margin: 0 10rpx;
            font-size: 28rpx;
            text-align: center;
            color: #A1A1B6;
          }
        }
      }
    }
  }

  .action-box {
    height: 80rpx;

    .action-div {
      width: 100%;
      max-width: 480px;
      position: fixed;
      height: 80rpx;
      bottom: 0;
      background: #F6F6F6;
      display: flex;
      align-items: center;

      .left-box {
        width: 70%;

        text {
          font-weight: 400;
          font-size: 27rpx;
          line-height: 38rpx;
          color: #333333;
          margin-left: 26rpx;
        }
      }

      .rigth-box {
        width: 30%;

        .act-btn {
          height: 54rpx;
          width: 180rpx;
          border-radius: 30rpx;
          background: #FF9900;
          font-weight: 400;
          font-size: 30rpx;
          line-height: 56rpx;
          color: #FFFFFF;
          text-align: center;
        }

        .act-btn.no-list {
          opacity: 0.5;
        }
      }
    }
  }

  .multiple-box {
    .multiple-row {
      position: fixed;
      bottom: 11rpx;
      display: flex;
      width: 100%;
      max-width: 480px;
      height: 66rpx;
      justify-content: space-around;

      .multiple-btn {
        width: 234rpx;
        height: 59rpx;
        background: #FFFFFF;
        border: 2rpx solid #E7E7E7;
        border-radius: 30rpx;
        font-weight: 400;
        font-size: 28rpx;
        line-height: 60rpx;
        color: #333333;
        text-align: center;
      }
    }
  }

  .confirm-div {
    width: 540rpx;
    height: 874rpx;
    padding: 20rpx 38rpx;

    .header {
      width: 100%;
      text-align: center;
      height: 60rpx;
      border-bottom: 2rpx solid #E6E6E6;
      font-weight: 400;
      font-size: 32rpx;
      line-height: 40rpx;
      color: #9A9A9A;
    }

    .list-box {
      padding-top: 20rpx;
      height: 660rpx;

      .title {
        display: flex;
        justify-content: space-between;

        .name {
          font-weight: 400;
          font-size: 28rpx;
          line-height: 39rpx;
          color: #333333;
        }

        .period {
          font-weight: 400;
          font-size: 24rpx;
          line-height: 34rpx;
          text-align: right;
          color: #9A9A9A;
        }
      }

      .list-row {
        padding-top: 30rpx;
        height: 500rpx;

        .list-item {
          .played {
            font-weight: 400;
            font-size: 28rpx;
            line-height: 39rpx;
            color: #333333;
          }

          .number {
            font-weight: 400;
            font-size: 25rpx;
            line-height: 35rpx;
            color: #39788D;
          }

          .note-box {
            font-weight: 400;
            font-size: 28rpx;
            line-height: 39rpx;
            color: #333333;
            margin-bottom: 20rpx;

            .note {
              margin-right: 24rpx;
            }
          }
        }
      }

    }

    .count-box {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 64rpx;
      line-height: 64rpx;
      border-top: 2rpx solid #E6E6E6;
      font-weight: 400;
      font-size: 24rpx;
      line-height: 34rpx;
      text-align: center;
      color: #000000;

      .note-total,
      .moeney-total {
        color: #FF9900;
        margin: 0 2rpx 0 2rpx;
      }
    }

    .btn-box {
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

      .confirm-act.closing {
        background: #CCCCCC;
      }
    }

  }

  .balance-box {
    width: 620rpx;
    padding: 40rpx;

    .image-item {
      margin-top: 36rpx;
      margin-bottom: 42rpx;
      display: flex;
      justify-content: center;

      image {
        height: 160rpx;
        width: 160rpx;
      }
    }

    .tips {
      width: 100%;
      height: 48rpx;
      font-size: 34rpx;
      line-height: 48rpx;
      text-align: center;
      color: #222222;
    }

    .tips-desc {
      height: 36rpx;
      line-height: 36rpx;
      text-align: center;
      color: #999999;
      font-size: 26rpx;
    }

    .btn-box {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 53rpx;

      .give-up {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 10rpx;
        gap: 10rpx;

        width: 260rpx;
        height: 70rpx;

        background: #FFFFFF;
        border: 1rpx solid #119999;
        border-radius: 50rpx;

        /* Inside auto layout */

        flex: none;
        order: 0;
        flex-grow: 0;
        color: #119999;
        font-size: 28rpx;
        margin-right: 10rpx;
      }

      .recharge {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 10rpx;
        gap: 10rpx;

        width: 260rpx;
        height: 70rpx;

        background: #3881A8;
        border-radius: 50rpx;

        /* Inside auto layout */

        flex: none;
        order: 1;
        flex-grow: 0;
        font-size: 28rpx;
        color: #fff;
        margin-left: 10rpx;
      }
    }
  }
}
</style>
