/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1583243431180_1943';

  // add your middleware config here
  config.middleware = ['notfoundHandler'];
  // sequelize
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'CDMetro-default',
    define: {
      timestamps: true, // 添加create,update,delete时间戳
      freezeTableName: true, // 防止修改表名为复数
      underscored: false, // 字段驼峰式转为下划线
    },
    timezone: '+8:00', // 由于orm用的UTC时间，这里必须加上东八区，否则取出来的时间相差8小时
    dialectOptions: { // 让读取date类型数据时返回字符串而不是UTC时间
      dateStrings: true,
      typeCast(field, next) {
        if (field.type === 'DATETIME') {
          return field.string();
        }
        return next();
      },
    },
  };
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
