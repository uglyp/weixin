const app = getApp()
const { getSearchHistory } = require("../../utils/api_request.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        parameter: {
            'navbar': '0',
            'search': '0',
            'title': '海外货源',
            'isFixed': true,
            'return': '1'
        },
        searchKeyworld:"",
        searchStorage:[],
        showHistory:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //从接口中获取搜索记录
        getSearchHistory().then(res=>{
            console.log(res,'接口的历史记录')
        })
        //从缓存中获取搜索记录
        this.openHistorySearch()
        if(this.data.searchStorage.length > 0){
            this.setData({
                showHistory:true
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    toSearchList(e){
        console.log(e)
        app.requestName = e.target.dataset.value
        wx.navigateTo({
                url:"/pages/searchList/searchList"
            })
    },
    // 清除缓存
    historyDel: function () {
        wx.clearStorageSync('searchStorage')
        this.setData({
            searchStorage: [],
            showHistory:false
        })
    },
    //获取缓存
    openHistorySearch: function () {
        this.setData({
            searchStorage: wx.getStorageSync('searchStorage') || [], //若无储存则为空
        })
    },

    //获取input输入的值
    getInputValue(e){
        console.log(e)
        var val = e.detail.value
        console.log(val,'val')
        this.setData({
            searchKeyworld:val
        })
        app.requestName = val
        console.log(app.requestName,'app.requestName')
    },
    //搜索
    toSearch(e){
        console.log(this.data.searchKeyworld)
        if(!this.data.searchKeyworld){
            wx.showToast({
                title:'请输入',
                duration:1000,
                icon:"none"
            })
        }else{
            wx.navigateTo({
                url:"/pages/searchList/searchList"
            })
            var searchStorage = this.data.searchStorage
            searchStorage.unshift({
                value:app.requestName,
                id:searchStorage.length
            })
        }
        wx.setStorageSync('searchStorage', searchStorage)
    }
})