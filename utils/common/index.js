import { apiResquest, apiRequest } from "../request";
//获取年列表
export const listYear = (query = {}) => {
    query.lotteryType = uni.getStorageSync('lotteryType') || 1
    return apiRequest({
        url: '/api/lottery/result/query/listYear',
        baseUrl: 1,
        method: 'GET',
        query: { ...query }
    })
}
//查询助手
export const doQuery = (query) => {
    query.lotteryType = uni.getStorageSync('lotteryType') || 1
    return apiRequest({
        url: '/api/lottery/result/query/assistant/list',
        baseUrl: 1,
        method: 'POST',
        query: { ...query }
    })
}
//彩票信息
export const lotteryDetail = (query) => {
    return apiResquest({
        url: '/unite49/h5/lottery/detail',
        method: "GET",
        query: { ...query },
    })
}
//获取验证码
export const getVCode = (query) => {
    return apiResquest({
        url: '/api/common/getVCode',
        baseUrl: 1,
        method: "POST",
        query: { ...query }
    })
}
//验证码验证
export const checkCode = (query) => {
    return apiResquest({
        url: '/api/common/checkCode',
        baseUrl: 1,
        method: "POST",
        query: { ...query }
    })
}
//注册接口
export const regAndLogin = (query) => {
    return apiResquest({
        url: '/api/common/regAndLogin',
        baseUrl: 1,
        method: "POST",
        query: { ...query }
    })
}
//六合彩注册
export const regAndLoginLiu = (query) => {
    return apiResquest({
        url: '/api/common/lottery/regAndLogin',
        baseUrl: 1,
        method: "POST",
        query: { ...query }
    })
}
//修改密码接口
export const findPwd = (query) => {
    return apiResquest({
        url: '/api/common/findPwd',
        baseUrl: 1,
        method: "POST",
        query: { ...query }
    })
}
//登录接口
export const login = (query) => {
    return apiResquest({
        url: '/api/common/login',
        baseUrl: 1,
        method: "POST",
        query: { ...query }
    })
}
//退出登录接口
export const logout = () => {
    return apiResquest({
        url: '/api/mine/setting/logout',
        baseUrl: 1,
        method: "POST",
        query: {}
    })
}
//设置资料
export const updateUser = (query) => {
    return apiResquest({
        url: '/api/user/updateUser',
        baseUrl: 1,
        method: "POST",
        query: { ...query }
    })
}

//轮播图
export const listSpreadByType = (query) => {
    return apiResquest({
        url: "/api/index/banner",
        baseUrl: 1,
        method: 'GET',
        query: { ...query },
    })
}
//广告
export const buttonInfo = (query) => {
    return apiResquest({
        url: "/api/common/advert/buttonInfo",
        baseUrl: 1,
        method: 'GET',
        query: { ...query },
    })
}
//公告
export const noticeList = (query) => {
    return apiResquest({
        url: "/api/index/noticeList",
        baseUrl: 1,
        method: 'GET',
        query: { ...query },
    })
}
//公告2
export const notice = (query) => {
    return apiResquest({
        url: "/api/notice",
        baseUrl: 1,
        method: 'GET',
        query: { ...query },
    })
}
//游戏大厅弹窗
export const pop = (query) => {
    return apiResquest({
        url: "/api/pop",
        baseUrl: 1,
        method: 'GET',
        query: { ...query },
    })
}
//网址大全
export const siteList = (query) => {
    return apiResquest({
        url: "/api/advert/siteList",
        baseUrl: 1,
        method: 'GET',
        query: { ...query },
    })
}
//担保平台
export const AdList = (query) => {
    return apiResquest({
        url: "/api/advert/guaranteeSiteList",
        baseUrl: 1,
        method: 'GET',
        query: { ...query },
    })
}
//获取配置文件
export const configs = (query) => {
    return apiResquest({
        url: "/api/common/config",
        baseUrl: 1,
        method: 'GET',
        query: { ...query },
    })
}
//获取广告接口
export const advertList = (query) => {
    return apiResquest({
        url: "/api/advert/advertList",
        baseUrl: 1,
        method: 'GET',
        query: { ...query },
    })
}
//试玩登录
export const demoLogin = (query) => {
    return apiResquest({
        url: "/api/common/demoLogin",
        baseUrl: 1,
        method: 'POST',
        query: { ...query },
    })
}
//站点配置
export const websiteConfig = (query) => {
    return apiResquest({
        url: "/api/common/websiteConfig",
        baseUrl: 1,
        method: 'GET',
        query: { ...query },
    })
}

