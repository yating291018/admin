<template>
    <div class="updateRole">
        <div class="updateForm">
                <header-title :iflag="false">修改角色</header-title>
                <el-form :model="updateRole" :rules="updateRolerules" ref="updateRoleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="角色名称" prop="rolename">
                        <el-input type="text" v-model="updateRole.rolename" auto-complete="off" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="角色昵称" prop="cname">
                        <el-input type="text" v-model="updateRole.cname" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button  @click="updateclose">取消</el-button>
                        <el-button type="primary" @click="submitUpdateRole('updateRoleForm')">确定</el-button>
                    </el-form-item>
                </el-form>
        </div>
    </div>
</template>
<script>
    import HeaderTitle from "./common/title"
    import {validatByname , validatByCName } from "../../../api/validat.js"
    export default {
        props:["updateroleid","updaterolename","updateCName","pageNo"],
        data(){
                //验证角色名称是否符合要求
                var checkRolename = (rule, value, callback) => {
                    if (!value) {
                       return callback(new Error('角色名不能为空!'));
                    }
                    if(!validatByname(value)){
                        callback(new Error("角色名称为数字,字母,'-','_'3-11位！!"));
                    }else{
                        callback();
                    }
                };
                //验证英文名称是否符合要求
                var validateEnName = (rule, value, callback) => {
                    if(!value){
                       return callback(new Error("中文名称不能为空!"))
                    }
                    if (!validatByCName(value)) {
                        callback(new Error('输入2-11位中文,不能有空格!'));
                    } else {
                        callback();
                    }
                };
                return {
                    updateRole: {
                        rolename:this.updaterolename.trim(),
                        cname: this.updateCName.trim()
                    },
                    updateRolerules: {
                        rolename: [
                            { validator: checkRolename, trigger: 'blur' }
                        ],
                        cname: [
                            { validator: validateEnName, trigger: 'blur' }
                        ]
                    }
                };
            },
            components:{
                HeaderTitle
            },
            methods:{
                updateclose(){
                    this.$emit("updateClose");
                },
                //修改角色信息函数
                submitUpdateRole(ruleForm){
                    let self=this;
                    this.$refs[ruleForm].validate(valid=>{
                        if(valid){
                            let token=self.$cookie.get("SESSION_IDENTITY_KEY") || "";
                            this.$axios.defaults.headers.common['token'] = token;
                            const updateRoleInfo= {
                                "action":"editAuthRole",
                                "rolename":self.updateRole.rolename,//角色名，必填
                                "cname":self.updateRole.cname, //角色名称
                                "roleid":self.updateroleid,//角色id,必填
                            }
                            self.$axios.post("/rest",updateRoleInfo).then(res=>{
                                let data=res.data;
                                console.log(data)
                                if(data.code==200){
                                    self.errmessage("修改角色成功!","success");
                                    self.$emit("updateRoleinfo",self.pageNo);
                                    self.close();
                                }else{
                                    self.errmessage(data.msg_zh,"error");
                                }
                            }).catch(error=>{
                                console.log(error);
                                self.errmessage("请求出错了!","error");
                            })
                        }else{
                            self.errmessage("验证不通过!","error");
                        }
                    })
                },
                errmessage(message,type,time){
                    time=time || 3000;
                    this.$message({
                        message:message,
                        type:type,
                        duration:time
                    })
                },
                close(){
                    this.$emit("updateClose");
                }
            }
    }
</script>
<style scoped>
    .updateRole{width:100%;height:100%;position:fixed;top:0;left:0;background:rgba(0,0,0,.8);z-index:2000}
    .updateForm{width:500px;height:auto;background:#FFF;position:absolute;left:50%;top:35%;margin-left:-250px;padding:10px 0;border-radius:10px;}
    .el-input, .el-input__inner{width:90%;}
    .el-input__inner{text-indent:0;}
</style>