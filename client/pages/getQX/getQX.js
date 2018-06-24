const app = getApp()
Page({

  data: {
    ifOpen:false
  },

  tapBack(){
    wx.navigateBack({})
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];  //上一个页面
    app.login({
      success: ({ userInfo }) => {
        prevPage.setData({
          userInfo: userInfo
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getSetting({
      success:res=>{
        if (res.authSetting['scope.userInfo']==true){
          this.setData({
            ifOpen:true
          })
        }
      }
    })
  }
})