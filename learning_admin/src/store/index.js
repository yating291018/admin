import Vue from "vue"
import Vuex from "vuex";
import Cookie from "js-cookie"
Vue.use(Vuex);
export default new Vuex.Store({
    state:{
        "token":""
    },
    mutations:{
        GET_TOKEN(state){
              var token = Cookie.get("SESSION_IDENTITY_KEY") || "";
              state.token = token;
        }
    },
    actions:{

    },
    getters:{

    }
})