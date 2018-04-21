/**
 * Created by yqdong on 2018/2/22.
 * qq: 1013501639
 * @author yqdong
 *
 */
import axios from 'axios'
import util from './util'
const resCode = {
  SUCCESS: 200,
  Error: 500,
  NO_PERMISSION: -10001,
  NOT_LOGIN: -10002,
  PARAM_NULL: -20001,
  OUT_LIMIT: -10025
}
let CancelToken = axios.CancelToken
let preQueryOption
let cancel
function resCodeFilter (res) {
  let flag = true
  let status = res.data.code
  if (status) {
    status = parseInt(status)
  }
  switch (status) {
    case resCode.NO_PERMISSION:
      flag = false
      // location.href = '/app/noPermission'
      break
    case resCode.NOT_LOGIN:
      flag = false
      // location.href = `/app/login?destination=${location.href}`
      break
    case resCode.Error:
      flag = false
      break
    case resCode.OUT_LIMIT:
      flag = false
      break
    case resCode.PARAM_NULL:
      flag = false
      break
    case resCode.SUCCESS:
      break
    default:
      console.warn('非标准状态码', res.data)
  }
  return flag
}
function checkRequestCode (code) {
  return /^2\d+/.test(code)
}
export default function (option) {
  option = util.mergeObject({
    method: 'post',
    url: '',
    data: null,
    baseURL: '/',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  }, option)
  if (!option.cancelToken) {
    if (preQueryOption) delete preQueryOption['cancelToken']
    if (util.isEqual(option, preQueryOption)) {
      cancel()
    }
    option.cancelToken = new CancelToken(function (c) {
      cancel = c
    })
    preQueryOption = option
  }
  return new Promise((resolve, reject) => {
    axios(option).then((res) => {
      if (checkRequestCode(res.status) && resCodeFilter(res)) {
        resolve(res.data)
      } else {
        throw new Error(JSON.stringify({
          message: '请求状态或接口状态码错误',
          request: res.request.responseURL,
          response: res.data
        }))
      }
    }).catch((error) => {
      if (axios.isCancel(error)) return
      reject(error)
      console.error(error)
    })
  })
}
