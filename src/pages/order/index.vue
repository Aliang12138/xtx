<script setup lang="ts">
import { ref, toRef } from "vue";
import useAppStore from "@/store";
import { onLoad } from "@dcloudio/uni-app";
import {
  getMemberOrderList,
  GetMemberOrderListResult,
  OrderState,
} from "@/apis/order";

const appStore = useAppStore();
const safeArea = toRef(appStore, "safeArea");

let swiperIndex = $ref<string | number>(0);
let adjustIndex = $ref<string | number>(0);
let cursorLeft = $ref<string>("0%");

const changeTab = (ev: any) => {
  // 获取当前 swiperItem 的索引值值
  let { index } = ev.target.dataset;
  if (ev.detail.currentItemId) index = ev.detail.currentItemId;
  // 切换不同的 swiperItem
  swiperIndex = index;
};

const onFinish = () => {
  // 控制索引值改变的顺序
  adjustIndex = swiperIndex;
};

const onTransition = (ev: WechatMiniprogram.SwiperTransition) => {
  // 获取动画相关参数
  const current = parseInt(ev.target.dataset.current);
  const dx = ev.detail.dx;

  cursorLeft = (current + dx / safeArea.value!.width) * 20 + "%";
};

//------------------------------------
const orders = ref({} as GetMemberOrderListResult);
//订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部
const orderTabs = ref([
  {
    orderState: 0,
    title: "全部",
  },
  {
    orderState: 1,
    title: OrderState[1],
  },
  {
    orderState: 2,
    title: OrderState[2],
  },
  {
    orderState: 3,
    title: OrderState[3],
  },
  {
    orderState: 4,
    title: OrderState[4],
  },
]);
const orderList = ref<GetMemberOrderListResult[]>([
  {
    items: [],
    counts: 0,
    page: 1,
    pageSize: 10,
    pages: 1,
  },
  {
    items: [],
    counts: 0,
    page: 1,
    pageSize: 10,
    pages: 1,
  },
  {
    items: [],
    counts: 0,
    page: 1,
    pageSize: 10,
    pages: 1,
  },
  {
    items: [],
    counts: 0,
    page: 1,
    pageSize: 10,
    pages: 1,
  },
  {
    items: [],
    counts: 0,
    page: 1,
    pageSize: 10,
    pages: 1,
  },
]);
onLoad(async () => {
  loadOrderList();
});

// UniApp 在 Vue3 项目中可通过 defineProps 获取页面参数
// 获取个人中心页面跳转时传递的 type 参数
const { type } = defineProps<{
  type: number;
}>();
// 🔔优化：把 type 参数作为 activeIndex 初始值
const activeIndex = ref(type);
// 加载订单列表数据
const loadOrderList = async () => {
  // 获取当前订单列表
  const currOrderList = orderList.value[activeIndex.value];
  // 根据当前订单参数查询数据获取数据
  const res = await getMemberOrderList({
    page: currOrderList.page,
    pageSize: currOrderList.pageSize,
    orderState: activeIndex.value, // 订单状态 和 tabs 下标对应
  });
  // 列表数据追加，用于分页
  currOrderList.items.push(...res.items);
  // 记录总数，用于分页
  currOrderList.counts = res.counts;
  // 🔔如果 总记录数量 比 页容量还小，说明没分页数据了，页码无需累加
  if (res.counts < res.pageSize) return;
  // 页码累加，用于分页
  currOrderList.page++;
};

//点击tabs时
const changeTabs = (index: number) => {
  activeIndex.value = index;
  // loadOrderList();
};

//滑动
const swiperChange = (ev: WechatMiniprogram.SwiperChange) => {
  activeIndex.value = ev.detail.current;
  // 🔔优化：在滑动切换的时候，如果没有数据，才需要发送请求
  if (orderList.value[activeIndex.value].items.length === 0) {
    // 加载订单列表数据
    loadOrderList();
  }
};
</script>

<template>
  <view class="viewport">
    <view class="tabs">
      <text
        v-for="(item, index) in orderTabs"
        :key="item.orderState"
        :data-index="index"
        @tap="changeTabs(index)"
      >
        {{ item.title }}</text
      >
      <!-- 游标 -->
      <view class="cursor" :style="{ left: cursorLeft }"></view>
    </view>
    <swiper class="orders" @change="swiperChange" :current="activeIndex">
      <!-- :data-current="adjustIndex"
      :duration="200"
      @animationfinish="onFinish"
      @transition="onTransition" -->
      <swiper-item v-for="(orders, index) in orderList" :key="index">
        {{ orderTabs[index] }}
        <scroll-view enhanced scroll-y :show-scrollbar="false">
          <view class="card" v-for="item in orders?.items" :key="item.id">
            <!-- 订单相关 -->
            <view class="status">
              <text class="date">{{ item.createTime }}</text>
              <!-- 枚举类型支持反向映射：
                    1. 枚举[键]    获取值
                    2. 枚举[值]    获取键名称 -->
              <text>{{ OrderState[item.orderState] }}</text>
              <text class="icon-delete"></text>
            </view>
            <!-- 商品信息 -->
            <navigator
              v-for="sku in item.skus"
              :key="sku.id"
              class="goods"
              :url="`/pages/order/detail?id=${item.id}`"
              hover-class="none"
            >
              <view class="cover">
                <image :src="sku.image"></image>
              </view>
              <view class="meta">
                <view class="name ellipsis">{{ sku.name }}</view>
                <view class="type">{{ sku.attrsText }}</view>
              </view>
            </navigator>
            <!-- 支付信息 -->
            <view class="payment">
              <text class="quantity">共{{ item.totalNum }}件商品</text>
              <text>实付</text>
              <text class="amount">
                <text class="symbol">¥</text>{{ item.payMoney }}
              </text>
            </view>
            <!-- 订单操作 -->
            <view class="action">
              <view class="button primary">再次购买</view>
              <view class="button">取消订单</view>
            </view>
          </view>
          <view v-if="orders?.items.length === 0">没有更多数据了</view>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<style>
page {
  height: 100%;
  overflow: hidden;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.tabs {
  display: flex;
  justify-content: space-around;
  line-height: 60rpx;
  margin: 0 10rpx;
  background-color: #fff;
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);
  position: relative;
  z-index: 9;
}

.tabs text {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  font-size: 28rpx;
  color: #262626;
}

.tabs .cursor {
  position: absolute;
  left: 0;
  bottom: 20rpx;

  display: block;
  content: "";
  width: 20%;
  height: 4rpx;
  padding: 0 50rpx;
  background-clip: content-box;
  background-color: #27ba9b;
}

.orders {
  background-color: #f7f7f8;
}

.orders .card {
  min-height: 100rpx;
  padding: 20rpx;
  margin: 20rpx 20rpx 0;
  border-radius: 10rpx;
  background-color: #fff;
}

.orders .card:last-child {
  padding-bottom: 40rpx;
}

.orders .status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28rpx;
  color: #999;
  margin-bottom: 15rpx;
}

.orders .status .date {
  color: #666;
  flex: 1;
}

.orders .status .primary {
  color: #ff9240;
}

.orders .status .icon-delete {
  line-height: 1;
  margin-left: 10rpx;
  padding-left: 10rpx;
  border-left: 1rpx solid #e3e3e3;
}

.orders .goods {
  display: flex;
  margin-bottom: 20rpx;
}

.orders .goods .cover {
  width: 170rpx;
  height: 170rpx;
  margin-right: 20rpx;
  border-radius: 10rpx;
  overflow: hidden;
  position: relative;
}

.orders .goods .quantity {
  position: absolute;
  bottom: 0;
  right: 0;
  line-height: 1;
  padding: 6rpx 4rpx 6rpx 8rpx;
  font-size: 24rpx;
  color: #fff;
  border-radius: 10rpx 0 0 0;
  background-color: rgba(0, 0, 0, 0.6);
}

.orders .goods .meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.orders .goods .name {
  height: 80rpx;
  font-size: 26rpx;
  color: #444;
}

.orders .goods .type {
  line-height: 1.8;
  padding: 0 15rpx;
  margin-top: 10rpx;
  font-size: 24rpx;
  align-self: flex-start;
  border-radius: 4rpx;
  color: #888;
  background-color: #f7f7f8;
}

.orders .goods .more {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  color: #333;
}

.orders .payment {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  line-height: 1;
  padding: 20rpx 0;
  text-align: right;
  color: #999;
  font-size: 28rpx;
  border-bottom: 1rpx solid #eee;
}

.orders .payment .quantity {
  font-size: 24rpx;
  margin-right: 16rpx;
}

.orders .payment .amount {
  color: #444;
  margin-left: 6rpx;
}

.orders .payment .symbol {
  font-size: 20rpx;
}

.orders .action {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  padding-top: 20rpx;
}

.orders .action .button {
  width: 200rpx;
  height: 60rpx;
  text-align: center;
  line-height: 60rpx;
  margin-left: 20rpx;
  border-radius: 60rpx;
  border: 1rpx solid #ccc;
  font-size: 26rpx;
  color: #444;
}

.orders .action .primary {
  color: #27ba9b;
  border-color: #27ba9b;
}

.orders .blank {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 30rpx;
  margin-top: -40rpx;
  color: #666;
}
</style>
