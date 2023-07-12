<template>
  <view class="picker-items">
    <view v-for="(item,index) in list" class="picker-slot picker-slot-center">
      <view class="picker-slot-wrapper" :style="{transform: 'translate(0, '+translateY[index]+'px)','transition-duration':duration+'ms'}">
        <view v-for="(val,key) in item" class="picker-item" style="height: 36px; line-height: 36px;">
          {{val}}
        </view>
      </view>
    </view>
    <view class="picker-center-highlight" style="height: 36px; margin-top: -18px;"></view>
  </view>
</template>

<script>
export default {
  name: "pickerItems",
  props:{
    list:{
      type:Array,
      default:[],
    },
    prize:{
      type:Array,
      default: [7,5,9]
    },
    type:{
      type:Number,
      default:1
    }
  },
  data(){
    return{
      translateY:[0,0,0],
      duration:0,
      num:6,
      timer:[null,null,null]
    }
  },
  methods:{
    startRoll:function (){
      this.list.forEach((item,index)=>{
        this.roll(item,index)
      })
    },
    stopRoll:function (index){
      console.log(index)
      if(index == 2) {
        console.log(1111)
        this.$emit('closeSx',this.type)
      }
    },
    roll:function (item,index){
      let i = -1;
      let key = 0;
      let totalCount = 0;
      this.timer[index] = setInterval(() => {
        //TODO
        if(this.num <= totalCount){
          key = i+2
          if(this.list[index][key] == this.prize[index]){
            this.stopRoll(index)
            clearInterval(this.timer[index])
            i++
            this.$set(this.translateY,index,i * -36);
          }else{
            i++
            this.$set(this.translateY,index,i * -36);
          }
        }else{
          if(i+1 >= this.list[index].length){
            i = -2
            totalCount++
          }else{
            i++
          }
          this.$set(this.translateY,index,i * -36);
        }
      }, 50);
    }
  }
}
</script>

<style lang="scss" scoped>
.picker-items{
  display: flex;
  justify-content: center;
  padding: 0;
  text-align: right;
  font-size: 48rpx;
  position: relative;
  height: 100%;
  .picker-slot {
    font-size: 36rpx;
    overflow: hidden;
    position: relative;
    max-height: 100%;
    text-align: center;
    flex: 1 1 0%;
    .picker-slot-wrapper{
      transition-duration: 0s;
      transition-timing-function: ease-out;
      backface-visibility: hidden;
      .picker-item {
        height: 72rpx;
        line-height: 72rpx;
        padding: 0 20rpx;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #fff;
        left: 0;
        top: 0;
        width: 100%;
        box-sizing: border-box;
        transition-duration: .3s;
        backface-visibility: hidden;
      }
      .picker-selected {
        transform: translateZ(0) rotateX(0);
      }
    }

  }
  .picker-center-highlight{
    box-sizing: border-box;
    position: absolute;
    left: 0;
    width: 100%;
    top: 50%;
    pointer-events: none;
    &::before,&::after{
      content: "";
      position: absolute;
      height: 2rpx;
      width: 100%;
      background-color: #eaeaea;
      display: block;
      z-index: 15;
      transform: scaleY(.5);
    }
    &::before {
      left: 0;
      top: 0;
      bottom: auto;
      right: auto;
    }
    &::after {
      left: 0;
      bottom: 0;
      right: auto;
      top: auto;
    }
  }
}
</style>