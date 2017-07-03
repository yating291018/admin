<template>
    <div class="login-wrap">
        <div class="ms-title">LearningBee后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-checkbox label="记住密码" name="type" style="margin-bottom:10px" v-model="ruleForm.check"></el-checkbox>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {validatByname , validatBypassword} from "../../api/validat.js"
    export default {
        data: function(){
            var validateByname=function(rule, value, callback){
                    if(!validatByname(value)){
                        callback(new Error("请输入正确的用户名,数字,字母,'-','_',3-11位！"));
                    }else{
                        callback();
                    }
            }
            var validateBypass=function(rule,value,callback){
                    if(!validatBypassword(value)){
                        callback(new Error("请输入密码,6-16位,不能有空格!"))
                    }else{
                        callback();
                    }
            }
            return {
                ruleForm: {
                    username: '',
                    password: '',
                    check:""
                },
                rules: {
                    username: [
                        { required: true,trigger: 'blur',validator:validateByname }//
                    ],
                    password: [
                        { required: true,trigger: 'blur',validator:validateBypass}//
                    ]
                }
            }
        },
        created(){
           this.remember();
        },
        methods: {
            submitForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        let token=self.$cookie.get("SESSION_IDENTITY_KEY") || "";
                        this.$axios.defaults.headers.common['token'] = token;
                        let parms={
                             "action":"userLogin",
                             "username": this.ruleForm.username, 
                             "password":this.ruleForm.password
                        }
                        this.$axios.post("/rest",parms).then(res=>{
                            var data=res.data;
                            console.log(data)
                            if(data.code==200){
                                self.$cookie.set("SESSION_IDENTITY_KEY",data.data.token);
                                localStorage.setItem("userinfo",JSON.stringify({username:this.ruleForm.username}));
                                if(self.ruleForm.check){
                                    let date=new Date();
                                    date.setTime(date.getTime()+10*1000);
                                    self.$cookie.set("userpass",{username:this.ruleForm.username,password:this.ruleForm.password},{ expires: date });
                                }else{
                                    self.$cookie.remove("userpass");
                                }
                                localStorage.setItem("menulist",JSON.stringify(data.data.menuList));
                                localStorage.setItem("userInfos",JSON.stringify(data.data.userInfo));
                                self.$router.push({path:'/index',query:{menuList:data.data.menuList}});
                            }else if(data.code == 401){
                                this.errmessage(data.msg_zh,"error");
                                self.$router.push("/");
                            }else{
                                this.errmessage(data.msg_zh,"error");
                            }
                        }).catch(error=>{
                            this.errmessage("请求出错了！","error");
                            console.log(error)
                        })
                    } else {
                        this.errmessage("验证不通过！","warning");;
                        return false;
                    }
                });
            },
            //还有几次机会
            count(message){
                    let errcout = localStorage.getItem("errcout") || 0;
                    errcout++;
                    if(this.errcout>5){
                        this.$message({
                                message:"请联系管理员!",
                                type: 'warning'
                        });
                    }else{
                        this.$message({
                                message:message+"还有"+(5-this.errcout+"次机会！"),
                                type: 'warning'
                        });
                    }
            },
            //错误提示信息
            errmessage(message,type){
                  this.$message({
                        message:message,
                        type: type
                  });  
            },
            //在初始话加载的时候，从cookie里面去取用户的信息,展示在页面上,做记住密码功能
            remember(){
                const userpass=this.$cookie.getJSON("userpass");
                if(userpass){
                    this.ruleForm.username=userpass.username;
                    this.ruleForm.password=userpass.password;
                    this.ruleForm.check=true;
                }else{
                    this.ruleForm.username="";
                    this.ruleForm.password="";
                    this.ruleForm.check=false;
                }
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background:#2d3a4b;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>