//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
let userInfo
App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    },
    login({ success, error }) {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo'] === false) {
            //拒绝授权
            wx.showModal({
              title: '提示',
              content: '微信小程序需要您授权获取用户信息',
              showCancel: true,
              success: () => {
                // wx.openSetting({
                //   success: res => {
                //     if (res.authSetting['scope.userInfo'] === true) {
                //       this.doQcloudLogin({ success, error })
                //     }
                //   }
                // })
                wx.navigateTo({
                  url: '../getQX/getQX'
                })
              }
            })
          }
          else {
            this.doQcloudLogin({ success, error })
          }
        }
      })
    },
    checkSession({ success, error }) {
      if (userInfo) {
        return success && success({
          userInfo
        })
      }
      wx.checkSession({
        success: () => {
          this.getUserInfo({ success, error })
        },
        fail: () => {
          error && error()
        }
      })
    },

    doQcloudLogin({ success, error }) {
      // 设置登录地址
      qcloud.setLoginUrl(config.service.loginUrl)
      qcloud.login({
        success: res => {
          if (res) {
            let userInfo = res
            success && success({
              userInfo
            })
          } else {
            //不是首次登陆，需要手动获得用户信息
            this.getUserInfo({ success, error })
          }
        },
        fail: () => {
          error && error()
        }
      })
    },
    getUserInfo({ success, error }) {
      if (userInfo) {
        return success && success({
          userInfo
        })
      }
      qcloud.request({
        url: config.service.requestUrl,
        login: true,
        success: res => {
          let data = res.data
          if (!data.code) {
            let userInfo = data.data
            success && success({
              userInfo
            })
          }
          else {
            error && error()
          }
        },
        fail: () => {
          error && error()
        }
      })
    }
})