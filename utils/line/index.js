import { apiLoginRequest } from "../request";

//线路列表数据
export const lineList = (prams) => {
    return apiLoginRequest({
        url: '/api/common/lineList',
        baseUrl: 1,
        method: 'GET',
        query: { ...prams }
    })
}