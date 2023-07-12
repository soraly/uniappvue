import {apiResquest} from "../request";

//用户VIP等级说明
export const vipInfo = (query)=>{
    return apiResquest({
        url:'/api/user/vip/info',
        baseUrl:1,
        method:'GET',
        query:{...query},
    })
}

//用户VIP进度
export const vipSpeed = (query)=>{
    return apiResquest({
        url:'/api/user/vip/speed',
        baseUrl:1,
        method:'GET',
        query:{...query},
    })
}

//用户VIP确认升级
export const vipUpgrade = (query)=>{
    return apiResquest({
        url:'/api/user/vip/confirmUpgrade',
        baseUrl:1,
        method:'GET',
        query:{...query},
    })
}