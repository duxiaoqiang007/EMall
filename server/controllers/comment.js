const DB = require('../units/db.js')
module.exports = {
  //添加评论
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let username = ctx.state.$wxInfo.userinfo.nickName
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl
    let productId = +ctx.request.body.product_id
    let content = ctx.request.body.content || null
    let images = ctx.requrst.body.images || []
    images = images.join(';;')
    if (!isNaN(productId)){
      await DB.query('insert into comment(user,username,avatar,content,product_id) values (?,?,?,?,?)',[user,username,avatar,content,productId])
    }
    ctx.state.data = {}
  },
  //获取评论列表
  list: async ctx => {
    let productId = + ctx.request.query.product_id
    let product 
    if (!isNaN(productId)){
      product = await DB.query('select * from comment where comment.product_id = ?', [productId])
    }else{
      product = {}
    }
    product.commentCount=(await DB.query('select count(*) as comment_count from comment where comment.product_id=?',[productId]))[0].comment_count || 0
    product.firstComment = (await DB.query('select * from comment where comment.product_id= ? limit 1 offset 0',[productId]))[0] || null

    ctx.state.data = product
  }
}


