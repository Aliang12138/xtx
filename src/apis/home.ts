import { http } from "@/utils/http";

//轮播图数据
export interface BannerItem {
  hrefUrl: string;
  id: string;
  imgUrl: string;
  type: number;
}

/**
 *
 * @param distributionSite 示例值：广告区域展示位置,1 为首页（默认值）2 为商品分类页
 */
//广告轮播
export function getHomeBanner(distributionSite = 1) {
  return http<BannerItem[]>({
    method: "GET",
    url: "/home/banner",
    data: {
      distributionSite: distributionSite,
    },
  });
}

/**
 * 前台分类数据
 */
export interface CategoryItem {
  /**
   * 展示图标
   */
  icon: string;
  /**
   * id
   */
  id: string;
  /**
   * 分类名称
   */
  name: string;
}

// 前台分类
export function getHomeCategory() {
  return http<CategoryItem[]>({
    method: "GET",
    url: "/home/category/mutli",
  });
}

/**
 * 热门推荐数据信息
 */
export interface HotItem {
  /**
   * 说明
   */
  alt: string;
  /**
   * id
   */
  id: string;
  /**
   * 图片集合
   */
  pictures: string[];
  /**
   * 跳转地址
   */
  target: string;
  /**
   * 标题
   */
  title: string;
}
//热门推荐
export function getHomeHot() {
  return http<HotItem[]>({
    method: "GET",
    url: "/home/hot/mutli",
  });
}

/**
 * 新鲜好物数据信息
 */
export interface HomeNewItem {
  /**
   * 备注
   */
  desc: string;
  /**
   * id
   */
  id: string;
  /**
   * 商品名称
   */
  name: string;
  /**
   * 商品图片链接
   */
  picture: string;
  /**
   * 价格
   */
  price: number;
}

/**
 *
 * @param limit 默认值为 4，指定响应数据中商品的数量
 */
//新鲜好物
export function getHomeNew(limit = 4) {
  return http<HomeNewItem[]>({
    method: "GET",
    url: "/home/new",
    data: {
      limit,
    },
  });
}

/**
 * 首页-猜你喜欢-请求参数
 */
interface GetHomeGoodsGuessLikeData {
  /**
   * 说明：页码默认值1
   */
  page?: number;
  /**
   * 说明：页大小默认是10
   */
  pageSize?: number;
}

/**
 *  首页-猜你喜欢-返回数据
 */
export interface GetHomeGoodsGuessLikeResult {
  /**
   * 总条数
   */
  counts: number;
  /**
   * 当前页数据
   */
  items: GuessItem[];
  /**
   * 当前页数
   */
  page: number;
  /**
   * 总页数
   */
  pages: number;
  /**
   * 每页条数
   */
  pageSize: number;
}

export interface GuessItem {
  /**
   * 商品描述
   */
  desc: string;
  /**
   * 商品折扣
   */
  discount: number;
  /**
   * id
   */
  id: string;
  /**
   * 商品名称
   */
  name: string;
  /**
   * 商品已下单数量
   */
  orderNum: number;
  /**
   * 商品图片
   */
  picture: string;
  /**
   * 商品价格
   */
  price: number;
}
/**
 * 首页-猜你喜欢-小程序和app
 */
export function getHomeguessLike(data: GetHomeGoodsGuessLikeData) {
  return http<GetHomeGoodsGuessLikeResult>({
    method: "GET",
    url: "/home/goods/guessLike",
    data: data,
  });
}
