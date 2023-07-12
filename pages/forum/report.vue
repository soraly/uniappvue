<template>
  <view class="mint-tab-container-item" :style="{ marginTop: safeHeight }">
    <NavBar :title="title" :is-show-right="isShowRight" :content="''"></NavBar>
    <view class="form-box">
      <view class="input-box">
        <view class="title">理由:</view>
        <view class="uni-textarea">
          <textarea class="textarea" v-model="formData.reason" placeholder-style="color:#c8c9cc;font-size:28rpx"
            placeholder="请输入您举报的理由" adjust-position="true" />
        </view>
      </view>
      <!--图片上传-->
      <view class="uploader">
        <view style=" margin-top: 30rpx">
          <cl-upload v-model="imgList" :fileName="'file'" :fileType="'image'" :action="action" :headers="headers"
            :listStyle="{
              columns: 3,
              columnGap: '0rpx',
              rowGap: '30rpx',
              margin: '0 8px 8px 0',
              width: '80px',
              height: '80px',
              radius: '0px'
            }" @onSuccess="onSuccess" @onError="onError">
          </cl-upload>
        </view>
      </view>
    </view>
    <button class="btn primary-btn" @click="report">保存</button>
    <AlertInjectLayer />
  </view>
</template>

<script>
import NavBar from "../../components/common/navBar/navBar";
import { config } from '../../config/config.js'
import { report } from '../../utils/user/index'
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

export default {
  name: "report",
  components: {
    AlertInjectLayer,
    NavBar
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      title: "举报",
      isShowRight: false,
      action: config.me_base_url + '/api/user/upImg',
      headers: { 'X-Access-Token': uni.getStorageSync('token') },
      imgList: [],
      imgListId: [],
      formData: {
        relatedId: 0,
        reason: '',
        pictureIds: [],
      }
    }
  },
  onLoad(option) {
    this.formData.relatedId = option.relatedId
    this.formData.title = option.title
    this.formData.type = option.type
    uni.setNavigationBarTitle({
      title: this.title
    });
  },
  methods: {
    /**
     * 自动上传返回的是一张图片信息
     * 手动上传返回的是已选中所有图片或者视频信息
     * */
    onSuccess: function (reslut) {
      // 把服务端返回的图片地址添加到list中与组件数据同步
      this.imgList.push(reslut.result.pictureUrl)
      this.imgListId.push(reslut.result)
    },
    //上传失败
    onError: function (err) {
      uni.showToast({
        title: '上传失败',
        duration: 2000,
        icon: 'none'
      })
    },
    //举报提交
    report: function () {
      let imgId = [];
      for (let i = 0; i < this.imgListId.length; i++) {
        if (this.imgList.indexOf(this.imgListId[i].pictureUrl) != -1) {
          imgId.push(this.imgListId[i].id)
        }
      }
      let prams = this.formData
      prams.pictureIds = imgId
      if (!prams.reason) {
        pop('请输入您的举报理由', 2000)
        return false
      }
      if (prams.pictureIds.length < 1) {
        pop("请上传图片", 2000)
        return false
      }
      report(prams).then(res => {
        let msg = ''
        if (res.code != 200) {
          msg = res.message
          pop(msg, 2000)
        } else {
          msg = "举报成功"
          uni.$emit('emitParams', { msg: msg })
          uni.navigateBack()
        }
      }).catch(err => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mint-tab-container-item {
  height: var(--vh);
  background: #f8f8f8;
}

.form-box {
  background: #fff;
  padding-bottom: 20rpx;

  .input-box {
    margin-top: 14rpx;
    padding: 0 26rpx;
    background: #fff;

    .title {
      width: 100%;
      padding: 12rpx 0;
      font-size: 32rpx;
      height: 48rpx;
      line-height: 48rpx;
      font-size: 28rpx;
    }

    .uni-textarea {
      font-size: 28rpx;
      padding: 14rpx 0;

      .textarea {
        width: 100%;
        height: 192rpx;
        font-size: 28rpx;
        color: #323233;
      }
    }
  }

  .uploader {
    padding: 0 30rpx;
    border-top: 2rpx solid #ebedf0;
  }
}

.btn {
  width: calc(100% - 60rpx);
  margin: 80rpx auto auto;
  background: #07c160;
  height: 88rpx;
  line-height: 88rpx;
  color: #fff;
  font-size: 32rpx;
  text-align: center;
  border-radius: 44rpx;
}
</style>