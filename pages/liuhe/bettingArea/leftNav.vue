<template>
  <view class="left-nav">
    <scroll-view scroll-y="true" class="list">
      <view :class="current == item.id ? 'list-item selected' : 'list-item'" v-for="(item, index) in playList"
        :key="item.id" @click="onSelected(item)">
        <view :class="current == item.id ? 'dots active' : 'dots'"></view>
        {{ item.name }}
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: "leftNav",
  props: {
    playList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      current: 2,
      play: []
    }
  },
  created() {
  },
  mounted() {
    console.log("?????????????", this.playList);
    this.getPlayData()
  },
  methods: {
    getPlayData() {
      this.play = uni.getStorageSync('playList')
      this.onSelected(this.play[0])
    },
    onSelected(item) {
      console.log(item);
      this.current = item.id;
      this.$emit('selected', item)
      this.$store.dispatch('setOrderList', [])
    }
  }
}
</script>

<style lang="scss" scoped>
.left-nav {
  width: 160rpx;

  .list {
    height: calc(var(--vh) - 400rpx);

    .list-item {
      .dots {
        width: 16rpx;
        height: 16rpx;
        background: #81A9C1;
        box-shadow: inset 0px 4rpx 4rpx rgba(0, 0, 0, 0.25);
        border-radius: 100rpx;
        display: inline-block;
        margin-right: 30rpx;
      }

      .dots.active {
        background: linear-gradient(180deg, #F8F9F9 0%, #FEFD04 100%);
        box-shadow: 0px 1rpx 5rpx rgba(0, 0, 0, 0.25), 0px 4rpx 4rpx rgba(0, 0, 0, 0.25), inset 0px -3rpx 4rpx rgba(0, 0, 0, 0.25);
        border-radius: 100rpx;
      }

      font-size: 30rpx;
      text-align: center;
      letter-spacing: -0.5px;
      color: #16607A;
      height: 104rpx;
      line-height: 104rpx;
      background: #CCDBEE;
      border: 1rpx solid #91B5CB;
      box-shadow: inset 0px 4rpx 3rpx #FFFFFF;
    }

    .list-item.selected {
      background: linear-gradient(180deg, #4E60AE 0%, #318EB9 100%);
      box-shadow: inset 0px 3rpx 2rpx rgba(0, 0, 0, 0.5);
      border: 1rpx solid #91B5CB;
      color: #BAE8FA;
    }
  }
}
</style>
