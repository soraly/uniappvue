<template>
  <view class="vant-swiper-body-mini">
    <view class="nice-text">
      {{adInfo.name}}就上
      <uni-link :showUnderLine="false" color="#fec72f" style="font-size: 24rpx" :href="adInfo.jumpUrl ? adInfo.jumpUrl : ''" text="">{{ adInfo.content }}</uni-link>
      特码55倍
      <label>
        <uni-link :showUnderLine="false" color="#07c160" style="font-size: 24rpx" class="adtext" :href="adInfo.jumpUrl ? adInfo.jumpUrl : ''" text="">
          点击立即投注
        </uni-link>
      </label>
    </view>
    <!--轮播图-->
    <uni-swiper-dot :info="listPicture" :current="current" field="content" mode="dot"
                    :dotsStyles="{bottom:10,backgroundColor:'rgb(235,237,240,0.7)',selectedBackgroundColor:'white',selectedBorder:'white'}">
      <swiper  @change="changeSwiper" autoplay="true" class="swiper-box" style="height: 280rpx">
        <swiper-item v-for="(item ,index) in listPicture" :key="index">
          <view class="swiper-item" :id="'content-wrap' + index" @click="">
            <image mode="widthFix" :src="item.img" style="width: 100%;" @click="openUrl(item)"/>
          </view>
        </swiper-item>
      </swiper>
    </uni-swiper-dot>
  </view>
</template>

<script>
import {advertList, buttonInfo} from '../../../utils/common/index.js'
export default {
  name: "Ad",
  props:{
    listPicture:{
      type:Array,
      default:[]
    }
  },
  data(){
    return{
      current: 0,
      //滑块的高度(单位px)
      swiperHeight: 160,
      adInfo:{}
    }
  },
  mounted(){
//动态设置swiper的高度
    this.buttonInfo();
  },
  methods: {
    //手动切换题目
    changeSwiper(e) {
      this.current = e.detail.current;
      //动态设置swiper的高度，使用nextTick延时设置
    },
    //广告
    buttonInfo:function (){
      let prams = {
        projectType:1,
        code:5,
      }
      advertList(prams).then(res=>{
        this.adInfo = res.result[0]
      }).catch(err=>{

      })
    },
    openUrl:function (item){
      openUrl(item)
    }
  },
}
</script>

<style scoped>
.interaction {
  position: relative;
}

.van-col--18 {
  width: 75%;
}

.interaction .tool-item {
  margin-right: 15px;
  color: #888;
  font-size: 13px;
}

.van-col--6 {
  width: 25%;
}
.vant-swiper-body-mini .nice-text {
  background-color: #07c160;
  padding: 30rpx 10rpx;
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
}
.nice-text span{
  color: #fec72f;
}
</style>