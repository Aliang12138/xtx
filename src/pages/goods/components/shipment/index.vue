<script setup lang="ts">
import { useAddressStore } from "@/store/addres";
import { storeToRefs } from "pinia";

//获取收货地址Store
const addressStore = useAddressStore();
const { selectedAddress } = storeToRefs(addressStore);
</script>

<template>
  <view class="title">配送至</view>
  <view class="shipment">
    <view class="item">
      <view class="user"
        >{{ selectedAddress.receiver }} {{ selectedAddress.contact }}</view
      >
      <view class="address">{{ selectedAddress.fullLocation }}</view>
      <text class="icon icon-checked"></text>
    </view>
  </view>
  <view class="footer">
    <view class="button primary"> 新建地址 </view>
    <view v-if="false" class="button primary">确定</view>
  </view>
</template>

<style>
.shipment {
  min-height: 300rpx;
  max-height: 540rpx;
  overflow: auto;
  padding: 20rpx 10rpx !important;
}

.shipment .item {
  padding: 30rpx 50rpx 30rpx 60rpx;
  background-size: 40rpx;
  background-repeat: no-repeat;
  background-position: 0 center;
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png);
  position: relative;
}

.shipment .item .icon {
  color: #999;
  font-size: 40rpx;
  transform: translateY(-50%);
  position: absolute;
  top: 50%;
  right: 0;
}

.shipment .item .icon-checked {
  color: #27ba9b;
}

.shipment .item .icon-ring {
  color: #444;
}

.shipment .item .user {
  font-size: 28rpx;
  color: #444;
  font-weight: 500;
}

.shipment .item .address {
  font-size: 26rpx;
  color: #666;
}
</style>
