import  liuheSelector from "./LiuheTemplateSelector.js";
import  airshipSelector from "./AirshipTemplateSelector.js";
import  kuaisanSelector from "./KuaisanTemplateSelector.js";
import  eleventoutfiveSelector from "./ElevenOutOfFiveSelector.js";
import  shishicaiSelector from "./ShishicaiTemplateSelector.js";
import  luckytwentySelector from "./LuckyTwentyTemplateSelector.js";
import  pceggSelector from "./PcEggTemplateSelector.js";
import  {config} from "../config.js"

/**
 * 按照游戏id查找彩票玩法简易模板信息
 * 不要在单独彩票中引用：避免单页面加载引入JS过大 彩票页面中单独引入上分单独JS 提高加载效率
 */
export default {

    memMap:{},

    getMiniplayTemplate(lotteryId){
        let typeId = config.configLotties.getLotteryTypeByLotteryId(lotteryId);
        console.log("getMiniplayTemplate",typeId)
        let selectors=[liuheSelector,airshipSelector,kuaisanSelector,eleventoutfiveSelector,shishicaiSelector,luckytwentySelector,pceggSelector];
        let selector=null;
        if(this.memMap[typeId]) selector=this.memMap[typeId];
        else {
            for (let i in selectors){
                let _s = selectors[i];
                if(_s.lotteryTypeId==typeId){
                    selector=_s;
                    this.memMap[typeId]=_s;
                    break;
                }
            }
        }
        if(!selector) throw new Error("lotteryId 获取templateSelector对象失败")
        return selector.getMemeLotteryByLotteryId(lotteryId);
    }
}