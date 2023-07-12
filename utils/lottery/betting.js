import {apiResquest,apiRequest,apiLoginRequest} from "../request";

//注单列表
export const list = (prams)=>{
    return apiResquest({
        url:'/api/betting/list',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}
//注单详情
export const betOrderDetail = (prams)=>{
    return apiResquest({
        url:'/api/betting/info',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}
//投注下单
export const buyOrder = (prams)=>{
    return apiResquest({
        url:'/api/betting/betting',
        baseUrl:1,
        method: 'POST',
        query: {...prams}
    })
}
//撤单
export const cancel = (prams)=>{
    return apiResquest({
        url:'/api/betting/cancel',
        baseUrl:1,
        method: 'POST',
        query: {...prams}
    })
}
//近期开奖
export const getHistoryList = (prams)=>{
    return apiRequest({
        url:'/api/lottery/result/getHistoryList',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}

//玩法列表
export const getPlayList = (prams)=>{
    return apiRequest({
        url:'/api/lottery/play/list',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}
//获取简易版模板
export const getPlayMiniList = (prams)=>{
    return apiRequest({
        // url:'/api/lottery/play/minList',
        url:'/api/lottery/play/miniTypeList',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}

//获取头部开奖数据
export const getRewardsInfo = (prams)=>{
    return apiRequest({
        url:'/api/lottery/result/getMaxResult',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}
//获取彩票状态
export const getLotteryStat = (prams)=>{
    return apiRequest({
        url:'/api/lottery/stat/attrConstant',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}
//分类数据(样版2)
export const categories = (prams)=>{
    return apiRequest({
        url:'/api/lottery/shop/style2/categories',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}
//分类数据
export const categoryData = (prams) =>{
    return apiRequest({
        url:'/api/lottery/shop/v2/categoryData',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}
//分类数据
export const gameListByPlatformCateId = (prams) =>{
    return apiRequest({
        url:'/api/lottery/shop/v2/gameListByPlatformCateId',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}
//获取彩票状态
export const hot = (prams)=>{
    return apiRequest({
        url:'/api/lottery/shop/hot',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}
//获取彩票状态
export const lottery = (prams)=>{
    return apiRequest({
        url:'/api/lottery/shop/lottery',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}
//获取底部图片
export const bottomImages = (prams)=>{
    return apiRequest({
        url:'/api/lottery/shop/bottomImages',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}
//获取底部图片
export const showUserBalance = (prams)=>{
    return apiRequest({
        url:'/api/user/balance',
        // url:'/api/lottery/mine/balance',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}
//获取彩种列表
export const getLotteryList = (prams)=>{
    return apiRequest({
        url:'/api/lottery/list',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}

//获取聊天室参数信息
export const getChatRoomInfo = (prams)=>{
    return apiResquest({
        url:'/api/common/chatRoom/path',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}
