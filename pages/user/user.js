const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //头部配置信息
    parameter: {
      'navbar': '0',
      'search': '0',
      'title': '会员中心',
      'isFixed': true,
      'return': "0"
    },
    loginType: null,
    logoSrc: null,
    userName: "",
    imgHeader:app.globalData.updatePath

  },

  // onTabItemTap(item) {
  //   console.log(item)

  //   wx.showToast({
  //     title:'tab点击',
  //   })

  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync("token")) {
      this.setData({
        loginType: true
      })
    }
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          if (app.globalData.userInfo) {
            that.setData({
              logoSrc: app.globalData.userInfo.avatarUrl ? app.globalData.userInfo.avatarUrl : `../../images/logo-default.png`,
              userName: app.globalData.userInfo.nickName,
            })
            app.globalData.loginType = true;

          } else {
            // 给app.js 定义一个方法。
            app.userInfoReadyCallback = res => {
              app.globalData.userInfo = res;
              that.setData({
                logoSrc: app.globalData.userInfo.avatarUrl ? app.globalData.userInfo.avatarUrl : `../../images/logo-default.png`,
                userName: app.globalData.userInfo.nickName,
              })
              app.globalData.loginType = true;
            }
          };

        } else {
          that.setData({
            logoSrc: `../../images/logo-default.png`,
          })
        };
      },
      fail: function (res) {
        that.setData({
          logoSrc: `../../images/logo-default.png`,
        })

      }
    })

  },
  onshow() {
    if (wx.getStorageSync("token")) {
      this.setData({
        loginType: true
      })
    }
  },
  //接收登录页面传来的用户信息
  setPagesData(obj) {
    this.setData({
      logoSrc: obj.avatarUrl,
      userName: obj.nickName,
      loginType: true
    })
    app.globalData.loginType = true;
  },

  toSkip(e) {
    var type = e.currentTarget.dataset.type
    switch (type) {
      case "supplyofgoods":
        console.log(1)
        if (wx.getStorageSync("token")) {
          wx.navigateTo({ url: '/pages/mysource/mysource' });
        } else {
          wx.showModal({
            showCancel: false,
            content: "请登录后再操作",
            success: function () {
              wx.navigateTo({
                url: "/pages/log/log"
              })
            }
          })
        }
        break;
      case "myorder":
        console.log(2)
        if (wx.getStorageSync("token")) {
          wx.navigateTo({ url: '/pages/myorder/myorder' });
        } else {
          wx.showModal({
            showCancel: false,
            content: "请登录后再操作",
            success: function () {
              wx.navigateTo({
                url: "/pages/log/log"
              })
            }
          })
        }
        break;
      case "asktobuy":
        if (wx.getStorageSync("token")) {
          wx.navigateTo({ url: '/pages/myAskToBuy/myAskToBuy' });
        } else {
          wx.showModal({
            showCancel: false,
            content: "请登录后再操作",
            success: function () {
              wx.navigateTo({
                url: "/pages/log/log"
              })
            }
          })
        }
        break;
      case "authentication":

        break;
      case "mycollect":
        console.log(5)
        if (wx.getStorageSync("token")) {
          wx.navigateTo({ url: '/pages/mycollect/mycollect' });
        } else {
          wx.showModal({
            showCancel: false,
            content: "请登录后再操作",
            success: function () {
              wx.navigateTo({
                url: "/pages/log/log"
              })
            }
          })
        }
        break;
      case "online":

        break;
      case "helpcenter":

        break;
      case "feedback":
        if (wx.getStorageSync("token")) {
          wx.navigateTo({ url: '/pages/feedBack/feedBack' });
        } else {
          wx.showModal({
            showCancel: false,
            content: "请登录后再操作",
            success: function () {
              wx.navigateTo({
                url: "/pages/log/log"
              })
            }
          })
        }
        break;

      default:
        break;
    }
  },








  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})