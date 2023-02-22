<script setup lang="ts">
import {
  getMemberAddressId,
  postMemberAddress,
  PostMemberAddressData,
  putMemberAddress,
} from "@/apis/address";
import { Rules, validate } from "@/utils/validate";
import { onLoad } from "@dcloudio/uni-app";
import { ref, reactive } from "vue";

onLoad(({ id }) => {
  uni.setNavigationBarTitle({
    title: id ? "修改地址" : "新建地址",
  });
});

//如果是确定字段的表单，可以通过reactive定义响应式数据
const form = reactive({ isDefault: 0 } as PostMemberAddressData);

// 自定义校验规则
const rules: Rules = {
  receiver: [{ required: true, message: "请填写收货人姓名" }],
  contact: [
    { required: true, message: "请填写收货人手机号码" },
    { pattern: /^1\d{10}$/, message: "请填写正确的手机号码" },
  ],
  provinceCode: [{ required: true, message: "请选择收货人所在城市" }],
  address: [{ required: true, message: "请填写详细收货地址" }],
};

//点击提交表单按钮
const submitForm = async () => {
  // 如果表单校验失败，退出函数
  if (!validate(form, rules)) return;
  //如果有id调用修改没有就调用添加
  if (addressId.value) {
    await putMemberAddress(addressId.value, form);
  } else {
    await postMemberAddress(form);
  }
  uni.showToast({ title: "添加成功" });
  uni.navigateBack({});
};
const fullLocation = ref<string | undefined>();
//省市区
const regionChange = (ev: WechatMiniprogram.PickerChange) => {
  const [provinceCode, cityCode, countyCode] = ev.detail.code;
  //手机用于后端提交的参数
  // form.provinceCode = provinceCode;
  // form.cityCode = cityCode;
  // form.countyCode = countyCode;
  //合并对象(第二个参数合并到第一个参数中)
  Object.assign(form, {
    provinceCode,
    cityCode,
    countyCode,
    postalCode: ev.detail.postcode,
  });
  //用户界面展示
  fullLocation.value = (ev.detail.value as string[]).join("");
};

//设置默认地址
const isDefaultChange = (ev: WechatMiniprogram.SwitchChange | Event) => {
  //是否为默认值(1)
  form.isDefault = (ev as WechatMiniprogram.SwitchChange).detail.value ? 1 : 0;
};

//页面加载时获取id
const addressId = ref("");
onLoad(async ({ id }) => {
  if (id) {
    addressId.value = id;
    const res = await getMemberAddressId(id);
    Object.assign(form, res);
  }
});
</script>

<template>
  <view class="viewport">
    <!-- 地址信息 -->
    <view class="form">
      <view class="form-item">
        <text class="label">姓名</text>
        <input
          v-model="form.receiver"
          placeholder-style="color: #888"
          placeholder="请填写收货人姓名"
        />
      </view>
      <view class="form-item">
        <text class="label">手机号码</text>
        <input
          v-model="form.contact"
          placeholder-style="color: #888"
          placeholder="请填写收货人手机号码"
        />
      </view>
      <view class="form-item">
        <text class="label">省/市/县 (区)</text>
        <picker @change="regionChange" mode="region">
          <view v-if="fullLocation" class="region">{{ fullLocation }}</view>
          <view v-else class="placeholder">请填写收货人所在城市</view>
        </picker>
      </view>
      <view class="form-item">
        <text class="label">详细地址</text>
        <input
          v-model="form.address"
          placeholder-style="color: #888"
          placeholder="街道、楼牌号信息"
        />
      </view>
      <view class="form-item">
        <text class="label">设置默认地址</text>
        <switch
          @change="isDefaultChange"
          :checked="form.isDefault === 1"
          color="#27ba9b"
        />
      </view>
    </view>
    <!-- 提交按钮 -->
    <view class="button" @tap="submitForm">{{
      addressId ? "保 存" : "新 增"
    }}</view>
  </view>
</template>

<style>
page {
  background-color: #f4f4f4;
}

.form {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
}

.form .form-item {
  display: flex;
  min-height: 96rpx;
  line-height: 46rpx;
  padding: 25rpx 10rpx;
  background-color: #fff;
  font-size: 28rpx;
  border-bottom: 1rpx solid #ddd;
  position: relative;
}

.form .form-item:last-child {
  border: none;
}

.form .form-item .label {
  width: 200rpx;
  color: #333;
}

.form .form-item input {
  flex: 1;
  display: block;
  height: 46rpx;
}

.form .form-item switch {
  position: absolute;
  right: -10rpx;
  transform: scale(0.7) translateY(-8px);
}

.form .form-item picker {
  flex: 1;
}

.form .form-item .region {
  color: #333;
}

.form .form-item .placeholder {
  color: #888;
}

.button {
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
}
</style>
