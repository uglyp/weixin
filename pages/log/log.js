const app = getApp();
const { mpLogin } = require("../../utils/api_request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prevPages: null, //上一页信息,
    centerPage: null,
    pagesType: null,
    relationPhone: app.globalData.relationPhone,
    domainUrl: app.globalData.domain,
    parameter: {
      'navbar': '1',
      'search': '1',
      'title': '登录',
      'isFixed': true
    },
    updatePath: app.globalData.updatePath
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //url参数
    var pageType = options;
    this.setData({ pagesType: pageType.type });
    var pages = getCurrentPages();
    //上一页信息
    this.setData({ prevPages: pages[pages.length - 2] });
    // this.setData({ centerPage: pages[pages.length - 3] });

  },

  userInfoHandler(e) {
    wx.showLoading({
      title: "加载中",
    })
    let that = this;

    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          var code = res.code
          wx.getUserInfo({
            success: res => {
              var data = {
                code: code,
                iv: res.iv,
                encrypted_data: res.encryptedData,
                spread_uid: app.globalData.member_id ? app.globalData.member_id:''
              };
              mpLogin(data).then(res => {
                wx.hideLoading();
                // 判断关联手机号状态
                if (res.data.code == 0) {
                  app.globalData.userInfo = e.detail.userInfo;
                  app.globalData.token = res.data.data.token;
                  app.globalData.headers.token = res.data.data.token;
                  wx.setStorageSync('token', res.data.data.token);
                  wx.setStorageSync('phoneNumber', res.data.data.mobile);
                  wx.setStorageSync('countryCode', res.data.data.nation_flag);
                  that.data.prevPages.setPagesData(app.globalData.userInfo);
                  app.globalData.loginType = true;
                  if (that.data.pagesType == "page") {
                    wx.navigateBack({
                      delta: 1
                    })
                  } else {
                    wx.navigateBack();
                  }
                } 

              })
            }
          })
        }
      })
    } else {
      wx.hideLoading();
      wx.showToast({
        title: '需要授权才能继续使用服务哦',
        icon: 'none',
        duration: 2000
      })
    }
  },
  refuse: function (e) {
    var that = this;
    if (that.data.pagesType == "page") {
      wx.navigateBack({
        detail: 1
      })
    } else {
      wx.navigateBack();
    }
  }
})