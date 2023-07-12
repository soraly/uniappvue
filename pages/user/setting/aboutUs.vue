<template>
  <view class="about-us" :style="{ marginTop: safeHeight }">
    <NavBar :title="title"></NavBar>
    <view class="address">
      <uni-row class="address-line" v-for="(i, index) in address.qqList" :key="index">
        <uni-col :span="4">
          <view>QQ:</view>
        </uni-col>
        <uni-col :span="20">
          <view>{{ i }}</view>
        </uni-col>
      </uni-row>
      <view class="center-line"></view>
      <uni-row class="address-line">
        <uni-col :span="4">
          <view>官网:</view>
        </uni-col>
        <uni-col :span="20">
          <view>
            <uni-link :href="address.url" :text="address.url" fontSize="17" showUnderLine="false" color="#555"></uni-link>
          </view>
        </uni-col>
      </uni-row>
    </view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
import { aboutUs } from "../../../utils/user";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  components: {
    AlertInjectLayer,
    UniCol,
    UniRow,
    NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "关于我们",
      address: { url: "" }
    }
  },
  onShow() {
    this.getAboutUs()
  },
  methods: {
    getAboutUs() {
      aboutUs().then(res => {
        if (res.code === 200) {
          this.address = res.result
          res.result.forEach(element => {
            if (element.type == 2) {
              this.address = element
            }
          });
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.about-us {
  background-color: #f8f8f8;
  height: var(--vh);
}

.address {
  margin-top: 16rpx;

  .address-line {
    background-color: #ffffff;
    font-size: 34rpx;
    padding: 24rpx;
    color: #555;
  }

  .center-line {
    height: 2rpx;
    width: 700rpx;
    margin: 0 auto;
    background-color: #e1e1e1;

  }
}
</style>
