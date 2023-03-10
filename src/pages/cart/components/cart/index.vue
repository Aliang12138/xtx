<script setup lang="ts">
import {
  deleteMemberCart,
  getMemberCart,
  MemberCartItem,
  putMemberCartById,
  putMemberCartSelected,
} from "@/apis/cart";
import guess from "@/components/guess/index.vue";
import { useMemberStore } from "@/store/member";
import { onShow } from "@dcloudio/uni-app";
import { computed, ref } from "vue";

const goPay = () => {
  uni.navigateTo({
    url: "/pages/order/index",
  });
};
//----------------------------
const carts = ref<MemberCartItem[]>([]);
const memberStore = useMemberStore();
const loadMemberCart = async () => {
  carts.value = await getMemberCart();
};
onShow(async () => {
  //判断登录才发请求
  if (memberStore.isLogin) {
    loadMemberCart();
  }
});

//删除购物车商品
const deleteCart = async (ids: string[]) => {
  await deleteMemberCart({ ids });
  loadMemberCart();
  uni.showToast({ title: "删除成功" });
};

//修改商品数量
const changeCount = (skuId: string, step: number) => {
  //根据skuId查找出待修改的商品
  const item = carts.value.find((v) => v.skuId === skuId);
  if (item) {
    // 先保存一个临时的数据，用于边界判断
    const temp = item.count + step;
    //最值边界判断
    if (temp < 1) return;
    if (temp > item.stock) return;
    //更新数据
    item.count = temp;
    putMemberCartById(skuId, { count: item.count });
  }
};

//修改商品选中状态
const changeSelected = (skuId: string) => {
  const item = carts.value.find((v) => v.skuId === skuId);
  if (item) {
    item.selected = !item.selected;
    putMemberCartById(skuId, { selected: item.selected });
  }
};

//计算全选状态
const isSelectedAll = computed(() => {
  return carts.value.every((v) => v.selected);
});
//修改全选状态
const changeSelectedAll = () => {
  //获取挡墙选中状态的值并取反
  const temp = !isSelectedAll.value;
  //用同一个取反后的值,批量更新列表的选中状态
  carts.value.forEach((item) => {
    item.selected = temp;
  });
  putMemberCartSelected({ selected: temp });
};

// 计算已选中的商品列表
const selectedCarts = computed(() => carts.value.filter((v) => v.selected));
// 基于选中商品列表计算出总钱数
const selectedCartsPrice = computed(() =>
  selectedCarts.value.reduce((sum, v) => v.price * v.count + sum, 0)
);
// 基于选中商品列表计算出总件数
const selectedCartsCount = computed(() =>
  selectedCarts.value.reduce((sum, v) => v.count + sum, 0)
);

//去订单结算页
const goToOrderCreate = () => {
  //判断选中的商品总件数是否为0
  if (selectedCartsCount.value === 0) {
    return uni.showToast({ icon: "none", title: "请选择下单商品" });
  }
  uni.navigateTo({ url: "/pages/order/create/index" });
};
</script>

<template>
  <scroll-view scroll-y enhanced :show-scrollbar="false" class="viewport">
    <!-- 顶部工具栏 -->
    <view class="topbar" v-if="false">
      <view class="locate">顺义区后沙峪地区</view>
      <view class="extra">
        <text class="edit">编辑</text>
        <text class="menu"></text>
      </view>
    </view>

    <template v-if="memberStore.isLogin">
      <!-- 优惠提示 -->
      <view class="tips">
        <text class="label">满减</text>
        <text class="desc">满1件, 即可享受9折优惠</text>
      </view>

      <!-- 购物车商品 -->
      <view class="carts">
        <uni-swipe-action>
          <uni-swipe-action-item
            class="swipe-cell"
            v-for="item in carts"
            :key="item.skuId"
          >
            <navigator
              hover-class="none"
              :url="'/pages/goods/index?id=' + item.id"
              class="card"
            >
              <text
                :class="[
                  'checkbox',
                  `icon-${item.selected ? 'checked' : 'ring'}`,
                ]"
                @tap.stop="changeSelected(item.skuId)"
              ></text>
              <!-- 商品缩略图 -->
              <image class="thumb" :src="item.picture"></image>
              <view class="meta">
                <!-- 商品名称 -->
                <view class="name ellipsis">{{ item.name }}</view>
                <!-- 商品类型 -->
                <view class="type ellipsis">{{ item.attrsText }}</view>
                <!-- 价格 -->
                <view class="price"> ¥{{ item.price }} </view>
                <!-- 商品数量，阻止冒泡 -->
                <view class="quantity" @tap.stop="() => {}">
                  <text @tap="changeCount(item.skuId, -1)" class="text">-</text>
                  <input class="input" type="text" :value="item.count" />
                  <text @tap="changeCount(item.skuId, 1)" class="text">+</text>
                </view>
              </view>
            </navigator>

            <template v-slot:right>
              <view class="swipe-cell-action">
                <button class="collect-button">移入收藏</button>
                <button @tap="deleteCart([item.skuId])" class="delete-button">
                  删除
                </button>
              </view>
            </template>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>
    </template>

    <!-- 状态提示 -->
    <view class="blank" v-else>
      <text>登后后可查看购物车中的商品</text>
      <navigator url="/pages/login/index" hover-class="none">
        <button class="button">去登录</button>
      </navigator>
    </view>

    <!-- 猜你喜欢 -->
    <guess :source="[]"></guess>
  </scroll-view>

  <!-- 吸底工具栏 -->
  <view class="toolbar" v-if="true">
    <text
      class="all"
      :class="{ checked: isSelectedAll }"
      @tap="changeSelectedAll"
      >全选</text
    >
    <text class="text">合计:</text>
    <text class="amount">{{ selectedCartsPrice }}</text>
    <!-- 操作按钮 -->
    <view class="buttons">
      <view
        class="button payment"
        :class="{ disabled: selectedCartsCount === 0 }"
        @tap="goToOrderCreate"
        >去结算({{ selectedCartsCount }})</view
      >
      <view class="button collect">移入收藏</view>
      <view class="button delete">删除</view>
    </view>
  </view>
</template>

<style>
:host {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.viewport {
  min-height: 400rpx;
  /* padding-bottom: 120rpx; */
}

/* 顶部工具栏 */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 88rpx;
  padding: 0 30rpx;
  font-size: 26rpx;
  color: #262626;
  background-color: #fff;
}

.topbar .extra {
  display: flex;
  align-items: center;
  height: 24rpx;
  border-left: 1rpx solid #bfbfbf;
}

.topbar .extra .edit {
  padding: 0 30rpx;
}

.topbar .extra .menu {
  width: 9rpx;
  height: 9rpx;
  padding: 14rpx;
  border-radius: 50%;
  background-color: #262626;
  background-clip: content-box;
  position: relative;
}

.topbar .extra .menu::before,
.topbar .extra .menu::after {
  position: absolute;
  top: 50%;

  content: "";
  width: 6rpx;
  height: 4rpx;
  background-color: #8c8c8c;
  transform: translateY(-50%);
  border-radius: 4rpx;
}

.topbar .extra .menu::before {
  left: 0;
}

.topbar .extra .menu::after {
  right: 0;
}

/* 优惠提示 */
.tips {
  display: flex;
  align-items: center;
  line-height: 1;
  padding: 30rpx;
  font-size: 26rpx;
  color: #666;
}

.tips .label {
  color: #fff;
  padding: 7rpx 15rpx 5rpx;
  border-radius: 4rpx;
  font-size: 24rpx;
  background-color: #27ba9b;
  margin-right: 10rpx;
}

.carts {
  padding: 0 20rpx;
}

/* 购物车商品 */
.carts .card {
  display: flex;
  padding: 20rpx 20rpx 20rpx 80rpx;
  border-radius: 10rpx;
  background-color: #fff;
  position: relative;
}

.carts .swipe-cell {
  display: block;
  margin-top: 20rpx;
}

.carts .swipe-cell:first-child {
  margin-top: 0;
}

.carts .card .checkbox {
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 100%;
  font-size: 40rpx;
  color: #444;
}

.carts .card .icon-checked {
  color: #27ba9b;
}

.carts .card .thumb {
  width: 170rpx;
  height: 170rpx;
}

.carts .card .meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 20rpx;
}

.carts .card .name {
  height: 72rpx;
  font-size: 26rpx;
  color: #444;
}

.carts .card .type {
  line-height: 1.8;
  padding: 0 15rpx;
  font-size: 24rpx;
  align-self: flex-start;
  border-radius: 4rpx;
  color: #888;
  background-color: #f7f7f8;
}

.carts .card .price {
  line-height: 1;
  font-size: 26rpx;
  color: #444;
  margin-bottom: 2rpx;
}

.carts .card .warning {
  color: #cf4444;
  font-size: 24rpx;
}

.carts .card .quantity {
  position: absolute;
  bottom: 20rpx;
  right: 5rpx;

  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 220rpx;
  height: 48rpx;
}

.carts .card .quantity .text {
  height: 100%;
  padding: 0 20rpx;
  font-size: 32rpx;
  color: #444;
}

.carts .card .quantity .input {
  height: 100%;
  text-align: center;
  border-radius: 4rpx;
  font-size: 24rpx;
  color: #444;
  background-color: #f6f6f6;
}

/* 购物车状态提示 */
.blank {
  padding: 100rpx 0 60rpx;
  text-align: center;
  color: #444;
  font-size: 26rpx;
}

.blank .button {
  width: 240rpx !important;
  height: 60rpx;
  line-height: 60rpx;
  margin-top: 25rpx;
  font-size: 26rpx;
  border-radius: 60rpx;
  color: #fff;
  background-color: #27ba9b;
}

.blank .button::after {
  display: none;
}

/* 吸底工具栏 */
.toolbar {
  position: relative;
  padding: 32rpx 20rpx 28rpx;
  border-top: 1rpx solid #ededed;
  border-bottom: 1rpx solid #ededed;
  background-color: #fff;
}

.toolbar .all {
  margin-left: 25rpx;
  font-size: 14px;
  color: #444;
}

.toolbar .all::before {
  font-family: "erabbit" !important;
  content: "\e6cd";
  font-size: 36rpx;
  margin-right: 8rpx;
  vertical-align: -4rpx;
}

.toolbar .checked::before {
  content: "\e6cc";
  color: #27ba9b;
}

.toolbar .text {
  margin-right: 8rpx;
  margin-left: 32rpx;
  color: #444;
  font-size: 14px;
}

.toolbar .amount {
  font-size: 20px;
  color: #cf4444;
  vertical-align: -1px;
}

.toolbar .amount::before {
  content: "￥";
  font-size: 12px;
}

.toolbar .amount .decimal {
  font-size: 12px;
}

.toolbar .buttons {
  position: absolute;
  right: 10rpx;
  top: 50%;

  display: flex;
  justify-content: space-between;
  text-align: center;
  line-height: 72rpx;
  font-size: 13px;
  color: #fff;
  transform: translateY(-50%);
}

.toolbar .buttons .button {
  width: 240rpx;
  margin: 0 10rpx;
  border-radius: 72rpx;
}

.toolbar .payment {
  /*display: none;*/
  background-color: #27ba9b;
}

.toolbar .disabled {
  opacity: 0.6;
}

.toolbar .delete {
  display: none;
  background-color: #27ba9b;
}

.toolbar .collect {
  display: none;
  background-color: #ffa868;
}

.swipe-cell-action {
  display: flex;
  height: 100%;
  /* flex-direction: column; */
}

.swipe-cell-action button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  padding: 6px;
  line-height: 1.5;
  color: #fff;
  font-size: 26rpx;
  border-radius: 0;
}

.swipe-cell-action .collect-button {
  background-color: #ffa868;
}

.swipe-cell-action .delete-button {
  background-color: #cf4444;
}
</style>
