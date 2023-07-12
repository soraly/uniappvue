import { apiResquest, apiRequest, apiLoginRequest } from "../request";

//余额宝初始化数据
export const init = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/yeb/init',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
// 余额宝转出
export const rollOut = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/yeb/rollOut',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
// 获取可转入金额
export const getRollInAmount = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/yeb/getRollInAmount',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
// 余额宝转入
export const rollIn = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/yeb/rollIn',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
// 收益记录
export const profitList = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/yeb/profitList',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
// 收益统计
export const profitStat = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/yeb/profitStat',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
// 资金明细
export const yebDetail = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/yeb/yebDetail',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}
// 资金明细统计
export const yebDetailStat = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/yeb/yebDetailStat',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}