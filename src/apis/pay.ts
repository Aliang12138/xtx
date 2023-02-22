import { http } from "@/utils/http";

/**
 * 支付信息
 */
export interface GetPayWxPayMiniPayResult {
  /**
   * appId
   */
  appId?: string;
  /**
   * 随机字符串，长度为32个字符以下
   */
  nonceStr: string;
  /**
   * 统一下单接口返回的 prepay_id 参数值
   */
  package: string;
  /**
   * 微信支付签名
   */
  paySign: string;
  /**
   * 签名算法
   */
  signType: "MD5" | "HMAC-SHA256" | "RSA";
  /**
   * 时间戳，即当前的时间
   */
  timeStamp: string;
}
/**
 * 支付-微信-小程序
 * 🔔重要说明
 *    1. 由于微信安全限制，该接口只允许 appid 为 wx26729f20b9efae3a 的开发者调用。
 *    2. 其他开发者更新订单状态，可调用模拟接口支付接口，调用后订单状态更新为已支付。
 */
export function getPayWxPayMiniPay(orderId: string) {
  return http<GetPayWxPayMiniPayResult>({
    method: "GET",
    url: "/pay/wxPay/miniPay",
    data: { orderId },
  });
}

/**
 * 模拟支付-更新订单支付状态
 * @param orderId 订单号
 */
export function getPayMock(orderId: string) {
  return http({
    method: "GET",
    url: "/pay/mock",
    data: { orderId },
  });
}
