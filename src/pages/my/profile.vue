<script setup lang="ts">
import { ref, toRef } from "vue";
import useAppStore from "@/store";
import { onLoad } from "@dcloudio/uni-app";
import {
  Gender,
  getMemberProfile,
  GetMemberProfileResult,
  putMemberProfile,
} from "@/apis/profile";
import { useMemberStore } from "@/store/member";

const appStore = useAppStore();
const safeArea = toRef(appStore, "safeArea");

const goBack = () => {
  uni.navigateBack({});
};

const chooseImage = () => {
  uni.chooseImage({});
};
// ------------------ 自己写的代码 ----------------------------
// 会员中心-个人信息
const memberProfile = ref({} as GetMemberProfileResult);
const memberStore = useMemberStore();
onLoad(async () => {
  // 页面加载时，获取个人信息
  memberProfile.value = await getMemberProfile();
  // 同步修改本地 Store 的头像昵称
  memberStore.profile.avatar = memberProfile.value.avatar;
  memberStore.profile.nickname = memberProfile.value.nickname;
});

// 修改头像
const changeAvatar = async () => {
  // const res = await uni.chooseImage({ count: 1 }) as any
  // console.log(28, res)
  // res.tempFilePaths[0]
  uni.chooseImage({
    count: 1, // 最多可以选择的图片张数：1张
    success(res) {
      // 获取到选择图片的临时路径
      const filePath = res.tempFilePaths[0];
      // console.log(filePath)
      // 小程序端不是通过 uni.request 上传文件，需要通过专属的 uni.uploadFile 实现
      uni.uploadFile({
        url: "/member/profile/avatar", // 接口地址
        name: "file", // 接口参数名
        filePath: filePath, // 文件路径(接口参数值)
        // 请求成功
        success(res) {
          console.log(res);
          // 更新用户头像
          memberProfile.value.avatar = filePath;
          // 更新 Pinia 中存储的头像
          memberStore.profile.avatar = filePath;
          // 提示用户
          uni.showToast({ icon: "success", title: "头像更新成功~" });
        },
      });
    },
  });
};

// 点击保存按钮
const submitForm = async () => {
  // 获取后端修改所需字段
  const { birthday, gender, nickname, profession } = memberProfile.value;
  console.log(birthday, gender, nickname, profession);
  // 🔔 数组按下标解构 省 市 区 的编码
  const [provinceCode, cityCode, countyCode] = fullLocationCode;
  // 调用接口修改个人信息
  await putMemberProfile({
    birthday, // 生日
    gender, // 性别
    nickname, // 昵称
    profession, // 昵称
    provinceCode, // 省份编码
    cityCode, // 城市编码
    countyCode, // 城市编码
  });
  // 成功提示
  uni.showToast({ title: "修改成功~" });
  // 🐛 同步修改本地 Store 的昵称
  memberStore.profile.nickname = nickname;
  // 后退返回上一页（正常的流程：个人中心点击修改资料跳转到当前页，修改完成后退回去）
  // 🚨注意事项：开发时编译模式直接打开的话，没有上一页的历史记录会报错(此报错不用修复)
  uni.navigateBack({});
};

// 性别修改 - RadioGroup
// 🔔 PS: 小程序的事件对象类型较为繁琐复杂，要深入研究可以按 Ctrl + 鼠标单击跳转，查看详细的 lib.wx.event.d.ts 类型声明文件源码
const genderChange = (ev: WechatMiniprogram.RadioGroupChange) => {
  // console.log(ev.detail.value)
  // 修改性别
  memberProfile.value.gender = ev.detail.value as Gender; // 类型断言把 string 类型收窄为 Gender
};

// 生日修改 - Picker
const birthdayChange = (ev: WechatMiniprogram.PickerChange) => {
  // console.log(89, ev.detail.value)
  memberProfile.value.birthday = ev.detail.value as string;
};

// 省市区的名称修改 - Picker mode="region"
let fullLocationCode: string[] = [];
const fullLocationChange = (ev: WechatMiniprogram.PickerChange) => {
  // console.log(101, ev.detail)
  // 用于界面展示的 省市区的名称，仅本地展示，不用于网络请求
  // PS: string[] 能兼容 [string, string, string] 类型
  memberProfile.value.fullLocation = (ev.detail.value as string[]).join("");
  // 🎯 重要：用于接口参数的 省市区的编码
  fullLocationCode = ev.detail.code;
};
</script>

<template>
  <view class="viewport">
    <view class="navbar" :style="{ paddingTop: safeArea?.top + 'px' }">
      <view class="back icon-left" @click="goBack"></view>
      <view class="title">个人信息</view>
    </view>
    <scroll-view scroll-y>
      <!-- 头像 -->
      <view class="avatar" @tap="changeAvatar">
        <image :src="memberProfile.avatar" mode="aspectFill" />
        <text>点击修改头像</text>
      </view>
      <!-- 用户信息 -->
      <view class="form">
        <view class="form-item">
          <text class="label">账号</text>
          <!-- 账号名不能修改，用 text 组件展示 -->
          <text>{{ memberProfile.account }}</text>
        </view>
        <view class="form-item">
          <text class="label">昵称</text>
          <!-- 输入框通过 v-model 双向绑定修改数据 -->
          <input v-model="memberProfile.nickname" />
        </view>
        <view class="form-item">
          <text class="label">性别</text>
          <radio-group @change="genderChange">
            <label class="radio">
              <radio
                value="男"
                color="#27ba9b"
                :checked="memberProfile.gender === '男'"
              />
              男
            </label>
            <label class="radio">
              <radio
                value="女"
                color="#27ba9b"
                :checked="memberProfile.gender === '女'"
              />
              女
            </label>
          </radio-group>
        </view>
        <view class="form-item">
          <text class="label">出生日期</text>
          <picker
            @change="birthdayChange"
            mode="date"
            start="1900-01-01"
            end="2022-01-01"
          >
            <view>{{ memberProfile.birthday || "请选择日期" }}</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">城市</text>
          <picker @change="fullLocationChange" mode="region">
            <view>{{ memberProfile.fullLocation || "请选择城市" }}</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">职业</text>
          <!-- 输入框通过 v-model 双向绑定修改数据 -->
          <input v-model="memberProfile.profession" placeholder="请填写职业" />
        </view>
      </view>
      <!-- 提交按钮 -->
      <view class="button" @tap="submitForm">保 存</view>
    </scroll-view>
  </view>
</template>

<style>
page {
  height: 100%;
  overflow: hidden;
  background-color: #f4f4f4;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: url(http://static.botue.com/erabbit/static/images/order_bg.png);
  background-size: auto 392rpx;
  background-repeat: no-repeat;
}

.navbar .title {
  height: 40px;
  line-height: 32px;
  text-align: center;
  font-size: 17px;
  font-weight: 500;
  color: #fff;
}

.navbar .back {
  position: absolute;
  left: 20rpx;
  top: 22px;
  font-size: 23px;
  z-index: 9;
  color: #fff;
}

.avatar {
  text-align: center;
  padding: 20rpx 0 40rpx;
}

.avatar image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
}

.avatar text {
  display: block;
  padding-top: 20rpx;
  line-height: 1;
  font-size: 26rpx;
  color: #fff;
}

.form {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
}

.form .form-item {
  display: flex;
  height: 96rpx;
  line-height: 46rpx;
  padding: 25rpx 10rpx;
  background-color: #fff;
  font-size: 28rpx;
  border-bottom: 1rpx solid #ddd;
}

.form .form-item:last-child {
  border: none;
}

.form .form-item .label {
  width: 180rpx;
  color: #333;
}

.form .form-item input {
  flex: 1;
  display: block;
  height: 46rpx;
}

.form .form-item .radio {
  display: inline-block;
  height: 46rpx;
  margin-right: 20rpx;
  vertical-align: middle;
}

.form .form-item radio {
  transform: scale(0.7) translateY(-2px);
}

.form .form-item picker {
  flex: 1;
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
