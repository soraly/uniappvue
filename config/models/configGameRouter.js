//游戏路径配置 避免在其它逻辑点一直去计算而且不好管理
//TODO 替换其它页面中出现的零散逻辑
export default {


    routeConfigs:{
        4:{route: '/pages/liuhe/liuhePlaying'},
        19:{route:'/pages/liuhe/elevenOutOfFive'},
        28:{route:'/pages/liuhe/kuaisan'},
        29:{route:'/pages/liuhe/airship'},
        30:{route:'/pages/liuhe/shishicai'},
        26:{route:'/pages/liuhe/pcEgg'},
        31:{route:'/pages/liuhe/luckyTwenty'},
        32:{route:'/pages/liuhe/luckyFarm'},
    },
    /**
     * 通过游戏类型获取游戏路由地址
     * @param lotteryType
     * @param isLive
     * @returns {string}
     */
    getJumpRouteByType(lotteryType,lotteryId,isLive){
        isLive = isLive?1:0;
        let gameInfo = this.routeConfigs[lotteryType];
        if(!gameInfo) throw new Error(`lotteryType = ${lotteryType} is undefind in routeConfigs dictionary`);
        let url = `${gameInfo.route}?id=${lotteryId}&isLive=${isLive}`
        console.log(url);
        return url;
    }

}