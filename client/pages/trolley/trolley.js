const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  onShow: function () {
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo: userInfo
        })
      }
    })
  },
  onTapLogin: function (event) {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo: userInfo
        })
      }
    })
  }
})