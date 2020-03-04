'use strict';
const Service = require('egg').Service;

const enumCompareBoard = {
  NWD: 'normal working days',
  TDBH: 'the day before holiday',
  SH: 'statutory holidays',
};

class UserService extends Service {
  async find(uid) {
    const user = await this.ctx.db.query('select * from user where uid = ?', uid);
    return user;
  }
  async create(body) {
    const {
      date, dateType, remark = '',
      lineAmountNo1 = 0, lineAmountNo2 = 0, lineAmountNo3 = 0,
    } = body;

    return await this.ctx.model.User.create({
      date,
      remark,
      dateType: enumCompareBoard[dateType],
      lineAmountNo1, lineAmountNo2, lineAmountNo3,
    });
  }
}

module.exports = UserService;
