import { LoginWxResult } from "@/apis/login";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useMemberStore = defineStore(
  "member",
  () => {
    const profile = ref<LoginWxResult>({} as LoginWxResult);
    const setProfile = (val: LoginWxResult) => {
      profile.value = val;
    };
    //计算是否登录
    const isLogin = computed(() => Boolean(profile.value.token));

    return { profile, setProfile, isLogin };
  },
  {
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
