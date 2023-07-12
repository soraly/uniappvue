<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <!--顶部导航栏-->
    <nav-bar :title="title" :is-back="false">
      <block slot="left">
        <uni-icons @click="back" type="back" color="#000" size="16" style="font-weight: bold;margin-left: 10px" />
      </block>
    </nav-bar>
    <view class="sel-period" v-if="id == 0">
      <view v-for="(item, index) in nextMenu" :key="index" :class="isActive == index ? 'active' : ''"
        @click="lastArticle(index)">{{ item }}
      </view>
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
        <editor id="editor" class="ql-container" v-model="formData.description" @ready="onEditorReady">

        </editor>
        <view class="red-envelopes" @click="sendRed()" style="display: none">
          <img src="../../static/img/forum/red.png">
          <view style="display:inline;" v-if="formData.amount == 0">发红包</view>
          <view style="display:inline;" v-else>
            {{ " 共 " }}<span>{{ formData.amount }}</span>{{ " 元, " }}
            <span>{{ formData.count }}</span>个红包
          </view>
        </view>
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
            }" @onSuccess="onSuccess" @onError="onErrors">
          </cl-upload>
        </view>
        <p class="color-text">选择文字变色</p>
        <view class="color-list">
          <view v-for="(item, index) in colorList" :key="index"
            :class="colorIsActive == index ? 'color-item active' : 'color-item'" :style="item"
            @click="setColor(index, item)"></view>
        </view>
      </view>
    </view>
    <view class="ft-btn">
      <button type="primary" class="action" @click="send">发布</button>
    </view>
    <!--注册界面-->
    <uni-popup ref="popup" background-color="#fff" mask-background-color="rgba(0,0,0,.7)" :is-mask-click="false">
      <view style="width: 100vw">
        <view class="header-box">
          <div class="header">
            <view class="box-bg">
              <uni-nav-bar backgroundColor="#fff" height="55" color="#ffffff" rightWidth="65px">
                <block slot="left">
                  <uni-icons @click="closeRed" type="back" color="#000" size="16"
                    style="font-weight: bold;margin-left: 10px" />
                </block>
                <view class="input-view" style="color:#000">发红包</view>
              </uni-nav-bar>
            </view>
          </div>
        </view>
        <div class="pop-red-hb">
          <div class="title">发红包总金额最少1元，最多1000元</div>
          <div class="input-box">
            <div class="van-row">
              <div class="van-col van-col--6"><label>总金额：</label></div>
              <div class="van-col van-col--16">
                <input v-model="amount" type="number" min="2" max="20" placeholder="0.00">
              </div>
              <div class="van-col van-col--2"><span>元</span></div>
            </div>
          </div>
          <div class="title">每次最多可发1000个随机红包</div>
          <div class="input-box">
            <div class="van-row">
              <div class="van-col van-col--6"><label>红包个数：</label></div>
              <div class="van-col van-col--16"><input v-model="count" type="number" min="1" max="100" placeholder="0">
              </div>
              <div class="van-col van-col--2"><span>个</span></div>
            </div>
          </div>
          <div class="cont-prick">¥ {{ amount ? amount : '0.00' }}</div>
          <button class="van-button van-button--primary van-button--large van-button--block van-button--round"
            @click="putIn()">
            <div class="van-button__content"><span class="van-button__text">塞钱进红包</span></div>
          </button>
        </div>
      </view>
    </uni-popup>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "@/components/common/navBar/navBar.vue";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

import { lastPeriodArticle, submitArticle, detail, editArticle } from '../../utils/forum/index.js'
import { config } from '../../config/config.js'
export default {
  name: "add",
  components: {
    AlertInjectLayer, NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: '发布（论坛贴）',
      lotteryType: 2,
      id: 0,
      action: config.me_base_url[0] + '/api/user/upImg',
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
      nextMenu: ['加载上期内容', '加载上期标题', '加载上期正文'],
      lastPeriod: {},
      imgList: [],
      imgListId: [],
      amount: '0.00',
      count: 0,
      editorCtx: '',
      content: '',
      formData: {
        amount: 0.00,
        count: 0,
        title: '',
        description: '',
        pictureIds: [],
        type: 3,
      },
    }
  },
  onLoad(option) {
    if (option.id) {
      this.id = option.id
    }
    this.lastPeriodArticle()
    uni.setNavigationBarTitle({
      title: this.title
    });
  },
  methods: {
    //返回
    back: function (msg = '') {
      uni.$emit('emitParams', { msg: msg })
      uni.navigateBack()
    },
    onEditorReady() {
      // #ifdef MP-BAIDU
      this.editorCtx = requireDynamicLib('editorLib').createEditorContext('editor');
      // #endif

      // #ifdef APP-PLUS || H5 ||MP-WEIXIN
      uni.createSelectorQuery().select('#editor').context((res) => {
        this.editorCtx = res.context
      }).exec()
      // #endif
      console.log(this.id)
      if (this.id) {
        this.detail()
      }
    },
    //设置颜色
    setColor: function (index, item) {
      this.colorIsActive = index
      this.editorCtx.format('color', item.background)
    },
    //获取内容
    getContents: function () {
      const that = this
      this.editorCtx.getContents({
        success: (res) => {
          that.formData.description = res.html
          that.content = res.text.trim()
          this.fabu()
        },
      })
    },
    //文章详情获取
    detail: function () {
      let prams = { articleId: this.id }
      detail(prams).then(res => {
        if (res.code != 200) {
          pop(res.message, 2000)
          return false
        }
        this.info = res.result
        this.lotteryType = this.info.lotteryType
        this.formData.type = this.info.type
        this.formData.title = this.info.title
        for (let i = 0; i < this.info.pictureEntityList.length; i++) {
          this.imgList.push(this.info.pictureEntityList[i].pictureUrl)
          this.imgListId.push(this.info.pictureEntityList[i])
        }
        this.editorCtx.setContents({
          html: this.info.description
        })
      }).catch(err => {
        console.log(err)
      })
    },
    selectType(item) {
      this.lotteryType = item.lotteryType
      this.lastPeriodArticle()
    },
    //获取上次发布的数据
    lastPeriodArticle: function () {
      let prams = { lotteryType: this.lotteryType }
      lastPeriodArticle(prams).then(res => {
        this.lastPeriod = res.result
      }).catch(err => {
        console.log(err)
      })
    },
    lastArticle: function (index) {
      if (!this.lastPeriod) {
        pop('您上一期没有发布帖子', 1000)
      }
      this.isActive = index
      this.formData.title = '';
      this.editorCtx.clear()
      if (this.isActive == 0) {
        this.formData.title = this.lastPeriod.title
        this.editorCtx.setContents({
          html: this.lastPeriod.description
        })
      }
      if (this.isActive == 1) {
        this.formData.title = this.lastPeriod.title
      }
      if (this.isActive == 2) {
        this.editorCtx.setContents({
          html: this.lastPeriod.description
        })
      }
    },
    //发红包
    sendRed: function () {
      this.$refs.popup.open('right')
    },
    //关闭红包窗口
    closeRed: function () {
      this.$refs.popup.close()
    },
    //塞红包进去
    putIn: function () {
      if (this.amount < 1 || this.amount > 1000) {
        uni.showToast({
          title: '红包金额最少1元，最多1000元',
          duration: 2000,
          icon: 'none'
        })
        return false
      }
      if (this.count < 1 || this.count > 1000) {
        uni.showToast({
          title: '红包数量最少1个，最多1000个',
          duration: 2000,
          icon: 'none'
        })
        return false
      }
      this.formData.amount = this.amount
      this.formData.count = this.count
      this.$refs.popup.close()
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
    onErrors(err) {
      uni.showToast({
        title: '上传失败',
        duration: 2000,
        icon: 'none'
      })
    },
    send: function () {
      this.getContents();
    },
    //提交表单
    fabu: function () {
      let imgId = [];
      let prams = this.formData;
      prams.lotteryType = this.lotteryType
      /*if(this.imgListId.length == 0 ){
        pop('请上传图片')
        return false
      }*/
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
      if (!this.content) {
        pop('请输入要写的内容')
        return false
      }
      if (this.id) {
        prams.articleId = this.id
        editArticle(prams).then(res => {
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
      } else {
        submitArticle(prams).then(res => {
          let msg = ''
          if (res.code != 200) {
            msg = res.message
          } else {
            uni.setStorageSync('addForum', new Date().getTime());
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
}
</script>

<style scoped>
.mint-tab-container-item {
  padding-top: 46px;
}

.header-box {
  height: auto;
}

.header,
.box-bg {
  height: 46px;
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
  min-height: 150px;
  height: 150px;
  padding: 10px 10px 10px 15px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.red-envelopes span {
  color: red;
  margin: 0 10rpx;
}</style>