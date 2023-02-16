import { http } from "@/utils/http";

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
