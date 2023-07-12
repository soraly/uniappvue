<template>
    <Tabbar :current.sync="current" :barList="barList" activeColor="#01B558" bgColor="#9bf7c8" />
</template>

<script>
import Tabbar from '@/components/Tabbar/PagesTabbar'
export default {
    components: {
        Tabbar,
    },
    props: {
        current: {
            type: Number | String,
            default: () => {
                return 0
            }
        },
    },
    data() {
        return {
            barList: [
                {
                    path: '/pages/pages-luntan/index',
                    component: 'Home',
                    name: '六合图库',
                    img: '/static/imgs-luntan/tabbar/Home.png',
                    selectedImg: '/static/imgs-luntan/tabbar/selectedHome.png'
                },
                {
                    path: '/pages/pages-luntan/taoliao',
                    component: 'Taoliao',
                    name: '淘料',
                    img: '/static/imgs-luntan/tabbar/Taoliao.png',
                    selectedImg: '/static/imgs-luntan/tabbar/selectedTaoliao.png'
                },
                {
                    path: '/pages/pages-luntan/found',
                    component: 'Found',
                    name: '发现',
                    img: '/static/imgs-luntan/tabbar/Found.png',
                    selectedImg: '/static/imgs-luntan/tabbar/selectedFound.png'
                },
                {
                    path: '/pages/pages-luntan/my',
                    component: 'My',
                    name: '我的',
                    img: '/static/imgs-luntan/tabbar/My.png',
                    selectedImg: '/static/imgs-luntan/tabbar/selectedMy.png'
                },
            ]
        }
    },
}
</script>
<style lang="scss" scoped></style>