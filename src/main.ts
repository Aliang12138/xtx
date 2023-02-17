import { createSSRApp } from "vue";
import App from "./App.vue";

import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
export function createApp() {
  //app应用实例
  const app = createSSRApp(App);
  //创建pinia实例
  const pinia = createPinia();
  //为pinia添加持久化存储插件
  pinia.use(piniaPluginPersistedstate);
  //为app添加pinia
  app.use(pinia);
  return {
    app,
  };
}
