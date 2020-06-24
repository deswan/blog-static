import * as axios from 'axios'

let options = {}
// The server-side needs a full url to works
if (process.env.VUE_ENV === 'server') {
  options.baseURL = `http://${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 3000}`
}
// options.baseURL = "http://nodet.cn:3005/"

axios.defaults.timeout = 10000;

axios.interceptors.response.use((res) => {
  if (res.status >= 200 && res.status < 300) {
    return res;
  }
  return Promise.reject(res);
}, (error) => {
  // 网络异常
  return Promise.reject({message: '网络异常，请刷新重试', err: error, type: 1});
});

export default axios.create(options)