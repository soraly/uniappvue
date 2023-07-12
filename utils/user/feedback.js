import { apiResquest, apiLoginRequest } from "../request";

//意见反馈
export const feedback = (prams) => {
    return apiResquest({
        url: '/api/user/feedback',
        baseUrl: 1,
        method: 'POST',
        query: { ...prams }
    })
}

//用户反馈列表
export const feedbackList = (prams) => {
    return apiResquest({
        url: '/api/user/feedbackList',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}

//用户反馈详情
export const feedbackDetail = (prams) => {
    return apiResquest({
        url: '/api/user/feedbackDetail',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}