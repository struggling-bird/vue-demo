let util = {
  type (obj) {
    return Object.prototype.toString.call(obj)
  },
  isObject (obj) {
    return this.type(obj) === '[object Object]'
  },
  isArray (obj) {
    return this.type(obj) === '[object Array]'
  },
  isString (obj) {
    return this.type(obj) === '[object String]'
  },
  isNumber (obj) {
    return this.type(obj) === '[object Number]'
  },
  isDate (obj) {
    return this.type(obj) === '[object Date]'
  },
  isFunction (obj) {
    return this.type(obj) === '[object Function]'
  },
  isEqual (a = {}, b = {}) {
    return JSON.stringify(a) === JSON.stringify(b)
  },
  equal (a, b) {
    return JSON.stringify(a) === JSON.stringify(b)
  },
  /**
   * 获取指定范围的随机数
   * @param min
   * @param max
   * @returns {*}
   */
  random (min, max) {
    return Math.round(Math.random() * (max - min)) + min
  },
  guid () {
    function s4 () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
  },
  /**
   * 克隆对象
   * @param obj
   * @returns {*}
   */
  clone (obj) {
    if (this.isObject(obj)) {
      let result = {}
      for (let key in obj) {
        const prop = obj[key]
        result[key] = this.clone(prop)
      }
      return result
    } else if (this.isArray(obj)) {
      let result = []
      for (let i = 0; i < obj.length; i++) {
        const item = obj[i]
        result.push(this.clone(item))
      }
      return result
    } else {
      return obj
    }
  },
  mergeObject (defaults, option) {
    defaults = defaults || {}
    option = option || {}
    for (let prop in defaults) {
      if (this.isObject(defaults[prop])) {
        option[prop] = option[prop] ? option[prop] : {}
        this.mergeObject(defaults[prop], option[prop])
      } else if (this.isArray(defaults[prop])) {
        if (!option[prop] || option[prop] === []) {
          option[prop] = defaults[prop]
        } else {
          let i = 0
          let optLenght = option[prop].length
          let defaultLength = defaults[prop].length
          for (i; i < optLenght && i < defaultLength; i++) {
            option[prop][i] = this.mergeObject(defaults[prop][i], option[prop][i])
          }
        }
      } else {
        option[prop] = (option[prop] === null || option[prop] === undefined) ? defaults[prop] : option[prop]
      }
    }
    return option
  },
  /**
   * 将数字转为千分位分割格式
   * @param num
   * @returns {string}
   */
  toThousands (num) {
    let source = String(num).split('.') // 按小数点分成2部分
    source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), '$1,') // 只将整数部分进行都好分割
    return source.join('.') // 再将小数部分合并进来
  },
  /**
   * 为单数前补0
   * @param num
   * @returns {string}
   */
  toDoubleNumber (num) {
    num += ''
    return num > 9 ? num : ('0' + num)
  },
  /**
   * 日期格式化
   * @param date
   * @param formatter
   * @returns {string}
   */
  dateFormat (date = new Date(), formatter = 'yyyy-mm-dd') {
    return formatter.replace('yyyy', date.getFullYear())
      .replace('mm', this.toDoubleNumber(date.getMonth() + 1))
      .replace('dd', this.toDoubleNumber(date.getDate()))
  },
  /**
   * 日期格式化
   * @param date
   * @param formatter
   * @returns {string}
   */
  timeFormat (date = new Date(), formatter = 'hh:mm:ss') {
    if (this.isDate(date)) {
      return formatter.replace('hh', this.toDoubleNumber(date.getHours()))
        .replace('mm', this.toDoubleNumber(date.getMinutes()))
        .replace('ss', this.toDoubleNumber(date.getSeconds()))
    } else if (this.isNumber(date)) {
      // formatter 格式化规则 如:{s:'秒', h:'小时', m: '分钟'}
      let s = parseInt((parseFloat(date) / 1000).toFixed(0))
      let m = parseInt(s / 60)
      let h = parseInt(m / 60)
      s = s - m * 60
      m = m - h * 60
      return formatter.replace('hh', this.toDoubleNumber(h))
        .replace('mm', this.toDoubleNumber(m))
        .replace('ss', this.toDoubleNumber(s))
    }
  },
  /**
   * 格式化store中常量的值：actions、getters、mutations
   * @param constant
   * @param prefix
   */
  initializeConstants (constant, prefix) {
    for (let prop in constant) {
      let val = constant[prop]
      if (util.isObject(val)) {
        this.initializeConstants(val, `${prefix}-${prop}`)
      } else {
        constant[prop] = `${prefix}-${prop}`
      }
    }
  }
}

export default util
