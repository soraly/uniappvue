<template>
  <view class="ball-list">
    <view :style="setStyle(index,ballChildren.length)" v-for="(item, index) in ballChildren" :class="item.isSelected === true ? 'ball-item selected' : 'ball-item'" :key="item.id" @click="onClickItem(item)">
      <view class="box">
          <view class="left">
            <view class="num">{{item.name}}</view>
          </view>
          <view class="right">
            <view class="num">
              {{ item.odds }}
            </view>
          </view>
      </view>
      <view class="mark">{{missOrMatchText(item)}}</view>
    </view>
  </view>
</template>

<script>
import UniRow from "../../../../uni_modules/uni-row/components/uni-row/uni-row";
import UniCol from "../../../../uni_modules/uni-row/components/uni-col/uni-col";
import Playing from "../../../../utils/common/playing";
import {mapGetters} from "vuex";

export default {
  name: "index",
  props:{
    ballChildren:{
      type : Array,
      default: null,
    },
    threeCellText:{
      type : Boolean,
      default: false,
    },
    ball: {},
    dataIndex: {},
      missOrMatch: {
          type: String,
          default: "miss"
      }
  },
  data () {
    return {
      playing:new Playing(),
      currentArr:[],
    }
  },
  computed: {
    ...mapGetters(['orderList'])
  },
  components: {UniCol, UniRow},
  watch:{
    orderList(){
      this.setDefaultSelected()
    }
  },
  mounted(){
    this.setDefaultSelected()
  },
  methods:{
    setDefaultSelected() {
      // console.log("orderList:",this.orderList);
      let selectedIds = this.orderList.length ? this.orderList.map(i => i.playId) : []
      // console.log("selectedIds:",selectedIds);
      if(selectedIds.length === 0){
        this.currentArr = [];
        this.ballChildren.forEach(child => {
          child.isSelected = false;
          this.$forceUpdate();
        })
        // return;
      }
      this.ballChildren.forEach(child => {
        child.isSelected = selectedIds.includes(child.id);
      })
      this.$forceUpdate()
    },

    onClickItem(item){
      // console.log(item);
      this.currentArr = this.playing.setSelectedArr(this.currentArr, item);
      // console.log(this.currentArr);
      this.ballChildren.forEach(i=>{
        i.isSelected = this.currentArr.includes(i.id)
      })
      this.$forceUpdate()
      // console.log("this.ballChildren",this.ballChildren);
      this.$emit('changeData', {ballChildren : this.ballChildren, dataIndex : this.dataIndex, selectedIds:this.currentArr, ball: this.ball,ballItem:item})
    },

    setStyle(index,len){
      let defaultWidth="50%";
      console.log(index, len, 'nnn')
      if(len<=5){
          if(len%2!=0 && index==len-1){
              defaultWidth = "100%";
          }
      }else if(len%2!=0 && index >= len - 3) {
          defaultWidth = "33.3%"
      }
      return {width:defaultWidth};

    },

    missOrMatchText(item) {
        let attrKey = this.missOrMatch;
        return item[attrKey] || item[attrKey] === 0 ? item[attrKey] : "";
    },
  }
}
</script>

<style lang="scss" scoped>
.ball-list{
  display: flex;
  flex-wrap:wrap;
   .ball-item{
     position: relative;
    box-sizing: border-box;
    background: #DEEAFA;
    border: 1rpx solid #B5D4E6;
    box-shadow: inset 0px 4rpx 3rpx #FFFFFF;
     display: flex;
     justify-content: center;
     align-items: center;
     .box{
       display: flex;
       .left{
         position: relative;
         width: 100%;
         height: 110rpx;
         margin-right: 20rpx;
         white-space: nowrap;
         .num{
           line-height: 110rpx;
           text-align: center;
           height: 110rpx;
           color: #03536e;
           font-weight: 500;
           font-size: 38rpx;
         }
       }
       .right{
         position: relative;
         width: 100%;
         height: 110rpx;
         .num{
           line-height: 110rpx;
           text-align: center;
           color: #8CB2C9;
           font-size: 28rpx;
         }
       }
     }

     .mark{
       position: absolute;
       right: 8rpx;
       top: 8rpx;
       font-size: 20rpx;
       color: #8CB2C9;
     }
  }
  .ball-item.selected{
    background: #0099CC;
    box-shadow: inset 0px 3rpx 2rpx rgba(0, 0, 0, 0.5);
    .left{
      .num{
        color: #DEEAFA;
      }
    }
    .right{
      .num{
        color: #DEEAFA;
      }
      .mark{
        color: #DEEAFA;
      }
    }
  }
}

</style>
