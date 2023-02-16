//接口服务器基地址
const baseURL = "https://pcapi-xiaotuxian-front-devtest.itheima.net";

//添加拦截器
uni.addInterceptor("request", {
  //拦截前触发
  invoke(args) {
    //如果不是http开头的,才需要进行URL拼接
    if ((args.url as string).startsWith("http") === false) {
      // request 触发前拼接 url
      args.url = baseURL + args.url;
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
