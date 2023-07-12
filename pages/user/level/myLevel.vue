<template>
  <view class="my-level" :style="{ marginTop: safeHeight }">
    <NavBar :title="title"></NavBar>
    <view class="top-notice">
      <text>当前成长值：{{ score }}</text>
    </view>
    <view>
      <uni-list>
        <uni-list-item :title="item.name" :note="item.createTime" thumb-size="base" v-for="(item, index) in list">
          <text slot="footer" class="point">+{{ item.score }}</text>
        </uni-list-item>
      </uni-list>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { myScore } from "../../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "myLevel",
  components: {
    AlertInjectLayer, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "我的成长值",
      score: 0,
      list: [
      ]
    }
  },
  onShow() {
    myScore().then(res => {
      console.log(res)
      if (res.code == 200) {
        this.score = res.result.score
        this.list = res.result.list
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.my-level {
  .top-notice {
    background: #e1e1e1;
    height: 84rpx;
    color: #333;
    font-size: 28rpx;
    line-height: 84rpx;
    padding: 0 30rpx;
  }

  .point {
    font-size: 32rpx;
    color: #f25050;
    position: relative;
    top: 24rpx;
  }
}
</style>
