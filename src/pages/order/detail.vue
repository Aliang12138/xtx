<script setup lang="ts">
import { toRefs, getCurrentInstance, ref } from "vue";
import { onLoad, onReady } from "@dcloudio/uni-app";
import useAppStore from "@/store";
import guess from "@/components/guess/index.vue";
import {
  getMemberOrderById,
  GetMemberOrderByIdResult,
  OrderState,
} from "@/apis/order";

// 解构出unix方法
import { unix } from "dayjs";
import { getPayMock, getPayWxPayMiniPay } from "@/apis/pay";

const appStore = useAppStore();
const { safeArea, platform } = toRefs(appStore);

const pageInstance: any = getCurrentInstance();

onReady(() => {
  pageInstance.ctx.$scope.animate(
    ".navbar .title",
    [{ opacity: 0 }, { opacity: 1 }],
    600,
    {
      scrollSource: "#scrollView",
      timeRange: 600,
      startScrollOffset: 0,
      endScrollOffset: 120,
    }
  );
});

//-----------------------------------
const order = ref({} as GetMemberOrderByIdResult);
onLoad(async ({ id }) => {
  if (id) {
    order.value = await getMemberOrderById(id);
    if (order.value.orderState === OrderState["待付款"]) {
      //开启定时器
      let timerId = setInterval(() => {
        //秒数减少
        order.value.countdown--;
        //如果倒计时结束
        if (order.value.countdown < 0) {
          //清理定时器
          clearInterval(timerId);
          //本地更新订单状态
          order.value.orderState = OrderState["已取消"];
        }
      }, 1000);
    }
  }
});

//支付订单
const orderPay = async () => {
  try {
    //真正支付的api
    // const payInfo = await getPayWxPayMiniPay(order.value.id);
    // //调用微信支付api
    // await wx.requestPayment(payInfo);

    //模拟接口
    await getPayMock(order.value.id);

    uni.showToast({ title: "支付成功" });
    setTimeout(() => {
      uni.navigateTo({ url: "/pages/order/payment" });
    }, 1000);
  } catch (error) {
    uni.showToast({ icon: "error", title: "支付失败" });
    setTimeout(() => {
      uni.navigateTo({ url: "/pages/order/index" });
    }, 1000);
  }
};
</script>

<template>
  <view class="navbar" :style="{ paddingTop: safeArea?.top + 'px' }">
    <view class="wrap">
      <navigator open-type="navigateBack" class="back icon-left"></navigator>
      <view :class="['title', platform]">订单详情</view>
    </view>
  </view>

  <scroll-view
    class="viewport"
    id="scrollView"
    enhanced
    scroll-y
    :show-scrollbar="false"
  >
    <!-- 订单状态 -->
    <view class="overview" :style="{ paddingTop: safeArea!.top + 40 + 'px' }">
      <template v-if="order.orderState === OrderState['待付款']">
        <view class="status icon-clock">等待付款</view>
        <view class="tips">
          <text>应付金额: ¥{{ order.payMoney }}</text>
          <text class="countdown"
            >支付剩余{{ unix(order.countdown).format("mm分ss秒") }}</text
          >
        </view>
        <view @tap="orderPay" class="button">去支付</view>
      </template>
      <template v-if="order.orderState === OrderState['已取消']">
        <view class="status icon-clock">已取消</view>
      </template>
      <template v-if="order.orderState === OrderState['已完成']">
        <view class="status icon-clock">已完成</view>
      </template>
      <template v-if="order.orderState === OrderState['待发货']">
        <view class="status icon-clock">待发货</view>
      </template>
      <template v-if="order.orderState === OrderState['待收货']">
        <view class="status icon-clock">待收货</view>
      </template>
      <template v-if="order.orderState === OrderState['待评价']">
        <view class="status icon-clock">待评价</view>
      </template>
    </view>

    <!-- 配送状态 -->
    <view class="shipment" v-if="order.orderState === OrderState['待收货']">
      <!-- 物流信息 -->
      <navigator
        class="logistics"
        hover-class="none"
        url="/pages/order/logistics/index"
      >
        <view class="message"
          >您已在北京顺义后沙峪智慧城7号楼店完成取件，感谢使用菜鸟驿站，期待再次为您服务。</view
        >
        <view class="date">2020-11-21 09:15:09</view>
      </navigator>
      <!-- 收货地址 -->
      <view class="locate">
        <view class="user">张无忌 13824686868</view>
        <view class="address">北京市顺义区后沙峪地区安平北街6号院</view>
      </view>
    </view>

    <!-- 商品信息 -->
    <view class="goods">
      <view class="item">
        <navigator v-for="item in order.skus" :key="item.id" hover-class="none">
          <image class="cover" :src="item.image"></image>
          <view class="meta">
            <view class="name ellipsis">{{ item.name }}</view>
            <view class="type">{{ item.attrsText }}</view>
            <view class="price">
              <view class="original">
                <text class="symbol">¥</text>
                <text>{{ item.curPrice }}</text>
              </view>
              <view class="actual">
                <text class="text">实付: </text>
                <text class="symbol">¥</text>
                <text>{{ item.realPay }}</text>
              </view>
            </view>
            <view class="quantity">x{{ item.quantity }}</view>
          </view>
        </navigator>
        <view class="action">
          <view
            v-if="order.orderState === OrderState['已完成']"
            class="button primary"
            >申请售后</view
          >
          <navigator url="/pages/comments/publish/index" class="button"
            >去评价</navigator
          >
        </view>
      </view>
      <!-- 合计 -->
      <view class="total">
        <view class="row">
          <view class="text">商品总价: </view>
          <view class="symbol">{{ order.totalMoney }}</view>
        </view>
        <view class="row">
          <view class="text">运费: </view>
          <view class="symbol">{{ order.postFee }}</view>
        </view>
        <view class="row paid">
          <view class="text">实付: </view>
          <view class="symbol primary">{{ order.payMoney }}</view>
        </view>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="detail">
      <view class="title">订单信息</view>
      <view class="row">
        <view>订单编号: {{ order.id }}</view>
        <view>下单时间: {{ order.createTime }}</view>
        <view>支付方式: 在线支付</view>
        <view>支付渠道: 微信支付</view>
      </view>
    </view>

    <!-- 猜你喜欢 -->
    <guess :source="[]"></guess>
  </scroll-view>

  <view class="toobar">
    <view @tap="orderPay" class="primary">去支付</view>
    <view class="default">取消订单</view>
  </view>

  <view v-if="false" class="popup-root">
    <view class="title">订单取消</view>
    <view class="description">
      <view class="tips">请选择取消订单的原因:</view>
      <view class="cell">
        <text class="text">商品无货</text>
        <text class="icon-checked"></text>
      </view>
      <view class="cell">
        <text class="text">不想要了</text>
        <text class="icon-ring"></text>
      </view>
      <view class="cell">
        <text class="text">商品信息填错了</text>
        <text class="icon-ring"></text>
      </view>
      <view class="cell">
        <text class="text">地址信息填写错误</text>
        <text class="icon-ring"></text>
      </view>
      <view class="cell">
        <text class="text">商品降价</text>
        <text class="icon-ring"></text>
      </view>
      <view class="cell">
        <text class="text">其它</text>
        <text class="icon-ring"></text>
      </view>
    </view>
    <view class="footer">
      <view class="button">取消</view>
      <view class="button primary">确认</view>
    </view>
  </view>
</template>

<style>
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.navbar {
  width: 750rpx;
  color: #fff;
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/order_bg.png);
  background-size: cover;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
}

.navbar .title {
  height: 40px;
  line-height: 30px;
  text-align: center;
  font-size: 17px;
  font-weight: 500;
  opacity: 0;
}

.navbar .android {
  text-align: left;
  padding-left: 42px;
}

.navbar .wrap {
  position: relative;
}

.navbar .back {
  position: absolute;
  left: 10px;
  top: 4px;
  line-height: 1;
  font-size: 23px;
  z-index: 9;
}

.viewport {
  background-color: #f7f7f8;
}

.overview {
  display: flex;
  flex-direction: column;
  align-items: center;

  line-height: 1;
  padding-bottom: 30rpx;
  color: #fff;
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/order_bg.png);
  background-size: cover;
}

.overview .status {
  font-size: 36rpx;
}

.overview .status::before {
  margin-right: 6rpx;
  font-weight: 500;
}

.overview .tips {
  margin-top: 30rpx;
  font-size: 24rpx;
}

.overview .tips .countdown {
  margin-left: 10rpx;
}

.overview .button {
  width: 260rpx;
  height: 64rpx;
  text-align: center;
  line-height: 64rpx;
  margin-top: 30rpx;
  font-size: 28rpx;
  color: #27ba9b;
  border-radius: 68rpx;
  background-color: #fff;
}

.shipment {
  line-height: 1.4;
  padding: 0 20rpx;
  margin: 20rpx 20rpx 0;
  border-radius: 10rpx;
  background-color: #fff;
}

.shipment .locate,
.shipment .logistics {
  min-height: 120rpx;
  padding: 30rpx 30rpx 25rpx 75rpx;
  background-size: 50rpx;
  background-repeat: no-repeat;
  background-position: 6rpx center;
}

.shipment .locate {
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png);
}

.shipment .locate .user {
  font-size: 26rpx;
  color: #444;
}

.shipment .locate .address {
  font-size: 24rpx;
  color: #666;
}

.shipment .logistics {
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/car.png);
  border-bottom: 1rpx solid #eee;
  position: relative;
}

.shipment .logistics::after {
  position: absolute;
  right: 10rpx;
  top: 50%;

  transform: translateY(-50%);
  content: "\e6c2";
  font-family: "erabbit" !important;
  font-size: 32rpx;
  color: #666;
}

.shipment .logistics .message {
  font-size: 26rpx;
  color: #444;
}

.shipment .logistics .date {
  font-size: 24rpx;
  color: #666;
}

.goods {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
}

.goods .item {
  padding: 30rpx 0;
  border-bottom: 1rpx solid #eee;
}

.goods .item navigator {
  display: flex;
}

.goods .item .cover {
  width: 170rpx;
  height: 170rpx;
  border-radius: 10rpx;
  margin-right: 20rpx;
}

.goods .item .meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.goods .item .name {
  height: 80rpx;
  font-size: 26rpx;
  color: #444;
}

.goods .item .type {
  line-height: 1.8;
  padding: 0 15rpx;
  margin-top: 6rpx;
  font-size: 24rpx;
  align-self: flex-start;
  border-radius: 4rpx;
  color: #888;
  background-color: #f7f7f8;
}

.goods .item .price {
  display: flex;
  margin-top: 6rpx;
  font-size: 24rpx;
}

.goods .item .symbol {
  font-size: 20rpx;
}

.goods .item .original {
  color: #999;
  text-decoration: line-through;
}

.goods .item .actual {
  margin-left: 10rpx;
  color: #444;
}

.goods .item .text {
  font-size: 22rpx;
}

.goods .item .quantity {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 24rpx;
  color: #444;
}

.goods .item .action {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  padding: 30rpx 0 0;
}

.goods .action .button {
  width: 200rpx;
  height: 60rpx;
  text-align: center;
  justify-content: center;
  line-height: 60rpx;
  margin-left: 20rpx;
  border-radius: 60rpx;
  border: 1rpx solid #ccc;
  font-size: 26rpx;
  color: #444;
}

.goods .action .primary {
  color: #27ba9b;
  border-color: #27ba9b;
}

.goods .total {
  line-height: 1;
  font-size: 26rpx;
  padding: 20rpx 0;
  color: #666;
}

.goods .total .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10rpx 0;
}

.goods .total .symbol::before {
  content: "¥";
  font-size: 20rpx;
}

.goods .total .paid {
  font-size: 30rpx;
  color: #444;
}

.goods .total .primary {
  color: #cf4444;
}

.detail {
  line-height: 1;
  padding: 30rpx 20rpx 0;
  margin: 20rpx 20rpx 0;
  font-size: 26rpx;
  color: #666;
  border-radius: 10rpx;
  background-color: #fff;
}

.detail .title {
  font-size: 30rpx;
  color: #444;
}

.detail .row {
  padding: 20rpx 0;
}

.detail .row > view {
  display: block;
  padding: 10rpx 0;
}

.toobar {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  padding: 30rpx 20rpx;
  background-color: #fff;
  box-shadow: 0 -4rpx 6rpx rgba(240, 240, 240, 0.6);
  position: relative;
  z-index: 9;
}

.toobar > view {
  width: 200rpx;
  height: 72rpx;
  text-align: center;
  line-height: 72rpx;
  margin-left: 15rpx;
  font-size: 26rpx;
  border-radius: 72rpx;
}

.toobar .default {
  color: #444;
  border: 1rpx solid #ccc;
}

.toobar .primary {
  color: #fff;
  background-color: #27ba9b;
}

.popup-root {
  padding: 30rpx 30rpx 0;
  border-radius: 10rpx 10rpx 0 0;
  overflow: hidden;
}

.popup-root .title {
  font-size: 30rpx;
  text-align: center;
  margin-bottom: 30rpx;
}

.popup-root .description {
  font-size: 28rpx;
  padding: 0 20rpx;
}

.popup-root .description .tips {
  color: #444;
  margin-bottom: 12rpx;
}

.popup-root .description .cell {
  display: flex;
  justify-content: space-between;
  align-items: center;

  line-height: 1;
  padding: 15rpx 0;
  margin-bottom: 4rpx;
  color: #666;
}

.popup-root .description .icon-ring {
  font-size: 38rpx;
  color: #999;
}

.popup-root .description .icon-checked {
  font-size: 38rpx;
  color: #27ba9b;
}

.popup-root .footer {
  display: flex;
  justify-content: space-between;
  padding: 30rpx 0 40rpx;
  font-size: 28rpx;
  color: #444;
}

.popup-root .footer .button {
  flex: 1;
  height: 72rpx;
  text-align: center;
  line-height: 72rpx;
  margin: 0 20rpx;
  color: #444;
  border-radius: 72rpx;
  border: 1rpx solid #ccc;
}

.popup-root .footer .primary {
  color: #fff;
  background-color: #27ba9b;
  border: none;
}
</style>
