var loadMoreView, page
//获取应用实例
const app = getApp()
const { getListSearch, getSearchHistory } = require("../../utils/api_request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serchKeyWord: "",
    currentIndex: 0,
    parameter: {
      'navbar': '0',
      'search': '0',
      'title': '海外货源',
      'return': '1',
      'isFixed': true
    },
    sendList: [],
    select: {
      keyword: '',
      page_size: 4,
      type: 2
    },
    searchStorage: [],
    showHistory: false,
    showList: false,
    showGoodsList: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('searchStorage'))
    // if (wx.getStorageSync('token')) {
    //   //从接口中获取搜索记录
    //   getSearchHistory().then(res => {
    //     console.log(res, '接口的历史记录')
    //   })
    // } else {
    //从缓存中获取搜索记录
    this.openHistorySearch()
    // }


    page = 1
    var that = this
    loadMoreView = that.selectComponent("#loadMoreView")
    // this.getListData()
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
      searchStorage: [],
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
    this.data.sendList = []


    console.log(this.data.serchKeyWord)
    if (!this.data.serchKeyWord) {
      wx.showToast({
        title: '请输入',
        duration: 1000,
        icon: "none"
      })
      return
    } else {
      this.setData({
        showList: true,
        showHistory: false
      })

      var searchStorage = this.keys(this.data.searchStorage)
      searchStorage.unshift({
        value: this.data.serchKeyWord,
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
  bindblur() {
    console.log('blur')

  },
  getListData() {
    if(page == 1){
      wx.showLoading({
        title: '加载中',
      })
    }
    var _this = this;
    var type = this.data.currentIndex == 0 ? 0 : 1;
    var params = Object.assign(this.data.select, { type, page, keyword: this.data.serchKeyWord })
    console.log(params)
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
        sendList: sendList,
        showGoodsList: true
      })
      loadMoreView.loadMoreComplete(res.data.data.result)
    })

  },
  loadMoreListener: function (e) {
    page += 1
    this.getListData()
  },
  clickLoadMore: function (e) {
    this.data.sendList = []

    this.getListData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  titleClick: function (e) {
    page = 1
    if (this.data.currentIndex === e.currentTarget.dataset.idx) {
      return
    }
    this.setData({
      //拿到当前索引并动态改变
      currentIndex: e.currentTarget.dataset.idx,
    })
    this.getListData()
  },
  clearKeyword() {
    app.requestName = ''
    this.setData({
      serchKeyWord: '',
      showList: true,
      showHistory: false
    })
    this.getListData()
  },
  toSearchList(e) {
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