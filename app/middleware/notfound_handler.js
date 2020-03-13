'use strict'
module.exports = () => {
  return async function notFoundHandler(ctx, next) {
    await next()
    // if (ctx.status === 404 && !ctx.body) {
    //   if (ctx.acceptJSON) {
    //     ctx.body = { error: '404 Not Found, PC' };
    //   } else {
    //     ctx.body = '<h1>404 Page Not Found, PC</h1>';
    //   }
    // }
    // 设置了 ctx.response.body 会导致status 404 --> 200
    // ctx.body = 'set body';
  }
}
