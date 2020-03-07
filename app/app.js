'use strict';

module.exports = app => {

  app.validator.addRule('jsonString', (rule, value) => {
    try {
      JSON.parse(value);
    } catch (err) {
      return 'must be json string';
    }
  });
};
