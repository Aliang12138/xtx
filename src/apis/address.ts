import { http } from "@/utils/http";

/**
 * empty object，收货地址：请求体参数
 */
export interface PostMemberAddressData {
  /**
   * 详细地址
   */
  address: string;
  /**
   * 地址标签,以英文逗号分割
   */
  addressTags?: string;
  /**
   * 所在城市编码
   */
  cityCode: string;
  /**
   * 联系方式
   */
  contact: string;
  /**
   * 所在区/县编码
   */
  countyCode: string;
  /**
   * 是否为默认，1为是，0为否
   */
  isDefault: number;
  /**
   * 邮政编码
   */
  postalCode?: string;
  /**
   * 所在省份编码
   */
  provinceCode: string;
  /**
   * 收货人姓名
   */
  receiver: string;
}
//添加收货地址
export function postMemberAddress(data: PostMemberAddressData) {
  return http({
    method: "POST",
    url: "/member/address",
    data,
  });
}

/**
 * 数据信息
 */
export interface MemberAddressItem {
  /**
   * 详细地址
   */
  address: string;
  /**
   * 地址标签，号分隔
   */
  addressTags: string;
  /**
   * 所在城市编码
   */
  cityCode: string;
  /**
   * 联系方式
   */
  contact: string;
  /**
   * 所在区/县编码
   */
  countyCode: string;
  /**
   * 完整行政区
   */
  fullLocation: string;
  /**
   * 收货地址id
   */
  id: string;
  /**
   * 是否为默认，1为是，0为否
   */
  isDefault: number;
  /**
   * 邮政编码
   */
  postalCode: string;
  /**
   * 所在省份编码
   */
  provinceCode: string;
  /**
   * 收货人姓名
   */
  receiver: string;
}
//获取收货地址
export function getMemberAddress() {
  return http<MemberAddressItem[]>({
    method: "GET",
    url: "/member/address",
  });
}

//更新收货地址
export function putMemberAddress(id: string, data: PostMemberAddressData) {
  return http({
    method: "PUT",
    url: `/member/address/${id}`,
    data,
  });
}
//查询收货地址
export function getMemberAddressId(id: string) {
  return http<MemberAddressItem>({
    method: "GET",
    url: `/member/address/${id}`,
  });
}
//查询收货地址
export function deleteMemberAddressId(id: string) {
  return http({
    method: "DELETE",
    url: `/member/address/${id}`,
  });
}
