<template>
    <div class="updateUser">
        <div class="updateUserForm">
            <header-title :iflag="false">修改用户</header-title>
            <el-form :model="updateUserRuleForm" :rules="updateUserRolerules" ref="updateUserForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input type="text" v-model="updateUserRuleForm.username" auto-complete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roleid">
                    <el-select v-model="updateUserRuleForm.roleid">
                        <el-option :label="item.cname" :value="item.roleid" :key="index" v-for="(item,index) in rolelists"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电子邮箱">
                    <el-input type="text" v-model="updateUserRuleForm.email" auto-complete="off" @blur="validateByemail(updateUserRuleForm.email)"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input type="text" v-model="updateUserRuleForm.phone" auto-complete="off" @blur="validateByTele(updateUserRuleForm.phone)"></el-input>
                </el-form-item>
                <el-form-item label="是否可用" prop="useable">
                    <el-radio-group v-model="updateUserRuleForm.useable">
                        <el-radio label="可用"></el-radio>
                        <el-radio label="不可用"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="close">取消</el-button>
                    <el-button @click="submitUpdateUser('updateUserForm')">确定</el-button>
                </el-form-item>
            </el-form>
       </div>
    </div>
</template>
<script>
    import HeaderTitle from "./common/title"
    import { validatByname ,validatBypassword,validatByEmail,validatByTele} from "../../../api/validat.js"
    export default {
        props:{
            userinfodesc:{
                type:Object
            },
            currentPage4:{
            }
        },
        data(){
                //验证用户名的合法性
                var  validateByUsername=(rule,value,callback)=>{
                        if(!value){
                           return  callback(new Error("请输入用户名!"))
                        }
                        if(!validatByname(value)){
                            callback(new Error("请输入数字,字母,'-','_',3-11位!"));
                        }else{
                            callback();
                        }
                }
                //验证角色的合法性
                var validateByRoleName=(rule,value,callback)=>{
                    if(!value){
                        return callback(new Error("请选择角色!"));
                    }else{
                        callback();
                    }
                }
                //验证电子邮箱的合法性
                var validateByEmail=(rule,value,callback)=>{
                     if(!value){
                         return callback(new Error("请输入电子邮箱!"));
                     }
                     if(!validatByEmail(value)){
                         callback(new Error("邮箱格式不正确!"));
                     }else{
                         callback();
                     }
                }
                //验证手机号的合法性
                var validateByTele=(rule,value,callback)=>{
                    if(!value){
                        return callback(new Error("请输入手机号码!"))
                    }
                    if(!validatByTele(value)){
                        callback(new Error("手机号码格式不正确!"))
                    }else{
                        callback();
                    }
                }
                //验证状态的合法性
                var validateByabled=(rule,value,callback)=>{
                    if(!value){
                        return callback(new Error("请选择状态!"))
                    }else{
                        callback();
                    }
                }
            return {
                updateUserRuleForm:{
                        username:"",
                        roleid:"",
                        email:"",
                        phone:"",
                        useable:""
                },
                updateUserRolerules:{
                        username:{required:true, trigger: 'blur',validator:validateByUsername},
                        roleid:{required:true, trigger: 'change',validator:validateByRoleName},
                        email:{required:true, trigger: 'blur',validator:validateByEmail},
                        phone:{required:true, trigger: 'blur',validator:validateByTele},
                        useable:{required:true, trigger: 'change',validator:validateByabled}
                },
                rolelists:[]
            }
        },
        created(){
            this.initUpdateinfo();
            this.getRoleInfo();
        },
        components:{
            HeaderTitle
        },
        methods:{
            close(){
                this.$emit("updateUserClose");
            },
            //获取所有的角色信息,roleid,rolename;
            getRoleInfo(){
                    let self = this;
                    let token=self.$cookie.get("SESSION_IDENTITY_KEY") || "";
                    this.$axios.defaults.headers.common['token'] = token;
                    const params = {
                        "action":"getAuthRoleList",
                        "rolename":"",
                        "pageNo":1
                    }
                    this.$axios.post("/rest",params).then(res=>{
                        let data = res.data;
                        if(data.code == 200){
                            var lists = data.data.list;
                            lists.forEach((item,index)=>{
                                 var obj = {};
                                 obj.rolename = item.rolename;
                                 obj.roleid = item.roleid;
                                 obj.cname = item.cname;
                                 self.rolelists.push(obj);
                            });
                            console.log("updateUserRuleForm")
                            console.log(self.rolelists)
                        }else{
                            self.errMessage(data.msg_zh,"error");
                        }
                    }).catch(error=>{
                        console.log(error)
                        self.errMessage("请求出错了!","error");
                    })
            },
            errMessage(message,type){
                this.$message({
                    message:message,
                    type:type
                })
            },
            //在修改页面出现的时候，给修改页面的数据初始化
            initUpdateinfo(){
                var useable="";
                if(this.userinfodesc.useable==1){
                    useable="可用";
                }else if(this.userinfodesc.useable==0){
                    useable="不可用";
                }
                for(var i in this.userinfodesc){
                    this.updateUserRuleForm[i]=this.userinfodesc[i];
                }
                this.updateUserRuleForm["useable"]=useable;
            },
            //修改用户信息，提交数据
            submitUpdateUser(userinfo){
                    let self = this;
                    this.$refs[userinfo].validate(valid=>{
                        if(valid){
                            let token=self.$cookie.get("SESSION_IDENTITY_KEY") || "";
                            this.$axios.defaults.headers.common['token'] = token;
                            var useable=0;
                            if(self.updateUserRuleForm.useable=="可用"){
                                    useable=1;
                            }else{
                                    useable=0;
                            }
                            var phone = self.updateUserRuleForm.phone || "";
                            var email = self.updateUserRuleForm.email || "";
                            const updateinfo = {
                                "action":"editAuthUser",
                                "id":self.updateUserRuleForm.id,//用户id，必填
                                "username":self.updateUserRuleForm.username,//用户名，必填
                                "roleid":self.updateUserRuleForm.roleid,//角色id，必填
                                "useable":useable,//状态，必填
                                "phone":phone,//用户手机号码，非必填
                                "email":email//用户邮箱，非必填
                            }
                            console.log(updateinfo)
                            self.$axios.post("/rest",updateinfo).then(res=>{
                                var data = res.data;
                                if(data.code == 200){
                                    console.log(data)
                                    self.errMessage(data.msg_zh,"success");
                                    self.$emit("updategetInfo",self.currentPage4);
                                    self.close();
                                }else{
                                    self.errMessage(data.msg_zh,"error")
                                }
                            }).catch(error=>{
                                console.log(error)
                                self.errMessage("请求出错了!","error")
                            })
                        }else{
                            self.errMessage("验证不通过!","error")
                        }
                    })
            },
            //验证电子邮箱
            validateByemail(email){
                    if(!email){
                        return  this.errMessage("请输入电子邮箱!","error");
                    }
                    if(!validatByEmail(email)){
                        this.errMessage("邮箱格式不正确!","error");
                    }
            },
            //验证手机号的合法性
            validateByTele(value){
                if(!value){
                    return this.errMessage("请输入手机号码!","error");
                }
                if(!validatByTele(value)){
                    this.errMessage("手机号码格式不对!","error",2000);
                }
            }
        }
    }
</script>
<style scoped>
    .updateUser{width:100%;height:100%;position:fixed;top:0;left:0;background:rgba(0,0,0,.8);z-index:2000}
    .updateUserForm{width:500px;height:auto;background:#FFF;position:absolute;left:50%;top:20%;margin-left:-250px;padding:10px 0;border-radius:10px;}
    .el-input,.el-input__inner{width:90%;}
    .el-select{width:90%;}
</style>