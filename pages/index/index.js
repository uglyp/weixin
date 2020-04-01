//index.js
var loadMoreView, page
//获取应用实例
const app = getApp()
const { getBanner, getListSearch } = require("../../utils/api_request.js");


Page({
    data: {
        //头部配置信息
        parameter: {
            'navbar': '0',
            'search': '0',
            'isFixed': true
        },
        domain: app.globalData.domain,
        navH: app.globalData.navHeight,//头部高度
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        background: [],
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 2000,
        duration: 500,
        select: {
            keyword: '',
            page_size: 4,
            type: 2
        },
        tabTittle: ['推荐', '货源', '求购'],
        currentIndex: 0,
        sendList: [],
    },

    toSearch: function () {
        wx.navigateTo({ url: "/pages/searchList/searchList" })
    },

    //用户点击tab时调用
    titleClick: function (e) {
        console.log(e)
        page = 1
        if (this.data.currentIndex === e.currentTarget.dataset.idx) {
            return
        }
        this.setData({
            //拿到当前索引并动态改变
            currentIndex: e.currentTarget.dataset.idx,
            // sendList: []
        })
        this.getListData()
    },

    /**
   * 页面上拉触底事件的处理函数
   */
    onReachBottom: function () {
        loadMoreView.loadMore()
    },

    getListData() {
        var _this = this;
        var type = this.data.currentIndex == 0 ? 2 : this.data.currentIndex == 1 ? 0 : 1;

        let params = Object.assign(this.data.select, { type, page })
        getListSearch(params).then(res => {
            var sendList = _this.data.sendList
            if (page == 1) {
                sendList = res.data.data.result.data
                wx.stopPullDownRefresh()
            } else {
                sendList = sendList.concat(res.data.data.result.data)
            }
            _this.setData({
                sendList: sendList,
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
    loadBanner() {
        getBanner().then(res => {
            if (res.data.code === 0) {
                this.setData({
                    background: res.data.data
                })
            }
        })
    },

    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {
        page = 1
        var that = this
        loadMoreView = that.selectComponent("#loadMoreView")
        this.getListData()
        this.loadBanner()

        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    toDetail(e) {
        var url = e.currentTarget.dataset.url
        wx.navigateTo({ url})
    }

})