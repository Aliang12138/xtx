<script setup lang="ts">
import {
  deleteMemberAddressId,
  getMemberAddress,
  MemberAddressItem,
} from "@/apis/address";
import { useAddressStore } from "@/store/addres";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { ref } from "vue";

//------------------------------
//获取收货地址
const addressList = ref<MemberAddressItem[]>([]);
// onShow页面显示的时候触发的生命周期钩子（可触发多次）
// onLoad页面加载的时候触发一次，新增或修改地址成功后，后退回来列表页不会触发第二次列表请求
onShow(async () => {
  addressList.value = await getMemberAddress();
});

//点击删除
const deleteAddressBtn = async (id: string) => {
  await deleteMemberAddressId(id);
  uni.showToast({ title: "删除成功" });
  addressList.value = await getMemberAddress();
};

//获取收货地址Store
const addressStore = useAddressStore();

//传统写法 通过onLoad获取参数，在准备响应式数据存储结果以备其他地方使用
// const fromPage = ref("");
// onLoad(({ from }) => {
//   if (from) {
//     fromPage.value = from;
//   }
// });
// vue3 全平台新增：通过props来获取页面参数的使用方式
const props = defineProps<{ from: string }>();

//选择收货地址
const changeAddress = (item: MemberAddressItem) => {
  if (props.from === "order") {
    //修改选中的地址
    addressStore.changeSelectedAddress(item);
    uni.navigateBack({});
  }
};
</script>

<template>
  <view class="viewport">
    <!-- 地址列表 -->
    <scroll-view enhanced scroll-y>
      <view class="address">
        <uni-swipe-action>
          <uni-swipe-action-item
            v-for="item in addressList"
            :key="item.id"
            class="swipe-cell"
          >
            <view class="item" @tap="changeAddress(item)">
              <view class="user">
                {{ item.receiver }}
                <text>{{ item.contact }}</text>
                <text v-if="item.isDefault === 1" class="badge"> 默认 </text>
              </view>
              <view class="locate">
                {{ item.fullLocation }}{{ item.address }}
              </view>
              <navigator
                :url="`./form?id=${item.id}`"
                class="edit"
                hover-class="none"
              >
                修改
              </navigator>
            </view>
            <template v-slot:right>
              <view class="swipe-cell-action">
                <button @tap="deleteAddressBtn" class="delete-button">
                  删除
                </button>
              </view>
            </template>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>
      <view v-if="false" class="blank">收货地址为空~</view>
    </scroll-view>
    <!-- 添加按钮 -->
    <view class="add-btn">
      <navigator hover-class="none" url="./form">新建地址</navigator>
    </view>
  </view>
</template>

<style>
page {
  height: 100%;
  overflow: hidden;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f4f4f4;
}

.viewport scroll-view {
  padding-top: 20rpx;
}

.address {
  padding: 0 20rpx;
  margin: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
}

.address .item {
  line-height: 1;
  padding: 40rpx 10rpx 38rpx;
  border-bottom: 1rpx solid #ddd;
  position: relative;
}

.address .swipe-cell:last-child .item {
  border: none;
}

.address .item .user {
  font-size: 28rpx;
  margin-bottom: 20rpx;
  color: #333;
}

.address .item .user text {
  color: #666;
}

.address .item .user .badge {
  display: inline-block;
  padding: 4rpx 10rpx 2rpx 14rpx;
  margin: 2rpx 0 0 10rpx;
  font-size: 26rpx;
  color: #27ba9b;
  border-radius: 6rpx;
  border: 1rpx solid #27ba9b;
}

.address .item .locate {
  line-height: 1.6;
  font-size: 26rpx;
  color: #333;
}

.swipe-cell-action {
  height: 100%;
}

.swipe-cell-action .delete-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 100%;
  font-size: 28rpx;
  color: #fff;
  border-radius: 0;
  padding: 0;
  background-color: #cf4444 !important;
}

.address .item .edit {
  position: absolute;
  top: 36rpx;
  right: 30rpx;

  padding: 2rpx 0 2rpx 20rpx;
  border-left: 1rpx solid #666;
  font-size: 26rpx;
  color: #666;
  line-height: 1;
}

.add-btn {
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
}

.blank {
  margin-top: 300rpx;
  text-align: center;
  font-size: 32rpx;
  color: #888;
}
</style>
