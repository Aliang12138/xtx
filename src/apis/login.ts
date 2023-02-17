import { http } from "@/utils/http";

// /**
//  * 小程序登录请求体
//  */
// export interface postLoginWxMinData {
//   /**
//    * code 通过 wx.login() 获取
//    */
//   code: string;
//   /**
//    * 加密的手机号信息 getphonenumber事件回调中获取
//    */
//   encryptedData: string;
//   /**
//    * 加密相关 getphonenumber事件回调中获取
//    */
//   iv: string;
// }

// export function postLoginWxMin(data: postLoginWxMinData) {
//   return http({
//     method: "POST",
//     url: "/login/wxMin",
//     data,
//   });
// }

/**
 * 用户信息
 */
export interface LoginWxResult {
  /**
   * 用户名
   */
  account: string;
  /**
   * 用户头像
   */
  avatar: string;
  /**
   * 用户id
   */
  id: string;
  /**
   * 用户手机号
   */
  mobile: string;
  /**
   * 用户昵称
   */
  nickname: null | string;
  /**
   * 用于后续接口调用的token，有效期三天
   */
  token: string;
}
//内测模拟接口
export function postLoginWxMinSimple(phoneNumber: string) {
  return http<LoginWxResult>({
    method: "POST",
    url: "/login/wxMin/simple",
    data: {
      phoneNumber,
    },
  });
}
