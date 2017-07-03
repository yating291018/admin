<template>
    <div class="userinfo">
           <header-title>个人账号</header-title> 
           <div class="userpage">
                <p>用户名:Alice</p>
                <p>邮箱:alice@learningbee.net</p>
                <p>角色:调研</p>
                <el-button type="primary" @click="updatepassword">个人密码修改</el-button>
           </div>
           <update-userinfo v-if="userinfoflag" @updatepass="updatepa"></update-userinfo>
    </div>
</template>
<script>
    import HeaderTitle from "./common/title"
    import UpdateUserinfo from "./updateuserinfo"
    export default {
        data(){
            return {
                userinfoflag:false
            }
        },
        components:{
            HeaderTitle,
            UpdateUserinfo
        },
        methods:{
            updatepassword(){
                this.userinfoflag=true;
            },
            updatepa(){
                this.userinfoflag=false;
            }
        }
    }
</script>
<style scoped>
 .userinfo{padding-top:20px;}
 .userpage{padding-left:60px;}
</style>