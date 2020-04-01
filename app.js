//app.js
App({
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

   
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        that.globalData.loginType = true;
        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  that.globalData.userInfo = res.userInfo

                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (that.userInfoReadyCallback) {
                    that.userInfoReadyCallback(res)
                  }
                }
              })
            }
          }
        })
      },
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
        that.globalData.loginType = false;
        that.globalData.userInfo = "";
        wx.setStorageSync('token', "")
        wx.setStorageSync('phoneNumber', "");
        wx.setStorageSync('countryCode', "");
      }
    })
    // 获取导航高度；
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight * (750 / res.windowWidth) + 97;
        if (res.model.search('iPhone X') != -1) {
          this.globalData.isIphoneX = true;
        }
      }, fail(err) {
        console.log(err);
      }
    })
  },
  requestName:"",
  globalData: {
    userInfo: null,
    loginType: false,
    isConnectting: true,//监听网络状态
    member_id:null,//推广者id
    domain: "https://api.mall.gulltour.com",//正式服务器地址
    //domain: "http://api.sandbox.mall.gulltour.com",//测试服务器地址
    updatePath: 'https://api.mall.gulltour.com/wx_images/',//正式图片地址
    //updatePath:'http://api.sandbox.mall.gulltour.com/wx_images/',//测试图片地址
    token: wx.getStorageSync("token"),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',// 默认值
      "device": 1,
      "sign": "",
      "token": wx.getStorageSync("token"),
      "version": '1.0.0'
    },
    loginHeaders: {
      'Content-Type': 'application/x-www-form-urlencoded',// 默认值
      "device": 1,
      "sign": "",
      "version": '1.0.0'
    },
  },
  //加密方式
  md5(data) {
    var md5 = require('utils/cryptojs-master/cryptojs.js').Crypto;
    var arr = Object.keys(data).sort();
    var valArr = [];
    for (var i = 0; i < arr.length; i++) {
      valArr.push(data[arr[i]])
    }
    valArr = md5.MD5("123456789mall-gulltour" + valArr.join(","))
    this.globalData.headers.sign = valArr;
    this.globalData.loginHeaders.sign = valArr
  },
  // 格式化时间
  formatDate(theDate) {
    var _year = theDate.getFullYear()
    var _month = (theDate.getMonth() + 1) < 10 ? '0' + (theDate.getMonth() + 1) : (theDate.getMonth() + 1);
    var _date = theDate.getDate() < 10 ? '0' + theDate.getDate() : theDate.getDate();
    return _year + "-" + _month + "-" + _date
  },
  // 日期转时间戳
  datetime_to_unix(date,time) {
    var tmp_datetime = date.replace(/:/g, '-');
    tmp_datetime = tmp_datetime.replace(/ /g, '-');
    var arr = tmp_datetime.split("-");
    var timearr = time.split(":")
    var now = Date.UTC(arr[0], arr[1] - 1, arr[2], timearr[0]-8, timearr[1]);
    return parseInt(now);
  },
})