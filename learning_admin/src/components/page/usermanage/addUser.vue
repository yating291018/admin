<template>
  <div class="addUser">
       <div class="addForm">
            <header-title :iflag="false">添加用户</header-title>
            <el-form :model="addUserRuleForm" :rules="addUserRolerules" ref="addUserForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input type="text" v-model="addUserRuleForm.username" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roleid">
                    <el-select v-model="addUserRuleForm.roleid" placeholder="请选择角色">
                      <el-option :label="item.cname" :value="item.roleid" :key="index" :roleid="item.roleid" v-for="(item,index) in addUserRuleForm.rolelists"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="登陆密码" prop="password">
                    <el-input type="password" v-model="addUserRuleForm.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirpassword">
                    <el-input type="password" v-model="addUserRuleForm.confirpassword" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱">
                    <el-input type="text" v-model="addUserRuleForm.email" auto-complete="off" @blur="validateByemail(addUserRuleForm.email)"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input type="text" v-model="addUserRuleForm.tele" auto-complete="off" @blur="validateByTele(addUserRuleForm.tele)"></el-input>
                </el-form-item>
                <el-form-item label="是否可用" prop="abled">
                    <el-radio-group v-model="addUserRuleForm.abled">
                        <el-radio label="可用" ></el-radio>
                        <el-radio label="不可用" ></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="close">取消</el-button>
                    <el-button @click="submitAddUser('addUserForm')">确定</el-button>
                </el-form-item>
            </el-form>
       </div>
  </div>
</template>
<script>
    import HeaderTitle from "./common/title"
    import { validatByname ,validatBypassword,validatByEmail,validatByTele} from "../../../api/validat.js"
    export default {
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
                var validateByRoleid=(rule,value,callback)=>{
                    if(!value){
                        return callback(new Error("请选择角色!"));
                    }else{
                        callback();
                    }
                }
                //验证密码的合法性
                var validateByPassword=(rule,value,callback)=>{
                    if(!value){
                        return callback(new Error("请输入密码!"))
                    }
                    if(!validatBypassword(value)){
                        callback(new Error("密码为数字,字母,6-16位,不能有空格!"))
                    }else{
                        callback();
                    }
                }
                //验证确认密码的合法性
                var validateByConfirmPassword=(rule,value,callback)=>{
                    if(this.addUserRuleForm.password != value){
                        return callback(new Error("两次密码不一致!"))
                    }else{
                        callback();
                    }
                }
                //验证状态的合法性
                var validateByuseable=(rule , value ,callback)=>{
                    if(!value){
                        return callback(new Error("请选择状态!"));
                    }else{
                        callback();
                    }
                }
                
                return {
                    addUserRuleForm:{
                        username:"",
                        roleid:"",
                        password:"",
                        confirpassword:"",
                        email:"",
                        tele:"",
                        abled:"可用",
                        //角色的list
                        rolelists:[]
                    },
                    addUserRolerules:{
                        username:{required:true, trigger: 'blur',validator:validateByUsername},
                        roleid:{required:true, trigger: 'change',validator:validateByRoleid},
                        password:{required:true, trigger: 'blur',validator:validateByPassword},
                        confirpassword:{required:true, trigger: 'blur',validator:validateByConfirmPassword},
                        email:{required:true, trigger: 'blur'},
                        tele:{required:true, trigger: 'blur'},
                        abled:{required:true, trigger: 'change',validator:validateByuseable}
                    }
                }
            },
            components:{
                HeaderTitle
            },
            created(){
                this.getRoleInfo();
            },
            methods:{
                //点击取消隐藏增加用户页面
                close(){
                    this.$emit("closeAddUser")
                },
                submitAddUser(addUserForm){
                    let self = this;
                    this.$refs[addUserForm].validate(valid=>{
                        if(valid){
                            let token=self.$cookie.get("SESSION_IDENTITY_KEY") || "";
                            this.$axios.defaults.headers.common['token'] = token;
                            var useable = self.addUserRuleForm.abled;
                            if(useable == "可用"){
                                useable=1;
                            }else if(useable == "不可用"){
                                useable=0;
                            }
                            self.validateByRoleid(self.addUserRuleForm.roleid);
                            const addUserparms = {
                                "action":"addAuthUser",
                                "username":self.addUserRuleForm.username,
                                "roleid":self.addUserRuleForm.roleid,
                                "password":self.addUserRuleForm.password,
                                "pwdRepeat":self.addUserRuleForm.confirpassword,
                                "email":self.addUserRuleForm.email,
                                "phone":self.addUserRuleForm.tele,
                                "useable":useable
                            }
                            this.$confirm('再次确认信息!')
                            .then(_ => {
                                self.$axios.post("/rest",addUserparms).then(res=>{
                                    let data = res.data;
                                    if(data.code == 200){
                                        self.errMessage(res.data.msg_zh,"success");
                                        self.$emit("getUserinfos");
                                        self.close();
                                    }else{
                                        self.errMessage(res.data.msg_zh,"error");
                                    }
                                }).catch(error=>{
                                    console.log(error)
                                    self.errMessage("请求出错了!","error");
                                })
                                done();
                            })
                            .catch(_ => {});
                        }else{
                            self.errMessage("验证不通过!","error");
                        }
                    })
                },
                //错误信息
                errMessage(message,type,time){
                     time = time || 3000;
                     this.$message({
                         message:message,
                         type:type,
                         duration:time
                     })
                },
                //获取所有的角色信息,roleid,rolename;
                getRoleInfo(){
                    let self = this;
                    const sessionId = this.$cookie.get("SESSION_IDENTITY_KEY") || "";
                    const params = {
                        "action":"getAuthRoleList",
                        "sessionId":sessionId,
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
                                 self.addUserRuleForm.rolelists.push(obj);
                            });
                        }else{
                            self.errMessage(data.msg_zh,"error");
                        }
                    }).catch(error=>{
                        console.log(error)
                        self.errMessage("请求出错了!","error");
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
                },
                //角色的合法性
                validateByRoleid(value){
                    if(!value){
                        return this.errMessage("请选择角色!","error");
                    }
                }
            }
    }
</script>
<style scoped>
    .addUser{width:100%;height:100%;position:fixed;top:0;left:0;background:rgba(0,0,0,.8);z-index:2000}
    .addForm{width:500px;height:auto;background:#FFF;position:absolute;left:50%;top:20%;margin-left:-250px;padding:10px 0;border-radius:10px;}
    .el-input,.el-input__inner{width:90%;}
    .el-select{width:90%;}
</style>