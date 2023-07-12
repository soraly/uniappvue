<template>
  <scroll-view scroll-y="true" class="zheng-ma-one-six">
    <view v-if="playData.code === 'xy8blma'">
      <scroll-view v-if="playData.code === 'xy8blma'" scroll-x="true" class="tab">
        <view :class="currentType == item.id ? 'tab-item active' : 'tab-item'" :style="setStyle(playData.children.length)" v-for="item in playData.children"
          @click="onSelectedType(item)" :key="item.id">
          {{ item.name }}
        </view>
      </scroll-view>
      <view>
        <view class="type-name">
          {{ currentName }}
          <image src="./../../../../static/img/liuhe/desc.png" @click="showTabRule" />
        </view>
        <view class="balls" v-if="ballList.length" >
          <ball ref="ball" :ball="ball" :ballChildren="ballList" @changeData="changeChildren" />
        </view>
      </view>
    </view>

    <view class="content-list" v-else>
      <view class="tab-item" v-for="data in playData.children" :key="data.id">
        <view class="balls">
          <view v-for="(item, index) in data.children" :key="item.id">
            <view v-if="item.showType == 1">
              <view class="type-name">
                {{ item.name }}
                <image src="./../../../../static/img/liuhe/desc.png" @click="showRule(item)" />
              </view>
              <ball ref="ball" :missOrMatch="missOrMatch" :ball="item" :ball-children="item.children"
                @changeData="changeChildren" />
            </view>
            <view v-if="item.showType == 2">
              <view class="type-name">
                {{ item.name }}
                <image src="./../../../../static/img/liuhe/desc.png" @click="showRule(item)" />
              </view>
              <text-ball :missOrMatch="missOrMatch" :ballChildren="item.children" :ball="item" :dataIndex="index"
                @changeData="changeChildren"></text-ball>
            </view>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import Ball from "./ball";
import TextBall from "./text-ball";
import { mapGetters } from 'vuex';
import Playing from "../../../../utils/common/playing";
export default {
  name: "index",
  props: {
    playData: {
      default: {},
      type: Object
    },
    missOrMatch: {
      type: String,
      default: "miss"
    }
  },
  computed: {
    ...mapGetters(['orderList'])
  },

  components: {
    Ball,
    TextBall
  },
  data() {
    return {
      currentType: 2,
      currentName: "",
      currentItem:null,
      zodiac: null,
      colorList: uni.getStorageSync('lotteryStatus').colorList,
      types: [],
      playing: new Playing(),
      ballList: [],
      helpStr: "",
      tipsStr: "",
      exampleStr: "",
      ball: {},
      currentDFBallItems: [],//两面的已选球集合（玩法相同的都用此集合）

      mapBallIDToInfo:{},
    }
  },
  watch: {
    playData(oldV, newV) {
      if (this.playData.code === 'xy8blma') {
        this.onSelectedType(this.playData.children[0])
      }
      // this.onSelectedType(newV.children[0])
    },
    orderList() {
      // console.log("orderList:", this.orderList, this.ballChildren, this.ball);
      if (this.orderList.length === 0) {
        this.reset()
      }
    }
  },
  mounted() {
    // console.log(">>>>>>>>>>>>>>",this.playData)
    // if(this.playData.code === 'sscbbdw'){
    //   this.onSelectedType(this.playData.children[0])
    // }
  },
  methods: {
    onSelectedType(item) {
      console.log("currentItem",item);
      this.currentType = item.id;
      this.currentName = item.name;
      this.currentItem = item;
      this.helpStr = item.children[0].helpStr;
      this.tipsStr = item.children[0].tipsStr;
      this.exampleStr = item.children[0].exampleStr;
      this.ball = item.children[0];
      this.ballList = item.children[0].children;
      this.currentDFBallItems=[];
      this.freshChildMap()
      this.$store.dispatch('setOrderList', [])
        this.$emit('onSelectedType')
    },
    freshChildMap() {
      let _this = this;
      this.mapBallIDToInfo = {};
      console.log("freshChildMap",this.currentItem);
      for (let playIndex in this.currentItem.children){
        let playInfo=this.currentItem.children[playIndex];

        let code=playInfo.code;
        let balls=playInfo.children;
        for (let ballIndex in balls){
          let ball=balls[ballIndex];
          ball['parentcode']=code;
          this.mapBallIDToInfo[ball.id]=ball;
        }
      }
    },


    reset() {
      this.currentDFBallItems=[];
    },

    setColorToNum(list, colorList) {
      let newList = list.filter(item =>
        colorList.some(i => item.name == i.number)
      )
    },
    setStyle(len){
      let width = "50%";
      if(len > 3){
        width = "283rpx"
      }else if(len == 2){
        width = "50%"
      }else{
        width = "33.3%"
      }
      return {width : width}
    },
    selectZodiacList(item) {
      this.zodiac = item.name;
    },

    showTabRule() {
      this.$emit('open', {
        exampleStr: this.exampleStr,
        helpStr: this.helpStr,
        tipsStr: this.tipsStr,
      })
    },

    showRule(item) {
      this.$emit('open', item)
    },

    onSeletedOne(num) {
      this.$refs.ball[num].onClickItem(num)
    },

    //从子组件传来的选择事件
    changeChildren(dataObj) {
      let code = this.playData.code;
      console.log("change code ",code);
      if(code=="11x5bzx"){
        this.updateZhiXuanOrder(dataObj);
      }else if(code=='xy8blma'){
        this.updatLianmaOrder(dataObj);
      } else {
        this.updateOneTypeOrder(dataObj);
      }
      this.$emit("selectedBall", dataObj)

    },
    //处理两面的选择方法，也可作为别的玩法使用（只要选择逻辑相同）
    updateOneTypeOrder(dataObj) {
      /**
       * ball是2级，是ballItem的上一级
       * ballItem是3级，就是每个球的Item。
       */
      let { ballChildren, dataIndex, selectedIds, ball, ballItem } = dataObj;
      ballItem.parentsName = ball.name;
      this.currentDFBallItems = this.pushObjectToArray(this.currentDFBallItems, ballItem);
      console.log("currentDFBallItems", ball, this.currentDFBallItems)

      let orderList = [];
      this.currentDFBallItems.forEach(item => {
        let obj = {
          "content": "",
          "methodName": item.parentsName,
          "name": item.name,
          "mode": 1,
          "chaseNum": 3,
          "chaseStop": 0,
          "playId": item.id,
          "rebatePoint": 0,
          "stakeCount": 1,
          "totalPrice": 0,
          "unitPrice": 0,
          "code": item.code,
        }
        orderList.push(obj)
      })
      this.$store.dispatch('setOrderList', orderList);
    },
    //处理直选
    updateZhiXuanOrder(dataObj){
      let { ballChildren, dataIndex, selectedIds, ball, ballItem } = dataObj;
      let orderList = [];
      //移除重复编码的球
      for (let checkindex in this.currentDFBallItems){
        let ball=this.currentDFBallItems[checkindex];
        //移除同名（数值） 且非被点击对象 （被点击对象从后续逻辑移除 实现取消选中）
        if(ball.name==ballItem.name&&ball!=ballItem){
          let index=this.currentDFBallItems.indexOf(ball);
          if(index!=-1) this.currentDFBallItems.splice(index,1);
        }
      }

      if(this.currentDFBallItems.indexOf(ballItem)==-1)
        this.currentDFBallItems = this.pushObjectToArray(this.currentDFBallItems, ballItem);
      else
        this.currentDFBallItems.splice(this.currentDFBallItems.indexOf(ballItem),1);

      let idgroup=[[],[],[]];
      let nameGroups=[[],[],[]]
      let ids=[];
      let names=[];
      for (let bIndex in this.currentDFBallItems){
        let _ball=this.currentDFBallItems[bIndex];
        let gindex=0;
        if(_ball.parentcode=='11x5bzxq2d'||_ball.parentcode=='11x5bzxq3d'){
          gindex=0;
        }
        if(_ball.parentcode=='11x5bzxq2t'||_ball.parentcode=='11x5bzxq3t'){
          gindex=1;
        }
        if(_ball.parentcode=='11x5bzxq3t2'){
          gindex=2;
        }
        idgroup[gindex].push(_ball.id);
        nameGroups[gindex].push(_ball.name);
        ids.push(_ball.id);
      }
      // 保证第一组第二组 第三组顺序显示
      names=nameGroups[0].concat(nameGroups[1]).concat(nameGroups[2]);
      let stakeCount=0;
      //前二直选倍率计算
      if(ballItem.parentcode=='11x5bzxq2d'||ballItem.parentcode=='11x5bzxq2t'){
         let balls1=nameGroups[0];
         let balls2=nameGroups[1];
        stakeCount = (balls1.length)*(balls2.length);
      }
      //前三直选倍率计算
      if(ballItem.parentcode=='11x5bzxq3d'||ballItem.parentcode=='11x5bzxq3t'||ballItem.parentcode=='11x5bzxq3t2'){
        let balls1=idgroup[0];
        let balls2=idgroup[1];
        let balls3=idgroup[2];
        stakeCount = (balls1.length)*(balls2.length)*(balls3.length);
      }
      let obj = {
        "content": ids.join(","),
        "methodName": this.currentName,
        "name": names.join(","),
        "unRnameFromBallChildren": true,
        "mode": 1,
        "chaseNum": 3,
        "chaseStop": 0,
        "playId": ids[0],
        "rebatePoint": 0,
        "stakeCount": stakeCount,
        "totalPrice": 0,
        "unitPrice": 0,
        "code": "",
      }
      orderList.push(obj);
      //TODO 待处理节点 这里组件处理了orderList 又传值到外面再一次处理orderList 挺混乱的
      this.$store.dispatch('setOrderList', orderList);
    },
    //处理连码
    updatLianmaOrder(dataObj){
      let { ballChildren, dataIndex, selectedIds, ball, ballItem } = dataObj;
      let orderList = [];
      ball.groupOrder=true;// 最少选择两个 不修改无法弹起订单界面 但是他是一组的形式 强行加逻辑点进去
      //移除重复编码的球
      let getNum=ball.minNum;
      if(this.currentDFBallItems.indexOf(ballItem)!=-1){
        let id=ballItem.id;
        let removeIndex=selectedIds.indexOf(id);
        let removeBallIndex= this.currentDFBallItems.indexOf(ballItem);
        removeIndex!=-1&&selectedIds.splice(removeIndex,1);
        removeBallIndex!=-1&&this.currentDFBallItems.splice(removeBallIndex,1);
      }else if(this.currentDFBallItems.length>=8){
        uni.showToast({
          title:"只能选择"+getNum+"到8个号码"
        })
        selectedIds.pop();
      }else
        this.currentDFBallItems = this.pushObjectToArray(this.currentDFBallItems, ballItem);
        let stakeCount=selectedIds.length>=getNum?1:0;
        let add=selectedIds.length-getNum;
        while (add>0){
          stakeCount+=(1+add);
          add--;
        }

      let obj = {
        "content": selectedIds.join(","),
        "methodName": this.currentName,
        "name": '',
        "name2": '',
        "mode": 1,
        "chaseNum": 3,
        "chaseStop": 0,
        "playId": selectedIds[0],
        "rebatePoint": 0,
        "stakeCount": stakeCount,
        "totalPrice": 0,
        "unitPrice": 0,
        "code": "",
      }
      orderList.push(obj);
      this.$store.dispatch('setOrderList', orderList);
    },


    //讲对象push到数组
    pushObjectToArray(array, object) {
      if (array.length === 0) {
        array.push(object);
      } else {
        // 检查是否存在相同 id 的对象
        const existingObjectIndex = array.findIndex((item) => item.id === object.id);

        if (existingObjectIndex !== -1) {
          // 如果存在相同 id 的对象，从数组中删除它
          array.splice(existingObjectIndex, 1);
        } else {
          // 将新对象添加到数组
          array.push(object);
        }
      }
      return array;
    },
  },
}
</script>

<style lang="scss" scoped>
.zheng-ma-one-six {
  height: 100%;

  .tab {
    display: flex;
    white-space: nowrap;
    width: 100%;

    .tab-item {
      width: 238rpx;
      text-align: center;
      height: 56rpx;
      display: inline-block;
      line-height: 56rpx;
      background: #CCDBEE;
      border-width: 0px 1rpx 2rpx 1rpx;
      border-style: solid;
      border-color: #B5D4E6;
      /*box-shadow: inset 0px 4rpx 4rpx #FFFFFF;*/
      color: #458198;
      font-size: 30rpx;
    }

    .tab-item.active {
      background: linear-gradient(180deg, #4E60AE 0%, #318EB9 100%);
      color: #BAE8FA;
      border-width: 0 0 2rpx 2rpx;
      border-style: solid;
      border-color: #B5D4E6;
      box-shadow: inset 0 3rpx 2rpx rgba(0, 0, 0, 0.5);
    }
  }

  .type-name {
    height: 70rpx;
    line-height: 70rpx;
    color: #8CB2C9;
    font-size: 34rpx;
    text-align: center;
    background: #CCDBEE;
    border: 1rpx solid #B5D4E6;
    box-shadow: inset 0px 2rpx 2rpx #CCCCCC;
    display: flex;
    align-items: center;
    justify-content: center;

    image {
      width: 34rpx;
      height: 34rpx;
      margin-left: 22rpx;
    }
  }

  .content-list {
    .tab-item {
      .balls {
        .type-name {
          height: 70rpx;
          line-height: 70rpx;
          color: #8CB2C9;
          font-size: 34rpx;
          text-align: center;
          background: #CCDBEE;
          border: 1rpx solid #B5D4E6;
          box-shadow: inset 0px 2rpx 2rpx #CCCCCC;
          display: flex;
          align-items: center;
          justify-content: center;

          image {
            width: 34rpx;
            height: 34rpx;
            margin-left: 22rpx;
          }
        }
      }
    }
  }



}
</style>
