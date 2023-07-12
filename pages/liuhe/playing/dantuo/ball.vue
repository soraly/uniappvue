<template>
  <view class="ball-list">
    <view v-for="(item, index) in ballChildren"
          :class="['ball-item', {selected: item.isSelected, disable: item.disable}]"
          :key="item.id" @click="onClickItem(item)" :style="setItemStyle(index,ballChildren.length)">
      <uni-row>
        <uni-col :span="24">
          <view class="left">
            <view class="mark">{{missOrMatchText(item)}}</view>
            <view class="num" :style="setBgColor(item.code,colorList)">{{item.name}}</view>
          </view>
        </uni-col>
      </uni-row>
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
    ball: {},
    dataIndex: {},
    missOrMatch: {
      type: String,
      default: "miss"
    },

    ballMaps:{
      type:Object,
      default:{}
    }

  },
  computed: {
    ...mapGetters(['orderList']),
    selectIds(){
      let selectedIds = this.orderList.length ? this.orderList[0].content.split(',').map(i => Number(i)) : [];
      return selectedIds;
    },

    selectedDan(){
      let count=0;
      if(!this.selectIds) return  0;
      for (let i in this.selectIds) {
        let id=this.selectIds[i];
        if(this.ballMaps[id].groupIndex==0){
          count++;
        }
      }
      return count;
    },
    selectedTuo(){
      return this.selectIds?(this.selectIds.length-this.selectedDan):0;
    }
  },
  data () {
    return {
      current:null,
      playing:new Playing(),
      colorList: uni.getStorageSync('lotteryStatus').colorList,
      currentArr:[],
    }
  },
  components: {UniCol, UniRow},
  watch:{
      orderList(){
      this.setDefaultSelected()
    }
  },
  mounted(){
    // console.log("aaaa", this.ballChildren)
    this.setDefaultSelected()
  },
  methods:{
    setDefaultSelected() {
      let _this=this;
      console.log("ball.vue setDefaultSelected:");
      //传入已选所有 ids
      let selectedIds =  this.orderList.length ? this.orderList[0].content.split(',').map(i => Number(i)) : [];
      this.currentArr = [];
      if(selectedIds.length === 0){
        this.ballChildren.forEach(child => {
          child.isSelected = false;
          child.disable = false;
          //this.$forceUpdate();
        })
      }
      this.ballChildren.forEach(child => {
        child.isSelected = selectedIds.includes(child.id);
        child.disable = false;
        if(_this.dataIndex==1){//判断为拖
          if(_this.checkCloseToDisplay(child)){
            child.disable = true;
          }else {
            child.isSelected&&this.currentArr.push(child.id)
          }
        }else
          child.isSelected&&this.currentArr.push(child.id)
      })


      this.$forceUpdate()
    },

    setItemStyle(index,len){
      if(index > len-10){
        return {
          width: "33.3%",
        }
      }else {
        return {
          width: "25%",
        }
      }
    },
    setBgColor (code,list) {
      let style = new Object();
      list.forEach(item=>{
        item.list.forEach(c=>{
          if(code === c.number){
            style = this.playing.setBg(c.color)
          }
        })
      })
      return style;
    },
    onClickItem(item){
      if (item.groupIndex!=0 && this.selectedDan<1) {
        return  uni.showToast({title:"请至少选择一个胆码",icon:"none"})
      }
      if (item.disable) return null;
        let removeId=-1;
        if(this.currentArr.indexOf(item.id)!=-1){
            removeId=item.id;
            this.currentArr.splice(this.currentArr.indexOf(item.id),1);
        }else {
            if(this.checkCodeReption(item)) return  console.warn("无法选择重复");
            this.currentArr = this.playing.setSelectedArr(this.currentArr, item);
        }


      if(this.currentArr.length > this.ball.maxNum){
        uni.showToast({
          title:this.ball.maxNumTips,
          icon:'none'
        })
        return
      }
      this.ballChildren.forEach(i=>{
        i.isSelected = this.currentArr.includes(i.id)
      })
      this.$forceUpdate()
      this.$emit('changeData', {ballChildren : this.ballChildren, dataIndex : this.dataIndex, selectedIds:this.currentArr,removeId:removeId, ball: this.ball,ballItem:item})
    },
      /**
       * 判断码是否重复
       * **/
      checkCodeReption(item){
          for (let i in this.selectIds){
            let id = this.selectIds[i];
            let betInfo = this.ballMaps[id];
            if(betInfo&&betInfo.code==item.code){
                return true;
            }
          }
          return false;
      },

      checkCloseToDisplay(info){
        if(info.parentBet&&this.selectIds.indexOf(info.parentBet.id)!=-1){
          return  true;
        }
        return false;
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
  //grid-template-columns: 197rpx 197rpx 197rpx;
   .ball-item{
    box-sizing: border-box;
    background: #DEEAFA;
    border: 1rpx solid #B5D4E6;
    box-shadow: inset 0px 4rpx 3rpx #FFFFFF;
    .left{
      position: relative;
      height: 110rpx;
      .mark{
        position: absolute;
        right: 8rpx;
        top: 8rpx;
        font-size: 20rpx;
        color: #8CB2C9;
      }
      .num{
        position: absolute;
        z-index: 2;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        line-height: 67rpx;
        text-align: center;
        width: 58rpx;
        height: 67rpx;
        color: #333333;
        font-size: 28rpx;
      }
    }
     &.selected{
       background: #0099CC;
       box-shadow: inset 0px 3rpx 2rpx rgba(0, 0, 0, 0.5);
     }
     &.disable {
       background: rgba(0,0,0,.1);
     }
  }

}

</style>
