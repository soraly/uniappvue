<template>
    <view class="ball-list">
        <view :style="setStyle(index,ballChildren.length)" v-for="(item, index) in ballChildren"
              :class="item.isSelected === true ? 'ball-item selected' : 'ball-item'" :key="item.id"
              @click="onClickItem(item)">
            <uni-row>
                <uni-col :span="14">
                    <view class="left">
                        <view class="num">{{item.name}}</view>
                    </view>
                </uni-col>
                <uni-col :span="10">
                    <view class="right">
                        <view class="mark" name="mark-text-ball">{{missOrMatchText(item)}}</view>
                        <view class="num">
                            {{ item.odds }}
                        </view>
                    </view>
                </uni-col>
            </uni-row>
        </view>
    </view>
</template>

<script>
    import UniRow from "../../../../uni_modules/uni-row/components/uni-row/uni-row";
    import UniCol from "../../../../uni_modules/uni-row/components/uni-col/uni-col";
    import Playing from "../../../../utils/common/playing";
    import {mapGetters} from "vuex";

    export default {
        name: "index",
        props: {
            ballChildren: {
                type: Array,
                default: null,
            },
            ball: {},
            dataIndex: {},
            missOrMatch: {
                type: String,
                default: "miss"
            }
        },
        computed: {
            ...mapGetters(['orderList']),

        },
        data() {
            return {
                playing: new Playing(),
                currentArr: [],
            }
        },
        components: {UniCol, UniRow},
        watch: {
            orderList() {
                this.setDefaultSelected()
            }
        },
        mounted() {
            // //console.log("aaaa", this.ballChildren)
            this.setDefaultSelected()
        },
        methods: {
            setDefaultSelected() {
                //console.log("orderList:",this.orderList);
                let selectedIds = this.orderList.length ? this.orderList.map(i => i.playId) : []
                if (selectedIds.length === 0) {
                    this.currentArr = [];
                    this.ballChildren.forEach(child => {
                        child.isSelected = false;
                        this.$forceUpdate();
                    })
                    return;
                }
                this.ballChildren.forEach(child => {
                    child.isSelected = selectedIds.includes(child.id);
                })
                this.$forceUpdate()
            },
            onClickItem(item) {
                this.currentArr = this.playing.setSelectedArr(this.currentArr, item);
                this.ballChildren.forEach(i => {
                    i.isSelected = this.currentArr.includes(i.id)
                })
                this.$forceUpdate()
                this.$emit('changeData', {
                    ballChildren: this.ballChildren,
                    dataIndex: this.dataIndex,
                    selectedIds: this.currentArr,
                    ball: this.ball,
                    ballItem: item
                })
            },
            setStyle(index, len) {
                if (index < 3) {
                    return {
                        width: "33.3%",
                    }
                } else if (index > len - 4) {
                    return {
                        width: "33.3%",
                    }
                } else {
                    return {
                        width: "50%",
                    }
                }

            },
            missOrMatchText(item) {
                let attrKey = this.missOrMatch;
                return item[attrKey] || item[attrKey] === 0 ? item[attrKey] : "";
            },
        }
    }
</script>

<style lang="scss" scoped>
    .ball-list {
        display: flex;
        flex-wrap: wrap;

        .ball-item {
            box-sizing: border-box;
            background: #DEEAFA;
            border: 1rpx solid #B5D4E6;
            box-shadow: inset 0px 4rpx 3rpx #FFFFFF;

            .left {
                position: relative;
                width: 100%;
                height: 110rpx;
                display: flex;
                justify-content: center;
                align-items: center;

                .num {
                    //position: absolute;
                    //z-index: 2;
                    //left: 29rpx;
                    //top: 21rpx;
                    line-height: 67rpx;
                    text-align: center;
                    color: #03536e;
                    font-weight: 500;
                    font-size: 33rpx;
                }
            }

            .right {
                position: relative;
                width: 100%;
                height: 110rpx;

                .num {
                    line-height: 110rpx;
                    text-align: left;
                    color: #8CB2C9;
                    font-size: 28rpx;
                }

                .mark {
                    position: absolute;
                    right: 8rpx;
                    top: 8rpx;
                    font-size: 20rpx;
                    color: #8CB2C9;
                }
            }
        }

        .ball-item.selected {
            background: #0099CC;
            box-shadow: inset 0px 3rpx 2rpx rgba(0, 0, 0, 0.5);

            .left {
                .num {
                    color: #DEEAFA;
                }
            }

            .right {
                .num {
                    color: #DEEAFA;
                }

                .mark {
                    color: #DEEAFA;
                }
            }
        }
    }

</style>
