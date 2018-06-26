const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:{},
    commentList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let product = {}
    product.id = options.id
    product.price = options.price
    product.name = options.name
    product.image = options.image
    this.setData({
      product
    })
    this.getCommentList(options.id)
  },
  getCommentList(id){
    wx.showLoading({
      title: '评论加载中...',
    })
    qcloud.request({
      url: config.service.commentList,
      data:{
        product_id:id
      },
      success: res => {
        wx.hideLoading()
        if (!res.data.code) {
          this.setData({
            commentList: res.data.data.map(item=>{
              let itemDate = new Date(item.create_time)
              item.createTime = util.formatTime(itemDate).substring(0,10)
              item.images = item.images?item.images.split(';;'):[]
              return item
            })
          })
          console.log(res.data.data)
        }
        else {
          wx.showToast({
            title: '评论加载失败',
          })
        }
      },
      error: res => {
        wx.hideLoading()
        wx.showToast({
          title: '评论加载失败',
        })
      }
    })
  }
})