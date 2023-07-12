<template>
    <view class="home-my" :style="{ paddingTop: statusBarH }">
        <view class="status-bar-height" :style="{ height: statusBarH }"></view>
        <!-- 普通弹窗 -->
        <uni-popup ref="popup" type="center">
            <view class="block">
                <view class="t-b">
                    <text>VIP特权</text>
                </view>
                <view class="text">
                    <view style="color: rgb(255, 69, 69);">1.论坛昵称变成红色</view>
                    <view style="color: rgb(161, 80, 12);">2.查看专家统计</view>
                    <view style="color: rgb(161, 80, 12);">3.成长值领取发翻倍奖励</view>
                    <view style="color: rgb(161, 80, 12);">4.购买年度VIP服务可获得改名卡一张</view>
                </view>
                <view class="l-r-btn">
                    <text @click="chargeVip">一月10元</text>
                    <text @click="chargeVip">一年100元</text>
                </view>
                <view class="close"><i class="van-icon van-icon-close" style="font-size: 32px;">
                        <!---->
                    </i></view>
            </view>
        </uni-popup>
        <uni-popup ref="popupCode" background-color="#fff" type="dialog" confirmText="复制链接" cancelText="保存本地">
            <view class="dialog__content">
                <view class="qrcode-top">
                    <image @click="closeDialog" mode="widthFix"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuBAMAAACllzYEAAAAFVBMVEVHcExqamp9fX1AQEBqampra2tqamoGnCgaAAAABnRSTlMAqAME8n0zc1pKAAAAh0lEQVQ4y2NgGAVEgBAhGEvRFVncLVEBwmASS0EWF0uDalBMS0QWB3IVIMrThJDFgXxhZHlkDQaYymEaMJRDNGAqh2jAohysAYtysAZsykEasClnYDBMg/gBmzkGDNjtFWbA4U4DBuL8hSsccIQbrnCG2YiuAe5CtHh0gzkQLd5DhLGnkxEDAOM2InmKA0c4AAAAAElFTkSuQmCC" />
                </view>
                <view id="qrcode">
                    <image mode="heightFix" :src="qrcodeImg" />
                </view>
                <view class="my-code">我的邀请码: {{ userInfo.inviteCode }}</view>
                <view class="footer-btn-group">
                    <view class="footer-btn-group-btn footer-btn-group-left">
                        <uni-link :href="qrcodeImg" :text="qrcodeImg" showUnderLine="false" font-size="16"
                            color="#07c160">保存本地
                        </uni-link>
                    </view>
                    <view class="footer-btn-group-btn footer-btn-group-right" @click="copyPath">
                        <text style="font-size: 16px;">复制链接</text>
                    </view>
                </view>
            </view>
        </uni-popup>
        <view v-if="isLogin">
            <view class="head-body">
                <view class="user-info">
                    <image :src="userInfo.headImgUrl" class="my-user-img" />
                    <view class="user-text">
                        <view class="user-name">
                            {{ " " + userInfo.nickname + " " }}
                            <label class="m-lv" @click="toUrl('/pages/user/level/level')">
                                <image mode="widthFix" src="@/static/img/user/lv.png" />
                                {{ userInfo.userLevel }}
                                级
                            </label>
                            <!-- <uni-icons custom-prefix="iconfont" type="xiugai" size="16" style="padding: 0px 10px; color: #fff"></uni-icons> -->
                        </view>
                        <view class="user-code">
                            <label class="hh">
                                <image src="@/static/img/forum/honghua.png"
                                    style="width: 32rpx; height: 32rpx; vertical-align: text-top;"></image>
                                {{ " " + userInfo.flowers + " " }}
                            </label>
                            <label class="ma">
                                邀请码: {{ userInfo.inviteCode }}
                                <text id="copycontent" data-clipboard-text="2309932" @click="copyText">复制</text>
                            </label>
                        </view>
                        <view class="tool">
                            <image @click="openQrcode"
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAMAAACf4xmcAAAAtFBMVEWkpKS0tLSxsbGqqqqqqqqtra3i4uKsrKyvr6+srKzv7++tra3w8PCqqqqrq6vBwcHn5+etra3T09O1tbWrq6uqqqqqqqqrq6uzs7Orq6v9/f2qqqqrq6v7+/vt7e36+vqrq6u0tLT9/f2qqqrS0tLn5+fIyMj09PTZ2dm7u7vi4uLn5+f9/f3Ly8vm5ub7+/vx8fH39/fm5ub29va+vr7Hx8e+vr7l5eXR0dHj4+Po6Oj////hdE2sAAAAO3RSTlMBBQp7TTWpDxgo1T6L0Vps9UXu5bvjrZAim6DcZ9/48HIq/Mn0Kpd+q7NAYpNXldFRwaOt7dGGc/bVxZD4LsYAAAJPSURBVDjLdZTrduogEIVhEspQbBpaNeQ0Nhdvy6ptrb2dw/u/15mYqOBq9w+BnW8RcPaEMbZpnKfJnLH5xHeaDSPJgHJuyfkydBrJGFeh5wZSDi4sxRloGt/ve6XOvVn75lx6dN7psQYmYxrvh52mhF0pdUXYtLfu6XEsO2xRJAdF10fsOuqcYuFhtwpfd0tEc8YM4mb3hOrWxxBenLMgzpiAJ+f2HEMM925SSx+TunTPeIHV1SrTAYYmXxX2ArNFVokQ01GWXO4may0wOJtEoZUMsN2fTvvyiJX73tp5mK8OC3TAytBbKLUInbLFzOrue3bXazb7qKytPmZn5/tuZSQDEQ1vzprmdLskn3rWMBLAOJoiOqtKaoA6qTyrMMgpcPPlwNMaGIN1v/hSSgyWc6IYn4QHfmX89Th/AT6n3Leb4WV6AU7pfUFJAXD0UhA0pkdRX1C5n0+YwC0NdAVp2vQ+9DqFvG8zfSiW6auwyrODxmlQhWairV/TTyPEVgudnErfpOkj7fa1fg7Tu3ETKfUJS0ej97CmXZAo5HMvSOk4//gBs4v0KohlEi8ej/JDPg5Drm0yfhjR5Uc3uTm3TFwl6iLkVZa3ygrVd/2tRStqRB2G3Bit9Xb7JPlv6e36tJTQ1pLSIOPmZ0xSAEqEmv5DbHf7Gyb6U6nPsj3bmhbUra75RzUFnT+MPA0La4vhNBOYjKeZxjgfZvTh4qrIx54iI6WJ6HZoorwSKNo5BU4qHZ9lBHJ+aGRATQs4zNuPL4D0BG1UAaD9bRc0J+c/MhqnOSLLU1cAAAAASUVORK5CYII=" />
                            <image @click="toUrl('/pages/user/setting/setting')"
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAk1BMVEVHcEx6enr8/PyOjo58fHx9fX18fHx+fn6Hh4d6enr+/v58fHx9fX39/f1/f397e3v///////99fX3CwsJ8fHz9/f2enp7v7++BgYHZ2dn9/f3x8fHq6uq6urr7+/v5+fn39/fj4+P6+vr6+vr09PSmpqbR0dGBgYHe3t7Z2dnz8/ORkZHv7+/BwcH6+vrj4+P////NKaQaAAAAMHRSTlMAHPUKDzRTBQEU+0c77nFl/lgwpSnFht9dvZElvJNQhkQt0OLCcnF5pRSILk5Ha4YOs6iSAAACE0lEQVQ4y4VV53rDIAwMHoAXJo73yGia0XT5/Z+uMsskbR19X37kOE4gHfJqdR90uxaxpavFINtRxRMmuWnijSzxqNdLGue9tyRJgxclyF+Cv4muzIwSnTpBxFowSmterGFhX4wmij1sXBd8bSnTt0koaVs+8+CYbQswT95mJmnHiWLTFHn6teb+9BCO/wcPD1qSvI6L8aok6cfDQviY4ENKksIGnaa8XMrGsbGCyG58WwrHMk3rOk3Lo5XhW3SJBvFg9jtlHfl57kd1OWNDLLpEvAyXlQKv2Eee63rIx42CqhJn3pSbEkCZ2n/yA0InLPBPSo/BXiJuA2iG5THDyGAoCmUVcRYQVchpvyL62lzUM5DhTRZ5V6k/jVncT9kX5932T6dteJuJO23MbjbP3rjQ0X2lB1OeZK+xL8s2x05eprMKzr/UBQvbV86uo7Tb2S3kBZEFPz9YcDLFnTfPsuBB/MxmsoVQsdOSccfwpKoLTWiWHN5E6kFSL6sT4cT+7mS8F65M6ky3CyQ3vNpcGBuqmVYNjF02Fd/ESL8u6uaYsRRHuGbzAGA1ACljOHdNr8E+URTnCPxWGUFwF8rjKALzzD0kAQK/EnBRrxV7IBBwMLLNA0wi/rroqhWv4mRELfwaj8h06YzI4tiLh40I9aD+H6QZTkXgfHGQwv1zP4bw82BxNMOtXE+ES558FlZUxSP+A2Gigh/0j7HbAAAAAElFTkSuQmCC" />
                        </view>
                    </view>
                </view>
            </view>
            <view class="balance">
                <view class="top-bg"></view>
                <view class="text">
                    <view class="cell1">
                        <view class="tm1">
                            <view style="display: flex;">金额:
                                <view class="number" v-if="isEnd && userInfo.coin > 1000">
                                    {{ parseFloat(userInfo.coin).toLocaleString() }}
                                </view>
                                <u-count-to class="number" :decimals="2" :start-val="0" :end-val="userInfo.coin"
                                    @end="isEnd = true" v-else></u-count-to>
                            </view>
                            <view @click="qidai" class="text-center">
                                <image
                                    src="data:image/png;base64,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" />
                                兑换
                            </view>
                        </view>
                        <view class="tm1">
                            <view class="text-center">
                                金币:
                                <text class="number">{{ userInfo.flowers }}</text>
                            </view>
                            <!--              <view class="text-center" @click="qidai">
                <image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARYSURBVHgB7ZzdThNBFIDPbItpA4pemWiMfQONdyYESf8uQXkASHwAiT4ARh5Ag/fy9wAm3FJoKDdcaeQBNDVGvaQxNNAtu+M5pehq2Dmz7XbbLvMlBMjO7na+PbM7c2a2AgAsMPhi5DAYQQxGEEMSAvLt4cPrt0ZH54QQj/HfjAC4C4NNTQIcuABrTSEq6a2tr0F2xvrpR5GTzy9YQizin9dhGBGi6kj5KlkqbWjvApqCnGJx1ZJyDmIARtNyolR6oVNWT06h8CYucgis9ALW6bVOWTaCTvP5+YQQKxBDHMeZTZbLm6oybAThPeclxJREMslGkVJQM5d7NARPqc6RMkN1VBVRCrIsawZiDgqYYbb7g9FzH2IO9ucyqu2XvieNQTCu2m6GGgxGEINSkJRyF2KOK+WBartS0I96/S3+qkF8qdrN5rKqgFLQnf39WlPKLEZSoBHwkEB1m03v7SnrpjVYrU1MZK6mUtPYq56H3jz6a3gRKkLKw7NPJTL4Q+fpRdagis1qnVoHBQBXWCmIcj//HyRUWXiPO5FyKb2zU7lo8zH2cq/gedrn6oaWFBsvgt+5/FAKOs1mZ1SDuS5kVU9c96nuh6XhAA6YV7FTF2TYoyUF6ziHdfTNDykFuYVC+VTK51e2t5V3eiKArOpJo5Hl2v5Fx7+WSpWVkjAiMddTcQA2tT5zLpcZF+Kd2N7O+ZVhBdEHCpqFU8jqSI73uOPp9Afw3pvaUn7Z9vqNAMelqExa1nvc/1N3ggDORruYrnQdZ9MRYl3n6pzjlYX5l2VVOOvQSvsCTHcqBQfgU1in+T9ZChQcjqB/9upMVj+4UIoXRlDgWY32QTN4UrqSC7JYHDhZrJQAdCbIy4DIClOKl+4FeYlYVq+keOndaL4ta0SIjyjrM4QM3h+/4FOojBVY7GVaOJp0B8qiXjmESFS58sjyQTdHR0OrkJ3P34OIiExQ4qLuQodYEebKIxPUXuwQCtjpXICIiE4QRhA3B6UDzfTiseLXxIhkIrHSzc2aBpdRz/RGm7THp9ntsbFyJ5Jon2s4uIx6pjfyWQ1qHiTpuFjUrihFDu0TZdM6J9yetCZU0RRA2SkUNmwh1vxWfbVWs42NUc/8GfRp0VZfBLWgnjb2glNSLmKvuEJTTBKgJQpz0/eEZd1vR0xfV7P1T5AHesJhN+DvE04IGBTMzCqDEcRgBDEYQQxGEIMRxGAEMRhBDEYQgxHEYAQxGEEMRhCDEcRgBDEYQQxGEIMRxMC9ilCFmOO28+B+qAUBBFpTPIxI191VbVcK+lmv0xrpWL+rwS0qZd/VcKVcgphCC825Mlrvaviudh1i6OsqrFLpAVdO6yn2/eholg4IMYHq0mg0nuiU1RJETQ0lZekrHWDIcV13meqiu9pfq4l5aa+cp4WTUwFfLuknNRSzbgNshvq2D8fh5OTd1MhIBgaUhBC1um3XbnT4bgjRlaDLgJHDYAQxGEEMvwHlIdwpyDmdFgAAAABJRU5ErkJggg=="/>
                打赏
              </view>-->
                        </view>
                    </view>
                    <view class="cell3"></view>
                    <view class="cell2">
                        <view class="tm1" @click="withdraw('/pages/withdraw/mtzc')" style="justify-content: flex-start;">
                            <image src="/static/img/user/mtzc.png" style="margin-right: 10rpx;"></image>
                            免提直充
                        </view>
                        <view class="tm1">
                            <p class="text-center" @click="toUrl('/pages/pay/index')">
                                <image
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAK9SURBVHgB7ZnLddpAFIb/kQV5bOJUEDqIFzZhF9xBqCBQQcI+jnh4HzoAKiAd4GUOsCAdUIJ3OUFCN3Nli4OEAhKjgSjWt2HQcz5Jc+88BI7ApbX8LEhYAjiHoMEShea8Le6hEQOaKVvOB4PEN0+KIVE3yfkEzWgXA9Hb8CZBqEIz+sVORC6WNXKxrPHfiplQoGJRieD0yQvftIBrNCe35nccAOc7IupzvpPXuzsznMaP9osFDkTpjbnkjGidk0QJBo3KbecjEnJlLesy3438JC4EqivX7EMB1U/xYmvLigaXN3YLMSnLY2V3a0uC5aCAkpi8+V3kRQWsOHIsBXls1D7+HKGAUhv7DbNRxGosq1EK73uU4yJFnbtLiturbawaUEBAkQsZQIoULfeADCoQJcSGFkuxup4rBA5GWYzZLxeXdKSYVMQYKXdeJGeMqIASj/lSmNdpjdO2xCqWXXUJ75GEM7GYWOZQQW4txaFfRsk3ic52xc9w/gyIcZLkfIIDkA+jPesWWiz3DJv5bTcc/WzDrLHU7oCy7/6r5qz7vOf/D4i9s+wxKQwCfTkuX31ZDoQhdiZrIjGYdk0v+qlIedcC7qedwmv/f6p9xc38Nb0t1sml4d+OTVOKWU89+HVByoTl5E8rfIz8KnppSkXWAxrYlJt0Cm1syLmyPO0WmlzWJeXVAZqIkmOp2UNZqxSj1KXah9+t4oDyKOehW8q7NzQT7hAfQ4rR+sZ8/DfnPcUjSDEBMdlbr70s4hX0ojSAzMnJGIG+YsX6VUKG2ZzVCgQPgtmnI6yEaGT9ovKZ4KwRI0GLOhJCoF54GHFs9opNOuYQCSl/dVpS76RieRvLGk83eFzd2GMkRnXiVJ29YqqrHqcib2NZIxfLGrlY1ngaYnKmdo6MQqG6B8RsmG1eBUHG8NbYhFNDTs6/xx/raC8V75KeQgAAAABJRU5ErkJggg==" />
                                充值
                            </p>
                            <p class="text-center" @click="withdraw('/pages/withdraw/index')" style="margin-left: 15px">
                                <image
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJvSURBVHgB7ZhPctowFId/T25C2XEEz/TvsrmBr5ATNNnUw6q5QZMbpCvKCnqCpicIuQHLTodMOAI7BhL0KtMog4mxYyQ5UeJvY1mAPR+S3nsSUBHd97Pj7pv5Z1QEoQISKXX5trxZ0EF8ufsTjnEulpLSVCDnVCxTSuNYzplYrpTGoZwTsQdJaRzJWRcrJaVxIGdVbCspjWU5a2JGUhqLcgIWKJA6W+8gpmHmNwPu20rixmJFIV0K+Xu9mwmnkDjO/I2S67ydRjDExohl/8MF0yoeNU42yZGgrzDEhljrXs8D18pGOc54ZknMxSSfpO5LBoAsOZL0HYYYi8Wj16ckRcTER8l1m6iWyOln3PD1XnzZOIMhr2CBL6OdC3W5gAE2nrGKlXD/FEmNWOfjNAw46DFzBEOSqXU7ChtR74uEFOcwfRdouJgv9tvj5lj3pUYskMEvG1JVw+BPwU7QW+0T61+Ap6jAE63eP9s15kxMBvJ/kr3BeP0zlafGcIwzMWIsp3V71BysJOBJ0tZBRa1pZ6dWqW2LKmgZtmBM5LXcW41UvZBbh2OaJO0kAt9GxBCWiP827nzcrTFCS+yK8044DXWXS6l1rFQeOYRK7urHu1kfgpd7MJVzIjUdI8C80M0jJaZy2ABuCJVMuHwHlrN9iJqaGq9J5TEVhg/gMe0/zb5up6Kiyi09+E1fN+oi2DfyKw/GkFgcoSQs5ACPTK6YqhImccH2PgtVTOOxqdeYb7zM4EFEUffD7Aplsbdd3Zri/Ri72wy6pF5jvlGL+UYt5hsvQ4yYBvCX1JFeSmwRLA7h4Zlfch4q53IfNTVPj3/wIfz+0KhcqwAAAABJRU5ErkJggg==" />
                                提现
                            </p>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view v-else>
            <view class="head-body">
                <view class="user-info">
                    <image :src="detailLogo" class="my-user-img" />
                    <view class="user-text">
                        <view class="not-login" @click="toLogin">立即登录/注册</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="member-box" style="margin-top: 20px">
            <view class="userimg">
                <image :src="isLogin ? userInfo.headImgUrl : detailLogo" />
            </view>
            <view class="usertext">
                <view class="name">{{ isLogin ? userInfo.nickname : "立即登录" }}</view>
                <view class="text">{{ userInfo.izAuth == 1 && isLogin ? `有效时间：${userInfo.lastTime}` : '您暂时还不是会员' }}</view>
            </view>
            <view class="go-btn" @click="openVip">{{ userInfo.izAuth == 1 && isLogin ? '立即续费' : "立即开通" }}</view>
        </view><!---->
        <view class="body-middld">
            <view class="box-center">
                <view class="title" @click="qidai">必备工具</view>
                <view class="bd">
                    <view class="bb-box">
                        <view class="bb-item">
                            <view class="icon-text" @click="toUrl('/pages/user/spokesperson/apply')">
                                <view>
                                    <view class="icon-img">
                                        <image
                                            src="data:image/png;base64,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" />
                                    </view>
                                </view>
                                <view class="text">申请代言人</view>
                                <!---->
                            </view>
                        </view>
                        <view class="bb-item">
                            <view class="icon-text">
                                <view>
                                    <view class="icon-img">
                                        <image mode="widthFix" src="@/static/img/user/activeCenter.png" />
                                    </view>
                                </view>
                                <view class="text" @click="qidai">活动中心</view>
                                <label class="badge">4</label>
                            </view>
                        </view>
                        <view class="bb-item">
                            <view class="icon-text" @click="toUrl('/pages/user/invite')">
                                <view>
                                    <view class="icon-img">
                                        <image src="@/static/img/user/friends.png" />
                                    </view>
                                </view>
                                <view class="text">邀请好友</view>
                                <!---->
                            </view>
                        </view>
                        <!--                        <view class="bb-item">
                            <view class="icon-text">
                                <view>
                                    <view class="icon-img">
                                        <image src="data:image/png;base64,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"/>
                                    </view>
                                </view>
                                <view class="text" @click="qidai">卡包</view>
                                &lt;!&ndash;&ndash;&gt;
                            </view>
                        </view>
                        <view class="bb-item">
                            <view class="icon-text">
                                <view>
                                    <view class="icon-img">
                                        <image src="data:image/png;base64,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"/>
                                    </view>
                                </view>
                                <view class="text" @click="qidai">聊天室</view>
                                &lt;!&ndash;&ndash;&gt;
                            </view>
                        </view>-->
                        <view class="bb-item">
                            <view class="icon-text" @click="toUrl('/pages/user/reports/reports')">
                                <view>
                                    <view class="icon-img">
                                        <image
                                            src="data:image/png;base64,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" />
                                    </view>
                                </view>
                                <view class="text">月度报表</view>
                                <!---->
                            </view>
                        </view>
                        <view class="bb-item">
                            <view class="icon-text" @click="toUrl('/pages/user/level/level')">
                                <view>
                                    <view class="icon-img">
                                        <image
                                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAMsElEQVR42uXcC1hUVR4AcCq3bbet7Nvabat1t7ba+npstbu9X25fL/fxbb4q81H56CGaig8gFbS02vKr/XqYleUbBUJgEEGEAeQp4CCOAsIAhqCCIgE+5p5z+O8595473Hvm3rkzw0Nt/b7fJ/M//3v+//9hGMeBISTkDP0BgPNURjFRyI/5Dx/yfOoC7nyBWdyX8871Q1EHH9TP5IM9lw6GNfwT6sIB5XSyvy84mw+GfTZ/Sl10hrEeBp1tX0q0seaf9wBFc7MeiMCCkO/ZxyJPiV90xr/0+GfrYoCWX+i0CCzX2R4aLQY5vvJ97U97PEP3msOsuUtkx45dKlNvi3GzdTNm11nVMY9fPGD3Jvmxpq3tMvp38I4fHyzzxNo46E+X9vtjEwD9l6K9/XJaiGv3E+ixPdoN8toFYtxrv0Dryx9f2D+HU19/EXR0/HJAANdf+9NZ+v7BuLPzSug8JOi0YJZnFQ92PYA6ffXgLT8J6+z8FXQd+bWVLs7feF8LqD6bqbdfbvKz4q4uumHXVTonWn+jY7Yuxq324U60Kvy+Ltj6bLbePPuW744nWq/ucYJr1Tl59Og1WuK6el3PuvE+4n5m+/RpfTpjcIfTfuByOHns2v8LdNbAH5RPtg0x1dakZ5CDd60cT3a814hzlwLe0X+682kNWsuvPtvaFEZ5gTxoy3e944d+HzTX9r+S3CUdOOcdCEruEoW/ebSWRGv2quejjdf4dzjsWXL74et7ozvvgwSc/TYMJFYz2H5PtR+QsdmtX/lrP3wdtB/5g+yHxht01Dh3uqXxBgY49jHe9e3z2P52N7YvBnOLOKt1szzDeDerrfYk9yX0aR2ns/t6pZI9WJ1uPXiTCH5ouVGvkRPiR+tvRva3q3BWNMgyuSyBGM8UZFkwyWO1WQ9qPz39m/TL47pZzR6w2cmdZveSjqY/mmrlTOIk/+MleHsUnEmsB69+zRjMKJ+B0b0I2lyXwdGGWxTNFhoEzbeg6u0P4+0LO3DGQkAZC3Rwry0E//alebQH1ovYn39zcPQsvA/oePPv4NiBW4OFs5Yk4W3zIRBIEHReOqfepr347PeQQFynZ2HwGs/3t8Fh1+3+cAtwyarxOD2yG6e/BbI0BUqLVNCYTpoCC5AJT066nieH79uzRnuhPZnO0Naoo86hy9G+dgQdzVfAkbo/0eQ7FHUyicYkTdxzW6ul5i6SsaAKbY2AgYY5ozWSvqCK9ebVrzyPMJ8nrpm/o/qKngM6XH09tNTfqZLYxpTndhO9reHJPV5/J8n98H2UGg79Yx4X3DrJXfa+bi6xfxPy7PRMNI8/9PRaG+6G1pqAoH3pT+DU8A60ZS7IUrgtvuHUiEP0ujbvtXmckL81sgGnzuuy2lesL/dGe1Rm01JnMItT9B7FH3/ot0laXX8JSHOVDKdH21DKHEA2QQon3qbYNXCo+h444HgQp0XZDa/nsG0OIdkfLWY1UeW2J8mW8MM+6xjEcQatx/uFZpcxsznp2YTAoZor5YYDVfzNJGQL60bJswElh1mY7UEKV0z37MEOaev8Au26B92bZC9bqq0pf0KMcn3Vpvtg2mtQM9KzCYEm1xDp4L77tOCwmRoZy0Ep4RUoaRYEig4Zp+4j71m/81GSGlnmlZv53sfa2qg2/2/YNrc5mJpoS3iF0RzqbdP56dmEQHP1zahpzwMMHKm8n0FNlQ8YAU6+nTjLjRJngmyziUSBGt/+7n/VmnJdV8Hj9MD3qHkkY8kKXe3aoqHIFlFmua9JfZw067R+lj2GxPnZ2dB70N67oKnqQQY1OR/yB8vFKW/ZUcKboLN5hkKMe+W92U3vIR9o90NV9qdR0txqvG3RGl2txpLHUHJ4kW5/szomcdarOqPRnObxvXeFQKPzHvR9xSMMNO992B8sF+/LGoaTwurQd9MhSITYl72j7ieryX1KV6vR8Ri95+T2ogbgxLA6XJ01zFPDYE7T+enZhCD6QAmNFY/qHOIaLVQkjcIJM1pQ/DTQC+WU25JHqEyTi5H9oyjD+gfLh6LkiO3KNcr16r6SwLR+woxW1qPlHGbz0y+7EFTveAwOOocqymWI64mLyjnnUFyyZiKKm9YlxU0FKVaB4rhY3yQ5LxSR7E8jdPUbyugDcsQWTy7fT1IJdYzj07pw8ZqJVv0bxT3z03twCGsGDux+PBDowC5ut4zkfDabDiJJm94AWSy3yT/0WjfJ/Cha3r827xmcFJni77Um+0msJ7Ff7zkUprPSQwtB9JTo85EnGOQnELAYyfjPu2jTa93SxtfADOK8468rYkNb0KapXT1rr/tJsxftAW17/z251zoTJvN4zVrP7kF1ux6B78uf1EL1ZU/5YpaPU6NXSjGvwpmEU6JXWvXv7zxAzyaEPZuF+rKntXBDyTNaYhwa6e1GTX4tjdcqeWhzuE1aPwWCskHgWZus55WnxFltn3MIfZtR85Gr6CF6QGV/hoaSYX3GVfwPFDezQFo3CQZU/MxCVtufHrGr9O8MNDiGKUxy6dmEQEPhLfLGFBaIcfU2vVChjWnzK7NGSDGhldLaiTAQ0MaplaymWT/gKuNM5jGbn55NCLhKh+Cawn9pQZ0Cc1BXwunjPUq8lSeNxRtePSiteQU8Vr+sWGPmFTDOV2NCPl1D66c04fKUsYY9CH1698/zTOYH1w76f7F6x2BcW/xvRYGJYoHZuj5Oije8Kq2ZeFxa9RL4ZTXnZxzRvVmN4Pv3PRfU2wfT14NCzqOn9k+8v3A4dnH7reQJzHNJ7oo50qqXT0nfToAe4znxthj3YdVLp9jeVvUZqC14lvHuW+hfOz89E3Y2yotmtQUP4Jr8kT1yZeDKH6EoUuxX6HPzR8J+mqMhxknah0vo4Fj6ZhwwboFV3AvdC6V/sNTf+mbUOcV5WAzRM+l5ydWVcyPU7BjVo8DCDh1clTdaS1yXc2zRy6Vvxna7V44FSeC2oM1je+DkqC8Cra/k5YxmrOaRY/RMeg6ooOBnuDrnORVU5+lgDrzk6GCBmI/i5sa5vxoD5l5UfK2QaEwSclD8nPhg6/fMI+bprwd2yPRMdN8bQ1XZQ/H+HS8wIMCWsgU8Xpmtw/ZCG0Lt7i9fgGCg9aHZ0Iv6pvMJ6+wsvL6zeqoq/TpcZX/RPzlcEHFnxnhp9eRy94rnIRD0mt3s2l7XZ/ZyJvOxs/D+1nNs7AV0cSTelznOWzaXOS64dT1wJE+SVk6oc38xGmTLuS8EPE5z67HDNrmv6vvktI9kZ2H8Ex57s26FfVnjVdi5fYKWds1o3SzfKE6KN06TvhzT4v58FPiCaA4pjJne1/VN4/QMfPwAlX0Q3psxhnpZCyozX9JxCngcc57b6h40Bzu9ryM5X4W7lz/X6f5sBBiRlo/uJLlfRvRXfZVm1jHsDHz/lNm+9Nto4iu+gMBs3Z99yLaPl7g/H+l2fzoctCQaQ+nLlvZ3fR06u19vwMW700Zg57ZJAyZx8WfuT4YT9yfPgmI4wUmLPh/QHpxpI/x+ozA47VfhivQpXpxcRV9LnSJ9N/9r6dNRx6g2nLDgq4Guz2YO6GelUfnWh0h52muyPYJy0RY9T54QN91PuE6s08/12ayB/6Q9+2ffsXUUcaS8AXtSX2fI7pQ3dBwC0/hWTs1he1HidazGHr6mWe/P+mxG03/WLQ+pJvVSXGGbTMptoToVW6YGxd/rxbx+qs9mYzP27h0/u1OvlRw2unnKtB8TNhObrW/eM+aw3Uh22aYTh+1NRZLAZiHQ/L7eT8ins7CZ+vZdh6WJtxNH8gxSljjznEZncNNZ+ud9q+UJN5GyzTNI6eYwQ7u40n5itb/VOu2dzdC/73x2Jg8hpQnTSVnCHFKihwRe62UKUpo4W6ckfo6sNGG2jOVoeK4TBVKf9sx6H5j3zjs2D8al8RNI2XdzGVQaN08vQVEcJyMlNI8p26yga0TNYR/zdfV6IkCaXDmf1/W3PuuV9Tywv32BPnegn6UnyM74cFLqG9oZF6ElX6PhiavXCOtm+1nVZdcC7THo5zl9clA7E3+Ld26aTEriIs8mrCfW29nxG2Cios6XijbeR3ZuCqPmBy6O29QXwqA0/l7W09n3O4RiYy+E4tj76Yths0jRxoUqxBGBWdwKEshxWpPVZj2c/b+Fyh41yF204Q4pP2YcKdqwEBWujzYWIyOcVZ53fkwUpjVYLVbz3PxdZnkrL4HCmHvdBevGkML1kahg/WIRPcRFWkY5HnQPtpeUt+4+tveP77fh5cVcDYVr74aidU/ivLUvkry1oSR/XRjKWxtJCtdGM/LHNCYVrA0Fehj0YJ5i15zMXH3NQP/2u/8BjUBq93b3dZcAAAAASUVORK5CYII=" />
                                    </view>
                                </view>
                                <view class="text">用户等级</view>
                                <!---->
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="advert-img" @click="toUrl('/pages/user/spokesperson/apply')">
                <image src="/static/img/user/dyrbg.png" />
            </view>
            <view class="box-center">
                <view class="title">我的频道</view>
                <view class="bd">
                    <view class="van-row">
                        <view class="pd van-col van-col--6">
                            <view class="icon-text" @click="toUrl('/pages/user/wallet/index')">
                                <view>
                                    <view class="icon-img">
                                        <image
                                            src="data:image/png;base64,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" />
                                    </view>
                                </view>
                                <view class="text">我的钱包</view>
                                <!---->
                            </view>
                        </view>
                        <view class="pd van-col van-col--6">
                            <view class="icon-text" @click="toUrl('/pages/user/homepage/homepage')">
                                <view>
                                    <view class="icon-img">
                                        <image
                                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAACDVBMVEUAAAAAAP8A//8Aqv8Av/8AzP8Av/8ApO0Atv8Aqv8Au/8AzP8AvP8As/IAs/8AuvUJs/YJs/8HyfgHo/gGxvkGovMGtPkGt/kLzfkFu/oJuvsHv/cGtPYGrfcGrvQGsfcDofQIwvkFpfUKx/oHtfgHv/gFrPYFrPYJzvsJwvkGsPYIwfsIv/kGrvUGr/UIwfkIw/kIxfkIx/kIyfkIy/kIzfsKzfsIx/sIyfkHtvcGtvcKyfoHvPgHu/gJyvsEoPQKzPsEpvUFpvUJzfoFq/YFqvYGsPUGsPYEoPQEo/QFo/QIxfkHt/cHuPcHtfcKzfsEoPMGqfUGqvUEpvQFrPUFrPUJx/gFsPYFr/UDovMEovQGuPcHuPcHvfgJzfoGsPYEn/MEoPMFqPUGtfYFp/UJy/oFrvYFr/YGrvYHu/gHvPgEn/MEoPMEofMEovMEo/MEo/QEpPMEpfQEpvQFpfQFpvQFp/QFqPQFqfQFqvQFqvUFq/QFq/UFrPUFrfUFrvUGrfUGrvUGr/UGsPUGsPYGtPYGtfYGtvYHtfYHtvYHtvcHt/YHuPYHuPcHufYHufcHuvcHu/cHvPcHvfcHvvcHv/cIvvcIvvgIv/cIv/gIwPgIwfgIwvgIw/gIxPgIxfgIxfkIxvgIxvkJxfkJxvkJx/kJyPkJyfkJyvkJyvoJy/kJy/oJzPkJzPoJzfp2uLdbAAAAa3RSTlMAAQEDBAUIDg4PDw8TFBQaGxsmJygpKS4uMTtEWFpbW1xcY2hra25vc3Z4e3x+f39/f39/f39/gICXnZ2rrK6zs7q6vL2+ycnS1tbY3uPk5ebm5unp6uvs7e7u8/Pz+fr8/Pz8/f3+/v7+/qm2qBsAAAJQSURBVFjD7dfZU9NQFMBhKIgbihWhsgiIoIj7AgqCiCsqIIK7IgooKjTWLqlC1Cq4gJQuFmhdq3WBIP0bPTe3aYOT9OaGB1/yzfTcEzrze2qSISVFp9Pp5KytOHbuZnQeRKPoE63WlFl/hOfn5niAUn/AfJWGjOHgnZnZ2Zk4noexn76z5PBvGfvoQ4d+yaEPbfopizq08tJ35AcQT7R920sbOhAOfwWRCJphgLfIHtrQ2S/yaEPrPivYTRna+EkBbWjrRwW7KEPbPijYThkqDwaDITA5GQiEQkHhSpjllKGCADY1NT0diO8wCihDGZ3vZfj9nRm0v6M6v8Dn8y9QR32r5d/3+gRe4BM9yKe/+esh4PF4hYnBVq/hsZbV4o6bmBgfd7s9npYsLc/ZvBvvFnJfz9P24Dc1j429AaOjeDabtL5CMmt73oLXgp7azEW8jXJrWl8JWmtyF/liSzUVlpUVmlL/+xvWsGqNwGiUTqNxtYGmsqLyZNfIsLyuU5XL1XaKr7xM6nKRus7OvufYC4BP6YSzb4eaTtE9l+uZROIKby5wdwO5s+ziUxUuLCWGtgwBDgzFJHaOE3eO20wMnRgcfJIU/v44MdTudD4G0omJOz7PE0PdTsCy6IPmv/DfWLabGOplWQdAE6Xwhkmve4mhDpvNGmO3OxzoFKctBl11EENH7cBqfRSDcokdTfx9IzFU+lCVUmIo/TTDMBYLk5TlTDr5p51zzZwUw5jNV3PU3GzZTQMETdnqbv+0koa22/0KbrU1lKTp/1rpdLq4v1ueSd9illc4AAAAAElFTkSuQmCC" />
                                    </view>
                                </view>
                                <view class="text">我的主页</view>
                                <!---->
                            </view>
                        </view>
                        <!--                        <view class="pd van-col van-col&#45;&#45;6">
                            <view class="icon-text" @click="toUrl('/pages/user/medal/index')">
                                <view>
                                    <view class="icon-img">
                                        <image
                                            src="data:image/png;base64,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"
                                        />
                                    </view>
                                </view>
                                <view class="text">我的勋章({{ isLogin && userInfo.medalList ? userInfo.medalList.length : 0 }})</view>
                                &lt;!&ndash;&ndash;&gt;
                            </view>
                        </view>-->
                        <view class="pd van-col van-col--6">
                            <view class="icon-text" @click="toUrl('/pages/user/promotion/promotion')">
                                <view>
                                    <view class="icon-img">
                                        <image
                                            src="data:image/png;base64,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" />
                                    </view>
                                </view>
                                <view class="text">我的推广</view>
                                <!---->
                            </view>
                        </view>
                        <view class="pd van-col van-col--6">
                            <view class="icon-text" @click="toUrl('/pages/user/collection/index')">
                                <view>
                                    <view class="icon-img">
                                        <image src="@/static/img/user/collaction.png" />
                                    </view>
                                </view>
                                <view class="text">我的收藏</view>
                                <!---->
                            </view>
                        </view>
                    </view>
                    <view class="pd van-col van-col--6">
                        <view class="icon-text" @click="toUrl('/pages/user/comment/index')">
                            <view>
                                <view class="icon-img">
                                    <image
                                        src="data:image/png;base64,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" />
                                </view>
                            </view>
                            <view class="text">我的评论</view>
                            <!---->
                        </view>
                    </view>
                    <view class="pd van-col van-col--6">
                        <view class="icon-text" @click="toUrl('/pages/user/mycare/index')">
                            <view>
                                <view class="icon-img">
                                    <image
                                        src="data:image/png;base64,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" />
                                </view>
                            </view>
                            <view class="text">我的关注</view>
                            <!---->
                        </view>
                    </view>
                    <view class="pd van-col van-col--6">
                        <view class="icon-text" @click="toUrl('/pages/user/fans/index')">
                            <view>
                                <view class="icon-img">
                                    <image
                                        src="data:image/png;base64,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" />
                                </view>
                            </view>
                            <view class="text">我的粉丝</view>
                            <!---->
                        </view>
                    </view>
                    <view class="pd van-col van-col--6">
                        <view class="icon-text" @click="toUrl('/pages/user/like/index')">
                            <view>
                                <view class="icon-img">
                                    <image
                                        src="data:image/png;base64,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" />
                                </view>
                            </view>
                            <view class="text">我的点赞</view>
                            <!---->
                        </view>
                    </view>
                    <view class="pd van-col van-col--6">
                        <view class="icon-text" @click="toUrl('/pages/user/backroom/index')">
                            <view>
                                <view class="icon-img">
                                    <image
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAACwElEQVRYhe2WQXbaMBCGR5Kdl119gzo3ICcovQHL7JKeIOEEkBMk7LILPUG5AckJ4AblBqELMNgaTd/4STzFQcaBsir/ezxZkhl9I82MBSeddNKRJULmr66uQEoJxpiyf35+XrZxHJfjSqmyBYC2UuraGPNKRENEBCIq342iqGy11u9sPz09Bb2KDvS3J4ToW+gbAPgKAPfefMe2o6YGDwHqGWP6lTHuJwDQZUBjzLMd/w4AL8cEekDEOyHE5ng88XhCRH9453jeGJM2NfxZIPb+GRE7DoZbJw/uxh/nuDoGUKqU+oWILR/ALVyF21dNgVIiGmut020L74LhoyuKAvwMDKkJUBrH8RgRg3HAMK48BOZ7NqhnuxbbBdSSUvLOJP7iTm5ndnnNTkkpJ4jI2TbdFyjVWo9tIG9g7OJzIcSUiNr+H+z81GZZ6sPymBBiQkS1JUCGJhCxbYxJ+Nz5x0finhHxB9cWRPzpxrnVWs/yPL9cr9eX3rvg2xBCXNftUBCoKIoRL8BGfBj73MqyjNsvlQV5NznWEh/U/39RFK91QHVHNgeACz4WIroloo43x0F6awF8cf/3NltSyoH9hOwdQ04vRVFwPHQq41WYoIioe3Z2Nmzybi3QarV61w/VGi9w32Wc32db7sawF9BisfgwVsmamRBisF6vR7a+JHEcd2zNSX1Id/3I83wnUF2WfcgQ73nA2bRarR4tTGoXHC6XywtjzL0fzJ9REMgZ3JJlgyzL7mwMcZ16IyIO5Dfbb2dZ1kfEru+M/6tT8MhCnvG1gys4Io63BHZbCMFZ2c3z/DGKomsiav2Tr32NkQkfESKWMIFPxwMAfNNat7Za2Aeocg+eexnWqoIEoDZ3JiKaHwxUyYiXKIr4G7XV41CqWydmSqnaYtgIqCL28FIp1fgq6oSIO68cJ5100v8rAPgL9RcWHR0L5p0AAAAASUVORK5CYII=" />
                                </view>
                            </view>
                            <view class="text">小黑屋</view>
                            <!---->
                        </view>
                    </view>
                    <view class="pd van-col van-col--6">
                        <view class="icon-text" @click="toUrl('/pages/user/mybackroomuser/index')">
                            <view>
                                <view class="icon-img">
                                    <image src="/static/img/user/mjs.63bdd369.png" />
                                </view>
                            </view>
                            <view class="text">黑名单</view>
                            <!---->
                        </view>
                    </view>
                </view>
            </view>
            <!--			<view class="box-center">
                            <view class="title">排行榜</view>
                            <view class="bd">
                                <view class="van-row">
                                    <view class="pd van-col van-col&#45;&#45;12">
                                        <view class="icon-text" @click="toUrl('/pages/user/rank/fansRank')">
                                            <view>
                                                <view class="icon-img">
                                                    <image
                                                        src="data:image/png;base64,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" />
                                                </view>
                                            </view>
                                            <view class="text">粉丝排行榜</view>
                                            &lt;!&ndash;&ndash;&gt;
                                        </view>
                                    </view>
                                    &lt;!&ndash;                        <view class="pd van-col van-col&#45;&#45;6">
                                        <view class="icon-text" @click="toUrl('/pages/user/rank/levelRank')">
                                            <view>
                                                <view class="icon-img">
                                                    <image
                                                        src="data:image/png;base64,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"
                                                    />
                                                </view>
                                            </view>
                                            <view class="text">等级排行榜</view>
                                            &lt;!&ndash;&ndash;&gt;
                                        </view>
                                    </view>&ndash;&gt;
                                    <view class="pd van-col van-col&#45;&#45;12">
                                        <view class="icon-text" @click="toUrl('/pages/user/rank/shareRank')">
                                            <view>
                                                <view class="icon-img">
                                                    <image
                                                        src="data:image/png;base64,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" />
                                                </view>
                                            </view>
                                            <view class="text">分享排行榜</view>
                                            &lt;!&ndash;&ndash;&gt;
                                        </view>
                                    </view>
                                    &lt;!&ndash;                        <view class="pd van-col van-col&#45;&#45;6">
                                        <view class="icon-text" @click="toUrl('/pages/user/rank/giftRank')">
                                            <view>
                                                <view class="icon-img">
                                                    <image
                                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAGZklEQVR42u2aW2gcZRTHo9VS0af62qqIWCpYBUUoiJaKfVDwQps2SbOtzaZJs8kmm2yS3ezOXrKb3c0F2yIIVuiT1IfQi0IxxZc+tJRSkdKHCoWWtlYxhqBp6c5108//mZ3Z7MxeEmNMNsl34MfMnO9855zvvzOzs5NUVXHjxo0bN27cuHHjxo0bN27cuHHjNk/LDA/vy4yMTGvDw4xQZ0GzMWvcyIiFgriRkZ8qWiAplXoRjZ7Qhoau6gwPF8ccny2uVLx93owvWvFnkTY42K2mUkxncNDKf/Wbx3aMcapd8QKpyWQzYPPCXPB856N2RYrCIpH1YJ1+H0okatREgs0FLZm8p6RStSyV2q4lEqfz/Ge0eHw75aKYueajeKOfdezw4fVLfzklEu+rAwPXAAMKOJYZGPhUjceZhex4AXIy+RHGj1IONjj4HLa/EGxg4Hk9L8YyFFNivh3EfkI9YJ5i1L1GPS7NWZNIvI4mZJDBp31GjcVuAAZuKdjmo5YA83ZgEcdpPxOPf4UF7iJwfMyIOa7HmEIb88rkvWVsb+g9oTe9R/S6+Pea/v5Rpb+fZWKxel2wpqYntVjse/KpNpRC/pBwCeFS2EBz5UjkZRaLvcqqqh7TwT75jMtlA8XSHHN+mbyMeqBejB4dRuzoUgg0rkSj9yxnVTL5rBqN3oef6UQiWczjGf8PRXNGIo1qOOwsNkZzCvLY0Pr7p6gHyzz0iJ7GF1+gcFjGgi4X8R9WwmFWlkhkrOg9LRwOEiUEGiuSJ4txrEUinxfp5zL1uugCKaHQHXC3YJGh0Lvws3KoodBfaHp/Jhz+OB+IcxYLPWv3UyzNmS0v1S4i0F3MvbP432Ch0HeKIDAmCJstfkHwkr8swSCTg8EJVRCOovkjJvBfJ9Rg8EgOxMiCMGGfr2PLS7UtH2Jf3yv6GHpd/EssEPhMCQQYFvFt7h40OroGxxKYBvdpvAynCkQXhKAWCASL+E+Vy0W1jJoS9ZDrEb3p4+h1KR4O16LwVXxKTOvrE+jbR1+Mz/cOCwS2oLEojRVDpm0xgSBOMYEQe7pULiWbK0o1JdTWe0Mv1BONUY/U69I8C/n9Lyh+/23AVL//gtbb+15uTBA2wf9IxlgOn0+H4tF8oUB+fxBjhQIhVsmbb8mDGlQrlwM9qD7fBWP8NvW4pE/TYjC4UentvST39jKDi6ZQaPJ8nt+C4vMVCIQ8QcwtFAixpfJAjPOmMFQ75/f7L4ldXRsr5veY3NOzQ0WDSk8Pwz4JcFLt6WmUjWM7iPsVZ8w21et9wwS+E0S+j2IotlQeCTWolpGTUQ8aeqncl2bd3R8q3d03ZK+Xgd/k7u4JwIqSjZmhVFwJ8AFQ7t9pn2pS7WXxZpFVV69VvN44mAZTSlfXXbmriy0oXu8dPXe2RpxqLrtXsLhEGuXOTlrQBX27gEhGTqqxvETxeEiU60pnp/5uRu7oGJM9HgWMA6bT0ZHFflwKM26GcT0ncus38fb2Guxfp9oVL5DU3j4JmOLxDOnNd3SEZRyjeQ/2J2lfsiEbzMUPMSYpF/kpt14DtYzxycoXyO2+CKaVtrY9ssv1kuJ2/4xjWswWsb39bdntfkDHhGwgzRGI8kBDDsql50RuvQbVQk2qXfmXmNv9ltzampZaW5mJ3NZ2Mm/8NRzfzB/P0dZmxZrjJs3NPRshpy0uLaL2srgPKS7XZizoS2y/EV2uWvNnSO5bzuF4GgtLQciHksvFyoEz5CHFjmOOJQdyUm6qgRiqtXnF/aHxvtO5Xm5pacUCx3QhWloYQfu6rxWnBmKquOHedejQ11JzM9PBPlfELlBz83mpqYkRMva5ItYn7zXiwYNTgBlMkY8rY76iaG7eKjU2MtHpzKE1NGzlyphvApzOo2JDA7MAH1cme3k9Ix448Ddg+cjw0diqFwhiDIn797OiYGxVi6M6HG+K+/apgJVApZjVed+pr98kOhwTgIn19VloP5+sb4JiV5c4DscHWPyf4t69LJ+0jdwYYmnOqhDnYV2dI11XN/5vEA0kzF2ZN+La2i+w0CuiQbqmxsJsfjs0xrZte2LFCJTes+ccYPOmpiZLns/8F5eVIdDu3ecAW0hWjED4s+/j6erqHwFbSPAQ+dTyP3N27Yqmd+7MAPY/8Eisrr7Cf4tw48aNGzdu3Lhx48aNGzdu3Kz2D0PS33qvqzWBAAAAAElFTkSuQmCC"
                                                    />
                                                </view>
                                            </view>
                                            <view class="text">礼物排行榜</view>
                                            &lt;!&ndash;&ndash;&gt;
                                        </view>
                                    </view>&ndash;&gt;
                                </view>
                            </view>
                        </view>-->
            <view class="box-center">
                <view class="title">平台信息</view>
                <view class="bd">
                    <view class="van-row">
                        <view class="pd van-col van-col--6">
                            <view class="icon-text" @click="toUrl('/pages/user/announcement')">
                                <view>
                                    <view class="icon-img">
                                        <image
                                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAACIlBMVEUAAAAA/wAA//8Af38AqlUAzGYA1H8Av2AA338AqlUcxo4X0XQQz38P0ocN15Qa2YwY25IW04UUzn8Q1oQQz4cW25IV1pETzYMU14cU04kX35kW140Qzn0UzoIU14oZ3JcV1YoRz4AX3Zca3ZoSzoESz34X3JUZ2pMW2I0W1owa4Jwa4pwU04gRy3cRy3sRzXsRyXYTz4ETz4AW2I4W140X2ZMMvGQMvmQMvmUV0oYRzHkT0oMT0IMX2I8W2ZAU0YQU04QU0oQT0oUY2ZEX2ZAX2I8Y2pQY2pUTz4MQyngRyngU04YZ35kU0ocW2ZMY25MW144Sz4AU04gX25UV1osV1owSzn4LvWMMwGgMwWgV1YkV1IkY3ZYV1IoX2pMa4JwRzX0Rzn0Szn8V1osV1IsY3pkU1IgRy3oRy3sSz4ES0IELvWMLvWQLvmULvmYMvmUMv2cMwGcMwGkMwWkMwWoNwWoNwWsNwmsNwmwNw2wNw20NxG4OxG4OxXAOxnIPxXAPxnIPx3QPyHUPyHYQyHUQyHYQyXcQynkRynkRy3sRzHwRzH0RzX0SzH0SzX0SzX4SzX8Szn4Szn8SzoASz4ATz4IT0IIT0IQT0YQU0oUU0oYU0ocU04cU04gU1IkV1IkV1YsV1o0W1o0W140W144W148W2JAX2JAX2JEX2ZIX2pIX2pQX25QY25QY25YY3JYY3JcY3ZcY3ZgZ3pkZ35sa35v0RHhcAAAAa3RSTlMAAQECAwUGCAgJCQsQERMUFRcaHyAjJSkzNDc6Pz9MUVVaYmJjZWVoaWpqanR6enp7hIWKi46RkZKUmqOkqa2ysr/Aw8TGysrL1dXV1dbZ2dvf5+nr6+7x8fHz9PX29/f4+Pn7/Pz9/v7+/nl0uqoAAAKZSURBVFjD7db7O9NxFAfwk1uiFIWiXLrQRfcUiq5KpXIpuriUosuK5LJVZDWLrGEzJcaUzcxoKP9f5/P9fL/b13gO/eh5vq/n2Tmfc86e9/PstwEoFAqFYhXbXzn/lzRfeWBFQfl/lpW/oqBd1XMzM3OI19lZ6T2LhF31zpX9tsQyj+e3DJ88HtZZLUtcPiPlSirWuOIpt3sKseoWTU+zinNxHH4l9XIKGVThcqUHAkTfdHlNTi583YoGCEx3uSrIoHGn05kTBhBxcZzByTkumpgQNpciAMJy2JMMsjscdnvuRoDQbIcfuyA7FGBTLpscZNAvZqwgBiDg+E+GzVJHJwIAYgrGhB0ZNMrdjsf33sejfp7sw3X8HXEig2wjyGazlSfhkHDfJuLbBwm4TCofEZdkkJUZGrJaa9Jw2lpkHR62Soq24Sqtht8RGTTokxkEsPn64OAPxOYbWwCCMmVfIIMGBga+C/BxLhxg/Xn2Yi5sAAg/K7+TQf3fBP1Cz4sECDnNN2dCACLz+uV3MshisfT5FMbi6uhzi+XFsTUAsYV9FvmdDDL39JhMZnNvL+smU8l23O2uqtqDbUeJGcnuZJCxu9toNKCuLlYND5NxGRWFJfnRV4PBKL+TQV/8PTvED4efLjqRQR1cZ2eHV1YwQHDWwp3wJoM+L+HqwSPXltqTQTqd7pOovV2vZ5NezydGJ7+TQR//Axmk1Wo/IK23S5P/HjsZ1Mq0tbWSxDsZ1LLYe9SyFDJIo9G8Q1J9i3wbjcB7J4OamcZGtbpZRq1uamJVmsU7GfSGa2hgH1Z95JNwJ4PuvSbU18unu2RQRh2qrX3lVVcnvfjWd88gg9aeLFWpXiJWVSpf5Z3PbCo9tU75A6hQKBSr1T+n3Jms2mJ1wAAAAABJRU5ErkJggg==" />
                                    </view>
                                </view>
                                <view class="text">站内信息</view>
                                <label class="badge"></label>
                            </view>
                        </view>
                        <view class="pd van-col van-col--6">
                            <view class="icon-text" @click="toUrl('/pages/user/service/index')">
                                <view>
                                    <view class="icon-img">
                                        <image
                                            src="data:image/png;base64,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" />
                                    </view>
                                </view>
                                <view class="text">联系客服</view>
                                <!---->
                            </view>
                        </view>
                        <view class="pd van-col van-col--6">
                            <view class="icon-text" @click="toUrl('/pages/user/setting/aboutUs')">
                                <view>
                                    <view class="icon-img">
                                        <image
                                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAGXUlEQVR42u2Za1BUZRjHMZtqrKy0pumi2WWsZsTMclLDJLyBmFcQBVaBZLm44HJbYBEOchEXEcMMRbwROihKadP0xQ9OXx3LcaZsynKacSwb9n727C57dvfpfc/ZXfacPSuCyh71/c/8Zjnv8z/P/z3P7FnOQlQUEREREREREREREREREREREREREdF9oe3fwERdH+Q3nYYziL+b+oDe0Qd29Po74uyO05Dd2gsTHrrBUMdgfMNJj66x1+tAwBDYG3s9DVQvPPVQDKeuF6LrTsDVuh4PDIf6Hu8f9d3w9oM9nG54jzruMdce98BIQOcaa0/AtAdyOJVdMLGm23Oj+ms33Ak13d5ruNcDN6CtRz1dVUfdwMOKcIsItx6g474dRMUhdiHibMVhd7/2iHsft3bQ+VblIbcHrYOAwzyVPkLqYUC92MoDzqm4t/awuxP10CO+0xxhF8l2MMm9MFbT6d6n6XSBn/KD7nW4VnaA1QWvj5SyACygnttwb80Bl0Lk66AoeER2AyrtYNtK9rsgGE0nvMvV9rMXxbWRUNrBU8K/XsK9SzrgnVAf2yar4RS3u2ar97m86vYBwBT5UHbAuCiAMUXtLrYoaH34uDjUX/Hwx6wNZ5d3wDOBui9f3Y72sp+dI5sBqfe6ThZ+OQAC9rq8/gsIqd0l8trhOZyxZa/LFZo/cEoeT8Xofle1DVg2tzlBFWCAIyoKxpTuhCdVgtrdI0sHT+M9oCxPSP4eFy2Lz6LcVnglb7cTOFqFKHczL2FP/u4Bk7h2p+CeuLeyBZ4Pl5+/yz4p4gPKa4U3clocIIWyhY3hL8L5QzjPSMltcZ7DvbN3sXPD5jc734z4gBToFtqkc3gQICZb56jkLkLnzOXX7D58nmae7GY7x2BdjLg38uuc+Vzvnc5iyexmpwff3rL4HMrabv8pq8kOoTh+5N5BtTAOHeulPbdPpg/0szGf4r/do+PzUt7Pdzh/ls1vscwGp2pjgx1CaLR7s+qd3DfwzO3OnI0NDAgRn3Prekajjyb+3aNopKehY49kdoO9UD5P0RQ8pqhjrqTXMYBRBLGhztEZuB3r7d8qRPXhkL4Nv9rP4GcrX79jgnog3/5bQsHVx2X1sLiBck5NrWVupFIMpFK2AGkU406hmJnYk0HBE2m1zDneI/TdDvhche9zJa2OmYV6sEIPgz3/pG+1yvPvRqlVjtfWVds8CBBxZbmmn3tmiaXg0fU1tma05pXwhYHxrquxteJ3Ku6xkjI9m1LNXPPXU7bycNmUY4o8v6xSlglrtcyeZC0NYtZqba4kLZMg8Gvps1JeSaroM8Hn4l7JVbaBQP8qHj6L3pNcZJHX37GTyqzzkipsN9ZU0CBmdQV9M6nSOi8wmGQYi7xpayqsRgTw0LemnDasLrel4nMDfcrtMWsqbP9K+fFegjMjqlWldNzKMtq+sswKYlZp6OvoQiYHvBp6NVr/M1D3o+GR6iFAY726otS6yt9vWblxMsq+LpmN9oT3FtHhrCg2TPqsxGpYXmIFMehCzMtLbdOxL6EAxq8opk+H+iwirGEQ++hTCQWG8dweimzRyGOWOg/vLUFjfzViA0ossvYlqi0wiNWPd2mRJR574tWOKcj3q9A3MpYVBWP9JV5t4j6QE0tsS3DmYH7QeWiPERnOUpUxOqHQ4kVAgAIfWyxd2LNIxbwcX2C5NugxixhqXQjqxeE/XrrF8hfO4N+llq5AvnBP3sRCevT/E7JYZd25eLMZxCxRmQ0JBfQL6LZ6fLHKcknKc5e5hLNw5hKVxSDliUd7HfUBLcwzXUaAmEV5Zi337sk3tUnVR4bZh3R9Qa7lCy5zs1kbxn951AcUpzQxnypNgInL8aE0DyzY9N+LC/Js0+NyzG5//V6Ds3AmzsZ7kKjbRn1AsUpTy/xsEzt/kxH8xGabe7hatun74PXRAGfy2eYeYc3ExirNLbJ5aPxEYX49Jsvkick0wlDMyxJyO+eEJcvoic0wyfNrRrA+zjBVz91ogEgwZ4OhWvYDmp1uPP9RugFujd6HYVjMVggJqaNs2Q9o1nq9eVaqHu4FH67nCetB2bIf0Acp+oszU/qBRy8i3Ho431B+oQ9ny39AyTejZ6zVX3g/We+ekdwPowTOuoCzo4iIiIiIiIiIiIiIiIiIiIiIiIiIIqb/AfAvVJRG4WGjAAAAAElFTkSuQmCC" />
                                    </view>
                                </view>
                                <view class="text">关于我们</view>
                                <!---->
                            </view>
                        </view>
                        <view class="pd van-col van-col--6">
                            <view class="icon-text" @click="toUrl('/pages/user/myFeedback/index')">
                                <view>
                                    <view class="icon-img">
                                        <image
                                            src="data:image/png;base64,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" />
                                    </view>
                                </view>
                                <view class="text">意见反馈</view>
                                <!---->
                            </view>
                        </view>
                        <view class="pd van-col van-col--6">
                            <view class="icon-text" @click="clearCache">
                                <view>
                                    <view class="icon-img">
                                        <image
                                            src="data:image/png;base64,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" />
                                    </view>
                                </view>
                                <view class="text">清除缓存</view>
                                <!---->
                            </view>
                        </view>
                        <view class="pd van-col van-col--6">
                            <uni-link href="/#/pages/user/downloadPage" text="/pages/user/downloadPage"
                                showUnderLine="false">
                                <view class="icon-text">
                                    <view>
                                        <view class="icon-img">
                                            <image
                                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAEuklEQVR42u1aPWwcRRh9by5nn40MNjQgRGjoED10IKJgIkUUKBQRBQIhGiS7ASmSSxCFi6SASChC0ECDFAkigZ0G0YSegh6C6SKIDfbZdzuP4nbP59mb3b1j7EzEPOmTfbO7czvvvv8ZICEhISEhISEhISEhIeGkweOYdONTPYY2Vgm8DOJJCPNQs2cFmNKI55UJ7Ar4zQAbIq689CZvR0/Q99f0PIjrgJZ8DFR+s6Z8Q3K7BVw4+xZvRkvQD5/r0b2efgGw1PQZBX0RboN4+tzb/D3UmkxIgnYPsCKLJVmgEJuLPIJcfNelXGwT0YMQVkKuKShBEpaLBdlc5EjT8eJzQbDVUSndl0uW6WzINZ0KSpDVaRVGo2rXopJRybmPlU5J7jiLP3wiWoKsxdwEdE55XTXDnI1Zg+553iKI8RIk1muGL2w1DWe1aUDYHymwBk2wLp+P0oR5yDErbWANEiQ10pAyIeOdsuiMF9NzVGsPL5CMW4M0pY/1O1/VDOv+0SCrivflyZiEAlcHoaMYK5LIiXwwEQdC50EVNagqFYjOk2oYvOTcwZgJkkYy3AnDuSa0vZJrIuPXoHFhnvKUBqF9keQpYSLTIJcAr2aE6gcds9MKTRCbOuM6S/QRppoEWow5imWHUcx1yhxW4ZMqgq/KH3+dUYd5EYKtpGDaGr7xPHFn0qKmXniwt4hXg2xVCDmhDDDydkcQG/qPiNzEmlT841zFYfTzZJb0VP+8j0xMliNOVJNlwjUZddm5aew8DLsPEbwfREmTWUDzHddm3QFGrUHeHzp8u0MVuUbMtdik/bD/lZO2Uh9QeywfbglCVvoUko0bHc4s/Xg1CPgOFq9UKZA8XpqeaIeavo9LkyE249VHAJdXtdjp/j3Ta0OzM1Kvu6CDGajThfZnofndfE1LwO7+4PsXAezl/1tThKEddGYWtJ3P2+kOnut2wJkDsN0B9w/A9ix4qgce9EARvXc/4R0kJESDoCZ2+Z3ec2LvWcoM5zVm0CeydnyVb0x9YkeB1ukSmNGEsDWMoqJp/bRytX0rSicN9G/Q8pFR15ll1f0gW7OfX+Tmbh1sR9seI3HLyP4J4OE4w7zFwrT5nS+h9KV9vnky6aFowzxE+UqNxnmipn1wmF4pWoJkK0rUuhrNmA0AV421d2yr9QKtLgl6oDmhuckZxkvQwA9rrMXU/Ow/vv/Z7LmRmv3W+hvdnwV925SfwscxC6tBoc8oqjhTODycKQ6k4lAnhS/dhsZ7X3RuSPyj7uBm7sEH2msFq4jPB41uPdsa09LRD30P4f/UbSOV+kGKWoPUrTv2655ulQVsHxfdePXR691lZXjK1TxXxswfb7EKq9sCF4/Gaad61zht0pkPL+59Y9j9WJm9C8MXrdWlAWmeeTxhjuJWxCbGTUDPTBXFgPMZsvM50ZWOrvIdjG5Ga2LIcEXCXclvEiXTcA+UF9edE/al8TECcUfgerQErX09v2VpXpXFX0V0GUYZz8l6H2HuCfsSgaWoyB1Z+9raV3O/Rt0PAoAPLuw+3hdWIS2TOA1wTjW9Yh7dxqEgEjwswg5LuVHpC9oisNmyZn3telhyEhISEhISEhISEhISEu4N/gVfK2wQvSNAXgAAAABJRU5ErkJggg==" />
                                        </view>
                                    </view>
                                    <view class="text">下载APP</view>
                                    <!---->
                                </view>
                            </uni-link>

                        </view>
                        <view class="pd van-col van-col--6">
                            <view class="icon-text" @click="toUrl('/pages/user/reportRecord/index')">
                                <view>
                                    <view class="icon-img">
                                        <image
                                            src="data:image/png;base64,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" />
                                    </view>
                                </view>
                                <view class="text">举报记录</view>
                                <!---->
                            </view>
                        </view>
                        <view class="pd van-col van-col--6">
                            <view class="icon-text" @click="isShow = true">
                                <view>
                                    <view class="icon-img">
                                        <image
                                            src="data:image/png;base64,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" />
                                    </view>
                                </view>
                                <view class="text">平台设置</view>
                                <!---->
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view><!----><!---->
        <view class="vip-box van-overlay" style="display: none">
            <view class="vip-wrapper">
                <view class="block">
                    <view class="t-b">
                        <text>VIP特权</text>
                    </view>
                    <view class="text">
                        <p>1.论坛昵称变成红色</p>
                        <view>
                            2.发帖可免审核流程<br />
                            3.成长值领取发翻倍奖励<br />
                            4.购买年度VIP服务可获得改名卡一张<br />
                        </view>
                    </view>
                    <view class="l-r-btn">
                        <text>一月10元</text>
                        <text>一年100元</text>
                    </view>
                    <view class="close">
                        <i class="van-icon van-icon-close" style="font-size: 32px"><!----></i>
                    </view>
                </view>
            </view>
        </view>
        <!--设置平台-->
        <set-lottery ref="setLottery" @showLottery="showLottery" v-show="isShow"></set-lottery>
        <!--底部-->
        <view v-if="$store.state.appInfoStore.configs && $store.state.appInfoStore.configs.isDebug" class="version-code"
            @click="testClick">
            {{ $store.state.appInfoStore.configs.version_dev }}</view>
        <view style="height: 10px">
            <TabBar :current="3" />
        </view>

        <uni-popup ref="withdraw" type="center" background-color="#fff">
            <view class="confirm-box">
                <view class="title">提示</view>
                <view class="notice">
                    <text>您还没有设置资金密码，</text>
                    <text>提现需先设置资金密码。</text>
                </view>
                <view class="btn-box">
                    <view class="cancel-btn" @click="cancel">取消</view>
                    <view class="confirm-btn" @click="confirm">确认</view>
                </view>
            </view>
        </uni-popup>

        <AlertInjectLayer />
    </view>
</template>

<script>
import TabBar from '@/components/Tabbar/Luntan'
import SetLottery from "@/components/common/setLottery/setLottery";
import AlertInjectLayer from "@/components/common/alert/AlertInjectLayer.vue"

import {
    info
} from '@/utils/user/index.js'
import {
    aboutUs
} from "@/utils/user/index.js";
import {
    init
} from "@/utils/lottery/mine";
import Playing from "@/utils/common/playing";
import defaultTemplate from "@/utils/defaultTemplate";

export default {
    name: "index",
    components: {
        AlertInjectLayer,
        TabBar,
        SetLottery,
    },
    data() {
        return {
            isEnd: false,
            detailLogo: '@/static/img/user/Frame21.png',
            playing: new Playing(),
            isLogin: false,
            userInfo: {},
            isShow: false,
            qrcodeImg: "",
            downloadUrl: "",
            status: 0,
            statusBarH: uni.getStorageSync("systemInfo").statusBarHeight + "px",
            testTotalClick: 0
        }
    },
    onLoad() {
        let configData = uni.getStorageSync('config')
        try {
            configData.forEach((item, index) => {
                if (item.type == 24) {
                    this.detailLogo = item.url
                    throw Error();
                }
            })
        } catch (err) {
            console.log(err)
        }
    },
    onShow() {
        uni.hideTabBar()
        uni.setNavigationBarTitle({
            title: "我的"
        }),
            this.isLogin = global.isLogin()
        if (this.isLogin) {
            this.getUserInfo()
        }
        this.getCommonData()
        this.getInit()
    },


    methods: {
        setAmount(num) {
            return this.playing.setAmount(num, 2, ".")
        },
        async getInit() {
            if (this.isLogin) {
                await init().then(res => {
                    if (res.code == 200) {
                        this.status = res.result.status
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        logout() {
            this.isLogin = false
        },
        //获取config数据
        getCommonData() {
            aboutUs().then(res => {
                res.result.forEach(element => {
                    switch (element.type) {
                        case "1":
                            break;
                        case "2":
                            break;
                        case "3":
                            this.qrcodeImg = element.url
                            break;
                        case "4":
                        case "5":
                        case "6":
                            this.downloadUrl = element.url
                            break;
                    }
                });
            })
        },
        copyPath() {
            let text = this.downloadUrl;
            uni.setClipboardData({
                data: text,
                success: (res) => {
                    this.$refs.popupCode.close()
                    uni.showToast({
                        title: "复制成功"
                    })
                }
            })
        },
        closeDialog() {
            this.$refs.popupCode.close()
        },
        //复制邀请码
        copyText() {
            let text = this.userInfo.inviteCode;
            uni.setClipboardData({
                data: text,
                success: (res) => {
                    uni.showToast({
                        title: "复制成功"
                    })
                }
            })
        },
        toLogin() { //前往登录页面
            uni.navigateTo({
                url: "/pages/liuhe/login"
            })
        },
        openQrcode() {
            this.$refs.popupCode.open()
        },
        openVip() {
            this.$refs.popup.open()
        },
        chargeVip() {
            this.$refs.popup.close()
            uni.showToast({
                title: "兑换成功后才能购买VIP",
                icon: "none"
            })
        },
        getUserInfo() { //从storage获取用户信息
            this.userInfo = uni.getStorageSync('userInfo');
            /*        let prams = {userId:this.userInfo.id}*/
            let prams = {}
            info(prams).then(res => {
                const result = defaultTemplate({
                    createType: '',
                    id: "",
                    userName: "",
                    status: 1,
                    phone: '',
                    nickname: "",
                    coin: 0,
                    flowers: 0,
                    score: 0,
                    userLevel: 1,
                    headImgUrl: "",
                    izAuth: 0,
                    expert: 0,
                    commentStatus: 1,
                    isRoom: 1,
                    roomSpeak: 1,
                    exchange: 1,
                    remark: '',
                    black: 0,
                    userBlock: Boolean,
                    vip: Boolean,
                    concernCount: 0,
                    fansCount: 0,
                    collectCount: 0,
                    publishCount: 0,
                    thumbUpCount: 0,
                    inviteCode: '',
                    concern: 0,
                    lastTime: '',
                    medalList: [{
                        conditions: "",
                        filePath: "",
                        hasMedal: 0,
                        id: 0,
                        name: "",
                        remark: "",
                        rewardAmount: 0,
                        rewardScore: 0,
                        status: 0
                    }],
                    userType: ""
                }, res.result)
                console.log('result', result);
                this.userInfo = result
                uni.setStorageSync('userInfo', this.userInfo);
            }).catch(err => {
                console.log(err)
            })
        },
        withdraw(url) {
            if (this.status == 2) {
                this.$refs.withdraw.open()
                return false
            } else if (this.status == 3) {
                uni.navigateTo({
                    url: "/pages/user/bank/bind"
                })
                return false
            } else if (this.status == 0) {
                return false
            }
            uni.navigateTo({
                url: url
            })
        },
        cancel() {
            this.$refs.withdraw.close()
        },
        confirm() {
            this.cancel()
            uni.navigateTo({
                url: "/pages/user/pwd/set_pwd"
            })
        },
        toUrl(url) {
            this.isLogin = global.isLogin()
            if (!this.isLogin) {
                uni.navigateTo({
                    url: "/pages/liuhe/login"
                })
            } else {
                if (this.userInfo.userType == "demo") {
                    uni.$emit('showPop', { refName: 'AlertTestMsg', })
                    return false
                }
                uni.navigateTo({
                    url: url
                })
            }
        },
        qidai() {
            pop("敬请期待", 2000)
        },
        //清除缓存
        clearCache() {
            // #ifdef APP-PLUS
            pop("清除成功")
            // #endif
            // #ifdef H5
            alert('清除成功')
            // #endif
        },
        //显示
        showLottery() {
            this.isShow = false
        },
        testClick() {
            this.testTotalClick++;
            if (this.testTotalClick >= 3) {
                this.testTotalClick = 0;
                uni.navigateTo({
                    url: "/pages/debug/logs/logs"
                })
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.confirm-box {
    height: 339rpx;
    width: 540rpx;
    border-radius: 10rpx;
    padding: 20rpx 54rpx 20rpx 54rpx;

    .title {
        height: 80rpx;
        font-weight: 400;
        font-size: 32rpx;
        line-height: 80rpx;
        text-align: center;
        color: #9A9A9A;
        border-bottom: 2rpx solid #E6E6E6;
    }

    .notice {
        height: 160rpx;
        font-weight: 400;
        font-size: 28rpx;
        text-align: center;
        color: #333333;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .btn-box {
        display: flex;
        color: #FFFFFF;
        font-weight: 400;
        font-size: 26rpx;

        .cancel-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 60rpx;
            width: 200rpx;
            border-radius: 264rpx;
            padding: 10rpx 74rpx;
            background: #8CB2C9;
            margin-right: 20rpx;
        }

        .confirm-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 60rpx;
            width: 200rpx;
            border-radius: 264rpx;
            padding: 10rpx 74rpx;
            background: #FF9900;
            margin-left: 20rpx;
        }
    }
}

.bb-box {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15rpx 0;
}

.home-my {
    padding-bottom: 380rpx;
    font-family: PingFangSC-Regular, Microsoft YaHei, Helvetica;
    width: 100%;
    max-width: 960rpx;
    margin: auto;
    background: #fff;

    .status-bar-height {
        background-color: #07c160;
        width: 100%;
        position: fixed;
        top: 0;
        z-index: 999;
    }

    .block {
        width: 580rpx;
        height: 580rpx;
        background-image: url(@/static/img/user/vipImg.png);
        background-size: 100% 100%;
        position: relative;

        .t-b {
            position: absolute;
            right: 86rpx;
            top: 180rpx;

            text {
                width: 132rpx;
                height: 60rpx;
                background: #a1500c;
                border-radius: 30rpx;
                color: #fee2c7;
                text-align: center;
                line-height: 60rpx;
                display: inline-block;
                font-weight: 600;
            }
        }

        .text {
            position: absolute;
            font-size: 24rpx;
            top: 180rpx;
            margin-left: 106rpx;
            line-height: 44rpx;
        }

        .l-r-btn {
            position: absolute;
            bottom: 40rpx;
            width: 100%;
            text-align: center;

            text {
                width: 200rpx;
                height: 84rpx;
                background: #ffe2c6;
                border-radius: 42rpx;
                border: 0.02rem solid #979797;
                color: #a1500c;
                font-size: 32rpx;
                line-height: 84rpx;
                display: inline-block;
                margin-left: 40rpx;
            }
        }

        .close {
            text-align: center;
            font-size: 24rpx;
            color: #a9a9a9;
            position: absolute;
            bottom: -100rpx;
            left: 50%;
            margin-left: -32rpx;
        }
    }

    .dialog__content {
        padding: 0 14rpx;
        width: 640rpx;

        .qrcode-top {
            text-align: right;
            margin: 14rpx 0;

            image {
                width: 46rpx !important;
            }
        }

        #qrcode {
            image {
                display: block;
                height: 390rpx;
                width: 390rpx;
                margin: 0 auto;
            }
        }

        .my-code {
            margin-top: 32rpx;
            color: #4b4b4b;
            font-size: 36rpx;
            line-height: 50rpx;
            text-align: center;
        }

        .footer-btn-group {
            display: flex;

            .footer-btn-group-btn {
                color: #07c160;
                background-color: #fff;
                height: 80rpx;
                line-height: 80rpx;
                font-size: 32rpx;
                text-align: center;
                flex: 1;
            }

            .footer-btn-group-left {
                font-size: 32rpx;
                border-top: 1px solid #f8f8f8;
                border-right: 1px solid #f8f8f8;
                border-bottom-left-radius: 32rpx;
            }

            .footer-btn-group-right {
                font-size: 32rpx;
                border-top: 1px solid #f8f8f8;
                border-bottom-right-radius: 32rpx;
            }
        }
    }
}

.home-my .head-body {
    background-color: #07c160;
    padding: 54rpx 30rpx 60rpx;
    position: relative;
}

.home-my .head-body .user-info {
    height: 128rpx;
    position: relative;
    padding-left: 170rpx;
}

.home-my .head-body .user-info .my-user-img {
    width: 122rpx;
    height: 122rpx;
    position: absolute;
    left: 10rpx;
    border-radius: 50%;
    border: 4rpx solid #fff;
}

.home-my .head-body .user-info .user-text {
    color: #fff;
    padding-top: 20rpx;
    position: relative;
}

.home-my .head-body .user-info .user-text .not-login {
    width: 136px;
    height: 42px;
    line-height: 42px;
    background: #fff;
    box-shadow: 0 1px 2px 0 #09a958;
    border-radius: 22px;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #07c160;
}

.home-my .head-body .user-info .user-text .user-name {
    color: #fff;
    font-size: 32rpx;
    font-weight: 500;
}

.m-lv {
    width: 90rpx;
    height: 28rpx;
    line-height: 28rpx;
    padding-left: 20rpx;
    color: #fff;
    vertical-align: top;
    font-size: 24rpx;
    display: inline-block;
    padding-top: 6rpx;
    white-space: nowrap;
}

.m-lv image {
    width: 24rpx;
    vertical-align: bottom;
    margin-right: 10rpx;
}

.home-my .head-body .user-info .user-text .user-code {
    font-size: 28rpx;
    padding-top: 30rpx;
}

.home-my .head-body .user-info .user-text .user-code .hh {
    gap: 5px;
    display: flex;
    align-items: center;
    margin-right: 30rpx;
    font-size: 30rpx;
}

.home-my .head-body .user-info .user-text .user-code label {
    float: left;
}

.home-my .head-body .user-info .user-text .user-code label image {
    width: 32rpx;
    height: 32rpx;
    vertical-align: text-top;
}

.home-my .head-body .user-info .user-text .user-code .ma {
    display: flex;
    align-items: center;
    // margin-top: 4rpx;
    // line-height: 26rpx;
}

.home-my .head-body .user-info .user-text .user-code .ma text {

    float: right;
    width: 88rpx;
    height: 40rpx;
    border-radius: 20rpx;
    border: 2rpx solid #fff;
    text-align: center;
    font-size: 24rpx;
    line-height: 40rpx;
    margin-top: -4rpx;
    margin-left: 20rpx;
}

.home-my .head-body .user-info .user-text .tool {
    position: absolute;
    right: 0;
    top: 24rpx;
}

.home-my .head-body .user-info .user-text .tool image {
    width: 32rpx;
    height: 32rpx;
    margin-left: 30rpx;
}

.home-my .balance {
    height: 150rpx;
    background: #fff;
    position: relative;
}

.home-my .balance .top-bg {
    background-color: #07c160;
    height: 74rpx;
}

.home-my .balance .text {
    position: absolute;
    height: 160rpx;
    left: 30rpx;
    right: 30rpx;
    background: #fff;
    padding: 0 30rpx;
    top: 0;
    box-shadow: 0 10rpx 16rpx #ddd;
    border-radius: 10rpx;
    display: flex;
}

.home-my .balance .text .cell1 {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.home-my .balance .text .tm1 {
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;

    .number {
        margin-left: 8rpx;
        font-size: 28rpx !important;
    }
}

.home-my .balance .text text {
    color: #07c160;
}

.home-my .balance .text .text-center,
.home-my .balance .text .tm1 p {
    display: flex;
    align-items: center;
    font-size: 28rpx;
}

.home-my .balance .text .text-center image {
    margin-right: 10rpx;
}

.home-my .balance .text image {
    width: 30rpx;
    height: 30rpx;
}

.home-my .balance .text .cell3 {
    width: 2rpx;
    background: #eee;
    margin: 20rpx;
}

.home-my .balance .text .cell2 {
    width: 230rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.home-my .balance .text text {
    color: #07c160;
}

.home-my .member-box {
    height: 148rpx;
    background-image: url(@/static/img/user/member-bg.png);
    margin: 0 30rpx;
    background-size: 100% 100%;
    color: #fff;
    position: relative;
    padding-left: 140rpx;
}

.home-my .member-box .userimg {
    position: absolute;
    width: 80rpx;
    height: 80rpx;
    border: 4rpx solid #fff;
    border-radius: 50%;
    top: 30rpx;
    left: 30rpx;
    overflow: hidden;
}

.home-my .member-box .userimg image {
    width: 100%;
    height: 100%;
}

.home-my .member-box .usertext .name {
    padding-top: 34rpx;
    font-size: 32rpx;
    font-weight: 600;
}

.home-my .member-box .usertext .text {
    font-size: 24rpx;
    font-weight: 400;
    padding-top: 0rpx;
}

.home-my .member-box .go-btn {
    position: absolute;
    width: 186rpx;
    height: 68rpx;
    background: #ffecc7;
    box-shadow: 0 12rpx 16rpx 0 #e6a227;
    border-radius: 34rpx;
    text-align: center;
    color: #b5790d;
    font-weight: 600;
    font-size: 32rpx;
    line-height: 68rpx;
    right: 30rpx;
    top: 40rpx;
}

.home-my .body-middld {
    box-sizing: border-box;
    padding: 0 0;
    // display: inline-block;
}

.box-center {
    clear: both;
}

.home-my .box-center,
.home-my .box-center .mt {
    margin-top: 30rpx;
}

.home-my .box-center .title {
    font-size: 36rpx;
    padding: 24rpx 30rpx;
    font-weight: 600;
}

.home-my .box-center .bd {
    text-align: center;
}

.icon-text {
    display: inline-block;
    text-align: center;
    position: relative;
}

.home-my .box-center .bd .icon-img image {
    width: 72rpx;
    height: 72rpx;
}

.home-my .box-center .bd .text {
    padding: 10rpx 0;
    font-size: 24rpx;
}

.icon-text .text {
    color: #555;
}

.icon-text .badge {
    position: absolute;
    top: -8rpx;
    right: -8rpx;
    background: red;
    color: #fff;
    font-size: 12px;
    border-radius: 50%;
    min-width: 28rpx;
    height: 28rpx;
    text-align: center;
    line-height: 28rpx;
}

.home-my .advert-img {
    margin-top: 20rpx;
    clear: both;
    width: 100%;
    height: 200rpx;

    image {
        width: 100%;
        height: 100%;
    }
}

.version-code {
    text-align: center;
    font-size: 16px;
    color: #9A9A9A;
    position: relative;
    top: 100px;
}
</style>