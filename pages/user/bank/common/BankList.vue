<template>
  <view class="bank-div">
    <view class="bank" :style="{ marginTop: safeHeight }">
      <NavBar :isBack="false" :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor"
        :font-color="fontColor" :title-style="titleStyle">
        <block slot="left">
          <uni-icons @click="back" type="back" :color="fontColor" size="18" style="font-weight: bold;margin-left: 10px" />
        </block>
      </NavBar>
      <view class="search-box" v-show="isShow">
        <uni-search-bar v-model="keyword" placeholder="请输入银行名称" @confirm="searchBank" :focus="true" @clear="clear"
          :cancelButton="'none'">
        </uni-search-bar>
      </view>
      <uni-list class="list-box">
        <uni-list-item class="list-item" thumb-size="base" v-for="(item, index) in data" clickable @click="setBank(item)">
          <template v-slot:header>
            <view class="slot-box">
              <image class="slot-image" :src="item.logoMobile" mode="widthFix"></image>
            </view>
          </template>
          <template v-slot:body>
            <text class="slot-text">{{ item.name }}</text>
          </template>
        </uni-list-item>
      </uni-list>
    </view>
  </view>
</template>

<script>
import NavBar from "../../../../components/common/navBar/navBar";
export default {
  name: "bank",
  components: { NavBar },
  props: {
    data: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      default: '选择银行'
    },
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      headerStyle: {
        backgroundColor: "#1794FF"
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      keyword: '',
    }
  },
  methods: {
    back() {
      this.$emit('closePay');
    },
    clear() {
      this.keyword = ''
    },
    searchBank() {
      this.$emit("searchBank", this.keyword)
    },
    setBank(item) {
      this.$emit("setBank", item)
    }
  }
}
</script>

<style lang="scss" scoped>
.bank-div {
  width: 100vw;
  background: rgba(0, 0, 0, 0.1);
}

.bank {
  font-family: 'PingFang SC';
  width: 100vw;
  max-width: 480px;
  margin: auto;
  height: var(--vh);
  background: #ffffff;

  .list-box {
    margin-top: 15rpx;

    .list-item {
      padding: 12rpx 0;

      .slot-box {
        display: flex;
        align-items: center;

        .slot-image {
          height: 48rpx;
          width: 48rpx;
        }
      }

      .slot-text {
        margin-left: 20rpx;
        font-weight: 400;
        font-size: 32rpx;
        color: #222222;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>