<template>
  <div id="app">
    <dv-full-screen-container class="container">
      <div class="header">
        <div class="header-title">
          <h1>DDT全球流量数据分布</h1>
          <h2>{{ nowTime }}</h2>
          <p>
            <countTo
              :startVal="domesticStart + foreignStart"
              :endVal="domestic + foreign"
              :duration="1500"
            ></countTo>
          </p>
        </div>
        <div class="country-view">
          <div class="country-box">
            <div class="country-name">国内</div>
            <countTo
              :startVal="domesticStart"
              :endVal="domestic"
              :duration="1500"
            ></countTo>
          </div>
          <div class="country-box">
            <div class="country-name">国际</div>
            <countTo
              :startVal="foreignStart"
              :endVal="foreign"
              :duration="1500"
            ></countTo>
          </div>
        </div>
      </div>
      <div class="box-wrapper">
        <div class="box-left">
          <div class="task-quantity">
            <div class="box-header-style box-header-task-title pseudo-element">
              任务量
            </div>
            <div class="conttent">
              <div class="conttent-box">
                <div class="conttent-box-left">
                  <div class="outerCircle">
                    <div class="innerCircle-blue">
                      <div class="innerCircle-purple">
                        <div class="innerCircle-core"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="conttent-box-right">
                  <div class="box-1">
                    <div class="all-box">
                      <div class="box-top">
                        <div>
                          <p>执行中</p>
                          <span class="color1"></span>
                        </div>
                        <i>{{ farmat(doing) }}</i>
                      </div>
                      <div class="box-top">
                        <div>
                          <p>已完成</p>
                          <span class="color2"></span>
                        </div>
                        <i>{{ farmat(done) }}</i>
                      </div>
                    </div>
                    <div class="all-box">
                      <div class="box-top">
                        <div>
                          <p>国内</p>
                          <span class="color3"></span>
                        </div>
                        <i>{{ farmat(domestic) }}</i>
                      </div>
                      <div class="box-top">
                        <div>
                          <p>国外</p>
                          <span class="color4"></span>
                        </div>
                        <i>{{ farmat(foreign) }}</i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="DDT-ph">
            <div class="ddt-height">DDT收益排行榜</div>
            <ul>
              <li
                class="list-one"
                v-for="(item, index) in Revenue"
                :key="index"
              >
                <p class="left-centent">
                  <i v-html="iconClass(index)"></i>
                  <i class="phone">{{ item.user_info.phone }}</i>
                  <i
                    class="form-a-partnership"
                    v-html="judgeUsers(item.user_info.is_supper)"
                    >高级合伙人</i
                  >
                </p>
                <p class="right">{{ item.total_amount }}</p>
              </li>
            </ul>
          </div>
          <div class="monthly-active-users pseudo-element">
            <div class="recharge">
              <div
                class="box-header-style pseudo-element box-header-recharge-title"
              >
                充值
              </div>
              <div class="margin-line">
                <dv-scroll-board
                  :config="{
                    waitTime: 3000,
                    data: rechargeList,
                    rowNum: 4,
                    oddRowBGC: '',
                    evenRowBGC: '',
                  }"
                  style="height:16vh;margin-top:1vh;"
                />
              </div>
              <div class="bottom-box">
                <div class="icon"></div>
                <p>充值总量</p>
                <div class="font-style-size">{{ totalRecharge }}元</div>
              </div>
            </div>
          </div>
        </div>
        <div class="box-center">
          <div class="active-buyers-year">
            <div
              class="box-header-style pseudo-element box-header-buyers-title"
            >
              年度活跃买家
            </div>
            <div class="conttent">
              <div id="conttent-charts"></div>
            </div>
          </div>
        </div>
        <div class="box-right">
          <div class="DDT-ph">
            <div class="ddt-height">
              MONO收益排行榜
            </div>
            <ul>
              <li
                class="list-one"
                v-for="(item, index) in Revenue"
                :key="index"
              >
                <p class="left-centent">
                  <i v-html="iconClass(index)"></i>
                  <i class="phone">{{ item.user_info.phone }}</i>
                  <i
                    class="form-a-partnership"
                    v-if="item.user_info.is_supper === 0"
                    >佣金收益</i
                  >
                  <i class="form-a-partnership" v-else>佣金收益+超级节点</i>
                </p>
                <p class="right">{{ item.total_amount }}</p>
              </li>
            </ul>
          </div>
          <div class="annual-advertising-revenue">
            <div
              class="box-header-style pseudo-element box-header-advertising-title"
            >
              账号
            </div>
            <div id="accountNumberChart"></div>
          </div>
        </div>
      </div>
    </dv-full-screen-container>
  </div>
</template>

<script>
import countTo from "vue-count-to";
import echarts from "echarts";

export default {
  name: "App",
  components: { countTo },
  data() {
    return {
      columnPlot: null, //年广告图表实例
      buyerOfTheYear: null, //年度活跃买家实例
      accountNumberCharts: null, //账号实例
      formatConnactArr: [], // 账号量数据
      totalRecharge: "", //充值总量
      doing: null, //执行中
      domestic: 0, // 国内
      foreign: 0, //国外
      domesticStart: 0, // 国内开始值
      foreignStart: 0, // 国际开始值
      done: null, // 已完成
      Revenue: [], //收益排行
      rechargeList: [], //充值
      nowTime: "", //系统当前时间
    };
  },
  mounted() {
    // 获取当前时间
    this.getTime();
    //任务量
    this.taskQuantity();
    //账号量
    this.accountNumber();
    //收益排行
    this.revenueRanking();
    //充值
    this.rechargeRecord();
    //年度活跃买家
    this.annualActivity();
    //充值总量
    this.totalRechargeMethod();
    // 定时任务
    this.intervalTimes();
  },
  watch: {
    domestic(val, oldVal) {
      this.domesticStart = oldVal;
    },
    foreign(val, oldVal) {
      this.foreignStart = oldVal;
    },
  },
  methods: {
    getTime() {
      let currentTime = () => {
        let d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let date = d.getDate();
        let hour = d.getHours();
        let min = d.getMinutes();
        let sec = d.getSeconds();
        this.nowTime = `${year}年${month}月${date}日 ${hour}:${min}:${
          sec < 10 ? "0" + sec : sec
        }`;
      };
      currentTime();
      setInterval(() => {
        currentTime();
      }, 1000);
    },
    judgeUsers(m) {
      if (m === 0) {
        return "高级合伙人";
      }
      if (m === 1) {
        return "中级合伙人";
      }
      if (m === 2) {
        return "明星合伙人";
      }
      if (m === 3) {
        return "普通商户";
      }
    },
    intervalTimes() {
      this.axios({
        url: "/api/open/display/window/update/interval",
        mounted: "get",
      }).then((res) => {
        const item = res.data.items;
        for (let i = 0; i < item.length; i++) {
          // 任务量
          if (item[i].field_name === "task_update_interval") {
            setInterval(() => {
              this.taskQuantity();
            }, item[i].value * 1000);
          }
          // 充值相关
          if (item[i].field_name === "into_update_interval") {
            setInterval(() => {
              this.totalRechargeMethod();
              this.rechargeRecord();
            }, item[i].value * 1000);
          }
        }
      });
    },
    farmat(mun) {
      if (mun === null) return;
      var m = parseInt(mun).toString();
      var len = m.length;
      if (len <= 3) return m;
      var n = len % 3;
      if (n > 0) {
        return (
          m.slice(0, n) +
          "," +
          m
            .slice(n, len)
            .match(/\d{3}/g)
            .join(",")
        );
      } else {
        return m
          .slice(n, len)
          .match(/\d{3}/g)
          .join(",");
      }
    },
    //充值总量
    totalRechargeMethod() {
      this.axios({
        url: "/api/open/display/window/user/into/total",
        mounted: "get",
      }).then((res) => {
        this.totalRecharge = res.data.total;
      });
    },
    iconClass(item) {
      if (item === 0) {
        return "<div class='-icon the-first'></div>";
      }
      if (item === 1) {
        return "<div class='-icon proxime-accessit'></div>";
      }
      if (item === 2) {
        return "<div class='-icon third'></div>";
      }
      return `<div class="-icon">${item + 1}</div>`;
    },
    //任务量
    taskQuantity() {
      this.axios({ url: "/api/open/display/window/task", mounted: "get" }).then(
        (res) => {
          this.doing = res.data.doing;
          this.domestic = res.data.domestic;
          this.done = res.data.done;
          this.foreign = res.data.foreign;
        }
      );
    },
    //年度活跃买家
    annualActivity() {
      this.axios({
        url: "/api/open/display/window/other/buyer/active",
        mounted: "get",
      }).then((res) => {
        this.buyerOfTheYear = echarts.init(
          document.getElementById("conttent-charts")
        );
        const data = res.data.items;
        const sourceArr = [
          [
            "product",
            "年度活跃买家（亿人）",
            "商家数（万家）",
            "年度交易总额（万亿人民币）",
          ],
        ];
        data.forEach((i) => {
          let arrItem = [];
          for (let k in i) {
            // 名字
            if (k === "platform_name") {
              arrItem.splice(0, 0, i[k]);
            }
            // 年度活跃买家
            if (k === "buyer") {
              arrItem.splice(1, 0, i[k] / 100000000);
            }
            // 商家数
            if (k === "merchant") {
              arrItem.splice(2, 0, i[k] / 100000000);
            }
            // 年度交易总额
            if (k === "turnover") {
              arrItem.splice(3, 0, i[k] / 100000000);
            }
          }
          sourceArr.push(arrItem);
        });
        // 绘制图表
        this.buyerOfTheYear.setOption({
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          legend: {
            top: -5,
            textStyle: {
              color: "#D8DEF5",
            },
          },
          grid: {
            top: 50,
            left: 0,
            right: 0,
            bottom: 18,
          },
          yAxis: [
            {
              show: false,
              type: "value",
            },
          ],
          dataset: {
            source: sourceArr,
          },
          xAxis: {
            pictorialBar: "-50%",
            type: "category",
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                width: 0,
                color: "#fff",
              },
            },
          },
          series: [
            {
              type: "bar",
              barGap: 0,
              barWidth: 35,
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: "top", //在上方显示
                    textStyle: {
                      //数值样式
                      color: "#DD4171",
                    },
                  },
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#962CB0" },
                    { offset: 1, color: "#3928B0" },
                  ]),
                },
              },
            },
            {
              type: "bar",
              barGap: 0,
              barWidth: 35,
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: "top", //在上方显示
                    textStyle: {
                      //数值样式
                      color: "#DD4171",
                    },
                  },
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#DD4171" },
                    { offset: 1, color: "#962CB0" },
                  ]),
                },
              },
            },
            {
              type: "bar",
              barGap: 0,
              barWidth: 35,
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: "top", //在上方显示
                    textStyle: {
                      //数值样式
                      color: "#DD4171",
                    },
                  },
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#E3928F" },
                    { offset: 1, color: "#DD4171" },
                  ]),
                },
              },
            },
          ],
        });
      });
      const resizeEcharts = () => {
        this.buyerOfTheYear.resize();
      };
      window.removeEventListener("resize", resizeEcharts, false);
      window.addEventListener("resize", resizeEcharts);
    },
    //账号量
    accountNumber() {
      this.axios({
        url: "/api/open/display/window/user/item",
        mounted: "get",
      }).then((res) => {
        this.accountNumberCharts = echarts.init(
          document.getElementById("accountNumberChart")
        );
        let name = [];
        let newlyAdded = [];
        let current = [];
        res.data.items.forEach((item) => {
          name.push(item.platform_name);
          newlyAdded.push(item.new_item_total);
          current.push(item.item_total);
        });
        this.accountNumberCharts.setOption({
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
            formatter: function(params) {
              let str = ""; //声明一个变量用来存储数据
              //图显示的数据较多时需要循环数据，这样才可以成功的给多条数据添加单位
              for (let i = 0; i < params.length; i++) {
                if (i === 0) {
                  str +=
                    '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#DD4171;"></span>' +
                    params[i].seriesName +
                    ": " +
                    params[i].data +
                    "万" +
                    "</br>";
                } else {
                  str +=
                    '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#E3928F;"></span>' +
                    params[i].seriesName +
                    ": " +
                    params[i].data +
                    "万" +
                    "</br>";
                }
              }
              return str;
            },
          },
          legend: {
            data: ["当前使用账号", "新增使用账号"],
            itemGap: 90,
            top: "8%",
            textStyle: {
              color: "#D8DEF5",
            },
          },
          grid: {
            top: "15%",
            left: "8%",
            right: "13%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: {
            show: false,
            splitLine: {
              show: false,
            },
            axisTick: {
              //y轴刻度线
              show: false,
            },
            type: "value",
            boundaryGap: [0, 0.01],
          },
          yAxis: {
            axisLabel: {
              color: "#ffffff",
            },
            axisLine: {
              //y轴
              show: false,
            },
            axisTick: {
              show: false,
            },
            type: "category",
            data: name,
          },
          series: [
            {
              name: "当前使用账号",
              type: "bar",
              data: current,
              barGap: 0,
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: "right", //在上方显示
                    textStyle: {
                      //数值样式
                      color: "#D8DEF5",
                    },
                  },
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#962CB0" },
                    { offset: 1, color: "#DD4171" },
                  ]),
                },
              },
            },
            {
              name: "新增使用账号",
              type: "bar",
              data: newlyAdded,
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: "right", //在上方显示
                    textStyle: {
                      //数值样式
                      color: "#DD4171",
                    },
                  },
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: "#DD4171" },
                    { offset: 1, color: "#E3928F" },
                  ]),
                },
              },
            },
          ],
        });
      });
      const resizeEcharts = () => {
        this.accountNumberCharts.resize();
      };
      window.removeEventListener("resize", resizeEcharts, false);
      window.addEventListener("resize", resizeEcharts);
    },
    //收益排行
    revenueRanking() {
      this.axios({
        url: "/api/open/display/window/user/profit",
        mounted: "get",
      }).then((res) => {
        this.Revenue = res.data.items.slice(0, 5);
      });
    },
    //充值
    rechargeRecord() {
      this.axios({
        url: "/api/open/display/window/user/into",
        mounted: "get",
      }).then((res) => {
        let formatArr = [];
        let arr = res.data.items;
        for (let i = 0; i < arr.length; i++) {
          let userName = "";
          let userClass = "";
          if (arr[i].user_info.is_supper === 0) {
            userName = "普通用户";
            userClass = "btn-style-ordinary";
          }
          if (arr[i].user_info.is_supper === 1) {
            userName = "超级用户";
            userClass = "btn-style-super";
          }
          let str = `<div class="recharge-box"><i class="${userClass}">${userName}</i>${arr[i].user_info.phone}  ${arr[i].status_updated_at}，充值<span style="color:#dd4171;">${arr[i].amount}元</span>到账</div>`;
          formatArr.push([str]);
        }
        this.rechargeList = formatArr;
      });
    },
    // 获取充值记录
    getRechargeList() {
      let formatArr = [];
      let arr = [];
      for (let i = 0; i < arr.length; i++) {
        let userName = "";
        let userClass = "";
        if (arr[i].user_info.is_supper === 0) {
          userName = "普通用户";
          userClass = "btn-style-ordinary";
        }
        if (arr[i].user_info.is_supper === 1) {
          userName = "超级用户";
          userClass = "btn-style-super";
        }
        let str = `<div class="recharge-box"><i class="${userClass}">${userName}</i>${arr[i].name}${arr[i].status_updated_at}，充值<span style="color:#dd4171;">${arr[i].amount}元</span>到账</div>`;
        formatArr.push([str]);
      }
      this.rechargeList = formatArr;
    },
  },
};
</script>

<style scoped lang="scss">
@keyframes rotateAnimation {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
.container {
  background: url(../src/assets/img/Globe-Map_5.gif) #0a0a22 no-repeat center
    45%;
  .pseudo-element {
    position: relative;
    &:after {
      position: absolute;
      top: 15px;
      left: 16px;
      content: "";
      width: 0.1vw;
      display: inline-block;
      height: 1.7vh;
      background: rgba(216, 222, 245, 1);
    }
  }
  .header {
    &::after {
      position: absolute;
      left: -10vw;
      top: 5.8vh;
      content: "";
      background: url(../src/assets/img/topleft.png) no-repeat;
      background-size: 100% 100%;
      display: inline-block;
      width: 10.14vw;
      height: 2vh;
    }
    &::before {
      position: absolute;
      right: -10vw;
      top: 5.8vh;
      content: "";
      background: url(../src/assets/img/bgright.png) no-repeat;
      background-size: 100% 100%;
      display: inline-block;
      width: 10.14vw;
      height: 2vh;
    }
    .header-title {
      position: relative;
      height: 15vh;
      background: url(../src/assets/img/bgtop1.png) no-repeat;
      background-size: 100% 100%;
      h2 {
        width: 15vw;
        position: absolute;
        top: 43px;
        right: -499px;
      }
    }
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -24.215vw;
    width: 48.43vw;
    text-align: center;
    z-index: 1;
    &-title {
      position: relative;
      &:before {
        content: "";
        position: absolute;
        left: -23.95vw;
        top: 56%;
        z-index: 1;
        width: 23.95vw;
        height: 0.31vh;
        background: linear-gradient(
          315deg,
          rgba(57, 40, 176, 1) 0%,
          rgba(57, 40, 176, 0) 100%
        );
      }
      &:after {
        content: "";
        position: absolute;
        left: 100%;
        top: 56%;
        z-index: 1;
        width: 23.95vw;
        height: 0.31vh;
        background: linear-gradient(
          90deg,
          rgba(57, 40, 176, 1) 0%,
          rgba(57, 40, 176, 0) 100%
        );
      }
    }
    h1 {
      font-size: 36px;
      color: #c0cbf6;
      padding-top: 1.03vh;
      font-weight: bold;
    }
    p {
      font-size: 54px;
      color: #dd4171;
      margin-top: 0.6vh;
      font-weight: bold;
    }
    .country-view {
      display: flex;
      justify-content: center;
      margin-top: 2vh;
      .country-box {
        width: 16.09vw;
        text-align: left;
        background: url(../src/assets/img/bgtop2.png) no-repeat;
        background-size: auto;
        &:first-child {
          margin-right: 1.25vw;
        }
        &:last-child {
          margin-left: 1.25vw;
        }
        .country-name {
          margin-top: 1.48vh;
          font-size: 16px;
          margin-left: 1.19vw;
          margin-bottom: 0.74vh;
          ~ span {
            display: inline-block;
            font-size: 24px;
            font-weight: bold;
            margin-left: 1.19vw;
            margin-bottom: 1.48vh;
          }
        }
      }
    }
  }
  .box-wrapper {
    display: flex;
    margin-left: 2.08vw;
    margin-right: 2.08vw;
    margin-bottom: 2.06vh;
    margin-top: 15.5vh;
    .DDT-ph {
      overflow: hidden;
      height: 26.38vh;
      margin-top: 2.5vh;
      .ddt-height {
        font-size: 18px;
        margin-bottom: 0.74vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url(../src/assets/img/rectangle.png) no-repeat;
        background-size: 100% 100%;
        height: 3.7vh;
      }
      ul .list-one {
        padding-left: 1.5vw;
        padding-right: 2vw;
        background: url(../src/assets/img/list.png) no-repeat;
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 4.32vh;
        .left-centent {
          align-items: center;
          display: flex;
          .sign {
            width: 1.25vw;
            height: 2.22vh;
            margin-right: 0.62vw;
          }
          .phone {
            font-size: 14px;
          }
          .form-a-partnership {
            margin-left: 0.41vw;
            color: #962cb0;
            font-size: 12px;
          }
        }
        .right {
          color: #dd4171;
          font-size: 20px;
        }
      }
    }
    .box-header-style {
      font-size: 20px;
      padding: 1.11vh 0 1vh 1.56vw;
      ~ .conttent {
        padding: 0.2vh 1.63vw;
        .conttent-box {
          display: flex;
          align-items: center;
          .conttent-box-left {
            width: 168px;
            height: 168px;
            margin-right: 1.09vw;
            padding: 15px;
            .outerCircle {
              height: 140px;
              position: relative;
              height: 100%;
              background: url(../src/assets/img/outerCircle.png) no-repeat
                center center;
              background-size: 100% 100%;
              .innerCircle-blue {
                position: absolute;
                top: 22px;
                left: 22px;
                right: 22px;
                bottom: 22px;
                background: url(../src/assets/img/innerCircle-blue.png)
                  no-repeat center center;
                background-size: 100% 100%;
                z-index: 1;
              }
              .innerCircle-purple {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url(../src/assets/img/innerCircle-purple.png)
                  no-repeat center center;
                background-size: 100% 100%;
                z-index: 2;
                animation: rotateAnimation 1.2s linear infinite;
              }
              .innerCircle-core {
                position: absolute;
                width: 36px;
                height: 36px;
                left: 50%;
                top: 50%;
                margin-left: -18px;
                margin-top: -18px;
                background: url(../src/assets/img/circleCore.png) no-repeat
                  center center;
                background-size: 100% 100%;
                z-index: 1;
              }
            }
          }
          .conttent-box-right {
            flex-direction: column;
            justify-content: space-between;
            flex: 1;
            padding-left: 0.5vw;
            overflow: hidden;
            .box-1 {
              display: flex;
              flex-direction: column;
              margin-top: -2vh;
            }
            .all-box {
              display: flex;
              margin-top: 2vh;
              .box-top {
                width: 50%;
                padding-left: 0.55vw;
              }
              .box-top i {
                font-weight: 600;
                font-style: normal;
                display: inline-block;
                font-size: 18px;
                margin-right: 1.66vw;
              }
              .box-top div {
                position: relative;
                margin-bottom: 0.74vh;
                align-items: center;
                display: flex;
              }
              .box-top span {
                position: absolute;
                left: -0.8vw;
                border-radius: 50%;
                width: 0.41vw;
                height: 0.74vh;
              }
              .box-top p {
                font-size: 16px;
                color: #d8def5;
              }
            }
          }
        }
      }
      &.box-header-style-account {
        padding-left: 0.8vw;
      }
    }
    .box-left {
      width: 25.36vw;
      flex: 0 0 25.36vw;
      .task-quantity {
        background: url(../src/assets/img/bg1.png) no-repeat;
        background-size: 100% 100%;
        height: 24.81vh;
      }
      .account-number {
        padding-bottom: 2.03vh;
        background: url(../src/assets/img/bg2.png) no-repeat;
        height: 32.96vh;
        background-size: 100% 100%;
        margin-top: 1.48vh;
        .conttent-box-right {
          .conttent-box-top {
            height: 14vh;
            padding: 0.2vh 1.63vw;
          }
        }
      }
      .monthly-active-users {
        .recharge {
          padding-right: 1.2vw;
          overflow: hidden;
          position: relative;
          background: url(../src/assets/img/bg6.png) no-repeat;
          background-size: 100% 100%;
          height: 27.85vh;
          width: 25vw;
          margin-top: 1.85vh;
          .margin-line {
            padding-left: 1vw;
            padding-top: 0.6vh;
            padding-bottom: 0.6vh;
          }
          .bottom-box {
            margin-left: 1.35vw;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-top: 0.5vh;
            .icon {
              display: flex;
              align-items: center;
              width: 0.83vw;
              height: 1.48vh;
              background: url(../src/assets/img/icon1.png) no-repeat;
              background-size: 100% 100%;
            }
            p {
              font-size: 16px;
              color: #d8def5;
            }
            .font-style-size {
              margin-left: 0.83vw;
              font-size: 20px;
              color: #dd4171;
            }
          }
        }
      }
    }
    .box-center {
      display: flex;
      flex-direction: column-reverse;
      flex: 1;
      margin-left: 2.1875vw;
      margin-right: 2.1875vw;
      .active-buyers-year {
        background: url(../src/assets/img/bg4.png) no-repeat;
        background-size: 100% 100%;
        height: 22.22vh;
      }
    }
    .box-right {
      width: 26vw;
      flex: 0 0 25vw;
      .revenue-leaderboard {
        height: 29.62vh;
        ul {
          height: 21.5vh;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        ul .package {
          padding-left: 1.5vw;
          height: 4.32vh;
          align-items: center;
          background: url(../src/assets/img/list.png) no-repeat;
          background-size: 100% 100%;
          display: flex;
          .user-name {
            text-overflow: ellipsis;
          }
          li:nth-child(1) {
            width: 6.5vw;
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
          }
          li:nth-child(2) {
            color: #962cb0;
            width: 8vw;
            font-size: 12px;
          }
          li:nth-child(3) {
            text-align: right;
            justify-content: left;
            width: 5vw;
            font-size: 20px;
            color: #dd4171;
          }
        }
        .first-one {
          background: url(../src/assets/img/rectangle.png) no-repeat;
          background-size: 100% 100%;
          margin-bottom: 1.1vh;
          align-items: center;
          height: 4.53vh;
          display: flex;
          justify-content: center;
          p {
            font-size: 18px;
          }
        }
      }
      .annual-advertising-revenue {
        height: 52.6vh;
        background: url(../src/assets/img/bg2.png) no-repeat;
        background-size: 100% 100%;
        margin-top: 1.85vh;
      }
    }
  }
  .color1 {
    background-color: #e3928f;
  }
  .color2 {
    background-color: #dd4171;
  }
  .color3 {
    background-color: #962cb0;
  }
  .color4 {
    background-color: #3928b0;
  }
  .color-style1 {
    background-color: #3928b0;
  }
  .color-style2 {
    background-color: #dd4171;
  }
  .color-style3 {
    background-color: #962cb0;
  }
  .package-data {
    padding-right: 1vw;
    .contain {
      margin-top: 1.38vh;
      display: flex;
      align-items: center;
      p {
        font-size: 14px;
        margin-right: 0.2vw;
      }
      .circle-and-content {
        display: flex;
        align-items: center;
        flex: 1;
      }
      .circle-and-content i {
        font-size: 12px;
        font-style: normal;
      }
      .circle-and-content span {
        border-radius: 50%;
        margin-right: 0.2vw;
        display: inline-block;
        width: 0.36vw;
        height: 0.64vh;
      }
    }
  }
  #conttent-charts {
    height: 15.8vh;
  }
  #monthlyActivity {
    height: 16vh;
  }
  #accountNumberChart {
    height: 48.5vh;
  }
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #account-number-chart {
    height: 25vh;
  }
}
</style>
