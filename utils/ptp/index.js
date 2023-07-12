
import { apiResquest, apiLoginRequest } from "../request";

// 推广赚钱教程图片
export const courseImage = (prams) => {
    return apiLoginRequest({
        url: '/api/agent/courseImage',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}

// 推广赚钱教程视频
export const courseVideo = (prams) => {
    return apiLoginRequest({
        url: '/api/agent/courseVideo',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}

// 返佣比例头部分类
export const getRateType = (prams) => {
    return apiLoginRequest({
        url: '/api/agent/getRateType',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}

// 根据所选返佣比例头部分类获取对应的返佣配置信息列表
export const getRateByType = (prams) => {
    return apiResquest({
        url: '/api/agent/getRateByType',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}

// 直属开户
export const underOpenAccount = (prams) => {
    return apiResquest({
        url: '/api/agent/underOpenAccount',
        baseUrl: 1,
        method: 'POST',
        query: { ...prams }
    })
}


// 直属开户用户首次登录修改密码
export const underOpenAccountUpdatePwd = (prams) => {
    return apiResquest({
        url: '/api/agent/underOpenAccountUpdatePwd',
        baseUrl: 1,
        method: 'POST',
        query: { ...prams }
    })
}

// 返佣比例-底部提示配置
export const getRateRemindConfig = (prams) => {
    return apiResquest({
        url: '/api/agent/getRateRemindConfig',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}

// 我的推广页面接口
export const myPromotion = (prams) => {
    return apiResquest({
        url: '/api/agent/myPromotion',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}