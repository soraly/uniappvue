import {apiResquest,apiRequest} from "../request";

//索引列表
export const loversNumber = (prams)=>{
    return apiResquest({
        url:'/unite49/h5/tool/loversNumber',
        method: 'GET',
        query: {...prams}
    })
}
//生肖卡牌
export const animalCard = (query)=>{
    query.lotteryType=uni.getStorageSync('lotteryType') || 1
    return apiRequest({
        url:'/api/lottery/result/tool/animalCard',
        baseUrl:1,
        method: 'POST',
        query: {...query}
    })
}
//摇一摇
export const shake = (query)=>{
    query.lotteryType=uni.getStorageSync('lotteryType') || 1
    return apiRequest({
        url:'/api/lottery/result/tool/shake',
        baseUrl:1,
        method: 'POST',
        query: {...query}
    })
}
//玄机锦囊
export const sinkBag = (prams)=>{
    return apiResquest({
        url:'/unite49/h5/tool/sinkBag',
        method: 'GET',
        query: {...prams}
    })
}
//获取年列表
export const listYear = (prams)=>{
    return apiResquest({
        url:'/unite49/h5/lottery/listYear',
        method: 'GET',
        query: {...prams}
    })
}
//玄机锦囊历史
export const listSinkBag = (prams)=>{
    return apiResquest({
        url:'/unite49/h5/tool/listSinkBag',
        method: 'GET',
        query: {...prams}
    })
}
//幸运摇奖
export const prizeWheel = (query)=>{
    query.lotteryType=uni.getStorageSync('lotteryType') || 1
    query.jpushId=Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000
    return apiRequest({
        url:'/api/lottery/result/tool/prizeWheel',
        baseUrl:1,
        method: 'POST',
        query: {...query}
    })
}
//波肖转盘
export const animalAndColorWheel = (query)=>{
    query.lotteryType=uni.getStorageSync('lotteryType') || 1
    return apiRequest({
        url:'/api/lottery/result/tool/animalAndColorWheel',
        baseUrl:1,
        method: 'POST',
        query: {...query}
    })
}
//天机测算
export const forecast = (query)=>{
    query.lotteryType=uni.getStorageSync('lotteryType') || 1
    return apiRequest({
        url:'/api/lottery/result/tool/forecast',
        baseUrl:1,
        method: 'POST',
        query: {...query}
    })
}