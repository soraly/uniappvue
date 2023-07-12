import { apiResquest } from '../request.js'

//POST 请求案例

export const login = (query) => {
    return apiResquest({
        url: '/unite49/h5/index/lotteryTime',
        method: 'POST',
        query: {...query}
    })
}

//GET 请求案例可以传递参数也可以不传递
export const home  = (query) => {
    return apiResquest({
        url: '/api/index/uniteInfo',
        baseUrl:1,
        method: 'GET',
        query: {...query}
    })
}
//首页加载列表
export const list = (query) => {
    return apiResquest({
        url:'/api/index/listPicture',
        baseUrl:1,
        method:'GET',
        query: {...query}
    })
}
//首页弹窗数据
export const popu = (query) => {
    return apiResquest({
        url:'/api/index/pop',
        baseUrl:1,
        method:'GET',
        query: {...query}
    })
}