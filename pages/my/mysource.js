
var loadMoreView, page
//获取应用实例
const app = getApp()
const { getListSearch } = require("../../utils/api_request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    updatePath: app.globalData.updatePath,
    parameter: {
      'navbar': '1',
      'search': '1',
      'title': '我的货源',
      'isFixed': true
    },
    domain: app.globalData.domain,


    navH: app.globalData.navHeight,//头部高度
    select: {
      keyword: '',
      page_size: 4,
      type: 0
    },
    sendList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1
    var that = this
    loadMoreView = that.selectComponent("#loadMoreView")
    this.getListData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    loadMoreView.loadMore()
  },

  getListData() {
    var _this = this;
    let params = Object.assign(this.data.select, { page })
    getListSearch(params).then(res => {
      var sendList = _this.data.sendList
      if (page == 1) {
        sendList = res.data.data.result.data
        wx.stopPullDownRefresh()
      } else {
        sendList = sendList.concat(res.data.data.result.data)
      }
      _this.setData({
        sendList: sendList
      })
      loadMoreView.loadMoreComplete(res.data.data.result)
    })

  },
  loadMoreListener: function (e) {
    page += 1
    this.getListData()
  },
  clickLoadMore: function (e) {
    this.getListData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})