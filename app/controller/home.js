'use strict';

const path = require('path');
const fs = require('fs');

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('new/list.tpl')
  }

  async download() {
    const filePath = path.resolve(this.app.config.static.dir, '1.doc');
    this.ctx.attachment('1.doc');
    this.ctx.set('Content-Type', 'application/octet-stream;charset=UTF-8');
    this.ctx.body = fs.createReadStream(filePath);
  }
}

module.exports = HomeController;
