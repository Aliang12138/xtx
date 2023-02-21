import { MemberAddressItem } from "@/apis/address";
import { defineStore } from "pinia";
import { ref } from "vue";

// 定义收货地址模块
//  地址列表页：修改选中收货地址
//  商品详情页：修改选中收货地址
//  填写订单页：获取选中收货地址
export const useAddressStore = defineStore(
  "address",
  () => {
    const selectedAddress = ref({} as MemberAddressItem);
    const changeSelectedAddress = (address: MemberAddressItem) => {
      selectedAddress.value = address;
    };
    return {
      selectedAddress,
      changeSelectedAddress,
    };
  },
  {
    //开启持久化存储
    persist: {
      storage: {
        setItem(key, value) {
          uni.setStorageSync(key, value);
        },
        getItem(key) {
          return uni.getStorageSync(key);
        },
      },
    },
  }
);
