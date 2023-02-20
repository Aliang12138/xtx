import { http } from "@/utils/http";

/**
 * 加入购物车
 */
export interface PostMemberCartData {
  /**
   * 数量
   */
  count: number;
  /**
   * SKUID
   */
  skuId: string;
}

/**
 * 购物车数据信息
 */
export interface MemberCartItem {
  /**
   * 属性文字，例如“颜色:瓷白色 尺寸：8寸”
   */
  attrsText: string;
  /**
   * 数量
   */
  count: number;
  /**
   * 折扣信息
   */
  discount: number;
  /**
   * SPUID
   */
  id: string;
  /**
   * 是否收藏
   */
  isCollect: boolean;
  /**
   * 是否为有效商品
   */
  isEffective: boolean;
  /**
   * 商品名称
   */
  name: string;
  /**
   * 当前的价格
   */
  nowPrice: number;
  /**
   * 图片
   */
  picture: string;
  /**
   * 加入时价格
   */
  price: number;
  /**
   * 是否选中
   */
  selected: boolean;
  /**
   * SKUID
   */
  skuId: string;
  /**
   * 库存
   */
  stock: number;
}

/**
 * 删除/清空购物车商品参数
 */
export interface DeleteMemberCartData {
  /**
   * 是否清空，默认否
   */
  clearAll?: boolean;
  /**
   * 是否清空无效商品，默认否
   */
  clearInvalid?: boolean;
  /**
   * SKUID集合
   */
  ids: string[];
}

/**
 * 修改购物车商品参数
 */
export interface PutMemberCartData {
  /**
   * 数量
   */
  count?: number;
  /**
   * 是否选中
   */
  selected?: boolean;
}

/**
 * 购物车全选/取消全选
 */
export interface PutMemberCartSelectedData {
  /**
   * skuId集合
   */
  ids?: string[];
  /**
   * 是否选中
   */
  selected: boolean;
}

/**
 * 加入购物车
 */
export function postMemberCart(data: PostMemberCartData) {
  return http({
    method: "POST",
    url: "/member/cart",
    data,
  });
}

/**
 * 获取购物车列表接口
 */
export function getMemberCart() {
  return http<MemberCartItem[]>({
    method: "GET",
    url: "/member/cart",
  });
}

/**
 * 删除/清空购物车商品
 */
export function deleteMemberCart(data: DeleteMemberCartData) {
  return http({
    method: "DELETE",
    url: "/member/cart",
    data,
  });
}

/**
 * 修改购物车商品
 */
export function putMemberCartById(skuId: string, data: PutMemberCartData) {
  return http({
    method: "PUT",
    url: `/member/cart/${skuId}`,
    data,
  });
}

/**
 * 购物车全选/取消全选
 */
export function putMemberCartSelected(data: PutMemberCartSelectedData) {
  return http({
    method: "PUT",
    url: "/member/cart/selected",
    data,
  });
}
