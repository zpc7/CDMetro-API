'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
  async list() {
    const { ctx } = this;
    ctx.body = [{
      id: 111,
      count: 5,
      query: ctx.query.name,
    }];
  }
}

module.exports = HomeController;
