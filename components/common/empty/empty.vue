<template>
  <view class="empty-box" style="margin-top: 145px;">
    <image :style="{ width: size + 'rpx' }" mode="widthFix" :src="img" alt=""></image>
    <p>暂无数据</p>
  </view>
</template>

<script>
export default {
  name: "empty",
  props: {
    img: {
      type: String,
      default: () => {
        return '/static/img/wu.png'
      }
    },
    size: {
      type: String | Number,
      default: () => {
        return 128
      }
    },
    height: {
      type: String | Number,
      default: () => {
        return 128
      }
    }
  }
}
</script>

<style scoped>
.empty-box {
  width: 100%;
  height: 65vh;
  text-align: center;
}

.empty-box p {
  text-align: center;
  color: #a0a0a0;
  font-size: 16px;
  line-height: 21px;
  margin-top: 14px;
}
</style>