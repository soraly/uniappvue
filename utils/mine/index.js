import { apiLoginRequest } from "../request";

// 初始化数据
export const init = (prams) => {
    return apiLoginRequest({
        url: '/api/lottery/mine/init',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}