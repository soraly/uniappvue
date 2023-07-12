<template>
    <view class="mi-pai" v-if="isShowMiPai">
        <view class="back"></view>
        <view class="mi-pai-content">
            <view class="yours">
                <view class="yours-title">
                    <view class="title">你的注单</view>
                    <view class="term">{{ `第${headInfo.shorNo ? headInfo.shorNo : ''}期` }}</view>
                </view>
                <view class="your-betting">
                    <scroll-view scroll-y class="list" v-if="yourBettingList.length > 0">
                        <view class="list-item" :key="index" v-for="(item, index) in yourBettingList">
                            <view class="play">{{ item.secondPlayName }}@{{ item.betValue }}</view>
                            <view class="amount">{{ setAmount(item.betAmount) }}</view>
                        </view>
                    </scroll-view>
                    <view class="no-betting" v-else>本期未下注</view>
                </view>
            </view>
            <view class="result-title">
                <view class="title">开奖结果</view>
                <view class="term">{{ `第${headInfo.shorNo ? headInfo.shorNo : ''}期` }}</view>
            </view>
            <view class="result-box">
                <view class="number-list" v-show="readyState">
                    <view class="list">
                        <view class="number-list-item" :key="key" v-for="(item, key) in this.headInfo.lotteryResult.split(',')">
                        {{ item }}
                        </view>
                    </view>
                </view>
                <canvas :style="{ 'width': width + 'px', 'height': height + 'px' }" canvas-id="myCanvas" id="myCanvas"
                    @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove" @mousedown="mouseStart"
                    @mouseup="mouseEnd" @mousemove="mouseMove" @error="canvasIdErrorCallback"></canvas>

            </view>
            <view class="modal-close" @click="closeMiPai"></view>
            <text class="auto-close-label" v-if="autoCloseTime > 0">{{ Math.ceil(stayTime / 1000) }}秒后自动关闭</text>
        </view>
    </view>
</template>
<script>
import Playing from '../../../utils/common/playing';

export default {
    name: "MiPai",
    props: {
        headInfo: {},
        isShowMiPai: {},
        yourBettingList: {},
        //@mrz 新增参数 如果当前咪牌配置此参数大于0毫秒 则会在 autoClose 毫秒后关闭
        autoCloseTime: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            width: 320,
            height: 117,
            playing: new Playing(),
            disabled: false, // 是否禁止刮卡
            readyState: false, // 是否开始绘制
            endState: false, // 结束刮卡状态

            watermark: '刮一刮', // 水印文字
            watermarkColor: '#c5c5c5', // 水印文字颜色
            watermarkSize: 14, // 水印文字大小

            titleColor: '#888', // 提示文字颜色
            titleSize: 24, // 提示文字大小

            startX: 0, // 触摸x轴位置
            startY: 0, // 触摸y轴位置
            touchSize: 20, // 触摸画笔大小
            percentage: 50, // 刮开百分之多少的时候开奖

            stayTime: 0,
            stayTimer: -1,

            canUseTouch: false,
            mouseInDown: false,
            myCanvasBoundData: null,
        }
    },
    methods: {
        setAmount(num) {
            return this.playing.setAmount(num, 2, '.', ',')
        },
        closeMiPai() {
            this.$emit("closeMiPai")
            clearInterval(this.stayTimer);
        },
        init() {
            console.log("mipai init");
            this.$nextTick(() => {
                let content = uni.createSelectorQuery().select(".result-box");
                content.boundingClientRect((data) => {
                    console.log(data);
                    this.width = data.width;
                    this.height = data.height;
                    this.ctx = uni.createCanvasContext('myCanvas', this);
                    setTimeout(e => {
                        this.initCanvas();
                    }, 20);
                }).exec()
            })
            if (this.autoCloseTime > 0) {
                this.startRunAutoClose();
            }
        },
        initCanvas() {
            this.endState = false;
            this.readyState = false;
            this.ctx.clearRect(0, 0, this.width, this.height); // 清除画布上在该矩形区域内的内容(x,y,宽，高)。
            this.ctx.setFillStyle('#ddd'); // 填充颜色
            this.ctx.fillRect(0, 0, this.width, this.height); // 填充区域（x,y,宽,高）


            /**
             * 绘制文字水印
             */
            let width = this.watermark.length * this.watermarkSize;
            this.ctx.save(); // 保存当前的绘图上下文。
            this.ctx.rotate(-10 * Math.PI / 180); // 以原点为中心，原点可以用 translate方法修改。顺时针旋转当前坐标轴。多次调用rotate，旋转的角度会叠加。
            let x = 0;
            let y = 0;
            let i = 0;
            while ((x <= this.width * 5 || y <= this.height * 5) && i < 300) {
                this.ctx.setFillStyle(this.watermarkColor); // 填充颜色
                this.ctx.setFontSize(this.watermarkSize); // 设置字体的字号
                this.ctx.fillText(this.watermark, x, y); // 填充的文本（文字，x，y）
                x += width + width * 1.6;
                if (x > this.width && y <= this.height) {
                    x = -Math.random() * 100;
                    y += this.watermarkSize * 3;
                }
                i++;
            }
            this.ctx.restore(); // 恢复之前保存的绘图上下文。

            /**
             * 绘制标题
             */
            this.ctx.setTextAlign("center"); // 用于设置文字的对齐
            this.ctx.setTextBaseline("middle"); // 用于设置文字的水平对齐
            this.ctx.setFillStyle(this.titleColor); // 填充颜色
            this.ctx.setFontSize(this.titleSize); // 设置字体的字号
            this.ctx.fillText("刮开涂层", this.width / 2, this.height / 2); // 填充的文本（文字，x，y）

            this.ctx.draw(); // 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中。
            this.readyState = true; // 完成绘制
        },
        // 手指触摸动作开始
        touchstart(e, from = "sys") {
            if (from == "sys") {
                this.canUseTouch = true;
            }
            if (this.disabled || this.endState) {
                return;
            }
            this.startX = e.touches[0].x;
            this.startY = e.touches[0].y;
        },
        //兼容mouse事件 如果touch失效 则使用mouse事件
        mouseStart(e) {
            let _this = this;
            if (this.canUseTouch) return;
            this.mouseInDown = true;
            if (this.myCanvasBoundData) {
                this.touchstart({ touches: [{ x: e.clientX - this.myCanvasBoundData.left, y: e.clientY - this.myCanvasBoundData.top }] }, "mouse");
            } else {
                let content = uni.createSelectorQuery().select("#myCanvas");
                content.boundingClientRect((data) => {
                    if (data) {
                        _this.myCanvasBoundData = data;
                        _this.touchstart({ touches: [{ x: e.clientX - _this.myCanvasBoundData.left, y: e.clientY - _this.myCanvasBoundData.top }] }, "mouse");
                    }
                }).exec()
            }
        },


        // 手指触摸后移动
        touchmove(e, from = "sys") {
            // console.log("touchMove",e.touches[0].x,e.touches[0].y,from);
            if (this.disabled || this.endState) {
                return;
            }
            this.ctx.clearRect(this.startX, this.startY, this.touchSize, this.touchSize); // 清除画布上在该矩形区域内的内容(x,y,宽，高)。
            this.ctx.draw(true); // false:本次绘制是否接着上一次绘制，true:保留当前画布上的内容
            //记录移动点位
            this.startX = e.touches[0].x;
            this.startY = e.touches[0].y;
        },

        //兼容mouse事件 如果touch失效 则使用mouse事件 doMove
        mouseMove(e) {
            let _this = this;
            if (this.canUseTouch) return;
            if (this.mouseInDown != true) return;
            if (this.myCanvasBoundData) {
                this.touchmove({ touches: [{ x: e.clientX - this.myCanvasBoundData.left, y: e.clientY - this.myCanvasBoundData.top }] }, "mouse");
            } else {
                let content = uni.createSelectorQuery().select("#myCanvas");
                content.boundingClientRect((data) => {
                    if (data) {
                        _this.myCanvasBoundData = data;
                        _this.touchmove({ touches: [{ x: e.clientX - _this.myCanvasBoundData.left, y: e.clientY - _this.myCanvasBoundData.top }] }, "mouse");
                    }
                }).exec()
            }

            //this.touchmove({touches:[{x:e.clientX,y:e.clientY}]},"mouse");
            // console.log("mouseMove", e);
        },

        // 手指触摸动作结束
        touchend(e) {
            if (this.disabled || this.endState) {
                return;
            }
            // 返回一个数组，用来描述 canvas 区域隐含的像素数据，在自定义组件下，第二个参数传入自定义组件实例 this，以操作组件内 <canvas> 组件。
            uni.canvasGetImageData({
                canvasId: 'myCanvas',
                x: 0,
                y: 0,
                width: this.width,
                height: this.height,
                success: (res) => {
                    console.log(res);
                    let pixels = res.data;
                    let transPixels = [];
                    for (let i = 0; i < pixels.length; i += 4) {
                        if (pixels[i + 3] < 128) {
                            transPixels.push(pixels[i + 3]);
                        }
                    }
                    let percent = (transPixels.length / (pixels.length / 4) * 100).toFixed(2);
                    if (percent >= this.percentage) {
                        this.success();
                    }
                },
                fail: (e) => {
                    console.log(e);
                },
            }, this);
        },

        //兼容mouse事件 如果touch失效 则使用mouse事件 doEnd
        mouseEnd(e) {
            if (this.canUseTouch) return;
            this.mouseInDown = false;
            this.touchend(e);
            //if (this.mouseInDown != true) return;
        },

        // 成功，清除所有图层
        success: function (e) {
            if (this.endState) {
                return;
            }
            this.endState = true;
            this.ctx.moveTo(0, 0); // 把路径移动到画布中的指定点，不创建线条。用 stroke() 方法来画线条。
            this.ctx.clearRect(0, 0, this.width, this.height); // 清除画布上在该矩形区域内的内容(x,y,宽，高)。
            this.ctx.stroke(); // 画出当前路径的边框。默认颜色色为黑色。
            this.ctx.draw(true);
        },

        // 重置
        reset() {
            this.initCanvas();
            if (this.autoCloseTime > 0) {
                this.startRunAutoClose();
            }
        },
        canvasIdErrorCallback: function (e) {
            console.error(e.detail.errMsg)
        },
        /**
         * 自动关闭容器逻辑
         */
        startRunAutoClose() {
            let _this = this;
            clearInterval(this.stayTimer);
            this.stayTime = this.autoCloseTime;
            this.stayTimer = setInterval(function () {
                _this.stayTime -= 1000;
                if (_this.stayTime <= 0) {
                    _this.closeMiPai();
                }
            }, 1000);
        }
    }
}

</script>
<style lang="scss" scoped>
.mi-pai {
    //background: rgba(0, 0, 0, 0.5);
    position: absolute;
    z-index: 1000;
    height: var(--vh);
    width: 100%;
    display: flex;
    justify-content: center;
    //align-items: center;
    padding-top: 240rpx;

    .back {
        backdrop-filter: blur(5px);
        background: rgba(0, 0, 0, 0.5);
        height: var(--vh);
        width: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
    }

    .mi-pai-content {
        width: 640rpx;
        height: 979rpx;
        background-image: url("./../../../static/img/liuhe/mipaiopen.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        position: relative;
        display: flex;
        justify-content: center;

        .yours {
            position: absolute;
            width: 100%;
            top: 300rpx;

            .yours-title {
                width: 100%;
                height: 68rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-sizing: border-box;
                padding: 0 60rpx;

                .title {
                    font-size: 20rpx;
                    text-align: center;
                    letter-spacing: -1rpx;
                    color: #F6F6F6;
                }

                .term {
                    font-size: 20rpx;
                    text-align: center;
                    letter-spacing: -1rpx;
                    color: #DCD3D0;
                }
            }

            .your-betting {
                display: flex;
                justify-content: center;

                .list {
                    width: 434rpx;
                    height: 200rpx;

                    .list-item {
                        background: #CB4335;
                        box-shadow: inset 0 4rpx 4rpx rgba(0, 0, 0, 0.25);
                        width: 100%;
                        height: 40rpx;
                        display: flex;
                        justify-content: space-between;
                        line-height: 40rpx;
                        padding: 0 10rpx;
                        font-size: 20rpx;
                        color: #FFFFFF;
                        box-sizing: border-box;
                        margin-bottom: 10rpx;
                    }
                }

                .no-betting {
                    width: 434rpx;
                    font-size: 20rpx;
                    line-height: 28rpx;
                    text-align: center;
                    letter-spacing: -1rpx;
                    color: #FFFFFF;
                }
            }
        }

        .result-title {
            position: absolute;
            bottom: 280rpx;
            width: 100%;
            height: 96rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            padding: 0 60rpx;

            .title {
                font-size: 20rpx;
                text-align: center;
                letter-spacing: -1rpx;
                color: #F6F6F6;
            }

            .term {
                font-size: 20rpx;
                text-align: center;
                letter-spacing: -1rpx;
                color: #DCD3D0;
            }
        }

        .result-box {
            position: absolute;
            bottom: 78rpx;
            width: 499rpx;
            height: 183rpx;
            display: flex;
            justify-content: center;
            align-items: center;

            .number-list {
                display: flex;
                justify-content: center;
                position: absolute;
                align-items: center;
                width: 100%;
                height: 100%;

                .list {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 20rpx;

                    .number-list-item {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        padding: 10rpx;
                        box-sizing: border-box;
                        gap: 10rpx;

                        width: 54rpx;
                        height: 54rpx;

                        border: 1rpx solid #EC6B54;
                        border-radius: 50%;
                        font-weight: 600;
                        font-size: 34rpx;
                        /* identical to box height */
                        text-align: center;
                        letter-spacing: -1rpx;
                        color: #E74C3C;
                    }
                }
            }
        }

        .modal-close {
            width: 80rpx;
            height: 80rpx;
            background-image: url("./../../../static/img/liuhe/modal-close.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            position: absolute;
            bottom: -108rpx;
        }

        .auto-close-label {
            position: absolute;
            bottom: -200rpx;
            color: white;
        }
    }
}
</style>