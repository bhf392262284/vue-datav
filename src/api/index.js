import axios from "axios";
// 创建axios实例
const request = axios.create({
  baseURL: "http://ddt.feikeshequ.com/",
  timeout: 8000,
});

// 请求拦截器
request.interceptors.request.use((config) => {
  config.headers["Content-Type"] = "application/json;charset=utf-8";
  return config;
});

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 请求成功
    if (response.data.code === 200) {
      return response.data;
    } else {
      return Promise.reject(new Error(response.data.msg));
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
