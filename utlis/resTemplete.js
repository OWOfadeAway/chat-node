const { log } = require("debug/src/node");

class sendRes {
  /**
   * Represents a book.
   * @param {object} parameter
   * @param {string} parameter.type
   * @param {object} parameter.data
   * @param {number} parameter.code
   * @param {string} parameter.to
   * @param {string} parameter.from
   * @param {string} parameter.msg
   * @constructor
   */
  constructor(parameter) {
    if (parameter.type ? false : true) {
      throw new Error("错误：type不能为空");
    }
    const paramsKeys = Object.keys(parameter);
    for (let key in paramsKeys) {
      this[paramsKeys[key]] = parameter[paramsKeys[key]];
    }
    //this.type = parameter.type
    //this.msg = parameter?.msg
    //this.code = parameter?.code
    //this.to = parameter?.to
    //this.from = parameter?.from
    //this.data = parameter?.data || {}
  }
  toString() {
    //修改
    return JSON.stringify(this);
  }
}

module.exports = { sendRes };
