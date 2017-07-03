import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import store from "./store"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';    // 默认主题
//import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import $ from "./assets/js/jquery-3.2.1.min.js"
import Cookie from "js-cookie"

Vue.use(ElementUI);
Vue.prototype.$cookie=Cookie;
var instance = axios.create({
    baseURL: 'http://192.168.12.31:8484',
    timeout: 5000
});
Vue.prototype.$axios = instance;
router.beforeEach((to,from,next)=>{
     let usernameinfo=JSON.parse(localStorage.getItem("userinfo"));
     if(usernameinfo){
            if(to.path != "/login"){
                next();
            }else{
                next(from.path);
            }
      }else{
           if(to.path =="/login"){
               next();
            }else{
               next("/login");
            }
     }
})
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');