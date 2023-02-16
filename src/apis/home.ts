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
 * 数据
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
export function getHomeCategoryMutli() {
  return http<CategoryItem[]>({
    method: "GET",
    url: "/home/category/mutli",
  });
}
