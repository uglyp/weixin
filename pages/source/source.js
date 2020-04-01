
var loadMoreView, page
//获取应用实例
const app = getApp()
const { getListSearch } = require("../../utils/api_request.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'search': '1',
      'title': '海外货源',
      'isFixed': true
    },
    domain: app.globalData.domain,


    navH: app.globalData.navHeight,//头部高度
    select: {
      keyword: '',
      page_size: 4,
      type: 0
    },
    sendList: [],
    searchStorage: [],
    showHistory: false,
    showList: true,
    serchKeyWord: "",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.openHistorySearch()
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
    page = 1
    this.getListData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    loadMoreView.loadMore()
  },
  // 清除缓存
  historyDel: function () {
    wx.clearStorageSync('searchStorage')
    this.setData({
      searchStorage: []
    })
  },
  //获取缓存
  openHistorySearch: function () {
    this.setData({
      searchStorage: this.keys(wx.getStorageSync('searchStorage')) || [], //若无储存则为空
    })
  },

  //获取input输入的值
  getInputValue(e) {
    console.log(e)
    var val = e.detail.value
    console.log(val, 'val')
    this.setData({
      serchKeyWord: val
    })
  },

  //搜索
  toSearch(e) {
    page = 1
    this.data.sendList = []


    console.log(this.data.serchKeyWord)
    if (!this.data.serchKeyWord) {
      wx.showToast({
        title: '请输入',
        duration: 1000,
        icon: "none"
      })
    } else {
      this.setData({
        showList: true,
        showHistory: false
      })
      
      var searchStorage = this.keys(this.data.searchStorage)
      searchStorage.unshift({
        value: this.data.serchKeyWord
      })
      console.log(searchStorage, 'searchStorage')
      this.setData({
        searchStorage:this.keys(searchStorage)
      })
    }
    wx.setStorageSync('searchStorage', searchStorage)
    this.getListData()
  },
  keys(arr) {
    let newArr = []
    arr.length > 0 && arr.forEach(el => {
      const result = newArr.findIndex(ol => { return el.value === ol.value })
      if (result !== -1) {
        console.log(newArr,'newArr')
      } else {
        newArr.push(el)
      }
    })
    return newArr;
  },
  bindfocus() {
    console.log('focus')
    this.setData({
      showList: false,
      showHistory: true
    })
  },
  allClick() {
    this.setData({
      showList: true,
      showHistory: false
    })
  },
  bindblur() {
    console.log('blur')
    // this.setData({
    //   showList: true,
    //   showHistory: false
    // })

  },

  getListData() {
    if(page == 1){
      wx.showLoading({
        title: '加载中',
      })
    }
    var _this = this;
    var params = Object.assign(this.data.select, { page, keyword: this.data.serchKeyWord })

    getListSearch(params).then(res => {
      wx.hideLoading();
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

  },
  clearKeyword() {
    this.data.sendList = []

    app.requestName = ''
    this.setData({
      serchKeyWord: '',
      showList: true,
      showHistory: false
    })
    this.getListData()
  },
  toSearchList(e) {
    page = 1
    this.data.sendList = []

    console.log(e.detail, 'eeeeeeee')
    this.setData({
      showList: true,
      showHistory: false,
      serchKeyWord: e.detail
    })
    this.data.serchKeyWord = e.detail
    this.getListData()
  }
})