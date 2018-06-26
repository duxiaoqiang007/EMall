const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:{},
    commentValue:'',
    commentImages:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let product_id = options.product_id
    this.getProductDetail(product_id)
  },
  uploadImage(cb){
    let commentImages = this.data.commentImages
    let images =[]
    if(commentImages.length){
      let length = commentImages.length
      for(let i =0 ;i<length;i++){
        wx.uploadFile({
          url: 'config.service.uploadUrl',
          filePath: 'commentImages[i]',
          name: 'file',
          success:res=>{
            let data = JSON.parse(res.data)
            length--
            if(!data.code){
              images.push(data.data.imgUrl)
            }
            if(length<=0){
              cb && cb(images)
            }
          },
          fail:()=>{
            length--
          }
        })
      }
    }else{
      cb && cb(images)
    }
  },
  chooseImage(cb){
    let currentImages = this.data.commentImages
    wx.chooseImage({
      count:3,
      sizeType:['compressed'],
      sourceType:['album','camera'],
      success: res=> {

        currentImages = currentImages.concat(res.tempFilePaths)

        let end = currentImages.length
        let begin = Math.max(end -3 ,0)
        currentImages = currentImages.slice(begin,end)
        this.setData({
          commentImages:currentImages
        })
      },
    })
  },
  previewImg(event){
   let target = event.currentTarget
   let src = target.dataset.src
   wx.previewImage({
     current:src,
     urls: this.data.commentImages,
   })
  },
  onInput(event){
    this.setData({
      commentValue:event.detail.value.trim()
    })
  },
  getProductDetail(ID) {
    wx.showLoading({
      title: '商品数据加载中...',
    })
    qcloud.request({
      url: config.service.productDetail + ID,
      success: res => {
        wx.hideLoading()
        let data = res.data
        if (!data.code) {
          this.setData({
            product: data.data
          })
        }
        else {
          setTimeout(() => {
            wx.navigateBack({
            }, 2000)
          })
        }
      },
      error: res => {
        wx.hideLoading()
        setTimeout(() => {
          wx.navigateBack({
          }, 2000)
        })
      }
    })
  },
  onTapAddComment(event){
    let content = this.data.commentValue
    if(!content) return
    wx.showLoading({
      title: '提交中，请稍后',
    })
    this.uploadImage(images=>{
      qcloud.request({
        url:config.service.addComment,
        login:true,
        method:'PUT',
        data:{
          images,
          content,
          product_id:this.data.product.id
        },
        success: res => {
          wx.hideLoading()
          let data = res.data
          if (!data.code) {
            wx.showToast({
              title: '评论完成',
            })
            setTimeout(() => {
              wx.navigateBack({}, 1500)
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '评论失败',
            })
          }
        },
        fail: res => {
          console.log(res)
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '评论失败',
          })
        }
      })
    })
  },
  // onTapAddComment(event){
  //   wx.showLoading({
  //     title: '提交中，请稍后',
  //   })
  //   qcloud.request({
  //     url:config.service.comment,
  //     login:true,
  //     method:'PUT',
  //     data:{
  //       product_id:this.data.product.id,
  //       content: this.data.commentValue,
  //     },
  //     success:res=>{
  //       wx.hideLoading()
  //       let data = res.data
  //       if (!data.code) {
  //         wx.showToast({
  //           title: '评论完成',
  //         })
  //         setTimeout(()=>{
  //           wx.navigateBack({},1500)
  //         })
  //       } else {
  //         wx.showToast({
  //           icon: 'none',
  //           title: '评论失败',
  //         })
  //       }       
  //     },
  //     fail:res=>{
  //       console.log(res)
  //       wx.hideLoading()
  //       wx.showToast({
  //         icon: 'none',
  //         title: '评论失败',
  //       })
  //     }
  //   })
  // }
})