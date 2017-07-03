<template>
    <div class="addrole">
        <div class="addForm">
            <header-title :iflag="false">添加角色</header-title>
            <el-form :model="addRuleForm" :rules="addRolerules" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="rolename">
                    <el-input type="text" v-model="addRuleForm.rolename" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色昵称" prop="cusername">
                    <el-input type="text" v-model="addRuleForm.cusername" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="close">取消</el-button>
                    <el-button @click="submitAddRole('ruleForm2')">确定</el-button>
                </el-form-item>
            </el-form>
       </div>
    </div>
</template>
<script>
   import HeaderTitle from "./common/title"
   import {  validatByname ,validatByCName } from "../../../api/validat.js"
   export default {
        data(){
            var checkRoleName = (rule, value, callback) => {
                if (!value) {
                   return callback(new Error('角色名不能为空!'));
                }
                if(!validatByname(value)){
                    callback(new Error("角色名称为数字,字母,'-','_'3-11位！"));
                }else{
                    callback();
                }
            };
            var validateEnName = (rule, value, callback) => {
                if(!value){
                    return callback(new Error("中文名称不能为空!"))
                }
                if (!validatByCName(value)) {
                    callback(new Error('输入2-11位中文名称,不能有空格!'));
                } else {
                    callback();
                }
            };
            return {
                addRuleForm: {
                    rolename: '',
                    cusername: ''
                },
                addRolerules: {
                    rolename: [
                        { required:true,validator: checkRoleName, trigger: 'blur'}
                    ],
                    cusername: [
                        { required:true,validator: validateEnName, trigger: 'blur' }
                    ]
                }
        };
     },
     components:{
       HeaderTitle
     },
     methods:{
         close(){
            this.$emit("close")
         },
         //添加角色
         submitAddRole(ruleForm){
             let self=this;
             this.$refs[ruleForm].validate(valid=>{
                 if(valid){
                    let token=self.$cookie.get("SESSION_IDENTITY_KEY") || "";
                    this.$axios.defaults.headers.common['token'] = token;
                    const znameEname= {
                        "action":"addAuthRole",
                        "rolename":self.addRuleForm.rolename,//角色名，必填
                        "cname":self.addRuleForm.cusername //角色名称
                    }
                    this.$confirm('请再次确认角色信息？')
                    .then(_ => {
                        self.$axios.post("/rest",znameEname).then(res=>{
                            let data=res.data;
                            if(data.code==200){
                                self.errmessage("添加角色成功!","success");
                                self.$emit("reloadRole");
                                self.close();
                            }else{
                                self.errmessage(data.msg_zh,"error");
                            }
                        }).catch(error=>{
                            console.log(error);
                            self.errmessage("请求出错!","error");
                        })
                        done();
                    })
                    .catch(_ => {});
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
         }
     }
}
</script>
<style scoped>
    .addrole{width:100%;height:100%;position:fixed;top:0;left:0;background:rgba(0,0,0,.8);z-index:2000}
    .addForm{width:500px;height:auto;background:#FFF;position:absolute;left:50%;top:35%;margin-left:-250px;padding:10px 0;border-radius:10px;}
    .el-input, .el-input__inner{width:90%;}
</style>