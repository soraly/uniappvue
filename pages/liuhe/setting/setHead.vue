<template>
  <view class="setting" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :header-style="headerStyle" :bg-color="headerStyle.backgroundColor" :font-color="fontColor"
      :title-style="titleStyle" />
    <uni-section class="mb-10" :title="'选择头像'" :decorationPadding="'16rpx 0px'" :titleColor="'#666666'">
      <template v-slot:decoration>
        <view class="decoration"></view>
      </template>
    </uni-section>
    <view class="list">
      <view class="list-item" v-for="(item, index) in list" @click="setAvatar(item)">
        <image :src="item.imgUrl"></image>
      </view>
    </view>

    <uni-section class="mb-10" :title="'自定义头像'" :decorationPadding="'16rpx 0px'" :titleColor="'#666666'">
      <template v-slot:decoration>
        <view class="decoration"></view>
      </template>
    </uni-section>

    <view class="uploader">
      <cl-upload v-model="imgList" :fileName="'file'" :fileType="'image'" :action="action" :headers="headers"
        :data="{ addWatermark: false }" :count="1" :max="1" :listStyle="{
          background: '#EEEEEE',
          border: '2px dashed #CCCCCC',
          columnGap: '16rpx',
          rowGap: '16rpx',
          margin: '5px',
          width: '165rpx',
          height: '165rpx',
          radius: '10rpx'
        }" @onSuccess="onSuccess" @onError="onErrors">
        <block slot="addImg">
          <uni-icons type="plusempty" color=" #CCCCCC" size="66" style="font-size: 66rpx"></uni-icons>
        </block>
      </cl-upload>
    </view>
    <view class="btn-box" @click="confirmBtn">确定</view>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../../components/common/navBar/navBar";
import { getBuildInAvatar, updateAvatar } from "../../../utils/user/index";
import { config } from '../../../config/config.js'
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "setHead",
  components: {
    AlertInjectLayer, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "修改头像",
      headerStyle: {
        backgroundColor: '#1794FF',
      },
      fontColor: "#FFFFFF",
      titleStyle: {
        color: "#FFFFFF"
      },
      action: config.me_base_url[0] + '/api/user/upImg',
      headers: { 'X-Access-Token': uni.getStorageSync('token') },
      list: [],
      imgList: []
    }
  },
  onLoad(option) {
    this.headList()
  },
  methods: {
    headList() {
      getBuildInAvatar().then(res => {
        this.list = res.result
      }).catch(err => {
        console.log(err)
      })
    },
    setAvatar(item) {
      this.imgList = [item.imgUrl]
    },
    onSuccess(reslut) {
      // 把服务端返回的图片地址添加到list中与组件数据同步
      this.imgList = [reslut.result.pictureUrl]
    },
    //上传失败
    onErrors(err) {
      uni.showToast({
        title: '上传失败',
        duration: 2000,
        icon: 'none'
      })
    },
    confirmBtn() {
      updateAvatar({
        headImgUrl: this.imgList[0]
      }).then(res => {
        if (res.code === 200) {
          uni.$emit('setSucc', { msg: "设置成功" })
          backPage()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
  background: #FFFFFF;
  min-height: var(--vh);
  padding-bottom: 289rpx;
}

.mb-10 {
  background: none;
  margin-left: 40rpx;

  .decoration {
    width: 10rpx;
    height: 24rpx;
    border-radius: 30rpx;
    margin-right: 19rpx;
    background-color: #FF9900;
  }
}

.list {
  display: flex;
  margin: 10rpx 53rpx;
  padding-bottom: 56rpx;
  flex-wrap: wrap;
  gap: 16rpx;
  border-bottom: 1px solid #DDDDDD;

  .list-item {
    border: 1px solid #E8E8E8;

    image {
      height: 146rpx;
      width: 146rpx;
    }
  }
}

.uploader {
  padding-top: 10rpx;
  margin: 0 40rpx;
  padding-bottom: 20rpx;
  border-bottom: 1px solid #DDDDDD;
}

.btn-box {
  height: 90rpx;
  width: 705rpx;
  border-radius: 50rpx;
  margin: 30rpx auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #16A7FB;
  font-weight: 500;
  font-size: 32rpx;
  color: #FFFFFF;
}
</style>