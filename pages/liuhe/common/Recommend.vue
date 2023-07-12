<template>
  <view class="tuijian-box">
    <uni-row>
      <uni-col class="tuijian-col" :span="11" v-for="(item,index) in data" :key="index">
        <image :src="item.icon"></image>
      </uni-col>
    </uni-row>
  </view>
</template>

<script>
import UniRow from "../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../uni_modules/uni-row/components/uni-col/uni-col";
export default {
  name: "Recommend",
  components: {UniCol, UniRow},
  props:{
    isShow:{
      type:Boolean,
      default:false
    },
    title:{
      type:String,
      default:''
    },
    data:{
      type:Array,
      default: function(){
        return []
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.tuijian-box{
  .tuijian-col{
    &:nth-child(2n){
      margin-left: 22rpx;
    }
    &:nth-child(2n+1){
      margin-left: 10rpx;
    }
    image{
      width: 100%;
      height: 177rpx;
    }
  }

}
</style>