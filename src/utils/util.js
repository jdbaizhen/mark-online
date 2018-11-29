import axios from 'axios'
/** 
 *  Axios 数据格式化
*/
export const dataFormat = (obj) => {
  let result = ''
  for(let item in obj ){
    result += encodeURIComponent(item) + '=' + encodeURIComponent(obj[item]) + '&'
  }
  return result
}
// 二次封装带有token的请求
export const axiosFormat = (url, method, data = null) => {
  let token = getSession('token')
  if (method == 'post') {
    return axios({
      url,
      method,
      headers: {
        'token': token
      },
      data
    })
  } else {
    return axios({
      url,
      method,
      headers: {
        'token': token
      }
    })
  }
}
/**
 *  Number
 */
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/***
 *  Time
 */
export const timeFormat = (date) => {
  let year = date.getFullYear()
  let month = date.getMonth()+1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export const dateFormat = (date) => {
  let year = date.getFullYear()
  let month = date.getMonth()+1
  let day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}
/**
 * Session
 */
export const setSession = (key, value) => {
  if (typeof value === 'object') {
    sessionStorage.setItem(key, JSON.stringify(value))
  }
  sessionStorage.setItem(key, value)
}

export const getSession = (key) => {
  let value = sessionStorage.getItem(key)
  if (/^(\{|\[)/.test(value)) {
    value = JSON.parse(value)
  }
  return value
}

export const removeSession = (key) => {
  sessionStorage.removeItem(key)
}

/**
 *  Cookie
 */

export const setCookie = (cname, cvalue, exdays) => {
  let d = new Date()
  d.setTime(d.getTime()+(exdays*24*60*60*1000))
  let expires = "expires="+d.toGMTString();
	document.cookie = cname+"="+cvalue+"; "+expires;
}

export const getCookie = (cname) => {
  let name = cname + "=";
	let ca = document.cookie.split(';');
	for(let i=0; i<ca.length; i++) {
		let c = ca[i].trim();
		if (c.indexOf(name)==0) { 
      return c.substring(name.length,c.length); 
    }
	}
	return "";
}

export const clearCookie = (cname) => {  
  setCookie(cname, "", -1) 
}