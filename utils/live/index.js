import {apiResquest,apiRequest} from "../request"
//直播获取
export const live = (query) => {
    console.log(query)
    return apiRequest({
        url:'/api/lottery/live',
        baseUrl:1,
        method:'GET',
        query:{...query}
    })
}
//获取年列表
export const listYear = (query) => {
    console.log(query)
    return apiRequest({
        url:'/api/lottery/video/listYear',
        baseUrl:1,
        method:'GET',
        query:{...query}
    })
}
//开奖回放接口
export const videoList = (query) => {
    console.log(query)
    return apiRequest({
        url:'/api/lottery/video/list',
        baseUrl:1,
        method:'GET',
        query:{...query}
    })
}
//历史期数
export const lastLotteryRecord = (query) => {
    return apiResquest({
        url:'/unite49/h5/index/lastLotteryRecord',
        method: 'GET',
        query:{...query}
    })
}
//详情信息
export const lotteryDetail = (query) => {
    return apiResquest({
        url:"",
        method:'GET',
        query:{...query}
    })
}