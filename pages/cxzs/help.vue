<template>
  <view class="mint-tab-container-item">
    <NavBar :title="title"></NavBar>
    <h4 style="margin-top: 15px;">查询助手</h4>
    <p>选择条件可查询号码等条件的历史出现位置。目前提供的条件有：号码丶生肖丶五行丶波色丶家野丶尾数。</p>
    <h4>如何使用</h4>
    <p>点击查询助手右上方的"选择条件"按钮，进行条件选择。选择条件后点击"确定"后系统会自动帮助您筛选条件的内容。</p>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "help",
  components: {
    AlertInjectLayer,
    NavBar
  },
  data() {
    return {
      title: '帮助中心',
    }
  }
}
</script>

<style lang="scss" scoped>
.mint-tab-container-item {
  background: #fff;
  height: var(--vh);
}

h4 {
  font-size: 28rpx;
  margin-bottom: 30rpx;
  padding: 0 24rpx;
}

p {
  font-size: 24rpx;
  margin-bottom: 40rpx;
  padding: 0 24rpx;
}
</style>