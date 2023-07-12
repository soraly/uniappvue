<template>
  <scroll-view scroll-y="true" class="dan-tuo">
    <view class="tab">
      <view :class="currentType == item.id ? 'tab-item active' : 'tab-item'" v-for="item in playData.children"
        @click="onSelectedType(item)" :key="item.id">
        {{ item.name }}
      </view>
    </view>
    <!--    <view v-for="data in playData.children" ref="ani" mode-class="slide-left" :show="currentType == data.id">-->
    <view class="balls">
      <view v-for="(item, index) in ballList" :key="item.id">
        <view v-if="item.showType == 1">
          <view class="type-name">
            {{ currentName }}
            <image src="./../../../../static/img/liuhe/desc.png" @click="showRule(item)" />
          </view>
          <ball :missOrMatch="missOrMatch" ref="balssl" :ballChildren="item.children" :ball="item" :dataIndex="index"
            :ballMaps="mapBallIDToInfo" @changeData="changeChildren" />
        </view>
        <view v-if="item.showType == 2">
          <view class="type-name">
            {{ currentName }}
            <image src="./../../../../static/img/liuhe/desc.png" @click="showRule(item)" />
          </view>
          <text-ball :missOrMatch="missOrMatch" :ballChildren="item.children" :ball="item" :dataIndex="index"
            :ballMaps="mapBallIDToInfo" @changeData="changeChildren"></text-ball>
        </view>
        <view v-if="item.showType == 3">
          <view class="type-name">
            {{ currentName }}
            <image src="./../../../../static/img/liuhe/desc.png" @click="showRule(item)" />
          </view>
          <Zodiac :missOrMatch="missOrMatch" :ballChildren="item.children" :ball="item" :dataIndex="index"
            :ballMaps="mapBallIDToInfo" @changeData="changeChildren"></Zodiac>
        </view>
      </view>
    </view>
    <!--    </view>-->
  </scroll-view>
</template>

<script>
import Ball from "./ball";
import TextBall from "./text-ball";
import Zodiac from "./zodiac";
import {
  mapGetters
} from 'vuex';
import Playing from "../../../../utils/common/playing";
export default {
  name: "index",
  props: {
    playData: {
      default: () => {
        return {}
      },
      type: Object
    },
    missOrMatch: {
      type: String,
      default: "miss"
    }
  },
  components: {
    Ball,
    TextBall,
    Zodiac
  },
  watch: {
    selectIdsFromStoreOrder(v) {
      if (!v || v.length == 0) {
        this.ballSelects = [];
      }
    },
    selectedDan(v, o) {
      //胆数量发生变化 且所有胆选中为零 则清空订单数据
      if (v != o && !v) {
        console.log(this.currentBall)
        this.ballSelects = [];
        this.$store.dispatch('setOrderList', []);
      }
    }

  },
  computed: {
    ...mapGetters(['orderList']),
    selectIdsFromStoreOrder() {
      let selectedIds = this.orderList.length ? this.orderList[0].content.split(',').map(i => Number(i)) : [];
      return selectedIds;
    },
    selectedDan() {
      let count = 0;
      if (!this.selectIdsFromStoreOrder) return 0;
      for (let i in this.selectIdsFromStoreOrder) {
        let id = this.selectIdsFromStoreOrder[i];
        if (this.mapBallIDToInfo && this.mapBallIDToInfo[id] && this.mapBallIDToInfo[id].groupIndex == 0) {
          count++;
        }
      }
      return count;
    },
    selectedTuo() {
      return this.selectIdsFromStoreOrder ? (this.selectIdsFromStoreOrder.length - this.selectedDan) : 0;
    },
  },
  data() {
    return {
      currentName: "",
      zodiac: null,
      types: [],
      ballList: [],
      playing: new Playing(),
      currentType: null,
      shengxiaoList: [],
      weiShuList:[],
      selectedBall: [],
      ballSelects: [], //选择后球的id集合
      currentBallChildren: [], //合并的每种球
      currentBall: [], //单选点击每种球详情的集合
      currentDanSelectedIds: [],//胆码对应拖码的id集合
      currentTuoSelectedIds: [],//拖码的id集合
      mapBallIDToInfo: {},//梳理出来的{ "id":{xxx} }
      zodiacDanCount:[],//生肖胆码选中计数
      zodiacTuoCount:[],//生肖拖码选中计数
    }
  },
  mounted() {
    // 从存储获取彩票状态
    let lotteryStatus = this.playing.getStorage('lotteryStatus');
    this.shengxiaoList = lotteryStatus.shengxiaoList;
    this.weiShuList = lotteryStatus.weiShuList;
    this.onSelectedType(this.playData.children[0])
  },
  methods: {
    onSelectedType(item) {
      this.ballSelects = [];
      this.currentBallChildren = [];
      this.currentBall = [];
      this.currentType = item.id;
      this.currentName = item.children[0].name;
      this.ballList = item.children;
      this.freshChildMap()
      this.$store.dispatch('setOrderList', [])
      this.$emit('onSelectedType')
    },
    freshChildMap() {
      let _this = this;
      this.mapBallIDToInfo = {};
      let numMap = {};
      for (let i = 0; i < this.shengxiaoList.length; i++) {
        numMap[this.shengxiaoList[i].name] = this.shengxiaoList[i].list.concat();
      }
      let codeMap = {};
      for (let mapIndex in this.ballList) {
        this.ballList[mapIndex].children.forEach((item) => {
          let itemcode = item.code;
          codeMap[itemcode] = item;
        })
      }
      for (let animainName in numMap) {
        let numSetArray = numMap[animainName];
        let animalInfo = codeMap[animainName];
        animalInfo.childBets = [];
        numSetArray && numSetArray.forEach(function (info) {
          let numcode = info.number;
          let numInfo = codeMap[numcode];
          if (numInfo) {
            animalInfo.childBets.push(numInfo);
            numInfo.parentBet = animalInfo;
          }
        });
      }

      for (let cindex in this.ballList) {
        this.ballList[cindex].children.forEach((item) => {
          item.groupIndex = cindex;
          let itemcode = item.code;
          if (numMap[itemcode]) {
            item.childCodes = [];
            for (let codeIndex in numMap[itemcode]) {
              item.childCodes.push(numMap[itemcode][codeIndex]['number'])
            }
          }
          item.codeDiction = codeMap;
          _this.mapBallIDToInfo[item.id] = item;
        })
      }
    },


    showRule(item) {
      this.$emit('open', item)
    },
    onSeletedOne(num) {
      this.$refs.ball[num].onClickItem(num)
    },
    setArr(old, newArr) {
      old.forEach(o => {
        newArr.forEach(n => {
          if (o !== n) {
            o.push(n)
          }
        })
      })
    },
    //处理ball集合
    setBallArr(ball) {
      this.currentBall.push(ball);
      this.currentBall = this.playing.setArrObj(this.currentBall);
    },
    /**
     * 移除已选中并且重复点击的元素
     * @param removeId
     */
    removeBallSelectAfterClick(removeId) {
      if (removeId && removeId != -1 && this.ballSelects.indexOf(removeId) != -1) {
        this.ballSelects.splice(this.ballSelects.indexOf(removeId), 1);
      }
    },
    /**
     * 移除所有选中胆之后 被限制对于数字的index
     * @param removeId
     */
    removeBallSelectAfterDanSelected(ballInfo) {
      if (!this.ballSelects) return console.warn("ball selects not inited");
      if (ballInfo.groupIndex == "1") return;
      if (ballInfo.childBets) {
          for (let cindex in ballInfo.childBets) {
              let childBallInfo = ballInfo.childBets[cindex];
              let childBallId = childBallInfo.id;
              let childBallInSelectIndex = this.ballSelects.indexOf(childBallId);
              if (childBallInSelectIndex != -1) {
                  this.ballSelects.splice(childBallInSelectIndex, 1);
              }
          }
      }
        /**
         * 排除同CODE
          */
        let code = ballInfo.code;
        for (let l in this.ballSelects){
            let contrastBallId=this.ballSelects[l];
            let contrastBallInfo=this.mapBallIDToInfo[contrastBallId];
            if(contrastBallInfo&&contrastBallInfo.code==code){
               let contrastBallIdIndex=this.ballSelects.indexOf(contrastBallId);
                contrastBallIdIndex!=-1&&this.ballSelects.splice(contrastBallIdIndex, 1);
            }
        }

    },

    //处理尾数对应的号数
    setNumByWS(obj){
      this.weiShuList.map(item=>{
        if(item.name === obj.name){
          obj.weishu = item.list
        }
      })
      return obj;
    },
    changeChildren(dataObj) {
      let {
        ballChildren,
        dataIndex,
        selectedIds,
        removeId,
        ball,
        ballItem
      } = dataObj;
      let ballName = [];
      console.log("on view", selectedIds, ballItem)
      if (ballItem.groupIndex === "0" && ballItem.isSelected) {
        this.zodiacDanCount = this.zodiacDanCount.concat(ballItem.childCodes)
        if (ballItem.childBets) {
          let childIds = [];
          ballItem.childBets.forEach(item => {
            childIds.push(item.id)
          })
          this.currentDanSelectedIds = this.currentDanSelectedIds.concat(childIds);
        }
      } else if (ballItem.groupIndex === "1" && ballItem.isSelected) {
        if(ball.code === "lhcdtsxtws_ws"){
          ballItem.weishuList = this.setNumByWS(ballItem);
          this.zodiacTuoCount = this.zodiacTuoCount.concat(ballItem.weishu);
          console.log(this.zodiacTuoCount)
          this.currentTuoSelectedIds.push(ballItem.id);
        }else{
          this.zodiacTuoCount = this.zodiacTuoCount.concat(ballItem.childCodes)
          this.currentTuoSelectedIds.push(ballItem.id);
        }
      } else {
        this.currentDanSelectedIds = [];
        this.currentTuoSelectedIds = [];
      }
      //移除逻辑
      this.removeBallSelectAfterClick(removeId);
      this.removeBallSelectAfterDanSelected(ballItem);
      // //ball 2级 -- ballItem的父级
      // //ballItem 3级 页面显示的每一项
      // if(ball.showType === 3 && this.currentType === 1572){
      //   // console.log(ballItem,selectedIds,ball);
      //   let {name} = ballItem;
      //   let disableCodes = [], ableCodes = [];
      //   if (ballItem.isSelected) {
      //     disableCodes = this.shengxiaoList.find(i => i.name === name).list.map(i => i.number)
      //   } else {
      //     ableCodes = this.shengxiaoList.find(i => i.name === name).list.map(i => i.number)
      //   }
      //
      //   let { children } = this.ballList.find(i => i.showType === 1);
      //   children.forEach(i => {
      //     if (disableCodes.includes(i.code)) i.disable = true
      //     if (ableCodes.includes(i.code)) i.disable = false
      //   })
      //   //找出已选生肖name
      //   // ballName = ball.children.filter(i => i.isSelected).map(m => m.name);
      //   // console.log('ballids:',ballName);
      //   // let orderList = this.playing.setOrders(ball,selectedIds);
      //   // orderList[0].methodName = ballName.toString();
      //   // console.log(orderList);
      //   // this.$store.dispatch('setOrderList', orderList).then(()=> {
      //   //   // console.log(orderList, this.orderList)
      //   //   this.$forceUpdate()
      //   // })
      //   // this.$emit("selectedBall",dataObj)
      // }


      this.ballList.forEach(item => {
        // console.log(item.children);
        this.currentBallChildren = this.currentBallChildren.concat(item.children)
      })
      this.currentBallChildren = this.playing.setArrObj(this.currentBallChildren);
      this.setBallArr(ball);
      this.setBallSelects(selectedIds);
      let orderList = this.buildOrderList();
      this.$store.dispatch('setOrderList', orderList).then(() => {
        console.log(orderList, this.orderList)
      })
      dataObj.ballChildren = this.currentBallChildren;
      dataObj.selectedIds = this.ballSelects;
      if (ball.showType === 3) {
        return
      }
      this.$emit("selectedBall", dataObj)
    },
    //处理已选id集合
    setBallSelects(selectedIds) {
      this.ballSelects = this.ballSelects.concat(selectedIds);
      this.ballSelects = this.ballSelects.filter((item, index, array) => {
        return array.indexOf(item) === index
      })
      // console.log("ballSelects", this.ballSelects, this.currentBall);
      // return this.playing.setOrders(this.currentBall[0], this.ballSelects);
    },
    buildOrderList() {
      console.log("ballSelects", this.ballSelects, this.currentBall);
      let currentBall = this.currentBall[0];
      let orders = [];
      //单独拎出来 避免后续新增 或者不同方式间算法不一致的问题
      switch (currentBall.code) {
        //生肖拖数字
        case "lhcdtsxthm_sx":
          orders = this.buildOrderSXTH(currentBall, this.ballSelects);
          break;
        //生肖拖生肖
        case "lhcdtsxtsx_sx1":
          orders = this.buildOrderSXTSX(currentBall, this.ballSelects);
          break;
        //生肖拖位数
        case "lhcdtsxtws_sx":
          orders = this.buildOrderSXTWS(currentBall, this.ballSelects);
          break;
      }
      return orders;
    },
    buildOrderSXTH(ball, selectedIds) {
      console.log("this.currentDanSelectedIds:", this.currentDanSelectedIds.length, this.currentTuoSelectedIds.length)
      let orderList = [];
      if (ball.minNum === 1) {
        orderList = selectedIds.map(id => {
          return {
            "content": "",
            "methodName": ball.name,
            "mode": 1,
            "chaseNum": 3,
            "chaseStop": 0,
            "playId": id,
            "rebatePoint": 0,
            "stakeCount": 1,
            "totalPrice": 0,
            "unitPrice": 0,
            "code": ball.code,
          }
        })
      } else {
        orderList.push({
          "content": selectedIds.join(','),
          "methodName": ball.name,
          "mode": 1,
          "chaseNum": 0,
          "chaseStop": 1,
          "playId": selectedIds[0],
          "rebatePoint": 0,
          "stakeCount": this.currentDanSelectedIds.length * this.currentTuoSelectedIds.length,
          "totalPrice": 0,
          "unitPrice": 0,
          "code": ball.code,
        })
      }
      return orderList;
    },
    buildOrderSXTSX(ball, selectedIds) {
      let orderList = [];
      if (ball.minNum === 1) {
        orderList = selectedIds.map(id => {
          return {
            "content": "",
            "methodName": ball.name,
            "mode": 1,
            "chaseNum": 3,
            "chaseStop": 0,
            "playId": id,
            "rebatePoint": 0,
            "stakeCount": 1,
            "totalPrice": 0,
            "unitPrice": 0,
            "code": ball.code,
          }
        })
      } else {
        orderList.push({
          "content": selectedIds.join(','),
          "methodName": ball.name,
          "mode": 1,
          "chaseNum": 0,
          "chaseStop": 1,
          "playId": selectedIds[0],
          "rebatePoint": 0,
          "stakeCount":this.zodiacDanCount.length * this.zodiacTuoCount.length,
          "totalPrice": 0,
          "unitPrice": 0,
          "code": ball.code,
        })
      }
      return orderList;
    },
    buildOrderSXTWS(ball, selectedIds) {
      let orderList = [];
      if (ball.minNum === 1) {
        orderList = selectedIds.map(id => {
          return {
            "content": "",
            "methodName": ball.name,
            "mode": 1,
            "chaseNum": 3,
            "chaseStop": 0,
            "playId": id,
            "rebatePoint": 0,
            "stakeCount": 1,
            "totalPrice": 0,
            "unitPrice": 0,
            "code": ball.code,
          }
        })
      } else {
        orderList.push({
          "content": selectedIds.join(','),
          "methodName": ball.name,
          "mode": 1,
          "chaseNum": 0,
          "chaseStop": 1,
          "playId": selectedIds[0],
          "rebatePoint": 0,
          "stakeCount": this.zodiacDanCount.length * this.zodiacTuoCount.length,
          "totalPrice": 0,
          "unitPrice": 0,
          "code": ball.code,
        })
      }
      return orderList;
    }


  },

}
</script>

<style lang="scss" scoped>
.dan-tuo {
  height: 100%;

  .tab {
    display: flex;

    .tab-item {
      flex: 1;
      text-align: center;
      height: 56rpx;
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
    }
  }


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
</style>