<script setup lang="ts">
import { reactive, ref } from "vue";

import { onLoad } from "@dcloudio/uni-app";
import { getHotRecommend, GoodsItem, SubType } from "@/apis/home";

interface metaType {
  title: string;
  coverPath: string;
  tabs: string[];
}

const metaMap = reactive<{ [key: string]: metaType }>({
  1: {
    title: "特惠推荐",
    coverPath:
      "https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/recommend_1.jpg",
    tabs: ["价格", "折扣", "筛选"],
  },
  2: {
    title: "爆款推荐",
    coverPath:
      "https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/recommend_2.jpg",
    tabs: ["24小时热搜", "热销总榜", "人气周榜"],
  },
  3: {
    title: "一站买全",
    coverPath:
      "https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/recommend_3.jpg",
    tabs: ["搞定熊孩子", "家里不凌乱", "让音质更出众"],
  },
  5: {
    title: "新鲜好物",
    coverPath:
      "https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/recommend_4.jpg",
    tabs: ["抢先尝新", "新品预告"],
  },
});

let type = $ref("1");
let meta = $ref(metaMap[type]);

onLoad(({ type }) => {
  if (type) meta = metaMap[type];
});

// 动态更新导航栏标题
uni.setNavigationBarTitle({
  title: meta.title,
});

//-----------------------------------------
const bannerPicture = ref("");
// type SubTypesAndGoods = SubType & GoodsItem;
const subTypes = ref<SubType[]>([]);
const urlMap = [
  { type: "1", url: "/hot/preference" },
  { type: "2", url: "/hot/inVogue" },
  { type: "3", url: "/hot/oneStop" },
  { type: "4", url: "/hot/preference" },
  { type: "5", url: "/hot/new" },
];
let currUrl = "";
onLoad(async ({ type }) => {
  const currUrlMap = urlMap.find((v) => v.type === type);
  if (currUrlMap) {
    //保存请求
    currUrl = currUrlMap.url;
    const res = await getHotRecommend(currUrlMap.url, {});
    //动态更新导航栏标题
    uni.setNavigationBarTitle({ title: res.title });
    //保存轮播图
    bannerPicture.value = res.bannerPicture;
    //保存tabs数据
    // subTypes.value = res.subTypes;
    res.subTypes.forEach((item) => {
      const obj = {
        ...item,
        ...res.subTypes[Number(item.id)],
      };
      subTypes.value.push(obj);
    });
  }
});

//分类高亮
const activeIndex = ref(0);
const changeTabs = (index: number) => {
  activeIndex.value = index;
};

//分类滚动
// const onScrolltolower = async () => {
//   const currSubtypes = subTypes.value[activeIndex.value];
//   currSubtypes.goodsItems.page++;
//   const res = await getHotRecommend(currUrl, {
//     pageSize: 10,
//     page: currSubtypes.page,
//     subType: currSubtypes.id,
//   });
//   console.log(res.subTypes[Number(currSubtypes.id)].items);
// };
</script>

<template>
  <view class="viewport">
    <!-- 推荐封面图 -->
    <view class="cover">
      <image :src="bannerPicture"></image>
    </view>
    <view class="tabs">
      <text
        class="text"
        v-for="(item, index) in subTypes"
        :key="item.id"
        :class="{ active: index === activeIndex }"
        @tap="changeTabs(index)"
        >{{ item.title }}</text
      >
    </view>
    <scroll-view
      v-for="(item, index) in subTypes"
      :key="item.id"
      scroll-y
      enhanced
      :show-scrollbar="false"
      class="scroll-view"
      v-show="activeIndex === index"
    >
      <!-- @scrolltolower="onScrolltolower" -->
      <view class="goods">
        <navigator
          hover-class="none"
          :url="`/pages/goods/index?=${goods.id}`"
          class="navigator"
          v-for="goods in item.goodsItems.items"
          :key="goods.id"
        >
          <image class="thumb" :src="goods.picture"></image>
          <view class="name ellipsis">{{ goods.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ goods.price }}</text>
            <!-- <text class="decimal">.00</text> -->
          </view>
        </navigator>
      </view>
      <view class="loading">正在加载...</view>
    </scroll-view>
  </view>
</template>

<style>
page {
  height: 100%;
  background-color: #f4f4f4;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 180rpx 0 0;
  position: relative;
}

.cover {
  width: 750rpx;
  height: 225rpx;
  border-radius: 0 0 40rpx 40rpx;
  overflow: hidden;

  position: absolute;
  left: 0;
  top: 0;
}

.tabs {
  display: flex;
  justify-content: space-evenly;
  height: 100rpx;
  line-height: 90rpx;
  margin: 0 20rpx;
  font-size: 28rpx;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 5rpx rgba(200, 200, 200, 0.3);
  color: #333;
  background-color: #fff;
  position: relative;
  z-index: 9;
}

.tabs .text {
  margin: 0 20rpx;
  position: relative;
}

.tabs .active::after {
  content: "";
  width: 40rpx;
  height: 4rpx;
  transform: translate(-50%);
  background-color: #27ba9b;
  position: absolute;
  left: 50%;
  bottom: 24rpx;
}

.scroll-view {
  flex: 1;
}

.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx 20rpx;
}

.goods .navigator {
  width: 345rpx;
  padding: 20rpx;
  margin-top: 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
}

.goods .thumb {
  width: 305rpx;
  height: 305rpx;
}

.goods .name {
  height: 88rpx;
  font-size: 26rpx;
}

.goods .price {
  line-height: 1;
  color: #cf4444;
  font-size: 30rpx;
}

.goods .symbol,
.goods .decimal {
  font-size: 70%;
}
</style>
