import axios from 'axios'
import router from '../router'
import {ElMessage} from "element-plus";

axios.interceptors.request.use(
    function (config) {
        const tokenStr = localStorage.getItem("user");
        if (tokenStr) {
            try {
                const tokenObj = JSON.parse(tokenStr);
                const jwt = tokenObj.userInfo.jwt;
                if (jwt) {
                    config.headers["Authorization"] = jwt;
                }
            } catch (error) {
                console.error("Failed to parse token from localStorage:", error);
            }
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);
axios.interceptors.response.use(
    function (response) {
        const data = response.data;
        if(data.code === 401) {
            // 清理 token
            localStorage.removeItem("user");
            // 重定向到登陆页面
            router.push('/common/login');
            ElMessage.error("登录信息已失效，请重新登录");
            return Promise.reject(new Error("登录信息已失效，请重新登录"));
        }
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
)


export default axios

