import {apiResquest} from "../request";
//活动任务-获取活动分类
export const types = (query) => {
    return apiResquest({
        url:'/api/activityTask/types',
        baseUrl:1,
        method:"GET",
        query:{...query}
    })
}
//活动任务列表
export const list = (query) => {
    return apiResquest({
        url:'/api/activityTask/list',
        baseUrl:1,
        method:"GET",
        query:{...query}
    })
}
//活动任务详情
export const details = (query) => {
    return apiResquest({
        url:'/api/activityTask/details',
        baseUrl:1,
        method:"GET",
        query:{...query}
    })
}
//活动任务领取
export const receive = (query) => {
    return apiResquest({
        url:'/api/activityTask/receive',
        baseUrl:1,
        method:"GET",
        query:{...query}
    })
}
//活动任务-一键领取
export const receiveAll = (query) => {
    return apiResquest({
        url:'/api/activityTask/receiveAll',
        baseUrl:1,
        method:"GET",
        query:{...query}
    })
}
//活动任务申请
export const apply = (query) => {
    return apiResquest({
        url:'/api/activityTask/apply',
        baseUrl:1,
        method:"GET",
        query:{...query}
    })
}
//领取记录
export const receiveRecord = (query) => {
    return apiResquest({
        url:'/api/activityTask/receiveRecords',
        baseUrl:1,
        method:"GET",
        query:{...query}
    })
}