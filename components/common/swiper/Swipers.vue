<template>
  <uni-swiper-dot :info="listPicture" :current="current" field="content" mode="dot" :dotsStyles="{bottom:10,backgroundColor:'#ebedf0'}">
    <swiper autoplay="true" class="swiper-box" :style="styles" @change="change">
      <swiper-item v-for="(item ,index) in listPicture" :key="index">
        <view class="swiper-item">
          <image :src="item.imgPath"></image>
        </view>
      </swiper-item>
    </swiper>
  </uni-swiper-dot>
</template>

<script>
export default {
  name: "Swipers",
  props:{
    listPicture:{
      type:Array
    },
    styles:{
      type:String,
      default:'width: 100%;height: 150px;'
    }
  },
  data(){
    return{
      current:0,
    }
  }
}
</script>

<style scoped>

</style>