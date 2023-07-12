<template>
  <view class="video-display-wrap" v-if="isRefresh">
    <video :src="src" :autoplay="true" controls="false"></video>
  </view>
</template>

<script>
export default {
  name: "live",
  props:{
    src:{
      type:String,
      default:'',
    }
  },
  data(){
   return{
     //视频播放器
     videoPlayer: null,
     //是否正在播放
     isPlaying: false,
     dp: {},
     isFlv:false,
     isRefresh:true
   }
  },
  mounted(){

  },
  methods:{
    //播放视频
    playVideo() {
      this.$emit('refreshVideo')
    },
  }
}
</script>

<style scoped>
.video-display-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.play-btn-icon {
  position: absolute !important;
  z-index: 998;
  width: 100rpx;
  height: 100rpx;
}
.video-mask {
  position: absolute;
  z-index: 998;
  width: 100%;
  height: 100%;
}
</style>