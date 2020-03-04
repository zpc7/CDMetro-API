'use strict';
const Service = require('egg').Service;

// 日期类型简写-全称对照表
const enumCompareBoard = {
  NWD: 'normal working days',
  TDBH: 'the day before holiday',
  SH: 'statutory holidays',
};

class UserService extends Service {
  async findAll(query) {
    const total = await this.ctx.model.User.count();
    const list = await this.ctx.model.User.findAll(query);
    return { total, list };
  }
  async findById(id) {
    return await this.ctx.model.User.findByPk(id);
  }
  async create(requestBody) {
    const {
      date, dateType, remark = '',
      lineAmountNo1 = 0, lineAmountNo2 = 0, lineAmountNo3 = 0,
    } = requestBody;

    return await this.ctx.model.User.create({
      date,
      remark,
      dateType: enumCompareBoard[dateType],
      lineAmountNo1, lineAmountNo2, lineAmountNo3,
    });
  }
}

module.exports = UserService;
