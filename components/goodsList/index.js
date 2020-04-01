var app = getApp();
Component({
  properties: {
    sendList: {
      type: Object,
      value: []
    }
  },
  data:{
    updatePath: app.globalData.updatePath,
  },
  attached: function () {

  },
  ready() {

  },

  methods: {
    toDetail(e) {
      var id
      if (e.currentTarget.dataset.id) {
        id = e.currentTarget.dataset.id
      } else if (e.currentTarget.dataset.scouceid) {
        id = e.currentTarget.dataset.scouceid
      }
      wx.navigateTo({
        url: `/pages/product/product?id=${id}`
      })
    }
  }
})