<template>
  <view class="feed">
    <ul class="forum-list">
      <li v-for="(item,index) in dataList" :key="index">
        <uni-row>
          <uni-col :span="20" class="van-col">
            <view class="content-jc">
              <span class="content-jc-name" v-if="item.type !=12">竞猜</span>
              <span class="csize">{{ item.title }}</span>
            </view>
            <view class="bsize" @click="detail(item)">
              <view class="text">
                <view class="van-ellipsis" v-for="(val,key) in item.descriptionList" :key="key">
                  {{ val }}
                </view>
              </view><!---->
            </view>
            <view class="footer">
              <image :src="item.headPic"></image>
              <span class="span">{{ item.username }}</span>
              <span>{{ item.createTime }}</span>
            </view>
            <view class="verify-status" v-if="!userId">
              <span class="error" v-if="item.status == 2">审核失败</span>
              <span class="error-text" v-if="item.status == 2" @click="lookRemark(item.remark)">查看原因</span>
              <span class="error" v-if="item.status == 0">审核中</span>
              <span class="open" v-if="item.status == 1">审核通过</span>
            </view>
          </uni-col>
        </uni-row>
      </li>
    </ul>
    <!--图片弹窗-->
    <cus-previewImg ref="cusPreviewImg" :list="ImgList"/>
    <uni-popup ref="tishi" type="dialog">
      <uni-popup-dialog type="info" mode="base" message="成功消息" :showCancel="false"
                        :okStyle="{color:'rgb(7, 193, 96)'}"
                        title="失败原因" :content="remark" :confirmText="'我知道了'"
      >

      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
import cusPreviewImg from '@/components/cus-previewImg/cus-previewImg.vue'

export default {
  name: "tujie",
  components: {cusPreviewImg},
  props: {
    userId:{
      type: String,
      default: ''
    },
    dataList: {
      type: Array,
      default: false
    }
  },
  data(){
    return{
      ImgList:[],
      remark:''
    }
  },
  methods:{
    //图片弹窗
    previewImg:function (imgList,url) { // 点击预览图片
      this.ImgList = imgList
      this.$refs.cusPreviewImg.open(url) // 传入当前选中的图片地址
    },
    //查看原因
    lookRemark:function (remark){
      this.remark = remark
      this.$refs.tishi.open()
    },
    //跳转
    detail:function (item){
      console.log(item)
      if(item.status == 1) {
        uni.navigateTo({
          url: '/pages/forum/detail?id=' + item.articleId + '&type=' + item.type,
          success: function (res) {
            res.eventChannel.emit('argParams', {
              lotteryType: item.lotteryType
            })
          }
        })
      }else{
        uni.navigateTo({
          url: '/pages/user/homepage/detail?id=' + item.articleId + '&type=' + item.type,
          success: function (res) {
            res.eventChannel.emit('argParams', {
              lotteryType: item.lotteryType
            })
          }
        })
      }
    },
    lotteryName:function (lotteryId){
      let lotteryName = ''
      this.navList.forEach((item,index)=>{
        if(item.lotteryType == lotteryId){
          lotteryName = item.name
          return
        }
      })
      return lotteryName
    },
  }
}
</script>

<style lang="scss" scoped>
.forum-list {
  li{
    padding: 20rpx 20rpx;
    background-color: #fff;
    margin-bottom: 20rpx;
    border: 2rpx solid #eee;
    .van-col {
      box-sizing: border-box;
      min-height: 1px;
      margin-left: 3px;
    }
    .van-ellipsis {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .content-jc{
      display: flex;
      align-items: center;
      .content-jc-name {
        background: #07c160;
        font-size: 24rpx;
        color: #fff;
        border-radius: 10rpx;
        padding: 6rpx 10rpx;
        margin-right: 4rpx;
        height: 26rpx;
        line-height: 26rpx;
      }
      .csize {
        color: red;
        font-size: 32rpx;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        display: -webkit-box;
      }
    }
    .bsize {
      font-size: 36rpx;
      padding: 20rpx 0;
      display: block;
      font-size: 18px;
      color: #999;
      .text {
        font-size: 26rpx;
        line-height: 40rpx;
        padding: 0 20rpx;
        margin-bottom: 10rpx;
      }
    }
    .footer {
      display: flex;
      font-size: 26rpx;
      align-items: center;
      color: #ccc;
      image{
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
      }
      .span {
        border-right: 2rpx solid;
        margin: 8rpx;
        padding-right: 8rpx;
      }
    }
    .verify-status{
      padding: 10rpx;
      .error {
        width: 140rpx;
        height: 44rpx;
        background: #ccc;
        color: #666;
        display: inline-block;
        line-height: 44rpx;
        text-align: center;
        font-size: 24rpx;
        border-radius: 22rpx;
      }
      .open{
        width: 140rpx;
        height: 44rpx;
        background: #cef2e0;
        border-radius: 22rpx;
        color: #07c160;
        display: inline-block;
        line-height: 44rpx;
        text-align: center;
        font-size: 24rpx;
      }
    }
  }
}
</style>