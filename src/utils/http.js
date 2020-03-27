import axios from 'axios'
import {message} from 'ant-design-vue'
import qs from 'qs'

// 创建新的axios实例
// const service = axios.create({
//     baseURL: 'http://192.168.16.202:8088',
//     timeout: 3000,
// })

axios.defaults.baseURL= 'http://192.168.16.202:8088';
axios.defaults.timeout= 3000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 请求拦截器  配置loading
axios.interceptors.request.use(config => {
    // config.data = JSON.stringify(config.data);
    config.headers = {
        'Content-Type':'application/x-www-form-urlencoded'
    }
    return config
}, error => {
    Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use(response => {
// Do something before response is sent
    if (response.status === 200) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(response);
    }
}, error => {
// Do something with response error
    if (error && error.response) {
        switch (error.response.status) {
            case 400:
                error.message = '错误请求'
                break;
            case 401:
                error.message = '未授权，请重新登录'
                break;
            case 403:
                error.message = '拒绝访问'
                break;
            case 404:
                error.message = '请求错误,未找到该资源'
                break;
            case 405:
                error.message = '请求方法未允许'
                break;
            case 408:
                error.message = '请求超时'
                break;
            case 500:
                error.message = '服务器端出错'
                break;
            case 501:
                error.message = '网络未实现'
                break;
            case 502:
                error.message = '网络错误'
                break;
            case 503:
                error.message = '服务不可用'
                break;
            case 504:
                error.message = '网络超时'
                break;
            case 505:
                error.message = 'http版本不支持该请求'
                break;
            default:
                error.message = `连接错误${error.response.status}`
        }
    } else {
        // 超时处理
    if (JSON.stringify(error).includes('timeout')) {
        message.error('服务器响应超时，请刷新当前页')
      }
      error.message('连接服务器失败')
    }
    message.error(error.message)
    return Promise.reject(error);
});

export function get(url, querParams) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: querParams
        })
        .then(res => {
            resolve(res.data)
        })
        .catch(err => {
            reject(err)
        })
    })
}

export function post(url, postData) {
    return new Promise((resolve, reject) => {
        axios.post(url, qs.stringify(postData))
        .then(res => {
            resolve(res.data)
        })
        .catch(err => {
            reject(err.data)
        })
    })
}