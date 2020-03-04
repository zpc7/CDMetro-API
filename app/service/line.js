'use strict';
const Service = require('egg').Service;

// 注意这里的model.line L 大写
class LineService extends Service {
  async findAll() {
    const total = await this.ctx.model.Line.count();
    const list = await this.ctx.model.Line.findAll();
    return { total, list };
  }
  async findById(id) {
    return await this.ctx.model.Line.findByPk(id);
  }
  async create(requestBody) {
    const { lineColor, lineNo, openDate } = requestBody;

    return await this.ctx.model.Line.create({ lineColor, lineNo, openDate });
  }
}

module.exports = LineService;
