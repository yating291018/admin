<template>
    <div class="updatePassword">
            <div class="updatepass">
                <header-title :iflag="false">修改个人密码</header-title>
                <el-form :model="updatePassData" :rules="updatePassRule" ref="updatepassForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="新密码" prop="newpass">
                        <el-input type="text" v-model="updatePassData.newpass" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确定密码" prop="checkPass">
                        <el-input type="text" v-model="updatePassData.checkPass" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button  @click="updatepassclose">取消</el-button>
                        <el-button type="primary" @click="updatePassForm('updatepassForm')">确定</el-button>
                    </el-form-item>
                </el-form>
            </div>
    </div>
</template>
<script>
    import HeaderTitle from "./common/title"
    import {validatBypassword} from "../../../api/validat.js"
    export default {
        props:["userinfoData"],
        data(){
                var validatenewPass = (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入密码!'));
                    } else {
                        if (!validatBypassword(value)) {
                           callback(new Error("请输入6-16位,不能有空格!"))
                        }else{
                           callback();
                        }
                    }
                };
                var validateconfirmPass = (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请再次输入密码'));
                    } else if (value != this.updatePassData.newpass) {
                        callback(new Error('两次输入密码不一致!'));
                    } else {
                        callback();
                    }
                };
                return {
                    updatePassData: {
                        newpass: '',
                        checkPass: ''
                    },
                    updatePassRule: {
                        newpass: [
                            { validator: validatenewPass, trigger: 'blur',required:true }
                        ],
                        checkPass: [
                            { validator: validateconfirmPass, trigger: 'blur' ,required:true}
                        ]
                    },

                };
            },
            components:{
                HeaderTitle
            },
            methods:{
                updatepassclose(){
                    this.$emit("updatepass")
                },
                //修改个人密码
                updatePassForm(updatepassForm){
                        let self = this;
                        let token=self.$cookie.get("SESSION_IDENTITY_KEY") || "";
                        this.$axios.defaults.headers.common['token'] = token;
                        this.$refs[updatepassForm].validate(valid=>{
                            if(valid){
                                const updatepassparms = {
                                     "action":"editAuthUserPasswd",
                                     "id":self.userinfoData.id,//用户id，必填
                                     "password":self.updatePassData.newpass,//密码，必填
                                     "pwdRepeat":self.updatePassData.checkPass//确认密码，必填
                                }
                                self.$axios.post("/rest",updatepassparms).then(res=>{
                                    var data = res.data;
                                    if(data.code==200){
                                        self.errMessage("密码修改成功!","success");
                                        self.updatepassclose();
                                        self.logout();
                                    }else{
                                        self.errMessage(data.msg_zh,"error");
                                    }
                                }).catch(error=>{
                                    console.log(error);
                                    self.errMessage("请求出错了!","error");
                                })
                            }else{
                                    self.errMessage("验证不通过!","error");
                            }
                        })
                },
                errMessage(message,type,time){
                    time = time || 2000;
                    this.$message({
                        message:message,
                        type:type,
                        duration:time
                    })
                },
                //退出登陆
                logout(){
                        let token=self.$cookie.get("SESSION_IDENTITY_KEY") || "";
                        this.$axios.defaults.headers.common['token'] = token;
                        this.$axios.post("/rest",{"action":"logout"}).then(res=>{
                            const data=res.data;
                            if(data.code==200){
                                this.$cookie.remove("userpass");
                                this.$cookie.remove("SESSION_IDENTITY_KEY");
                                localStorage.removeItem("userinfo");
                            }else{
                                this.errmessage(data.msg_zh);
                            }
                            this.$router.push('/login');
                        }).catch(error=>{
                            console.log(error);
                            this.errmessage("请求出错了！")
                        })
                }
            }
    }
</script>
<style scoped>
    .updatePassword{width:100%;height:100%;position:fixed;top:0;left:0;background:rgba(0,0,0,.8);z-index:2000}
    .updatepass{width:500px;height:auto;background:#FFF;position:absolute;left:50%;top:35%;margin-left:-250px;padding:10px 0;border-radius:10px;}
    .el-input, .el-input__inner{width:90%;}
</style>