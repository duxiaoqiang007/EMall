const DB = require('../units/db.js')

module.exports ={
  list:async ctx =>{
    ctx.state.data = await DB.query("select * from product;")
  },
  detail:async ctx =>{
    productID = + ctx.params.id
    if(!isNaN(productID)){
      ctx.state.data = (await DB.query("select * from product where id = ?;", [productID]))[0]
    }else{
      ctx.state.data={}
    }
    
  }
}