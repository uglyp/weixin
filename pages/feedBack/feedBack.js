// pages/source/source.js
const app = getApp()
const { uploadImage, feedBack, productMap } = require("../../utils/api_request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //头部配置信息
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': "意见反馈",
      'isFixed': true
    },
    imgs: [],  //上传图片数组
    imgStr: '',//上传地址
    message: "",//文本域内容
    email_or_telephone: "",//邮箱或者手机号
    wechat_or_qq: "",//微信或者QQ
    currentWordNumber: 0,//当前输入字数
    min: 10,
    max: 300


  },
  otherData: {
    imgarr: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

  },

  bindMessage: function (e) {
    var value = e.detail.value
    var len = parseInt(value.length)
    console.log(len)
    this.setData({
      message: value,
      currentWordNumber: len
    })
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    if (len > this.data.max) {
      wx.showToast({
        title: "不能超过300字哦"
      })
      return
    }
  },
  bindPhone: function (e) {
    this.setData({
      email_or_telephone: e.detail.value
    })
  },
  bindQQ: function (e) {
    this.setData({
      wechat_or_qq: e.detail.value
    })
  },
  //图片选择
  uploadImages: function () {
    var count = 9 - this.data.imgs.length;
    var that = this;
    var maxSize = 2000000;
    wx.chooseImage({
      count: count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        for (let i = 0; i < res.tempFiles.length; i++) {
          if (res.tempFiles[i].size < maxSize) {
            if (that.otherData.imgarr.length < 9) {
              that.otherData.imgarr.push({ 'pic': res.tempFiles[i].path })
            }
            console.log(that.otherData.imgarr, 'that.otherData.imgarr')
            that.setData({
              imgs: that.otherData.imgarr
            })
          } else {
            wx.showToast({
              title: '上传的图片中不能有超过2M的图片',
              icon: 'none',
              duration: 2000
            })
          }
        }


      },
    })
  },
  //删除照片
  delImg: function (e) {
    let that = this;
    var thisindex = e.currentTarget.dataset.index;
    let { imgs } = this.data
    imgs = imgs.filter(function (item, index) {
      return index != thisindex;
    });
    this.setData({
      imgs
    })
  },
  //提交
  submit: function () {
    let that = this
    console.log(this.data.email_or_telephone, this.data.wechat_or_qq, '1111111')
    if (parseInt(that.data.message.length) < 10) {
      wx.showToast({
        title: '留言至少十个字哦！',
        duration: 2000,
        icon:'none'

      })
      return
    }
    if (that.data.email_or_telephone == '' && that.data.wechat_or_qq == '') {
      wx.showToast({
        title: '请至少填写一项联系方式！',
        duration: 2000,
        icon:'none'
      })
      return
    }
    if (that.data.message == '') {
      wx.showToast({
        title: '留言至少十个字哦！',
        duration: 2000,
        icon:'none'

      })
      return
    }

    var thisImgs = that.data.imgs
    wx.showLoading({
      title: '正在提交，请稍后',
    })
    if (thisImgs.length > 0) {
      //有图片上传先处理图片地址
      var promise = Promise.all(thisImgs.map((thisImg, index) => {
        return new Promise(function (resolve, reject) {
          wx.uploadFile({
            url: app.globalData.domain + '/v1/common/feedback-upload',
            filePath: thisImg.pic,
            name: 'picture',
            header: app.globalData.headers,
            success: function (res) {
              console.log(res.data, '..................................')
              that.data.imgStr = that.data.imgStr + JSON.parse(res.data).data + ','
              console.log(that.data.imgStr, 'that.data.imgStr')
              resolve(res.data);
            },
            fail: function (err) {
              reject(new Error('failed to upload file'));
            }
          });
        });
      }));
      promise.then(function (res) {
        console.log(that.data.imgStr, 'that.data.imgStr')
        console.log(res, 'resssssssssssss')
        that.tobeOrder()
      }).catch(function (err) {
        console.log(err);
      });
    } else {
      //无图片上传
      that.tobeOrder()
    }
  },
  //保存
  tobeOrder: function () {
    let that = this;
    console.log(that.data.imgStr, '保存里有图片吗')
    var s = that.data.imgStr
    var dataInfo = {
      message: that.data.message,
      email_or_telephone: that.data.email_or_telephone,
      wechat_or_qq: that.data.wechat_or_qq,
      pictures: s.substring(0, s.length - 1),
    }
    feedBack(dataInfo).then(res => {
      if (res.data.code == 0) {
        wx.hideLoading();
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000,
        })
        setTimeout(function () {

        }, 2000)
      }
    })

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})