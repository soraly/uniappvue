//选用单模板形式再处理
import lottery_all from  "@/static/lotteryTemplate/airship/airship_all.json";

export default {

    lotteryTypeId:29,


    getMemeLotteryByLotteryId(id) {

         let template= Object.assign({},lottery_all).data;
        //TODO 再度优化预留 看当前游戏 用同一个模板
         let removed=[];
         for (let index in template){
             let parentInfo=template[index];
             parentInfo.isDefault=0;
             let ids=parentInfo.close?parentInfo.close.split(","):[];
             if(ids.indexOf(id.toString())!=-1){
                 removed.push(parentInfo);
                 continue;
             }
             parentInfo.children&&parentInfo.children.forEach(playSecond=>{
                 playSecond.children&&playSecond.children.forEach(playThree=>{
                     playThree.children&&playThree.children.forEach(ball=>{
                         ball['maxOdds']="1.99";
                         ball['odds']="1.99";
                         ball['miss']="0";
                         ball['match']="0";
                     })
                 });
             })
         }
         while (removed.length>0){
             let rm=removed.pop();
             let index=template.indexOf(rm);
             if(index!=-1){
                 template.splice(index,1);
             }
         }
        template&&template.length>0? (template[0].isDefault=1):(console.log("all info is closed"));

        return template;
    }

}