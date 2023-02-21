<script setup lang="ts">
import {
  getMemberOrderPre,
  getMemberOrderPreNow,
  GetMemberOrderPreResult,
  postMemberOrder,
} from "@/apis/order";
import { useAddressStore } from "@/store/addres";
import { onLoad } from "@dcloudio/uni-app";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import layer from "./layer.vue";

const payments = [
  {
    id: 1,
    text: "时间不限 (周一至周日)",
  },
  {
    id: 2,
    text: "工作日送 (周一至周五)",
  },
  {
    id: 3,
    text: "周末配送 (周六至周日)",
  },
];

let paymentShow = $ref(false);

const shipments = [
  {
    id: 1,
    text: "在线支付",
  },
  {
    id: 2,
    text: "货到付款",
  },
];

let shipmentShow = $ref(false);

let payment = $ref(payments[0]);
let shipment = $ref(shipments[0]);

const getPaymentInfo = (info: any) => {
  paymentShow = false;
  payment = info;
};

const getShipmentInfo = (info: any) => {
  shipmentShow = false;
  shipment = info;
};

const goPayment = () => {
  // uni.navigateTo({
  //   url: '/pages/order/payment/index',
  // })
};

//-----------------------------\
//预付订单信息
const orderPre = ref({} as GetMemberOrderPreResult);
onLoad(async (data) => {
  if (data.skuId) {
    //立即购买
    orderPre.value = await getMemberOrderPreNow(data as any);
  } else {
    //预付
    orderPre.value = await getMemberOrderPre();
  }
});

//获取收货地址Store
const addressStore = useAddressStore();
const { selectedAddress } = storeToRefs(addressStore);

const submitForm = async () => {
  const addressId = selectedAddress.value.id;
  if (!addressId) {
    return uni.showToast({ icon: "none", title: "请选择收货地址" });
  }
  const { id } = await postMemberOrder({
    goods: orderPre.value.goods.map((v) => ({
      skuId: v.skuId,
      count: v.count,
    })),
    addressId,
    deliveryTimeType: 1,
    payType: 1,
    payChannel: 2,
    buyerMessage: "",
  });
  uni.navigateTo({ url: `/pages/order/detail?id=${id}` });
};
</script>

<template>
  <scroll-view scroll-y :show-scrollbar="false" class="viewport">
    <!-- 收货地址 -->
    <navigator
      class="shipment"
      hover-class="none"
      url="/pages/my/address/index?from=order"
      v-if="selectedAddress.id"
    >
      <view class="user"
        >{{ selectedAddress.receiver }} {{ selectedAddress.contact }}</view
      >
      <view class="address"
        >{{ selectedAddress.fullLocation }}{{ selectedAddress.address }}</view
      >
      <text class="icon icon-right"></text>
    </navigator>
    <navigator
      class="shipment"
      hover-class="none"
      url="/pages/my/address/index?from=order"
      v-else
    >
      <view class="address">请选择收货地址</view>
      <text class="icon icon-right"></text>
    </navigator>

    <!-- 商品信息 -->
    <view class="goods">
      <navigator
        v-for="item in orderPre.goods"
        :key="item.skuId"
        :url="`/pages/goods/index?id=${item.id}`"
        class="item"
      >
        <image class="cover" :src="item.picture"></image>
        <view class="meta">
          <view class="name ellipsis">{{ item.name }}</view>
          <view class="type">{{ item.attrsText }}</view>
          <view class="price">
            <view class="actual">
              <text class="symbol">¥</text>{{ item.payPrice }}</view
            >
            <view class="original">
              <text class="symbol">¥</text>{{ item.price }}
            </view>
          </view>
          <view class="quantity">x{{ item.count }}</view>
        </view>
      </navigator>
    </view>

    <!-- 配送及支付方式 -->
    <view class="related">
      <view class="item" @tap="paymentShow = true">
        <text class="text">配送时间</text>
        <text class="picker icon-fonts">{{ payment.text }}</text>
      </view>
      <view class="item" @tap="shipmentShow = true">
        <text class="text">支付方式</text>
        <text class="picker icon-fonts">{{ shipment.text }}</text>
      </view>
      <view class="item">
        <text class="text">买家备注</text>
        <input cursor-spacing="30" placeholder="建议留言前先与商家沟通确认" />
      </view>
    </view>

    <!-- 支付金额 -->
    <view class="settlement">
      <view class="item">
        <text class="text">商品总价: </text>
        <text class="number">
          <text class="symbol">¥</text>{{ orderPre.summary?.totalPrice }}</text
        >
      </view>
      <view class="item">
        <text class="text">运费: </text>
        <text class="number">
          <text class="symbol">¥</text>{{ orderPre.summary?.postFee }}</text
        >
      </view>
      <view class="item" v-if="orderPre.summary?.discountPrice > 0">
        <text class="text">折扣: </text>
        <text class="number danger">
          <text class="symbol">-¥</text
          >{{ orderPre.summary?.discountPrice }}</text
        >
      </view>
    </view>
    <view class="gap"></view>
  </scroll-view>

  <view class="toolbar">
    <view class="amount">
      <text class="symbol">¥</text>
      <text class="number">{{ orderPre.summary?.totalPayPrice }}</text>
      <!-- <text class="decimal">.00</text> -->
    </view>
    <view @tap="submitForm" class="button">提交订单</view>
  </view>

  <uni-popup
    v-if="false"
    ref="shipment"
    type="bottom"
    background-color="#fff"
    safe-area
    is-mask-click
  >
    <view class="popup-root">
      <view class="title">配送时间</view>
      <view class="list">
        <view class="item" v-for="(item, index) in shipments" :key="item.id">
          <view class="text">{{ item.text }}</view>
          <text
            class="icon"
            :class="[true ? 'icon-checked' : 'icon-ring']"
          ></text>
        </view>
      </view>
      <view class="footer">
        <view class="button primary">确认</view>
      </view>
    </view>
  </uni-popup>

  <uni-popup
    v-if="false"
    ref="payment"
    type="bottom"
    background-color="#fff"
    safe-area
    is-mask-click
  >
    <view class="popup-root">
      <view class="title">支付方式</view>
      <view class="list">
        <view class="item" v-for="(item, index) in payments" :key="item.id">
          <view class="text">{{ item.text }}</view>
          <text
            class="icon"
            :class="true ? 'icon-checked' : 'icon-ring'"
          ></text>
        </view>
      </view>
      <view class="footer">
        <view class="button primary">确认</view>
      </view>
    </view>
  </uni-popup>
</template>

<style lang="scss">
.safe-area-bottom {
  background-color: #fff;
}
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: #f4f4f4;
}

.viewport {
  padding-top: 20rpx;
}

.shipment {
  padding: 30rpx 30rpx 25rpx 84rpx;
  margin: 0 20rpx;
  font-size: 26rpx;
  border-radius: 10rpx;
  background: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png)
    20rpx center / 50rpx no-repeat #fff;
  position: relative;
}

.shipment .icon {
  font-size: 36rpx;
  color: #333;
  transform: translateY(-50%);
  position: absolute;
  top: 50%;
  right: 20rpx;
}

.shipment .user {
  color: #333;
  margin-bottom: 5rpx;
}

.shipment .address {
  color: #666;
}

.link {
  margin: 20rpx;
  text-align: center;
  line-height: 72rpx;
  font-size: 26rpx;
  color: #fff;
  border-radius: 72rpx;
  background-color: #27ba9b;
}

.popup-root {
  .list {
    padding: 20rpx 0 40rpx 10rpx !important;
  }

  .list .item {
    padding: 30rpx 60rpx 30rpx 10rpx;
    position: relative;
  }

  .list .item .icon {
    color: #999;
    font-size: 40rpx;
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    right: 10rpx;
  }

  .list .item .icon-checked {
    color: #27ba9b;
  }

  .list .item .text {
    font-size: 28rpx;
    color: #444;
  }
}

.goods {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
}

.goods .item {
  display: flex;
  padding: 30rpx 0;
  border-top: 1rpx solid #eee;
}

.goods .item:first-child {
  border-top: none;
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
  align-items: baseline;
  margin-top: 6rpx;
  font-size: 28rpx;
}

.goods .item .symbol {
  font-size: 20rpx;
}

.goods .item .original {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
}

.goods .item .actual {
  margin-right: 10rpx;
  color: #cf4444;
}

.goods .item .quantity {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 26rpx;
  color: #444;
}

.related {
  padding: 0 20rpx;
  margin: 20rpx 20rpx 0;
  border-radius: 10rpx;
  background-color: #fff;
}

.related .item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 80rpx;
  font-size: 26rpx;
  color: #333;
}

.related input {
  flex: 1;
  text-align: right;
  margin: 20rpx 0;
  padding-right: 20rpx;
  font-size: 26rpx;
  color: #999;
}

.related .item .text {
  width: 125rpx;
}

.related .picker {
  color: #666;
}

.related .picker::after {
  content: "\e6c2";
}

/* 结算清单 */
.settlement {
  padding: 0 20rpx;
  margin: 20rpx 20rpx 0;
  border-radius: 10rpx;
  background-color: #fff;
}

.settlement .item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  font-size: 26rpx;
  color: #333;
}

.settlement .symbol {
  font-size: 80%;
}

.settlement .danger {
  color: #cf4444;
}

.gap {
  height: 20rpx;
}

.toolbar {
  height: 120rpx;
  padding: 0 40rpx;
  border-top: 1rpx solid #eaeaea;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar .amount {
  font-size: 40rpx;
  color: #cf4444;
}

.toolbar .amount .symbol,
.toolbar .amount .decimal {
  font-size: 75%;
}

.toolbar .button {
  width: 220rpx;
  text-align: center;
  line-height: 72rpx;
  font-size: 26rpx;
  color: #fff;
  border-radius: 72rpx;
  background-color: #27ba9b;
}
</style>
