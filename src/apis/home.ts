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
