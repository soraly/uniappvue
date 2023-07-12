<template>
  <view class="set-comment-box" :style="{ marginTop: safeHeight }">
    <!--顶部导航栏-->
    <view class="header-box">
      <div class="header" :style="{ marginTop: safeHeight }">
        <view class="box-bg">
          <uni-nav-bar backgroundColor="#fff" :height="46" color="#000" rightWidth="65px">
            <block slot="left">
              <uni-icons @click="closed" type="back" color="#000" size="16" style="font-weight: bold;margin-left: 10px" />
            </block>
            <view class="input-view" style="color:#000;font-weight: 700;font-size: 16px;">评论</view>
          </uni-nav-bar>
        </view>
      </div>
    </view>
    <view class="from-box">
      <view class="title">{{ commentId > 0 ? '回复评论' : '发布评论' }}</view>
      <view class="content">
        <view class="van-cell van-field">
          <view class="van-cell__value van-cell__value--alone van-field__value">
            <view class="van-field__body">
              <textarea v-model="prams.content" rows="6" @input="textStr" :placeholder="placeholder"
                class="van-field__control" placeholder-style="color:#969799;font-size:28rpx" style="height: 144px;"
                maxlength="1200"></textarea>
            </view>
            <view class="van-field__word-limit">
              <span class="van-field__word-num">{{ textlenth }}</span>/1200
            </view>
          </view>
        </view>
      </view>
      <!--图片上传-->
      <view class="uploader">
        <cl-upload v-model="imgList" :fileName="'file'" :fileType="'image'" :action="action" :data="{ addWatermark: true }"
          :listStyle="listStyle" :headers="headers" @onSuccess="onSuccess" @onError="onError">
          <template #addImg>
            <uni-icons type="camera-filled" size="60" color="#fff"></uni-icons>
          </template>
        </cl-upload>
      </view>
    </view>
    <view class="ft-btn">
      <button type="primary" class="action" @click="fabu">发布</button>
    </view>
  </view>
</template>

<script>
import { config } from '../../../config/config.js'
import { comment } from '../../../utils/user/index.js'
export default {
  name: "ReplyComment",
  props: {
    commentId: {
      type: Number,
      default: 0
    },
    relatedId: {
      type: Number,
      default: 0
    },
    createTime: {
      type: String,
      default: ''
    },
    commentType: {
      type: Number,
      default: 3
    },
    toUserId: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入评论的内容'
    }
  },
  data() {
    return {
      safeHeight: uni.getStorageSync('systemInfo').safeArea.top + "px",
      textlenth: 0,
      imgList: [],
      imgListId: [],
      action: config.me_base_url + '/api/user/upImg',
      headers: { 'X-Access-Token': uni.getStorageSync('token') },
      listStyle: {
        columnGap: '16rpx',
        rowGap: '16rpx',
        margin: '5px',
        width: '100%',
        height: '80px',
        radius: '0px'
      },
      prams: {
        content: '',
        pictureIds: [],
        relatedId: 0,
        toUserId: 0,
        type: 3
      }
    }
  },
  methods: {
    closed: function (type = 1) {
      this.$emit('closeComent', type)
    },
    //计算输入框的字符长度
    textStr: function () {
      this.textlenth = this.prams.content.length
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
    fabu: function () {
      let imgId = [];
      let prams = this.prams;
      console.log(this.commentId)
      prams.commentId = this.commentId
      prams.relatedId = this.relatedId
      prams.createTime = this.createTime
      prams.toUserId = this.toUserId
      prams.type = this.commentType
      for (let i = 0; i < this.imgListId.length; i++) {
        if (this.imgList.indexOf(this.imgListId[i].pictureUrl) != -1) {
          imgId.push(this.imgListId[i].id)
        }
      }
      prams.pictureIds = imgId
      comment(prams).then(res => {
        uni.showToast({
          title: res.message,
          duration: 2000,
          icon: 'none'
        })
        if (res.code == 200) {
          if (this.commentType == 6) {
            console.log(2596164)
            this.$emit('restComment')
          }
          this.closed(2)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.header-box,
.header,
.box-bg {
  height: 46px;
}

.header {
  width: 100%;
}

.set-comment-box {
  width: 100vw;
  height: var(--vh);
  max-width: 480px;
  margin: auto;
  background: #f8f8f8;
}

.set-comment-box .from-box {
  padding: 0 16rpx;
  margin-top: 10rpx;
  background-color: #fff;
}

.set-comment-box .from-box .title {
  font-size: 28rpx;
  line-height: 70rpx;
  padding: 0 10rpx;
  border-bottom: 1px solid #e8e8e8;
}

.set-comment-box .from-box .content {
  border-bottom: 1px solid #e8e8e8;
  padding: 10rpx;
}

.set-comment-box .from-box .content .van-cell {
  padding: 0;
}

.van-cell {
  position: relative;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  color: #323233;
  font-size: 14px;
  line-height: 24px;
  background-color: #fff;
}

.van-field__value {
  overflow: visible;
}

.van-cell__value--alone {
  color: #323233;
  text-align: left;
}

.van-cell__value {
  position: relative;
  vertical-align: middle;
  word-wrap: break-word;
}

.van-cell__value {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
}

.van-field__body {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
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

.van-field__word-limit {
  margin-top: 4px;
  color: #646566;
  font-size: 12px;
  line-height: 16px;
  text-align: right;
}

.set-comment-box .from-box .uploader {
  padding: 20rpx 10rpx 20rpx 10rpx;
}

.set-comment-box .ft-btn {
  padding: 40rpx;
}

.action {
  background-color: #07c160;
  border-radius: 999px;
  font-size: 28rpx;
  height: 80rpx;
  line-height: 80rpx;
}</style>