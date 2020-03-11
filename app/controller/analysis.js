'use strict';

const Controller = require('egg').Controller;

class AnalysisController extends Controller {
  async find() {
    const ctx = this.ctx;
    const body = ctx.request.body;
    //
    console.log('---------');
    console.log(body);
    ctx.body = '222222';
  }
}

module.exports = AnalysisController;

// TODO:
// 1, 某一时间段内 每天 每条线路的单线数据+总运量
// 2. 某月 按照3种日期类型的数据对比 单线+总量
// 3. 某月 当月+上月+上年同月的 总运量+单 条线路对比
