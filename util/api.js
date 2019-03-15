
import axios from 'axios';

if(process.server){
    axios.defaults.baseURL = `http://${process.env.API_SERVICE_HOST || '127.0.0.1'}:3000`;
}
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

export default axios;