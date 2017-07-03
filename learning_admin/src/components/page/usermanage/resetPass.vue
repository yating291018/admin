<template>
    <div class="restPass">
        <div class="restpass">
                <header-title :iflag="false">重置密码</header-title>
                <el-form :model="resetPassData" :rules="resetPassRule" ref="resetpassForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="新密码" prop="newpass">
                        <el-input type="text" v-model="resetPassData.newpass" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确定密码" prop="checkPass">
                        <el-input type="text" v-model="resetPassData.checkPass" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="resetpassclose">取消</el-button>
                        <el-button @click="resetPassForm('resetpassForm')">确定</el-button>
                    </el-form-item>
                </el-form>
          </div>
    </div>
</template>
<script>
    import HeaderTitle from "./common/title"
    import {validatBypassword} from "../../../api/validat.js"
    export default {
        props:["resetuserpassid"],
        data(){
             var validatenewPass = (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入密码!'));
                    } else {
                        if (!validatBypassword(value)) {
                           return callback(new Error("请输入数字,字母,'-','_',6-16位!"))
                        }
                        callback();
                    }
                };
                var validateconfirmPass = (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请再次输入密码'));
                    } else if (value != this.resetPassData.newpass) {
                        callback(new Error('两次输入密码不一致!'));
                    } else {
                        callback();
                    }
                };
                return {
                    resetPassData: {
                        newpass: '',
                        checkPass: ''
                    },
                    resetPassRule: {
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
            resetpassclose(){
                this.$emit("resetclose")
            },
            resetPassForm(resetpassForm){
                var self = this;
                this.$refs[resetpassForm].validate(valid=>{
                    if(valid){
                        let token=self.$cookie.get("SESSION_IDENTITY_KEY") || "";
                        this.$axios.defaults.headers.common['token'] = token;
                        const resetinfo = {
                            "action":"resetAuthUserPwd",
                            "id":self.resetuserpassid,//用户id，必填
                            "password":self.resetPassData.newpass,//密码，必填
                            "pwdRepeat":self.resetPassData.checkPass//确认密码，必填
                        }
                        self.$axios.post("/rest",resetinfo).then(res=>{
                            var data = res.data;
                            if(data.code == 200){
                                self.errorMessage(data.msg_zh,"success");
                                self.resetpassclose();
                            }else{
                                self.errorMessage(data.msg_zh,"error");
                            }

                        }).catch(error=>{
                            console.log(error)
                            self.errorMessage("请求错误!","error");
                        })
                    }else{
                        self.errorMessage("验证不通过!","error");
                    }
                })
            },
            errorMessage(message,type,time){
                time = time || 2000;
                this.$message({
                    message:message,
                    type:type,
                    duration:time
                })
            }
        }
    }
</script>
<style scoped>
    .restPass{width:100%;height:100%;position:fixed;top:0;left:0;background:rgba(0,0,0,.8);z-index:2000}
    .restpass{width:500px;height:auto;background:#FFF;position:absolute;left:50%;top:35%;margin-left:-250px;padding:10px 0;border-radius:10px;}
    .el-input, .el-input__inner{width:90%;}
</style>