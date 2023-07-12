<template>
  <view class="detail">
    <NavBar :isBack="false" :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor"
      :font-color="fontColor" :title-style="titleStyle">
      <block slot="left">
        <uni-icons @click="back" type="back" :color="fontColor" size="18" style="font-weight: bold;margin-left: 10px" />
      </block>
    </NavBar>
    <view class="list-row">
      <view class="list-item">
        <view class="title">类型</view>
        <view class="text">{{ info.balanceDirection == 1 ? '盈利' : info.balanceDirection == 2 ? '亏损' : '持平' }}</view>
      </view>
      <view class="list-item">
        <view class="title">业务</view>
        <view class="text">{{ info.groupName + "-" + info.typeName }}</view>
      </view>
      <view class="list-item">
        <view class="title">订单金额</view>
        <view class="text">{{ info.amount }}</view>
      </view>
      <view class="list-item">
        <view class="title">订单编号</view>
        <view class="text">{{ info.orderNo }}</view>
      </view>
      <view class="list-item">
        <view class="title">订单时间</view>
        <view class="text">{{ info.createTime }}</view>
      </view>
      <view class="list-item">
        <view class="title">订单来源</view>
        <view class="text">{{ info.source }}</view>
      </view>
      <view class="list-item">
        <view class="title">备注</view>
        <view class="text">{{ info.remark }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import NavBar from "../../../../components/common/navBar/navBar";
export default {
  components: { NavBar },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted() {
    console.log(this.info)
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "账变详情",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
    }
  },
  methods: {
    back() {
      this.$emit('closeDetail');
    },
  }
}
</script>

<style lang="scss" scoped>
.detail {
  background: #F6F6F6;
  height: var(--vh);
  max-width: 480px;
  margin: auto;

  .list-row {
    margin-top: 24rpx;
    background: #FFFFFF;
    padding: 0px 30rpx;

    :last-child {
      border-bottom: 0px solid #DDDDDD !important;
    }

    .list-item {
      height: 90rpx;
      border-bottom: 1px solid #DDDDDD;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .title {
        font-weight: 400;
        font-size: 26rpx;
        color: #444444;
      }

      .text {
        font-weight: 400;
        font-size: 24rpx;
        color: #666666;

        image {
          height: 40rpx;
          width: 40rpx;
        }
      }
    }
  }
}
</style>