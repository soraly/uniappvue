import {
    getPlayMiniList,
} from "@/utils/lottery/betting";
export default {

    lotteryTypeIncludeIdsMap:{
        4:[48,50,55,56,57,64,66,69,72,73,75],
        19:[79,77,36],
        26:[80],
        28:[54,68,37],
        29:[62,63,65,71,76,53],
        30:[61,70,74],
        31:[78],
    },
    memLotteryIdToType:{},


    //预留初始化内容信息
    init(){
      this.initAsync();
    },
    //阻塞式初始化预留
    initAsync(){
        return new Promise((resolve)=>{

            resolve();
        })
    },
    /**
     * 通过lotteryId 获取lotteryTypeId
     * @param lotteryId
     * @returns {string|*}
     */
    getLotteryTypeByLotteryId(lotteryId){
        if(this.memLotteryIdToType[lotteryId]) return this.memLotteryIdToType[lotteryId];
        for (let lotteryType in this.lotteryTypeIncludeIdsMap){
            let ids=this.lotteryTypeIncludeIdsMap[lotteryType];
            if(ids.indexOf(lotteryId)!=-1){
                this.memLotteryIdToType[lotteryId]=lotteryType;
                return  lotteryType;
            }
        }
    },
    /**
     * 打印所有日志信息
     */
    printAllMiniPlaylist(){
        // var printOne=function (id,type=1) {
        //     console.log("showTyep",type);
        //     getPlayMiniList({lotteryId:id}).then(res=>{
        //       if (res.code === 200) {
        //         console.group(type);
        //         console.log(`${type} game  play mini list`,JSON.stringify(res.result));
        //         console.groupEnd();
        //       }
        //     });
        // }
        // printOne(77,19)

    }

}