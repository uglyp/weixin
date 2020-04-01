const app = getApp();
Component({
  properties: {
    parameter: {
      type: Object,
      value: {
        class: '0',
        search: '0'
      },
    },
    logoUrl: {
      type: String,
      value: '../../images/logo2.png',
    }
  },
  data: {
    navH: ""
  },
  ready: function () {
    this.setClass();
    var pages = getCurrentPages();
    if (pages.length <= 1) this.setData({ 'parameter.return': 0, 'parameter.returnUser': 0  });
  },
  attached: function () {
    this.setData({
      navH: app.globalData.navHeight
    });
  },
  methods: {
    return: function () {
      if (this.data.parameter.returnUser==1){
        wx.switchTab({
          url: '/pages/user/user',
        })

      }else{
        wx.navigateBack();

      }
      
    },
    setGoodsSearch: function () {
      wx.navigateTo({
        url: '/pages/search/search',
      })
    },
    toPushMsg:function(){
      wx.navigateTo({
        url: '../pushMessage/pushMessage',
      })
    },
    setClass: function () {
      var color = '';
      switch (this.data.parameter.class) {
        case "0": case 'on':
          color = 'on'
          break;
        case '1': case 'black':
          color = 'black'
          break;
        case '2': case 'gray':
          color = 'gray'
          break;
        default:
          break;
      }
      this.setData({
        'parameter.class': color
      })
    }
  }
})