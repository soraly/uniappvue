<template>
  <view class="picker-slot-wrapper" :style="{transform: 'translate(0, '+translateY+'px)','transition-duration':duration+'ms'}">
    <view v-for="(val,key) in item" class="picker-item" style="height: 36px; line-height: 36px;">
      {{val}}
    </view>
  </view>
</template>

<script>
export default {
  name: "Item"
}
</script>

<style lang="scss" scoped>
.picker-slot-wrapper{
  transition-duration: 0s;
  transition-timing-function: ease-out;
  backface-visibility: hidden;
  .picker-item {
    height: 72rpx;
    line-height: 72rpx;
    padding: 0 20rpx;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
    left: 0;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    transition-duration: .3s;
    backface-visibility: hidden;
  }
  .picker-selected {
    transform: translateZ(0) rotateX(0);
  }
}
</style>