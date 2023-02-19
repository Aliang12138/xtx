<script setup lang="ts"></script>

<template>
  <view class="sk-container">
    <!-- <view class="back"></view> -->
    <scroll-view
      enhanced="true"
      scroll-with-animation="true"
      scroll-y="true"
      class="viewport"
      id="scrollView"
      enable-back-to-top="true"
    >
      <view
        class="goods anchor"
        data-anchor-index="0"
        style="scroll-snap-align: none"
      >
        <view class="preview">
          <swiper circular="true" current="0" autoplay="false"></swiper>
          <view class="indicator">
            <text class="current sk-transparent sk-opacity">4</text>
            <text class="split sk-transparent sk-opacity">/</text>
            <text class="total sk-transparent sk-opacity">5</text>
          </view>
        </view>
        <view class="meta">
          <view class="price">
            <text class="symbol sk-transparent sk-opacity">¥</text>
            <text class="number sk-transparent sk-text-18-7500-223 sk-text"
              >136.00</text
            >
          </view>
          <view class="brand">
            <image class="sk-image"></image>
          </view>
          <view class="name ellipsis sk-transparent sk-text-14-2857-852 sk-text"
            >休闲潮流运动男士胸包</view
          >
          <view class="remarks sk-transparent sk-text-0-0000-732 sk-text"
            >轻便休闲运动斜挎胸包app</view
          >
        </view>
        <view class="related">
          <view class="item arrow sk-pseudo sk-pseudo-circle">
            <text class="label sk-transparent sk-text-18-7500-49 sk-text"
              >选择</text
            >
            <text
              class="text ellipsis sk-transparent sk-text-18-7500-592 sk-text"
              >白色 红外体温计 1件</text
            >
          </view>
          <view class="item arrow sk-pseudo sk-pseudo-circle">
            <text class="label sk-transparent sk-text-18-7500-111 sk-text"
              >送至</text
            >
            <text
              class="text ellipsis sk-transparent sk-text-18-7500-570 sk-text"
              >北京市顺义区京顺路9号黑马程序员</text
            >
          </view>
          <view class="item arrow sk-pseudo sk-pseudo-circle">
            <text class="label sk-transparent sk-text-18-7500-987 sk-text"
              >服务</text
            >
            <text
              class="text ellipsis sk-transparent sk-text-18-7500-633 sk-text"
              >无忧退 快速退款 免费包邮</text
            >
          </view>
        </view>
      </view>
      <view
        class="comments panel anchor"
        data-anchor-index="1"
        style="scroll-snap-align: none"
      >
        <view class="title arrow sk-pseudo sk-pseudo-circle"></view>
      </view>
    </scroll-view>
    <view class="toolbar">
      <view class="icons">
        <button
          class="collect sk-transparent sk-button sk-pseudo sk-pseudo-circle"
        >
          <text class="icon-heart sk-pseudo sk-pseudo-circle"></text>收藏
        </button>
        <button
          class="contact sk-transparent sk-button sk-pseudo sk-pseudo-circle"
          open-type="contact"
        >
          <text class="icon-handset sk-pseudo sk-pseudo-circle"></text>客服
        </button>
        <button
          class="cart sk-transparent sk-button sk-pseudo sk-pseudo-circle"
        >
          <text class="icon-cart sk-pseudo sk-pseudo-circle"></text>购物车
        </button>
      </view>
      <view class="buttons">
        <view
          class="addcart sk-transparent sk-text-31-9444-8 sk-text"
          data-button-type="cart"
          style="background-position-x: 50%"
        >
          加入购物车
        </view>
        <view
          class="payment sk-transparent sk-text-31-9444-416 sk-text"
          data-button-type="payment"
          style="background-position-x: 50%"
        >
          立即购买
        </view>
      </view>
    </view>
  </view>
</template>

<style>
/*
此文件为开发者工具生成，生成时间: 2023/2/19下午4:33:29

在 C:\Users\37066\Desktop\xtx静态结构\erabbit-uni-app-typescript-template\dist\dev\mp-weixin\pages\goods\index.wxss 中引入样式
```
@import "./index.skeleton.wxss";
```

更多详细信息可以参考文档：https://developers.weixin.qq.com/miniprogram/dev/devtools/skeleton.html
*/
.sk-transparent {
  color: transparent !important;
}
.sk-opacity {
  opacity: 0 !important;
}
.sk-text-18-7500-223 {
  background-image: linear-gradient(
    transparent 18.75%,
    #eeeeee 0%,
    #eeeeee 81.25%,
    transparent 0%
  ) !important;
  background-size: 100% 89.6rpx;
  position: relative !important;
}
.sk-text {
  background-origin: content-box !important;
  background-clip: content-box !important;
  background-color: transparent !important;
  color: transparent !important;
  background-repeat: repeat-y !important;
}
.sk-text-14-2857-852 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 44.8rpx;
  position: relative !important;
}
.sk-text-0-0000-732 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 24rpx;
  position: relative !important;
}
.sk-text-18-7500-49 {
  background-image: linear-gradient(
    transparent 18.75%,
    #eeeeee 0%,
    #eeeeee 81.25%,
    transparent 0%
  ) !important;
  background-size: 100% 41.6rpx;
  position: relative !important;
}
.sk-text-18-7500-592 {
  background-image: linear-gradient(
    transparent 18.75%,
    #eeeeee 0%,
    #eeeeee 81.25%,
    transparent 0%
  ) !important;
  background-size: 100% 41.6rpx;
  position: relative !important;
}
.sk-text-18-7500-111 {
  background-image: linear-gradient(
    transparent 18.75%,
    #eeeeee 0%,
    #eeeeee 81.25%,
    transparent 0%
  ) !important;
  background-size: 100% 41.6rpx;
  position: relative !important;
}
.sk-text-18-7500-570 {
  background-image: linear-gradient(
    transparent 18.75%,
    #eeeeee 0%,
    #eeeeee 81.25%,
    transparent 0%
  ) !important;
  background-size: 100% 41.6rpx;
  position: relative !important;
}
.sk-text-18-7500-987 {
  background-image: linear-gradient(
    transparent 18.75%,
    #eeeeee 0%,
    #eeeeee 81.25%,
    transparent 0%
  ) !important;
  background-size: 100% 41.6rpx;
  position: relative !important;
}
.sk-text-18-7500-633 {
  background-image: linear-gradient(
    transparent 18.75%,
    #eeeeee 0%,
    #eeeeee 81.25%,
    transparent 0%
  ) !important;
  background-size: 100% 41.6rpx;
  position: relative !important;
}
.sk-text-31-9444-8 {
  background-image: linear-gradient(
    transparent 31.9444%,
    #eeeeee 0%,
    #eeeeee 68.0556%,
    transparent 0%
  ) !important;
  background-size: 100% 72rpx;
  position: relative !important;
}
.sk-text-31-9444-416 {
  background-image: linear-gradient(
    transparent 31.9444%,
    #eeeeee 0%,
    #eeeeee 68.0556%,
    transparent 0%
  ) !important;
  background-size: 100% 72rpx;
  position: relative !important;
}
.sk-button {
  color: #efefef !important;
  background: #efefef !important;
  border: none !important;
  box-shadow: none !important;
}
.sk-image {
  background: #efefef !important;
}
.sk-pseudo::before,
.sk-pseudo::after {
  background: #efefef !important;
  background-image: none !important;
  color: transparent !important;
  border-color: transparent !important;
}
.sk-pseudo-rect::before,
.sk-pseudo-rect::after {
  border-radius: 0 !important;
}
.sk-pseudo-circle::before,
.sk-pseudo-circle::after {
  border-radius: 50% !important;
}
.sk-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: transparent;
}
</style>
