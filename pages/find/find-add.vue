<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <!--顶部导航栏-->
    <view class="header-box">
      <div class="header" :style="{ marginTop: safeHeight }">
        <view class="box-bg">
          <uni-nav-bar backgroundColor="#fff" :height="46" color="#ffffff" rightWidth="65px">
            <block slot="left">
              <uni-icons @click="back" type="back" color="#000" size="16" style="font-weight: bold;margin-left: 10px" />
            </block>
            <view class="input-view" style="color:#000;font-size: 16px">{{ title }}</view>
          </uni-nav-bar>
        </view>
      </div>
    </view>
    <view class="find-body">
      <view class="hd">选择平台：</view>
      <view class="tab-box">
        <view class="nav">
          <view v-for="(item, index) in navList" :key="index"
            :class="lotteryType == item.lotteryType ? 'nav-item active' : 'nav-item'" @click="selectType(item)">
            {{ item.name }}
          </view>
        </view>
      </view>
      <view class="hd">标题：</view>
      <view class="van-cell-group">
        <view class="van-cell van-field">
          <view class="van-cell__value van-cell__value--alone van-field__value">
            <view class="van-field__body">
              <input type="text" v-model="formData.title" placeholder-style="color:#d3c9cc;font-size:28rpx"
                placeholder="请输入发布的标题" class="van-field__control">
            </view>
          </view>
        </view>
      </view>
      <view class="hd">内容：</view>
      <view class="van-cell-group">
        <textarea placeholder-style="color:rgb(211, 201, 204)" placeholder="请输入您要写的内容" class="ql-container"
          v-model="formData.description" auto-height />
        <!--图片上传-->
        <view class="uploader">
          <cl-upload v-model="imgList" :fileName="'file'" :fileType="'image'" :action="action" :headers="headers"
            :data="{ addWatermark: true }" :listStyle="{
              columnGap: '16rpx',
              rowGap: '16rpx',
              margin: '5px',
              width: '100%',
              height: '80px',
              radius: '0px'
            }" @onSuccess="onSuccess" @onError="onError">
          </cl-upload>
        </view>
      </view>
    </view>
    <view class="ft-btn">
      <button type="primary" class="action" @click="fabu">发布</button>
    </view>
    <!--注册界面-->
    <AlertInjectLayer />
  </view>
</template>

<script>
import { lastPeriodArticle, submitArticle, detail, editArticle } from '../../utils/forum/index.js'
import { config } from '../../config/config.js'
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"
export default {
  components: {
    AlertInjectLayer,
  },
  name: "find-add",
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '发布（发现贴）',
      lotteryType: uni.getStorageSync('lotteryType') || 1,
      id: 0,
      action: config.me_base_url + '/api/user/upImg',
      headers: { 'X-Access-Token': uni.getStorageSync('token') },
      navList: [
        { lotteryType: 2, name: '澳彩' },
        { lotteryType: 1, name: '港彩' },
        { lotteryType: 3, name: '台彩' },
        { lotteryType: 4, name: '新彩' }
      ],
      colorIsActive: -1,
      colorList: [
        { background: 'rgb(0, 0, 0)' },
        { background: 'rgb(220, 93, 131)' },
        { background: 'rgb(196, 68, 55)' },
        { background: 'rgb(87, 148, 135)' },
        { background: 'rgb(94, 149, 67)' },
        { background: 'rgb(159, 188, 105)' },
        { background: 'rgb(67, 84, 169)' },
        { background: 'rgb(235, 158, 78)' }
      ],
      isActive: -1,
      lastPeriod: {},
      imgList: [],
      imgListId: [],
      amount: '0.00',
      editorCtx: '',
      content: '',
      formData: {
        type: 2,
        title: '',
        description: '',
        pictureIds: [],
      },
    }
  },
  onLoad(option) {
    uni.setNavigationBarTitle({
      title: this.title
    });
    console.log(this.lotteryType)
  },
  methods: {
    //返回
    back: function (msg = '') {
      uni.$emit('emitParams', { msg: msg })
      uni.navigateBack()
    },
    selectType(item) {
      this.lotteryType = item.lotteryType
    },
    /**
     * 自动上传返回的是一张图片信息
     * 手动上传返回的是已选中所有图片或者视频信息
     * */
    onSuccess(reslut) {
      // 把服务端返回的图片地址添加到list中与组件数据同步
      this.imgList.push(reslut.result.pictureUrl)
      this.imgListId.push(reslut.result)
    },
    //上传失败
    onError(err) {
      uni.showToast({
        title: '上传失败',
        duration: 2000,
        icon: 'none'
      })
    },
    //提交表单
    fabu: function () {
      let imgId = [];
      let prams = this.formData;
      prams.lotteryType = this.lotteryType
      if (this.imgListId.length == 0) {
        pop('请上传图片')
        return false
      }
      for (let i = 0; i < this.imgListId.length; i++) {
        if (this.imgList.indexOf(this.imgListId[i].pictureUrl) != -1) {
          imgId.push(this.imgListId[i].id)
        }
      }
      prams.pictureIds = imgId
      if (prams.title == '') {
        pop('请输入标题')
        return false
      }
      if (!prams.description) {
        pop('请输入要写的内容')
        return false
      }
      prams.articleId = this.id
      submitArticle(prams).then(res => {
        let msg = ''
        if (res.code != 200) {
          msg = res.message
        } else {
          msg = "发布成功"
        }
        uni.$emit('emitParams', { msg: msg })
        uni.navigateBack({
          delta: 1 // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
        });
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.header-box {
  height: 46px;
}

.header-box .header {
  position: fixed;
  top: 0;
  height: 46px;
  z-index: 1;
  border-bottom: 1px solid #ebedf0;
  width: 100%;
  max-width: 480px;
}

.sel-period {
  display: flex;
  padding: 10rpx 30rpx;
  justify-content: space-between;
}

.sel-period uni-view {
  padding: 6rpx 20rpx;
  border-radius: 8rpx;
  border: 2rpx solid #c5c5c5;
  width: 180rpx;
  text-align: center;
  color: #333;
  font-size: 24rpx;
  line-height: 27.6rpx;
}

.sel-period .active {
  background: #07c160;
  border: none;
  color: #fff;
}

.find-body {
  margin-top: 20rpx;
  background: #fff;
}

.find-body .hd {
  padding: 20rpx 30rpx 0 30rpx;
  font-size: 28rpx;
}

.tab-box {
  padding: 10px 7px 5px;
}

.nav {
  box-sizing: border-box;
  height: 30px;
  margin: 0px 16px;
  border: 2rpx solid #07c160;
  border-radius: 2px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: space-around;
  background: #fff;
}

.nav .nav-item {
  width: 25%;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-right: 2rpx solid;
  border-color: #07c160;
  font-size: 24rpx;
  color: #07c160;
}

.nav .nav-item:last-child {
  border: 0px;
}

.nav .nav-item.active {
  background-color: #07c160;
  color: #fff;
}

.van-cell-group {
  background-color: #fff;
}

.van-cell {
  position: relative;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 20rpx 32rpx;
  overflow: hidden;
  color: #323233;
  font-size: 28rpx;
  line-height: 28rpx;
  background-color: #fff;
}

.van-cell__value {
  position: relative;
  overflow: hidden;
  color: #969799;
  text-align: right;
  vertical-align: middle;
  word-wrap: break-word;
}

.van-cell__value--alone {
  color: #323233;
  text-align: left;
}

.van-field__value {
  overflow: visible;
  width: 100%;
}

.van-cell__value .van-field__body input {
  height: 28rpx;
}

.van-field__control {
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  color: #323233;
  line-height: inherit;
  text-align: left;
  background-color: transparent;
  border: 0;
  resize: none;
}

.uni-textarea {
  border: none;
  position: relative;
  overflow: initial;
  font-size: 28rpx;
  line-height: 3rpx;
  background-color: #fff;
  color: #333;
  text-align: left;
  border-radius: 10rpx;
}

.content {
  padding: 20rpx;
  min-height: 300rpx;
  padding-left: 30rpx;
  width: 90%;
}

.red-envelopes {
  padding: 20rpx 30rpx;
  font-size: 28rpx;
}

.red-envelopes img {
  width: 32rpx;
  margin-right: 10rpx;
  vertical-align: bottom;
}

.uploader {
  padding: 20rpx 30rpx;
}

.color-text {
  padding: 30rpx 26rpx 0;
  color: #999;
  font-size: 28rpx;
  line-height: 40rpx;
}

.color-list {
  padding: 20rpx 26rpx 30rpx;
  display: flex;
  background: #fff;
  justify-content: space-between;
  align-items: center;
}

.color-list .color-item {
  width: 10%;
  height: 50rpx;
  border-radius: 4rpx;
  box-sizing: content-box;
  border: 6rpx solid #fff;
}

.color-list .color-item.active {
  border: 6rpx solid #f7d7a3;
}

.ft-btn {
  padding: 0 30rpx;
  margin-top: 24rpx;
}

.ft-btn .action {
  background-color: #07c160 !important;
  border: 2rpx solid #07c160 !important;
  color: #fff;
  height: 80rpx !important;
  border-radius: 999px;
  padding: 0 30rpx;
  font-size: 28rpx;
}

.pop-red-hb {
  padding: 30rpx;
}

.pop-red-hb .title {
  font-size: 24rpx;
  color: #666;
  padding: 20rpx 0;
}

.pop-red-hb .input-box {
  padding: 20rpx;
  position: relative;
  background: #eee;
  border-radius: 8rpx;
  margin-bottom: 40rpx;
  height: 44rpx;
}

.van-col--6 {
  width: 25%;
}

.van-col--16 {
  width: 66.66666667%;
}

.van-col--2 {
  width: 8.33333333%;
}

.van-col {
  float: left;
  box-sizing: border-box;
  min-height: 2rpx;
}

.pop-red-hb .input-box label {
  font-size: 32rpx;
  position: relative;
  z-index: 1;
}

.pop-red-hb .input-box input {
  font-size: 32rpx;
  border: 0;
  width: 100%;
  text-align: right;
  background: #eee;
}

.pop-red-hb .input-box span {
  float: right;
  color: red;
  font-size: 32rpx;
}

.pop-red-hb .cont-prick {
  font-size: 64rpx;
  padding: 40rpx 0;
  text-align: center;
  font-weight: 700;
}

.van-button {
  height: 80rpx !important;
  position: relative;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 32rpx;
  line-height: 2.4rpx;
  text-align: center;
  cursor: pointer;
  transition: opacity .2s;
  -webkit-appearance: none;
}

.van-button--round {
  border-radius: 999px;
}

.van-button--block {
  display: block;
  width: 100%;
}

.van-button--primary {
  color: #fff;
  background-color: #07c160;
  border: 2rpx solid #07c160;
}

.van-button__content {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  height: 100%;
}

.ql-container {
  min-height: 48px;
  height: 48px;
  padding: 10px 10px 10px 15px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.red-envelopes span {
  color: red;
  margin: 0 10rpx;
}</style>