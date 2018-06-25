const DB = require('../units/db.js')
module.exports = {
  //添加到购物车
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let username = ctx.state.$wxInfo.userinfo.nickName
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl
    let productId = +ctx.request.body.product_id
    let content = ctx.request.body.content || null
    if (!isNaN(productId)){
      await DB.query('insert into comment(user,username,avatar,content,product_id) values (?,?,?,?,?)',[user,username,avatar,content,productId])
    }
    ctx.state.data = {}
  },
  // list: async ctx => {
  //   let user = ctx.state.$wxInfo.userinfo.openId
  //   let list = await DB.query('select * from trolley_user left join product on trolley_user.id = product.id where trolley_user.user=?', [user])
  //   ctx.state.data = list
  // },
  // update: async ctx => {
  //   let user = ctx.state.$wxInfo.userinfo.openId
  //   let productList = ctx.request.body.list || []
  //   await DB.query('delete from trolley_user where trolley_user.user=?', [user])
  //   let sql = 'insert into trolley_user(id,count,user) values'
  //   let query = []
  //   let params = []
  //   productList.forEach(product => {
  //     query.push('(?,?,?)')
  //     params.push(product.id)
  //     params.push(product.count || 1)
  //     params.push(user)
  //   })
  //   await DB.query(sql + query.join(','), params)
  // }
}


