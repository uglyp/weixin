// pages/release/release.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    updatePath:"../../images/",
    updatePath2: app.globalData.updatePath

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //wx.hideTabBar();//隐藏 tabBar
  },

  /**
   * 页面跳转
   */
  chooseImg: function(e) {
    var that = this;
    if (e.currentTarget.dataset.choosetype == 'true') {
      wx.navigateTo({
        url: "../../pages/releaseDetail/releaseDetail?type=0" 
      })
    } else {
      wx.navigateTo({
        url: "../../pages/releaseDetail/releaseDetail?type=1"
      })
    }
  },
  /**
   * 页面返回
   */
  close:function(){
    wx.switchTab({
      url: "../../pages/index/index"
    })

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})