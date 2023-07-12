<template>
  <view class="menu-box" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle">
    </NavBar>
    <uni-list class="list-row">
      <uni-list-item class="list-item" v-for="(item, index) in menu" showArrow :arrowStyle="{ 'font-size': '40rpx' }"
        :to="item.url">
        <template v-slot:header>
          <view class="slot-box">
            <image class="slot-image" :src="item.img" mode="widthFix"></image>
          </view>
        </template>
        <template v-slot:body>
          <text class="slot-text">{{ item.title }}</text>
        </template>
      </uni-list-item>
    </uni-list>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "menu",
  components: {
    AlertInjectLayer, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "账变明细",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      menu: [
        { img: '/static/img/user/wallet/coin.png', title: '总账变明细', url: './accountlog' },
        { img: '/static/img/user/wallet/yl.png', title: '盈亏报表', url: '/pages/user/profitreport/profitreport' },
        { img: '/static/img/user/wallet/cq1.png', title: '存取记录', url: '/pages/user/accountLog/index' },
        { img: '/static/img/user/wallet/zhjl.png', title: '转换记录', url: './convert' },
        { img: '/static/img/user/wallet/lijin.png', title: '礼金记录', url: './gift_money' }
        /*{img:'/static/img/user/wallet/coin.png',title:'转账记录',url:''}*/
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.menu-box {
  .list-row {
    .list-item {
      height: 110rpx;

      .slot-box {
        display: flex;
        align-items: center;

        .slot-image {
          height: 32rpx;
          width: 32rpx;
          margin-right: 24rpx;
        }

        .slot-text {
          font-weight: 400;
          font-size: 30rpx;
          color: #222222;
        }
      }
    }
  }

}
</style>