import {apiResquest, apiRequest, apiLoginRequest} from "../request";

//高手论坛列表
export const lastLotteryRecord = (prams)=>{
    return apiRequest({
        url:'/api/lottery/lastLotteryRecord',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}
//根据期号过期开奖结果
export const period = (prams)=>{
    return apiRequest({
        url:'/api/lottery/detail/period',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}
//最新期开奖结果(带预测)
export const lastLotteryRecordWithCalculate = (prams)=>{
    return apiRequest({
        url:'/api/lottery/lastLotteryRecordWithCalculate',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}
//开奖结果
export const search = (prams)=>{
    return apiRequest({
        url:'/api/lottery/search',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}
//开奖日期
export const listLotteryDate = (prams)=>{
    return apiRequest({
        url:'/api/lottery/listLotteryDate',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}
//开奖日期列表
export const lotteryTime = (prams)=>{
    return apiRequest({
        url:'/api/lottery/lotteryTime',
        baseUrl:1,
        method: 'GET',
        query: {...prams}
    })
}