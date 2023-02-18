//接口服务器基地址
// const baseURL = "https://pcapi-xiaotuxian-front-devtest.itheima.net";

import { useMemberStore } from "@/store/member";

//备用服务器
const baseURL = "https://pcapi-xiaotuxian-front.itheima.net";

//添加拦截器
uni.addInterceptor("request", {
  //拦截前触发
  invoke(args: UniApp.RequestOptions) {
    //如果不是http开头的,才需要进行URL拼接
    if ((args.url as string).startsWith("http") === false) {
      // request 触发前拼接 url
      args.url = baseURL + args.url;
    }
    //小程序端调用,请求头中header中必须添加:source-client:miniapp
    args.header = {
      ...args.header, //保留原本的header
      "source-client": "miniapp", //添加小程序端调用标识
    };
    //在非vue文件中哪里使用就在哪里调用
    const memberStore = useMemberStore();
    // 获取token
    const token = memberStore.profile.token;
    if (token) {
      args.header.Authorization = token;
    }
  },
});
//添加拦截器
uni.addInterceptor("uploadFile", {
  //拦截前触发
  invoke(args: UniApp.RequestOptions) {
    //如果不是http开头的,才需要进行URL拼接
    if ((args.url as string).startsWith("http") === false) {
      // request 触发前拼接 url
      args.url = baseURL + args.url;
    }
    //小程序端调用,请求头中header中必须添加:source-client:miniapp
    args.header = {
      ...args.header, //保留原本的header
      "source-client": "miniapp", //添加小程序端调用标识
    };
    //在非vue文件中哪里使用就在哪里调用
    const memberStore = useMemberStore();
    // 获取token
    const token = memberStore.profile.token;
    if (token) {
      args.header.Authorization = token;
    }
  },
});

type ApiRes = {
  code: string;
  msg: string;
  result: any;
};

export const http = <T>(options: UniApp.RequestOptions) => {
  //返回promise对象
  return new Promise<T>((resolve, reject) => {
    uni.request({
      //应用所有的参数
      ...options,
      //成功
      success(res) {
        resolve((res.data as ApiRes).result);
      },
      //失败
      fail(err) {
        reject(err);
      },
    });
  });
};
