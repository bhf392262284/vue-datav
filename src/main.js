import Vue from "vue";
import App from "./App.vue";
import request from "../src/api/index";
// 将自动注册所有组件为全局组件
import dataV from "@jiaminghi/data-view";
import "./style/base.scss";
Vue.prototype.axios = request;
Vue.use(dataV);
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
