<template>
  <view class="apply" :style="customStyle">
    <NavBar :title="title"></NavBar>
    <view class="rules" @click="toRules">
      活动规则
    </view>
    <view class="ad-text">
      <image class="ad-text-img" :src="src1"></image>
    </view>
    <view class="ad-bg">
      <image class="ad-bg-img" :src="src2"></image>
    </view>
    <view class="condition">
      <view class="content">
        <view class="title">申请门槛</view>
        <view class="bd">
          <view>1.{{ applyConditionList[0] }}</view>
          <view>2.{{ applyConditionList[1] }}</view>
          <view>3.{{ applyConditionList[2] }}</view>
        </view>
      </view>
    </view>
    <view class="ft-btn">
      <view class="new-sub-btn" @click="toApply">立即申请代言人</view>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { applySpoke, getActiveRule } from "../../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  name: "apply",
  components: {
    AlertInjectLayer,
    NavBar
  },
  computed: {
    customStyle() {
      return {
        marginTop: this.safeHeight,
        height: 'var(--vh)'
      }
    }
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "申请代言人",
      src1: "/static/img/user/sqdyr-title.png",
      src2: "/static/img/user/sqdyr.png",
      applyConditionList: []
    }
  },
  onShow() {
    this.getRules()
  },
  methods: {
    //获取活动规则
    getRules() {
      getActiveRule().then(res => {
        console.log(res);
        if (res.code === 200) {
          this.applyConditionList = res.result.applyConditionList
        }
      })
    },
    //申请代言人
    setApply() {
      applySpoke().then(res => {
        uni.showToast({
          title: res.message,
          icon: "none"
        })
      })
    },
    toApply() {//点击申请按钮
      pop("敬请期待", 2000)
      /*this.setApply()*/
    },
    toRules() {
      uni.navigateTo({
        url: "/pages/user/spokesperson/activity"
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.apply {
  background: linear-gradient(151deg, #b32b98, #f8484a 35%, #e9379e 57%, #ef4373);
  // height: calc(var(--vh) - 92rpx);
  position: relative;

  .rules {
    position: absolute;
    height: 72rpx;
    width: 196rpx;
    text-align: center;
    line-height: 72rpx;
    font-weight: 600;
    color: #fffae3;
    font-size: 32rpx;
    right: 0;
    top: 100rpx;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMQAAABICAMAAACeCqr6AAAA0lBMVEUAAAD//3///0D//1X/32D/6lX/61j/8Fr/61r/6ln/6Fn/6lf/61f/6Fj/6lj/61j/6ln/61j/6Vf/6Vj/6lj/6Ff/6Vn/6Vj/6ln/6Ff/6Vj/6lj/6Vf/6lj/6Vj/6lj/6Vj/6Vj/6Vf/6Vj/6Vf/6Vj/6Vj/6lj/6Vf/sEr/sUr/s0r/s0v/tEv/tkz/t0v/uUz/ukz/u0z/u03/vU3/wE7/xE//yVD/zFH/zVH/z1H/01L/1lP/3VX/4Vb/5Fb/5Vf/5lf/51f/6Ff/6Fj/6VjZRegGAAAAKXRSTlMAAgQGCAwaIjM8QlVbYmJlbXFydIiSr7C4zNDQ0t7f5uvs7/D4+Pz8/hEksfEAAAGnSURBVGje7dtbV0EBEIbhjYjo6HwqijJFSkJOKd7//5e6UWsV3XXhm9XcunrWtpg9800Q/F6h+GEmV6rWmux4/SqIneQvEantgr1U4Rqd2kaIpi+Qqk1C+LT++eHr9GXwdN+5tR2vDUOishbMho8mUj8IkWwLgLfxg+nUd8N+EYDFqG2miji4AlhNOmayiGQDYN4300Uc3wBM70wYkbwBlkMzYcRBA3gfmDJi/wp4fzZlRKQILDWfwxciCzA0aUSiBUxNGhGuAPM7bcQpsOqbNCJaByamjUgDi442Yu8CGJk2IgW8tcURBWBs2ojYNfAgjjgBZiaOyCs3HGtE6BJ4FEfEgVcTRxxJt35rRAZ4UUfkgIE6ogz01BHnQFcdUQM66ogmcPuP+P86/Q2iCtyrI0oefmJd/Nm5aDtcNIAuWnEXL0UuXk99DApcjGxcDM98jDFdDJRdjPZ9LFlcrLt8LB5drIB9LON9xCJcBFR8RIV8hLZ8xOd8BBl9REp9hHt9xKx9BN6DIAiffTs96HUFTw98HIE4Ocdxchj1eaJ2lMmVz3f/RO0DmiQsG9kI7/MAAAAASUVORK5CYII=);
    background-size: 100% 100%;
  }

  .ad-text {
    margin-top: 100rpx;
    text-align: center;

    .ad-text-img {
      height: 122rpx;
      width: 540rpx;
    }
  }

  .ad-bg {
    text-align: center;

    .ad-bg-img {
      width: 100%;
      height: 640rpx;
    }
  }

  .condition {
    padding: 0 60rpx;
    position: absolute;
    bottom: 220rpx;
    width: 100%;
    box-sizing: border-box;

    .content {
      background: #fff;
      box-shadow: inset 0 0 6rpx 4rpx #feeb9d;
      border-radius: 42rpx;
      padding: 24rpx;
      color: #434343;

      .title {
        font-size: 30rpx;
        color: #434343;
        margin-bottom: 18rpx;
      }

      .bd {
        font-size: 26rpx;
        color: #434343;
        line-height: 46rpx;
      }
    }
  }

  .ft-btn {
    padding: 0 60rpx;
    position: fixed;
    bottom: 16rpx;
    width: 100%;
    box-sizing: border-box;

    .new-sub-btn {
      background-image: url("@/static/img/user/yqhybtn.png");
      background-size: 100% 100%;
      height: 116rpx;
      line-height: 116rpx;
      text-align: center;
      font-weight: 600;
      color: #fff;
      font-size: 36rpx;
    }
  }
}
</style>
