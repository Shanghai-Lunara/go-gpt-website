import axios from 'axios'
import {message} from 'ant-design-vue'
import qs from 'qs'
import {Loading} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import _ from 'lodash'

// 创建新的axios实例
// const service = axios.create({
//     baseURL: 'http://192.168.16.202:8088',
//     timeout: 3000,
// })

axios.defaults.baseURL= process.env.VUE_APP_URL;
axios.defaults.timeout= 10000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// loading 对象
let loading;

// 显示loading
function startLoading() {
    loading = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        fullscreen: true,
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

// function endLoading() {
//     loading.close();
// }

// 当前请求数量
let needLoadingCount = 0;

export function showLoading() {
    if (needLoadingCount === 0) {
        startLoading();
    }
    needLoadingCount++;
}

export function hideLoading() {
    if (needLoadingCount <= 0) {
        return;
    }

    needLoadingCount--;

    if (needLoadingCount === 0) {
        _.debounce(tryCloseLoading, 300) ()
        // endLoading();
    }
}

const tryCloseLoading = () => {
    if (needLoadingCount === 0) {
      loading.close()
    }
  }


// 请求拦截器  配置loading
axios.interceptors.request.use(config => {
    // config.data = JSON.stringify(config.data);
    config.headers = {
        'Content-Type':'application/x-www-form-urlencoded'
    }
    showLoading();
    return config
}, error => {
    Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use(response => {
// Do something before response is sent
    if (response.status === 200) {
        hideLoading();
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
      message.error('连接服务器失败')
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