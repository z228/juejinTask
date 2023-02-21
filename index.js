// index.js

"use strict";

// Nodemailer是一个简单易用的Node.js邮件发送组件
const nodeMailer = require("nodemailer");
// 易用、简洁且高效的http库
const axios = require("axios");
// 请求签到、抽奖的接口
/**
 * 信息配置
 * 1、请求签到、抽奖的接口配置
 * 2、请求接口的cookie配置
 * 3、发送邮件的配置
 * */
const config = {
  baseUrl: "https://api.juejin.cn",
  apiurl: {
    getTodayStatus: "/growth_api/v1/get_today_status",
    checkIn: "/growth_api/v1/check_in",
    getLotteryConfig: "/growth_api/v1/lottery_config/get",
    drawLottery: "/growth_api/v1/lottery/draw?aid=2608&uuid=7078942926118012424&spider=0",
    dip: "/growth_api/v1/lottery_lucky/dip_lucky",
  },
  // 请求接口的cookie配置 cookie的获取见下面的图片说明
  cookie: `__tea_cookie_tokens_2608=%7B%22web_id%22%3A%227078942926118012424%22%2C%22user_unique_id%22%3A%227078942926118012424%22%2C%22timestamp%22%3A1648194845462%7D; _ga=GA1.2.489082917.1648194846; odin_tt=3a70d5fa240451c0476fe4a90c11ef69d965290f02ce85caf631b2747dac5900870e4340ad53265a67800ac87f613e2fc98f8e15887bb6dbac9d19438423dfcb; sid_guard=145f9b8c949aeaacc5469dc92d34892c|1653528799|31536000|Fri,+26-May-2023+01:33:19+GMT; uid_tt=e99926705e6083dc22c3ce7de9b39ac8; uid_tt_ss=e99926705e6083dc22c3ce7de9b39ac8; sid_tt=145f9b8c949aeaacc5469dc92d34892c; sessionid=145f9b8c949aeaacc5469dc92d34892c; sessionid_ss=145f9b8c949aeaacc5469dc92d34892c; sid_ucp_v1=1.0.0-KDRjNTE5NzczNTEzOTAxMWIyNDQwYzZiNTBlMjhkODQ4MGNlM2JiMGEKFwit0bDsjo2NBxDfsbuUBhiwFDgCQOwHGgJsZiIgMTQ1ZjliOGM5NDlhZWFhY2M1NDY5ZGM5MmQzNDg5MmM; ssid_ucp_v1=1.0.0-KDRjNTE5NzczNTEzOTAxMWIyNDQwYzZiNTBlMjhkODQ4MGNlM2JiMGEKFwit0bDsjo2NBxDfsbuUBhiwFDgCQOwHGgJsZiIgMTQ1ZjliOGM5NDlhZWFhY2M1NDY5ZGM5MmQzNDg5MmM; MONITOR_WEB_ID=98a80613-b29c-4d7e-a1e4-67cdb19c3bbc; _tea_utm_cache_2608={"utm_source":"gold_browser_extension"}; msToken=DmAyOtgr5D7k7whg1wUoR3Vo2LY4g_kCMhnpM_rGHmA7-6pJJpZ0GKskwA_oVh72UwY_2qmRKcaj-G1FDSo-l92qNHzbN6m8S7dIEqd_QVY=; csrf_session_id=6bf1b547a56dec151327b709fb12f68a`,
  email: {
    user: "657676819@qq.com",
    from: "657676819@qq.com",
    to: "657676819@qq.com",
    pass: "unnzgawicerhbfej",
  },
};
// 请求签到接口
const checkIn = async () => {
  let { data } = await axios({
    url: config.baseUrl + config.apiurl.checkIn,
    method: "post",
    headers: {
      Cookie: config.cookie,
    },
  });
  return data;
};
// 请求抽奖接口
const draw = async () => {
  let { data } = await axios({
    url: config.baseUrl + config.apiurl.drawLottery,
    method: "post",
    headers: {
      Cookie: config.cookie,
    },
  });
  return data;
};
// 请求粘一沾接口
const dip = async () => {
  let { data } = await axios({
    url: config.baseUrl + config.apiurl.dip,
    method: "post",
    headers: {
      Cookie: config.cookie,
    },
  });
  return data;
};

// 请求粘一沾信息接口
const getLotteryConfig = async () => {
  let { data } = await axios({
    url: config.baseUrl + config.apiurl.getLotteryConfig,
    method: "get",
    headers: {
      Cookie: config.cookie,
    },
  });
  return data;
};

// 签到完成 发送邮件
const sendEmail = async (subject, html) => {
  let { user, from, to, pass } = config.email;
  const transporter = nodeMailer.createTransport({
    service: "qq",
    auth: { user, pass },
  });
  transporter.sendMail(
    {
      from,
      to,
      subject,
      html,
    },
    (err) => {
      if (err) return console.log(`发送邮件失败：${err}`);
      console.log("发送邮件成功");
    }
  );
};
// 触发签到和抽奖的方法
const signIn = async () => {
  const checkInData = await checkIn();
  const LotteryConfigData = await getLotteryConfig();
  const drawData = await draw();
  const dipData = await dip();
  const checkInResult = checkInData.data
    ? checkInData.data.incr_point
    : checkInData.err_msg;
  const LotteryConfig = LotteryConfigData.data
    ? LotteryConfigData.data.lottery[0]
    : LotteryConfigData.err_msg;
  const drawResult = drawData.data
    ? drawData.data.lottery_name
    : drawData.err_msg;
  const dipResult = dipData.data ? dipData.data.dip_value : dipData.err_msg;
  const totalLuckyValue = dipData.data
    ? dipData.data.total_value
    : dipData.err_msg;
  // console.log("🔥", checkInResult, LotteryConfig);
  const emailSubject = `掘金签到结果:${checkInResult}\n抽奖结果:${drawResult}\n沾一沾幸运值:${dipResult}\n当前总幸运值:${totalLuckyValue}/6000`;
  console.log("🔥", emailSubject);
  sendEmail(emailSubject);
};

module.exports = { signIn, sendEmail };
