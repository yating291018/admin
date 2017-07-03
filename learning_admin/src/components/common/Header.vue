<template>
    <div class="header">
        <div class="logo">后台管理系统</div>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" src="../../../static/img/img.jpg">
                    {{username}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="person">个人中心</el-dropdown-item>
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                name: '管理员'
            }
        },
        computed:{
            username(){
                let userpass =JSON.parse(localStorage.getItem('userinfo'));
                return userpass ? userpass.username : this.name;
            }
        },
        methods:{
            handleCommand(command) {
                if(command == 'loginout'){
                    // localStorage.removeItem('ms_username')
                    //点击退出的时候，清除cookie里面的信息,路由到登陆页面
                    let self = this;
                    let token=self.$cookie.get("SESSION_IDENTITY_KEY") || "";
                    this.$axios.defaults.headers.common['token'] = token;
                    this.$confirm('确认退出吗？')
                    .then(_ => {
                        self.$axios.post("/rest",{"action":"logout"}).then(res=>{
                            const data=res.data;
                            if(data.code==200){
                                self.$cookie.remove("userpass");
                                self.$cookie.remove("SESSION_IDENTITY_KEY");
                                localStorage.removeItem("userinfo");
                            }else{
                                self.errmessage(data.msg_zh);
                            }
                            self.$router.push('/login');
                        }).catch(error=>{
                            console.log(error);
                            self.errmessage("请求出错了！")
                        })
                        done();
                    })
                    .catch(_ => {});
                    
                }else if(command == "person"){
                    this.$router.push("/index");
                }
            },
            //错误信息
            errmessage(message){
                this.$message({
                    message:message,
                    type:"warning"
                })
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
        background-color:#283c56;
    }
    .header .logo{
        float: left;
        width:250px;
        padding-left:20px;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
